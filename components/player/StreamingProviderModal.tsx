'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Liquid-glass "Sign in to [Provider]" modal.
//
// Apple-TV-style provider sheet. Shown when a user taps a streaming-service
// tile on the watch page. Visual language mirrors AuthModal — heavy backdrop
// blur, saturated rgba card, inset highlight — but the panel is keyed to the
// provider's brand gradient + accent color so it reads as belonging to them.
// The CTA opens the provider's site in a new tab; SoarTV does not host the
// stream itself.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { providerLogoUrl, type ProviderEntry, type ProviderBrand } from '@/lib/watch-providers'

interface Props {
  isOpen:   boolean
  onClose:  () => void
  provider: ProviderEntry | null
  brand:    ProviderBrand | null
  title:    string
}

export default function StreamingProviderModal({ isOpen, onClose, provider, brand, title }: Props) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen || !provider || !brand) return null

  const handleContinue = () => {
    const url = brand.launch(title)
    window.open(url, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'grid', placeItems: 'center',
        padding: '20px',
        background: 'radial-gradient(circle at 50% 30%, rgba(0,0,0,0.55), rgba(0,0,0,0.85))',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', width: '100%', maxWidth: 420,
          borderRadius: 28, overflow: 'hidden',
          background: 'rgba(20,20,28,0.45)',
          border: '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Branded gradient header */}
        <div style={{
          position: 'relative', padding: '28px 26px 22px',
          background: brand.gradient,
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        }}>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: 14, right: 14,
              width: 30, height: 30, borderRadius: 999, cursor: 'pointer',
              background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.18)',
              color: '#fff', display: 'grid', placeItems: 'center',
              backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="10" y2="10"/>
              <line x1="10" y1="2" x2="2" y2="10"/>
            </svg>
          </button>

          {/* Provider logo in a glass disk */}
          <div style={{
            width: 84, height: 84, borderRadius: 22, margin: '4px auto 14px',
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid rgba(255,255,255,0.5)',
            display: 'grid', placeItems: 'center', overflow: 'hidden',
            boxShadow: '0 10px 28px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.7)',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={providerLogoUrl(provider)}
              alt={provider.provider_name}
              style={{ width: '74%', height: '74%', objectFit: 'contain' }}
            />
          </div>

          <p style={{
            fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)', margin: '0 0 6px', textAlign: 'center',
          }}>
            Continue on
          </p>
          <h2 style={{
            fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em',
            color: '#fff', margin: 0, textAlign: 'center',
          }}>
            {brand.label}
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 26px 26px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <p style={{
            fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,0.82)',
            textAlign: 'center', margin: 0,
          }}>
            Sign in to {brand.label} to watch <span style={{ color: '#fff', fontWeight: 600 }}>{title}</span>. Your {brand.label} subscription is required.
          </p>

          <button
            onClick={handleContinue}
            style={{
              padding: '14px 24px', borderRadius: 14, cursor: 'pointer',
              background: '#fff', color: '#0a0a0e',
              border: 'none', fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em',
              boxShadow: `0 8px 24px ${brand.fg}55, inset 0 1px 0 rgba(255,255,255,0.8)`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            Continue to {brand.label}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3l5 4-5 4"/>
            </svg>
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '11px 18px', borderRadius: 12, cursor: 'pointer',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.18)',
              color: 'rgba(255,255,255,0.75)', fontSize: 13.5, fontWeight: 500,
            }}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
