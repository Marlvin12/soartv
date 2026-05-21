'use client'

import { useState, useRef } from 'react'
import { ARCHETYPES, resolveArchetype } from '@/lib/archetypes'
import type { ArchetypeId } from '@/lib/archetypes'
import type { ResonanceProfile } from '@/types'

interface Props {
  profile:  ResonanceProfile
  onEnter:  () => void  // "Enter SoarTV" button
}

export default function InsightsReveal({ profile, onEnter }: Props) {
  const archId    = resolveArchetype(profile.archetype)
  const arch      = ARCHETYPES[archId]
  const secondary = ARCHETYPES[resolveArchetype(profile.secondary)]
  const [playing, setPlaying]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const audioRef                = useRef<HTMLAudioElement | null>(null)

  const totalScore  = Object.values(profile.scores).reduce((s, v) => s + v, 0)
  const topArchs    = (Object.entries(profile.scores) as [ArchetypeId, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  const voiceText = [
    `You are ${arch.name}.`,
    arch.tagline,
    `Your core desire: ${arch.coreDesire}`,
    `Your gift to the world — ${arch.gift}`,
    `And an invitation for you: ${arch.invitation}`,
  ].join(' ')

  const handleListen = async () => {
    if (playing) {
      audioRef.current?.pause()
      setPlaying(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/elevenlabs?text=${encodeURIComponent(voiceText)}`)
      if (!res.ok || res.status === 204) { setLoading(false); return }
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => setPlaying(false)
      await audio.play()
      setPlaying(true)
    } catch { /* graceful fallback */ }
    finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '60px 24px 100px', overflowY: 'auto',
    }}>
      {/* orbital orb */}
      <div style={{
        width: 96, height: 96, borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%,#fff,#b4a7ff 40%,#4c1d95 100%)',
        boxShadow: '0 0 60px rgba(180,167,255,0.5)', marginBottom: 28, flexShrink: 0,
        animation: 'orb-pulse 2.4s ease-in-out infinite',
      }} />

      {/* archetype name */}
      <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--soar)', marginBottom: 10 }}>
        Your Resonance Archetype
      </p>
      <h1 style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 700, letterSpacing: '-0.035em', margin: '0 0 8px', textAlign: 'center', color: '#fff' }}>
        {arch.name}
      </h1>
      <p style={{ fontSize: 18, color: 'var(--text-dim)', margin: '0 0 28px', fontStyle: 'italic', textAlign: 'center' }}>
        &ldquo;{arch.tagline}&rdquo;
      </p>

      {/* listen button */}
      <button onClick={handleListen} style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px',
        borderRadius: 999, border: '1px solid rgba(180,167,255,0.3)',
        background: playing ? 'rgba(180,167,255,0.15)' : 'rgba(180,167,255,0.08)',
        color: '#b4a7ff', fontSize: 13, fontWeight: 600, marginBottom: 52,
        transition: 'background 0.2s',
      }}>
        {loading ? <SpinnerIcon /> : playing ? <PauseIcon /> : <PlayIcon />}
        {loading ? 'Loading…' : playing ? 'Pause' : '▶ Listen to your profile'}
      </button>

      {/* cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16, width: '100%', maxWidth: 900 }}>
        <Card label="Core Fear" text={arch.coreFear} accent="#f87171" />
        <Card label="Core Desire" text={arch.coreDesire} accent="#4ade80" />
        <Card label="Your Gift" text={arch.gift} accent="#b4a7ff" />
        <Card label="Invitation" text={arch.invitation} accent="#60a5fa" />
      </div>

      {/* physical + emotional patterns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%', maxWidth: 900, marginTop: 16 }}>
        <ListCard label="Physical Patterns" items={arch.physicalPatterns} />
        <ListCard label="Emotional Patterns" items={arch.emotionalPatterns} />
      </div>

      {/* secondary archetype */}
      <div style={{ width: '100%', maxWidth: 900, marginTop: 16, padding: '18px 22px', borderRadius: 18, background: 'var(--bg-card)', border: '1px solid var(--line)' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Secondary Archetype</p>
        <p style={{ fontSize: 18, fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>{secondary.name}</p>
        <p style={{ fontSize: 14, color: 'var(--text-dim)', margin: 0 }}>{secondary.tagline}</p>
      </div>

      {/* brands */}
      <div style={{ width: '100%', maxWidth: 900, marginTop: 16, padding: '18px 22px', borderRadius: 18, background: 'var(--bg-card)', border: '1px solid var(--line)' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Brand Alignment</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {arch.brandAlignment.map(b => (
            <span key={b} style={{ padding: '5px 12px', borderRadius: 999, background: 'rgba(180,167,255,0.1)', border: '1px solid rgba(180,167,255,0.2)', fontSize: 13, color: '#b4a7ff', fontWeight: 500 }}>{b}</span>
          ))}
        </div>
      </div>

      {/* score breakdown */}
      <div style={{ width: '100%', maxWidth: 900, marginTop: 16, padding: '18px 22px', borderRadius: 18, background: 'var(--bg-card)', border: '1px solid var(--line)' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>Resonance Breakdown</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topArchs.map(([id, score]) => {
            const pct = totalScore > 0 ? Math.round((score / totalScore) * 100) : 0
            return (
              <div key={id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: id === profile.archetype ? '#b4a7ff' : 'var(--text-dim)' }}>
                    {ARCHETYPES[resolveArchetype(id)].name}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{pct}%</span>
                </div>
                <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{
                    height: '100%', borderRadius: 4, width: `${pct}%`,
                    background: id === profile.archetype ? 'linear-gradient(90deg,#7c5cfc,#b4a7ff)' : 'rgba(255,255,255,0.2)',
                    transition: 'width 1s cubic-bezier(.2,.7,.2,1)',
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* integrated path */}
      <div style={{ width: '100%', maxWidth: 900, marginTop: 16, marginBottom: 40, padding: '22px', borderRadius: 18, background: 'linear-gradient(135deg,rgba(180,167,255,0.12),rgba(180,167,255,0.02))', border: '1px solid rgba(180,167,255,0.2)' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--soar)', marginBottom: 8 }}>Your Integrated Path</p>
        <p style={{ fontSize: 22, fontWeight: 600, color: '#fff', margin: '0 0 6px' }}>{arch.integratedPathName}</p>
        <p style={{ fontSize: 15, color: 'var(--text-dim)', margin: 0, lineHeight: 1.6 }}>{arch.integratedPathDesc}</p>
      </div>

      <button
        onClick={onEnter}
        style={{
          padding: '16px 48px', borderRadius: 999, background: '#fff', color: '#0a0a0e',
          fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em',
          boxShadow: '0 0 40px rgba(255,255,255,0.15)', cursor: 'pointer', border: 'none',
          transition: 'transform 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
      >
        Enter SoarTV ✦
      </button>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Card({ label, text, accent }: { label: string; text: string; accent: string }) {
  return (
    <div style={{ padding: '18px 20px', borderRadius: 18, background: 'var(--bg-card)', border: '1px solid var(--line)' }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 15, color: 'var(--text-dim)', margin: 0, lineHeight: 1.6 }}>{text}</p>
    </div>
  )
}

function ListCard({ label, items }: { label: string; items: string[] }) {
  return (
    <div style={{ padding: '18px 20px', borderRadius: 18, background: 'var(--bg-card)', border: '1px solid var(--line)' }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>{label}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map(item => (
          <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-dim)' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--soar)', flexShrink: 0 }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function PlayIcon() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><path d="M3 2l8 4.5L3 11V2z"/></svg>
}
function PauseIcon() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><rect x="2" y="2" width="3.5" height="9" rx="1"/><rect x="7.5" y="2" width="3.5" height="9" rx="1"/></svg>
}
function SpinnerIcon() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="22" strokeDashoffset="8" strokeLinecap="round"/><style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style></svg>
}
