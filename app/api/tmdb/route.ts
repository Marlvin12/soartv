import { NextRequest, NextResponse } from 'next/server'

const KEY  = process.env.TMDB_API_KEY!
const BASE = 'https://api.themoviedb.org/3'

export async function GET(request: NextRequest) {
  const sp   = request.nextUrl.searchParams
  const path = sp.get('path') ?? '/trending/movie/week'

  const extra: string[] = []
  sp.forEach((v, k) => {
    if (k !== 'path') extra.push(`${k}=${encodeURIComponent(v)}`)
  })

  const url = `${BASE}${path}?api_key=${KEY}&language=en-US${extra.length ? '&' + extra.join('&') : ''}`

  try {
    const res  = await fetch(url, { next: { revalidate: 3600 } })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}
