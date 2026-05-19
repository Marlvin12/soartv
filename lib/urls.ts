export function toSlug(title = '') {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function toWatchPath(type: 'movie' | 'show', id: number | string, title: string) {
  const slug = toSlug(title)
  return `/watch/${slug ? `${slug}-` : ''}${id}?type=${type}`
}

export function getIdFromSlug(slug = ''): number | null {
  if (!slug) return null
  if (/^\d+$/.test(slug)) return Number(slug)
  const m = slug.match(/-(\d+)$/) ?? slug.match(/^(\d+)-/)
  return m ? Number(m[1]) : null
}
