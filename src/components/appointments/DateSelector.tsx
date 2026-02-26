export type DateOption = {
  id: string
  day: string
  date: number
  month: string
}

interface DateSelectorProps {
  dates: DateOption[]
  selectedDateId: string
  onSelect: (dateId: string) => void
}

export default function DateSelector({ dates, selectedDateId, onSelect }: DateSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {dates.map(date => {
        const selected = selectedDateId === date.id
        return (
          <button
            key={date.id}
            onClick={() => onSelect(date.id)}
            className="flex min-w-[64px] flex-shrink-0 flex-col items-center rounded-xl px-3 py-3 transition-all"
            style={{
              background: selected ? 'var(--cyan)' : '#f9fafb',
              border: `1px solid ${selected ? 'var(--cyan)' : '#e5e7eb'}`,
            }}
          >
            <span className="text-xs" style={{ color: selected ? 'rgba(255,255,255,.8)' : 'var(--muted)' }}>{date.day}</span>
            <span className="text-lg font-bold" style={{ fontFamily: 'Sora', color: selected ? 'white' : 'var(--text)' }}>{date.date}</span>
            <span className="text-xs" style={{ color: selected ? 'rgba(255,255,255,.8)' : 'var(--muted)' }}>{date.month}</span>
          </button>
        )
      })}
    </div>
  )
}
