'use client'

import { useEffect, useState } from 'react'
import Nav from './Nav'
import Hero from './Hero'
import Shelf from './Shelf'
import Brands from './Brands'
import PersonalCallout from './PersonalCallout'
import LoadingSkeleton from './LoadingSkeleton'
import { MOVIES, MOOD_COPY } from '@/lib/catalog'
import { fetchHomeData, type HomeData } from '@/lib/tmdb'
import { idToProgress } from '@/lib/utils'
import type { Answers, MediaItem } from '@/types'

interface Props {
  answers:  Answers
  onRetake: () => void
}

export default function Home({ answers, onRetake }: Props) {
  const [data, setData] = useState<HomeData | null>(null)

  useEffect(() => {
    const mood = answers.mood || 'curious'
    fetchHomeData(mood)
      .then(d => setData(d))
      .catch(() => setData({ hero: null, forYou: [], upNext: [], originals: [], topRated: [], because: [] }))
  }, [answers])

  if (!data) return <LoadingSkeleton onRetake={onRetake}/>

  const mood           = answers.mood || 'curious'
  const { hero, forYou, upNext, originals, topRated, because } = data
  const upNextProgress = upNext.map(s => idToProgress(s.id))
  const firstPickTitle = MOVIES[answers.firstPick]?.title || 'your picks'

  return (
    <div className="home">
      <Nav onRetake={onRetake}/>
      {hero && <Hero item={hero} mood={mood}/>}
      <PersonalCallout answers={answers}/>
      <Shelf title="Tonight, for you" sub={MOOD_COPY[mood]?.hint} items={forYou} variant="wide"/>
      <Shelf title="Up Next" items={upNext} variant="upnext" progressMap={upNextProgress}/>
      <Shelf title="Soar Originals" items={originals} variant="original"/>
      <div className="divider"/>
      <Shelf title="Films we think you&apos;ll love" items={topRated} variant="tall"/>
      <Brands/>
      <Shelf title={`Because you picked ${firstPickTitle}`} items={because} variant="wide"/>
      <footer className="foot">
        <div>&copy; 2026 SoarTV</div>
        <div className="links"><a>Terms</a><a>Privacy</a><a>Help</a><a>About</a></div>
      </footer>
    </div>
  )
}
