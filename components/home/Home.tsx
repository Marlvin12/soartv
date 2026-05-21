'use client'

import { useEffect, useState } from 'react'
import Nav from './Nav'
import Hero from './Hero'
import Shelf from './Shelf'
import Brands from './Brands'
import PersonalCallout from './PersonalCallout'
import LoadingSkeleton from './LoadingSkeleton'
import ResonanceJourneyRow from './ResonanceJourneyRow'
import { fetchHomeData, type HomeData } from '@/lib/tmdb'
import { idToProgress } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { ARCHETYPES, resolveArchetype } from '@/lib/archetypes'
import type { ArchetypeId } from '@/lib/archetypes'
import type { Answers, MediaItem, ResonanceProfile } from '@/types'

interface Props {
  answers:  Answers
  onRetake: () => void
}

const MOOD_HINT: Record<string, string> = {
  curious:   'Expand your mind tonight',
  heavy:     'Go somewhere real and deep',
  quiet:     'Slow, tender, honest',
  tender:    'Feel something warm',
  restless:  'Keep moving, keep feeling',
  wired:     'High energy, high stakes',
  wandering: 'Let yourself get lost',
}

export default function Home({ answers, onRetake }: Props) {
  const { user }              = useAuth()
  const [data, setData]       = useState<HomeData | null>(null)
  const [archetype, setArch]  = useState<ArchetypeId | null>(null)

  useEffect(() => {
    const mood = answers.mood || 'curious'
    fetchHomeData(mood)
      .then(d => setData(d))
      .catch(() => setData({ hero: null, forYou: [], upNext: [], originals: [], topRated: [], because: [] }))
  }, [answers])

  useEffect(() => {
    if (!user) return
    return onSnapshot(
      doc(db, 'users', user.uid, 'resonanceProfile', 'current'),
      snap => {
        if (snap.exists()) setArch(resolveArchetype((snap.data() as ResonanceProfile).archetype))
      }
    )
  }, [user])

  if (!data) return <LoadingSkeleton onRetake={onRetake}/>

  const mood            = answers.mood || 'curious'
  const { hero, forYou, upNext, originals, topRated, because } = data
  const upNextProgress  = upNext.map((s: MediaItem) => idToProgress(s.id))
  const moodHint        = MOOD_HINT[mood] ?? ''
  const archetypeName   = archetype ? ARCHETYPES[archetype].name : null

  return (
    <div className="home">
      <Nav onRetake={onRetake}/>
      {hero && <Hero item={hero} mood={mood}/>}
      <PersonalCallout answers={answers}/>

      {/* archetype greeting */}
      {archetypeName && (
        <div style={{ margin: '28px 56px 0', padding: '16px 22px', borderRadius: 16, background: 'linear-gradient(135deg,rgba(232,200,122,0.1),rgba(232,200,122,0.02))', border: '1px solid rgba(232,200,122,0.15)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e8c87a', boxShadow: '0 0 12px rgba(232,200,122,0.6)', flexShrink: 0 }} />
          <span style={{ fontSize: 14, color: 'var(--text-dim)' }}>
            Curated for <strong style={{ color: '#e8c87a' }}>{archetypeName}</strong>
          </span>
        </div>
      )}

      <Shelf title="Tonight, for you" sub={moodHint} items={forYou} variant="wide"/>
      <Shelf title="Up Next" items={upNext} variant="upnext" progressMap={upNextProgress}/>

      {/* resonance journey rows — only shown when archetype is known */}
      {archetype && <ResonanceJourneyRow archetype={archetype} />}

      <Shelf title="Soar Originals" items={originals} variant="original"/>
      <div className="divider"/>
      <Shelf title="Films we think you&apos;ll love" items={topRated} variant="tall"/>
      <Brands/>
      {because.length > 0 && <Shelf title="Trending this week" items={because} variant="wide"/>}

      <footer className="foot">
        <div>&copy; 2026 SoarTV</div>
        <div className="links"><a>Terms</a><a>Privacy</a><a>Help</a><a>About</a></div>
      </footer>
    </div>
  )
}
