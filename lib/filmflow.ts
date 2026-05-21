// ─────────────────────────────────────────────────────────────────────────────
// FilmFlow7 — Conversational Resonance Entry
// A multi-turn guided experience: the user describes how they're arriving,
// a keyword engine detects their resonance signature, and the system mirrors
// it back with a first reflection, a follow-up question, and a second
// reflection before handing off to the poster survey.
// ─────────────────────────────────────────────────────────────────────────────

import type { ArchetypeId } from '@/lib/archetypes'
import { ARCHETYPE_ORDER } from '@/lib/archetypes'

// The opening prompt the experience leads with.
export const ENTRY_QUESTION = 'How are you arriving tonight?'

// ─── Keyword signatures ────────────────────────────────────────────────────────
// Each archetype carries words that tend to surface when someone is living in
// its frequency. Detection counts how many land in the user's free text.

export const ARCHETYPE_KEYWORDS: Record<ArchetypeId, string[]> = {
  hiddenOne:    ['tired', 'numb', 'alone', 'withdrawn', 'invisible', 'quiet', 'empty', 'exhausted'],
  performer:    ['pressure', 'successful', 'perfect', 'productive', 'prove', 'achievement', 'anxious'],
  seeker:       ['lost', 'searching', 'confused', 'meaning', 'direction', 'restless', 'wandering'],
  giver:        ['drained', 'everyone', 'helping', 'responsible', 'overwhelmed', 'needed'],
  protector:    ['guarded', 'safe', 'control', 'prepared', 'watchful', 'defensive'],
  shapeshifter: ['fit in', 'accepted', 'adapt', 'mask', 'different', 'belong'],
  warrior:      ['fight', 'driven', 'strong', 'push', 'focused', 'intense', 'angry'],
  dreamer:      ['escape', 'dreaming', 'fantasy', 'avoid', 'float', 'disconnected'],
}

// ─── First reflections ─────────────────────────────────────────────────────────
// Mirrored back immediately after detection.

export const FIRST_REFLECTIONS: Record<ArchetypeId, string[]> = {
  hiddenOne:    ["It feels like part of you has been carrying more than you've expressed."],
  performer:    ['There’s a pressure to keep moving, even when your system wants rest.'],
  seeker:       ["Your energy feels like it's searching for something it can't fully name yet."],
  giver:        ['You may have spent so much energy holding others that you haven’t fully checked in with yourself.'],
  protector:    ['Part of your system still feels alert, even if the moment is safe.'],
  shapeshifter: ["It feels like you've been adapting to everyone else's energy for a while."],
  warrior:      ['Your energy still feels mobilized, like something inside refuses to fully stand down.'],
  dreamer:      ['Part of you may want distance from reality more than stimulation tonight.'],
}

// ─── Follow-up questions ───────────────────────────────────────────────────────
// One reflective question per archetype. The answer deepens the experience —
// it is not scored.

export const FOLLOW_UP_QUESTIONS: Record<ArchetypeId, string> = {
  hiddenOne:    'Do you feel more emotionally exhausted or emotionally disconnected tonight?',
  performer:    'Does the pressure feel more internal or external right now?',
  seeker:       'Are you searching more for clarity or relief tonight?',
  giver:        'Do you feel more emotionally drained or emotionally unseen?',
  protector:    'Does your system feel more guarded or overwhelmed right now?',
  shapeshifter: 'Do you feel more pressure to belong or pressure to perform?',
  warrior:      'Does your intensity feel more focused or emotionally heavy tonight?',
  dreamer:      'Do you feel more disconnected from yourself or from the world around you?',
}

// ─── Second reflections ────────────────────────────────────────────────────────
// Closes the conversation before the transition into the survey.

export const SECOND_REFLECTIONS: Record<ArchetypeId, string[]> = {
  hiddenOne:    ['Your system may be asking for softness more than isolation tonight.'],
  performer:    ['You may not need to earn rest as much as your system believes.'],
  seeker:       ['Sometimes clarity comes when the nervous system stops chasing answers.'],
  giver:        ['Part of healing may involve allowing yourself to exist beyond responsibility.'],
  protector:    ['Your system may be craving safety that doesn’t require constant vigilance.'],
  shapeshifter: ['There may be a deeper desire to feel accepted without adaptation.'],
  warrior:      ['Strength and exhaustion often coexist longer than people realize.'],
  dreamer:      ['Part of you may be searching for a reality that feels emotionally safer to stay present in.'],
}

// ─── Detection ─────────────────────────────────────────────────────────────────

export interface DetectionResult {
  archetype: ArchetypeId
  scores:    Record<ArchetypeId, number>
  matched:   boolean   // false when no keyword landed and we fell back
}

// Counts keyword hits in the user's free text. Highest count wins; ties resolve
// by ARCHETYPE_ORDER. Falls back to 'seeker' when nothing matches — the Seeker
// is, fittingly, the archetype of not-yet-knowing.
export function detectArchetype(userInput: string): DetectionResult {
  const text = ` ${userInput.toLowerCase().replace(/\s+/g, ' ')} `

  const scores = {} as Record<ArchetypeId, number>
  ARCHETYPE_ORDER.forEach(id => { scores[id] = 0 })

  for (const id of ARCHETYPE_ORDER) {
    for (const kw of ARCHETYPE_KEYWORDS[id]) {
      // word-boundary match so "alone" doesn't fire inside "malone"
      const re = new RegExp(`(?:^|[^a-z])${escapeRegex(kw)}(?:[^a-z]|$)`, 'i')
      if (re.test(text)) scores[id] += 1
    }
  }

  let best: ArchetypeId = ARCHETYPE_ORDER[0]
  for (const id of ARCHETYPE_ORDER) {
    if (scores[id] > scores[best]) best = id
  }

  const matched = scores[best] > 0
  return { archetype: matched ? best : 'seeker', scores, matched }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Picks one reflection from an archetype's set (sets currently hold one each,
// but the random.choice shape is preserved for future variation).
export function pickReflection(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)]
}
