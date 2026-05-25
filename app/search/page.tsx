'use client'

import { Suspense, useEffect, useState, useTransition } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/home/Nav'
import { toWatchPath } from '@/lib/urls'
import { IMG_500 } from '@/lib/tmdb'

interface Result {
  id:           number
  media_type:   'movie' | 'tv' | 'person'
  title?:       string
  name?:        string
  poster_path:  string | null
  backdrop_path: string | null
  overview?:    string
  release_date?: string
  first_air_date?: string
  vote_average?: number
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchContent />
    </Suspense>
  )
}

function SearchContent() {
  const sp        = useSearchParams()
  const router    = useRouter()
  const initial   = sp.get('q') ?? ''
  const [q,           setQ]       = useState(initial)
  const [results,     setResults] = useState<Result[]>([])
  const [loading,     setLoading] = useState(false)
  const [pending, startTransition] = useTransition()

  // Debounced URL sync as user types
  useEffect(() => {
    const t = setTimeout(() => {
      const next = q.trim()
      const cur  = sp.get('q') ?? ''
      if (next !== cur) {
        startTransition(() => {
          router.replace(next ? `/search?q=${encodeURIComponent(next)}` : '/search', { scroll: false })
        })
      }
    }, 280)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  // Fetch on URL change
  useEffect(() => {
    const term = (sp.get('q') ?? '').trim()
    if (!term) { setResults([]); return }
    let cancelled = false
    setLoading(true)
    fetch(`/api/tmdb?path=/search/multi&query=${encodeURIComponent(term)}&include_adult=false`)
      .then(r => r.json())
      .then(d => {
        if (cancelled) return
        const items: Result[] = (d.results ?? [])
          .filter((r: Result) => (r.media_type === 'movie' || r.media_type === 'tv') && r.poster_path)
        setResults(items)
      })
      .catch(() => { if (!cancelled) setResults([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [sp])

  return (
    <div className="home">
      <Nav />
      <div style={{ padding: '36px 56px 8px' }}>
        <h1 className="page-title" style={{ marginBottom: 18 }}>Search</h1>
        <div style={{ position: 'relative', maxWidth: 640 }}>
          <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>
            <SearchIcon />
          </span>
          <input
            type="search"
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search movies, shows, actors…"
            style={{
              width: '100%', padding: '15px 52px 15px 48px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 16, color: '#fff', fontSize: 16,
              fontFamily: 'inherit', outline: 'none',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(232,200,122,0.5)' }}
            onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
          />
          {q && (
            <button
              onClick={() => setQ('')}
              aria-label="Clear"
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center', color: 'var(--muted)' }}
            >
              <XIcon />
            </button>
          )}
        </div>
        {(loading || pending) && (
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 14 }}>Searching…</p>
        )}
      </div>

      <div style={{ padding: '24px 56px 80px' }}>
        {!q.trim() ? (
          <EmptyState />
        ) : results.length === 0 && !loading ? (
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>No results for &ldquo;{q}&rdquo;.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 18 }}>
            {results.map(r => (
              <SearchTile key={`${r.media_type}-${r.id}`} item={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SearchTile({ item }: { item: Result }) {
  const title = item.title ?? item.name ?? 'Untitled'
  const year  = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
  const type: 'movie' | 'show' = item.media_type === 'tv' ? 'show' : 'movie'
  const href  = toWatchPath(type, item.id, title)

  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        position: 'relative', aspectRatio: '2/3', borderRadius: 12, overflow: 'hidden',
        background: 'var(--bg-card)', transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,0,0,0.5)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
      >
        {item.poster_path && (
          <Image
            src={IMG_500 + item.poster_path}
            alt={title}
            fill
            sizes="220px"
            style={{ objectFit: 'cover' }}
          />
        )}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 14px 12px',
          background: 'linear-gradient(to top,rgba(0,0,0,0.9) 0%,transparent 100%)',
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#e8c87a' }}>
            {item.media_type === 'tv' ? 'TV' : 'Movie'}
          </span>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: '4px 0 0', lineHeight: 1.3 }}>{title}</p>
          {year && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', margin: '2px 0 0' }}>{year}</p>}
        </div>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--muted)' }}>
      <SearchIcon big />
      <p style={{ fontSize: 16, color: 'var(--text-dim)', margin: '14px 0 6px' }}>Find your next film.</p>
      <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>Search by title — try &ldquo;Inception&rdquo; or &ldquo;Severance.&rdquo;</p>
    </div>
  )
}

function Loading() {
  return <div style={{ padding: 80, textAlign: 'center', color: 'var(--muted)' }}>Loading…</div>
}

function SearchIcon({ big }: { big?: boolean }) {
  const s = big ? 36 : 18
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={big ? { display: 'block', margin: '0 auto', opacity: 0.4 } : {}}>
      <circle cx="11" cy="11" r="7"/>
      <line x1="16.5" y1="16.5" x2="21" y2="21"/>
    </svg>
  )
}

function XIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/></svg>
}
