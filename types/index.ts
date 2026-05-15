export interface Answers {
  firstPick: string
  mood: string
  intensity: string
}

export interface MediaItem {
  id: string
  title: string
  sub: string
  desc: string
  year: string
  genre: string
  rating: string | null
  imageUrl: string | null
  backdropUrl: string | null
  type: 'movie' | 'show'
  rated: string
}

export interface CatalogMovie {
  id: string
  title: string
  sub: string
  kind: string
  palette: [string, string, string]
  moods: string[]
  year: number
  rated: string
  runtime: string
  genre: string
  desc?: string
}

export interface MoodOption {
  id: string
  name: string
  desc: string
  g: string
}

export interface MoodCopy {
  label: string
  hint: string
}
