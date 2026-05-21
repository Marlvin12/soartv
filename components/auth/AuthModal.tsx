'use client'

import { useEffect, useRef, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  linkWithCredential,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  type OAuthCredential,
  type ConfirmationResult,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, googleProvider, db } from '@/lib/firebase'
import { IMG_1280 } from '@/lib/tmdb'

// ─── Constants ────────────────────────────────────────────────────────────────

const FIREBASE_ERRORS: Record<string, string> = {
  'auth/invalid-email':              "That email address doesn't look right.",
  'auth/user-not-found':             'No account found with that email.',
  'auth/wrong-password':             'Incorrect password. Please try again.',
  'auth/invalid-credential':         'Email or password is incorrect.',
  'auth/email-already-in-use':       'An account with this email already exists.',
  'auth/weak-password':              'Password must be at least 6 characters.',
  'auth/too-many-requests':          'Too many attempts. Please wait a moment.',
  'auth/network-request-failed':     'Network error. Check your connection.',
  'auth/popup-closed-by-user':       'Sign-in popup was closed. Please try again.',
  'auth/popup-blocked':              'Popup blocked. Allow popups and try again.',
  'auth/user-disabled':              'This account has been disabled.',
  'auth/invalid-phone-number':       "That phone number doesn't look right. Use international format.",
  'auth/missing-phone-number':       'Please enter a phone number.',
  'auth/quota-exceeded':             'SMS quota exceeded. Try again later.',
  'auth/invalid-verification-code':  'That code is incorrect. Please try again.',
  'auth/code-expired':               'Verification code expired. Send a new one.',
  'auth/captcha-check-failed':       'Verification failed. Refresh and try again.',
  'auth/billing-not-enabled':        'Phone sign-in needs a Firebase billing upgrade. Use Email or Google for now.',
}

const COUNTRY_CODES = [
  { code: '+1',   flag: '🇺🇸', label: 'US' },
  { code: '+44',  flag: '🇬🇧', label: 'UK' },
  { code: '+254', flag: '🇰🇪', label: 'KE' },
  { code: '+27',  flag: '🇿🇦', label: 'ZA' },
  { code: '+234', flag: '🇳🇬', label: 'NG' },
  { code: '+61',  flag: '🇦🇺', label: 'AU' },
  { code: '+91',  flag: '🇮🇳', label: 'IN' },
  { code: '+33',  flag: '🇫🇷', label: 'FR' },
  { code: '+49',  flag: '🇩🇪', label: 'DE' },
  { code: '+81',  flag: '🇯🇵', label: 'JP' },
]

const firebaseMsg = (err: { code?: string }) =>
  FIREBASE_ERRORS[err?.code ?? ''] ?? 'Something went wrong. Please try again.'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function saveUser(user: any) {
  await setDoc(doc(db, 'users', user.uid), {
    uid:           user.uid,
    displayName:   user.displayName    ?? null,
    email:         user.email          ?? null,
    phoneNumber:   user.phoneNumber    ?? null,
    photoURL:      user.photoURL       ?? null,
    emailVerified: user.emailVerified  ?? false,
    lastLoginAt:   serverTimestamp(),
  }, { merge: true })
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  isOpen:  boolean
  onClose: () => void
}

type Method = 'email' | 'phone'

export default function AuthModal({ isOpen, onClose }: Props) {
  // ── shared ──
  const [method,           setMethod]           = useState<Method>('email')
  const [isLogin,          setIsLogin]          = useState(true)
  const [error,            setError]            = useState('')
  const [loading,          setLoading]          = useState(false)
  const [backdropUrl,      setBackdropUrl]      = useState<string | null>(null)

  // ── email ──
  const [email,            setEmail]            = useState('')
  const [password,         setPassword]         = useState('')
  const [name,             setName]             = useState('')
  const [showReset,        setShowReset]        = useState(false)
  const [resetEmail,       setResetEmail]       = useState('')
  const [resetSent,        setResetSent]        = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [pendingCred,      setPendingCred]      = useState<OAuthCredential | null>(null)

  // ── phone ──
  const [countryCode,      setCountryCode]      = useState('+1')
  const [phoneNumber,      setPhoneNumber]      = useState('')
  const [otp,              setOtp]              = useState('')
  const [confirmation,     setConfirmation]     = useState<ConfirmationResult | null>(null)
  const recaptchaRef                            = useRef<RecaptchaVerifier | null>(null)

  // ── Backdrop: fetch a random cinematic still ──
  useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    fetch('/api/tmdb?path=/trending/movie/week')
      .then(r => r.json())
      .then(d => {
        if (cancelled) return
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const films = (d.results ?? []).filter((m: any) => m.backdrop_path)
        if (films.length === 0) return
        const pick = films[Math.floor(Math.random() * Math.min(films.length, 8))]
        setBackdropUrl(IMG_1280 + pick.backdrop_path)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [isOpen])

  // ── Cleanup recaptcha on close ──
  useEffect(() => {
    if (!isOpen && recaptchaRef.current) {
      recaptchaRef.current.clear()
      recaptchaRef.current = null
    }
  }, [isOpen])

  // ── Tab/method switch resets state ──
  const switchMethod = (m: Method) => { setMethod(m); setError(''); setShowReset(false); setVerificationSent(false); setConfirmation(null) }
  const switchTab    = (toLogin: boolean) => { setIsLogin(toLogin); setError(''); setShowReset(false); setVerificationSent(false); setPendingCred(null) }

  // ─── Email handlers ─────────────────────────────────────────────────────────

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail.trim()) return
    setLoading(true); setError('')
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim())
      setResetSent(true)
    } catch (err) { setError(firebaseMsg(err as { code?: string })) }
    finally { setLoading(false) }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password)
        if (!result.user.emailVerified) {
          await auth.signOut()
          setError('Please verify your email before logging in. Check your inbox.')
          return
        }
        if (pendingCred) {
          await linkWithCredential(result.user, pendingCred)
          setPendingCred(null)
        }
        saveUser(result.user).catch(console.error)
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(cred.user, { displayName: name })
        saveUser({ ...cred.user, displayName: name }).catch(console.error)
        await sendEmailVerification(cred.user)
        setVerificationSent(true)
        return
      }
      onClose()
    } catch (err) { setError(firebaseMsg(err as { code?: string })) }
    finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    setError(''); setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      saveUser(result.user).catch(console.error)
      onClose()
    } catch (err) { setError(firebaseMsg(err as { code?: string })) }
    finally { setLoading(false) }
  }

  // ─── Phone handlers ─────────────────────────────────────────────────────────

  const ensureRecaptcha = () => {
    if (recaptchaRef.current) return recaptchaRef.current
    recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    })
    return recaptchaRef.current
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const digits = phoneNumber.replace(/\D/g, '')
      if (digits.length < 6) throw { code: 'auth/invalid-phone-number' }
      const e164  = `${countryCode}${digits}`
      const verifier = ensureRecaptcha()
      const result   = await signInWithPhoneNumber(auth, e164, verifier)
      setConfirmation(result)
    } catch (err) {
      // Log full error to console for debugging
      console.error('[phone-auth] signInWithPhoneNumber failed:', err)
      const e = err as { code?: string; message?: string }
      const friendly = firebaseMsg(e)
      // Surface the raw code when we don't have a friendly translation,
      // so we can see exactly what Firebase is rejecting.
      setError(e.code && !FIREBASE_ERRORS[e.code]
        ? `${friendly} (${e.code})`
        : friendly)
      // Reset recaptcha on failure so user can retry
      if (recaptchaRef.current) { recaptchaRef.current.clear(); recaptchaRef.current = null }
    }
    finally { setLoading(false) }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      if (!confirmation) throw { code: 'auth/missing-phone-number' }
      const result = await confirmation.confirm(otp)
      saveUser(result.user).catch(console.error)
      onClose()
    } catch (err) { setError(firebaseMsg(err as { code?: string })) }
    finally { setLoading(false) }
  }

  if (!isOpen) return null

  // ─── Render ─────────────────────────────────────────────────────────────────

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.18)', borderRadius: 16,
    color: '#fff', fontSize: 15, fontWeight: 400, outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
    transition: 'border-color 0.2s, background 0.2s',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, overflow: 'hidden' }}>
      {/* ── Cinematic backdrop ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {backdropUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backdropUrl}
            alt=""
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', filter: 'blur(2px) saturate(110%)',
              animation: 'auth-bg-pan 28s ease-in-out infinite alternate',
            }}
          />
        )}
        {/* Dim + vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%,rgba(7,7,10,0.35) 0%,rgba(7,7,10,0.75) 60%,rgba(7,7,10,0.92) 100%)',
        }} />
        {/* Bottom gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom,rgba(7,7,10,0.3) 0%,rgba(7,7,10,0.0) 35%,rgba(7,7,10,0.6) 100%)',
        }} />
      </div>

      {/* ── Glass card ── */}
      <div style={{
        position: 'relative', zIndex: 2, height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, overflowY: 'auto',
      }}>
        <div style={{
          width: '100%', maxWidth: 440,
          padding: '28px 28px 32px',
          borderRadius: 28,
          background: 'rgba(20,20,28,0.45)',
          border: '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          animation: 'auth-in 0.4s cubic-bezier(.2,.7,.2,1)',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <SoarIcon />
              <span style={{ fontSize: 17, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>
                Soar<span style={{ color: '#e8c87a', fontWeight: 700 }}>TV</span>
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.7)', display: 'grid', placeItems: 'center',
                cursor: 'pointer', transition: 'background 0.2s',
              }}
            >
              <XIcon />
            </button>
          </div>

          {!showReset && !verificationSent && (
            <>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', margin: '0 0 6px' }}>
                {isLogin ? 'Welcome back.' : 'Create your account.'}
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: '0 0 22px' }}>
                {isLogin ? 'Sign in to save your Resonance and watchlist.' : "Save your archetype and pick up across devices."}
              </p>

              {/* Method switch */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                <MethodButton active={method === 'email'} onClick={() => switchMethod('email')} icon={<EmailIcon />}>Email</MethodButton>
                <MethodButton active={method === 'phone'} onClick={() => switchMethod('phone')} icon={<PhoneIcon />}>Phone</MethodButton>
              </div>
            </>
          )}

          {/* Error message */}
          {error && (
            <div style={{ padding: '12px 14px', marginBottom: 14, borderRadius: 12, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', fontSize: 13, color: '#fca5a5', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <WarningIcon />
              <span style={{ lineHeight: 1.5 }}>{error}</span>
            </div>
          )}

          {/* ── Forgot password ── */}
          {showReset ? (
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {resetSent ? (
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <CheckCircleIcon />
                  <p style={{ color: '#4ade80', fontWeight: 600, marginTop: 10 }}>Reset link sent</p>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>Check your inbox for a password reset email.</p>
                  <button type="button" onClick={() => { setShowReset(false); setResetSent(false) }} style={{ marginTop: 16, fontSize: 13, color: '#e8c87a' }}>
                    ← Back to Log In
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize: 22, fontWeight: 600, color: '#fff', margin: 0 }}>Reset password</h2>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '0 0 8px' }}>Enter your email and we&apos;ll send a reset link.</p>
                  <input
                    type="email" required value={resetEmail}
                    placeholder="Your email address"
                    onChange={e => setResetEmail(e.target.value)}
                    style={inputStyle}
                  />
                  <PrimaryBtn loading={loading} label="Send Reset Link" />
                  <button type="button" onClick={() => { setShowReset(false); setError('') }} style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', padding: 4 }}>
                    ← Back to Log In
                  </button>
                </>
              )}
            </form>
          ) : verificationSent ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <CheckCircleIcon />
              <h2 style={{ color: '#fff', fontWeight: 600, marginTop: 10 }}>Verify your email</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
                We sent a verification link to <strong style={{ color: '#fff' }}>{email}</strong>.
              </p>
              <button onClick={() => switchTab(true)} style={{ marginTop: 18, width: '100%', padding: '12px 0', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                Return to Log In
              </button>
            </div>
          ) : method === 'email' ? (
            /* ── Email form ── */
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {!isLogin && (
                <input type="text" required value={name} placeholder="Full Name"
                  onChange={e => setName(e.target.value)} style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(232,200,122,0.5)' }}
                  onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }} />
              )}
              <input type="email" required value={email} placeholder="Email"
                onChange={e => setEmail(e.target.value)} style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(232,200,122,0.5)' }}
                onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }} />
              <input type="password" required value={password} placeholder="Password"
                onChange={e => setPassword(e.target.value)} style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(232,200,122,0.5)' }}
                onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }} />
              {isLogin && (
                <div style={{ textAlign: 'right', marginTop: -4 }}>
                  <button type="button" onClick={() => { setShowReset(true); setResetEmail(email); setError('') }}
                    style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                    Forgot password?
                  </button>
                </div>
              )}
              <PrimaryBtn loading={loading} label={pendingCred ? 'Sign In & Link Google' : isLogin ? 'Continue' : 'Create Account'} />
            </form>
          ) : (
            /* ── Phone form ── */
            confirmation ? (
              <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', margin: 0 }}>Enter the code</h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>
                  We sent a 6-digit code to <strong style={{ color: '#fff' }}>{countryCode} {phoneNumber}</strong>.
                </p>
                <input
                  type="text" inputMode="numeric" pattern="\d{6}" maxLength={6} required
                  value={otp} placeholder="6-digit code"
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{ ...inputStyle, fontSize: 24, letterSpacing: '0.4em', textAlign: 'center', fontWeight: 600 }}
                  autoFocus
                />
                <PrimaryBtn loading={loading} label="Verify & Sign In" disabled={otp.length !== 6} />
                <button type="button" onClick={() => { setConfirmation(null); setOtp(''); setError('') }} style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                  ← Use a different number
                </button>
              </form>
            ) : (
              <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    style={{ ...inputStyle, width: 'auto', cursor: 'pointer', appearance: 'none', paddingRight: 30 }}
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code} style={{ background: '#16161c', color: '#fff' }}>
                        {c.flag}  {c.label}  {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel" inputMode="tel" required
                    value={phoneNumber}
                    placeholder="Phone number"
                    onChange={e => setPhoneNumber(e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
                <PrimaryBtn loading={loading} label="Send Verification Code" />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
                  We&apos;ll text a 6-digit code. Standard SMS rates may apply.
                </p>
              </form>
            )
          )}

          {/* Divider + Google */}
          {!showReset && !verificationSent && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.12em' }}>OR</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
              </div>
              <button
                onClick={handleGoogle}
                disabled={loading}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '13px 0',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 14, color: '#fff', fontWeight: 600, fontSize: 14,
                  cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1,
                  transition: 'background 0.2s', backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.14)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              >
                <GoogleIcon /> Continue with Google
              </button>

              {/* Footer: swap tab via inline link */}
              <p style={{ marginTop: 22, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                {isLogin ? (
                  <>Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchTab(false)}
                      style={{
                        color: '#e8c87a', fontWeight: 700, padding: 0,
                        textDecoration: 'underline', textUnderlineOffset: 3,
                        background: 'transparent', cursor: 'pointer',
                      }}
                    >
                      Click to sign up
                    </button>
                  </>
                ) : (
                  <>Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchTab(true)}
                      style={{
                        color: '#e8c87a', fontWeight: 700, padding: 0,
                        textDecoration: 'underline', textUnderlineOffset: 3,
                        background: 'transparent', cursor: 'pointer',
                      }}
                    >
                      Click to log in
                    </button>
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Invisible reCAPTCHA mount point (Firebase fills this) */}
      <div id="recaptcha-container" style={{ position: 'absolute', bottom: 0, right: 0, visibility: 'hidden' }} />

      <style>{`
        @keyframes auth-in {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes auth-bg-pan {
          from { transform: scale(1.05) translateX(0); }
          to   { transform: scale(1.12) translateX(-2%); }
        }
      `}</style>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MethodButton({ active, onClick, icon, children }: {
  active:   boolean
  onClick:  () => void
  icon:     React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1, padding: '12px 0', borderRadius: 14,
        background: active ? 'rgba(232,200,122,0.15)' : 'rgba(255,255,255,0.04)',
        border: active ? '1px solid rgba(232,200,122,0.45)' : '1px solid rgba(255,255,255,0.08)',
        color: active ? '#fff' : 'rgba(255,255,255,0.55)',
        fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        cursor: 'pointer', transition: 'all 0.2s',
      }}
    >
      {icon} {children}
    </button>
  )
}

function PrimaryBtn({ loading, label, disabled }: { loading: boolean; label: string; disabled?: boolean }) {
  const off = loading || disabled
  return (
    <button
      type="submit"
      disabled={off}
      style={{
        width: '100%', padding: '14px 0', marginTop: 4,
        background: off ? 'rgba(232,200,122,0.3)' : 'linear-gradient(135deg,#d9b45e,#e8c87a)',
        border: 'none', borderRadius: 14, color: off ? 'rgba(255,255,255,0.4)' : '#0a0a0e',
        fontSize: 15, fontWeight: 700, cursor: off ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.2s, transform 0.15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: off ? 'none' : '0 8px 24px rgba(217,180,94,0.35)',
      }}
      onMouseEnter={e => { if (!off) e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {loading && <Spinner />}
      {label}
    </button>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SoarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="rgba(232,200,122,0.18)" />
      <path d="M8 20 L14 9 L20 20" stroke="#e8c87a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="14" cy="9" r="2" fill="#e8c87a"/>
    </svg>
  )
}
function XIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/></svg>
}
function WarningIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="8" cy="8" r="7" stroke="#f87171" strokeWidth="1.5"/><line x1="8" y1="5" x2="8" y2="9" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="11.5" r="0.75" fill="#f87171"/></svg>
}
function CheckCircleIcon() {
  return <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ display: 'block', margin: '0 auto' }}><circle cx="20" cy="20" r="18" stroke="#4ade80" strokeWidth="1.8"/><path d="M12 20l5.5 5.5L28 14" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function EmailIcon() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="3" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1 4l6.5 5L14 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
}
function PhoneIcon() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="4" y="1" width="7" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><line x1="6.5" y1="11.5" x2="8.5" y2="11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
}
function Spinner() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.6" strokeDasharray="24" strokeDashoffset="8" strokeLinecap="round"/><style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style></svg>
}
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2a10.3 10.3 0 0 0-.16-1.84H9v3.48h4.84A4.14 4.14 0 0 1 12.04 13v2.26h2.9C16.62 13.71 17.64 11.65 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26C11.19 14.27 10.15 14.6 9 14.6c-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.97 10.89A5.38 5.38 0 0 1 3.69 9c0-.65.11-1.28.28-1.89V4.78H.96A9 9 0 0 0 0 9a9 9 0 0 0 .96 4.22l3.01-2.33z" fill="#FBBC05"/>
      <path d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.78L3.97 7.11C4.68 5 6.66 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
