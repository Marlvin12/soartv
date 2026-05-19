import type { MediaItem } from '@/types'
import { normalizeMovie, normalizeTV, IMG_500 } from '@/lib/tmdb'

export async function fetchShelf(
  path: string,
  type: 'movie' | 'tv',
  params: Record<string, string> = {},
): Promise<MediaItem[]> {
  const qs = new URLSearchParams({ path, ...params })
  try {
    const res = await fetch(`/api/tmdb?${qs}`)
    if (!res.ok) return []
    const data = await res.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.results ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((m: any) => m.poster_path)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((m: any) => type === 'movie' ? normalizeMovie(m) : normalizeTV(m))
      .slice(0, 20)
  } catch { return [] }
}

export { IMG_500 }

// Genre options exposed for movies/tv browse rows
export const MOVIE_GENRE_ROWS = [
  { id: 28,    label: 'Action' },
  { id: 18,    label: 'Drama' },
  { id: 35,    label: 'Comedy' },
  { id: 878,   label: 'Sci-Fi' },
  { id: 27,    label: 'Horror' },
  { id: 10749, label: 'Romance' },
  { id: 16,    label: 'Animation' },
  { id: 53,    label: 'Thriller' },
]

export const TV_GENRE_ROWS = [
  { id: 18,    label: 'Drama' },
  { id: 35,    label: 'Comedy' },
  { id: 10759, label: 'Action & Adventure' },
  { id: 10765, label: 'Sci-Fi & Fantasy' },
  { id: 80,    label: 'Crime' },
  { id: 9648,  label: 'Mystery' },
  { id: 16,    label: 'Animation' },
  { id: 10764, label: 'Reality' },
]
