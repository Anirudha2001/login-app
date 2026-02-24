'use client'

import { useState } from 'react'

const DOCTORS = [
  { id: 1, name: 'Dr. Prakash Das', specialty: 'Sr. Psychologist', available: true, hours: '09:30 AM – 07:00 PM', exp: '7+ years', rating: 4.9, reviews: 128 },
  { id: 2, name: 'Dr. Ananya Sharma', specialty: 'Cardiologist', available: true, hours: '10:00 AM – 06:00 PM', exp: '12+ years', rating: 4.8, reviews: 214 },
  { id: 3, name: 'Dr. Rohit Mehta', specialty: 'Dermatologist', available: false, hours: '11:00 AM – 05:00 PM', exp: '5+ years', rating: 4.7, reviews: 89 },
  { id: 4, name: 'Dr. Priya Nair', specialty: 'Neurologist', available: true, hours: '09:00 AM – 04:00 PM', exp: '9+ years', rating: 4.9, reviews: 176 },
  { id: 5, name: 'Dr. Vikram Joshi', specialty: 'Orthopedic', available: true, hours: '10:30 AM – 07:30 PM', exp: '15+ years', rating: 4.8, reviews: 302 },
  { id: 6, name: 'Dr. Sneha Pillai', specialty: 'Pediatrician', available: false, hours: '08:00 AM – 03:00 PM', exp: '8+ years', rating: 4.6, reviews: 145 },
]

const NAV = [
  { label: 'Find a Doctor', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { label: 'Appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'Records', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
]

interface DashboardProps {
  onBookDoctor?: (doc: { id: number; name: string; spec: string; color: string }) => void
}

export default function DashboardPage({ onBookDoctor }: DashboardProps) {
  const [activeNav, setActiveNav] = useState(0)
  const [search, setSearch] = useState('')
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState<'all' | 'available'>('all')

  const filtered = DOCTORS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || d.available
    return matchSearch && matchFilter
  })

  const toggleLike = (id: number) => {
    setLiked(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 py-8 px-4" style={{ background: 'white', borderRight: '1.5px solid var(--border)' }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--cyan)' }}>
            <svg viewBox="0 0 40 40" width="20" height="20" fill="none">
              <path d="M20 10v10M15 15h10" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <circle cx="20" cy="20" r="12" stroke="rgba(255,255,255,.6)" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="font-bold text-lg" style={{ fontFamily: 'Sora', color: 'var(--text)' }}>MedApp</span>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 px-3 mb-8 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)' }}>P</div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--text)', fontFamily: 'Sora' }}>Hello, Priya</p>
            <p className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
              <svg viewBox="0 0 20 20" width="10" height="10" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
              Dombivali, Mumbai
            </p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1">
          {NAV.map((item, i) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(i)}
              className={`nav-item w-full text-left ${activeNav === i ? 'active' : ''}`}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="mt-auto">
          <button className="nav-item w-full text-left text-red-400 hover:bg-red-50 hover:text-red-500">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* TOP BAR */}
        <header className="flex items-center justify-between px-8 py-5 flex-shrink-0" style={{ background: 'white', borderBottom: '1.5px solid var(--border)' }}>
          <div>
            <h1 className="font-bold text-xl" style={{ fontFamily: 'Sora', color: 'var(--text)' }}>Find a Doctor</h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Book appointments with top specialists</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Search Doctors…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl border text-sm transition-all"
                style={{ borderColor: 'var(--border)', background: '#f9fafb', width: 240, fontFamily: 'DM Sans', outline: 'none' }}
                onFocus={e => { e.target.style.borderColor = 'var(--cyan)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,191,206,.15)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {/* Notification */}
            <div className="relative cursor-pointer">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100" style={{ background: '#f9fafb', border: '1.5px solid var(--border)' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 17H9m6 0a3 3 0 01-6 0m6 0H5.5A1.5 1.5 0 014 15.5v-.69a1.5 1.5 0 01.44-1.06L6 12.18V10a6 6 0 0112 0v2.18l1.56 1.56A1.5 1.5 0 0120 14.81v.69A1.5 1.5 0 0118.5 17H15z" />
                </svg>
              </div>
              <div className="notif-dot">15</div>
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer" style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)' }}>P</div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-8 py-6">

          {/* Filter tabs */}
          <div className="flex items-center gap-3 mb-6">
            {(['all', 'available'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: filter === f ? 'var(--cyan)' : 'white',
                  color: filter === f ? 'white' : 'var(--muted)',
                  border: `1.5px solid ${filter === f ? 'var(--cyan)' : 'var(--border)'}`,
                  fontFamily: 'DM Sans'
                }}
              >
                {f === 'all' ? 'All Doctors' : 'Available Today'}
              </button>
            ))}
            <span className="ml-auto text-sm" style={{ color: 'var(--muted)' }}>{filtered.length} doctors found</span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filtered.map((doc, i) => (
              <div
                key={doc.id}
                className="doc-card opacity-0 anim-fade-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold" style={{ background: `hsl(${doc.id * 47 + 180},60%,55%)`, minWidth: 80 }}>
                  {doc.name.trim().split(/\s+/)[1]?.[0] ?? doc.name[0] ?? 'D'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base" style={{ fontFamily: 'Sora', color: 'var(--text)' }}>{doc.name}</h3>
                      <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--cyan)' }}>{doc.specialty}</p>
                    </div>
                    <button onClick={() => toggleLike(doc.id)} className="flex-shrink-0 mt-0.5 transition-transform hover:scale-110">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill={liked.has(doc.id) ? '#ef4444' : 'none'} stroke={liked.has(doc.id) ? '#ef4444' : '#d1d5db'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={doc.available ? 'badge-green' : 'badge-cyan'}>
                      {doc.available ? '● Available today' : '○ Unavailable'}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{doc.exp} experience</span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl" style={{ background: '#f3f4f6', color: 'var(--muted)' }}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      {doc.hours}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#f59e0b' }}>
                      <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      {doc.rating} ({doc.reviews})
                    </div>
                  </div>
                  <button
                    onClick={() => onBookDoctor?.({ id: doc.id, name: doc.name, spec: doc.specialty, color: ['#0ea5e9','#8b5cf6','#f97316','#10b981','#e11d48','#d97706'][doc.id - 1] })}
                    className="mt-3 w-full py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(90deg,#22a3b4,#3bbfce)', color: 'white', boxShadow: '0 3px 10px rgba(59,191,206,.3)' }}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: '#f3f4f6' }}>
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <p className="font-semibold text-gray-600" style={{ fontFamily: 'Sora' }}>No doctors found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
