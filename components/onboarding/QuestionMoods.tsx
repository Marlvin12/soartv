'use client'

import type { MoodOption } from '@/types'

interface Props {
  options: MoodOption[]
  value: string | null
  onChange: (id: string) => void
  columns?: number
}

export default function QuestionMoods({ options, value, onChange, columns }: Props) {
  return (
    <div className={`mood-grid ${columns === 3 ? 'three' : ''}`}>
      {options.map(o => (
        <div key={o.id} className={`mood-card ${value === o.id ? 'selected' : ''}`} onClick={() => onChange(o.id)}>
          <div className="grad" style={{ '--g': o.g } as React.CSSProperties}/>
          <div className="grain"/>
          <div className="label">
            <div className="name">{o.name}</div>
            <div className="desc">{o.desc}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
