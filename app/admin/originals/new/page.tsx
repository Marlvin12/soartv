'use client'

import { useRouter } from 'next/navigation'
import PublishOriginal from '@/components/admin/PublishOriginal'

export default function NewOriginalPage() {
  const router = useRouter()
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 28px', color: '#fff' }}>
        Publish New Original
      </h1>
      <PublishOriginal onSaved={id => router.push(`/admin/originals/${id}`)} />
    </div>
  )
}
