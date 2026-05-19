'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useWatchlist } from '@/context/WatchlistContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { ARCHETYPES } from '@/lib/archetypes'
import InsightsReveal from '@/components/resonance/InsightsReveal'
import type { ResonanceProfile } from '@/types'

type Tab = 'insights' | 'watchlist' | 'settings'

export default function ProfilePage() {
  const { user, signOut, loading } = useAuth()
  const { watchlistItems }         = useWatchlist()
  const [tab,     setTab]    = useState<Tab>('insights')
  const [profile, setProfile] = useState<ResonanceProfile | null>(null)

  useEffect(() => {
    if (!user) return
    return onSnapshot(
      doc(db, 'users', user.uid, 'resonanceProfile', 'current'),
      snap => { if (snap.exists()) setProfile(snap.data() as ResonanceProfile) }
    )
  }, [user])

  if (loading) return <PageShell><div style={{ color: 'var(--muted)', textAlign: 'center', paddingTop: 80 }}>Loading…</div></PageShell>

  if (!user) {
    return (
      <PageShell>
        <div style={{ textAlign: 'center', paddingTop: 100, color: 'var(--muted)' }}>
          <p style={{ fontSize: 16, marginBottom: 20 }}>Sign in to see your profile.</p>
          <Link href="/" style={{ color: '#b4a7ff', fontWeight: 600, fontSize: 14 }}>← Take the survey</Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '40px 40px 0' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%,#fff,#b4a7ff 40%,#4c1d95 100%)', boxShadow: '0 0 30px rgba(180,167,255,0.4)', overflow: 'hidden', flexShrink: 0 }}>
          {user.photoURL && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px', color: '#fff' }}>
            {user.displayName ?? user.email}
          </h1>
          {profile && (
            <p style={{ fontSize: 13, color: 'var(--soar)', fontWeight: 500, margin: 0 }}>
              {ARCHETYPES[profile.archetype].name}
            </p>
          )}
        </div>
        <button
          onClick={signOut}
          style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--muted)', padding: '8px 16px', borderRadius: 999, border: '1px solid var(--line)', transition: 'all 0.2s', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--line)' }}
        >
          Sign Out
        </button>
      </div>

      {/* tabs */}
      <div style={{ display: 'flex', gap: 0, padding: '24px 40px 0', borderBottom: '1px solid var(--line)' }}>
        {(['insights', 'watchlist', 'settings'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              color: tab === t ? '#fff' : 'var(--muted)',
              borderBottom: tab === t ? '2px solid #b4a7ff' : '2px solid transparent',
              textTransform: 'capitalize', transition: 'color 0.2s',
              marginBottom: -1,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* content */}
      <div style={{ padding: '32px 40px' }}>
        {tab === 'insights' && (
          profile
            ? <InsightsReveal profile={profile} onEnter={() => window.location.href = '/'} />
            : <EmptyInsights />
        )}
        {tab === 'watchlist' && <WatchlistTab items={watchlistItems} />}
        {tab === 'settings' && <SettingsTab user={user} />}
      </div>
    </PageShell>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ padding: '20px 40px', borderBottom: '1px solid var(--line-soft)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/" style={{ fontSize: 13, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <BackIcon /> SoarTV
        </Link>
      </div>
      {children}
    </div>
  )
}

function EmptyInsights() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(180,167,255,0.1)', border: '1px solid rgba(180,167,255,0.2)', margin: '0 auto 20px', display: 'grid', placeItems: 'center' }}>
        <OrbIcon />
      </div>
      <p style={{ fontSize: 16, marginBottom: 6, color: 'var(--text-dim)' }}>No resonance profile yet.</p>
      <Link href="/" style={{ fontSize: 14, color: '#b4a7ff' }}>Take the survey →</Link>
    </div>
  )
}

function WatchlistTab({ items }: { items: { id: string; title: string; imageUrl: string | null; type: string }[] }) {
  if (items.length === 0) {
    return <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '60px 0' }}>Your watchlist is empty.</div>
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 14 }}>
      {items.map(item => (
        <div key={item.id} style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '2/3', background: 'var(--bg-card)', position: 'relative' }}>
          {item.imageUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'var(--muted)', fontSize: 12 }}>{item.title}</div>
          }
        </div>
      ))}
    </div>
  )
}

function SettingsTab({ user }: { user: { email: string | null; emailVerified: boolean } }) {
  return (
    <div style={{ maxWidth: 480 }}>
      <Section label="Account">
        <Row label="Email" value={user.email ?? '—'} />
        <Row label="Email Verified" value={user.emailVerified ? 'Yes' : 'No'} />
      </Section>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>{label}</p>
      <div style={{ borderRadius: 16, border: '1px solid var(--line)', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
      <span style={{ fontSize: 14, color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--text)' }}>{value}</span>
    </div>
  )
}

function BackIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12L6 8l4-4"/></svg>
}
function OrbIcon() {
  return <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="10" stroke="rgba(180,167,255,0.5)" strokeWidth="1.5"/><circle cx="14" cy="14" r="4" fill="rgba(180,167,255,0.4)"/></svg>
}
