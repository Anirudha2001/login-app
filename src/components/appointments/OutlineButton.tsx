'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

type OutlineButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export default function OutlineButton({ children, className = '', ...props }: OutlineButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:bg-cyan-50 ${className}`}
      style={{ borderColor: 'var(--cyan)', color: 'var(--cyan-dark)' }}
    >
      {children}
    </button>
  )
}
