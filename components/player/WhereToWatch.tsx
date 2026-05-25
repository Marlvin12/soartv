'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Where to Watch — Apple-TV-style provider row.
//
// Replaces the previous iframe MoviePlayer/TvPlayer on /watch/[slug].
// Fetches TMDB watch-providers for the user's region, renders each provider
// as a tappable tile (its TMDB-hosted logo on a glass card), and on tap
// opens the StreamingProviderModal — which then deep-links the user to that
// provider's site.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import StreamingProviderModal from './StreamingProviderModal'
import {
  fetchWatchProviders, pickPrimaryProviders, providerLogoUrl,
  brandForProvider, type ProviderEntry, type ProviderBrand, type ProvidersResponse,
} from '@/lib/watch-providers'

interface Props {
  type:  'movie' | 'show'
  id:    string | number
  title: string
}

export default function WhereToWatch({ type, id, title }: Props) {
  const [resp,     setResp]     = useState<ProvidersResponse | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [open,     setOpen]     = useState(false)
  const [selected, setSelected] = useState<ProviderEntry | null>(null)
  const [brand,    setBrand]    = useState<ProviderBrand | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchWatchProviders(type, id).then(data => {
      if (cancelled) return
      setResp(data)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [type, id])

  const providers = pickPrimaryProviders(resp)

  const handleTap = (p: ProviderEntry) => {
    setSelected(p)
    setBrand(brandForProvider(p.provider_name, resp?.link))
    setOpen(true)
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <p style={{
          fontSize: 13, color: 'var(--muted)', fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0,
        }}>
          Where to Watch
        </p>
        {resp?.link && (
          <a
            href={resp.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}
          >
            All options ↗
          </a>
        )}
      </div>

      {loading && (
        <div style={{
          padding: '40px 20px', borderRadius: 16,
          background: 'var(--bg-card)', border: '1px solid var(--line)',
          textAlign: 'center', color: 'var(--muted)', fontSize: 13,
        }}>
          Checking streaming services…
        </div>
      )}

      {!loading && providers.length === 0 && (
        <div style={{
          padding: '28px 24px', borderRadius: 16,
          background: 'var(--bg-card)', border: '1px solid var(--line)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 14, color: 'var(--text-dim)', margin: '0 0 6px' }}>
            Not currently streaming in your region.
          </p>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
            Try rent or buy from your usual store, or check back later.
          </p>
        </div>
      )}

      {!loading && providers.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 14,
        }}>
          {providers.map(p => (
            <ProviderTile key={p.provider_id} provider={p} onTap={() => handleTap(p)} />
          ))}
        </div>
      )}

      <StreamingProviderModal
        isOpen={open}
        onClose={() => setOpen(false)}
        provider={selected}
        brand={brand}
        title={title}
      />
    </div>
  )
}

function ProviderTile({ provider, onTap }: { provider: ProviderEntry; onTap: () => void }) {
  return (
    <button
      onClick={onTap}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        padding: '14px 10px', borderRadius: 16, cursor: 'pointer',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'transform 0.15s ease, background 0.15s ease, border-color 0.15s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.borderColor = 'rgba(232,200,122,0.35)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{
        width: 64, height: 64, borderRadius: 14, overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 6px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.7)',
        display: 'grid', placeItems: 'center',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={providerLogoUrl(provider)}
          alt={provider.provider_name}
          style={{ width: '78%', height: '78%', objectFit: 'contain' }}
        />
      </div>
      <span style={{
        fontSize: 12, fontWeight: 600, color: 'var(--text-dim)',
        textAlign: 'center', lineHeight: 1.25,
      }}>
        {provider.provider_name}
      </span>
    </button>
  )
}
