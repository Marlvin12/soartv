'use client'

import { useState } from 'react'
import Icon from '@/components/Icon'
import Brand from '@/components/Brand'
import QuestionMovies from './QuestionMovies'
import QuestionMoods from './QuestionMoods'
import { MOOD_COPY, Q2_OPTIONS, Q3_OPTIONS } from '@/lib/catalog'
import type { Answers } from '@/types'

const STEPS = [
  { eyebrow: 'Step 1 of 3', title: 'Pick a film that resonates with you right now.', sub: 'No wrong answer. Go with whichever pulls.', key: 'firstPick' as const },
  { eyebrow: 'Step 2 of 3', title: 'How are you arriving tonight?', sub: "We'll tune the shelves to where you actually are, not where you wish you were.", key: 'mood' as const },
  { eyebrow: 'Step 3 of 3', title: 'How much do you want to feel?', sub: 'You can always change your mind.', key: 'intensity' as const },
]

interface Props {
  onComplete: (a: Answers) => void
  onSkip:     () => void
}

export default function Onboarding({ onComplete, onSkip }: Props) {
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState<Answers>({ firstPick: '', mood: '', intensity: '' })

  const cur = STEPS[step]
  const val = answers[cur.key]
  const set = (v: string) => setAnswers(a => ({ ...a, [cur.key]: v }))

  const next = () => {
    if (!val) return
    if (step < STEPS.length - 1) setStep(step + 1)
    else onComplete(answers)
  }

  return (
    <div className="onb">
      <div className="onb-top">
        <Brand/>
        <div className="onb-progress">
          {STEPS.map((_, i) => (
            <span key={i} className={i < step ? 'done' : i === step ? 'active' : ''}/>
          ))}
        </div>
        <button className="onb-skip" onClick={onSkip}>Skip for now</button>
      </div>

      <div className="onb-body">
        <div className="onb-eyebrow">{cur.eyebrow}</div>
        <h1 className="onb-title">{cur.title}</h1>
        <p className="onb-sub">{cur.sub}</p>

        {step === 0 && <QuestionMovies value={val || null} onChange={set}/>}
        {step === 1 && <QuestionMoods options={Q2_OPTIONS} value={val || null} onChange={set}/>}
        {step === 2 && <QuestionMoods options={Q3_OPTIONS} value={val || null} onChange={set} columns={3}/>}

        <div className="onb-cta">
          {step > 0 && (
            <button className="back" onClick={() => setStep(step - 1)}>
              <Icon name="arrowL" size={14}/> Back
            </button>
          )}
          <button className="next" disabled={!val} onClick={next}>
            {step < STEPS.length - 1 ? 'Continue' : 'Build my night'}
            <Icon name="arrowR" size={14}/>
          </button>
        </div>
      </div>
    </div>
  )
}
