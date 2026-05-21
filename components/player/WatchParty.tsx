'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  collection, doc, setDoc, deleteDoc, onSnapshot,
  addDoc, serverTimestamp, query, orderBy, limit,
  type Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Viewer {
  uid:         string
  displayName: string
  photoURL:    string | null
  joinedAt:    Timestamp | null
}

interface Comment {
  id:          string
  uid:         string
  displayName: string
  photoURL:    string | null
  text:        string
  ts:          Timestamp | null
}

interface Props {
  partyId:  string   // e.g. `movie-603` or `tv-1399-s1e1`
  title?:   string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WatchParty({ partyId, title }: Props) {
  const { user }                          = useAuth()
  const [open,     setOpen]               = useState(false)
  const [viewers,  setViewers]            = useState<Viewer[]>([])
  const [comments, setComments]           = useState<Comment[]>([])
  const [text,     setText]               = useState('')
  const [posting,  setPosting]            = useState(false)
  const bottomRef                         = useRef<HTMLDivElement>(null)
  const joinedRef                         = useRef(false)

  // Join party: write presence document; clean up on unmount
  useEffect(() => {
    if (!user || joinedRef.current) return
    joinedRef.current = true
    const presenceRef = doc(db, 'watchParty', partyId, 'viewers', user.uid)

    setDoc(presenceRef, {
      uid:         user.uid,
      displayName: user.displayName ?? user.email ?? 'Guest',
      photoURL:    user.photoURL ?? null,
      joinedAt:    serverTimestamp(),
    }).catch(console.error)

    return () => {
      deleteDoc(presenceRef).catch(console.error)
      joinedRef.current = false
    }
  }, [user, partyId])

  // Subscribe viewers
  useEffect(() => {
    return onSnapshot(
      collection(db, 'watchParty', partyId, 'viewers'),
      snap => setViewers(snap.docs.map(d => d.data() as Viewer))
    )
  }, [partyId])

  // Subscribe comments (last 80)
  useEffect(() => {
    const q = query(
      collection(db, 'watchParty', partyId, 'comments'),
      orderBy('ts', 'asc'),
      limit(80),
    )
    return onSnapshot(q, snap => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment)))
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    })
  }, [partyId])

  const sendComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !text.trim() || posting) return
    setPosting(true)
    const payload = text.trim()
    setText('')
    try {
      await addDoc(collection(db, 'watchParty', partyId, 'comments'), {
        uid:         user.uid,
        displayName: user.displayName ?? user.email ?? 'Guest',
        photoURL:    user.photoURL ?? null,
        text:        payload,
        ts:          serverTimestamp(),
      })
    } catch (err) {
      console.error(err)
      setText(payload) // restore on failure
    } finally {
      setPosting(false)
    }
  }, [user, text, posting, partyId])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendComment(e as unknown as React.FormEvent)
    }
  }

  return (
    <>
      {/* trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 18px', borderRadius: 999,
          background: open ? 'rgba(232,200,122,0.15)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${open ? 'rgba(232,200,122,0.35)' : 'rgba(255,255,255,0.1)'}`,
          color: open ? '#e8c87a' : 'var(--text-dim)',
          fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        <UsersIcon />
        Watch Party
        {viewers.length > 0 && (
          <ViewerPips viewers={viewers} />
        )}
      </button>

      {/* panel */}
      {open && (
        <div style={{
          position: 'fixed', right: 20, bottom: 20, zIndex: 200,
          width: 340, height: 520, display: 'flex', flexDirection: 'column',
          background: 'rgba(10,11,18,0.97)', border: '1px solid var(--line)',
          borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
          animation: 'party-in 0.25s cubic-bezier(.2,.7,.2,1)',
          backdropFilter: 'blur(20px)',
        }}>
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: '0 0 2px' }}>Watch Party</p>
              {title && <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>{title}</p>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* viewer count */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: 'rgba(232,200,122,0.1)', border: '1px solid rgba(232,200,122,0.2)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', animation: 'pulse-dot 1.8s ease-in-out infinite' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#e8c87a' }}>{viewers.length}</span>
              </div>
              <button onClick={() => setOpen(false)} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--muted)' }}>
                <XIcon />
              </button>
            </div>
          </div>

          {/* comments list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {!user && (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)', fontSize: 13 }}>
                Sign in to join the conversation.
              </div>
            )}
            {comments.length === 0 && user && (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)', fontSize: 13 }}>
                No messages yet. Say hi!
              </div>
            )}
            {comments.map(c => (
              <CommentBubble key={c.id} comment={c} isOwn={c.uid === user?.uid} />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* input */}
          <form
            onSubmit={sendComment}
            style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', display: 'flex', gap: 8, flexShrink: 0, alignItems: 'flex-end' }}
          >
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!user || posting}
              placeholder={user ? 'Say something… (Enter to send)' : 'Sign in to chat'}
              rows={1}
              style={{
                flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '9px 12px', color: '#fff', fontSize: 13, fontFamily: 'inherit',
                outline: 'none', resize: 'none', maxHeight: 80, lineHeight: 1.45,
                transition: 'border-color 0.2s',
              }}
              onFocus={e  => { e.currentTarget.style.borderColor = 'rgba(232,200,122,0.4)' }}
              onBlur={e   => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
            />
            <button
              type="submit"
              disabled={!user || !text.trim() || posting}
              style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: text.trim() && user ? 'linear-gradient(135deg,#d9b45e,#e8c87a)' : 'rgba(255,255,255,0.06)',
                border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer',
                color: text.trim() && user ? '#0a0a0e' : 'var(--muted)',
                transition: 'background 0.2s',
              }}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes party-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
      `}</style>
    </>
  )
}

// ── CommentBubble ─────────────────────────────────────────────────────────────

function CommentBubble({ comment, isOwn }: { comment: Comment; isOwn: boolean }) {
  const timeStr = comment.ts
    ? new Date(comment.ts.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div style={{ display: 'flex', gap: 8, flexDirection: isOwn ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
      {/* avatar */}
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(232,200,122,0.2)', flexShrink: 0, overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
        {comment.photoURL
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={comment.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 11, fontWeight: 700, color: '#e8c87a' }}>{(comment.displayName[0] ?? '?').toUpperCase()}</span>
        }
      </div>

      <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
        {!isOwn && (
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.04em' }}>
            {comment.displayName}
          </span>
        )}
        <div style={{
          padding: '8px 12px', borderRadius: isOwn ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
          background: isOwn ? 'rgba(232,200,122,0.2)' : 'rgba(255,255,255,0.06)',
          border: isOwn ? '1px solid rgba(232,200,122,0.3)' : '1px solid rgba(255,255,255,0.06)',
          fontSize: 13, color: '#fff', lineHeight: 1.45, wordBreak: 'break-word',
        }}>
          {comment.text}
        </div>
        {timeStr && (
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>{timeStr}</span>
        )}
      </div>
    </div>
  )
}

// ── ViewerPips ────────────────────────────────────────────────────────────────

function ViewerPips({ viewers }: { viewers: Viewer[] }) {
  const shown = viewers.slice(0, 3)
  const extra = viewers.length - shown.length
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
      {shown.map((v, i) => (
        <div key={v.uid} style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid rgba(10,11,18,0.9)', background: 'rgba(232,200,122,0.25)', overflow: 'hidden', marginLeft: i === 0 ? 0 : -6, display: 'grid', placeItems: 'center' }}>
          {v.photoURL
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={v.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: 8, fontWeight: 700, color: '#e8c87a' }}>{(v.displayName[0] ?? '?').toUpperCase()}</span>
          }
        </div>
      ))}
      {extra > 0 && (
        <div style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid rgba(10,11,18,0.9)', background: 'rgba(255,255,255,0.1)', marginLeft: -6, display: 'grid', placeItems: 'center' }}>
          <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--muted)' }}>+{extra}</span>
        </div>
      )}
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function UsersIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
}

function XIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/></svg>
}

function SendIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
}
