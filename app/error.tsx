'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px', textAlign: 'center', gap: 12,
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
        display: 'grid', placeItems: 'center', marginBottom: 14,
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <circle cx="12" cy="16" r="0.5" fill="#f87171"/>
        </svg>
      </div>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#f87171', margin: 0 }}>Signal lost</p>
      <h1 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.025em', margin: '4px 0 8px', color: '#fff' }}>
        Something went sideways.
      </h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 20px', maxWidth: 480, lineHeight: 1.6 }}>
        We hit an unexpected error. Try again, or head back home — your watchlist is safe.
      </p>
      {error?.digest && (
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', marginBottom: 18 }}>
          Reference: {error.digest}
        </p>
      )}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={reset}
          style={{
            padding: '11px 24px', borderRadius: 999, fontSize: 14, fontWeight: 700,
            background: 'linear-gradient(135deg,#7c5cfc,#b4a7ff)', color: '#0a0a0e',
            border: 'none', cursor: 'pointer',
          }}
        >Try again</button>
        <Link href="/" style={{
          padding: '11px 24px', borderRadius: 999, fontSize: 14, fontWeight: 600,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          color: 'var(--text-dim)', textDecoration: 'none',
        }}>Back home</Link>
      </div>
    </div>
  )
}
