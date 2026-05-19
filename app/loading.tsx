export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 84, height: 84, borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%,#fff,#b4a7ff 35%,#4c1d95 100%)',
        boxShadow: '0 0 50px rgba(180,167,255,0.45)',
        animation: 'orb-pulse 2.4s ease-in-out infinite',
      }} />
    </div>
  )
}
