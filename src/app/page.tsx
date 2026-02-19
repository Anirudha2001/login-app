'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setIsLoading(false)
    setShowSuccess(true)
  }

  return (
    <>
      {/* Animated background */}
      <div className="bg-scene">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <div className="bg-grid" />

      {/* Main layout */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div
          className="page-in w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl shadow-sky-300/30"
          style={{ minHeight: '580px' }}
        >

          {/* ── LEFT PANEL ── */}
          <div
            className="hidden lg:flex flex-col justify-between w-[46%] p-12 relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)' }}
          >
            {/* Dot grid overlay */}
            <div className="dot-grid absolute inset-0 opacity-60" />

            {/* Decorative circle */}
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/10 border border-white/20" />
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 border border-white/20" />

            {/* Top: logo */}
            <div className="relative z-10">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center logo-float"
                style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.35)' }}
              >
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                  <rect x="4" y="4" width="14" height="14" rx="3" fill="white" fillOpacity="0.9" />
                  <rect x="22" y="4" width="14" height="14" rx="3" fill="white" fillOpacity="0.5" />
                  <rect x="4" y="22" width="14" height="14" rx="3" fill="white" fillOpacity="0.5" />
                  <rect x="22" y="22" width="14" height="14" rx="3" fill="white" fillOpacity="0.9" />
                </svg>
              </div>
              <p className="mt-4 text-white/60 text-sm font-medium tracking-widest uppercase" style={{ fontFamily: 'Instrument Sans' }}>
                MyApp
              </p>
            </div>

            {/* Middle: headline */}
            <div className="relative z-10">
              <h2
                className="text-white text-4xl font-bold leading-tight"
                style={{ fontFamily: 'Sora', textShadow: '0 2px 20px rgba(0,0,0,0.15)' }}
              >
                Welcome<br />back 👋
              </h2>
              <p className="mt-4 text-white/70 text-base leading-relaxed" style={{ fontFamily: 'Instrument Sans', maxWidth: '260px' }}>
                Sign in to continue to your dashboard and access all your tools.
              </p>

              {/* Stats row */}
              <div className="mt-8 flex gap-6">
                {[{ num: '91', label: 'Hugs sent' }, { num: '21', label: 'Received' }].map(s => (
                  <div key={s.label}>
                    <p className="text-white text-2xl font-bold" style={{ fontFamily: 'Sora' }}>{s.num}</p>
                    <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: testimonial chip */}
            <div className="relative z-10">
              <div
                className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)' }}
              >
                <div className="flex -space-x-2">
                  {['#f97316', '#06b6d4', '#a855f7'].map((c, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-sky-600 flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: c }}
                    >
                      {['A', 'B', 'C'][i]}
                    </div>
                  ))}
                </div>
                <p className="text-white/80 text-xs">
                  <span className="text-white font-semibold">2,400+</span> users trust us
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div
            className="flex-1 flex flex-col justify-center px-10 py-12 lg:px-14"
            style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)' }}
          >
            {/* Mobile logo */}
            <div className="lg:hidden mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
                  <rect x="4" y="4" width="14" height="14" rx="3" fill="white" />
                  <rect x="22" y="22" width="14" height="14" rx="3" fill="white" />
                </svg>
              </div>
              <span className="font-bold text-sky-600 text-lg" style={{ fontFamily: 'Sora' }}>MyApp</span>
            </div>

            {/* Heading */}
            <div className="fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="px-3 py-0.5 text-2xl font-bold rounded-lg"
                  style={{ fontFamily: 'Sora', background: '#ffe234', color: '#0f172a' }}
                >
                  Login
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-2" style={{ fontFamily: 'Instrument Sans' }}>
                Don&apos;t have an account?{' '}
                <a href="#" className="text-sky-500 font-semibold hover:underline">Sign Up</a>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="mt-8 space-y-5 max-w-sm">

              {/* Email / Mobile */}
              <div className="fade-up" style={{ animationDelay: '0.2s' }}>
                <label
                  className="block text-sm font-semibold text-slate-600 mb-2"
                  style={{ fontFamily: 'Instrument Sans' }}
                >
                  Mobile / Email
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="With Mobile or Email"
                  className="input-field w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm"
                  style={{ fontFamily: 'Instrument Sans' }}
                />
              </div>

              {/* Remember Me + Forgot Password */}
              <div className="fade-up flex items-center justify-between" style={{ animationDelay: '0.3s' }}>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    id="remember"
                  />
                  <span className="check-box">
                    {rememberMe && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm text-slate-600" style={{ fontFamily: 'Instrument Sans' }}>Remember Me</span>
                </label>
                <a href="#" className="text-sm text-sky-500 font-semibold hover:underline" style={{ fontFamily: 'Instrument Sans' }}>
                  Forgot Password
                </a>
              </div>

              {/* Login Button */}
              <div className="fade-up" style={{ animationDelay: '0.4s' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-shimmer w-full py-3.5 rounded-xl text-white font-bold text-sm tracking-wide shadow-lg shadow-sky-300/40 hover:shadow-sky-400/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ fontFamily: 'Sora' }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Signing in…
                    </span>
                  ) : showSuccess ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Welcome back!
                    </span>
                  ) : 'Login'}
                </button>
              </div>

              {/* Divider */}
              <div className="fade-up flex items-center gap-3" style={{ animationDelay: '0.5s' }}>
                <div className="divider-line" />
                <span className="text-xs text-slate-400 whitespace-nowrap" style={{ fontFamily: 'Instrument Sans' }}>or login with</span>
                <div className="divider-line" />
              </div>

              {/* Social buttons */}
              <div className="fade-up flex gap-3" style={{ animationDelay: '0.55s' }}>
                {/* Google */}
                <button
                  type="button"
                  className="social-btn flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-slate-600"
                  style={{ fontFamily: 'Instrument Sans' }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>

                {/* Apple */}
                <button
                  type="button"
                  className="social-btn flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-slate-600"
                  style={{ fontFamily: 'Instrument Sans' }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Apple
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  className="social-btn flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-slate-600"
                  style={{ fontFamily: 'Instrument Sans' }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>

              {/* 91 Hug × 21 Hug badge */}
              <div className="fade-up" style={{ animationDelay: '0.6s' }}>
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold text-sky-600"
                  style={{ fontFamily: 'Sora', borderColor: '#bae6fd', background: '#f0f9ff' }}
                >
                  <span>🤗</span>
                  <span>91 Hug × 21 Hug</span>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  )
}
