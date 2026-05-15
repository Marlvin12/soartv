import type { MediaItem } from '@/types'

export const IMG_500  = 'https://image.tmdb.org/t/p/w500'
export const IMG_1280 = 'https://image.tmdb.org/t/p/w1280'

export const MOVIE_GENRES: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 27: 'Horror',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller', 37: 'Western',
}

export const TV_GENRES: Record<number, string> = {
  10759: 'Action & Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  18: 'Drama', 10751: 'Family', 9648: 'Mystery', 10765: 'Sci-Fi & Fantasy', 37: 'Western',
}

export const MOOD_MOVIE_GENRES: Record<string, string> = {
  heavy:    '18,80,53',
  quiet:    '18,10749',
  tender:   '10749,10751,18',
  restless: '28,80,12',
  wired:    '28,878,35',
  curious:  '878,9648,14',
  wandering:'12,14,37',
}

export const MOOD_TV_GENRES: Record<string, string> = {
  heavy:    '18,80',
  quiet:    '18',
  tender:   '18,10751',
  restless: '10759,80',
  wired:    '10759,10765,35',
  curious:  '10765,9648',
  wandering:'10759',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeMovie(m: any): MediaItem {
  return {
    id:          `m-${m.id}`,
    title:       m.title || 'Untitled',
    sub:         (m.overview || '').slice(0, 90),
    desc:        m.overview || '',
    year:        (m.release_date || '').slice(0, 4),
    genre:       MOVIE_GENRES[m.genre_ids?.[0] as number] || 'Film',
    rating:      m.vote_average ? Number(m.vote_average).toFixed(1) : null,
    imageUrl:    m.poster_path   ? IMG_500  + m.poster_path   : null,
    backdropUrl: m.backdrop_path ? IMG_1280 + m.backdrop_path : null,
    type:        'movie',
    rated:       'PG-13',
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeTV(s: any): MediaItem {
  return {
    id:          `tv-${s.id}`,
    title:       s.name || 'Untitled',
    sub:         (s.overview || '').slice(0, 90),
    desc:        s.overview || '',
    year:        (s.first_air_date || '').slice(0, 4),
    genre:       TV_GENRES[s.genre_ids?.[0] as number] || 'Series',
    rating:      s.vote_average ? Number(s.vote_average).toFixed(1) : null,
    imageUrl:    s.poster_path   ? IMG_500  + s.poster_path   : null,
    backdropUrl: s.backdrop_path ? IMG_1280 + s.backdrop_path : null,
    type:        'show',
    rated:       'TV-MA',
  }
}

async function apiFetch(path: string, params: Record<string, string> = {}): Promise<{ results: MediaItem[] }> {
  const qs = new URLSearchParams({ path, ...params })
  const res = await fetch(`/api/tmdb?${qs}`)
  if (!res.ok) return { results: [] }
  return res.json()
}

export interface HomeData {
  hero:      MediaItem | null
  forYou:    MediaItem[]
  upNext:    MediaItem[]
  originals: MediaItem[]
  topRated:  MediaItem[]
  because:   MediaItem[]
}

export async function fetchHomeData(mood: string): Promise<HomeData> {
  const mg = MOOD_MOVIE_GENRES[mood] || '18'
  const tg = MOOD_TV_GENRES[mood]    || '18'

  const [moodMovies, moodTV, popularTV, topMovies, trending] = await Promise.all([
    apiFetch('/discover/movie', { with_genres: mg, sort_by: 'vote_average.desc', 'vote_count.gte': '500' }),
    apiFetch('/discover/tv',    { with_genres: tg, sort_by: 'vote_average.desc', 'vote_count.gte': '100' }),
    apiFetch('/tv/popular'),
    apiFetch('/movie/top_rated'),
    apiFetch('/trending/movie/week'),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mm  = (moodMovies.results || []).map((x: any) => normalizeMovie(x)).filter((x: MediaItem) => x.imageUrl)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mt  = (moodTV.results     || []).map((x: any) => normalizeTV(x)).filter((x: MediaItem) => x.imageUrl)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tv  = (popularTV.results  || []).map((x: any) => normalizeTV(x)).filter((x: MediaItem) => x.imageUrl)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const top = (topMovies.results  || []).map((x: any) => normalizeMovie(x)).filter((x: MediaItem) => x.imageUrl)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tr  = (trending.results   || []).map((x: any) => normalizeMovie(x)).filter((x: MediaItem) => x.imageUrl)

  const hero = mm.find((x: MediaItem) => x.backdropUrl) ?? mt.find((x: MediaItem) => x.backdropUrl) ?? mm[0] ?? null

  const forYou: MediaItem[] = []
  let mi = 0, ti = 0
  while (forYou.length < 10 && (mi < mm.length || ti < mt.length)) {
    if (mi < mm.length) forYou.push(mm[mi++])
    if (forYou.length < 10 && ti < mt.length) forYou.push(mt[ti++])
  }

  return {
    hero,
    forYou,
    upNext:    tv.slice(0, 6),
    originals: tv.slice(6, 12),
    topRated:  top.slice(0, 10),
    because:   tr.slice(0, 8),
  }
}
