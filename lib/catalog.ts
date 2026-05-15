import type { CatalogMovie, MoodOption, MoodCopy } from '@/types'

export const MOVIES: Record<string, CatalogMovie> = {
  halfwayHome: {
    id: 'halfwayHome', title: 'Halfway Home', sub: 'A road movie set against an Atlantic dusk',
    kind: 'aurora', palette: ['#fcd5ce', '#a18daa', '#1f1b2e'],
    moods: ['tender', 'wandering', 'quiet'],
    year: 2025, rated: 'PG-13', runtime: '1h 52m', genre: 'Drama',
  },
  nightVault: {
    id: 'nightVault', title: 'Night Vault', sub: 'Power has memory.',
    kind: 'orbit', palette: ['#c4b5fd', '#7c3aed', '#1e1b4b'],
    moods: ['heavy', 'restless'],
    year: 2026, rated: 'TV-MA', runtime: '4 Seasons', genre: 'Series',
    desc: 'When a forgotten government black site reactivates, a disgraced operative is pulled back into a war she swore she had buried.',
  },
  ironMeridian: {
    id: 'ironMeridian', title: 'Iron Meridian', sub: 'The last unmapped coastline.',
    kind: 'velour', palette: ['#fb923c', '#9a3412', '#1c1109'],
    moods: ['restless', 'curious'],
    year: 2026, rated: 'PG-13', runtime: '2h 14m', genre: 'Film',
    desc: 'Two rival cartographers race across a fractured continent to claim the last unmapped coastline before the empire does.',
  },
  lakeshoreStatic: {
    id: 'lakeshoreStatic', title: 'Lakeshore Static', sub: "A summer that won't end.",
    kind: 'tideline', palette: ['#67e8f9', '#0e7490', '#0b1f2a'],
    moods: ['heavy', 'quiet', 'wandering'],
    year: 2026, rated: 'TV-14', runtime: '3 Seasons', genre: 'Series',
    desc: 'A fishing town with no working clocks. A detective who cannot sleep. The longest summer of their lives.',
  },
  polarRoses: {
    id: 'polarRoses', title: 'Polar Roses', sub: 'Some loves bloom in the cold.',
    kind: 'roses', palette: ['#fbcfe8', '#7c3aed', '#1e1b4b'],
    moods: ['tender', 'quiet'],
    year: 2025, rated: 'PG-13', runtime: '1h 44m', genre: 'Romance',
  },
  brightAnimal: {
    id: 'brightAnimal', title: 'Bright Animal', sub: 'A nightlife in neon.',
    kind: 'animal', palette: ['#f0abfc', '#7e22ce', '#0f0418'],
    moods: ['restless', 'wired', 'curious'],
    year: 2026, rated: 'TV-MA', runtime: '1 Season', genre: 'Series',
  },
}

export const MOOD_COPY: Record<string, MoodCopy> = {
  heavy:    { label: 'Quietly heavy', hint: 'Films that hold the weight with you' },
  quiet:    { label: 'Quiet',         hint: 'Slow burns, soft edges' },
  tender:   { label: 'Tender',        hint: 'Films that ask gently' },
  restless: { label: 'Restless',      hint: 'Stories with their foot down' },
  wired:    { label: 'Wired',         hint: 'Loud, bright, fast' },
  curious:  { label: 'Curious',       hint: 'For the part of you still asking' },
  wandering:{ label: 'Wandering',     hint: 'Films that go somewhere with you' },
}

export const Q1_TITLES = [
  'halfwayHome', 'nightVault', 'ironMeridian', 'lakeshoreStatic', 'polarRoses', 'brightAnimal',
]

export const Q2_OPTIONS: MoodOption[] = [
  { id: 'wired',    name: 'Wired & restless',  desc: "Foot tapping, can't sit still", g: 'linear-gradient(135deg,#f97316 0%,#dc2626 60%,#7f1d1d 100%)' },
  { id: 'heavy',    name: 'Quietly heavy',     desc: 'Carrying something today',          g: 'linear-gradient(135deg,#312e81 0%,#1e1b4b 60%,#020617 100%)' },
  { id: 'curious',  name: 'Curious',           desc: 'Up for being surprised',            g: 'linear-gradient(135deg,#06b6d4 0%,#0c4a6e 60%,#082f49 100%)' },
  { id: 'tender',   name: 'Tender',            desc: 'Want something to be kind to you',  g: 'linear-gradient(135deg,#fda4af 0%,#be185d 60%,#3b0764 100%)' },
  { id: 'wandering',name: 'Wandering',         desc: 'Looking for somewhere to land',     g: 'linear-gradient(135deg,#a3b18a 0%,#588157 60%,#1b2a1f 100%)' },
  { id: 'quiet',    name: 'Just unwind',       desc: "Don't make me think much",     g: 'linear-gradient(135deg,#e9d5ff 0%,#a78bfa 50%,#312e81 100%)' },
]

export const Q3_OPTIONS: MoodOption[] = [
  { id: 'company', name: 'Keep me company',   desc: 'Soft. Background-friendly. Easy.', g: 'linear-gradient(135deg,#fde68a 0%,#f59e0b 60%,#451a03 100%)' },
  { id: 'move',    name: 'Move me',           desc: "Something I'll remember.",    g: 'linear-gradient(135deg,#c4b5fd 0%,#7c3aed 60%,#1e1b4b 100%)' },
  { id: 'wreck',   name: 'Wreck me a little', desc: 'I want to feel it.',              g: 'linear-gradient(135deg,#fca5a5 0%,#dc2626 60%,#1c0a04 100%)' },
]
