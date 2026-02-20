'use client'

import { useState, useEffect, useRef } from 'react'

interface OTPPageProps {
  onVerify: () => void
  onBack: () => void
  email: string
}

export default function OTPPage({ onVerify, onBack, email }: OTPPageProps) {
  const [otp, setOtp] = useState(['', '', '', ''])
  const [activeIdx, setActiveIdx] = useState(0)
  const [countdown, setCountdown] = useState(60)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setInterval(() => setCountdown(c => c - 1), 1000)
    return () => clearInterval(t)
  }, [countdown])

  const handleKey = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp]
      if (newOtp[idx]) {
        newOtp[idx] = ''
        setOtp(newOtp)
      } else if (idx > 0) {
        newOtp[idx - 1] = ''
        setOtp(newOtp)
        setActiveIdx(idx - 1)
        inputsRef.current[idx - 1]?.focus()
      }
    }
  }

  const handleChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const newOtp = [...otp]
    newOtp[idx] = digit
    setOtp(newOtp)
    if (digit && idx < 3) {
      setActiveIdx(idx + 1)
      inputsRef.current[idx + 1]?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.some(d => !d)) { setError('Please enter all 4 digits'); return }
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    onVerify()
  }

  const maskedContact = email.includes('@')
    ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    : '+91 111 ******99'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 p-6 relative overflow-hidden">
      {/* Blobs */}
      <div className="hero-blob" style={{ width: 450, height: 450, background: '#7dd3f8', top: -100, left: -100 }} />
      <div className="hero-blob" style={{ width: 350, height: 350, background: '#38bdf8', bottom: -80, right: -80, animationDelay: '-6s' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(14,165,233,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,.05) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="anim-card-in relative z-10 w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: 600, boxShadow: '0 32px 80px rgba(14,165,233,.2),0 8px 32px rgba(0,0,0,.08)' }}>

        {/* LEFT */}
        <div className="hero-panel hidden lg:flex flex-col justify-between w-[44%] p-14">
          <div className="hero-blob" style={{ width: 280, height: 280, background: 'rgba(255,255,255,.15)', top: -70, right: -70 }} />
          <div className="hero-blob" style={{ width: 200, height: 200, background: 'rgba(255,255,255,.1)', bottom: -50, left: -50, animationDelay: '-5s' }} />

          <div className="relative z-10">
            <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              Back to Login
            </button>
          </div>

          <div className="relative z-10">
            {/* OTP illustration */}
            <div className="anim-logo-float w-24 h-24 rounded-3xl flex items-center justify-center mb-6" style={{ background: 'rgba(255,255,255,.2)', border: '1.5px solid rgba(255,255,255,.35)', backdropFilter: 'blur(8px)' }}>
              <svg viewBox="0 0 48 48" width="44" height="44" fill="none">
                <rect x="8" y="14" width="32" height="22" rx="4" fill="rgba(255,255,255,.25)" stroke="rgba(255,255,255,.7)" strokeWidth="2" />
                <path d="M8 20l16 10 16-10" stroke="rgba(255,255,255,.8)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="36" cy="12" r="6" fill="#4ade80" />
                <path d="M33.5 12l1.5 1.5 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 className="text-white font-bold leading-tight" style={{ fontFamily: 'Sora', fontSize: 36, textShadow: '0 2px 20px rgba(0,0,0,.15)' }}>
              Verify your<br />identity 🔐
            </h2>
            <p className="mt-4 text-white/70 text-sm leading-relaxed" style={{ maxWidth: 260 }}>
              We&apos;ve sent a 4-digit OTP to <span className="text-white font-semibold">{maskedContact}</span>. Enter it below to continue securely.
            </p>

            <div className="mt-8 space-y-3">
              {['256-bit encryption', 'OTP expires in 60 seconds', 'Secure & private'].map(t => (
                <div key={t} className="flex items-center gap-2 text-white/70 text-sm">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,.2)' }}>
                    <svg viewBox="0 0 12 12" width="10" height="10" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 h-4" />
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex flex-col justify-center px-10 py-12 lg:px-14" style={{ background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(20px)' }}>

          {/* Mobile back */}
          <button onClick={onBack} className="lg:hidden flex items-center gap-2 text-gray-500 hover:text-cyan-600 mb-8 text-sm font-medium transition-colors">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            Back
          </button>

          <div className="opacity-0 anim-fade-up d1">
            <h1 className="font-bold text-3xl" style={{ fontFamily: 'Sora', color: '#111827' }}>OTP Code Verification</h1>
            <p className="text-sm text-gray-500 mt-2">Code has been sent to <span className="font-semibold text-gray-700">{maskedContact}</span></p>
          </div>

          <form onSubmit={handleVerify} className="mt-10 max-w-sm">
            {/* OTP inputs */}
            <div className="opacity-0 anim-fade-up d2 flex gap-4 mb-8">
              {otp.map((digit, i) => (
                <div
                  key={i}
                  className={`otp-box ${activeIdx === i ? 'active' : digit ? 'filled' : ''}`}
                  style={{ position: 'relative' }}
                >
                  <input
                    ref={el => { inputsRef.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKey(i, e)}
                    onFocus={() => setActiveIdx(i)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ zIndex: 1 }}
                  />
                  <span>{digit}</span>
                </div>
              ))}
            </div>

            {/* Countdown */}
            <div className="opacity-0 anim-fade-up d3 mb-8 text-sm text-gray-500">
              {countdown > 0 ? (
                <span>Resend code in <span className="font-bold" style={{ color: countdown < 15 ? '#ef4444' : 'var(--cyan)' }}>{countdown}</span> s</span>
              ) : (
                <button type="button" onClick={() => setCountdown(60)} className="font-semibold" style={{ color: 'var(--cyan)' }}>
                  Resend OTP
                </button>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4 flex items-center gap-1">
                <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {error}
              </p>
            )}

            <div className="opacity-0 anim-fade-up d4">
              <button type="submit" disabled={loading} className="btn-cyan w-full py-3.5 text-sm">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.4)" strokeWidth="4" />
                      <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    Verifying…
                  </span>
                ) : 'Verify'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
