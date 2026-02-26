'use client'

import { useEffect, useMemo, useState } from 'react'
import AppointmentCard from './appointments/AppointmentCard'
import BottomNav, { type BottomNavKey } from './appointments/BottomNav'
import EmptyState from './appointments/EmptyState'
import PrimaryButton from './appointments/PrimaryButton'
import TabSwitcher from './appointments/TabSwitcher'
import type { Appointment, AppointmentStatusTab } from './appointments/types'

interface AppointmentsPageProps {
  appointments: Appointment[]
  toastMessage: string | null
  onBack: () => void
  onOpenDetails: (appointmentId: string) => void
  onOpenReschedule: (appointmentId: string) => void
  onMakePayment: (appointmentId: string) => void
  onRefreshLifecycle: () => void
  onNavigate: (key: BottomNavKey) => void
}

export default function AppointmentsPage({
  appointments,
  toastMessage,
  onBack,
  onOpenDetails,
  onOpenReschedule,
  onMakePayment,
  onRefreshLifecycle,
  onNavigate,
}: AppointmentsPageProps) {
  const [activeTab, setActiveTab] = useState<AppointmentStatusTab>('upcoming')

  useEffect(() => {
    onRefreshLifecycle()
  }, [onRefreshLifecycle])

  const activeList = useMemo(
    () => appointments.filter(appointment => appointment.status === activeTab),
    [appointments, activeTab],
  )

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)' }}>
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-white px-4 py-4 md:px-6" style={{ borderColor: '#e5e7eb' }}>
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-cyan-50">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#111827" strokeWidth="2.4" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Sora' }}>Appointments</h1>
      </header>

      {toastMessage && (
        <div className="fixed right-4 top-20 z-40 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toastMessage}
        </div>
      )}

      <main className="mx-auto max-w-3xl px-4 py-5 md:px-6">
        <TabSwitcher active={activeTab} onChange={setActiveTab} />

        {activeTab === 'upcoming' && activeList.length === 0 ? (
          <EmptyState onBook={() => onNavigate('find-doctor')} />
        ) : activeList.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-sm" style={{ color: 'var(--muted)', border: '1px solid #eaf0f5' }}>
            No {activeTab} appointments.
          </div>
        ) : (
          <div className="space-y-4">
            {activeList.map(appointment => {
              const canEdit = appointment.status === 'upcoming'
              return (
                <div key={appointment.id} className="space-y-3">
                  <AppointmentCard
                    appointment={appointment}
                    onView={() => onOpenDetails(appointment.id)}
                    onReschedule={() => onOpenReschedule(appointment.id)}
                    onQuickQuery={() => window.alert('Quick Query action')}
                  />
                  <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4" style={{ border: '1px solid #eaf0f5' }}>
                    <p className="text-xs md:text-sm" style={{ color: 'var(--muted)' }}>
                      Reduce your waiting time and visiting time by paying the consulting fee upfront
                    </p>
                    <PrimaryButton
                      className="whitespace-nowrap px-4 py-2.5 text-xs md:text-sm"
                      disabled={!canEdit}
                      onClick={() => onMakePayment(appointment.id)}
                    >
                      Make Payment
                    </PrimaryButton>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <BottomNav active="appointments" onNavigate={onNavigate} />
    </div>
  )
}
