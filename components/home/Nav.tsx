'use client'

import Icon from '@/components/Icon'
import Brand from '@/components/Brand'

interface Props { onRetake: () => void }

export default function Nav({ onRetake }: Props) {
  return (
    <nav className="nav">
      <div className="nav-brand"><Brand variant="nav"/></div>
      <div className="nav-links">
        {['Watch Now', 'Movies', 'TV Shows', 'Sports', 'Kids', 'Library'].map((l, i) => (
          <a key={l} className={i === 0 ? 'active' : ''}>{l}</a>
        ))}
      </div>
      <div className="nav-right">
        <button className="retake-pill" onClick={onRetake}>
          <Icon name="refresh" size={12}/> Retake mood
        </button>
        <button className="icon-btn"><Icon name="search" size={15}/></button>
        <button className="icon-btn"><Icon name="cast" size={15}/></button>
      </div>
    </nav>
  )
}
