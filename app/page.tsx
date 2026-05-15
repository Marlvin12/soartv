'use client'

import { useState } from 'react'
import ModeSelect   from '@/components/onboarding/ModeSelect'
import Onboarding   from '@/components/onboarding/Onboarding'
import VoiceSurvey  from '@/components/onboarding/VoiceSurvey'
import Building     from '@/components/Building'
import Home         from '@/components/home/Home'
import type { Answers } from '@/types'

type Scene = 'mode-select' | 'onboarding' | 'voice-survey' | 'building' | 'home'

const DEFAULT_ANSWERS: Answers = { firstPick: 'lakeshoreStatic', mood: 'curious', intensity: 'move' }

export default function Page() {
  const [scene, setScene]         = useState<Scene>('mode-select')
  const [answers, setAnswers]     = useState<Answers>(DEFAULT_ANSWERS)
  const [transitioning, setTrans] = useState(false)

  const complete = (a: Answers) => {
    setAnswers(a)
    setTrans(true)
    setTimeout(() => { setScene('building'); setTrans(false) }, 500)
  }

  const skip = () => complete(DEFAULT_ANSWERS)

  return (
    <div className="stage">
      {scene === 'mode-select' && (
        <div className="scene">
          <ModeSelect
            onSelect={mode => setScene(mode === 'voice' ? 'voice-survey' : 'onboarding')}
            onSkip={skip}
          />
        </div>
      )}

      {scene === 'onboarding' && (
        <div className={`scene ${transitioning ? 'fading' : ''}`}>
          <Onboarding onComplete={complete} onSkip={skip}/>
        </div>
      )}

      {scene === 'voice-survey' && (
        <div className={`scene ${transitioning ? 'fading' : ''}`}>
          <VoiceSurvey
            onComplete={complete}
            onSkip={skip}
            onSwitchToCards={() => setScene('onboarding')}
          />
        </div>
      )}

      {scene === 'building' && <Building onDone={() => setScene('home')}/>}

      {scene === 'home' && (
        <div className="scene">
          <Home answers={answers} onRetake={() => setScene('mode-select')}/>
        </div>
      )}
    </div>
  )
}
