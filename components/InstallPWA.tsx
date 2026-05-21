'use client'

import { useEffect, useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt(): Promise<void>
}

type Variant = 'pill' | 'icon'
type Platform = 'ios-safari' | 'ios-other' | 'android-chrome' | 'desktop-chrome' | 'desktop-other' | 'unknown'

interface Props {
  variant?: Variant
}

function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'unknown'
  const ua = window.navigator.userAgent.toLowerCase()

  // ALL iOS devices: Apple forces WebKit, so PWA install is Safari-only.
  // Detect iOS first regardless of browser brand.
  const isIOS = /iphone|ipad|ipod/.test(ua)
  if (isIOS) {
    // Chrome iOS = "crios", Firefox iOS = "fxios", Edge iOS = "edgios"
    const isOtherIOSBrowser = /crios|fxios|edgios|opios/.test(ua)
    return isOtherIOSBrowser ? 'ios-other' : 'ios-safari'
  }

  const android = /android/.test(ua)
  const chrome  = /chrome|chromium|edg/.test(ua) && !/firefox/.test(ua)
  if (android && chrome) return 'android-chrome'
  if (chrome) return 'desktop-chrome'
  return 'desktop-other'
}

export default function InstallPWA({ variant = 'pill' }: Props) {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed,    setInstalled]    = useState(false)
  const [platform,     setPlatform]     = useState<Platform>('unknown')
  const [showHelp,     setShowHelp]     = useState(false)
  const [mounted,      setMounted]      = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return

    // Already running as installed app → hide button
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true
    if (standalone) { setInstalled(true); return }

    setPlatform(detectPlatform())

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
    // Path 1: Chrome captured an install event — fire native prompt
    if (installEvent) {
      await installEvent.prompt()
      const choice = await installEvent.userChoice
      if (choice.outcome === 'accepted') setInstalled(true)
      setInstallEvent(null)
      return
    }
    // Path 2: Show platform-specific instructions
    setShowHelp(true)
  }

  // Don't render before hydration or if already installed
  if (!mounted || installed) return null

  return (
    <>
      {variant === 'pill' ? (
        <button
          onClick={handleClick}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 999,
            background: 'linear-gradient(135deg,rgba(232,200,122,0.2),rgba(232,200,122,0.08))',
            border: '1px solid rgba(232,200,122,0.35)',
            color: '#e8c87a', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,200,122,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg,rgba(232,200,122,0.2),rgba(232,200,122,0.08))' }}
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

      {showHelp && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div
            onClick={() => setShowHelp(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          />
          <div style={{
            position: 'relative', width: '100%', maxWidth: 440,
            padding: 28, borderRadius: 24,
            background: 'rgba(11,12,20,0.97)', border: '1px solid rgba(255,255,255,0.12)',
            animation: 'sheet-in 0.28s cubic-bezier(.2,.7,.2,1)',
            backdropFilter: 'blur(40px)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>Install SoarTV</p>
              <button
                onClick={() => setShowHelp(false)}
                style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--muted)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/></svg>
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 22px' }}>
              {platform === 'ios-safari'
                ? 'Install on your iPhone:'
                : platform === 'ios-other'
                  ? 'On iPhone, PWA install is Safari-only:'
                  : platform === 'android-chrome'
                    ? 'Install on your Android device:'
                    : platform === 'desktop-chrome'
                      ? 'Install on your computer:'
                      : 'PWA install instructions for your browser:'
              }
            </p>
            <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {platform === 'ios-safari' && (
                <>
                  <Step n={1} text={<>Tap the <strong style={{ color: '#fff' }}>Share</strong> icon at the bottom of Safari (a square with an arrow pointing up).</>} />
                  <Step n={2} text={<>Scroll down and tap <strong style={{ color: '#fff' }}>Add to Home Screen</strong>.</>} />
                  <Step n={3} text={<>Tap <strong style={{ color: '#fff' }}>Add</strong> in the top right.</>} />
                </>
              )}
              {platform === 'ios-other' && (
                <>
                  <Step n={1} text={<><strong style={{ color: '#fff' }}>Apple restricts</strong> PWA install to Safari only — Chrome/Firefox on iPhone can&apos;t install web apps.</>} />
                  <Step n={2} text={<>Long-press the URL bar above, copy the link, then paste it into <strong style={{ color: '#fff' }}>Safari</strong>.</>} />
                  <Step n={3} text={<>In Safari, tap <strong style={{ color: '#fff' }}>Share → Add to Home Screen → Add</strong>.</>} />
                </>
              )}
              {platform === 'android-chrome' && (
                <>
                  <Step n={1} text={<>Tap the <strong style={{ color: '#fff' }}>⋮ menu</strong> in the top-right of Chrome.</>} />
                  <Step n={2} text={<>Tap <strong style={{ color: '#fff' }}>Install app</strong> (or &ldquo;Add to Home screen&rdquo;).</>} />
                  <Step n={3} text={<>Confirm <strong style={{ color: '#fff' }}>Install</strong>.</>} />
                </>
              )}
              {platform === 'desktop-chrome' && (
                <>
                  <Step n={1} text={<>Look at the address bar — there&apos;s an <strong style={{ color: '#fff' }}>install icon</strong> on the right (a computer with a down arrow).</>} />
                  <Step n={2} text={<>Click it and confirm <strong style={{ color: '#fff' }}>Install</strong>.</>} />
                  <Step n={3} text={<>SoarTV opens in its own window like a native app.</>} />
                </>
              )}
              {platform === 'desktop-other' && (
                <>
                  <Step n={1} text={<><strong style={{ color: '#fff' }}>Firefox / other browsers</strong> don&apos;t support direct install of web apps.</>} />
                  <Step n={2} text={<>For the best install experience, open this site in <strong style={{ color: '#fff' }}>Chrome, Edge, or Safari</strong>.</>} />
                  <Step n={3} text={<>Bookmark this page for quick access if you prefer to keep using your current browser.</>} />
                </>
              )}
            </ol>
          </div>
          <style>{`@keyframes sheet-in { from { opacity: 0; transform: translateY(24px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
        </div>
      )}
    </>
  )
}

function Step({ n, text }: { n: number; text: React.ReactNode }) {
  return (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: 'rgba(232,200,122,0.2)', border: '1px solid rgba(232,200,122,0.3)', color: '#e8c87a', fontSize: 12, fontWeight: 700, display: 'grid', placeItems: 'center' }}>
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
