import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px', textAlign: 'center', gap: 12,
    }}>
      <div style={{
        width: 96, height: 96, borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%,#fff,#e8c87a 35%,#5a4012 100%)',
        opacity: 0.5, marginBottom: 20,
        animation: 'orb-pulse 2.4s ease-in-out infinite',
      }} />
      <p style={{
        fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'var(--soar)', margin: 0,
      }}>404 · Off the grid</p>
      <h1 style={{
        fontSize: 'clamp(36px,5vw,56px)', fontWeight: 700, letterSpacing: '-0.03em',
        margin: '4px 0 8px', color: '#fff',
      }}>This title isn&apos;t in the constellation.</h1>
      <p style={{ fontSize: 15, color: 'var(--muted)', margin: '0 0 24px', maxWidth: 480 }}>
        The page you&apos;re looking for either moved or never existed. Head back to base.
      </p>
      <Link
        href="/"
        style={{
          padding: '12px 32px', borderRadius: 999,
          background: 'linear-gradient(135deg,#d9b45e,#e8c87a)',
          color: '#0a0a0e', fontSize: 14, fontWeight: 700,
          textDecoration: 'none', boxShadow: '0 0 30px rgba(232,200,122,0.3)',
        }}
      >
        Back to SoarTV
      </Link>
    </div>
  )
}
