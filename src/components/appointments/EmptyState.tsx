import PrimaryButton from './PrimaryButton'

interface EmptyStateProps {
  onBook: () => void
}

export default function EmptyState({ onBook }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-cyan-50">
        <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#22a3b4" strokeWidth="1.5" strokeLinecap="round">
          <rect x="4" y="5" width="16" height="15" rx="3" />
          <path d="M8 3v4M16 3v4M8 11h8" />
        </svg>
      </div>
      <h3 className="text-xl font-bold" style={{ fontFamily: 'Sora' }}>You don&apos;t have an appointment yet</h3>
      <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
        Please click the button below to book an appointment.
      </p>
      <PrimaryButton className="mt-6 min-w-48" onClick={onBook}>Book appointment</PrimaryButton>
    </div>
  )
}
