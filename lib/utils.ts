const FALLBACK_PALETTES: [string, string][] = [
  ['#c9a24b', '#241d0b'],
  ['#dc2626', '#7f1d1d'],
  ['#0e7490', '#0b1f2a'],
  ['#92400e', '#422006'],
  ['#5a3a14', '#241d0b'],
  ['#065f46', '#04140e'],
  ['#1e40af', '#0f172a'],
  ['#b45309', '#1a1208'],
]

export function titleGradient(title: string): string {
  const [c1, c2] = FALLBACK_PALETTES[(title || '').charCodeAt(0) % FALLBACK_PALETTES.length]
  return `linear-gradient(135deg,${c1},${c2})`
}

export function idToProgress(id: string): number {
  let h = 5381
  for (let i = 0; i < id.length; i++) h = (h * 33 + id.charCodeAt(i)) & 0xffff
  return (Math.abs(h) % 74) + 10
}
