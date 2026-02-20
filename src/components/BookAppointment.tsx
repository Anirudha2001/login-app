'use client'

import { useState } from 'react'

interface BookAppointmentProps {
  onBack: () => void
  doctor?: {
    id: number
    name: string
    spec: string
    color: string
  }
}

const SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getDates() {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return {
      day: DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1],
      date: d.getDate(),
      month: d.toLocaleString('default', { month: 'short' }),
      full: d,
    }
  })
}

export default function BookAppointment({ onBack, doctor }: BookAppointmentProps) {
  const dates = getDates()
  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [booked, setBooked] = useState(false)

  const doc = doctor ?? {
    id: 1,
    name: 'Dr. Kumar Das',
    spec: 'Ophthalmologist',
    color: '#0ea5e9',
  }

  const handleBook = async () => {
    if (!selectedSlot) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1600))
    setLoading(false)
    setBooked(true)
  }

  if (booked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center max-w-sm px-8 anim-card-in">
          <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6" style={{ background: 'var(--green-light)' }}>
            <svg viewBox="0 0 48 48" width="44" height="44" fill="none">
              <circle cx="24" cy="24" r="22" fill="var(--green)" opacity=".15" />
              <path d="M14 24l8 8 14-14" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-bold text-2xl mb-2" style={{ fontFamily: 'Sora', color: '#111827' }}>Appointment Booked!</h2>
          <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>
            Your appointment with <strong style={{ color: '#111827' }}>{doc.name}</strong>
          </p>
          <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
            on <strong style={{ color: '#111827' }}>{dates[selectedDate].day}, {dates[selectedDate].date} {dates[selectedDate].month}</strong> at <strong style={{ color: '#111827' }}>{selectedSlot}</strong> is confirmed.
          </p>
          <button onClick={onBack} className="btn-cyan px-8 py-3 text-sm" style={{ width: 'auto', display: 'inline-block' }}>
            Back to Doctors
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* Top cyan header */}
      <div className="flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0ea5e9, #22a3b4)', padding: '20px 32px 80px' }}>
        <div className="flex items-center gap-3 max-w-5xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-all hover:bg-white/20"
            style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <h1 className="font-bold text-white text-xl" style={{ fontFamily: 'Sora' }}>Book Appointment</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 -mt-14 pb-10">

        {/* Doctor Card */}
        <div className="anim-fade-up d1 bg-white rounded-3xl p-6 mb-6 flex items-center gap-5" style={{ boxShadow: '0 4px 24px rgba(0,0,0,.08)', border: '1.5px solid #f0f0f0' }}>
          <div className="flex-1">
            <h2 className="font-bold text-xl" style={{ fontFamily: 'Sora', color: '#111827' }}>{doc.name}</h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{doc.spec}</p>
            <p className="text-sm font-semibold mt-1" style={{ color: 'var(--cyan)' }}>MBBS, MS (Surgeon)</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Fellow of Sanskara Netralaya, Chennai</p>
          </div>
          <div
            className="w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-bold text-3xl"
            style={{ background: `linear-gradient(135deg, ${doc.color}, ${doc.color}bb)` }}
          >
            {doc.name.split(' ')[1][0]}
          </div>
        </div>

        {/* Stats row */}
        <div className="anim-fade-up d2 grid grid-cols-4 gap-4 mb-6">
          {[
            { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', val: '5,000+', label: 'patients' },
            { icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', val: '10+', label: 'years exp..' },
            { icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', val: '4.8', label: 'rating' },
            { icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', val: '4,942', label: 'reviews' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 text-center" style={{ boxShadow: '0 2px 12px rgba(0,0,0,.06)', border: '1.5px solid #f0f0f0' }}>
              <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: 'var(--cyan-light)' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--cyan)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon} />
                </svg>
              </div>
              <p className="font-bold text-base" style={{ fontFamily: 'Sora', color: 'var(--cyan)' }}>{s.val}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT col */}
          <div className="space-y-5">
            {/* About */}
            <div className="anim-fade-up d3 bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,.06)', border: '1.5px solid #f0f0f0' }}>
              <h3 className="font-bold text-base mb-3" style={{ fontFamily: 'Sora', color: '#111827' }}>About Doctor</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                15+ years of experience in all aspects of {doc.spec.toLowerCase()}, including non-invasive and interventional procedures. Committed to providing compassionate, patient-centered care with the latest techniques.
              </p>
            </div>

            {/* Service & Specialization */}
            <div className="anim-fade-up d4 bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,.06)', border: '1.5px solid #f0f0f0' }}>
              <h3 className="font-bold text-base mb-4" style={{ fontFamily: 'Sora', color: '#111827' }}>Service & Specialization</h3>
              {[
                { label: 'Service', value: 'Medicare' },
                { label: 'Specialization', value: 'Cardiology' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-2.5" style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>{row.label}</span>
                  <span className="text-sm font-semibold" style={{ color: '#374151' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Availability */}
            <div className="anim-fade-up d5 bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,.06)', border: '1.5px solid #f0f0f0' }}>
              <h3 className="font-bold text-base mb-4" style={{ fontFamily: 'Sora', color: '#111827' }}>Availability For Consulting</h3>
              <div className="flex justify-between items-center py-2.5" style={{ borderBottom: '1px solid #f3f4f6' }}>
                <span className="text-sm" style={{ color: 'var(--muted)' }}>Monday to Friday</span>
                <span className="text-sm font-semibold" style={{ color: '#374151' }}>10 AM To 5 PM</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-sm" style={{ color: 'var(--muted)' }}>Saturday</span>
                <span className="text-sm font-semibold" style={{ color: '#374151' }}>10 AM To 1 PM</span>
              </div>
            </div>
          </div>

          {/* RIGHT col — Date & Time picker */}
          <div className="space-y-5">
            {/* Date picker */}
            <div className="anim-fade-up d3 bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,.06)', border: '1.5px solid #f0f0f0' }}>
              <h3 className="font-bold text-base mb-4" style={{ fontFamily: 'Sora', color: '#111827' }}>Select Date</h3>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {dates.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedDate(i); setSelectedSlot(null) }}
                    className="flex flex-col items-center px-3 py-3 rounded-xl flex-shrink-0 transition-all"
                    style={{
                      background: selectedDate === i ? 'var(--cyan)' : '#f9fafb',
                      border: `1.5px solid ${selectedDate === i ? 'var(--cyan)' : 'var(--border)'}`,
                      minWidth: 54,
                    }}
                  >
                    <span className="text-xs font-medium mb-1" style={{ color: selectedDate === i ? 'rgba(255,255,255,.8)' : 'var(--muted)' }}>{d.day}</span>
                    <span className="font-bold text-lg leading-none" style={{ fontFamily: 'Sora', color: selectedDate === i ? 'white' : '#111827' }}>{d.date}</span>
                    <span className="text-xs mt-1" style={{ color: selectedDate === i ? 'rgba(255,255,255,.7)' : 'var(--muted)' }}>{d.month}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time slots */}
            <div className="anim-fade-up d4 bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,.06)', border: '1.5px solid #f0f0f0' }}>
              <h3 className="font-bold text-base mb-4" style={{ fontFamily: 'Sora', color: '#111827' }}>Select Time Slot</h3>
              <div className="grid grid-cols-3 gap-2">
                {SLOTS.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className="py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: selectedSlot === slot ? 'var(--cyan)' : '#f9fafb',
                      border: `1.5px solid ${selectedSlot === slot ? 'var(--cyan)' : 'var(--border)'}`,
                      color: selectedSlot === slot ? 'white' : '#374151',
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Book button */}
            <div className="anim-fade-up d5">
              <button
                onClick={handleBook}
                disabled={!selectedSlot || loading}
                className="btn-cyan w-full py-4 text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.4)" strokeWidth="4" />
                      <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    Booking…
                  </span>
                ) : !selectedSlot ? 'Select a time slot to book' : 'Book Appointment'}
              </button>
              {!selectedSlot && (
                <p className="text-center text-xs mt-2" style={{ color: 'var(--muted)' }}>Choose a date and time slot above</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
