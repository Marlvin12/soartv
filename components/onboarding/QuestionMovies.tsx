'use client'

import MovieArt from '@/components/art/MovieArt'
import Icon from '@/components/Icon'
import { MOVIES, Q1_TITLES } from '@/lib/catalog'

interface Props { value: string | null; onChange: (id: string) => void }

export default function QuestionMovies({ value, onChange }: Props) {
  return (
    <div className="q-grid">
      {Q1_TITLES.map(id => {
        const m = MOVIES[id]
        return (
          <div key={id} className={`q-card ${value === id ? 'selected' : ''}`} onClick={() => onChange(id)}>
            <div className="art">
              <MovieArt kind={m.kind} palette={m.palette} seed={id}/>
            </div>
            <div className="pick"><Icon name="check" size={14}/></div>
            <div className="meta">
              <div className="title">{m.title}</div>
              <div className="sub">{m.sub}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
