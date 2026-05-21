'use client'

import { useEffect, useState } from 'react'

interface Props {
  /** Re-arms the shield whenever this key changes (e.g. when the source/episode changes) */
  resetKey:   string | number
  /** Optional headline shown on the shield */
  title?:     string
  /** Optional sub-text */
  subtitle?:  string
}

/**
 * Overlays the iframe area and absorbs the very first click after each load.
 * Streaming providers typically wire one-shot popup ads to the first user
 * gesture inside the iframe — by intercepting it here, the ad never fires.
 * After the user clicks the shield, it fades out and direct iframe
 * interaction resumes normally.
 */
export default function ClickShield({ resetKey, title = 'Tap to play', subtitle = 'First click blocks popup ads' }: Props) {
  const [mounted, setMounted] = useState(false)
  const [armed,   setArmed]   = useState(true)

  // Skip SSR — shield only renders once the client has hydrated.
  // The iframe it overlays is also client-only, so no UX is lost.
  useEffect(() => { setMounted(true) }, [])

  // Re-arm whenever the underlying iframe reloads
  useEffect(() => { setArmed(true) }, [resetKey])

  if (!mounted || !armed) return null

  return (
    <button
      type="button"
      onClick={() => setArmed(false)}
      aria-label="Click to start the video"
      style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 14, padding: 24, cursor: 'pointer',
        background: 'radial-gradient(ellipse at center, rgba(7,7,10,0.5) 0%, rgba(7,7,10,0.85) 70%)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        border: 'none', color: '#fff', fontFamily: 'inherit',
        animation: 'shield-in 0.3s ease',
      }}
    >
      {/* Pulsing play orb */}
      <span
        style={{
          width: 96, height: 96, borderRadius: '50%',
          display: 'grid', placeItems: 'center',
          background: 'radial-gradient(circle at 35% 35%, #fff, #e8c87a 35%, #5a4012 100%)',
          boxShadow: '0 0 40px rgba(232,200,122,0.55), inset 0 0 24px rgba(255,255,255,0.18)',
          animation: 'shield-pulse 2.4s ease-in-out infinite',
          flexShrink: 0,
        }}
      >
        <PlayIcon />
      </span>

      <p style={{
        fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em',
        margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.5)',
      }}>
        {title}
      </p>

      <p style={{
        fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.65)',
        margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        {subtitle}
      </p>

      <style>{`
        @keyframes shield-pulse {
          0%, 100% { transform: scale(1);    box-shadow: 0 0 40px rgba(232,200,122,0.55), inset 0 0 24px rgba(255,255,255,0.18); }
          50%       { transform: scale(1.06); box-shadow: 0 0 60px rgba(232,200,122,0.75), inset 0 0 28px rgba(255,255,255,0.25); }
        }
        @keyframes shield-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </button>
  )
}

function PlayIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="#0a0a0e" style={{ marginLeft: 4 }}>
      <path d="M6 4l14 8-14 8V4z"/>
    </svg>
  )
}
