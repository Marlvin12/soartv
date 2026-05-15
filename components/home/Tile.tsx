'use client'

import Image from 'next/image'
import Icon from '@/components/Icon'
import { titleGradient } from '@/lib/utils'
import type { MediaItem } from '@/types'

interface Props {
  item: MediaItem
  variant?: 'wide' | 'tall' | 'upnext' | 'original'
  progress?: number
}

export default function Tile({ item, variant = 'wide', progress }: Props) {
  return (
    <div className={`tile ${variant}`}>
      {item.imageUrl ? (
        <Image
          className="poster"
          src={item.imageUrl}
          alt=""
          fill
          sizes={variant === 'original' ? '420px' : variant === 'tall' ? '200px' : variant === 'upnext' ? '360px' : '320px'}
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      ) : (
        <div className="fallback" style={{ background: titleGradient(item.title) }}/>
      )}
      {variant === 'upnext' && (
        <>
          <div className="play-fab"><Icon name="play" size={14}/></div>
          <div className="progress"><i style={{ width: `${progress}%` }}/></div>
        </>
      )}
      {variant === 'original' && <div className="pin">SOAR ORIGINAL</div>}
      <div className="label">
        <div className="t">{item.title}</div>
        <div className="s">
          {variant === 'upnext'
            ? `${item.genre} · ${progress}% watched`
            : `${item.genre}${item.year ? ' · ' + item.year : ''}`}
        </div>
      </div>
    </div>
  )
}
