// ─────────────────────────────────────────────────────────────────────────────
// FilmFlow7 — Resonance Archetype System (canonical, v5.14.26)
// 8 archetypes, each with an integrated path. Drives the survey, the
// conversational entry, profile generation, and home-page curation.
// ─────────────────────────────────────────────────────────────────────────────

export type ArchetypeId =
  | 'hiddenOne'
  | 'performer'
  | 'seeker'
  | 'giver'
  | 'protector'
  | 'shapeshifter'
  | 'warrior'
  | 'dreamer'

export type IntegratedPathId =
  | 'alchemist'
  | 'visionary'
  | 'sage'
  | 'healer'
  | 'guardian'
  | 'catalyst'
  | 'leader'
  | 'creator'

export interface ArchetypeFilm {
  tmdbId: number
  title:  string
  type:   'movie'
}

export interface Archetype {
  id:       ArchetypeId
  name:     string
  tagline:  string          // the archetype's core frequency, used as a tagline
  // ── Canonical resonance fields ───────────────────────────────────────────
  essence:        string
  coreFear:       string
  coreDesire:     string
  coreFrequency:  string
  emotionalTone:      string[]
  integratedTraits:   string[]
  resonanceDisruption: string[]
  resonanceAlignment:  string[]
  growthPath:     string
  regulatedState:   string
  dysregulatedState: string
  // ── Display / curation fields (kept for existing consumers) ──────────────
  somaticPattern:    string
  physicalPatterns:  string[]
  emotionalPatterns: string[]   // == canonical dysregulated traits
  storyPreferences:  string[]
  brandAlignment:    string[]
  integratedPath:     IntegratedPathId
  integratedPathName: string
  integratedPathDesc: string
  gift:        string
  invitation:  string
  // TMDB genre IDs for content curation
  movieGenres: number[]
  tvGenres:    number[]
  // Resonance journey rows shown on the home page
  journeys: { label: string; fromTo: string; genres: number[] }[]
  films:    ArchetypeFilm[]
}

export interface IntegratedPath {
  id:            IntegratedPathId
  name:          string
  essence:       string
  coreFrequency: string
  gifts:         string[]
  regulatedTraits: string[]
}

// ─── Film Pools ────────────────────────────────────────────────────────────────
// Each archetype carries a pool of films that hold its psychological energy.
// One film per archetype is surfaced in the survey, rotated weekly so it stays
// fresh. Every tmdbId below is verified against the TMDB API.

const FILM_POOLS: Record<ArchetypeId, ArchetypeFilm[]> = {
  hiddenOne: [
    { tmdbId: 489,    title: 'Good Will Hunting',                type: 'movie' },
    { tmdbId: 84892,  title: 'The Perks of Being a Wallflower',  type: 'movie' },
    { tmdbId: 391713, title: 'Lady Bird',                        type: 'movie' },
    { tmdbId: 152601, title: 'Her',                              type: 'movie' },
    { tmdbId: 453,    title: 'A Beautiful Mind',                 type: 'movie' },
  ],
  performer: [
    { tmdbId: 313369, title: 'La La Land',           type: 'movie' },
    { tmdbId: 316029, title: 'The Greatest Showman', type: 'movie' },
    { tmdbId: 332562, title: 'A Star Is Born',       type: 'movie' },
    { tmdbId: 194662, title: 'Birdman',              type: 'movie' },
    { tmdbId: 44214,  title: 'Black Swan',           type: 'movie' },
  ],
  seeker: [
    { tmdbId: 603,    title: 'The Matrix',       type: 'movie' },
    { tmdbId: 5915,   title: 'Into the Wild',    type: 'movie' },
    { tmdbId: 38167,  title: 'Eat Pray Love',    type: 'movie' },
    { tmdbId: 37165,  title: 'The Truman Show',  type: 'movie' },
    { tmdbId: 329865, title: 'Arrival',          type: 'movie' },
  ],
  giver: [
    { tmdbId: 22881,  title: 'The Blind Side',                       type: 'movie' },
    { tmdbId: 406997, title: 'Wonder',                               type: 'movie' },
    { tmdbId: 501907, title: 'A Beautiful Day in the Neighborhood',  type: 'movie' },
    { tmdbId: 50014,  title: 'The Help',                             type: 'movie' },
    { tmdbId: 14160,  title: 'Up',                                   type: 'movie' },
  ],
  protector: [
    { tmdbId: 284054, title: 'Black Panther',  type: 'movie' },
    { tmdbId: 98,     title: 'Gladiator',      type: 'movie' },
    { tmdbId: 8587,   title: 'The Lion King',  type: 'movie' },
    { tmdbId: 197,    title: 'Braveheart',     type: 'movie' },
    { tmdbId: 263115, title: 'Logan',          type: 'movie' },
  ],
  shapeshifter: [
    { tmdbId: 10674,  title: 'Mulan',                   type: 'movie' },
    { tmdbId: 350,    title: 'The Devil Wears Prada',   type: 'movie' },
    { tmdbId: 381284, title: 'Hidden Figures',         type: 'movie' },
    { tmdbId: 640,    title: 'Catch Me If You Can',     type: 'movie' },
    { tmdbId: 8835,   title: 'Legally Blonde',          type: 'movie' },
  ],
  warrior: [
    { tmdbId: 1366,   title: 'Rocky',                    type: 'movie' },
    { tmdbId: 312221, title: 'Creed',                    type: 'movie' },
    { tmdbId: 59440,  title: 'Warrior',                  type: 'movie' },
    { tmdbId: 361743, title: 'Top Gun: Maverick',        type: 'movie' },
    { tmdbId: 1402,   title: 'The Pursuit of Happyness', type: 'movie' },
  ],
  dreamer: [
    { tmdbId: 194,    title: 'Amélie',                   type: 'movie' },
    { tmdbId: 587,    title: 'Big Fish',                 type: 'movie' },
    { tmdbId: 120467, title: 'The Grand Budapest Hotel', type: 'movie' },
    { tmdbId: 44826,  title: 'Hugo',                     type: 'movie' },
    { tmdbId: 162,    title: 'Edward Scissorhands',      type: 'movie' },
  ],
}

// Survey / scoring order — the canonical 8.
export const ARCHETYPE_ORDER: ArchetypeId[] = [
  'hiddenOne', 'performer', 'seeker', 'giver',
  'protector', 'shapeshifter', 'warrior', 'dreamer',
]

// ISO-ish week number — deterministic for every user that week.
function getWeekSeed(): number {
  const now   = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  return Math.floor((now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000))
}

// The active film for each archetype this week — same for all users.
export function getWeeklyFilms(): Record<ArchetypeId, ArchetypeFilm> {
  const seed = getWeekSeed()
  const result = {} as Record<ArchetypeId, ArchetypeFilm>
  ARCHETYPE_ORDER.forEach((id, idx) => {
    const pool = FILM_POOLS[id]
    result[id] = pool[(seed + idx) % pool.length]
  })
  return result
}

// The 8 survey films in order — one per archetype, rotated weekly.
export function getSurveyFilms(): (ArchetypeFilm & { archetypeId: ArchetypeId })[] {
  const weekly = getWeeklyFilms()
  return ARCHETYPE_ORDER.map(id => ({ ...weekly[id], archetypeId: id }))
}

// ─── Integrated Paths ──────────────────────────────────────────────────────────

export const INTEGRATED_PATHS: Record<IntegratedPathId, IntegratedPath> = {
  alchemist: {
    id: 'alchemist',
    name: 'Alchemist',
    essence: 'Transforms pain, experience, and emotional depth into wisdom and purpose.',
    coreFrequency: 'Nothing I have lived is wasted.',
    gifts: ['transformation', 'wisdom', 'emotional depth', 'embodiment'],
    regulatedTraits: ['presence', 'clarity', 'magnetic calm', 'truthful expression'],
  },
  visionary: {
    id: 'visionary',
    name: 'Visionary',
    essence: 'Leads through authentic vision instead of performance or validation.',
    coreFrequency: "My vision is valid even if everyone doesn't understand it.",
    gifts: ['leadership', 'clarity', 'creative direction', 'cultural influence'],
    regulatedTraits: ['conviction', 'presence', 'authentic communication', 'inspiration'],
  },
  sage: {
    id: 'sage',
    name: 'Sage',
    essence: 'Trusts inner knowing and turns lived experience into grounded, embodied wisdom.',
    coreFrequency: 'I already carry what I was searching for.',
    gifts: ['wisdom', 'clarity', 'presence', 'discernment'],
    regulatedTraits: ['embodiment', 'stillness', 'insight', 'grounded curiosity'],
  },
  healer: {
    id: 'healer',
    name: 'Healer',
    essence: 'Creates restoration and connection without self-abandonment.',
    coreFrequency: 'I give from fullness, not depletion.',
    gifts: ['compassion', 'restoration', 'empathy', 'emotional safety'],
    regulatedTraits: ['boundaries', 'reciprocity', 'nurturing presence', 'balance'],
  },
  guardian: {
    id: 'guardian',
    name: 'Guardian',
    essence: 'Protects and leads from grounded trust rather than fear or control.',
    coreFrequency: 'Safety does not require constant vigilance.',
    gifts: ['stability', 'integrity', 'leadership', 'protection'],
    regulatedTraits: ['calm strength', 'trust', 'reliability', 'grounded authority'],
  },
  catalyst: {
    id: 'catalyst',
    name: 'Catalyst',
    essence: 'Transforms environments and people through authentic self-expression.',
    coreFrequency: 'I do not abandon myself to belong.',
    gifts: ['transformation', 'innovation', 'authenticity', 'cultural influence'],
    regulatedTraits: ['rooted identity', 'adaptive leadership', 'creative influence', 'presence'],
  },
  leader: {
    id: 'leader',
    name: 'Leader',
    essence: 'Builds vision, structure, and impact from peace rather than survival.',
    coreFrequency: 'My presence leads as much as my effort.',
    gifts: ['vision', 'strength', 'direction', 'resilience'],
    regulatedTraits: ['calm power', 'decisiveness', 'stability', 'purpose'],
  },
  creator: {
    id: 'creator',
    name: 'Creator',
    essence: 'Creates from joy, worth, flow, and embodied creativity.',
    coreFrequency: 'My creativity deserves abundance and impact.',
    gifts: ['innovation', 'artistry', 'expression', 'imagination'],
    regulatedTraits: ['creative confidence', 'abundance', 'joyful expression', 'creative flow'],
  },
}

// ─── Archetype Definitions ─────────────────────────────────────────────────────

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  hiddenOne: {
    id: 'hiddenOne',
    name: 'Hidden One',
    tagline: "Don't see me too deeply, but don't forget me either.",
    essence: 'Wants to be seen but associates visibility with danger.',
    coreFear:   'If I fully show up, I will be rejected or overlooked.',
    coreDesire: 'To be fully seen and known — without it ever costing you your safety.',
    coreFrequency: "Don't see me too deeply, but don't forget me either.",
    emotionalTone:       ['quiet', 'deep', 'longing', 'guarded'],
    integratedTraits:    ['embodied wisdom', 'magnetic calm', 'emotional depth', 'truthful presence'],
    resonanceDisruption: ['Hides true voice', 'Avoids visibility', 'Feels unseen despite depth'],
    resonanceAlignment:  ['Speaks truth directly', 'Transforms pain into meaning', 'Creates deep emotional connection'],
    growthPath: 'Visibility through safety, embodiment, and self-trust.',
    regulatedState:   'Grounded, emotionally present, quietly powerful.',
    dysregulatedState:'Invisible, emotionally withdrawn, afraid of exposure.',
    somaticPattern: 'Held breath, lowered gaze, a body practiced at taking up less space.',
    physicalPatterns:  ['shallow breathing', 'low or guarded energy', 'tension from holding back', 'unrestful sleep'],
    emotionalPatterns: ['withdrawal', 'self-doubt', 'over-editing yourself', 'hesitation'],
    storyPreferences:  ['transformation', 'redemption', 'identity', 'healing journeys'],
    brandAlignment:    ['A24', 'Calm', 'Aesop', 'Moleskine'],
    integratedPath: 'alchemist',
    integratedPathName: 'Alchemist',
    integratedPathDesc: 'Transforms pain, experience, and emotional depth into wisdom and purpose.',
    gift:       'Emotional depth that, once spoken, becomes wisdom other people can feel.',
    invitation: 'Your visibility is safe to grow into. Let yourself be found.',
    movieGenres: [18, 10749, 10402],
    tvGenres:    [18, 9648],
    journeys: [
      { label: 'From Invisible → Seen',  fromTo: 'invisible-seen', genres: [18, 10749] },
      { label: 'From Numb → Feeling',    fromTo: 'numb-feeling',   genres: [18] },
      { label: 'From Hiding → Whole',    fromTo: 'hiding-whole',   genres: [18, 9648] },
    ],
    films: FILM_POOLS.hiddenOne,
  },

  performer: {
    id: 'performer',
    name: 'Performer',
    tagline: 'Will you still love me without the performance?',
    essence: 'Seeks love and validation through achievement and attention.',
    coreFear:   'If I stop performing, I will lose love and relevance.',
    coreDesire: 'To be loved for who you are — not only for what you produce.',
    coreFrequency: 'Will you still love me without the performance?',
    emotionalTone:       ['charismatic', 'energetic', 'expressive', 'anxious'],
    integratedTraits:    ['clarity', 'authentic leadership', 'creative conviction', 'cultural influence'],
    resonanceDisruption: ['Polished but emotionally distant', 'Changes voice for approval', 'Feels admired but unknown'],
    resonanceAlignment:  ['Speaks from conviction', 'Creates with authenticity', 'Leads through vision instead of validation'],
    growthPath: 'Moving from performance into authentic expression.',
    regulatedState:   'Expressive, inspiring, grounded in purpose.',
    dysregulatedState:'Performative, approval-seeking, emotionally exhausted.',
    somaticPattern: 'Bright, mobilized energy that rarely lets the system fully land.',
    physicalPatterns:  ['adrenaline spikes', 'jaw and shoulder tension', 'burnout cycles', 'difficulty resting'],
    emotionalPatterns: ['overperforming', 'people-pleasing', 'validation seeking', 'burnout'],
    storyPreferences:  ['rise to greatness', 'legacy', 'purpose', 'creative leadership'],
    brandAlignment:    ['Nike', 'Spotify', 'Vogue', 'TED'],
    integratedPath: 'visionary',
    integratedPathName: 'Visionary',
    integratedPathDesc: 'Leads through authentic vision instead of performance or validation.',
    gift:       'The ability to move a room — and, once it is authentic, to move a culture.',
    invitation: 'You are already enough in the silence between performances.',
    movieGenres: [18, 10402, 36],
    tvGenres:    [18, 10764],
    journeys: [
      { label: 'From Proving → Being',     fromTo: 'proving-being',     genres: [18] },
      { label: 'From Spotlight → Truth',   fromTo: 'spotlight-truth',   genres: [18, 10402] },
      { label: 'From Applause → Purpose',  fromTo: 'applause-purpose',  genres: [18, 36] },
    ],
    films: FILM_POOLS.performer,
  },

  seeker: {
    id: 'seeker',
    name: 'Seeker',
    tagline: 'I will feel whole once I finally figure it out.',
    essence: 'Searches endlessly for meaning, healing, and truth.',
    coreFear:   'If I stop searching, I will face unresolved pain.',
    coreDesire: 'To find the meaning that finally lets you feel whole.',
    coreFrequency: 'I will feel whole once I finally figure it out.',
    emotionalTone:       ['curious', 'restless', 'introspective', 'sensitive'],
    integratedTraits:    ['embodiment', 'wisdom', 'clarity', 'presence'],
    resonanceDisruption: ['Constantly shifting direction', 'Never feels complete', 'Consumes more than creates'],
    resonanceAlignment:  ['Embodies lived wisdom', 'Trusts inner knowing', 'Transforms experience into guidance'],
    growthPath: 'Moving from endless pursuit into embodied presence.',
    regulatedState:   'Grounded curiosity and embodied wisdom.',
    dysregulatedState:'Restless searching and fragmented identity.',
    somaticPattern: 'Restless mental motion, a nervous system always reaching ahead.',
    physicalPatterns:  ['racing thoughts', 'restlessness', 'difficulty settling', 'sleep disruption'],
    emotionalPatterns: ['overthinking', 'constant self-improvement', 'spiritual bypassing', 'incompletion'],
    storyPreferences:  ['self-discovery', 'spiritual journeys', 'mystery', 'awakening'],
    brandAlignment:    ['Notion', 'Headspace', 'Airbnb', 'Penguin Books'],
    integratedPath: 'sage',
    integratedPathName: 'Sage',
    integratedPathDesc: 'Trusts inner knowing and turns lived experience into grounded, embodied wisdom.',
    gift:       'A curiosity that turns lived experience into wisdom worth following.',
    invitation: 'Clarity arrives when you stop chasing it. You can stop here.',
    movieGenres: [878, 9648, 12, 18],
    tvGenres:    [10765, 9648],
    journeys: [
      { label: 'From Lost → Found',           fromTo: 'lost-found',         genres: [12, 18] },
      { label: 'From Searching → Knowing',    fromTo: 'searching-knowing',  genres: [9648, 878] },
      { label: 'From Question → Presence',    fromTo: 'question-presence',  genres: [18, 9648] },
    ],
    films: FILM_POOLS.seeker,
  },

  giver: {
    id: 'giver',
    name: 'Giver',
    tagline: 'I earn love through sacrifice.',
    essence: 'Finds worth through helping and emotionally supporting others.',
    coreFear:   'If I prioritize myself, I will lose connection.',
    coreDesire: 'Connection that flows both ways — to be held as much as you hold.',
    coreFrequency: 'I earn love through sacrifice.',
    emotionalTone:       ['warm', 'nurturing', 'empathetic', 'depleted'],
    integratedTraits:    ['healthy boundaries', 'compassion', 'balanced reciprocity', 'restoration'],
    resonanceDisruption: ['Overextends emotionally', 'Attracts dependent relationships', 'Feels unseen despite giving'],
    resonanceAlignment:  ['Gives from overflow', 'Allows mutual support', 'Creates safe emotional spaces'],
    growthPath: 'Learning that receiving is part of connection.',
    regulatedState:   'Compassionate, balanced, emotionally nourished.',
    dysregulatedState:'Self-abandoning, exhausted, emotionally depleted.',
    somaticPattern: 'A body tuned outward, scanning for others\' needs before its own.',
    physicalPatterns:  ['fatigue and depletion', 'digestive tension', 'tension headaches', 'running on empty'],
    emotionalPatterns: ['people-pleasing', 'overgiving', 'self-neglect', 'resentment'],
    storyPreferences:  ['healing', 'family', 'community', 'emotional restoration'],
    brandAlignment:    ['Patagonia', 'TOMS', 'Whole Foods', 'charity: water'],
    integratedPath: 'healer',
    integratedPathName: 'Healer',
    integratedPathDesc: 'Creates restoration and connection without self-abandonment.',
    gift:       'A warmth that makes other people feel genuinely safe and seen.',
    invitation: 'Receiving is not the opposite of generosity. It completes it.',
    movieGenres: [18, 10751, 10749],
    tvGenres:    [18, 10751],
    journeys: [
      { label: 'From Drained → Full',             fromTo: 'drained-full',           genres: [18, 10751] },
      { label: 'From Sacrifice → Reciprocity',    fromTo: 'sacrifice-reciprocity',  genres: [18, 10749] },
      { label: 'From Unseen → Held',              fromTo: 'unseen-held',            genres: [18, 10751] },
    ],
    films: FILM_POOLS.giver,
  },

  protector: {
    id: 'protector',
    name: 'Protector',
    tagline: "It's all on me.",
    essence: 'Uses control and vigilance to create safety.',
    coreFear:   'If I let go, everything will fall apart.',
    coreDesire: 'Stable ground, trusted leadership, and the security to guard what matters.',
    coreFrequency: "It's all on me.",
    emotionalTone:       ['strong', 'watchful', 'tense', 'responsible'],
    integratedTraits:    ['grounded protection', 'calm leadership', 'safety', 'stability'],
    resonanceDisruption: ['Repels support', 'Feels emotionally inaccessible', 'Carries everything alone'],
    resonanceAlignment:  ['Leads with trust', 'Creates safe environments', 'Allows shared responsibility'],
    growthPath: 'Learning that safety does not require constant control.',
    regulatedState:   'Protective, calm, grounded, dependable.',
    dysregulatedState:'Controlling, tense, emotionally guarded.',
    somaticPattern: 'Braced muscles, a jaw set against the next thing that could go wrong.',
    physicalPatterns:  ['muscular tension', 'jaw clenching', 'digestive constriction', 'chronic vigilance'],
    emotionalPatterns: ['hypervigilance', 'control', 'emotional suppression', 'over-responsibility'],
    storyPreferences:  ['protection', 'duty', 'family', 'leadership'],
    brandAlignment:    ['Patagonia', 'Rolex', 'Land Rover', 'Garmin'],
    integratedPath: 'guardian',
    integratedPathName: 'Guardian',
    integratedPathDesc: 'Protects and leads from grounded trust rather than fear or control.',
    gift:       'Steadiness that everyone around you quietly anchors to.',
    invitation: 'Safety does not require your constant vigilance. You can set the weight down.',
    movieGenres: [28, 18, 10752, 12],
    tvGenres:    [10759, 18],
    journeys: [
      { label: 'From Chaos → Calm',         fromTo: 'chaos-calm',       genres: [28, 53] },
      { label: 'From Duty → Freedom',       fromTo: 'duty-freedom',     genres: [18, 10752] },
      { label: 'From Vigilance → Trust',    fromTo: 'vigilance-trust',  genres: [18, 28] },
    ],
    films: FILM_POOLS.protector,
  },

  shapeshifter: {
    id: 'shapeshifter',
    name: 'Shapeshifter',
    tagline: 'I become what others need me to be.',
    essence: 'Adapts constantly to gain belonging and acceptance.',
    coreFear:   'If people see the real me, I will be abandoned.',
    coreDesire: 'To be accepted as you actually are — without performing a version to earn it.',
    coreFrequency: 'I become what others need me to be.',
    emotionalTone:       ['adaptable', 'social', 'fluid', 'unrooted'],
    integratedTraits:    ['authentic transformation', 'influence', 'rooted flexibility', 'self-expression'],
    resonanceDisruption: ['Feels inconsistent', 'Lacks clear identity', 'Attracts shallow connection'],
    resonanceAlignment:  ['Leads through authenticity', 'Transforms spaces naturally', 'Remains rooted while evolving'],
    growthPath: 'Moving from adaptation into authentic self-expression.',
    regulatedState:   'Adaptable yet grounded in self.',
    dysregulatedState:'Fragmented, masked, disconnected from identity.',
    somaticPattern: 'Identity that shifts with the room; a self that merges to stay safe.',
    physicalPatterns:  ['anxiety and unease', 'digestive flare-ups', 'skin reactivity', 'feeling unrooted'],
    emotionalPatterns: ['identity confusion', 'masking', 'code-switching', 'people adaptation'],
    storyPreferences:  ['identity', 'reinvention', 'transformation', 'social dynamics'],
    brandAlignment:    ['Glossier', 'Zara', 'Spotify', 'Instagram'],
    integratedPath: 'catalyst',
    integratedPathName: 'Catalyst',
    integratedPathDesc: 'Transforms environments and people through authentic self-expression.',
    gift:       'Extraordinary attunement to people — belonging without disappearing.',
    invitation: 'You were always enough, long before the adapting began.',
    movieGenres: [18, 35, 10749, 14],
    tvGenres:    [18, 35],
    journeys: [
      { label: 'From Masking → Real',           fromTo: 'masking-real',       genres: [18, 35] },
      { label: 'From Adapting → Arriving',      fromTo: 'adapting-arriving',  genres: [35, 10749] },
      { label: 'From Fitting In → Belonging',   fromTo: 'fitting-belonging',  genres: [18, 14] },
    ],
    films: FILM_POOLS.shapeshifter,
  },

  warrior: {
    id: 'warrior',
    name: 'Warrior',
    tagline: 'Nothing happens unless I force it.',
    essence: 'Uses strength and endurance to survive and protect.',
    coreFear:   'If I stop pushing, everything will collapse.',
    coreDesire: 'To prove that strength and will can carry you — and the people you love — through.',
    coreFrequency: 'Nothing happens unless I force it.',
    emotionalTone:       ['intense', 'focused', 'disciplined', 'guarded'],
    integratedTraits:    ['grounded leadership', 'clarity', 'calm power', 'vision'],
    resonanceDisruption: ['Operates from pressure', 'Repels softness and support', 'Turns life into constant battle'],
    resonanceAlignment:  ['Leads from peace', 'Balances strength with softness', 'Builds sustainable impact'],
    growthPath: 'Moving from survival-driven force into visionary leadership.',
    regulatedState:   'Strong, calm, visionary, dependable.',
    dysregulatedState:'Driven, tense, emotionally armored.',
    somaticPattern: 'Mobilized, forward-leaning energy that refuses to fully stand down.',
    physicalPatterns:  ['adrenal fatigue', 'clenched fists and jaw', 'shoulder tension', 'overtraining and burnout'],
    emotionalPatterns: ['overworking', 'emotional suppression', 'hyper-independence', 'burnout'],
    storyPreferences:  ['overcoming adversity', 'mission', 'hero journeys', 'legacy'],
    brandAlignment:    ['Nike', 'Under Armour', 'Red Bull', 'Whoop'],
    integratedPath: 'leader',
    integratedPathName: 'Leader',
    integratedPathDesc: 'Builds vision, structure, and impact from peace rather than survival.',
    gift:       'Relentless resilience that makes the impossible look survivable.',
    invitation: 'Rest is not surrender. Your strength is allowed to soften.',
    movieGenres: [28, 18, 10752, 12],
    tvGenres:    [10759, 18],
    journeys: [
      { label: 'From Broken → Rebuilt',      fromTo: 'broken-rebuilt',   genres: [18, 28] },
      { label: 'From Survival → Vision',     fromTo: 'survival-vision',  genres: [28, 10752] },
      { label: 'From Force → Peace',         fromTo: 'force-peace',      genres: [18, 28] },
    ],
    films: FILM_POOLS.warrior,
  },

  dreamer: {
    id: 'dreamer',
    name: 'Dreamer',
    tagline: 'My pain is what makes my creativity meaningful.',
    essence: 'Deeply imaginative and emotionally expressive, but often ties worth to struggle.',
    coreFear:   'If I succeed or become abundant, I will lose my authenticity.',
    coreDesire: 'To live inside a world still alive with wonder, beauty, and the possible.',
    coreFrequency: 'My pain is what makes my creativity meaningful.',
    emotionalTone:       ['creative', 'emotional', 'visionary', 'romantic'],
    integratedTraits:    ['creative confidence', 'joyful expression', 'abundance', 'innovation'],
    resonanceDisruption: ['Romanticizes suffering', 'Underprices gifts', 'Avoids sustainable success'],
    resonanceAlignment:  ['Creates from joy and truth', 'Allows creativity to generate wealth', 'Treats art as both sacred and valuable'],
    growthPath: 'Releasing the belief that suffering is required for meaningful art.',
    regulatedState:   'Inspired, expressive, creatively abundant.',
    dysregulatedState:'Emotionally overwhelmed, undervalued, creatively blocked.',
    somaticPattern: 'Expansive, sensory openness that finds harsh reality genuinely jarring.',
    physicalPatterns:  ['overstimulation sensitivity', 'escapist drift', 'vivid restless sleep', 'energy that swings'],
    emotionalPatterns: ['self-undervaluing', 'financial avoidance', 'martyrdom', 'creative inconsistency'],
    storyPreferences:  ['imagination', 'beauty', 'self-expression', 'inspiration'],
    brandAlignment:    ['Pixar', 'LEGO', 'Moleskine', 'Etsy'],
    integratedPath: 'creator',
    integratedPathName: 'Creator',
    integratedPathDesc: 'Creates from joy, worth, flow, and embodied creativity.',
    gift:       'The ability to keep beauty and possibility alive where others stopped looking.',
    invitation: "Your dreams are meant to be built, not only imagined. You don't have to suffer for them.",
    movieGenres: [14, 16, 12, 35],
    tvGenres:    [16, 10765],
    journeys: [
      { label: 'From Fantasy → Real',      fromTo: 'fantasy-real',    genres: [14, 18] },
      { label: 'From Suffering → Joy',     fromTo: 'suffering-joy',   genres: [35, 14] },
      { label: 'From Imagined → Made',     fromTo: 'imagined-made',   genres: [16, 12] },
    ],
    films: FILM_POOLS.dreamer,
  },
}

// ─── Legacy compatibility ──────────────────────────────────────────────────────
// Pre-v5.14.26 the app used a different 7-archetype taxonomy. Map any stored
// legacy id onto the closest canonical archetype so old saved profiles keep
// rendering instead of crashing the UI.

const LEGACY_ARCHETYPE_MAP: Record<string, ArchetypeId> = {
  fighter:      'warrior',
  awakener:     'seeker',
  protector:    'protector',
  hero:         'warrior',
  lonewolf:     'hiddenOne',
  shapeshifter: 'shapeshifter',
  dreamer:      'dreamer',
}

// Resolves any stored archetype id — current or legacy — to a valid canonical
// archetype. Falls back to 'seeker', the archetype of not-yet-knowing.
export function resolveArchetype(id: string | null | undefined): ArchetypeId {
  if (id && id in ARCHETYPES)          return id as ArchetypeId
  if (id && id in LEGACY_ARCHETYPE_MAP) return LEGACY_ARCHETYPE_MAP[id]
  return 'seeker'
}

// ─── Scoring ───────────────────────────────────────────────────────────────────
// Survey answers: mood, aspiration, lifeStory, avoid — each is an ArchetypeId.
// `entry` is the optional archetype detected by the FilmFlow7 conversational
// entry. Returns the dominant archetype plus the full score breakdown.

export interface ResonanceScore {
  primary:   ArchetypeId
  secondary: ArchetypeId
  scores:    Record<ArchetypeId, number>
}

export interface ResonanceAnswers {
  mood:       ArchetypeId
  aspiration: ArchetypeId
  lifeStory:  ArchetypeId
  avoid:      ArchetypeId
  entry?:     ArchetypeId
}

export function scoreResonance(answers: ResonanceAnswers): ResonanceScore {
  const weights = {
    mood:       3,    // strongest signal — how you feel right now
    aspiration: 2.5,  // who you want to become
    lifeStory:  2,    // where you've been
    entry:      1.5,  // FilmFlow7 conversational read, when present
  }

  const scores = {} as Record<ArchetypeId, number>
  ARCHETYPE_ORDER.forEach(id => { scores[id] = 0 })

  scores[answers.mood]       += weights.mood
  scores[answers.aspiration] += weights.aspiration
  scores[answers.lifeStory]  += weights.lifeStory
  if (answers.entry) scores[answers.entry] += weights.entry

  // `avoid` is the shadow — what you reject. It does not add to its own
  // archetype, but rejecting AND aspiring to the same energy signals the
  // identity tension that defines the Shapeshifter.
  if (answers.aspiration === answers.avoid) {
    scores.shapeshifter += 1.5
  }

  const sorted = (Object.entries(scores) as [ArchetypeId, number][])
    .sort((a, b) => b[1] - a[1])

  return {
    primary:   sorted[0][0],
    secondary: sorted[1][0],
    scores,
  }
}
