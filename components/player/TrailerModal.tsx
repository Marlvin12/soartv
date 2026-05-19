'use client'

import { useEffect } from 'react'

interface Props {
  videoKey: string | null
  title:    string
  onClose:  () => void
}

export default function TrailerModal({ videoKey, title, onClose }: Props) {
  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!videoKey) return null

  const src = `https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&playsinline=1`

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
        animation: 'trailer-in 0.25s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%', maxWidth: 1200, aspectRatio: '16/9',
          background: '#000', borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        <iframe
          src={src}
          title={`${title} — trailer`}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
        />
      </div>

      <button
        onClick={onClose}
        aria-label="Close trailer"
        style={{
          position: 'absolute', top: 20, right: 20, zIndex: 1,
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)',
          color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer',
          backdropFilter: 'blur(10px)', transition: 'background 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
      >
        <svg width="18" height="18" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/></svg>
      </button>

      <style>{`@keyframes trailer-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  )
}
