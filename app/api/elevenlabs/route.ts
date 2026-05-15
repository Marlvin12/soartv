import { NextRequest, NextResponse } from 'next/server'

const VOICE_ID = '21m00Tcm4TlvDq8ikWAM' // Rachel — warm, clear

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get('text')
  if (!text) return NextResponse.json({ error: 'missing text' }, { status: 400 })

  const key = process.env.ELEVENLABS_API_KEY
  if (!key) return new NextResponse(null, { status: 204 }) // silent graceful fallback

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    })
    if (!res.ok) return new NextResponse(null, { status: 204 })
    const buffer = await res.arrayBuffer()
    return new NextResponse(buffer, { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' } })
  } catch {
    return new NextResponse(null, { status: 204 })
  }
}
