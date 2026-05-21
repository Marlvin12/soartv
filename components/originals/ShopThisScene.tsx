'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Product {
  id:       string
  name:     string
  imageUrl: string
  url:      string
  price?:   string
}

interface Props {
  originalId: string
  title?:     string
}

export default function ShopThisScene({ originalId, title }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [open,     setOpen]     = useState(false)
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    if (!originalId) return
    setLoading(true)
    getDocs(query(collection(db, 'originals', originalId, 'products')))
      .then(snap => {
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [originalId])

  if (!loading && products.length === 0) return null

  return (
    <>
      {/* trigger pill */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 999,
          background: 'linear-gradient(135deg,rgba(232,200,122,0.2),rgba(232,200,122,0.08))',
          border: '1px solid rgba(232,200,122,0.35)',
          color: '#e8c87a', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          transition: 'background 0.2s, transform 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
      >
        <BagIcon />
        Shop This Scene
        {products.length > 0 && (
          <span style={{ background: '#e8c87a', color: '#0a0a0e', fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 999 }}>
            {products.length}
          </span>
        )}
      </button>

      {/* drawer overlay */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex' }}>
          {/* backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          />

          {/* drawer */}
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '100%', maxWidth: 480,
            background: 'rgba(11,12,20,0.98)', borderLeft: '1px solid var(--line)',
            display: 'flex', flexDirection: 'column',
            animation: 'drawer-in 0.28s cubic-bezier(.2,.7,.2,1)',
            backdropFilter: 'blur(20px)',
          }}>
            {/* drawer header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px 18px', borderBottom: '1px solid var(--line)' }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', margin: '0 0 3px', color: '#fff' }}>
                  Shop This Scene
                </h2>
                {title && <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>from {title}</p>}
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--muted)' }}
              >
                <XIcon />
              </button>
            </div>

            {/* product grid */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignContent: 'start' }}>
              {loading && [1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton" style={{ height: 260, borderRadius: 16 }} />
              ))}
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* footer note */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ExternalIcon />
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                Links open in a new tab. SoarTV earns from qualifying purchases.
              </span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes drawer-in {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  )
}

// ── ProductCard ───────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', borderRadius: 16, overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--line)', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,200,122,0.35)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* image */}
      <div style={{ position: 'relative', aspectRatio: '4/5', background: '#0d0d16', overflow: 'hidden' }}>
        {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
        {product.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.35s' }}
            onLoad={() => setImgLoaded(true)}
          />
        )}
        {/* external link badge */}
        <div style={{ position: 'absolute', top: 10, right: 10, width: 26, height: 26, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center' }}>
          <ExternalIcon small />
        </div>
      </div>

      {/* info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: '0 0 4px', lineHeight: 1.3 }}>{product.name}</p>
        {product.price && (
          <p style={{ fontSize: 12, color: 'var(--soar)', fontWeight: 600, margin: 0 }}>{product.price}</p>
        )}
        <span style={{ display: 'inline-block', marginTop: 10, fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 999, background: 'rgba(232,200,122,0.12)', border: '1px solid rgba(232,200,122,0.25)', color: '#e8c87a' }}>
          Shop →
        </span>
      </div>
    </a>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function BagIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
}

function XIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/></svg>
}

function ExternalIcon({ small }: { small?: boolean }) {
  const s = small ? 11 : 13
  return <svg width={s} height={s} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: small ? '#fff' : 'var(--muted)' }}><path d="M6 3H3a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8"/><polyline points="9 1 13 1 13 5"/><line x1="13" y1="1" x2="6" y2="8"/></svg>
}
