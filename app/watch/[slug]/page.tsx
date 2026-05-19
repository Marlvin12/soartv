'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import MoviePlayer   from '@/components/player/MoviePlayer'
import TvPlayer      from '@/components/player/TvPlayer'
import WatchParty    from '@/components/player/WatchParty'
import ShopThisScene from '@/components/originals/ShopThisScene'
import { getIdFromSlug } from '@/lib/urls'
import { useWatchlist } from '@/context/WatchlistContext'
import { useAuth } from '@/context/AuthContext'
import AuthModal from '@/components/auth/AuthModal'
import { IMG_1280, IMG_500 } from '@/lib/tmdb'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Detail {
  id:           number
  title:        string
  name?:        string
  overview:     string
  poster_path:  string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
  runtime?:     number
  episode_run_time?: number[]
  genres:       { id: number; name: string }[]
  number_of_seasons?: number
  seasons?:     { season_number: number; episode_count: number; name: string }[]
}

export default function WatchPage() {
  const params       = useParams<{ slug: string }>()
  const searchParams = useSearchParams()
  const type         = (searchParams.get('type') ?? 'movie') as 'movie' | 'show'
  const tmdbId       = getIdFromSlug(params.slug)

  const [detail,      setDetail]      = useState<Detail | null>(null)
  const [season,      setSeason]      = useState(1)
  const [episode,     setEpisode]     = useState(1)
  const [authOpen,    setAuthOpen]    = useState(false)
  const [originalId,  setOriginalId]  = useState<string | null>(null)

  const { toggleWatchlist, watchlistIds } = useWatchlist()
  const { user } = useAuth()

  const mediaId    = `${type === 'show' ? 'tv' : 'm'}-${tmdbId}`
  const inWatchlist = watchlistIds.has(mediaId)

  useEffect(() => {
    if (!tmdbId) return
    const path = type === 'show' ? `/tv/${tmdbId}` : `/movie/${tmdbId}`
    fetch(`/api/tmdb?path=${encodeURIComponent(path)}`)
      .then(r => r.json())
      .then(setDetail)
      .catch(console.error)

    // Check if this is a SoarTV Original with shoppable products
    const origDocId = `${type === 'show' ? 'tv' : 'movie'}-${tmdbId}`
    getDoc(doc(db, 'originals', origDocId))
      .then(snap => { if (snap.exists() && snap.data().published) setOriginalId(origDocId) })
      .catch(() => {})
  }, [tmdbId, type])

  // ── Continue Watching: write a record when the page loads, refresh on VidLink progress ──
  useEffect(() => {
    if (!user || !detail || !tmdbId) return

    const title    = detail.title ?? detail.name ?? ''
    const imageUrl = detail.poster_path ? IMG_500 + detail.poster_path : null
    const writeCW = (progress: number) =>
      setDoc(
        doc(db, 'users', user.uid, 'continueWatching', mediaId),
        {
          mediaId, title, imageUrl,
          type:      type === 'show' ? 'show' : 'movie',
          ...(type === 'show' ? { season, episode } : {}),
          progress:  Math.max(1, Math.min(100, Math.round(progress))),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      ).catch(console.error)

    // Initial: mark as started
    writeCW(5)

    // VidLink emits MEDIA_DATA postMessages with watched/duration progress
    let lastWrite = 0
    const onMessage = (event: MessageEvent) => {
      if (!event.origin.includes('vidlink.pro')) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload = event.data as any
      if (payload?.type !== 'MEDIA_DATA' || !payload.data) return
      const records = Object.values(payload.data) as Array<{ progress?: { watched: number; duration: number } }>
      const rec = records[0]
      if (!rec?.progress?.duration) return
      const pct = (rec.progress.watched / rec.progress.duration) * 100
      // Throttle to one write every 15s
      const now = Date.now()
      if (now - lastWrite < 15_000) return
      lastWrite = now
      writeCW(pct)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [user, detail, tmdbId, mediaId, type, season, episode])

  const handleWatchlist = useCallback(() => {
    if (!detail) return
    toggleWatchlist(
      {
        mediaId:  mediaId,
        title:    detail.title ?? detail.name ?? '',
        imageUrl: detail.poster_path ? IMG_500 + detail.poster_path : null,
        type:     type === 'show' ? 'show' : 'movie',
      },
      () => setAuthOpen(true),
    )
  }, [detail, mediaId, toggleWatchlist, type])

  if (!tmdbId) return <Err msg="Invalid media link." />

  const title       = detail?.title ?? detail?.name ?? 'Loading…'
  const year        = (detail?.release_date ?? detail?.first_air_date ?? '').slice(0, 4)
  const runtime     = detail?.runtime ?? detail?.episode_run_time?.[0]
  const seasons          = detail?.number_of_seasons
  // Real episode count for the currently-selected season (excludes "Specials" season 0)
  const seasonList       = (detail?.seasons ?? []).filter(s => s.season_number > 0)
  const currentSeasonObj = seasonList.find(s => s.season_number === season)
  const episodeCount     = currentSeasonObj?.episode_count ?? 1

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '0 0 80px' }}>
      {/* back bar — respects iOS notch/Dynamic Island */}
      <div style={{
        padding: 'calc(20px + env(safe-area-inset-top)) calc(24px + env(safe-area-inset-right)) 20px calc(24px + env(safe-area-inset-left))',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>
          <BackIcon /> SoarTV
        </Link>
      </div>

      {/* backdrop */}
      {detail?.backdrop_path && (
        <div style={{ position: 'relative', height: 220, marginBottom: -60, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG_1280 + detail.backdrop_path} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 0%,var(--bg) 100%)' }} />
        </div>
      )}

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        {/* meta */}
        <div className="watch-meta">
          {detail?.poster_path && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={IMG_500 + detail.poster_path}
              alt={title}
              className="watch-poster"
              style={{
                borderRadius: 12,
                flexShrink: 0,
                alignSelf: 'flex-start',     // ← stops flex container from stretching the image
                aspectRatio: '2 / 3',        // ← guarantees portrait ratio even if image loads late
                height: 'auto',
                objectFit: 'cover',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            />
          )}
          <div style={{ flex: 1, paddingTop: 8 }}>
            <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.025em', margin: '0 0 8px', color: '#fff' }}>
              {title}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {year && <MetaBadge>{year}</MetaBadge>}
              {runtime && <MetaBadge>{runtime}m</MetaBadge>}
              {(detail?.vote_average ?? 0) > 0 && <MetaBadge>★ {detail!.vote_average.toFixed(1)}</MetaBadge>}
              {detail?.genres?.slice(0, 3).map(g => <MetaBadge key={g.id}>{g.name}</MetaBadge>)}
            </div>
            <p style={{ fontSize: 15, color: 'var(--text-dim)', lineHeight: 1.6, margin: '0 0 16px', maxWidth: 580 }}>
              {detail?.overview}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={handleWatchlist}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '9px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                  background: inWatchlist ? 'rgba(180,167,255,0.2)' : 'rgba(255,255,255,0.06)',
                  border: inWatchlist ? '1px solid rgba(180,167,255,0.4)' : '1px solid rgba(255,255,255,0.1)',
                  color: inWatchlist ? '#b4a7ff' : 'var(--text-dim)',
                  transition: 'all 0.2s', cursor: 'pointer',
                }}
              >
                {inWatchlist ? <CheckSmIcon /> : <PlusIcon />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>

              {/* Watch Party — floating chat panel */}
              <WatchParty
                partyId={`${type === 'show' ? 'tv' : 'movie'}-${tmdbId}`}
                title={title}
              />

              {/* Shop This Scene — only for SoarTV Originals */}
              {originalId && (
                <ShopThisScene originalId={originalId} title={title} />
              )}
            </div>
          </div>
        </div>

        {/* episode picker for TV */}
        {type === 'show' && seasons && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Season</label>
              <select
                value={season}
                onChange={e => { setSeason(Number(e.target.value)); setEpisode(1) }}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 14, cursor: 'pointer' }}
              >
                {seasonList.length > 0
                  ? seasonList.map(s => (
                      <option key={s.season_number} value={s.season_number}>
                        {s.name || `Season ${s.season_number}`}
                      </option>
                    ))
                  : Array.from({ length: seasons }, (_, i) => i + 1).map(s => (
                      <option key={s} value={s}>Season {s}</option>
                    ))
                }
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Episode</label>
              <select value={episode} onChange={e => setEpisode(Number(e.target.value))}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 14, cursor: 'pointer' }}>
                {Array.from({ length: episodeCount }, (_, i) => i + 1).map(ep => (
                  <option key={ep} value={ep}>Episode {ep}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* player */}
        {type === 'movie'
          ? <MoviePlayer movieId={tmdbId} title={title} />
          : <TvPlayer tvId={tmdbId} season={season} episode={episode} title={title} />
        }
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}

function MetaBadge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ padding: '3px 9px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: 'var(--text-dim)', fontWeight: 500 }}>
      {children}
    </span>
  )
}
function Err({ msg }: { msg: string }) {
  return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>{msg}</div>
}
function BackIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12L6 8l4-4"/></svg>
}
function PlusIcon() {
  return <svg width="13" height="13" viewBox="0 0 13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="6.5" y1="2" x2="6.5" y2="11"/><line x1="2" y1="6.5" x2="11" y2="6.5"/></svg>
}
function CheckSmIcon() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7l3.5 3.5L11 4"/></svg>
}
