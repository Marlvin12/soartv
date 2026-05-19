'use client'

import { useEffect, useState } from 'react'
import Shelf from '@/components/home/Shelf'
import type { MediaItem } from '@/types'
import { fetchShelf } from '@/lib/browse'

interface ShelfSpec {
  title:    string
  sub?:     string
  path:     string
  type:     'movie' | 'tv'
  params?:  Record<string, string>
  variant?: 'wide' | 'tall' | 'upnext' | 'original'
}

interface Props {
  shelves: ShelfSpec[]
}

export default function BrowseShelves({ shelves }: Props) {
  const [data, setData] = useState<Record<string, MediaItem[]>>({})

  useEffect(() => {
    let cancelled = false
    shelves.forEach(spec => {
      fetchShelf(spec.path, spec.type, spec.params).then(items => {
        if (!cancelled) setData(prev => ({ ...prev, [spec.title]: items }))
      })
    })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {shelves.map(spec => {
        const items = data[spec.title]
        if (items === undefined) {
          return <ShelfSkeleton key={spec.title} title={spec.title} sub={spec.sub} variant={spec.variant} />
        }
        if (items.length === 0) return null
        return (
          <Shelf
            key={spec.title}
            title={spec.title}
            sub={spec.sub}
            items={items}
            variant={spec.variant ?? 'wide'}
          />
        )
      })}
    </>
  )
}

function ShelfSkeleton({ title, sub, variant }: { title: string; sub?: string; variant?: string }) {
  return (
    <section className="shelf">
      <div className="shelf-head">
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <h2 className="shelf-title">{title}</h2>
          {sub && <span className="shelf-sub">{sub}</span>}
        </div>
      </div>
      <div className="shelf-track" style={{ pointerEvents: 'none' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`tile ${variant ?? 'wide'} skeleton`} />
        ))}
      </div>
    </section>
  )
}
