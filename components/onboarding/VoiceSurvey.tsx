'use client'

// ─────────────────────────────────────────────────────────────────────────────
// FilmFlow7 — Conversational Resonance Entry
// The "Voice" onboarding path. The user describes how they're arriving in free
// text; a keyword engine detects their resonance signature and mirrors it back
// with a first reflection, a follow-up question, and a second reflection before
// handing the detected archetype off to the poster survey.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from 'react'
import Brand from '@/components/Brand'
import {
  ENTRY_QUESTION,
  FIRST_REFLECTIONS,
  FOLLOW_UP_QUESTIONS,
  SECOND_REFLECTIONS,
  detectArchetype,
  pickReflection,
} from '@/lib/filmflow'
import { ARCHETYPES } from '@/lib/archetypes'
import type { ArchetypeId } from '@/lib/archetypes'

interface Slide { url: string }
type Phase = 'ask1' | 'followup' | 'closing' | 'reveal'

interface Props {
  onComplete:      (archetype: ArchetypeId) => void
  onSkip:          () => void
  onSwitchToCards: () => void
}

export default function VoiceSurvey({ onComplete, onSkip, onSwitchToCards }: Props) {
  const [phase,     setPhase]     = useState<Phase>('ask1')
  const [input1,    setInput1]    = useState('')
  const [input2,    setInput2]    = useState('')
  const [detected,  setDetected]  = useState<ArchetypeId | null>(null)
  const [firstRef,  setFirstRef]  = useState('')
  const [secondRef, setSecondRef] = useState('')
  const [speaking,  setSpeaking]  = useState(false)
  const [slides,    setSlides]    = useState<Slide[]>([])
  const [slideIdx,  setSlideIdx]  = useState(0)
  const [visible,   setVisible]   = useState(false)

  const audioRef    = useRef<HTMLAudioElement | null>(null)
  const abortRef    = useRef<AbortController | null>(null)
  const speakGenRef = useRef(0)        // guards async state after a newer speak()
  const doneRef     = useRef(false)    // ensures onComplete fires exactly once

  /* Backdrop slideshow */
  useEffect(() => {
    fetch('/api/tmdb?path=/trending/movie/week')
      .then(r => r.json())
      .then(data => setSlides(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data.results || []).filter((m: any) => m.backdrop_path).slice(0, 12)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((m: any) => ({ url: `https://image.tmdb.org/t/p/w780${m.backdrop_path}` }))
      ))
      .catch(() => {})
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (slides.length < 2) return
    const t = setInterval(() => setSlideIdx(i => (i + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  /* ElevenLabs speak — cancellation-safe. Calls onEnd on success, error, or
     when TTS is unavailable (204), so the flow never stalls. */
  const speak = useCallback((text: string, onEnd?: () => void) => {
    abortRef.current?.abort()
    audioRef.current?.pause()
    audioRef.current = null

    const gen        = ++speakGenRef.current
    const controller = new AbortController()
    abortRef.current = controller

    setSpeaking(true)
    ;(async () => {
      try {
        const res = await fetch(`/api/elevenlabs?text=${encodeURIComponent(text)}`, {
          signal: controller.signal,
        })
        if (gen !== speakGenRef.current) return
        if (res.status === 204 || !res.ok) { setSpeaking(false); onEnd?.(); return }

        const blob = await res.blob()
        if (gen !== speakGenRef.current) return

        const url   = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audioRef.current = audio
        const finish = () => {
          if (gen !== speakGenRef.current) return
          setSpeaking(false)
          URL.revokeObjectURL(url)
          onEnd?.()
        }
        audio.onended = finish
        audio.onerror = finish
        await audio.play()
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        if (gen === speakGenRef.current) { setSpeaking(false); onEnd?.() }
      }
    })()
  }, [])

  /* Stop audio on unmount */
  useEffect(() => () => {
    abortRef.current?.abort()
    audioRef.current?.pause()
    audioRef.current = null
  }, [])

  const finish = useCallback((arch: ArchetypeId) => {
    if (doneRef.current) return
    doneRef.current = true
    onComplete(arch)
  }, [onComplete])

  /* Turn 1: detect the resonance signature, mirror it, ask the follow-up */
  const submitFirst = () => {
    if (input1.trim().length < 2) return
    const { archetype } = detectArchetype(input1)
    const fr = pickReflection(FIRST_REFLECTIONS[archetype])
    setDetected(archetype)
    setFirstRef(fr)
    setInput2('')
    setPhase('followup')
    speak(`${fr} ${FOLLOW_UP_QUESTIONS[archetype]}`)
  }

  /* Turn 2: close with the second reflection, then move to the reveal */
  const submitSecond = () => {
    if (!detected || input2.trim().length < 2) return
    const sr = pickReflection(SECOND_REFLECTIONS[detected])
    setSecondRef(sr)
    setPhase('closing')
    speak(sr, () => setPhase('reveal'))
  }

  /* Reveal: name the signature, then hand off to the survey */
  useEffect(() => {
    if (phase !== 'reveal' || !detected) return
    const name = ARCHETYPES[detected].name
    speak(
      `Resonance pattern detected. You are arriving as the ${name}. Let's find the story that fits tonight.`,
      () => finish(detected),
    )
    // Fallback so the flow always advances even if audio is blocked
    const t = setTimeout(() => finish(detected), 9000)
    return () => clearTimeout(t)
  }, [phase, detected, speak, finish])

  const arch = detected ? ARCHETYPES[detected] : null

  return (
    <div className="vs-page">
      {/* Slideshow */}
      <div className="vs-bgs">
        {slides.map((s, i) => (
          <div key={i} className="vs-bg-slide" style={{ opacity: i === slideIdx ? 1 : 0 }}>
            <img src={s.url} alt="" className="vs-bg-img" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>
      <div className="vs-overlay" />

      {/* Nav */}
      <div className="vs-nav">
        <Brand />
        <div style={{ display: 'flex', gap: 16 }}>
          <button className="onb-skip" onClick={onSwitchToCards}>Switch to cards</button>
          <button className="onb-skip" onClick={onSkip}>Skip</button>
        </div>
      </div>

      {/* Main content */}
      <div
        className="vs-center"
        style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? 'none' : 'translateY(28px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        <div className="vs-orb-wrap">
          <div className={`vs-orb-xl ${speaking ? 'vs-orb-xl--on' : ''}`}>
            <div className="vs-orb-ring" />
          </div>
          <div className={`vs-waves-xl ${speaking ? 'vs-waves-xl--active' : ''}`}>
            {[0,1,2,3,4,5,6,7].map(i => (
              <span key={i} className="vs-wbar-xl" style={{
                animationDelay:    `${i * 0.08}s`,
                animationDuration: `${0.55 + (i % 4) * 0.2}s`,
              }} />
            ))}
          </div>
        </div>

        {/* ── Turn 1 ── */}
        {phase === 'ask1' && (
          <>
            <p className="vs-q">{ENTRY_QUESTION}</p>
            <div className="vs-form">
              <textarea
                className="vs-input"
                value={input1}
                onChange={e => setInput1(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitFirst() }
                }}
                placeholder="A word or a few sentences — tired, restless, wired, hopeful, lost…"
                autoFocus
                rows={3}
              />
              <button className="vs-send" onClick={submitFirst} disabled={input1.trim().length < 2}>
                Continue <ArrowIcon />
              </button>
              <p className="vs-hint">Be honest. Nothing here is graded.</p>
            </div>
          </>
        )}

        {/* ── Turn 2 ── */}
        {phase === 'followup' && detected && (
          <>
            <p className="vs-reflection">{firstRef}</p>
            <p className="vs-q">{FOLLOW_UP_QUESTIONS[detected]}</p>
            <div className="vs-form">
              <textarea
                className="vs-input"
                value={input2}
                onChange={e => setInput2(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitSecond() }
                }}
                placeholder="However you want to answer…"
                autoFocus
                rows={2}
              />
              <button className="vs-send" onClick={submitSecond} disabled={input2.trim().length < 2}>
                Continue <ArrowIcon />
              </button>
            </div>
          </>
        )}

        {/* ── Closing reflection ── */}
        {phase === 'closing' && (
          <>
            <p className="vs-reflection">{secondRef}</p>
            <p className="vs-hint">Reading your resonance pattern…</p>
          </>
        )}

        {/* ── Reveal ── */}
        {phase === 'reveal' && arch && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'sheet-in 0.5s cubic-bezier(.2,.7,.2,1)' }}>
            <p className="vs-reveal-label">Resonance Pattern Detected</p>
            <h2 className="vs-reveal-name">{arch.name}</h2>
            <p className="vs-reflection" style={{ margin: '0 0 6px' }}>&ldquo;{arch.tagline}&rdquo;</p>
            <p className="vs-hint">Finding the story that fits tonight…</p>
          </div>
        )}
      </div>

      <style>{`@keyframes sheet-in { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}
