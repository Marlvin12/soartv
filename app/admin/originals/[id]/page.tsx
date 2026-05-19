'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import PublishOriginal from '@/components/admin/PublishOriginal'

interface OriginalDoc {
  title:       string
  tmdbId:      number
  type:        'movie' | 'show'
  description: string
  published:   boolean
}

export default function EditOriginalPage() {
  const params              = useParams<{ id: string }>()
  const [data, setData]     = useState<OriginalDoc | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDoc(doc(db, 'originals', params.id))
      .then(snap => { if (snap.exists()) setData(snap.data() as OriginalDoc) })
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading…</div>
  if (!data)   return <div style={{ color: 'var(--muted)' }}>Original not found.</div>

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 28px', color: '#fff' }}>
        Edit: {data.title}
      </h1>
      <PublishOriginal originalId={params.id} initialData={data} />
    </div>
  )
}
