'use client'

import { useState, useEffect } from 'react'
import ModeSelect     from '@/components/onboarding/ModeSelect'
import PosterSurvey   from '@/components/onboarding/PosterSurvey'
import VoiceSurvey    from '@/components/onboarding/VoiceSurvey'
import AuthModal      from '@/components/auth/AuthModal'
import Building       from '@/components/Building'
import Home           from '@/components/home/Home'
import InsightsReveal from '@/components/resonance/InsightsReveal'
import { useAuth }    from '@/context/AuthContext'
import { scoreResonance } from '@/lib/archetypes'
import type { ArchetypeId } from '@/lib/archetypes'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { SurveyAnswers, Answers, ResonanceProfile } from '@/types'

type Scene = 'mode-select' | 'survey' | 'voice-survey' | 'auth' | 'insights' | 'building' | 'home'

const DEFAULT_ANSWERS: Answers = { firstPick: 'lakeshoreStatic', mood: 'curious', intensity: 'move' }

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
  const { user }                          = useAuth()
  const [scene, setScene]                 = useState<Scene>('mode-select')
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswers | null>(null)
  const [profile, setProfile]             = useState<ResonanceProfile | null>(null)
  // Archetype detected by the FilmFlow7 conversational entry (voice path only).
  const [entryArchetype, setEntryArchetype] = useState<ArchetypeId | null>(null)
  const [answers, setAnswers]             = useState<Answers>(DEFAULT_ANSWERS)
  const [transitioning, setTrans]         = useState(false)
  const [authOpen, setAuthOpen]           = useState(false)

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

  const onSurveyComplete = (sa: SurveyAnswers) => {
    // Fold in the conversational-entry signal when the voice path was taken.
    const full: SurveyAnswers = entryArchetype ? { ...sa, entry: entryArchetype } : sa
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
    setScene('mode-select')
  }

  return (
    <div className="stage">
      {scene === 'mode-select' && (
        <div className="scene">
          <ModeSelect
            onSelect={mode => setScene(mode === 'voice' ? 'voice-survey' : 'survey')}
            onSkip={skip}
          />
        </div>
      )}

      {scene === 'voice-survey' && (
        <div className={`scene${transitioning ? ' fading' : ''}`}>
          <VoiceSurvey
            onComplete={arch => {
              // FilmFlow7 entry done — carry the signature into the poster survey.
              setEntryArchetype(arch)
              setScene('survey')
            }}
            onSkip={skip}
            onSwitchToCards={() => setScene('survey')}
          />
        </div>
      )}

      {scene === 'survey' && (
        <div className={`scene${transitioning ? ' fading' : ''}`}>
          <PosterSurvey onComplete={onSurveyComplete} onSkip={skip} />
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
