import type { Appointment } from '@/components/appointments/types'

function parseDateParts(date: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (!year || !month || !day) return null
  return { year, month, day }
}

function parseTimeParts(time: string): { hour24: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i.exec(time.trim())
  if (!match) return null
  const hour12 = Number(match[1])
  const minute = Number(match[2])
  const meridiem = match[3].toUpperCase()
  if (hour12 < 1 || hour12 > 12 || minute < 0 || minute > 59) return null

  let hour24 = hour12 % 12
  if (meridiem === 'PM') hour24 += 12
  return { hour24, minute }
}

export function parseAppointmentDateTime(date: string, time: string): Date | null {
  const dateParts = parseDateParts(date)
  const timeParts = parseTimeParts(time)
  if (!dateParts || !timeParts) return null
  return new Date(dateParts.year, dateParts.month - 1, dateParts.day, timeParts.hour24, timeParts.minute, 0, 0)
}

export function updateAppointmentStatuses(appointments: Appointment[]): Appointment[] {
  const now = new Date()
  let hasChanges = false

  const updated = appointments.map(appointment => {
    if (appointment.status !== 'upcoming') return appointment
    const appointmentTime = parseAppointmentDateTime(appointment.date, appointment.time)
    if (!appointmentTime) return appointment
    if (appointmentTime >= now) return appointment
    hasChanges = true
    return { ...appointment, status: 'completed' as const }
  })

  return hasChanges ? updated : appointments
}

export function formatAppointmentDate(date: string): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
