export type ArchetypeId =
  | 'fighter'
  | 'awakener'
  | 'protector'
  | 'hero'
  | 'lonewolf'
  | 'shapeshifter'
  | 'dreamer'

export interface ArchetypeFilm {
  tmdbId: number
  title:  string
  type:   'movie'
}

export interface Archetype {
  id:            ArchetypeId
  name:          string
  tagline:       string
  coreFear:      string
  coreDesire:    string
  somaticPattern: string
  physicalPatterns: string[]
  emotionalPatterns: string[]
  storyPreferences:  string[]
  brandAlignment:    string[]
  integratedPath:    string
  integratedPathDesc: string
  gift:              string
  invitation:        string
  // TMDB genre IDs for content curation
  movieGenres: number[]
  tvGenres:    number[]
  // Resonance journey rows
  journeys: { label: string; fromTo: string; genres: number[] }[]
  films: ArchetypeFilm[]
}

// ─── Film Pools ────────────────────────────────────────────────────────────────
// Each archetype has a pool of films that carry its psychological energy.
// Weekly rotation picks one per archetype so the survey feels fresh.

const FILM_POOLS: Record<ArchetypeId, ArchetypeFilm[]> = {
  fighter: [
    { tmdbId: 1367,   title: 'Rocky',                    type: 'movie' },
    { tmdbId: 312221, title: 'Creed',                    type: 'movie' },
    { tmdbId: 244786, title: 'Whiplash',                 type: 'movie' },
    { tmdbId: 72554,  title: '8 Mile',                   type: 'movie' },
    { tmdbId: 14534,  title: 'The Pursuit of Happyness', type: 'movie' },
    { tmdbId: 57201,  title: 'Warrior',                  type: 'movie' },
    { tmdbId: 65759,  title: 'Million Dollar Baby',      type: 'movie' },
  ],
  awakener: [
    { tmdbId: 603,    title: 'The Matrix',       type: 'movie' },
    { tmdbId: 27205,  title: 'Inception',        type: 'movie' },
    { tmdbId: 37165,  title: 'The Truman Show',  type: 'movie' },
    { tmdbId: 329865, title: 'Arrival',          type: 'movie' },
    { tmdbId: 11024,  title: 'Dark City',        type: 'movie' },
    { tmdbId: 9735,   title: 'They Live',        type: 'movie' },
    { tmdbId: 762,    title: 'Equilibrium',      type: 'movie' },
  ],
  protector: [
    { tmdbId: 284054, title: 'Black Panther',        type: 'movie' },
    { tmdbId: 98,     title: 'Gladiator',            type: 'movie' },
    { tmdbId: 8587,   title: 'The Lion King',        type: 'movie' },
    { tmdbId: 197,    title: 'Braveheart',           type: 'movie' },
    { tmdbId: 49521,  title: 'Kingdom of Heaven',    type: 'movie' },
    { tmdbId: 49521,  title: 'Man of Steel',         type: 'movie' },
  ],
  hero: [
    { tmdbId: 11,     title: 'Star Wars: A New Hope',         type: 'movie' },
    { tmdbId: 120,    title: 'The Lord of the Rings: Fellowship', type: 'movie' },
    { tmdbId: 693134, title: 'Dune: Part Two',               type: 'movie' },
    { tmdbId: 671,    title: "Harry Potter and the Philosopher's Stone", type: 'movie' },
    { tmdbId: 19995,  title: 'Avatar',                        type: 'movie' },
    { tmdbId: 157336, title: 'Interstellar',                  type: 'movie' },
  ],
  lonewolf: [
    { tmdbId: 206647, title: 'Spectre',                  type: 'movie' },
    { tmdbId: 245891, title: 'John Wick',                type: 'movie' },
    { tmdbId: 80688,  title: 'Drive',                    type: 'movie' },
    { tmdbId: 101,    title: 'Leon: The Professional',   type: 'movie' },
    { tmdbId: 949,    title: 'Heat',                     type: 'movie' },
    { tmdbId: 7343,   title: 'Collateral',               type: 'movie' },
    { tmdbId: 6977,   title: 'No Country for Old Men',   type: 'movie' },
  ],
  shapeshifter: [
    { tmdbId: 10674,  title: 'Mulan',                   type: 'movie' },
    { tmdbId: 233,    title: 'Hidden Figures',           type: 'movie' },
    { tmdbId: 280,    title: 'The Devil Wears Prada',    type: 'movie' },
    { tmdbId: 321612, title: 'Moana',                   type: 'movie' },
    { tmdbId: 5765,   title: 'Legally Blonde',           type: 'movie' },
    { tmdbId: 12,     title: 'Ratatouille',              type: 'movie' },
    { tmdbId: 11472,  title: 'Billy Elliot',             type: 'movie' },
  ],
  dreamer: [
    { tmdbId: 118,    title: 'Charlie and the Chocolate Factory', type: 'movie' },
    { tmdbId: 64686,  title: 'Hugo',                    type: 'movie' },
    { tmdbId: 194,    title: 'Amélie',                  type: 'movie' },
    { tmdbId: 4544,   title: 'Big Fish',                type: 'movie' },
    { tmdbId: 5765,   title: 'Edward Scissorhands',     type: 'movie' },
    { tmdbId: 120467, title: 'The Grand Budapest Hotel', type: 'movie' },
    { tmdbId: 77338,  title: 'Life of Pi',              type: 'movie' },
  ],
}

// Returns ISO week number — same for all users that week
function getWeekSeed(): number {
  const now   = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  return Math.floor((now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000))
}

const ARCHETYPE_ORDER: ArchetypeId[] = [
  'fighter', 'awakener', 'protector', 'hero', 'lonewolf', 'shapeshifter', 'dreamer',
]

// Returns the active film for each archetype this week — deterministic for all users
export function getWeeklyFilms(): Record<ArchetypeId, ArchetypeFilm> {
  const seed = getWeekSeed()
  const result = {} as Record<ArchetypeId, ArchetypeFilm>
  ARCHETYPE_ORDER.forEach((id, archetypeIdx) => {
    const pool = FILM_POOLS[id]
    result[id] = pool[(seed + archetypeIdx) % pool.length]
  })
  return result
}

// The 7 survey films in order — one per archetype, rotated weekly
export function getSurveyFilms(): (ArchetypeFilm & { archetypeId: ArchetypeId })[] {
  const weekly = getWeeklyFilms()
  return ARCHETYPE_ORDER.map(id => ({ ...weekly[id], archetypeId: id }))
}

// ─── Archetype Definitions ─────────────────────────────────────────────────────

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  fighter: {
    id: 'fighter',
    name: 'The Fighter',
    tagline: 'Every setback is a setup.',
    coreFear:   "If I stop pushing, everything I've built collapses.",
    coreDesire: 'To prove that effort and will can overcome anything.',
    somaticPattern: 'Jaw tension, clenched fists, adrenal overdrive.',
    physicalPatterns: ['adrenal fatigue', 'jaw clenching', 'shoulder tension', 'sleep disruption'],
    emotionalPatterns: ['perfectionism', 'overachievement', 'difficulty resting', 'proving worth'],
    storyPreferences: ['resilience', 'underdog victories', 'earned redemption', 'discipline'],
    brandAlignment: ['Nike', 'Under Armour', 'Peloton', 'Red Bull'],
    integratedPath: 'The Champion',
    integratedPathDesc: 'You fight not to prove yourself, but to lift others.',
    gift: 'Relentless resilience that inspires everyone around you.',
    invitation: 'Rest is not surrender. Your willingness to pause is itself a form of courage.',
    movieGenres: [28, 18, 10752, 80],
    tvGenres:    [10759, 18],
    journeys: [
      { label: 'From Broken → Rebuilt',    fromTo: 'broken-rebuilt',    genres: [18, 28] },
      { label: 'From Doubt → Conviction',  fromTo: 'doubt-conviction',  genres: [18, 10752] },
      { label: 'From Alone → Backed',      fromTo: 'alone-backed',      genres: [28, 18] },
    ],
    films: FILM_POOLS.fighter,
  },

  awakener: {
    id: 'awakener',
    name: 'The Awakener',
    tagline: 'The question is the answer.',
    coreFear:   'Being trapped inside a reality that was never real to begin with.',
    coreDesire: 'To see through illusion and operate at the level of what is actually true.',
    somaticPattern: 'Chronic mental overstimulation, racing thoughts, sensory sensitivity.',
    physicalPatterns: ['insomnia', 'sensory overload', 'headaches', 'nervous system dysregulation'],
    emotionalPatterns: ['analysis paralysis', 'existential anxiety', 'pattern obsession', 'distrust of consensus'],
    storyPreferences: ['truth-seeking', 'system disruption', 'hidden knowledge', 'transformation'],
    brandAlignment: ['Apple', 'Tesla', 'Notion', 'Headspace'],
    integratedPath: 'The Oracle',
    integratedPathDesc: 'You see what others miss — and you learn to share it without overwhelming them.',
    gift: 'The ability to perceive patterns and possibilities invisible to most.',
    invitation: "Not every truth needs to be spoken immediately. Timing is wisdom too.",
    movieGenres: [878, 9648, 14, 53],
    tvGenres:    [10765, 9648],
    journeys: [
      { label: 'From Asleep → Awake',      fromTo: 'asleep-awake',      genres: [878, 53] },
      { label: 'From System → Freedom',    fromTo: 'system-freedom',    genres: [878, 28] },
      { label: 'From Confusion → Clarity', fromTo: 'confusion-clarity', genres: [9648, 18] },
    ],
    films: FILM_POOLS.awakener,
  },

  protector: {
    id: 'protector',
    name: 'The Protector',
    tagline: 'The weight is mine to carry.',
    coreFear:   'If I let go, everything falls apart.',
    coreDesire: 'Stable ground, trusted leadership, and the security to protect what matters.',
    somaticPattern: 'Muscular tension, digestive constriction, nervous system rigidity.',
    physicalPatterns: ['muscular tension', 'jaw clenching', 'digestive issues', 'chronic vigilance'],
    emotionalPatterns: ['hypervigilance', 'difficulty delegating', 'suppressing own needs', 'loyalty above self'],
    storyPreferences: ['protection', 'duty', 'leadership', 'redemption', 'legacy'],
    brandAlignment: ['Nike', 'Patagonia', 'Rolex', 'Headspace'],
    integratedPath: 'The Guardian',
    integratedPathDesc: 'You protect without losing yourself in the protection.',
    gift: 'Steadiness that others anchor to when everything is uncertain.',
    invitation: 'Receiving care is not weakness. It is how you sustain your capacity to give it.',
    movieGenres: [28, 18, 10752, 12],
    tvGenres:    [10759, 18, 80],
    journeys: [
      { label: 'From Chaos → Control',  fromTo: 'chaos-control',  genres: [28, 53, 80] },
      { label: 'From Duty → Freedom',   fromTo: 'duty-freedom',   genres: [18, 10752]  },
      { label: 'From Fear → Trust',     fromTo: 'fear-trust',     genres: [18, 10749]  },
    ],
    films: FILM_POOLS.protector,
  },

  hero: {
    id: 'hero',
    name: 'The Hero',
    tagline: 'The call was always meant for you.',
    coreFear:   'Missing the moment I was meant for — living a small life by accident.',
    coreDesire: 'To rise to something larger than the ordinary and prove the journey worthwhile.',
    somaticPattern: 'Restless energy, hunger for movement, difficulty with stillness.',
    physicalPatterns: ['restlessness', 'sleep disruption', 'high energy states', 'adrenaline seeking'],
    emotionalPatterns: ['quest mentality', 'difficulty with ordinary life', 'imposter syndrome at the threshold', 'urgency'],
    storyPreferences: ['destiny', 'adventure', 'sacrifice', 'transformation', 'light vs dark'],
    brandAlignment: ['Red Bull', 'GoPro', 'Nike', 'National Geographic'],
    integratedPath: 'The Waymaker',
    integratedPathDesc: 'You make the path so others know the way is possible.',
    gift: 'Courage that makes the impossible feel inevitable for everyone watching.',
    invitation: 'The ordinary life is not the enemy of the heroic one. It is where the hero recovers.',
    movieGenres: [12, 28, 14, 878],
    tvGenres:    [10759, 10765],
    journeys: [
      { label: 'From Ordinary → Called',    fromTo: 'ordinary-called',    genres: [12, 14] },
      { label: 'From Safe → Brave',         fromTo: 'safe-brave',         genres: [28, 12] },
      { label: 'From Lost → Legendary',     fromTo: 'lost-legendary',     genres: [14, 18] },
    ],
    films: FILM_POOLS.hero,
  },

  lonewolf: {
    id: 'lonewolf',
    name: 'The Lone Wolf',
    tagline: 'Alone by design.',
    coreFear:   'Dependence — on anyone, for anything.',
    coreDesire: 'Total self-sufficiency, mastery, and the freedom that comes from needing nothing.',
    somaticPattern: 'Controlled breathing, deliberate movement, emotional compartmentalization.',
    physicalPatterns: ['chronic independence', 'difficulty with touch', 'hypercontrol of environment', 'insomnia'],
    emotionalPatterns: ['emotional detachment', 'allergy to vulnerability', 'hyper-competence', 'isolation as safety'],
    storyPreferences: ['mastery', 'independence', 'moral complexity', 'cool under pressure', 'the code'],
    brandAlignment: ['Porsche', 'Tom Ford', 'Leica', 'Aesop'],
    integratedPath: 'The Sovereign',
    integratedPathDesc: 'You choose solitude as strength, not as protection from pain.',
    gift: 'Self-sufficiency that creates space for others without requiring anything of them.',
    invitation: 'Connection does not compromise your autonomy. It completes it.',
    movieGenres: [80, 53, 28, 18],
    tvGenres:    [80, 18],
    journeys: [
      { label: 'From Isolated → Present',   fromTo: 'isolated-present',  genres: [18, 80] },
      { label: 'From Control → Surrender',  fromTo: 'control-surrender', genres: [53, 18] },
      { label: 'From Code → Connection',    fromTo: 'code-connection',   genres: [80, 10749] },
    ],
    films: FILM_POOLS.lonewolf,
  },

  shapeshifter: {
    id: 'shapeshifter',
    name: 'The Shapeshifter',
    tagline: 'I become what the room needs.',
    coreFear:   'If people see the real me, I will be abandoned.',
    coreDesire: 'Authentic connection and empowered influence without having to perform for either.',
    somaticPattern: 'Identity shifting, fawning, emotional merging with others.',
    physicalPatterns: ['IBS patterns', 'skin flare-ups', 'anxiety', 'dissociation', 'nervous system instability'],
    emotionalPatterns: ['people-pleasing', 'identity confusion', 'masking', 'fear of abandonment'],
    storyPreferences: ['identity', 'reinvention', 'transformation', 'social dynamics', 'authenticity'],
    brandAlignment: ['fashion', 'culture', 'innovation', 'creative industries'],
    integratedPath: 'The Catalyst',
    integratedPathDesc: 'Adaptation becomes a conscious choice rather than a survival reflex.',
    gift: 'Extraordinary attunement to people and environments — belonging without disappearing.',
    invitation: 'You were always enough before the performance began.',
    movieGenres: [18, 35, 10749, 14],
    tvGenres:    [18, 35],
    journeys: [
      { label: 'From Performing → Present', fromTo: 'performing-present', genres: [18, 35] },
      { label: 'From Invisible → Seen',     fromTo: 'invisible-seen',     genres: [18, 10749] },
      { label: 'From Adapting → Arriving',  fromTo: 'adapting-arriving',  genres: [14, 18] },
    ],
    films: FILM_POOLS.shapeshifter,
  },

  dreamer: {
    id: 'dreamer',
    name: 'The Dreamer',
    tagline: 'Reality is just an option.',
    coreFear:   'Being forced into a life so ordinary the spark dies.',
    coreDesire: 'To live inside a world alive with wonder, beauty, and the possible.',
    somaticPattern: 'Expansive openness, sensory richness, difficulty with harsh realities.',
    physicalPatterns: ['overstimulation sensitivity', 'escapism patterns', 'sleep richness', 'chronic hope'],
    emotionalPatterns: ['idealism', 'disappointment cycles', 'difficulty with pragmatics', 'world-building'],
    storyPreferences: ['wonder', 'creativity', 'magic', 'unlikely belonging', 'play'],
    brandAlignment: ['Pixar', 'LEGO', 'Dyson', 'Patagonia'],
    integratedPath: 'The Visionary',
    integratedPathDesc: 'You bring the dream into the world without losing it in translation.',
    gift: 'The ability to hold beauty, wonder, and possibility alive in a world that has forgotten them.',
    invitation: 'The world needs your dreams made real, not just imagined.',
    movieGenres: [16, 14, 12, 35],
    tvGenres:    [16, 10751, 14],
    journeys: [
      { label: 'From Fantasy → Real',      fromTo: 'fantasy-real',      genres: [14, 18] },
      { label: 'From Small → Vast',        fromTo: 'small-vast',        genres: [12, 14] },
      { label: 'From Forgotten → Found',   fromTo: 'forgotten-found',   genres: [16, 35] },
    ],
    films: FILM_POOLS.dreamer,
  },
}

// ─── Scoring ───────────────────────────────────────────────────────────────────
// Survey answers: mood, aspiration, lifeStory, avoid — each is an ArchetypeId.
// Returns the dominant archetype with secondary scores.

export interface ResonanceScore {
  primary:   ArchetypeId
  secondary: ArchetypeId
  scores:    Record<ArchetypeId, number>
}

export function scoreResonance(answers: {
  mood:       ArchetypeId
  aspiration: ArchetypeId
  lifeStory:  ArchetypeId
  avoid:      ArchetypeId
}): ResonanceScore {
  const weights: Record<string, number> = {
    mood:       3,   // strongest signal — how you feel right now
    aspiration: 2.5, // who you want to become
    lifeStory:  2,   // where you've been
    avoid:      1.5, // shadow — what repels reveals what you're integrating
  }

  const scores = {} as Record<ArchetypeId, number>
  ARCHETYPE_ORDER.forEach(id => { scores[id] = 0 })

  // Direct picks
  scores[answers.mood]       += weights.mood
  scores[answers.aspiration] += weights.aspiration
  scores[answers.lifeStory]  += weights.lifeStory

  // Avoid is the shadow — adds partial weight to its opposing archetype
  // If you avoid Fighter, you may secretly need its energy
  scores[answers.avoid]      += weights.avoid * 0.5

  // Conflict signal: same film for aspiration AND avoid → shapeshifter tension
  if (answers.aspiration === answers.avoid) {
    scores['shapeshifter'] += 1.5
  }

  const sorted = (Object.entries(scores) as [ArchetypeId, number][])
    .sort((a, b) => b[1] - a[1])

  return {
    primary:   sorted[0][0],
    secondary: sorted[1][0],
    scores,
  }
}
