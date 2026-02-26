type BottomNavKey = 'find-doctor' | 'appointments' | 'records' | 'profile'

interface BottomNavProps {
  active: BottomNavKey
  onNavigate: (key: BottomNavKey) => void
}

const ITEMS: { key: BottomNavKey; label: string; icon: string }[] = [
  { key: 'find-doctor', label: 'Find a Doctor', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { key: 'appointments', label: 'Appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { key: 'records', label: 'Records', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { key: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
]

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-white px-2 py-2 md:px-4" style={{ borderColor: '#e5e7eb' }}>
      <div className="mx-auto grid max-w-3xl grid-cols-4 gap-1">
        {ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className="flex flex-col items-center rounded-xl px-2 py-2 text-[11px] font-semibold transition-all"
            style={{
              background: active === item.key ? '#e0f7fa' : 'transparent',
              color: active === item.key ? 'var(--cyan-dark)' : 'var(--muted)',
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d={item.icon} />
            </svg>
            <span className="mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export type { BottomNavKey }
