'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Brand from '@/components/Brand'
import { MOVIES, MOOD_COPY, Q1_TITLES, Q2_OPTIONS, Q3_OPTIONS } from '@/lib/catalog'
import type { Answers } from '@/types'

interface Slide { url: string }

const SCRIPTS = [
  'Pick a film that resonates with you right now. Your options are: Halfway Home, Night Vault, Iron Meridian, Lakeshore Static, Polar Roses, or Bright Animal. Go with whichever pulls you.',
  'How are you arriving tonight? You can be: Wired and restless, Quietly heavy, Curious, Tender, Wandering, or Just unwinding.',
  'Last one — how much do you want to feel tonight? Keep you company, move you, or wreck you a little?',
]

const STEP_KEYS: (keyof Answers)[] = ['firstPick', 'mood', 'intensity']

const INTENSITY_LABEL: Record<string, string> = {
  company: 'easy company — nothing too heavy',
  move:    'something you will remember',
  wreck:   'something that will wreck you a little',
}

function buildSummary(a: Answers): string {
  const movie     = MOVIES[a.firstPick]?.title   || 'your pick'
  const mood      = MOOD_COPY[a.mood]?.label?.toLowerCase() || 'your mood'
  const intensity = INTENSITY_LABEL[a.intensity] || 'your night'
  return `Perfect. You chose ${movie}. You are arriving ${mood}. And you want ${intensity}. Let me build your night now.`
}

interface Props {
  onComplete:      (a: Answers) => void
  onSkip:          () => void
  onSwitchToCards: () => void
}

export default function VoiceSurvey({ onComplete, onSkip, onSwitchToCards }: Props) {
  const [step, setStep]           = useState(0)
  const [answers, setAnswers]     = useState<Answers>({ firstPick: '', mood: '', intensity: '' })
  const [speaking, setSpeaking]   = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [slides, setSlides]       = useState<Slide[]>([])
  const [slideIdx, setSlideIdx]   = useState(0)
  const [visible, setVisible]     = useState(false)

  const audioRef      = useRef<HTMLAudioElement | null>(null)
  const speakIdRef    = useRef(0)
  const finalRef      = useRef<Answers>({ firstPick: '', mood: '', intensity: '' })

  /* Backdrop slides */
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

  /* ElevenLabs speak — cancellation-safe */
  const speak = useCallback(async (text: string, onEnd?: () => void) => {
    const id = ++speakIdRef.current
    audioRef.current?.pause()
    audioRef.current = null
    setSpeaking(true)
    try {
      const res = await fetch(`/api/elevenlabs?text=${encodeURIComponent(text)}`)
      if (id !== speakIdRef.current) return
      if (res.status === 204 || !res.ok) { setSpeaking(false); onEnd?.(); return }
      const blob  = await res.blob()
      if (id !== speakIdRef.current) return
      const url   = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => {
        if (id !== speakIdRef.current) return
        setSpeaking(false); URL.revokeObjectURL(url); onEnd?.()
      }
      audio.onerror = () => { if (id === speakIdRef.current) { setSpeaking(false); onEnd?.() } }
      audio.play()
    } catch {
      if (id === speakIdRef.current) { setSpeaking(false); onEnd?.() }
    }
  }, [])

  /* Speak question on each step */
  useEffect(() => {
    speak(SCRIPTS[step])
    return () => {
      speakIdRef.current++
      audioRef.current?.pause()
      audioRef.current = null
      setSpeaking(false)
    }
  }, [step, speak])

  const select = (value: string) => {
    const key  = STEP_KEYS[step]
    const next = { ...answers, [key]: value }
    setAnswers(next)

    if (step < 2) {
      setTimeout(() => setStep(s => s + 1), 200)
    } else {
      /* Final step: voice responds with summary, then route */
      finalRef.current = next
      setFinishing(true)
      speakIdRef.current++         // cancel current step audio
      audioRef.current?.pause()
      audioRef.current = null
      speak(buildSummary(next), () => onComplete(finalRef.current))
    }
  }

  const opts0 = Q1_TITLES.map(id => ({ id, label: MOVIES[id].title }))
  const opts1 = Q2_OPTIONS.map(o  => ({ id: o.id, label: o.name }))
  const opts2 = Q3_OPTIONS.map(o  => ({ id: o.id, label: o.name }))
  const opts  = [opts0, opts1, opts2][step]

  return (
    <div className="vs-page">

      {/* Slideshow */}
      <div className="vs-bgs">
        {slides.map((s, i) => (
          <div key={i} className="vs-bg-slide" style={{ opacity: i === slideIdx ? 1 : 0 }}>
            <img src={s.url} alt="" className="vs-bg-img" loading={i === 0 ? 'eager' : 'lazy'}/>
          </div>
        ))}
      </div>
      <div className="vs-overlay"/>

      {/* Nav */}
      <div className="vs-nav">
        <Brand/>
        <div className="onb-progress">
          {[0,1,2].map(i => <span key={i} className={i < step ? 'done' : i === step ? 'active' : ''}/>)}
        </div>
        <div style={{ display:'flex', gap:16 }}>
          <button className="onb-skip" onClick={onSwitchToCards}>Switch to cards</button>
          <button className="onb-skip" onClick={onSkip}>Skip</button>
        </div>
      </div>

      {/* Main content — inline fade-in avoids CSS opacity:0 race */}
      <div
        className="vs-center"
        style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? 'none' : 'translateY(28px)',
          transition: 'opacity 0.75s ease, transform 0.75s ease',
        }}
      >
        <div className="vs-orb-wrap">
          <div className={`vs-orb-xl ${speaking ? 'vs-orb-xl--on' : ''}`}>
            <div className="vs-orb-ring"/>
          </div>
          <div className={`vs-waves-xl ${speaking ? 'vs-waves-xl--active' : ''}`}>
            {[0,1,2,3,4,5,6,7].map(i => (
              <span key={i} className="vs-wbar-xl" style={{
                animationDelay:    `${i * 0.08}s`,
                animationDuration: `${0.55 + (i % 4) * 0.2}s`,
              }}/>
            ))}
          </div>
        </div>

        <p className="vs-q">
          {finishing ? 'Building your night…' : SCRIPTS[step]}
        </p>

        {!finishing && (
          <div className={`vs-pills ${step === 0 ? 'vs-pills--six' : ''}`}>
            {opts.map(o => (
              <button
                key={o.id}
                className={`vs-pill ${answers[STEP_KEYS[step]] === o.id ? 'vs-pill--on' : ''}`}
                onClick={() => select(o.id)}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
