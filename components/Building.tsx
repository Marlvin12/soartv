'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  'Reading your night…',
  'Pulling threads from your picks…',
  'Lining up the right opening…',
  'Building your home…',
]

function useAmbientMusic() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    let ctx: AudioContext
    let masterGain: GainNode
    const oscs: OscillatorNode[] = []
    let closed = false

    // Must resume on first user gesture — try immediately, silent if blocked
    try {
      ctx = new AudioContext()
      masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(0, ctx.currentTime)

      // ── Layers: A-minor pad  A1–E2–A2 + high shimmer ──
      const add = (freq: number, type: OscillatorType, vol: number, detune = 0) => {
        const osc = ctx.createOscillator()
        const g   = ctx.createGain()
        osc.type           = type
        osc.frequency.value = freq
        osc.detune.value   = detune
        g.gain.value       = vol
        osc.connect(g)
        g.connect(masterGain)
        osc.start()
        oscs.push(osc)
      }

      // Bass root A1 — doubled with a few cents detune for warmth
      add(55,   'sine',     0.55)
      add(55,   'sine',     0.20,  6)
      add(55,   'sine',     0.12, -5)

      // Perfect fifth E2
      add(82.5, 'sine',     0.22)
      add(82.5, 'sine',     0.10,  8)

      // Octave A2
      add(110,  'sine',     0.18)
      add(110,  'triangle', 0.07, -9)

      // Upper shimmer A4 + A5 — very quiet
      add(440,  'sine',     0.06)
      add(880,  'sine',     0.03)

      // Slow LFO (0.12 Hz) → pulsing "breath" on the master level
      const lfo     = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.type            = 'sine'
      lfo.frequency.value = 0.12
      lfoGain.gain.value  = 0.06
      lfo.connect(lfoGain)
      lfoGain.connect(masterGain.gain)
      lfo.start()
      oscs.push(lfo)

      masterGain.connect(ctx.destination)

      // Fade in over 3 s
      masterGain.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 3)
    } catch {
      return
    }

    return () => {
      if (closed) return
      closed = true
      try {
        const now = ctx.currentTime
        masterGain.gain.setValueAtTime(masterGain.gain.value, now)
        masterGain.gain.linearRampToValueAtTime(0, now + 1.2)
        setTimeout(() => {
          oscs.forEach(o => { try { o.stop() } catch {} })
          ctx.close()
        }, 1400)
      } catch {}
    }
  }, [])
}

export default function Building({ onDone }: { onDone: () => void }) {
  const [idx, setIdx]     = useState(0)
  const [out, setOut]     = useState(false)
  const [shown, setShown] = useState(false)

  useAmbientMusic()

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 30)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (idx < STEPS.length - 1) {
      const t = setTimeout(() => setIdx(idx + 1), 700)
      return () => clearTimeout(t)
    } else {
      const tf = setTimeout(() => setOut(true), 900)
      const td = setTimeout(() => onDone(), 1600)
      return () => { clearTimeout(tf); clearTimeout(td) }
    }
  }, [idx, onDone])

  return (
    <div className={`building ${shown && !out ? 'show' : ''} ${out ? 'fade-out' : ''}`}>
      <div className="building-orb"/>
      <h2 className="building-title">Building your night{'…'}</h2>
      <div className="building-step">{STEPS[idx]}</div>
    </div>
  )
}
