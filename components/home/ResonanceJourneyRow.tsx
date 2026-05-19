'use client'

import { useEffect, useState } from 'react'
import Shelf from './Shelf'
import type { MediaItem } from '@/types'
import type { ArchetypeId } from '@/lib/archetypes'
import { ARCHETYPES } from '@/lib/archetypes'

interface Props {
  archetype: ArchetypeId
}

export default function ResonanceJourneyRow({ archetype }: Props) {
  const arch     = ARCHETYPES[archetype]
  const journeys = arch.journeys

  const [rows, setRows] = useState<{ label: string; items: MediaItem[] }[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      const results = await Promise.all(
        journeys.map(async (j) => {
          const genreStr = j.genres.join(',')
          try {
            const res  = await fetch(`/api/tmdb?path=/discover/movie&with_genres=${genreStr}&sort_by=vote_average.desc&vote_count.gte=300`)
            const data = await res.json()
            const items: MediaItem[] = (data.results ?? [])
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .filter((m: any) => m.poster_path)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .slice(0, 10)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((m: any): MediaItem => ({
                id:          `m-${m.id}`,
                title:       m.title || 'Untitled',
                sub:         (m.overview || '').slice(0, 90),
                desc:        m.overview || '',
                year:        (m.release_date || '').slice(0, 4),
                genre:       'Film',
                rating:      m.vote_average ? String(Number(m.vote_average).toFixed(1)) : null,
                imageUrl:    `https://image.tmdb.org/t/p/w500${m.poster_path}`,
                backdropUrl: m.backdrop_path ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}` : null,
                type:        'movie',
                rated:       'PG-13',
              }))
            return { label: j.label, items }
          } catch {
            return { label: j.label, items: [] }
          }
        })
      )
      if (!cancelled) setRows(results.filter(r => r.items.length > 0))
    }

    load()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetype])

  if (rows.length === 0) return null

  return (
    <>
      {rows.map(row => (
        <Shelf
          key={row.label}
          title={row.label}
          items={row.items}
          variant="wide"
        />
      ))}
    </>
  )
}
