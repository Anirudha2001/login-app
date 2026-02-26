'use client'

import { useMemo, useState } from 'react'
import ConfirmModal from './ConfirmModal'
import BottomNav, { type BottomNavKey } from './appointments/BottomNav'
import DoctorCard from './appointments/DoctorCard'
import OutlineButton from './appointments/OutlineButton'
import PrimaryButton from './appointments/PrimaryButton'
import SectionCard from './appointments/SectionCard'
import type { Appointment } from './appointments/types'
import { MOCK_DOCTOR } from './appointments/types'
import { formatAppointmentDate } from '@/utils/appointmentLifecycle'

interface AppointmentDetailsPageProps {
  appointment: Appointment | null
  onBack: () => void
  onOpenReschedule: () => void
  onCancelAppointment: () => void
  onMakePayment: () => void
  onNavigate: (key: BottomNavKey) => void
}

export default function AppointmentDetailsPage({
  appointment,
  onBack,
  onOpenReschedule,
  onCancelAppointment,
  onMakePayment,
  onNavigate,
}: AppointmentDetailsPageProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)

  const statusLabel = useMemo(() => {
    if (!appointment) return 'Unknown'
    if (appointment.status === 'completed') return 'Completed'
    if (appointment.status === 'canceled') return 'Canceled'
    return 'Waiting'
  }, [appointment])

  const canEdit = appointment?.status === 'upcoming'

  if (!appointment) {
    return (
      <div className="min-h-screen pb-24" style={{ background: 'var(--bg)' }}>
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-white px-4 py-4 md:px-6" style={{ borderColor: '#e5e7eb' }}>
          <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-cyan-50">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#111827" strokeWidth="2.4" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Sora' }}>Appointments Details</h1>
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
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Sora' }}>Appointments Details</h1>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-5 md:px-6">
        <DoctorCard doctor={MOCK_DOCTOR} />

        <SectionCard title="Appointment Status">
          <p className="text-base font-semibold" style={{ color: appointment.status === 'canceled' ? '#b91c1c' : appointment.status === 'completed' ? '#166534' : 'var(--cyan-dark)' }}>
            {statusLabel}
          </p>
        </SectionCard>

        <SectionCard title="Patient Details">
          <div className="space-y-2 text-sm">
            <p><span style={{ color: 'var(--muted)' }}>Full Name:</span> Priya Sharma</p>
            <p><span style={{ color: 'var(--muted)' }}>Age:</span> 30</p>
            <p><span style={{ color: 'var(--muted)' }}>Weight:</span> 62 kg</p>
            <p><span style={{ color: 'var(--muted)' }}>Problem:</span> Mild chest discomfort during exercise.</p>
          </div>
        </SectionCard>

        <SectionCard title="Live Tracking">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            15 Patient Consulting expected consulting time 8:20 PM
          </p>
          <div className="mt-4 flex gap-3">
            <OutlineButton onClick={onOpenReschedule} className="flex-1" disabled={!canEdit}>Reschedule</OutlineButton>
            <OutlineButton onClick={() => setIsCancelModalOpen(true)} className="flex-1" disabled={!canEdit}>Cancel</OutlineButton>
          </div>
        </SectionCard>

        <SectionCard title="Payment">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Reduce your waiting time and visiting time by paying the consulting fee upfront.
          </p>
          <PrimaryButton className="mt-3 w-full" disabled={!canEdit} onClick={onMakePayment}>Make Payment</PrimaryButton>
        </SectionCard>

        <SectionCard>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Token #{appointment.tokenNo} • {formatAppointmentDate(appointment.date)} • {appointment.time}
          </p>
        </SectionCard>
      </main>

      <BottomNav active="appointments" onNavigate={onNavigate} />

      <ConfirmModal
        isOpen={isCancelModalOpen}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        cancelText="Cancel"
        confirmText="Confirm"
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => {
          onCancelAppointment()
          setIsCancelModalOpen(false)
        }}
      />
    </div>
  )
}
