'use client'

import { useEffect, useState } from 'react'
import { getSurveyFilms } from '@/lib/archetypes'
import type { ArchetypeId } from '@/lib/archetypes'
import type { SurveyAnswers } from '@/types'
import { IMG_500 } from '@/lib/tmdb'

type Film = ReturnType<typeof getSurveyFilms>[number]

const QUESTIONS = [
  { key: 'mood',        eyebrow: 'Question 1 of 4', title: 'Which film speaks to you right now?',          sub: 'Trust your gut — choose the one that pulls you first.' },
  { key: 'aspiration', eyebrow: 'Question 2 of 4', title: 'Which world would you most want to step into?',  sub: 'Somewhere in this answer is what you\'re reaching toward.' },
  { key: 'lifeStory',  eyebrow: 'Question 3 of 4', title: 'Which story best mirrors where you are in life?', sub: 'Where are you in the arc right now?' },
  { key: 'avoid',      eyebrow: 'Question 4 of 4', title: 'Which of these do you most want to avoid?',       sub: 'What you move away from is just as telling as what you move toward.' },
] as const

interface Poster {
  film:      Film
  posterUrl: string | null
  loaded:    boolean
}

interface Props {
  onComplete: (answers: SurveyAnswers) => void
  onSkip:     () => void
}

export default function PosterSurvey({ onComplete, onSkip }: Props) {
  const [step,      setStep]      = useState(0)
  const [answers,   setAnswers]   = useState<Partial<SurveyAnswers>>({})
  const [selected,  setSelected]  = useState<ArchetypeId | null>(null)
  const [posters,   setPosters]   = useState<Poster[]>([])
  const [fetching,  setFetching]  = useState(true)
  const [revealing, setRevealing] = useState(false)

  const films = getSurveyFilms()
  const q     = QUESTIONS[step]

  // Fetch all 7 poster images once on mount
  useEffect(() => {
    let cancelled = false
    async function load() {
      setFetching(true)
      const results = await Promise.all(
        films.map(async (film) => {
          try {
            const res = await fetch(`/api/tmdb?path=/movie/${film.tmdbId}&append_to_response=images`)
            if (!res.ok) return { film, posterUrl: null, loaded: true }
            const data = await res.json()
            const path = data.poster_path ?? data.results?.[0]?.poster_path ?? null
            return { film, posterUrl: path ? IMG_500 + path : null, loaded: true }
          } catch {
            return { film, posterUrl: null, loaded: true }
          }
        })
      )
      if (!cancelled) { setPosters(results); setFetching(false) }
    }
    load()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-advance after card selection: brief moment to see the highlight, then move on.
  const pick = (id: ArchetypeId) => {
    if (selected || revealing) return
    setSelected(id)
    const nextAnswers = { ...answers, [q.key]: id }
    setAnswers(nextAnswers)

    if (step < QUESTIONS.length - 1) {
      // Auto-advance to next question
      setTimeout(() => setRevealing(true), 320)
      setTimeout(() => {
        setStep(s => s + 1)
        // Restore previous selection for that step if user already answered it, else clear
        setSelected(nextAnswers[QUESTIONS[step + 1].key as keyof SurveyAnswers] as ArchetypeId ?? null)
        setRevealing(false)
      }, 700)
    } else {
      // Last question — wait a beat for the highlight, then finish
      setTimeout(() => onComplete(nextAnswers as SurveyAnswers), 500)
    }
  }

  const goBack = () => {
    if (step === 0 || revealing) return
    setRevealing(true)
    setTimeout(() => {
      const prevStep = step - 1
      setStep(prevStep)
      // Restore previous answer so user sees their last selection highlighted
      setSelected((answers[QUESTIONS[prevStep].key as keyof SurveyAnswers] as ArchetypeId) ?? null)
      setRevealing(false)
    }, 380)
  }

  const isLast = step === QUESTIONS.length - 1

  return (
    <div className="onb" style={{ minHeight: '100vh' }}>
      {/* top bar */}
      <div className="onb-top">
        <Brand />
        <div className="onb-progress">
          {QUESTIONS.map((_, i) => (
            <span key={i} className={i < step ? 'done' : i === step ? 'active' : ''} />
          ))}
        </div>
        <button className="onb-skip" onClick={onSkip}>Skip</button>
      </div>

      {/* content */}
      <div className="onb-body" style={{ opacity: revealing ? 0 : 1, transition: 'opacity 0.35s ease' }}>
        <p className="onb-eyebrow">{q.eyebrow}</p>
        <h2 className="onb-title">{q.title}</h2>
        <p className="onb-sub">{q.sub}</p>

        {/* poster grid — responsive: desktop 3+4, tablet 3-col, mobile 2-col */}
        <div className="poster-grid">
          {fetching
            ? films.map((_, i) => (
                <div key={i} style={{ width: '100%' }}>
                  <PosterSkeleton />
                </div>
              ))
            : posters.map(({ film, posterUrl }) => (
                <div key={film.archetypeId} style={{ width: '100%' }}>
                  <PosterCard
                    film={film}
                    posterUrl={posterUrl}
                    selected={selected === film.archetypeId}
                    dimmed={selected !== null && selected !== film.archetypeId}
                    onPick={() => pick(film.archetypeId)}
                  />
                </div>
              ))
          }
        </div>

        {/* CTA — only Back (Next removed, cards auto-advance) */}
        <div className="onb-cta" style={{ minHeight: 56 }}>
          {step > 0 && (
            <button
              className="back"
              onClick={goBack}
              disabled={revealing}
              aria-label="Previous question"
            >
              <ArrowIcon flip /> Back
            </button>
          )}
          {/* On the last question we still need an explicit finish button — auto-finish feels abrupt */}
          {isLast && (
            <button
              className="next"
              disabled={!selected || revealing}
              onClick={() => selected && onComplete({ ...answers, [q.key]: selected } as SurveyAnswers)}
            >
              See My Profile ✦
            </button>
          )}
          {!isLast && selected && (
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0, alignSelf: 'center' }}>
              Moving on…
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── PosterCard ────────────────────────────────────────────────────────────────

function PosterCard({ film, posterUrl, selected, dimmed, onPick }: {
  film:     Film
  posterUrl: string | null
  selected:  boolean
  dimmed:    boolean
  onPick:    () => void
}) {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <button
      onClick={onPick}
      style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%' }}
      aria-label={film.title}
    >
      <div
        className={`q-card${selected ? ' selected' : ''}`}
        style={{
          opacity: dimmed ? 0.35 : 1,
          transition: 'opacity 0.25s ease, transform 0.3s cubic-bezier(.2,.7,.2,1), box-shadow 0.3s',
        }}
      >
        {/* poster image */}
        {posterUrl ? (
          <>
            {!imgLoaded && <div className="art skeleton" style={{ position: 'absolute', inset: 0 }} />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl}
              alt={film.title}
              className="art"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s' }}
              onLoad={() => setImgLoaded(true)}
            />
          </>
        ) : (
          <div className="art" style={{ background: `linear-gradient(135deg,#1a1030,#0d0a20)`, display: 'grid', placeItems: 'center' }}>
            <FilmIcon />
          </div>
        )}

        {/* meta overlay */}
        <div className="meta">
          <span className="title" style={{ fontSize: 15 }}>{film.title}</span>
        </div>

        {/* selection checkmark */}
        <div className="pick">
          {selected && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7l2.8 2.8L11 4" stroke="#0a0a0e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}

function PosterSkeleton() {
  return <div className="q-card skeleton" style={{ aspectRatio: '3/4', borderRadius: 18 }} />
}

// ── Inline icons / brand ──────────────────────────────────────────────────────

function Brand() {
  return (
    <div className="brand">
      <svg className="brand-icon" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="9" fill="rgba(180,167,255,0.14)"/>
        <path d="M9 22 L16 10 L23 22" stroke="#b4a7ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="16" cy="10" r="2.2" fill="#b4a7ff"/>
      </svg>
      <span className="brand-word">Soar<span className="brand-tv">TV</span></span>
    </div>
  )
}

function ArrowIcon({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <path d="M3 8h10M9 4l4 4-4 4"/>
    </svg>
  )
}

function FilmIcon() {
  return <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(180,167,255,0.3)" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="2.5"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/></svg>
}
