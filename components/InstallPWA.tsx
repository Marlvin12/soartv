'use client'

import { useEffect, useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt(): Promise<void>
}

type Variant = 'pill' | 'icon'

interface Props {
  variant?: Variant
}

export default function InstallPWA({ variant = 'pill' }: Props) {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed,    setInstalled]    = useState(false)
  const [isIOS,        setIsIOS]        = useState(false)
  const [showIOSHelp,  setShowIOSHelp]  = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Already running as installed app → hide button
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true
    if (standalone) { setInstalled(true); return }

    // iOS Safari does not fire `beforeinstallprompt` — show a help sheet instead
    const ua = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua)
    setIsIOS(ios)

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setInstallEvent(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstallEvent(null)
      setInstalled(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const handleClick = async () => {
    if (installEvent) {
      await installEvent.prompt()
      const choice = await installEvent.userChoice
      if (choice.outcome === 'accepted') setInstalled(true)
      setInstallEvent(null)
    } else if (isIOS) {
      setShowIOSHelp(true)
    }
  }

  // Hide entirely once installed, or when neither Android-style prompt nor iOS is detected
  if (installed) return null
  if (!installEvent && !isIOS) return null

  return (
    <>
      {variant === 'pill' ? (
        <button
          onClick={handleClick}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 999,
            background: 'linear-gradient(135deg,rgba(180,167,255,0.2),rgba(180,167,255,0.08))',
            border: '1px solid rgba(180,167,255,0.35)',
            color: '#b4a7ff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(180,167,255,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg,rgba(180,167,255,0.2),rgba(180,167,255,0.08))' }}
        >
          <DownloadIcon /> Install App
        </button>
      ) : (
        <button
          onClick={handleClick}
          aria-label="Install SoarTV app"
          className="icon-btn"
          title="Install app"
        >
          <DownloadIcon />
        </button>
      )}

      {showIOSHelp && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div
            onClick={() => setShowIOSHelp(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          />
          <div style={{
            position: 'relative', width: '100%', maxWidth: 440, margin: 16,
            padding: 24, borderRadius: 20,
            background: 'rgba(11,12,20,0.97)', border: '1px solid var(--line)',
            animation: 'sheet-in 0.25s cubic-bezier(.2,.7,.2,1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontSize: 17, fontWeight: 600, color: '#fff', margin: 0 }}>Install SoarTV</p>
              <button
                onClick={() => setShowIOSHelp(false)}
                style={{ fontSize: 13, color: 'var(--muted)' }}
              >Close</button>
            </div>
            <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Step n={1} text={<>Tap the <strong style={{ color: '#fff' }}>Share</strong> button in Safari&apos;s bottom bar.</>} />
              <Step n={2} text={<>Scroll down and tap <strong style={{ color: '#fff' }}>Add to Home Screen</strong>.</>} />
              <Step n={3} text={<>Tap <strong style={{ color: '#fff' }}>Add</strong>. SoarTV will appear like any other app.</>} />
            </ol>
          </div>
          <style>{`@keyframes sheet-in { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
      )}
    </>
  )
}

function Step({ n, text }: { n: number; text: React.ReactNode }) {
  return (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: 'rgba(180,167,255,0.2)', border: '1px solid rgba(180,167,255,0.3)', color: '#b4a7ff', fontSize: 12, fontWeight: 700, display: 'grid', placeItems: 'center' }}>
        {n}
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.5, margin: 0 }}>{text}</p>
    </li>
  )
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1v8" />
      <path d="M3.5 6L7 9.5 10.5 6" />
      <path d="M1.5 11h11" />
    </svg>
  )
}
