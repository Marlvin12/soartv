'use client'

import { useEffect, useRef, useState } from 'react'
import Brand from '@/components/Brand'

interface Movie { backdrop: string; poster: string | null }

interface Props {
  onSelect: (mode: 'voice' | 'cards') => void
  onSkip:   () => void
}

export default function ModeSelect({ onSelect, onSkip }: Props) {
  const [movies, setMovies]   = useState<Movie[]>([])
  const [vIdx, setVIdx]       = useState(0)
  const [cIdx, setCIdx]       = useState(2)
  const [pGroup, setPGroup]   = useState(0)
  const [ready, setReady]     = useState(false)
  const cOffsetRef = useRef(false)

  useEffect(() => {
    fetch('/api/tmdb?path=/trending/movie/week')
      .then(r => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(data => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items: Movie[] = (data.results || []).filter((m: any) => m.backdrop_path).slice(0, 20).map((m: any) => ({
          backdrop: `https://image.tmdb.org/t/p/w780${m.backdrop_path}`,
          poster:   m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : null,
        }))
        setMovies(items)
      })
      .catch(() => {})
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (movies.length < 8) return
    const tv = setInterval(() => setVIdx(i => (i + 1) % 5), 4500)
    // offset cards cycle by 2.25 s
    const to = setTimeout(() => {
      if (!cOffsetRef.current) { cOffsetRef.current = true }
      const tc = setInterval(() => setCIdx(i => (i + 1) % 5), 4500)
      return () => clearInterval(tc)
    }, 2250)
    const tp = setInterval(() => setPGroup(g => (g + 1) % 2), 3800)
    return () => { clearInterval(tv); clearTimeout(to); clearInterval(tp) }
  }, [movies.length])

  const vMovies  = movies.slice(0, 5)
  const cMovies  = movies.slice(5, 10)
  const posters1 = movies.slice(10, 14)
  const posters2 = movies.slice(14, 18)
  const posters  = pGroup === 0 ? posters1 : posters2

  const ROTATIONS = ['-3deg', '2.5deg', '2deg', '-2.5deg']
  const TOPS      = ['0px', '14px', '0px', '14px']

  return (
    <div className={`msp ${ready ? 'msp--ready' : ''}`}>
      <div className="msp-nav">
        <Brand/>
        <button className="onb-skip" onClick={onSkip}>Skip for now</button>
      </div>

      <div className="msp-head">
        <div className="onb-eyebrow">Personalise your night</div>
        <h1 className="msp-title">How would you like<br/>to explore?</h1>
        <p className="msp-sub">Pick once. You can always switch from the home screen.</p>
      </div>

      <div className="msp-row">
        {/* ── VOICE CARD ── */}
        <button className="msc" onClick={() => onSelect('voice')}>
          <div className="msc-bgs">
            {vMovies.map((m, i) => (
              <div key={i} className="msc-bg" style={{ opacity: i === vIdx ? 1 : 0 }}>
                <img src={m.backdrop} alt="" className="msc-bg-img" loading={i === 0 ? 'eager' : 'lazy'}/>
              </div>
            ))}
            {vMovies.length === 0 && <div className="msc-bg msc-bg--fallback msc-bg--v" style={{ opacity: 1 }}/>}
          </div>
          <div className="msc-ov msc-ov--voice"/>

          <div className="msc-inner">
            <div className="msc-vis">
              <div className="msc-orb">
                <div className="msc-orb-ring"/>
              </div>
              <div className="msc-wave">
                {[0,1,2,3,4,5,6].map(i => (
                  <span key={i} className="msc-wbar" style={{
                    animationDelay:    `${i * 0.09}s`,
                    animationDuration: `${0.65 + (i % 4) * 0.18}s`,
                  }}/>
                ))}
              </div>
            </div>

            <div className="msc-copy">
              <span className="msc-badge msc-badge--purple">AI-guided</span>
              <h2 className="msc-name">Voice</h2>
              <p className="msc-desc">Tell us how you&apos;re really arriving tonight. AI reads your resonance and mirrors it back, out loud.</p>
              <span className="msc-cta">Start the conversation →</span>
            </div>
          </div>
        </button>

        {/* ── CARDS CARD ── */}
        <button className="msc" onClick={() => onSelect('cards')}>
          <div className="msc-bgs">
            {cMovies.map((m, i) => (
              <div key={i} className="msc-bg" style={{ opacity: i === (cIdx % 5) ? 1 : 0 }}>
                <img src={m.backdrop} alt="" className="msc-bg-img" loading={i === 0 ? 'eager' : 'lazy'}/>
              </div>
            ))}
            {cMovies.length === 0 && <div className="msc-bg msc-bg--fallback msc-bg--c" style={{ opacity: 1 }}/>}
          </div>
          <div className="msc-ov msc-ov--cards"/>

          <div className="msc-inner">
            <div className="msc-vis msc-vis--posters">
              <div className="msc-poster-wrap">
                {posters.slice(0, 4).map((m, i) => (
                  <div
                    key={`${pGroup}-${i}`}
                    className="msc-poster"
                    style={{ '--rot': ROTATIONS[i], '--top': TOPS[i] } as React.CSSProperties}
                  >
                    {m.poster && <img src={m.poster} alt="" className="msc-poster-img"/>}
                  </div>
                ))}
              </div>
            </div>

            <div className="msc-copy">
              <span className="msc-badge msc-badge--green">Visual</span>
              <h2 className="msc-name">Cards</h2>
              <p className="msc-desc">Flip through a curated visual deck of films and moods. Go with what pulls you.</p>
              <span className="msc-cta">Browse cards →</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
