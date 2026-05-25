// ─────────────────────────────────────────────────────────────────────────────
// TMDB watch-providers + per-provider launch URLs
//
// SoarTV no longer hosts playback. /watch/[slug] asks TMDB which services
// carry a title in the user's region, renders them as tiles, and on tap
// opens a liquid-glass "Sign in to [Provider]" modal whose CTA deep-links
// out. TMDB doesn't expose per-title links, so `launch(title)` returns each
// provider's search URL — hard-map specific titles here to upgrade.
// ─────────────────────────────────────────────────────────────────────────────

export interface ProviderEntry {
  provider_id:       number
  provider_name:     string
  logo_path:         string
  display_priority?: number
}

export interface ProvidersResponse {
  flatrate?: ProviderEntry[]
  free?:     ProviderEntry[]
  ads?:      ProviderEntry[]
  buy?:      ProviderEntry[]
  rent?:     ProviderEntry[]
  link?:     string
}

const TMDB_LOGO_BASE = 'https://image.tmdb.org/t/p/original'

export function providerLogoUrl(p: ProviderEntry): string {
  return `${TMDB_LOGO_BASE}${p.logo_path}`
}

export async function fetchWatchProviders(
  type: 'movie' | 'show',
  id:   string | number,
  region = 'US',
): Promise<ProvidersResponse | null> {
  const tmdbType = type === 'show' ? 'tv' : 'movie'
  try {
    const res = await fetch(`/api/tmdb?path=${encodeURIComponent(`/${tmdbType}/${id}/watch/providers`)}`)
    if (!res.ok) return null
    const data = await res.json()
    return data?.results?.[region] ?? data?.results?.US ?? null
  } catch {
    return null
  }
}

export function pickPrimaryProviders(p: ProvidersResponse | null): ProviderEntry[] {
  if (!p) return []
  const order = [p.flatrate, p.free, p.ads, p.rent, p.buy]
  const seen  = new Set<number>()
  const out: ProviderEntry[] = []
  for (const bucket of order) {
    if (!bucket) continue
    for (const e of bucket) {
      if (seen.has(e.provider_id)) continue
      seen.add(e.provider_id)
      out.push(e)
    }
  }
  return out.sort((a, b) => (a.display_priority ?? 99) - (b.display_priority ?? 99))
}

export interface ProviderBrand {
  match:    string[]
  label:    string
  fg:       string
  gradient: string
  launch:   (title: string) => string
}

const enc = encodeURIComponent

export const PROVIDER_BRANDS: ProviderBrand[] = [
  { match: ['Hulu'], label: 'Hulu', fg: '#1ce783',
    gradient: 'linear-gradient(135deg,#0b1f17 0%,#06342a 60%,#1ce783 130%)',
    launch: t => `https://www.hulu.com/search?q=${enc(t)}` },
  { match: ['Netflix', 'Netflix basic with Ads'], label: 'Netflix', fg: '#e50914',
    gradient: 'linear-gradient(135deg,#1a0608 0%,#4a0a10 60%,#e50914 130%)',
    launch: t => `https://www.netflix.com/search?q=${enc(t)}` },
  { match: ['Disney Plus', 'Disney+'], label: 'Disney+', fg: '#1da1f2',
    gradient: 'linear-gradient(135deg,#061029 0%,#0a1f4d 60%,#1da1f2 140%)',
    launch: t => `https://www.disneyplus.com/search?q=${enc(t)}` },
  { match: ['Max', 'HBO Max'], label: 'Max', fg: '#5a31f4',
    gradient: 'linear-gradient(135deg,#0a0420 0%,#1a0d54 60%,#5a31f4 140%)',
    launch: t => `https://play.max.com/search/result?q=${enc(t)}` },
  { match: ['Apple TV Plus', 'Apple TV+'], label: 'Apple TV+', fg: '#ffffff',
    gradient: 'linear-gradient(135deg,#0a0a0e 0%,#1f1f24 60%,#6d6d76 140%)',
    launch: t => `https://tv.apple.com/search?term=${enc(t)}` },
  { match: ['Amazon Prime Video', 'Amazon Prime Video with Ads'], label: 'Prime Video', fg: '#00a8e1',
    gradient: 'linear-gradient(135deg,#00111f 0%,#00345a 60%,#00a8e1 140%)',
    launch: t => `https://www.amazon.com/s?k=${enc(t)}&i=instant-video` },
  { match: ['Paramount Plus', 'Paramount+', 'Paramount+ with Showtime'], label: 'Paramount+', fg: '#0064ff',
    gradient: 'linear-gradient(135deg,#001029 0%,#002a73 60%,#0064ff 140%)',
    launch: t => `https://www.paramountplus.com/search/?query=${enc(t)}` },
  { match: ['Peacock', 'Peacock Premium', 'Peacock Premium Plus'], label: 'Peacock', fg: '#fed800',
    gradient: 'linear-gradient(135deg,#1a0e00 0%,#3d2f00 60%,#fed800 150%)',
    launch: t => `https://www.peacocktv.com/search?q=${enc(t)}` },
  { match: ['YouTube', 'YouTube Premium'], label: 'YouTube', fg: '#ff0000',
    gradient: 'linear-gradient(135deg,#1a0000 0%,#4a0000 60%,#ff0000 140%)',
    launch: t => `https://www.youtube.com/results?search_query=${enc(t + ' full movie')}` },
  { match: ['Tubi TV', 'Tubi'], label: 'Tubi', fg: '#fa382f',
    gradient: 'linear-gradient(135deg,#190606 0%,#480e0a 60%,#fa382f 140%)',
    launch: t => `https://tubitv.com/search/${enc(t)}` },
  { match: ['Pluto TV'], label: 'Pluto TV', fg: '#ffe600',
    gradient: 'linear-gradient(135deg,#07071a 0%,#14143e 60%,#ffe600 150%)',
    launch: t => `https://pluto.tv/en/search?q=${enc(t)}` },
  { match: ['Crunchyroll'], label: 'Crunchyroll', fg: '#f47521',
    gradient: 'linear-gradient(135deg,#1c0e00 0%,#45260a 60%,#f47521 140%)',
    launch: t => `https://www.crunchyroll.com/search?q=${enc(t)}` },
  { match: ['fuboTV', 'Fubo TV'], label: 'Fubo', fg: '#f6312b',
    gradient: 'linear-gradient(135deg,#1f0606 0%,#4e0c0a 60%,#f6312b 140%)',
    launch: t => `https://www.fubo.tv/search/${enc(t)}` },
  { match: ['Starz', 'Starz Play Amazon Channel'], label: 'Starz', fg: '#000000',
    gradient: 'linear-gradient(135deg,#0e0e10 0%,#1f1f22 60%,#555 130%)',
    launch: t => `https://www.starz.com/us/en/search/${enc(t)}` },
  { match: ['Showtime'], label: 'Showtime', fg: '#dc3327',
    gradient: 'linear-gradient(135deg,#1f0606 0%,#4e0c0a 60%,#dc3327 140%)',
    launch: t => `https://www.showtime.com/search?q=${enc(t)}` },
]

export function brandForProvider(name: string, tmdbLink?: string): ProviderBrand {
  for (const b of PROVIDER_BRANDS) {
    if (b.match.includes(name)) return b
  }
  return {
    match:    [name],
    label:    name,
    fg:       '#e8c87a',
    gradient: 'linear-gradient(135deg,#18181c 0%,#2a2a30 60%,#4a4a52 140%)',
    launch:   t => tmdbLink ?? `https://www.google.com/search?q=${enc(`${name} watch ${t}`)}`,
  }
}
