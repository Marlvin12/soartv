'use client'

import { useState, useEffect } from 'react'
import ModeSelect    from '@/components/onboarding/ModeSelect'
import PosterSurvey  from '@/components/onboarding/PosterSurvey'
import VoiceSurvey   from '@/components/onboarding/VoiceSurvey'
import AuthModal     from '@/components/auth/AuthModal'
import Building      from '@/components/Building'
import Home          from '@/components/home/Home'
import { useAuth }   from '@/context/AuthContext'
import { scoreResonance } from '@/lib/archetypes'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { SurveyAnswers, Answers } from '@/types'

type Scene = 'mode-select' | 'survey' | 'voice-survey' | 'auth' | 'building' | 'home'

const DEFAULT_ANSWERS: Answers = { firstPick: 'lakeshoreStatic', mood: 'curious', intensity: 'move' }

export default function Page() {
  const { user }                        = useAuth()
  const [scene, setScene]               = useState<Scene>('mode-select')
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswers | null>(null)
  const [answers, setAnswers]           = useState<Answers>(DEFAULT_ANSWERS)
  const [transitioning, setTrans]       = useState(false)
  const [authOpen, setAuthOpen]         = useState(false)

  // When user signs in during auth scene, save resonance profile and advance
  useEffect(() => {
    if (scene === 'auth' && user && surveyAnswers) {
      saveResonanceProfile(user.uid, surveyAnswers)
        .catch(console.error)
        .finally(() => goBuilding())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, scene])

  const goBuilding = () => {
    setTrans(true)
    setTimeout(() => { setScene('building'); setTrans(false) }, 400)
  }

  const onSurveyComplete = (sa: SurveyAnswers) => {
    setSurveyAnswers(sa)
    // Map survey answer to mood for home content
    setAnswers({ firstPick: sa.mood, mood: sa.mood, intensity: 'move' })
    if (user) {
      // Already signed in — save profile and go build
      saveResonanceProfile(user.uid, sa).catch(console.error)
      goBuilding()
    } else {
      setScene('auth')
      setAuthOpen(true)
    }
  }

  const onAuthClose = () => {
    // User closed modal without signing in — continue as guest
    setAuthOpen(false)
    goBuilding()
  }

  const skip = () => {
    setAnswers(DEFAULT_ANSWERS)
    goBuilding()
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

      {scene === 'survey' && (
        <div className={`scene${transitioning ? ' fading' : ''}`}>
          <PosterSurvey onComplete={onSurveyComplete} onSkip={skip} />
        </div>
      )}

      {scene === 'voice-survey' && (
        <div className={`scene${transitioning ? ' fading' : ''}`}>
          <VoiceSurvey
            onComplete={sa => {
              // VoiceSurvey returns old Answers shape — treat firstPick as mood proxy
              setAnswers(sa)
              setScene('auth')
              setAuthOpen(true)
            }}
            onSkip={skip}
            onSwitchToCards={() => setScene('survey')}
          />
        </div>
      )}

      {scene === 'auth' && (
        <AuthModal isOpen={authOpen} onClose={onAuthClose} />
      )}

      {scene === 'building' && <Building onDone={() => setScene('home')} />}

      {scene === 'home' && (
        <div className="scene">
          <Home answers={answers} onRetake={() => setScene('mode-select')} />
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
      updatedAt:     serverTimestamp(),
    },
    { merge: true }
  )
}
