'use client'

import { memo, useState, useEffect } from 'react'
import ClickShield from './ClickShield'

// Ordered so the cleanest source is the default. VidLink injects heavy ads,
// kept available for fallback but no longer the default.
const SOURCES = [
  { name: 'Server 1',  url: (id: string | number) => `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=true` },
  { name: 'Server 2',  url: (id: string | number) => `https://vidsrc-embed.ru/embed/movie/${id}?autoPlay=true` },
  { name: 'Server 3',  url: (id: string | number) => `https://multiembed.mov/?video_id=${id}&tmdb=1&autoPlay=true` },
  { name: 'Server 4',  url: (id: string | number) => `https://vidlink.pro/movie/${id}?primaryColor=e8c87a&secondaryColor=a2a2a2&iconColor=eefdec&poster=true&title=true&nextbutton=false&player=jw&autoplay=true` },
]

interface Props {
  movieId: string | number
  title?:  string
}

function MoviePlayer({ movieId, title }: Props) {
  const [shouldRender, setShouldRender] = useState(false)
  const [sourceIdx,    setSourceIdx]    = useState(0)

  useEffect(() => {
    setShouldRender(false)
    const t = setTimeout(() => setShouldRender(true), 150)
    return () => clearTimeout(t)
  }, [movieId, sourceIdx])

  if (!movieId) return null

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, padding: '0 4px' }}>
        <ServerIcon />
        <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500, marginRight: 4 }}>Source:</span>
        {SOURCES.map((src, idx) => (
          <button
            key={idx}
            onClick={() => setSourceIdx(idx)}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: sourceIdx === idx ? 'rgba(232,200,122,0.2)' : 'rgba(255,255,255,0.05)',
              color: sourceIdx === idx ? '#e8c87a' : 'var(--muted)',
              border: sourceIdx === idx ? '1px solid rgba(232,200,122,0.4)' : '1px solid transparent',
              transition: 'all 0.2s', cursor: 'pointer',
            }}
          >
            {src.name}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: 16, overflow: 'hidden', boxShadow: '0 0 40px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
        {shouldRender && (
          <iframe
            key={SOURCES[sourceIdx].url(movieId)}
            src={SOURCES[sourceIdx].url(movieId)}
            title={title ? `${title} — SoarTV` : 'Movie — SoarTV'}
            allow="fullscreen *; picture-in-picture *; autoplay *; encrypted-media *; screen-wake-lock *;"
            allowFullScreen
            referrerPolicy="origin"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', userSelect: 'none' }}
          />
        )}
        <ClickShield resetKey={`${movieId}-${sourceIdx}`} title={title ? `Play ${title}` : 'Tap to play'} />
      </div>
    </div>
  )
}

function ServerIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--muted)" strokeWidth="1.2" strokeLinecap="round"><rect x="1" y="1" width="12" height="5" rx="1.5"/><rect x="1" y="8" width="12" height="5" rx="1.5"/><circle cx="11" cy="3.5" r="0.8" fill="var(--muted)"/><circle cx="11" cy="10.5" r="0.8" fill="var(--muted)"/></svg>
}

export default memo(MoviePlayer)
