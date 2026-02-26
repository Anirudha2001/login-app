'use client'

import OutlineButton from './appointments/OutlineButton'
import PrimaryButton from './appointments/PrimaryButton'

interface ConfirmModalProps {
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onClose: () => void
  isOpen: boolean
}

export default function ConfirmModal({
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onClose,
  isOpen,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 md:p-6" style={{ boxShadow: '0 20px 40px rgba(0,0,0,.2)' }}>
        <h3 className="text-lg font-bold" style={{ fontFamily: 'Sora' }}>{title}</h3>
        <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>{message}</p>
        <div className="mt-5 flex gap-3">
          <OutlineButton onClick={onClose} className="flex-1">{cancelText}</OutlineButton>
          <PrimaryButton onClick={onConfirm} className="flex-1">{confirmText}</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
