'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface OriginalDoc {
  id:          string
  title:       string
  tmdbId:      number
  type:        'movie' | 'show'
  description: string
  published:   boolean
  createdAt:   number
  productCount?: number
}

export default function AdminDashboard() {
  const [originals, setOriginals] = useState<OriginalDoc[]>([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'originals'), orderBy('createdAt', 'desc'), limit(20))
    return onSnapshot(q, snap => {
      setOriginals(snap.docs.map(d => ({ id: d.id, ...d.data() } as OriginalDoc)))
      setLoading(false)
    })
  }, [])

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', margin: '0 0 6px', color: '#fff' }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0 }}>Manage SoarTV Originals and Shop This Scene products.</p>
        </div>
        <Link href="/admin/originals/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 12,
          background: 'linear-gradient(135deg,#7c5cfc,#b4a7ff)',
          color: '#0a0a0e', fontSize: 14, fontWeight: 700, textDecoration: 'none',
        }}>
          <PlusIcon /> New Original
        </Link>
      </div>

      {/* stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 36 }}>
        <StatCard label="Originals" value={originals.length} />
        <StatCard label="Published" value={originals.filter(o => o.published).length} />
        <StatCard label="Drafts"    value={originals.filter(o => !o.published).length} />
      </div>

      {/* originals table */}
      <Section label="Originals">
        {loading ? (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--muted)' }}>Loading…</div>
        ) : originals.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
            No originals yet. <Link href="/admin/originals/new" style={{ color: '#b4a7ff' }}>Publish your first →</Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                {['Title', 'Type', 'TMDB ID', 'Status', ''].map(h => (
                  <Th key={h}>{h}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {originals.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <Td>
                    <span style={{ fontWeight: 500, color: '#fff' }}>{o.title}</span>
                  </Td>
                  <Td>
                    <Badge>{o.type}</Badge>
                  </Td>
                  <Td>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--muted)' }}>{o.tmdbId}</span>
                  </Td>
                  <Td>
                    <Badge accent={o.published ? '#4ade80' : 'var(--muted)'}>
                      {o.published ? 'Published' : 'Draft'}
                    </Badge>
                  </Td>
                  <Td>
                    <Link href={`/admin/originals/${o.id}`} style={{ fontSize: 12, color: '#b4a7ff', fontWeight: 600 }}>
                      Edit →
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ padding: '20px 22px', borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--line)' }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 8px' }}>{label}</p>
      <p style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', margin: 0 }}>{value}</p>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>{label}</p>
      <div style={{ borderRadius: 16, border: '1px solid var(--line)', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>{children}</th>
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: '14px 16px', fontSize: 14, color: 'var(--text-dim)' }}>{children}</td>
}

function Badge({ children, accent = 'var(--muted)' }: { children: React.ReactNode; accent?: string }) {
  return (
    <span style={{ padding: '3px 9px', borderRadius: 6, background: `color-mix(in srgb,${accent} 15%,transparent)`, border: `1px solid color-mix(in srgb,${accent} 30%,transparent)`, fontSize: 11, fontWeight: 600, color: accent, textTransform: 'capitalize' }}>
      {children}
    </span>
  )
}

function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="7" y1="2" x2="7" y2="12"/><line x1="2" y1="7" x2="12" y2="7"/></svg>
}
