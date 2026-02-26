'use client'

import { useEffect, useState } from 'react'
import OTPPage from '@/components/OTPPage'
import DashboardPage from '@/components/DashboardPage'
import BookAppointment from '@/components/BookAppointment'
import AppointmentsPage from '@/components/AppointmentsPage'
import AppointmentDetailsPage from '@/components/AppointmentDetailsPage'
import RescheduleAppointmentPage from '@/components/RescheduleAppointmentPage'
import type { BottomNavKey } from '@/components/appointments/BottomNav'
import type { Appointment } from '@/components/appointments/types'
import { updateAppointmentStatuses } from '@/utils/appointmentLifecycle'

type Page =
  | 'login'
  | 'otp'
  | 'dashboard'
  | 'book'
  | 'appointments'
  | 'appointment-details'
  | 'reschedule-appointment'
type SlotBooking = { doctorId: number; dateKey: string; slot: string }

type Doctor = {
  id: number
  name: string
  spec: string
  color: string
}

const PAGE_TO_PATH: Record<Page, string> = {
  login: '/',
  otp: '/otp',
  dashboard: '/dashboard',
  book: '/book',
  appointments: '/appointments',
  'appointment-details': '/appointment-details',
  'reschedule-appointment': '/reschedule-appointment',
}

function getPageFromPath(pathname: string): Page {
  if (pathname === '/otp') return 'otp'
  if (pathname === '/dashboard') return 'dashboard'
  if (pathname === '/book') return 'book'
  if (pathname === '/appointments') return 'appointments'
  if (pathname === '/appointment-details') return 'appointment-details'
  if (pathname === '/reschedule-appointment') return 'reschedule-appointment'
  return 'login'
}

function getFutureDateKey(daysAhead = 1): string {
  const date = new Date()
  date.setDate(date.getDate() + daysAhead)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function createAppointmentId(): string {
  return `a-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    if (typeof window === 'undefined') return 'login'
    return getPageFromPath(window.location.pathname)
  })
  const [email, setEmail] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [bookingsByDoctor, setBookingsByDoctor] = useState<Record<number, Record<string, string[]>>>({})
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'a1',
      doctorId: 'd1',
      doctorName: 'Dr. Kumar Das',
      date: getFutureDateKey(1),
      time: '12:30 PM',
      tokenNo: 12,
      paymentStatus: 'unpaid',
      status: 'upcoming',
    },
  ])
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('a1')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const navigateTo = (nextPage: Page, replace = false) => {
    setPage(nextPage)
    if (typeof window === 'undefined') return
    const nextPath = PAGE_TO_PATH[nextPage]
    if (window.location.pathname === nextPath) return
    if (replace) {
      window.history.replaceState(null, '', nextPath)
      return
    }
    window.history.pushState(null, '', nextPath)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onPopState = () => setPage(getPageFromPath(window.location.pathname))
    window.addEventListener('popstate', onPopState)
    const expectedPath = PAGE_TO_PATH[page]
    if (window.location.pathname !== expectedPath) {
      window.history.replaceState(null, '', expectedPath)
    }
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    setAppointments(prev => updateAppointmentStatuses(prev))
  }, [appointments])

  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(null), 2400)
    return () => clearTimeout(timer)
  }, [toastMessage])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    navigateTo('otp')
  }

  const handleBookDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc)
    navigateTo('book')
  }

  const handleBookSlot = ({ doctorId, dateKey, slot }: SlotBooking) => {
    setBookingsByDoctor(prev => {
      const doctorBookings = prev[doctorId] ?? {}
      const slotsForDate = doctorBookings[dateKey] ?? []
      if (slotsForDate.includes(slot)) return prev
      return {
        ...prev,
        [doctorId]: {
          ...doctorBookings,
          [dateKey]: [...slotsForDate, slot],
        },
      }
    })

    const doctorName =
      selectedDoctor?.id === doctorId
        ? selectedDoctor.name
        : `Dr. ${doctorId}`

    setAppointments(prev => {
      const alreadyExists = prev.some(
        appointment =>
          appointment.doctorId === String(doctorId) &&
          appointment.date === dateKey &&
          appointment.time === slot &&
          appointment.status !== 'canceled',
      )
      if (alreadyExists) return prev

      const nextTokenNo = (prev.reduce((max, item) => Math.max(max, item.tokenNo), 0) || 0) + 1
      return [
        ...prev,
        {
          id: createAppointmentId(),
          doctorId: String(doctorId),
          doctorName,
          date: dateKey,
          time: slot,
          tokenNo: nextTokenNo,
          paymentStatus: 'unpaid',
          status: 'upcoming',
        },
      ]
    })
  }

  const handleBottomNav = (key: BottomNavKey) => {
    if (key === 'find-doctor') navigateTo('dashboard')
    if (key === 'appointments') navigateTo('appointments')
  }

  const refreshAppointmentLifecycle = () => {
    setAppointments(prev => updateAppointmentStatuses(prev))
  }

  const selectedAppointment = appointments.find(item => item.id === selectedAppointmentId) ?? null

  const handleMakePayment = (appointmentId: string) => {
    setAppointments(prev => prev.map(item => {
      if (item.id !== appointmentId || item.status !== 'upcoming') return item
      return { ...item, paymentStatus: 'paid' }
    }))
  }

  const handleReschedule = (next: { date: string; time: string }) => {
    setAppointments(prev => prev.map(item => {
      if (item.id !== selectedAppointmentId || item.status !== 'upcoming') return item
      return { ...item, date: next.date, time: next.time, status: 'upcoming' }
    }))
    navigateTo('appointments')
  }

  const handleCancelAppointment = () => {
    setAppointments(prev => prev.map(item => {
      if (item.id !== selectedAppointmentId || item.status !== 'upcoming') return item
      return { ...item, status: 'canceled' }
    }))
    setToastMessage('Appointment canceled successfully')
    navigateTo('appointments')
  }

  if (page === 'otp') return (
    <OTPPage
      onVerify={() => navigateTo('dashboard')}
      onBack={() => navigateTo('login')}
      email={email}
    />
  )

  if (page === 'dashboard') return (
    <DashboardPage
      onBookDoctor={handleBookDoctor}
      onOpenAppointments={() => navigateTo('appointments')}
    />
  )

  if (page === 'book') return (
    <BookAppointment
      onBack={() => navigateTo('dashboard')}
      doctor={selectedDoctor ?? undefined}
      bookedSlots={bookingsByDoctor[selectedDoctor?.id ?? 1] ?? {}}
      onBook={handleBookSlot}
    />
  )

  if (page === 'appointments') return (
    <AppointmentsPage
      appointments={appointments}
      toastMessage={toastMessage}
      onBack={() => navigateTo('dashboard')}
      onOpenDetails={appointmentId => {
        setSelectedAppointmentId(appointmentId)
        navigateTo('appointment-details')
      }}
      onOpenReschedule={appointmentId => {
        setSelectedAppointmentId(appointmentId)
        navigateTo('reschedule-appointment')
      }}
      onMakePayment={handleMakePayment}
      onRefreshLifecycle={refreshAppointmentLifecycle}
      onNavigate={handleBottomNav}
    />
  )

  if (page === 'appointment-details') return (
    <AppointmentDetailsPage
      appointment={selectedAppointment}
      onBack={() => navigateTo('appointments')}
      onOpenReschedule={() => navigateTo('reschedule-appointment')}
      onCancelAppointment={handleCancelAppointment}
      onMakePayment={() => selectedAppointment && handleMakePayment(selectedAppointment.id)}
      onNavigate={handleBottomNav}
    />
  )

  if (page === 'reschedule-appointment') return (
    <RescheduleAppointmentPage
      appointment={selectedAppointment}
      onBack={() => navigateTo('appointments')}
      onBooked={handleReschedule}
      onNavigate={handleBottomNav}
    />
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 p-6 relative overflow-hidden">
      <div className="hero-blob" style={{ width: 500, height: 500, background: '#7dd3f8', top: -120, left: -120 }} />
      <div className="hero-blob" style={{ width: 400, height: 400, background: '#38bdf8', bottom: -80, right: -80, animationDelay: '-6s' }} />
      <div className="hero-blob" style={{ width: 300, height: 300, background: '#bae6fd', top: '40%', left: '55%', animationDelay: '-10s' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(14,165,233,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,.05) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="anim-card-in relative z-10 w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: 600, boxShadow: '0 32px 80px rgba(14,165,233,.2),0 8px 32px rgba(0,0,0,.08)' }}>

        {/* LEFT hero */}
        <div className="hero-panel hidden lg:flex flex-col justify-between w-[44%] p-14">
          <div className="hero-blob" style={{ width: 300, height: 300, background: 'rgba(255,255,255,.15)', top: -80, right: -80 }} />
          <div className="hero-blob" style={{ width: 220, height: 220, background: 'rgba(255,255,255,.1)', bottom: -60, left: -60, animationDelay: '-5s' }} />

          <div className="relative z-10">
            <div className="anim-logo-float w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,.2)', border: '1.5px solid rgba(255,255,255,.35)', backdropFilter: 'blur(8px)' }}>
              <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
                <path d="M20 6C12.268 6 6 12.268 6 20s6.268 14 14 14 14-6.268 14-14S27.732 6 20 6z" fill="rgba(255,255,255,.3)" />
                <path d="M20 10v10M15 15h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="20" cy="20" r="12" stroke="rgba(255,255,255,.6)" strokeWidth="1.5" />
              </svg>
            </div>
            <p className="mt-3 text-white/60 text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: 'DM Sans' }}>Login App</p>
          </div>

          <div className="relative z-10">
            <h2 className="text-white font-bold leading-tight" style={{ fontFamily: 'Sora', fontSize: 38, textShadow: '0 2px 20px rgba(0,0,0,.15)' }}>
              Your health,<br />our priority 🩺
            </h2>
            <p className="mt-4 text-white/70 text-sm leading-relaxed" style={{ maxWidth: 260 }}>
              Connect with top-rated specialists, book appointments instantly, and manage your health records in one place.
            </p>
            <div className="mt-8 flex gap-8">
              {[{ n: '500+', l: 'Doctors' }, { n: '50K+', l: 'Patients' }, { n: '4.9★', l: 'Rating' }].map(s => (
                <div key={s.l}>
                  <p className="text-white font-bold text-2xl" style={{ fontFamily: 'Sora' }}>{s.n}</p>
                  <p className="text-white/55 text-xs mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.24)', backdropFilter: 'blur(6px)' }}>
              <div className="flex">
                {['#f97316', '#06b6d4', '#a855f7', '#22c55e'].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-sky-600 flex items-center justify-center text-white text-xs font-bold" style={{ background: c, marginLeft: i === 0 ? 0 : -8 }}>
                    {['P','R','S','M'][i]}
                  </div>
                ))}
              </div>
              <p className="text-white/75 text-xs"><span className="text-white font-semibold">50,000+</span> happy patients</p>
            </div>
          </div>
        </div>

        {/* RIGHT form */}
        <div className="flex-1 flex flex-col justify-center px-10 py-12 lg:px-14" style={{ background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(20px)' }}>
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center">
              <svg viewBox="0 0 40 40" width="20" height="20" fill="none">
                <path d="M20 10v10M15 15h10" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-bold text-cyan-600" style={{ fontFamily: 'Sora', fontSize: 18 }}>Login App</span>
          </div>

          <div className="opacity-0 anim-fade-up d1">
            <h1 className="font-bold text-3xl" style={{ fontFamily: 'Sora', color: '#111827' }}>Login</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back! Sign in to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 max-w-sm space-y-5">
            <div className="opacity-0 anim-fade-up d2">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Mobile / Email</label>
              <input
                type="text"
                className="inp"
                placeholder="login with Mobile or Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="opacity-0 anim-fade-up d3 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setRemember(!remember)}
                  className="w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
                  style={{ borderColor: remember ? 'var(--cyan)' : '#d1d5db', background: remember ? 'var(--cyan)' : 'white' }}
                >
                  {remember && <svg viewBox="0 0 12 12" width="10" height="10" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
                <span className="text-sm text-gray-600">Remember Me</span>
              </label>
              <button type="button" className="text-sm font-semibold" style={{ color: 'var(--cyan)' }}>Forgot Password</button>
            </div>

            <div className="opacity-0 anim-fade-up d4">
              <button type="submit" disabled={loading} className="btn-cyan w-full py-3.5 text-sm">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.4)" strokeWidth="4" />
                      <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    Sending OTP…
                  </span>
                ) : 'Login'}
              </button>
            </div>

            <div className="opacity-0 anim-fade-up d5 flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <span className="text-xs text-gray-400 whitespace-nowrap">Or login With</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            <div className="opacity-0 anim-fade-up d6">
              <button type="button" className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border-2 text-sm font-semibold text-gray-700 transition-all hover:border-cyan-400 hover:shadow-md hover:-translate-y-0.5" style={{ borderColor: '#e5e7eb', background: 'white', fontFamily: 'DM Sans' }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="opacity-0 anim-fade-up d7 text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <a href="#" className="font-semibold" style={{ color: 'var(--cyan)' }}>Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
