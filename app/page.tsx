'use client'

import { useState, useEffect } from 'react'
import ResonanceJourney from '@/components/onboarding/ResonanceJourney'
import AuthModal      from '@/components/auth/AuthModal'
import Building       from '@/components/Building'
import Home           from '@/components/home/Home'
import InsightsReveal from '@/components/resonance/InsightsReveal'
import { useAuth }    from '@/context/AuthContext'
import { scoreResonance } from '@/lib/archetypes'
import type { ArchetypeId } from '@/lib/archetypes'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { SurveyAnswers, Answers, ResonanceProfile } from '@/types'

// Onboarding is one continuous Apple-style flow: ResonanceJourney walks the
// user through 6 alternating beats (Card · Voice · Card · Voice · Card · Card)
// before handing off to Auth (if needed) and Insights.
type Scene = 'journey' | 'auth' | 'insights' | 'building' | 'home'

const DEFAULT_ANSWERS: Answers = { firstPick: 'lakeshoreStatic', mood: 'curious', intensity: 'move' }

// Stored shape inside Firestore at users/{uid}/resonanceProfile/current.
// `updatedAt` is a Firestore Timestamp on read, not the `number` shape we use
// in the in-memory ResonanceProfile, so we type the read separately.
interface StoredResonanceProfile {
  archetype:        ResonanceProfile['archetype']
  secondary?:       ResonanceProfile['secondary']
  scores?:          ResonanceProfile['scores']
  surveyAnswers?:   SurveyAnswers
  entryArchetype?:  ArchetypeId
}

// Builds the in-memory resonance profile shown on the Insights reveal.
function buildProfile(sa: SurveyAnswers): ResonanceProfile {
  const r = scoreResonance(sa)
  return {
    archetype:     r.primary,
    secondary:     r.secondary,
    scores:        r.scores,
    surveyAnswers: sa,
    ...(sa.entry ? { entryArchetype: sa.entry } : {}),
    updatedAt:     Date.now(),
  }
}

export default function Page() {
  const { user, loading: authLoading }    = useAuth()
  const [scene, setScene]                 = useState<Scene>('journey')
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswers | null>(null)
  const [profile, setProfile]             = useState<ResonanceProfile | null>(null)
  // Archetype detected by the FilmFlow7 conversational entry (voice path only).
  const [entryArchetype, setEntryArchetype] = useState<ArchetypeId | null>(null)
  const [answers, setAnswers]             = useState<Answers>(DEFAULT_ANSWERS)
  const [transitioning, setTrans]         = useState(false)
  const [authOpen, setAuthOpen]           = useState(false)
  // Gate the initial render until we know whether the user already has a saved
  // resonance profile in Firestore. Without this guard, returning users would
  // see a flash of the onboarding journey before being redirected to /home.
  const [bootstrapped, setBootstrapped]   = useState(false)

  // ── Bootstrap on mount ────────────────────────────────────────────────────
  // The "/" route is a single-page scene machine — there is no separate /home.
  // When a returning user lands here (e.g. via the SoarTV back button on the
  // watch page), we need to short-circuit the journey if they've already
  // completed it. Source of truth: users/{uid}/resonanceProfile/current.
  useEffect(() => {
    if (authLoading || bootstrapped) return

    if (!user) {
      setBootstrapped(true)
      return
    }

    getDoc(doc(db, 'users', user.uid, 'resonanceProfile', 'current'))
      .then(snap => {
        if (snap.exists()) {
          const data = snap.data() as StoredResonanceProfile
          if (data.surveyAnswers) {
            setSurveyAnswers(data.surveyAnswers)
            setProfile({
              archetype:     data.archetype,
              secondary:     data.secondary,
              scores:        data.scores,
              surveyAnswers: data.surveyAnswers,
              ...(data.entryArchetype ? { entryArchetype: data.entryArchetype } : {}),
              updatedAt:     Date.now(),
            } as ResonanceProfile)
            // Map the saved mood pick to the legacy Answers shape for the home
            // shelves; fall back to defaults if the field is missing.
            setAnswers({
              firstPick: data.surveyAnswers.mood ?? DEFAULT_ANSWERS.firstPick,
              mood:      data.surveyAnswers.mood ?? DEFAULT_ANSWERS.mood,
              intensity: 'move',
            })
          }
          setScene('home')
        }
        setBootstrapped(true)
      })
      .catch(err => {
        console.error('Failed to load resonance profile, falling back to journey', err)
        setBootstrapped(true)
      })
  }, [authLoading, user, bootstrapped])

  // When the user signs in during the auth scene, save the profile and reveal Insights.
  useEffect(() => {
    if (scene === 'auth' && user && surveyAnswers) {
      saveResonanceProfile(user.uid, surveyAnswers).catch(console.error)
      goInsights()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, scene])

  const goInsights = () => {
    setTrans(true)
    setTimeout(() => { setScene('insights'); setTrans(false); window.scrollTo(0, 0) }, 400)
  }
  const goBuilding = () => {
    setTrans(true)
    setTimeout(() => { setScene('building'); setTrans(false) }, 400)
  }

  const onJourneyComplete = (sa: SurveyAnswers, entry: ArchetypeId | null) => {
    // ResonanceJourney emits both the four poster picks and the voice entry
    // archetype (or null if the voice steps were skipped / unmatched).
    const full: SurveyAnswers = entry ? { ...sa, entry } : sa
    setEntryArchetype(entry)
    setSurveyAnswers(full)
    setProfile(buildProfile(full))
    // Map the survey mood pick to the legacy Answers shape for home content.
    setAnswers({ firstPick: full.mood, mood: full.mood, intensity: 'move' })
    if (user) {
      saveResonanceProfile(user.uid, full).catch(console.error)
      goInsights()
    } else {
      setScene('auth')
      setAuthOpen(true)
    }
  }

  const onAuthClose = () => {
    // User closed the modal without signing in — still show their Insights.
    setAuthOpen(false)
    goInsights()
  }

  const skip = () => {
    setAnswers(DEFAULT_ANSWERS)
    goBuilding()
  }

  const retake = () => {
    setEntryArchetype(null)
    setSurveyAnswers(null)
    setProfile(null)
    setScene('journey')
  }

  // Hold a black canvas while we check Firestore for a saved profile. The
  // body background is already var(--bg) (#07070a), so this is invisible to
  // users who have no profile (auth still loading + no profile = instant
  // journey render). Only returning users see this brief beat.
  if (!bootstrapped) {
    return <div className="stage" aria-busy="true" />
  }

  return (
    <div className="stage">
      {scene === 'journey' && (
        <div className={`scene${transitioning ? ' fading' : ''}`}>
          <ResonanceJourney onComplete={onJourneyComplete} onSkip={skip} />
        </div>
      )}

      {scene === 'auth' && (
        <AuthModal isOpen={authOpen} onClose={onAuthClose} />
      )}

      {scene === 'insights' && profile && (
        <div className={`scene${transitioning ? ' fading' : ''}`}>
          <InsightsReveal profile={profile} onEnter={goBuilding} onRetake={retake} />
        </div>
      )}

      {scene === 'building' && <Building onDone={() => setScene('home')} />}

      {scene === 'home' && (
        <div className="scene">
          <Home answers={answers} onRetake={retake} />
        </div>
      )}
    </div>
  )
}

async function saveResonanceProfile(uid: string, sa: SurveyAnswers) {
  const result = scoreResonance(sa)
  await setDoc(
    doc(db, 'users', uid, 'resonanceProfile', 'current'),
    {
      archetype:     result.primary,
      secondary:     result.secondary,
      scores:        result.scores,
      surveyAnswers: sa,
      ...(sa.entry ? { entryArchetype: sa.entry } : {}),
      updatedAt:     serverTimestamp(),
    },
    { merge: true }
  )
}
