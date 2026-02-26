import type { DoctorProfile } from './types'

interface DoctorCardProps {
  doctor: DoctorProfile
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl bg-white p-4 md:p-5"
      style={{ border: '1px solid #eaf0f5', boxShadow: '0 10px 22px rgba(11, 64, 84, 0.06)' }}
    >
      {doctor.image ? (
        <img
          src={doctor.image}
          alt={doctor.name}
          className="h-16 w-16 rounded-2xl object-cover md:h-20 md:w-20"
        />
      ) : (
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white md:h-20 md:w-20"
          style={{ background: 'linear-gradient(135deg,#3bbfce,#22a3b4)' }}
        >
          {doctor.name.trim().split(/\s+/)[1]?.[0] ?? doctor.name[0]}
        </div>
      )}
      <div className="min-w-0">
        <h2 className="text-lg font-bold" style={{ fontFamily: 'Sora' }}>{doctor.name}</h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {doctor.specialization} • {doctor.location}
        </p>
        <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--cyan-dark)' }}>
          {doctor.degree}
        </p>
      </div>
    </div>
  )
}
