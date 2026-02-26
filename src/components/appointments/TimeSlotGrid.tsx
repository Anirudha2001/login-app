interface TimeSlotGridProps {
  title: string
  slots: string[]
  selectedSlot: string | null
  disabledSlots?: string[]
  onSelect: (slot: string) => void
}

export default function TimeSlotGrid({
  title,
  slots,
  selectedSlot,
  disabledSlots = [],
  onSelect,
}: TimeSlotGridProps) {
  const disabled = new Set(disabledSlots)

  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold" style={{ color: 'var(--text)' }}>{title}</h4>
      <div className="grid grid-cols-3 gap-2">
        {slots.map(slot => {
          const isDisabled = disabled.has(slot)
          const isSelected = selectedSlot === slot
          return (
            <button
              key={slot}
              onClick={() => !isDisabled && onSelect(slot)}
              disabled={isDisabled}
              className="rounded-xl px-2 py-2.5 text-xs font-semibold transition-all"
              style={{
                background: isDisabled ? '#f3f4f6' : isSelected ? 'var(--cyan)' : '#f9fafb',
                border: `1px solid ${isSelected ? 'var(--cyan)' : '#e5e7eb'}`,
                color: isDisabled ? '#9ca3af' : isSelected ? 'white' : '#374151',
                textDecoration: isDisabled ? 'line-through' : 'none',
              }}
            >
              {slot}
            </button>
          )
        })}
      </div>
    </div>
  )
}
