'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Resonance Insights — the full post-survey reveal page.
// Renders the user's resonance archetype, the deep narrative, the integrated
// path, the survey snapshot, the aspiration-keyed profile, body resonance, and
// film recommendations. Used both as a post-survey scene and the /profile tab.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import {
  ARCHETYPES, INTEGRATED_PATHS, SIGNATURE_FILMS, ARCHETYPE_ORDER, resolveArchetype,
} from '@/lib/archetypes'
import type { ArchetypeId } from '@/lib/archetypes'
import { ARCHETYPE_REVEAL, FILM_PROFILES } from '@/lib/resonance-content'
import { brandLogoSources } from '@/lib/brand-logos'
import type { ResonanceProfile } from '@/types'

const GOLD = '#e8c87a'

interface Props {
  profile:   ResonanceProfile
  onEnter:   () => void          // "Enter SoarTV" / "Go to Homepage"
  onRetake?: () => void          // "Retake Survey" — defaults to navigating home
}

export default function InsightsReveal({ profile, onEnter, onRetake }: Props) {
  const archId = resolveArchetype(profile.archetype)
  const arch   = ARCHETYPES[archId]
  const reveal = ARCHETYPE_REVEAL[archId]
  const path   = INTEGRATED_PATHS[arch.integratedPath]

  const sa      = profile.surveyAnswers
  const moodId  = sa ? resolveArchetype(sa.mood)       : archId
  const aspId   = sa ? resolveArchetype(sa.aspiration) : archId
  const storyId = sa ? resolveArchetype(sa.lifeStory)  : archId
  const avoidId = sa ? resolveArchetype(sa.avoid)      : archId

  const aspFilm    = SIGNATURE_FILMS[aspId]
  const aspProfile = FILM_PROFILES[aspId]

  // ── Listen (ElevenLabs TTS) ───────────────────────────────────────────────
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const voiceText = `You are ${arch.name}. ${reveal.opening} ${reveal.invitation}`

  useEffect(() => () => { audioRef.current?.pause() }, [])

  const handleListen = async () => {
    if (playing) { audioRef.current?.pause(); setPlaying(false); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/elevenlabs?text=${encodeURIComponent(voiceText.slice(0, 800))}`)
      if (!res.ok || res.status === 204) { setLoading(false); return }
      const url   = URL.createObjectURL(await res.blob())
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => { setPlaying(false); URL.revokeObjectURL(url) }
      await audio.play()
      setPlaying(true)
    } catch { /* silent fallback */ }
    finally { setLoading(false) }
  }

  // ── Parallel film posters ─────────────────────────────────────────────────
  const [posters, setPosters] = useState<Record<string, string | null>>({})
  useEffect(() => {
    let cancelled = false
    Promise.all(aspProfile.parallelFilms.map(async title => {
      try {
        const res  = await fetch(`/api/tmdb?path=/search/movie&query=${encodeURIComponent(title)}`)
        const data = await res.json()
        const p    = data.results?.[0]?.poster_path
        return [title, p ? `https://image.tmdb.org/t/p/w342${p}` : null] as const
      } catch { return [title, null] as const }
    })).then(pairs => { if (!cancelled) setPosters(Object.fromEntries(pairs)) })
    return () => { cancelled = true }
  }, [aspId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Score breakdown ───────────────────────────────────────────────────────
  const scoreEntries = ARCHETYPE_ORDER
    .map(id => [id, profile.scores?.[id] ?? 0] as [ArchetypeId, number])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
  const maxScore = Math.max(...scoreEntries.map(s => s[1]), 1)

  const snapshot: { label: string; id: ArchetypeId }[] = [
    { label: 'Mood',   id: moodId },
    { label: 'Story',  id: storyId },
    { label: 'Aspire', id: aspId },
    { label: 'Avoid',  id: avoidId },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 20px 110px' }}>
      <div style={{ width: '100%', maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* ── Hero ── */}
        <div style={{
          position: 'relative', padding: '34px 30px 30px', borderRadius: 24,
          background: 'linear-gradient(160deg,rgba(232,200,122,0.1),rgba(232,200,122,0.02))',
          border: '1px solid rgba(232,200,122,0.22)', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <Eyebrow>Your Resonance Archetype</Eyebrow>
            <button onClick={handleListen} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px',
              borderRadius: 999, border: '1px solid rgba(232,200,122,0.35)', flexShrink: 0,
              background: playing ? 'rgba(232,200,122,0.18)' : 'rgba(232,200,122,0.08)',
              color: GOLD, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              {loading ? <Spinner /> : playing ? <PauseIcon /> : <PlayIcon />}
              {loading ? 'Loading' : playing ? 'Pause' : 'Listen'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
              background: 'radial-gradient(circle at 30% 30%,#fff,#e8c87a 42%,#5a4012 100%)',
              boxShadow: '0 0 44px rgba(232,200,122,0.45)', animation: 'orb-pulse 2.6s ease-in-out infinite',
            }} />
            <div>
              <h1 style={{ fontSize: 'clamp(34px,5vw,52px)', fontWeight: 700, letterSpacing: '-0.035em', margin: 0, color: '#fff', lineHeight: 1.04 }}>
                {arch.name}
              </h1>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <span style={{
                  padding: '6px 13px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: GOLD,
                  background: 'rgba(232,200,122,0.12)', border: '1px solid rgba(232,200,122,0.4)',
                }}>
                  Integrated Path → {path.name}
                </span>
                <span style={{
                  padding: '6px 13px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: 'var(--text-dim)',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line)',
                }}>
                  {reveal.chapter}
                </span>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--line)', margin: '26px 0 22px' }} />
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-dim)', margin: 0 }}>{reveal.opening}</p>
          <p style={{
            margin: '22px 0 0', paddingLeft: 16, borderLeft: `2px solid ${GOLD}`,
            fontSize: 17, fontStyle: 'italic', color: GOLD, lineHeight: 1.5,
          }}>
            &ldquo;{arch.tagline}&rdquo;
          </p>
        </div>

        {/* ── Emotional tone ── */}
        <Section label="Emotional Tone">
          <ChipRow items={arch.emotionalTone} />
        </Section>

        {/* ── Core fear / desire ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
          <AccentCard label="Core Fear"   accent="#e0796b" text={arch.coreFear} />
          <AccentCard label="Core Desire" accent={GOLD}    text={reveal.coreDesire} />
        </div>

        {/* ── Nervous system pattern ── */}
        <Section label="Nervous System Pattern">
          <p style={bodyText}>{reveal.nervousSystemPattern}</p>
        </Section>

        {/* ── Physical / emotional patterns ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
          <Section label="Physical Patterns"><ChipRow items={reveal.physicalPatterns} /></Section>
          <Section label="Emotional Patterns"><ChipRow items={reveal.emotionalPatterns} /></Section>
        </div>

        {/* ── How you've been adapting ── */}
        <BeatBlock
          title="How You've Been Adapting"
          intro="These patterns are intelligent adaptations — not flaws. They developed because they once served a real purpose in your life."
          beats={reveal.adapting}
          tone="dim"
        />

        {/* ── Who you're becoming ── */}
        <BeatBlock
          title="Who You're Becoming"
          intro="As you integrate your Resonance Signature, this is who naturally emerges."
          beats={reveal.becoming}
          tone="gold"
        />

        {/* ── Pattern living / becomes possible ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
          <AccentCard label="The Pattern You've Been Living" accent="var(--muted)" text={reveal.patternLiving} />
          <AccentCard label="What Becomes Possible"          accent={GOLD}        text={reveal.becomesPossible} />
        </div>

        {/* ── Resonance breakdown ── */}
        <Section label="Your Resonance Breakdown">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {scoreEntries.map(([id, score]) => {
              const isPrimary = id === archId
              return (
                <div key={id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: isPrimary ? GOLD : 'var(--text-dim)' }}>
                      {ARCHETYPES[id].name}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{Math.round(score)}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{
                      height: '100%', borderRadius: 4, width: `${(score / maxScore) * 100}%`,
                      background: isPrimary ? 'linear-gradient(90deg,#b8862f,#e8c87a)' : 'rgba(255,255,255,0.22)',
                      transition: 'width 1s cubic-bezier(.2,.7,.2,1)',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Section>

        {/* ── Invitation forward ── */}
        <div style={{
          padding: '24px 26px', borderRadius: 20,
          background: 'linear-gradient(135deg,rgba(232,200,122,0.12),rgba(232,200,122,0.02))',
          border: '1px solid rgba(232,200,122,0.25)',
        }}>
          <Eyebrow>Your Invitation Forward</Eyebrow>
          <p style={{ ...bodyText, marginTop: 12 }}>{reveal.invitation}</p>
        </div>

        {/* ── Integrated path ── */}
        <div style={{
          padding: '26px', borderRadius: 20,
          background: 'linear-gradient(135deg,rgba(232,200,122,0.14),rgba(232,200,122,0.03))',
          border: '1px solid rgba(232,200,122,0.3)',
        }}>
          <Eyebrow>Your Integrated Path</Eyebrow>
          <p style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: '10px 0 14px', letterSpacing: '-0.02em' }}>{path.name}</p>
          <p style={bodyText}>{reveal.integratedPathBody}</p>
          <p style={{
            margin: '18px 0 22px', paddingLeft: 16, borderLeft: `2px solid ${GOLD}`,
            fontSize: 16, fontStyle: 'italic', color: GOLD,
          }}>
            &ldquo;{path.coreFrequency}&rdquo;
          </p>
          <MiniLabel>Gifts</MiniLabel>
          <ChipRow items={path.gifts} />
          <div style={{ height: 16 }} />
          <MiniLabel>Story Preferences</MiniLabel>
          <ChipRow items={arch.storyPreferences} />
          <div style={{ height: 16 }} />
          <MiniLabel>Brand Alignment</MiniLabel>
          <BrandLogoRow items={arch.brandAlignment} />
        </div>

        {/* ── Resonance snapshot ── */}
        <Section label={`Your Resonance Snapshot · ${formatDate(profile.updatedAt)}`}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
            {snapshot.map(({ label, id }) => (
              <div key={label} style={{
                padding: '14px 16px', borderRadius: 14,
                background: 'var(--bg-card)', border: '1px solid var(--line)',
              }}>
                <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 6px' }}>{label}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>{SIGNATURE_FILMS[id].title}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Resonance profile (film-keyed) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SectionTitle>Resonance Profile</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
            <AccentCard label={`Current Mood · ${SIGNATURE_FILMS[moodId].title}`}  accent={GOLD} text={FILM_PROFILES[moodId].mood} />
            <AccentCard label={`Life Story · ${SIGNATURE_FILMS[storyId].title}`}   accent={GOLD} text={FILM_PROFILES[storyId].lifeStory} />
          </div>
          <AccentCard label={`Aspiration · ${aspFilm.title}`}              accent={GOLD}        text={aspProfile.aspiration} />
          <AccentCard label={`What You Move Away From · ${SIGNATURE_FILMS[avoidId].title}`} accent="var(--muted)" text={FILM_PROFILES[avoidId].exclusion} />
        </div>

        {/* ── Aspiration-personalized panel ── */}
        <div style={{
          padding: '24px 26px', borderRadius: 20,
          background: 'var(--bg-card)', border: '1px solid var(--line)',
        }}>
          <Eyebrow>Personalized from your aspiration pick</Eyebrow>
          <p style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: '10px 0 16px', letterSpacing: '-0.02em' }}>{aspFilm.title}</p>
          <MiniLabel>Lifestyle Resonance</MiniLabel>
          <p style={{ ...bodyText, marginBottom: 18 }}>{aspProfile.lifestyle}</p>
          <MiniLabel>Brand Resonance</MiniLabel>
          <BrandLogoRow items={aspProfile.brands} strong />
        </div>

        {/* ── Body resonance ── */}
        <div style={{
          padding: '24px 26px', borderRadius: 20,
          background: 'var(--bg-card)', border: '1px solid var(--line)',
        }}>
          <Eyebrow>Body Resonance</Eyebrow>
          <p style={{ fontSize: 17, fontWeight: 600, color: '#fff', margin: '12px 0 8px' }}>{aspProfile.body.region}</p>
          <p style={{ ...bodyText, marginBottom: 6 }}>{aspProfile.body.line}</p>
          <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 18px', lineHeight: 1.6 }}>{aspProfile.body.sub}</p>
          <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(232,200,122,0.07)', border: '1px solid rgba(232,200,122,0.18)', marginBottom: 18 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, margin: '0 0 5px' }}>Reorientation</p>
            <p style={{ fontSize: 15, fontStyle: 'italic', color: 'var(--text-dim)', margin: 0 }}>{aspProfile.body.reorientation}</p>
          </div>
          <MiniLabel>Nervous System</MiniLabel>
          <p style={{ fontSize: 14, fontWeight: 600, color: GOLD, margin: '0 0 8px' }}>{aspProfile.body.nervousSystem}</p>
          <p style={bodyText}>{aspProfile.body.nervousSystemDesc}</p>
        </div>

        {/* ── Resonance tags ── */}
        <Section label="Your Resonance Tags">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {aspProfile.tags.map(t => (
              <span key={t} style={{ fontSize: 13, fontWeight: 500, color: GOLD }}>#{t.replace(/\s+/g, '')}</span>
            ))}
          </div>
        </Section>

        {/* ── Films you'll resonate with ── */}
        <Section label="Films You'll Resonate With">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 14 }}>
            {aspProfile.parallelFilms.map(title => (
              <div key={title}>
                <div style={{
                  aspectRatio: '2/3', borderRadius: 12, overflow: 'hidden',
                  background: 'var(--bg-card)', border: '1px solid var(--line)',
                  display: 'grid', placeItems: 'center',
                }}>
                  {posters[title]
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={posters[title]!} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <FilmIcon />
                  }
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-dim)', margin: '8px 2px 0', textAlign: 'center' }}>{title}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── CTAs ── */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 18 }}>
          <button
            onClick={onRetake ?? (() => { window.location.href = '/' })}
            style={{
              padding: '15px 28px', borderRadius: 999, cursor: 'pointer',
              background: 'transparent', border: '1px solid var(--line)',
              color: 'var(--text-dim)', fontSize: 15, fontWeight: 600,
            }}
          >
            Retake Survey
          </button>
          <button
            onClick={onEnter}
            style={{
              padding: '15px 44px', borderRadius: 999, cursor: 'pointer', border: 'none',
              background: 'linear-gradient(135deg,#f0d58c,#e8c87a)', color: '#0a0a0e',
              fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em',
              boxShadow: '0 0 40px rgba(232,200,122,0.3)',
            }}
          >
            Enter SoarTV ✦
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Shared styles ─────────────────────────────────────────────────────────────

const bodyText: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, color: 'var(--text-dim)', margin: 0 }

// ─── Sub-components ────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD, margin: 0 }}>
      {children}
    </p>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>{children}</h2>
  )
}

function MiniLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
      {children}
    </p>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '20px 22px', borderRadius: 18, background: 'var(--bg-card)', border: '1px solid var(--line)' }}>
      <MiniLabel>{label}</MiniLabel>
      {children}
    </div>
  )
}

function AccentCard({ label, accent, text }: { label: string; accent: string; text: string }) {
  return (
    <div style={{ padding: '18px 20px', borderRadius: 18, background: 'var(--bg-card)', border: '1px solid var(--line)' }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, margin: '0 0 9px' }}>{label}</p>
      <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--text-dim)', margin: 0 }}>{text}</p>
    </div>
  )
}

function ChipRow({ items, strong }: { items: string[]; strong?: boolean }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {items.map(item => (
        <span key={item} style={{
          padding: '5px 12px', borderRadius: 999, fontSize: 13, fontWeight: 500,
          color: strong ? GOLD : 'var(--text-dim)',
          background: strong ? 'rgba(232,200,122,0.1)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${strong ? 'rgba(232,200,122,0.28)' : 'var(--line)'}`,
        }}>
          {item}
        </span>
      ))}
    </div>
  )
}

// Renders brand entries as logo tiles (Clearbit-resolved) with the brand name
// underneath. Falls back to the typographic chip if no logo URL is mapped or
// the image fails to load.
function BrandLogoRow({ items, strong }: { items: string[]; strong?: boolean }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {items.map(item => (
        <BrandTile key={item} name={item} strong={strong} />
      ))}
    </div>
  )
}

function BrandTile({ name, strong }: { name: string; strong?: boolean }) {
  const sources = brandLogoSources(name)
  const [attempt, setAttempt] = useState(0)
  const exhausted = attempt >= sources.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 88 }}>
      <div style={{
        width: 72, height: 72, borderRadius: 16,
        background: '#fff',
        border: `1px solid ${strong ? 'rgba(232,200,122,0.4)' : 'var(--line)'}`,
        boxShadow: strong
          ? '0 4px 18px rgba(232,200,122,0.18), inset 0 1px 0 rgba(255,255,255,0.6)'
          : '0 2px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6)',
        display: 'grid', placeItems: 'center', overflow: 'hidden',
      }}>
        {exhausted ? (
          <span style={{
            fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em',
            color: '#0a0a0e', textAlign: 'center', lineHeight: 1,
          }}>{name[0]?.toUpperCase() ?? '·'}</span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={attempt}
            src={sources[attempt]}
            alt={name}
            onError={() => setAttempt(a => a + 1)}
            style={{ width: '78%', height: '78%', objectFit: 'contain' }}
          />
        )}
      </div>
      <span style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
        color: strong ? GOLD : 'var(--text-dim)', textAlign: 'center', lineHeight: 1.25,
      }}>
        {name}
      </span>
    </div>
  )
}

function BeatBlock({ title, intro, beats, tone }: { title: string; intro: string; beats: string[]; tone: 'dim' | 'gold' }) {
  return (
    <div style={{ padding: '24px 26px', borderRadius: 20, background: 'var(--bg-card)', border: '1px solid var(--line)' }}>
      <SectionTitle>{title}</SectionTitle>
      <p style={{ fontSize: 14, color: 'var(--muted)', margin: '8px 0 20px', lineHeight: 1.6 }}>{intro}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {beats.map((beat, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{
              flexShrink: 0, width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center',
              fontSize: 12, fontWeight: 700,
              color: tone === 'gold' ? '#0a0a0e' : GOLD,
              background: tone === 'gold' ? 'linear-gradient(135deg,#f0d58c,#e8c87a)' : 'rgba(232,200,122,0.12)',
              border: tone === 'gold' ? 'none' : '1px solid rgba(232,200,122,0.3)',
            }}>
              {i + 1}
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--text-dim)', margin: 0 }}>{beat}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatDate(v: unknown): string {
  let d: Date
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const any = v as any
  if (any && typeof any.toDate === 'function')      d = any.toDate()
  else if (any && typeof any.seconds === 'number')  d = new Date(any.seconds * 1000)
  else if (typeof v === 'number')                   d = new Date(v)
  else                                              d = new Date()
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

// ─── Icons ─────────────────────────────────────────────────────────────────────

function PlayIcon()  { return <svg width="12" height="12" viewBox="0 0 13 13" fill="currentColor"><path d="M3 2l8 4.5L3 11V2z"/></svg> }
function PauseIcon() { return <svg width="12" height="12" viewBox="0 0 13 13" fill="currentColor"><rect x="2" y="2" width="3.5" height="9" rx="1"/><rect x="7.5" y="2" width="3.5" height="9" rx="1"/></svg> }
function Spinner()   { return <svg width="12" height="12" viewBox="0 0 13 13" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="22" strokeDashoffset="8" strokeLinecap="round"/><style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style></svg> }
function FilmIcon()  { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(232,200,122,0.3)" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="2.5"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/></svg> }
