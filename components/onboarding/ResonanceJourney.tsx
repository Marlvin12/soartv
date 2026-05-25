'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Resonance Journey — the unified onboarding entry.
//
// Replaces the old ModeSelect → (Voice | Cards) fork. Now everyone moves
// through one continuous 6-step rhythm — Card · Voice · Card · Voice · Card ·
// Card — that alternates poster taps with short voice prompts. Friction stays
// low (every step is either a poster pick or a one-word/one-sentence answer),
// momentum stays high (auto-advance on card pick), and the algorithm is
// preserved intact: the two voice steps still run runTurn1 + body-led
// detection, and the four card steps still fill SurveyAnswers.
//
// Design language borrows from Apple's setup flows: one focused thing per
// screen, spring-physics transitions, generous whitespace, chip suggestions
// beneath voice input, thin top progress line.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useRef, useState } from 'react'
import Brand from '@/components/Brand'
import { getSurveyFilms } from '@/lib/archetypes'
import { detectArchetype, runTurn1, ARRIVAL_CHIPS, BODY_LED_FOLLOWUP_QUESTIONS, FOLLOW_UP_QUESTIONS } from '@/lib/filmflow'
import { matchBodyAreaWithKey } from '@/lib/body-resonance'
import { IMG_500 } from '@/lib/tmdb'
import type { ArchetypeId } from '@/lib/archetypes'
import type { SurveyAnswers } from '@/types'

type Film = ReturnType<typeof getSurveyFilms>[number]

// Each step is either a poster pick (card) or a short voice prompt (voice).
// Order is C · V · C · V · C · C — the two card finishers close on taps, not
// typed answers, so the last beat feels light and decisive.
type Step =
  | { kind: 'card';  surveyKey: keyof SurveyAnswers; title: string; sub: string }
  | { kind: 'voice'; turn: 1 | 2;                    title: string; sub: string }

const STEPS: Step[] = [
  { kind: 'card',  surveyKey: 'mood',       title: 'Pick the film that fits the mood you’re in.', sub: 'Trust your gut — whichever pulls first.' },
  { kind: 'voice', turn: 1,                 title: 'How are you arriving tonight?',                sub: 'One word is plenty. Tap a chip or write your own.' },
  { kind: 'card',  surveyKey: 'lifeStory',  title: 'Which story mirrors where you are in life?',   sub: 'Where you are in the arc right now.' },
  { kind: 'voice', turn: 2,                 title: '',                                              sub: '' }, // title is dynamic; resolved at render time
  { kind: 'card',  surveyKey: 'aspiration', title: 'Which world would you most want to step into?', sub: 'Somewhere in this answer is what you’re reaching toward.' },
  { kind: 'card',  surveyKey: 'avoid',      title: 'Which would you most want to avoid?',          sub: 'What you move away from is just as telling.' },
]

interface PosterAsset { film: Film; posterUrl: string | null }

interface Props {
  onComplete: (sa: SurveyAnswers, entryArchetype: ArchetypeId | null) => void
  onSkip:     () => void
}

export default function ResonanceJourney({ onComplete, onSkip }: Props) {
  const films = useMemo(() => getSurveyFilms(), [])

  // ── State ─────────────────────────────────────────────────────────────────
  const [step,           setStep]           = useState(0)
  const [answers,        setAnswers]        = useState<Partial<SurveyAnswers>>({})
  const [voice1,         setVoice1]         = useState('')
  const [voice2,         setVoice2]         = useState('')
  // Voice Turn 1 outputs: which lane we picked (body vs archetype) and the
  // archetype if archetype-led. Locked in once the user advances past Step 2.
  const [voiceMode,      setVoiceMode]      = useState<'body' | 'archetype' | null>(null)
  const [voiceArchetype, setVoiceArchetype] = useState<ArchetypeId | null>(null)
  const [voiceBodyKey,   setVoiceBodyKey]   = useState<string | null>(null)
  const [posters,        setPosters]        = useState<PosterAsset[]>([])
  const [fetching,       setFetching]       = useState(true)
  const [phase,          setPhase]          = useState<'in' | 'out'>('in')

  // Card auto-advance is fire-and-forget per step; keep a ref so the user can
  // change their pick before the timer fires.
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cancelAdvance = () => {
    if (advanceTimer.current) { clearTimeout(advanceTimer.current); advanceTimer.current = null }
  }
  useEffect(() => () => cancelAdvance(), [])

  // Backdrop slideshow — same source/feel as VoiceSurvey for visual continuity.
  const [bgIdx,  setBgIdx]  = useState(0)
  const [bgs,    setBgs]    = useState<string[]>([])
  useEffect(() => {
    fetch('/api/tmdb?path=/trending/movie/week')
      .then(r => r.json())
      .then(d => setBgs(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (d.results || []).filter((m: any) => m.backdrop_path).slice(0, 10)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((m: any) => `https://image.tmdb.org/t/p/w780${m.backdrop_path}`)
      ))
      .catch(() => {})
  }, [])
  useEffect(() => {
    if (bgs.length < 2) return
    const t = setInterval(() => setBgIdx(i => (i + 1) % bgs.length), 5200)
    return () => clearInterval(t)
  }, [bgs.length])

  // Fetch the seven survey posters once.
  useEffect(() => {
    let cancelled = false
    Promise.all(
      films.map(async film => {
        try {
          const res  = await fetch(`/api/tmdb?path=/movie/${film.tmdbId}&append_to_response=images`)
          const data = await res.json()
          const path = data?.poster_path ?? null
          return { film, posterUrl: path ? IMG_500 + path : null }
        } catch { return { film, posterUrl: null } }
      })
    ).then(rs => { if (!cancelled) { setPosters(rs); setFetching(false) } })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Step transitions ──────────────────────────────────────────────────────
  // Standard spring: fade-out (320ms) → swap content → fade-in (320ms).
  const goNext = (mutator?: () => void) => {
    cancelAdvance()
    setPhase('out')
    setTimeout(() => {
      mutator?.()
      setStep(s => s + 1)
      setPhase('in')
    }, 320)
  }
  const goBack = () => {
    if (step === 0) return
    cancelAdvance()
    setPhase('out')
    setTimeout(() => { setStep(s => s - 1); setPhase('in') }, 320)
  }

  // ── Card step: pick + auto-advance ────────────────────────────────────────
  const pickCard = (surveyKey: keyof SurveyAnswers, archetypeId: ArchetypeId) => {
    cancelAdvance()
    const isLast = step === STEPS.length - 1

    // Toggle off when re-tapping the same poster.
    if (answers[surveyKey] === archetypeId) {
      const { [surveyKey]: _omit, ...rest } = answers
      setAnswers(rest)
      return
    }
    const nextAnswers = { ...answers, [surveyKey]: archetypeId }
    setAnswers(nextAnswers)

    // Final step finishes the journey; otherwise schedule auto-advance.
    if (isLast) {
      advanceTimer.current = setTimeout(() => finish(nextAnswers), 620)
    } else {
      advanceTimer.current = setTimeout(() => goNext(), 620)
    }
  }

  // ── Voice step: continue ──────────────────────────────────────────────────
  const submitVoice = () => {
    const cur = STEPS[step]
    if (cur.kind !== 'voice') return
    if (cur.turn === 1) {
      if (voice1.trim().length < 2) return
      // Run the body-led / archetype-led decision at submit time so the next
      // voice step can ask the right follow-up.
      const bodyHit = matchBodyAreaWithKey(voice1)
      const t1      = runTurn1(voice1, bodyHit)
      goNext(() => {
        setVoiceMode(t1.detectionMode)
        setVoiceArchetype(t1.archetype ?? null)
        setVoiceBodyKey(t1.bodyAreaKey ?? null)
      })
    } else {
      if (voice2.trim().length < 2) return
      goNext()
    }
  }

  // ── Finish: compute entryArchetype + hand off to page ─────────────────────
  const finish = (finalAnswers: Partial<SurveyAnswers>) => {
    // Resolve the entry archetype from voice. If body-led on Turn 1, archetype
    // gets detected from voice2 (the body-followup answer); if archetype-led,
    // we already have it from Turn 1.
    let entry: ArchetypeId | null = null
    if (voiceMode === 'archetype') entry = voiceArchetype
    else if (voiceMode === 'body') {
      const { archetype, matched } = detectArchetype(voice2)
      entry = matched ? archetype : null
    }
    onComplete(finalAnswers as SurveyAnswers, entry)
  }

  // ── Render helpers ────────────────────────────────────────────────────────
  const cur = STEPS[step]
  const progress = ((step + (phase === 'in' ? 1 : 0)) / STEPS.length) * 100

  // Voice Step 4 question is dynamic based on what Step 2 detected.
  const voice2Prompt = (() => {
    if (voiceMode === 'body' && voiceBodyKey) {
      return BODY_LED_FOLLOWUP_QUESTIONS[voiceBodyKey] ?? BODY_LED_FOLLOWUP_QUESTIONS.default
    }
    if (voiceMode === 'archetype' && voiceArchetype) {
      return FOLLOW_UP_QUESTIONS[voiceArchetype]
    }
    return 'Where in your body do you feel that most right now?'
  })()

  return (
    <div className="rj-page">
      {/* Backdrop slideshow */}
      <div className="rj-bgs">
        {bgs.map((url, i) => (
          <div key={i} className="rj-bg" style={{ opacity: i === bgIdx ? 1 : 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>
      <div className="rj-overlay" />

      {/* Top bar: brand · thin progress line · skip */}
      <div className="rj-top">
        <Brand />
        <span className="rj-step">{step + 1} / {STEPS.length}</span>
        <button className="onb-skip" onClick={onSkip}>Skip</button>
      </div>
      <div className="rj-progress">
        <div className="rj-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Content — phased in/out with spring transition */}
      <div
        className="rj-content"
        style={{
          opacity:   phase === 'in' ? 1 : 0,
          transform: phase === 'in' ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.32s cubic-bezier(.22,1,.36,1), transform 0.32s cubic-bezier(.22,1,.36,1)',
        }}
      >
        {cur.kind === 'card' && (
          <CardStep
            title={cur.title}
            sub={cur.sub}
            posters={posters}
            fetching={fetching}
            selected={answers[cur.surveyKey] as ArchetypeId | undefined}
            onPick={id => pickCard(cur.surveyKey, id)}
          />
        )}
        {cur.kind === 'voice' && cur.turn === 1 && (
          <VoiceStep
            title={cur.title}
            sub={cur.sub}
            value={voice1}
            onChange={setVoice1}
            onSubmit={submitVoice}
            chips={ARRIVAL_CHIPS}
            cta="Continue"
          />
        )}
        {cur.kind === 'voice' && cur.turn === 2 && (
          <VoiceStep
            title={voice2Prompt}
            sub="A short answer. The body is honest before the mind catches up."
            value={voice2}
            onChange={setVoice2}
            onSubmit={submitVoice}
            chips={['tight', 'heavy', 'numb', 'open', 'restless', 'warm']}
            cta="Continue"
          />
        )}
      </div>

      {/* Footer: Back · status hint */}
      <div className="rj-footer">
        {step > 0 ? (
          <button className="rj-back" onClick={goBack}>
            <ArrowIcon flip /> Back
          </button>
        ) : <span />}
        {cur.kind === 'card' && answers[(cur as Extract<Step, {kind:'card'}>).surveyKey] && step < STEPS.length - 1 && (
          <span className="rj-hint">Moving on… tap again to change</span>
        )}
        {cur.kind === 'card' && step === STEPS.length - 1 && answers[(cur as Extract<Step, {kind:'card'}>).surveyKey] && (
          <span className="rj-hint">Reading your resonance…</span>
        )}
      </div>

      <style>{`
        /* Page allows vertical scroll on smaller viewports — Apple's onboarding
           flows do the same; we just keep the chrome (brand/progress/skip)
           pinned and let the content breathe rather than clip. */
        .rj-page { position: relative; min-height: 100dvh; background: var(--bg); display: flex; flex-direction: column; color: var(--text); overflow-x: hidden; }
        .rj-bgs  { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .rj-bg   { position: absolute; inset: 0; transition: opacity 1.4s ease; }
        .rj-bg img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.85) brightness(0.42); }
        .rj-overlay { position: fixed; inset: 0; z-index: 1; pointer-events: none; background: radial-gradient(120% 80% at 50% 0%, rgba(0,0,0,0.35), rgba(0,0,0,0.85) 70%); }

        .rj-top { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between; padding: calc(16px + env(safe-area-inset-top)) 28px 8px; backdrop-filter: blur(14px) saturate(140%); -webkit-backdrop-filter: blur(14px) saturate(140%); background: linear-gradient(to bottom, rgba(10,10,14,0.65), rgba(10,10,14,0.25) 80%, transparent); }
        .rj-step { font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.55); font-variant-numeric: tabular-nums; }
        .rj-progress { position: sticky; top: calc(56px + env(safe-area-inset-top)); z-index: 5; height: 2px; margin: 0 28px 18px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
        .rj-progress-fill { height: 100%; background: linear-gradient(90deg, #b8862f, #e8c87a); border-radius: 2px; transition: width 0.5s cubic-bezier(.22,1,.36,1); box-shadow: 0 0 12px rgba(232,200,122,0.45); }

        .rj-content { position: relative; z-index: 3; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 14px 28px 28px; max-width: 1100px; margin: 0 auto; width: 100%; }
        .rj-footer  { position: relative; z-index: 4; display: flex; align-items: center; justify-content: space-between; padding: 14px 28px calc(24px + env(safe-area-inset-bottom)); min-height: 32px; }
        .rj-back    { font-size: 14px; color: var(--text-dim); padding: 10px 14px; display: inline-flex; align-items: center; gap: 6px; transition: color 0.15s; cursor: pointer; }
        .rj-back:hover { color: var(--text); }
        .rj-hint    { font-size: 12px; color: var(--muted); }
      `}</style>
    </div>
  )
}

// ─── Card step ────────────────────────────────────────────────────────────────

function CardStep({
  title, sub, posters, fetching, selected, onPick,
}: {
  title:    string
  sub:      string
  posters:  PosterAsset[]
  fetching: boolean
  selected: ArchetypeId | undefined
  onPick:   (id: ArchetypeId) => void
}) {
  return (
    <>
      <h2 className="rj-title">{title}</h2>
      <p className="rj-sub">{sub}</p>

      <div className="rj-cards">
        {fetching
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="rj-card rj-card--skel" />)
          : posters.map(({ film, posterUrl }) => {
              const isSelected = selected === film.archetypeId
              const dimmed     = selected !== undefined && !isSelected
              return (
                <button
                  key={film.archetypeId}
                  className={`rj-card${isSelected ? ' rj-card--on' : ''}${dimmed ? ' rj-card--dim' : ''}`}
                  onClick={() => onPick(film.archetypeId)}
                  aria-label={film.title}
                >
                  {posterUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={posterUrl} alt={film.title} className="rj-card-img" />
                  ) : (
                    <div className="rj-card-fallback">{film.title}</div>
                  )}
                  <div className="rj-card-meta">{film.title}</div>
                  {isSelected && (
                    <div className="rj-card-check">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7l2.8 2.8L11 4" stroke="#0a0a0e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </button>
              )
            })
        }
      </div>

      <style>{`
        .rj-title { font-size: clamp(26px, 3.4vw, 40px); font-weight: 600; letter-spacing: -0.025em; text-align: center; margin: 0 0 8px; line-height: 1.08; text-wrap: balance; max-width: 760px; }
        .rj-sub   { font-size: 15px; color: var(--text-dim); text-align: center; margin: 0 0 24px; max-width: 520px; text-wrap: pretty; }

        /* 8 archetype posters laid out 4×2. Width cap keeps cards substantial
           but allows two rows to fit on a standard laptop viewport without
           scrolling on common sizes; on smaller it scrolls. */
        .rj-cards { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 18px; width: 100%; max-width: 940px; }
        @media (max-width: 900px) { .rj-cards { grid-template-columns: repeat(3, 1fr); gap: 14px; } }
        @media (max-width: 640px) { .rj-cards { grid-template-columns: repeat(2, 1fr); gap: 12px; } }

        .rj-card { position: relative; aspect-ratio: 2/3; border-radius: 18px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.04); cursor: pointer;
          transition: transform 0.32s cubic-bezier(.22,1,.36,1), box-shadow 0.32s cubic-bezier(.22,1,.36,1), opacity 0.22s ease, border-color 0.22s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
        .rj-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.18); box-shadow: 0 18px 40px rgba(0,0,0,0.55); }
        .rj-card:active { transform: scale(0.96); }
        .rj-card--on   { transform: translateY(-6px) scale(1.02); border-color: #fff; box-shadow: 0 22px 60px rgba(0,0,0,0.6), 0 0 0 2px #fff; }
        .rj-card--dim  { opacity: 0.32; }
        .rj-card--skel { background: linear-gradient(110deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 100%); background-size: 200% 100%; animation: rj-shim 1.4s linear infinite; }
        @keyframes rj-shim { to { background-position: -200% 0; } }

        .rj-card-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .rj-card-fallback { position: absolute; inset: 0; display: grid; place-items: center; color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 600; padding: 12px; text-align: center; background: linear-gradient(135deg, #1f1606, #0d0a04); }
        .rj-card-meta { position: absolute; left: 0; right: 0; bottom: 0; padding: 16px 16px 14px; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; color: #fff;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%); text-align: left; }
        .rj-card-check { position: absolute; top: 10px; right: 10px; width: 24px; height: 24px; border-radius: 50%; background: #fff; display: grid; place-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
      `}</style>
    </>
  )
}

// ─── Voice step ───────────────────────────────────────────────────────────────

function VoiceStep({
  title, sub, value, onChange, onSubmit, chips, cta,
}: {
  title:    string
  sub:      string
  value:    string
  onChange: (v: string) => void
  onSubmit: () => void
  chips:    string[]
  cta:      string
}) {
  return (
    <>
      <div className="rj-orb">
        <div className="rj-orb-core" />
        <div className="rj-orb-ring" />
      </div>

      <h2 className="rj-title">{title}</h2>
      <p className="rj-sub">{sub}</p>

      <div className="rj-input-wrap">
        <textarea
          className="rj-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit() }
          }}
          placeholder="A word or a short sentence…"
          rows={1}
          autoFocus
        />
        <div className="rj-chips">
          {chips.map(c => (
            <button
              key={c}
              className="rj-chip"
              onClick={() => {
                // Append (or set, if empty) so chip taps compose naturally.
                onChange(value.trim() ? `${value.trim()} ${c}` : c)
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <button
          className="rj-cta"
          onClick={onSubmit}
          disabled={value.trim().length < 2}
        >
          {cta}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>
      </div>

      <style>{`
        .rj-orb { position: relative; width: 64px; height: 64px; margin-bottom: 22px; display: grid; place-items: center; }
        .rj-orb-core { width: 32px; height: 32px; border-radius: 50%; background: radial-gradient(circle at 30% 30%, #fff, #e8c87a 45%, #5a4012 100%); box-shadow: 0 0 30px rgba(232,200,122,0.55); animation: rj-pulse 2.6s ease-in-out infinite; }
        .rj-orb-ring { position: absolute; inset: 0; border-radius: 50%; border: 1px solid rgba(232,200,122,0.35); animation: rj-ring 2.6s ease-in-out infinite; }
        @keyframes rj-pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: 0.85; } }
        @keyframes rj-ring  { 0% { transform: scale(0.85); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }

        .rj-input-wrap { width: 100%; max-width: 560px; display: flex; flex-direction: column; align-items: stretch; gap: 16px; }
        .rj-input {
          width: 100%; padding: 18px 20px; font-size: 17px; line-height: 1.4; color: #fff;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); border-radius: 18px;
          outline: none; resize: none; min-height: 60px; max-height: 160px;
          backdrop-filter: blur(20px) saturate(140%); -webkit-backdrop-filter: blur(20px) saturate(140%);
          transition: border-color 0.2s ease, background 0.2s ease;
          font-family: inherit;
        }
        .rj-input:focus { border-color: rgba(232,200,122,0.55); background: rgba(255,255,255,0.09); }
        .rj-input::placeholder { color: rgba(255,255,255,0.35); }

        .rj-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
        .rj-chip  { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.78); padding: 7px 13px; border-radius: 999px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); cursor: pointer;
          transition: transform 0.15s ease, background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .rj-chip:hover  { background: rgba(232,200,122,0.12); border-color: rgba(232,200,122,0.4); color: #fff; }
        .rj-chip:active { transform: scale(0.94); }

        .rj-cta { align-self: center; padding: 13px 26px; border-radius: 999px; font-size: 15px; font-weight: 600; letter-spacing: -0.01em;
          color: #0a0a0e; background: linear-gradient(135deg,#f0d58c,#e8c87a); border: none; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 10px 28px rgba(232,200,122,0.28);
          transition: transform 0.15s ease, opacity 0.2s ease; }
        .rj-cta:hover    { transform: translateY(-1px); }
        .rj-cta:active   { transform: scale(0.97); }
        .rj-cta:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>
    </>
  )
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

function ArrowIcon({ flip = false }: { flip?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}
