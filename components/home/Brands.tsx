'use client'

import Icon from '@/components/Icon'

const BRANDS = [
  { name: 'AMC+',       bg: 'linear-gradient(135deg,#7f1d1d,#000)',        color: '#fbbf24' },
  { name: 'STARZ',      bg: 'linear-gradient(135deg,#000,#1f2937)',         color: '#fff'    },
  { name: 'MAX',        bg: 'linear-gradient(135deg,#1e3a8a,#000)',         color: '#3b82f6' },
  { name: 'Hallmark',   bg: 'linear-gradient(135deg,#5a3a14,#4c0519)',      color: '#f5e3c0' },
  { name: 'Showtime',   bg: 'linear-gradient(135deg,#dc2626,#000)',         color: '#fff'    },
  { name: 'BritBox',    bg: 'linear-gradient(135deg,#1e40af,#1e3a8a)',      color: '#fde68a' },
  { name: 'Acorn',      bg: 'linear-gradient(135deg,#365314,#1a2e05)',      color: '#bef264' },
  { name: 'Crunchyroll',bg: 'linear-gradient(135deg,#ea580c,#7c2d12)',      color: '#fff'    },
]

export default function Brands() {
  return (
    <section className="shelf">
      <div className="shelf-head">
        <h2 className="shelf-title">Channels &amp; Apps</h2>
        <a className="shelf-link">See All <Icon name="chevR" size={12}/></a>
      </div>
      <div className="shelf-wrap">
        <div className="shelf-track">
          {BRANDS.map(b => (
            <div key={b.name} className="tile brand" style={{ background: b.bg }}>
              <div className="brand-art" style={{ color: b.color, fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>{b.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
