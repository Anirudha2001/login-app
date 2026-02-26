export type AppointmentStatusTab = 'upcoming' | 'completed' | 'canceled'
export type PaymentStatus = 'unpaid' | 'paid'

export type DoctorProfile = {
  id: number
  name: string
  specialization: string
  location: string
  degree: string
  image?: string
}

export type Appointment = {
  id: string
  doctorId: string
  doctorName: string
  tokenNo: number
  time: string
  date: string
  paymentStatus: PaymentStatus
  status: AppointmentStatusTab
}

export const MOCK_DOCTOR: DoctorProfile = {
  id: 1,
  name: 'Dr. Kumar Das',
  specialization: 'Cardiologist',
  location: 'Dombivli',
  degree: 'MBBS, MD (Cardiology)',
}

export const MOCK_APPOINTMENT: Appointment = {
  id: 'a1',
  doctorId: 'd1',
  doctorName: 'Dr. Kumar Das',
  tokenNo: 12,
  time: '12:30 PM',
  date: '2026-02-26',
  paymentStatus: 'unpaid',
  status: 'upcoming',
}
