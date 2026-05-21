'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { getIdTokenResult } from 'firebase/auth'

type State = 'loading' | 'denied' | 'allowed'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const [state, setState] = useState<State>('loading')

  useEffect(() => {
    if (loading) return
    if (!user) { setState('denied'); return }

    // Try cached token first (fast path)
    getIdTokenResult(user, /* forceRefresh */ false)
      .then(result => {
        if (result.claims.role === 'admin') {
          setState('allowed')
          return
        }
        // Cached token didn't have the claim — force-refresh in case it was granted recently
        return getIdTokenResult(user, /* forceRefresh */ true).then(fresh => {
          setState(fresh.claims.role === 'admin' ? 'allowed' : 'denied')
        })
      })
      .catch(() => setState('denied'))
  }, [user, loading])

  if (state === 'loading') {
    return (
      <Shell>
        <div style={{ display: 'grid', placeItems: 'center', flex: 1 }}>
          <Spinner />
        </div>
      </Shell>
    )
  }

  if (state === 'denied') {
    return (
      <Shell>
        <div style={{ display: 'grid', placeItems: 'center', flex: 1, textAlign: 'center', gap: 12 }}>
          <LockIcon />
          <p style={{ fontSize: 18, fontWeight: 600, color: '#fff', margin: 0 }}>Access denied</p>
          <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0 }}>
            {user ? 'Your account does not have admin privileges.' : 'You must be signed in as an admin.'}
          </p>
          <Link href="/" style={{ marginTop: 8, fontSize: 14, color: '#e8c87a' }}>← Back to SoarTV</Link>
        </div>
      </Shell>
    )
  }

  return <Shell>{children}</Shell>
}

// ── Shell ─────────────────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* admin topbar */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 32px', borderBottom: '1px solid var(--line)',
        background: 'rgba(7,7,10,0.95)', backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <SoarIcon />
          <span style={{ fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>
            Soar<span style={{ color: '#e8c87a' }}>TV</span>
          </span>
        </Link>
        <div style={{ width: 1, height: 18, background: 'var(--line)' }} />
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Admin
        </span>
        <nav style={{ display: 'flex', gap: 4, marginLeft: 16 }}>
          {[
            { href: '/admin',           label: 'Dashboard' },
            { href: '/admin/originals', label: 'Originals' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{
              fontSize: 13, fontWeight: 500, padding: '6px 14px', borderRadius: 8,
              color: 'var(--muted)', transition: 'color 0.2s, background 0.2s',
              textDecoration: 'none',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent' }}
            >{label}</Link>
          ))}
        </nav>
        <Link href="/" style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--muted)' }}>← Exit admin</Link>
      </header>

      <main style={{ flex: 1, padding: '40px 32px' }}>
        {children}
      </main>
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function SoarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="7" fill="rgba(232,200,122,0.15)" />
      <path d="M8 20 L14 9 L20 20" stroke="#e8c87a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="14" cy="9" r="1.8" fill="#e8c87a"/>
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

function Spinner() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ animation: 'spin 0.9s linear infinite' }}>
      <circle cx="16" cy="16" r="13" stroke="rgba(232,200,122,0.2)" strokeWidth="2.5"/>
      <path d="M16 3a13 13 0 0 1 13 13" stroke="#e8c87a" strokeWidth="2.5" strokeLinecap="round"/>
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </svg>
  )
}
