import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  widthClass?: string
}

export function Modal({ open, onClose, title, subtitle, children, widthClass = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/50 p-4 py-10 backdrop-blur-sm">
      <div className={`w-full ${widthClass} rounded-2xl bg-white shadow-xl`}>
        <div className="flex items-start justify-between border-b border-ink-50 px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-ink-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full p-1.5 text-ink-400 hover:bg-ink-50 hover:text-ink-700"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
