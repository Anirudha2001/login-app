'use client'

import { useMemo, useState } from 'react'
import BottomNav, { type BottomNavKey } from './appointments/BottomNav'
import DateSelector, { type DateOption } from './appointments/DateSelector'
import DoctorCard from './appointments/DoctorCard'
import PrimaryButton from './appointments/PrimaryButton'
import SectionCard from './appointments/SectionCard'
import TimeSlotGrid from './appointments/TimeSlotGrid'
import type { Appointment } from './appointments/types'
import { MOCK_DOCTOR } from './appointments/types'
import { formatAppointmentDate, parseAppointmentDateTime } from '@/utils/appointmentLifecycle'

interface RescheduleAppointmentPageProps {
  appointment: Appointment | null
  onBack: () => void
  onBooked: (next: { date: string; time: string }) => void
  onNavigate: (key: BottomNavKey) => void
}

const MORNING_SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM']
const EVENING_SLOTS = ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM']

function formatDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function makeDates(): DateOption[] {
  const now = new Date()
  return Array.from({ length: 10 }, (_, i) => {
    const date = new Date(now)
    date.setDate(now.getDate() + i)
    return {
      id: formatDateKey(date),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    }
  })
}

export default function RescheduleAppointmentPage({
  appointment,
  onBack,
  onBooked,
  onNavigate,
}: RescheduleAppointmentPageProps) {
  const dates = useMemo(() => makeDates(), [])
  const [selectedDateId, setSelectedDateId] = useState(dates[0]?.id ?? '')
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const canEdit = appointment?.status === 'upcoming'
  const selectedDate = dates.find(d => d.id === selectedDateId)?.id ?? ''

  const buildDisabledSlots = (baseDisabled: string[], slots: string[]) => {
    const disabled = new Set(baseDisabled)
    if (!selectedDate) return Array.from(disabled)
    const now = new Date()
    slots.forEach(slot => {
      const slotTime = parseAppointmentDateTime(selectedDate, slot)
      if (slotTime && slotTime <= now) disabled.add(slot)
    })
    return Array.from(disabled)
  }

  const selectedDateText = useMemo(() => {
    const current = dates.find(d => d.id === selectedDateId)
    if (!current || !appointment) return '--'
    return `${current.day}, ${current.date} ${current.month} • ${selectedSlot ?? appointment.time}`
  }, [dates, selectedDateId, selectedSlot, appointment])

  if (!appointment) {
    return (
      <div className="min-h-screen pb-24" style={{ background: 'var(--bg)' }}>
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-white px-4 py-4 md:px-6" style={{ borderColor: '#e5e7eb' }}>
          <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-cyan-50">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#111827" strokeWidth="2.4" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Sora' }}>Reschedule Appointment</h1>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-5 md:px-6">
          <SectionCard>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Appointment not found.</p>
          </SectionCard>
        </main>
        <BottomNav active="appointments" onNavigate={onNavigate} />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)' }}>
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-white px-4 py-4 md:px-6" style={{ borderColor: '#e5e7eb' }}>
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-cyan-50">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#111827" strokeWidth="2.4" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Sora' }}>Reschedule Appointment</h1>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-5 md:px-6">
        <DoctorCard doctor={MOCK_DOCTOR} />

        <SectionCard>
          <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Consulting Time</p>
          <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--cyan-dark)' }}>
            {formatAppointmentDate(appointment.date)} • {appointment.time}
          </p>
        </SectionCard>

        <SectionCard title="Choose Another Time">
          <DateSelector dates={dates} selectedDateId={selectedDateId} onSelect={dateId => {
            setSelectedDateId(dateId)
            setSelectedSlot(null)
          }} />
        </SectionCard>

        <SectionCard>
          <p className="mb-4 text-sm font-semibold" style={{ color: 'var(--cyan-dark)' }}>
            {selectedDateText}
          </p>
          <div className="space-y-5">
            <TimeSlotGrid
              title="Morning Slots"
              slots={MORNING_SLOTS}
              selectedSlot={selectedSlot}
              disabledSlots={buildDisabledSlots(['09:30 AM', '11:00 AM'], MORNING_SLOTS)}
              onSelect={setSelectedSlot}
            />
            <TimeSlotGrid
              title="Evening Slots"
              slots={EVENING_SLOTS}
              selectedSlot={selectedSlot}
              disabledSlots={buildDisabledSlots(['04:30 PM', '06:00 PM'], EVENING_SLOTS)}
              onSelect={setSelectedSlot}
            />
          </div>
        </SectionCard>
      </main>

      <div className="fixed inset-x-0 bottom-20 z-20 px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <PrimaryButton
            className="w-full"
            onClick={() => selectedSlot && onBooked({ date: selectedDateId, time: selectedSlot })}
            disabled={!selectedSlot || !canEdit}
          >
            Book Appointment
          </PrimaryButton>
        </div>
      </div>

      <BottomNav active="appointments" onNavigate={onNavigate} />
    </div>
  )
}
