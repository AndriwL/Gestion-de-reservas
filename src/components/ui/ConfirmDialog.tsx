import { Modal } from './Modal'
import { Button } from './Button'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Eliminar',
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title="" widthClass="max-w-sm">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-coral-light text-coral">
          <AlertTriangle size={20} />
        </div>
        <h3 className="font-display text-base font-semibold text-ink-900">{title}</h3>
        <p className="text-sm text-ink-500">{description}</p>
        <div className="mt-2 flex w-full gap-2">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} disabled={loading}>
            {loading ? 'Eliminando…' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
