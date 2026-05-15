'use client'

import Nav from './Nav'

interface Props { onRetake: () => void }

export default function LoadingSkeleton({ onRetake }: Props) {
  return (
    <div className="home">
      <Nav onRetake={onRetake}/>
      <div className="hero skeleton" style={{ margin: '8px 24px 0', borderRadius: 22 }}/>
      <div style={{ margin: '36px 56px 0', height: 88, borderRadius: 18 }} className="skeleton"/>
      {[
        { title: 'Tonight, for you', w: 320, h: 180, n: 6 },
        { title: 'Up Next',          w: 360, h: 200, n: 5 },
        { title: 'Soar Originals',   w: 420, h: 260, n: 4 },
      ].map(({ title, w, h, n }) => (
        <section key={title} className="shelf">
          <div className="shelf-head">
            <h2 className="shelf-title" style={{ color: '#252530' }}>{title}</h2>
          </div>
          <div className="shelf-track">
            {Array.from({ length: n }).map((_, i) => (
              <div key={i} className="skeleton" style={{ width: w, height: h, flex: '0 0 auto', borderRadius: 13 }}/>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
