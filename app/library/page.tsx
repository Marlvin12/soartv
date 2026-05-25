'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/home/Nav'
import { useAuth }      from '@/context/AuthContext'
import { useWatchlist } from '@/context/WatchlistContext'
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toWatchPath } from '@/lib/urls'

interface ContinueDoc {
  id:        string
  mediaId:   string
  title:     string
  imageUrl:  string | null
  type:      'movie' | 'show'
  progress:  number   // 0-100
  updatedAt: string
}

export default function LibraryPage() {
  const { user, loading }            = useAuth()
  const { watchlistItems, ready }    = useWatchlist()
  const [continueList, setContinue]  = useState<ContinueDoc[]>([])

  useEffect(() => {
    if (!user) { setContinue([]); return }
    const q = query(
      collection(db, 'users', user.uid, 'continueWatching'),
      orderBy('updatedAt', 'desc'),
      limit(20),
    )
    return onSnapshot(q, snap => {
      setContinue(snap.docs.map(d => ({ id: d.id, ...d.data() } as ContinueDoc)))
    })
  }, [user])

  return (
    <div className="home">
      <Nav />
      <div style={{ padding: '36px 56px 12px' }}>
        <h1 className="page-title">Library</h1>
        <p className="page-title-sub">Everything you&apos;ve saved and started.</p>
      </div>

      {loading ? (
        <div style={{ padding: '60px 56px', color: 'var(--muted)' }}>Loading…</div>
      ) : !user ? (
        <SignedOut />
      ) : (
        <>
          <Section title="Continue Watching" sub={`${continueList.length} in progress`} empty="No titles in progress.">
            {continueList.map(c => (
              <LibraryTile
                key={c.id}
                href={toWatchPath(c.type === 'show' ? 'show' : 'movie', extractTmdb(c.mediaId), c.title)}
                imageUrl={c.imageUrl}
                title={c.title}
                progress={c.progress}
              />
            ))}
          </Section>

          <Section title="My Watchlist" sub={ready ? `${watchlistItems.length} saved` : 'syncing…'} empty="Your watchlist is empty.">
            {watchlistItems.map(w => (
              <LibraryTile
                key={w.id}
                href={toWatchPath(w.type === 'show' ? 'show' : 'movie', extractTmdb(w.mediaId), w.title)}
                imageUrl={w.imageUrl}
                title={w.title}
              />
            ))}
          </Section>
        </>
      )}

      <footer className="foot">
        <div>&copy; 2026 SoarTV</div>
        <div className="links"><a>Terms</a><a>Privacy</a><a>Help</a><a>About</a></div>
      </footer>
    </div>
  )
}

// ── helpers ───────────────────────────────────────────────────────────────────

function extractTmdb(mediaId: string): string {
  // mediaId format: "m-{tmdbId}" or "tv-{tmdbId}"
  return mediaId.replace(/^(m|tv)-/, '')
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, sub, empty, children }: {
  title:    string
  sub?:     string
  empty:    string
  children: React.ReactNode
}) {
  const arr = Array.isArray(children) ? children : [children]
  const items = arr.filter(Boolean)
  return (
    <section style={{ margin: '36px 56px 0' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.015em', margin: 0, color: '#fff' }}>{title}</h2>
        {sub && <span style={{ fontSize: 12, color: 'var(--muted)' }}>{sub}</span>}
      </div>
      {items.length === 0 ? (
        <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0 }}>{empty}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14 }}>
          {items}
        </div>
      )}
    </section>
  )
}

function LibraryTile({ href, imageUrl, title, progress }: {
  href:      string
  imageUrl:  string | null
  title:     string
  progress?: number
}) {
  return (
    <Link href={href} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <div style={{ position: 'relative', aspectRatio: '2/3', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-card)', transition: 'transform 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
      >
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill sizes="200px" style={{ objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: 12, fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
            {title}
          </div>
        )}
        {/* gradient + title */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 12px 10px', background: 'linear-gradient(to top,rgba(0,0,0,0.9) 0%,transparent 100%)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.3, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{title}</p>
        </div>
        {/* progress bar */}
        {progress !== undefined && progress > 0 && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'rgba(255,255,255,0.15)' }}>
            <div style={{ height: '100%', width: `${Math.min(100, Math.max(0, progress))}%`, background: '#e8c87a' }} />
          </div>
        )}
      </div>
    </Link>
  )
}

function SignedOut() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--muted)' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(232,200,122,0.1)', border: '1px solid rgba(232,200,122,0.2)', margin: '0 auto 18px', display: 'grid', placeItems: 'center' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(232,200,122,0.6)" strokeWidth="1.5" strokeLinecap="round"><path d="M21 5H3v14h18V5z"/><path d="M3 9h18"/><path d="M9 5v4"/></svg>
      </div>
      <p style={{ fontSize: 17, color: '#fff', fontWeight: 500, margin: '0 0 6px' }}>Sign in to access your Library</p>
      <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 18px' }}>Your watchlist and continue-watching list sync across devices.</p>
      <Link href="/" style={{ fontSize: 14, color: '#e8c87a', fontWeight: 600 }}>← Take the survey</Link>
    </div>
  )
}
