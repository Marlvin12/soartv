'use client'

import Nav from '@/components/home/Nav'
import BrowseShelves from '@/components/browse/BrowseShelves'
import { MOVIE_GENRE_ROWS } from '@/lib/browse'

export default function MoviesPage() {
  const shelves = [
    { title: 'Trending this week',  path: '/trending/movie/week', type: 'movie' as const, variant: 'wide' as const },
    { title: 'Top Rated',            path: '/movie/top_rated',     type: 'movie' as const, variant: 'tall' as const },
    { title: 'Now Playing',          path: '/movie/now_playing',   type: 'movie' as const, variant: 'wide' as const },
    { title: 'Popular',              path: '/movie/popular',       type: 'movie' as const, variant: 'wide' as const },
    ...MOVIE_GENRE_ROWS.map(g => ({
      title:   g.label,
      sub:     'by genre',
      path:    '/discover/movie',
      type:    'movie' as const,
      params:  { with_genres: String(g.id), sort_by: 'popularity.desc', 'vote_count.gte': '200' },
      variant: 'wide' as const,
    })),
  ]

  return (
    <div className="home">
      <Nav />
      <div style={{ padding: '36px 56px 12px' }}>
        <h1 className="page-title">Movies</h1>
        <p className="page-title-sub">Trending, top-rated, and curated by genre.</p>
      </div>
      <BrowseShelves shelves={shelves} />
      <footer className="foot">
        <div>&copy; 2026 SoarTV</div>
        <div className="links"><a>Terms</a><a>Privacy</a><a>Help</a><a>About</a></div>
      </footer>
    </div>
  )
}
