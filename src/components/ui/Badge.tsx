interface BadgeProps {
  label: string
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
}

const tones: Record<string, string> = {
  neutral: 'bg-ink-50 text-ink-500',
  success: 'bg-teal-light text-teal',
  warning: 'bg-amber-light text-amber',
  danger: 'bg-coral-light text-coral',
  info: 'bg-ink-100 text-ink-700',
}

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${tones[tone]}`}>
      {label.replace(/_/g, ' ')}
    </span>
  )
}
