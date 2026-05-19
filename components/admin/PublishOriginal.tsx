'use client'

import { useState } from 'react'
import {
  collection, doc, setDoc, addDoc, serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductRow {
  _key:     string   // local UI key only
  name:     string
  imageUrl: string
  url:      string
  price:    string
}

interface Props {
  /** Existing original ID for editing — omit to create new */
  originalId?: string
  initialData?: {
    title:       string
    tmdbId:      number | string
    type:        'movie' | 'show'
    description: string
    published:   boolean
  }
  onSaved?: (id: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PublishOriginal({ originalId, initialData, onSaved }: Props) {
  const { user } = useAuth()

  const [title,       setTitle]       = useState(initialData?.title ?? '')
  const [tmdbId,      setTmdbId]      = useState(String(initialData?.tmdbId ?? ''))
  const [type,        setType]        = useState<'movie' | 'show'>(initialData?.type ?? 'movie')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [published,   setPublished]   = useState(initialData?.published ?? false)
  const [products,    setProducts]    = useState<ProductRow[]>([emptyProduct()])

  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)

  const addProduct    = () => setProducts(p => [...p, emptyProduct()])
  const removeProduct = (key: string) => setProducts(p => p.filter(r => r._key !== key))
  const updateProduct = (key: string, field: keyof Omit<ProductRow, '_key'>, value: string) =>
    setProducts(p => p.map(r => r._key === key ? { ...r, [field]: value } : r))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { setError('Not authenticated.'); return }
    if (!title.trim() || !tmdbId.trim()) { setError('Title and TMDB ID are required.'); return }

    setSaving(true); setError(''); setSuccess(false)

    try {
      const batch = writeBatch(db)

      // Upsert the original document
      const origRef = originalId
        ? doc(db, 'originals', originalId)
        : doc(collection(db, 'originals'))

      batch.set(origRef, {
        title:       title.trim(),
        tmdbId:      Number(tmdbId),
        type,
        description: description.trim(),
        published,
        updatedAt:   serverTimestamp(),
        ...(originalId ? {} : { createdAt: serverTimestamp(), createdBy: user.uid }),
      }, { merge: true })

      // Write each product to the sub-collection
      products
        .filter(p => p.name.trim() && p.url.trim())
        .forEach(p => {
          const productRef = doc(collection(db, 'originals', origRef.id, 'products'))
          batch.set(productRef, {
            name:     p.name.trim(),
            imageUrl: p.imageUrl.trim(),
            url:      p.url.trim(),
            price:    p.price.trim(),
          })
        })

      await batch.commit()
      setSuccess(true)
      onSaved?.(origRef.id)
    } catch (err) {
      setError((err as Error).message ?? 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* ── Original metadata ── */}
      <Section label="Original metadata">
        <Field label="Title" required>
          <Input value={title} onChange={setTitle} placeholder="e.g. The Resonance Files" required />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="TMDB ID" required>
            <Input type="number" value={tmdbId} onChange={setTmdbId} placeholder="e.g. 603" required />
          </Field>
          <Field label="Type">
            <select
              value={type}
              onChange={e => setType(e.target.value as 'movie' | 'show')}
              style={selectStyle}
            >
              <option value="movie">Movie</option>
              <option value="show">TV Show</option>
            </select>
          </Field>
        </div>
        <Field label="Description">
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Short description shown in the Shop This Scene overlay…"
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', height: 'auto' }}
          />
        </Field>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: '#b4a7ff', cursor: 'pointer' }}
          />
          <span style={{ fontSize: 14, color: 'var(--text-dim)' }}>Published — visible to all users</span>
        </label>
      </Section>

      {/* ── Shop This Scene products ── */}
      <Section label="Shop This Scene products">
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Each product will appear as a shoppable card on the watch page. External URL opens in a new tab.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {products.map((p, idx) => (
            <ProductRowEditor
              key={p._key}
              index={idx}
              row={p}
              onChange={(field, value) => updateProduct(p._key, field, value)}
              onRemove={products.length > 1 ? () => removeProduct(p._key) : undefined}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addProduct}
          style={{
            marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 600, color: '#b4a7ff', padding: '8px 14px',
            borderRadius: 10, border: '1px dashed rgba(180,167,255,0.4)',
            background: 'rgba(180,167,255,0.06)', transition: 'background 0.2s',
          }}
        >
          <PlusIcon /> Add product
        </button>
      </Section>

      {/* ── Feedback ── */}
      {error && (
        <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: '#fca5a5' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', fontSize: 13, color: '#4ade80' }}>
          ✓ Saved successfully
        </div>
      )}

      {/* ── Submit ── */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 700,
            background: saving ? 'rgba(180,167,255,0.3)' : 'linear-gradient(135deg,#7c5cfc,#b4a7ff)',
            color: saving ? 'rgba(255,255,255,0.4)' : '#0a0a0e',
            border: 'none', cursor: saving ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          {saving && <Spinner />}
          {saving ? 'Saving…' : originalId ? 'Update Original' : 'Publish Original'}
        </button>
      </div>
    </form>
  )
}

// ── ProductRowEditor ──────────────────────────────────────────────────────────

function ProductRowEditor({ index, row, onChange, onRemove }: {
  index:    number
  row:      ProductRow
  onChange: (field: keyof Omit<ProductRow, '_key'>, value: string) => void
  onRemove?: () => void
}) {
  return (
    <div style={{ padding: '18px 20px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Product {index + 1}
        </span>
        {onRemove && (
          <button type="button" onClick={onRemove} style={{ fontSize: 12, color: 'var(--muted)', padding: '2px 8px', borderRadius: 6, border: '1px solid var(--line)', transition: 'color 0.2s' }}>
            Remove
          </button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Product name">
          <Input value={row.name} onChange={v => onChange('name', v)} placeholder="e.g. Leather Trench Coat" />
        </Field>
        <Field label="Price (optional)">
          <Input value={row.price} onChange={v => onChange('price', v)} placeholder="e.g. $189" />
        </Field>
      </div>
      <Field label="Shop URL">
        <Input type="url" value={row.url} onChange={v => onChange('url', v)} placeholder="https://…" />
      </Field>
      <Field label="Image URL">
        <Input type="url" value={row.imageUrl} onChange={v => onChange('imageUrl', v)} placeholder="https://…" />
      </Field>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function emptyProduct(): ProductRow {
  return { _key: Math.random().toString(36).slice(2), name: '', imageUrl: '', url: '', price: '' }
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.25)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
  color: '#fff', fontSize: 14, fontWeight: 400, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', transition: 'border-color 0.2s',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle, cursor: 'pointer', appearance: 'none',
}

function Input({ value, onChange, type = 'text', placeholder, required }: {
  value:       string
  onChange:    (v: string) => void
  type?:       string
  placeholder?: string
  required?:   boolean
}) {
  return (
    <input
      type={type} value={value} required={required} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={inputStyle}
      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(180,167,255,0.5)' }}
      onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
    />
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.04em' }}>
        {label}{required && <span style={{ color: '#f87171', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>{label}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  )
}

function PlusIcon() {
  return <svg width="13" height="13" viewBox="0 0 13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="6.5" y1="2" x2="6.5" y2="11"/><line x1="2" y1="6.5" x2="11" y2="6.5"/></svg>
}

function Spinner() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="22" strokeDashoffset="8" strokeLinecap="round"/><style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style></svg>
}
