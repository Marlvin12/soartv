'use client'

import { useRef } from 'react'
import Icon from '@/components/Icon'
import Tile from './Tile'
import type { MediaItem } from '@/types'

interface Props {
  title: string
  sub?: string
  items: MediaItem[]
  variant?: 'wide' | 'tall' | 'upnext' | 'original'
  progressMap?: number[]
}

export default function Shelf({ title, sub, items, variant = 'wide', progressMap }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' })

  if (!items?.length) return null

  return (
    <section className="shelf">
      <div className="shelf-head">
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <h2 className="shelf-title">{title}</h2>
          {sub && <span className="shelf-sub">{sub}</span>}
        </div>
        <a className="shelf-link">See All <Icon name="chevR" size={12}/></a>
      </div>
      <div className="shelf-wrap">
        <button className="shelf-arrow l" onClick={() => scroll(-1)}><Icon name="chevL" size={18}/></button>
        <div className="shelf-track" ref={ref}>
          {items.map((item, i) => (
            <Tile key={item.id + i} item={item} variant={variant} progress={progressMap?.[i]}/>
          ))}
        </div>
        <button className="shelf-arrow r" onClick={() => scroll(1)}><Icon name="chevR" size={18}/></button>
      </div>
    </section>
  )
}
