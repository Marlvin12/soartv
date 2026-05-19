'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from './AuthContext'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WatchlistItem {
  id:        string
  mediaId:   string
  title:     string
  imageUrl:  string | null
  type:      'movie' | 'show'
  addedAt:   string
}

interface WatchlistCtx {
  watchlistIds:   Set<string>
  watchlistItems: WatchlistItem[]
  ready:          boolean
  toggleWatchlist: (item: Omit<WatchlistItem, 'id' | 'addedAt'>, onNeedAuth?: () => void) => Promise<void>
}

const WatchlistContext = createContext<WatchlistCtx>({
  watchlistIds:    new Set(),
  watchlistItems:  [],
  ready:           false,
  toggleWatchlist: async () => {},
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CACHE_KEY = (uid: string) => `soar_watchlist_${uid}`

function readCache(uid: string): { ids: string[]; items: WatchlistItem[] } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY(uid))
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  const [watchlistIds,   setWatchlistIds]   = useState<Set<string>>(new Set())
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([])
  const [ready,          setReady]          = useState(false)

  // Seed from localStorage cache immediately when user resolves
  useEffect(() => {
    if (!user) {
      setWatchlistIds(new Set())
      setWatchlistItems([])
      setReady(true)
      return
    }
    const cache = readCache(user.uid)
    if (cache) {
      setWatchlistIds(new Set(cache.ids))
      setWatchlistItems(cache.items)
      setReady(true)
    }
  }, [user])

  // Real-time Firestore sync
  useEffect(() => {
    if (!user) return
    const ref = collection(db, 'users', user.uid, 'watchlist')
    return onSnapshot(ref, snapshot => {
      const ids: string[]           = []
      const items: WatchlistItem[]  = []
      snapshot.forEach(d => {
        const data = d.data() as Omit<WatchlistItem, 'id'>
        ids.push(String(data.mediaId))
        items.push({ ...data, id: d.id })
      })
      const sorted = items.sort((a, b) => b.addedAt.localeCompare(a.addedAt))
      setWatchlistIds(new Set(ids))
      setWatchlistItems(sorted)
      setReady(true)
      try {
        localStorage.setItem(CACHE_KEY(user.uid), JSON.stringify({ ids, items: sorted }))
      } catch { /* quota exceeded */ }
    })
  }, [user])

  const toggleWatchlist = useCallback(async (
    item: Omit<WatchlistItem, 'id' | 'addedAt'>,
    onNeedAuth?: () => void,
  ) => {
    if (!user) { onNeedAuth?.(); return }
    const id  = String(item.mediaId)
    const ref = doc(db, 'users', user.uid, 'watchlist', id)
    if (watchlistIds.has(id)) {
      await deleteDoc(ref)
    } else {
      await setDoc(ref, { ...item, addedAt: new Date().toISOString() })
    }
  }, [user, watchlistIds])

  return (
    <WatchlistContext.Provider value={{ watchlistIds, watchlistItems, ready, toggleWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  )
}

export const useWatchlist = () => useContext(WatchlistContext)
