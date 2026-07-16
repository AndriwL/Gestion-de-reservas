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
    teal: 'bg-gradient-to-br from-teal-400 to-cyan-500 text-ink-950 shadow-lg shadow-cyan-500/20',
    amber: 'bg-gradient-to-br from-amber-300 to-orange-500 text-amber-950 shadow-lg shadow-orange-500/20',
    rose: 'bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-lg shadow-rose-500/20',
    ink: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20',
  }

  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(14,37,48,0.12)]">
      <div className={`mb-4 grid h-11 w-11 place-items-center rounded-xl ${accentMap[accent]} transition-transform duration-300 group-hover:scale-105`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-extrabold text-ink-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  )
}
