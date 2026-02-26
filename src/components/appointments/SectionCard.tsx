import type { ReactNode } from 'react'

interface SectionCardProps {
  title?: string
  children: ReactNode
  className?: string
}

export default function SectionCard({ title, children, className = '' }: SectionCardProps) {
  return (
    <section
      className={`rounded-2xl bg-white p-4 md:p-5 ${className}`}
      style={{ border: '1px solid #eaf0f5', boxShadow: '0 10px 22px rgba(11, 64, 84, 0.06)' }}
    >
      {title && (
        <h3 className="mb-3 text-base font-bold" style={{ fontFamily: 'Sora', color: 'var(--text)' }}>
          {title}
        </h3>
      )}
      {children}
    </section>
  )
}
