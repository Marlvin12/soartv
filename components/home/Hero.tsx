'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Icon from '@/components/Icon'
import { MOOD_COPY } from '@/lib/catalog'
import { titleGradient } from '@/lib/utils'
import { toWatchPath } from '@/lib/urls'
import { useWatchlist } from '@/context/WatchlistContext'
import TrailerModal from '@/components/player/TrailerModal'
import AuthModal from '@/components/auth/AuthModal'
import type { MediaItem } from '@/types'

interface Props { item: MediaItem; mood: string }

export default function Hero({ item, mood }: Props) {
  const { watchlistIds, toggleWatchlist } = useWatchlist()
  const [videoKey,    setVideoKey]    = useState<string | null>(null)
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [authOpen,    setAuthOpen]    = useState(false)

  const inWatchlist = watchlistIds.has(item.id)

  const handleWatchlist = () => {
    toggleWatchlist(
      { mediaId: item.id, title: item.title, imageUrl: item.imageUrl, type: item.type },
      () => setAuthOpen(true),
    )
  }

  useEffect(() => {
    const numId = item.id.replace(/^(m|tv)-/, '')
    const type  = item.type === 'movie' ? 'movie' : 'tv'
    fetch(`/api/tmdb?path=/${type}/${numId}/videos`)
      .then(r => r.json())
      .then(data => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const trailer = (data.results || []).find((v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))
        if (trailer) setVideoKey(trailer.key)
      })
      .catch(() => {})
  }, [item.id, item.type])

  const embedSrc = videoKey
    ? `https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&loop=1&playlist=${videoKey}&controls=0&disablekb=1&fs=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`
    : null

  return (
    <div className="hero hero--fullscreen">
      {/* Background: video > backdrop > portrait > gradient */}
      {embedSrc ? (
        <div className="hero-video-wrap">
          <iframe src={embedSrc} allow="autoplay; encrypted-media" title="" aria-hidden="true"/>
        </div>
      ) : item.backdropUrl ? (
        <Image
          className="hero-backdrop"
          src={item.backdropUrl}
          alt=""
          fill
          sizes="100vw"
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
        />
      ) : item.imageUrl ? (
        <Image
          className="hero-backdrop hero-backdrop--portrait"
          src={item.imageUrl}
          alt=""
          fill
          sizes="46vw"
          priority
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      ) : (
        <div className="hero-art" style={{ background: titleGradient(item.title) }}/>
      )}

      {/* Cinematic overlays */}
      <div className="hero-vignette"/>

      <div className="hero-inner hero-inner--center">
        <div className="hero-pill">
          <span className="dot"/>
          {item.type === 'movie' ? 'Feature Film' : 'Series'}
          {mood && (
            <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, letterSpacing: '0.06em' }}>
              {' · for your '}{MOOD_COPY[mood]?.label?.toLowerCase()}{' night'}
            </span>
          )}
        </div>
        <h1 className="hero-title">{item.title}</h1>
        <div className="hero-meta">
          <span className="badge">{item.rated}</span>
          <span>{item.year}</span>
          {item.rating && <><span className="pip"/><span>★ {item.rating}</span></>}
          <span className="pip"/>
          <span>{item.genre}</span>
        </div>
        <p className="hero-desc">{(item.desc || item.sub || '').slice(0, 220)}</p>
        <div className="hero-actions">
          <Link
            href={toWatchPath(item.type, item.id.replace(/^(m|tv)-/, ''), item.title)}
            className="btn-primary"
          >
            <Icon name="play" size={14}/> Stream Now
          </Link>
          {videoKey && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setTrailerOpen(true)}
            >
              Watch Trailer
            </button>
          )}
          <button
            type="button"
            className="btn-secondary"
            onClick={handleWatchlist}
            aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            title={inWatchlist ? 'In your watchlist' : 'Add to watchlist'}
            style={inWatchlist ? { background: 'rgba(232,200,122,0.22)', borderColor: 'rgba(232,200,122,0.45)', color: '#e8c87a' } : undefined}
          >
            <Icon name={inWatchlist ? 'check' : 'plus'} size={14}/>
          </button>
        </div>
      </div>

      {trailerOpen && <TrailerModal videoKey={videoKey} title={item.title} onClose={() => setTrailerOpen(false)} />}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
