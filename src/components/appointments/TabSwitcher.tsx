import type { AppointmentStatusTab } from './types'

interface TabSwitcherProps {
  active: AppointmentStatusTab
  onChange: (tab: AppointmentStatusTab) => void
}

const TABS: { key: AppointmentStatusTab; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'canceled', label: 'Canceled' },
]

export default function TabSwitcher({ active, onChange }: TabSwitcherProps) {
  return (
    <div className="mb-4 flex rounded-xl bg-cyan-50 p-1">
      {TABS.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all"
          style={{
            background: active === tab.key ? 'white' : 'transparent',
            color: active === tab.key ? 'var(--cyan-dark)' : 'var(--muted)',
            boxShadow: active === tab.key ? '0 3px 8px rgba(0,0,0,.08)' : 'none',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
