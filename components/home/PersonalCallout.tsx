'use client'

import { MOVIES, MOOD_COPY } from '@/lib/catalog'
import type { Answers } from '@/types'

const INTENSITY_COPY: Record<string, string> = {
  company: 'easy company, nothing too taxing',
  move:    "something you'll remember",
  wreck:   "films that won't let you go",
}

interface Props { answers: Answers }

export default function PersonalCallout({ answers }: Props) {
  const moodInfo   = MOOD_COPY[answers.mood]
  const intensity  = INTENSITY_COPY[answers.intensity] ?? ''
  const firstPick  = MOVIES[answers.firstPick]

  return (
    <div className="personal-callout">
      <div className="orbital"/>
      <div className="text">
        <div className="l1">Tuned for tonight</div>
        <div className="l2">
          You picked <b>{firstPick?.title || 'a film'}</b>, you&apos;re{' '}
          <b>{moodInfo?.label?.toLowerCase()}</b>, and you want{' '}
          <b>{intensity}</b>. Rest of the page is yours.
        </div>
      </div>
    </div>
  )
}
