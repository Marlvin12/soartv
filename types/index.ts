import type { ArchetypeId } from '@/lib/archetypes'

export type { ArchetypeId }

export interface Answers {
  firstPick: string
  mood: string
  intensity: string
}

export interface SurveyAnswers {
  mood:       ArchetypeId
  aspiration: ArchetypeId
  lifeStory:  ArchetypeId
  avoid:      ArchetypeId
}

export interface ResonanceProfile {
  archetype:     ArchetypeId
  secondary:     ArchetypeId
  scores:        Record<ArchetypeId, number>
  surveyAnswers: SurveyAnswers
  updatedAt:     number
}

export type DailyState = 'onEdge' | 'inMyHead' | 'restless' | 'settling' | 'grounded'

export interface MediaItem {
  id:          string
  title:       string
  sub:         string
  desc:        string
  year:        string
  genre:       string
  rating:      string | null
  imageUrl:    string | null
  backdropUrl: string | null
  type:        'movie' | 'show'
  rated:       string
}

export interface CatalogMovie {
  id:      string
  title:   string
  sub:     string
  kind:    string
  palette: [string, string, string]
  moods:   string[]
  year:    number
  rated:   string
  runtime: string
  genre:   string
  desc?:   string
}

export interface MoodOption {
  id:   string
  name: string
  desc: string
  g:    string
}

export interface MoodCopy {
  label: string
  hint:  string
}

export interface WatchPartyComment {
  id:          string
  uid:         string
  displayName: string
  photoURL?:   string | null
  text:        string
  ts:          number
}

export interface OriginalProduct {
  id:       string
  name:     string
  imageUrl: string
  url:      string
  price?:   string
}
