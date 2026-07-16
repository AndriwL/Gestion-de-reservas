import type { LucideIcon } from 'lucide-react'

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = 'teal',
}: {
  icon: LucideIcon
  label: string
  value: string | number
  accent?: 'teal' | 'amber' | 'rose' | 'ink'
}) {
  const accentMap = {
    teal: 'bg-teal-50 text-teal-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    ink: 'bg-ink-950/5 text-ink-900',
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-panel">
      <div className={`mb-4 grid h-10 w-10 place-items-center rounded-xl ${accentMap[accent]}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-extrabold text-ink-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  )
}
