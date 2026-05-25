'use client'

import Nav from '@/components/home/Nav'
import BrowseShelves from '@/components/browse/BrowseShelves'
import { TV_GENRE_ROWS } from '@/lib/browse'

export default function ShowsPage() {
  const shelves = [
    { title: 'Trending this week',  path: '/trending/tv/week',  type: 'tv' as const, variant: 'wide' as const },
    { title: 'Top Rated',            path: '/tv/top_rated',      type: 'tv' as const, variant: 'tall' as const },
    { title: 'Airing Today',         path: '/tv/airing_today',   type: 'tv' as const, variant: 'wide' as const },
    { title: 'Popular',              path: '/tv/popular',        type: 'tv' as const, variant: 'wide' as const },
    ...TV_GENRE_ROWS.map(g => ({
      title:   g.label,
      sub:     'by genre',
      path:    '/discover/tv',
      type:    'tv' as const,
      params:  { with_genres: String(g.id), sort_by: 'popularity.desc', 'vote_count.gte': '100' },
      variant: 'wide' as const,
    })),
  ]

  return (
    <div className="home">
      <Nav />
      <div style={{ padding: '36px 56px 12px' }}>
        <h1 className="page-title">TV Shows</h1>
        <p className="page-title-sub">Series worth your evening — trending, top-rated, and by genre.</p>
      </div>
      <BrowseShelves shelves={shelves} />
      <footer className="foot">
        <div>&copy; 2026 SoarTV</div>
        <div className="links"><a>Terms</a><a>Privacy</a><a>Help</a><a>About</a></div>
      </footer>
    </div>
  )
}
