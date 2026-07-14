import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, FileText, CalendarCheck, AlertTriangle, CarIcon, User, Coins, ArrowUpRight } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

interface StatCardData {
  label: string
  value: number | null
  icon: typeof Users
  to: string
  hint: string
}

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number | null>>({
    cliente: null,
    reserva: null,
    cotizacion: null,
    incidencia: null,
    vehiculo: null,
    pago: null,
    conductor: null,
  })

  useEffect(() => {
    async function loadCounts() {
      const tables = ['cliente', 'reserva', 'cotizacion', 'incidencia', 'vehiculo', 'pago', 'conductor']
      const results = await Promise.all(
        tables.map((t) => supabase.from(t).select('*', { count: 'exact', head: true })),
      )
      const next: Record<string, number | null> = {}
      tables.forEach((t, i) => {
        next[t] = results[i].count ?? 0
      })
      setCounts(next)
    }
    void loadCounts()
  }, [])

  const cards: StatCardData[] = [
    { label: 'Clientes registrados', value: counts.cliente, icon: Users, to: '/dashboard/clientes', hint: 'Total en el sistema' },
    { label: 'Reservas', value: counts.reserva, icon: CalendarCheck, to: '/dashboard/reservas', hint: 'Todas las reservas' },
    { label: 'Cotizaciones', value: counts.cotizacion, icon: FileText, to: '/dashboard/cotizaciones', hint: 'Pendientes y aprobadas' },
    { label: 'Incidencias', value: counts.incidencia, icon: AlertTriangle, to: '/dashboard/incidencias', hint: 'Registradas en servicios' },
    { label: 'Vehículos', value: counts.vehiculo, icon: CarIcon, to: '/dashboard/vehiculos', hint: 'Registrados' },
    { label: 'Conductores', value: counts.conductor, icon: User, to: '/dashboard/conductores', hint: 'Registrados' },
    { label: 'Pagos', value: counts.pago, icon: Coins, to: '/dashboard/pagos', hint: 'Registrados' },
  ]

  const cardColors = [
    'from-cyan-500 via-cyan-600 to-blue-600 shadow-cyan-600/20',
    'from-blue-500 via-indigo-500 to-violet-600 shadow-indigo-500/20',
    'from-teal-500 via-emerald-500 to-cyan-600 shadow-emerald-500/20',
    'from-fuchsia-500 via-purple-500 to-indigo-600 shadow-purple-500/20',
    'from-amber-400 via-orange-500 to-rose-500 shadow-orange-500/20',
    'from-sky-500 via-blue-500 to-indigo-600 shadow-blue-500/20',
    'from-emerald-500 via-teal-500 to-cyan-600 shadow-teal-500/20',
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-700">Centro de control</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-slate-800">Panel general</h1>
        <p className="mt-1 text-sm text-slate-500">Resumen rápido de la operación. Elige un módulo del menú para administrar cada proceso.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, index) => (
          <Link
            key={c.label}
            to={c.to}
            className={`group relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br p-5 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl ${cardColors[index]}`}
          >
            <div className="absolute -right-5 -top-6 h-24 w-24 rounded-full bg-white/15" />
            <div className="relative flex items-center justify-between">
              <div className="rounded-xl bg-white/20 p-2.5 text-white ring-1 ring-white/20"><c.icon size={19} /></div>
              <span className="font-mono text-3xl font-bold text-white">
                {c.value === null ? '—' : c.value}
              </span>
            </div>
            <p className="relative mt-5 text-sm font-bold text-white">{c.label}</p>
            <div className="relative mt-1 flex items-center justify-between text-xs text-cyan-50"><span>{c.hint}</span><ArrowUpRight size={16} /></div>
          </Link>
        ))}
      </div>


    </div>
  )
}
