'use client'

import { useState } from 'react'
import type { Appointment } from './types'

interface AppointmentCardProps {
  appointment: Appointment
  onView: () => void
  onReschedule: () => void
  onQuickQuery: () => void
}

const STATUS_STYLES = {
  upcoming: { bg: '#e0f2fe', color: '#0369a1', label: 'Upcoming' },
  completed: { bg: '#e8f5ee', color: '#166534', label: 'Completed' },
  canceled: { bg: '#fee2e2', color: '#b91c1c', label: 'Canceled' },
} as const

export default function AppointmentCard({
  appointment,
  onView,
  onReschedule,
  onQuickQuery,
}: AppointmentCardProps) {
  const [openMenu, setOpenMenu] = useState(false)
  const canEdit = appointment.status === 'upcoming'
  const statusStyle = STATUS_STYLES[appointment.status]

  return (
    <div className="rounded-2xl bg-white p-4" style={{ border: '1px solid #eaf0f5', boxShadow: '0 10px 22px rgba(11, 64, 84, 0.06)' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold text-white" style={{ background: 'linear-gradient(135deg,#3bbfce,#22a3b4)' }}>
            {appointment.doctorName.trim().split(/\s+/)[1]?.[0] ?? appointment.doctorName[0]}
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ fontFamily: 'Sora' }}>{appointment.doctorName}</h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Token #{appointment.tokenNo}</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{appointment.date} • {appointment.time}</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-xs font-semibold text-amber-600">
                {appointment.paymentStatus === 'paid' ? 'Paid' : 'Not paid'}
              </p>
              <span
                className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{ background: statusStyle.bg, color: statusStyle.color }}
              >
                {statusStyle.label}
              </span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setOpenMenu(prev => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
            aria-label="More options"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ color: '#6b7280' }}>
              <circle cx="5" cy="12" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="19" cy="12" r="1.8" />
            </svg>
          </button>
          {openMenu && (
            <div className="absolute right-0 z-20 mt-2 w-40 rounded-xl bg-white p-1" style={{ border: '1px solid #e5e7eb', boxShadow: '0 10px 24px rgba(0,0,0,.12)' }}>
              <button onClick={onView} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-cyan-50">View</button>
              <button
                onClick={onReschedule}
                disabled={!canEdit}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-cyan-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
              >
                Reschedule
              </button>
              <button onClick={onQuickQuery} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-cyan-50">Quick Query</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
