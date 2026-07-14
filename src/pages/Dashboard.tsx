import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {Users, FileText, CalendarCheck, AlertTriangle, CarIcon, PersonStanding, Cast, User, Coins} from 'lucide-react'
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
    clientes: null,
    reservas: null,
    cotizaciones: null,
    incidencias: null,
    vehiculos: null,
    pagos: null,
    conductores: null,
  })

  useEffect(() => {
    async function loadCounts() {
      const tables = ['clientes', 'reservas', 'cotizaciones', 'incidencias', 'vehiculos', 'pagos', 'conductores' ]
      const results = await Promise.all(
        tables.map((t) => supabase.from(t).select('id', { count: 'exact', head: true })),
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
    { label: 'Clientes registrados', value: counts.clientes, icon: Users, to: '/dashboard/clientes', hint: 'Total en el sistema' },
    { label: 'Reservas', value: counts.reservas, icon: CalendarCheck, to: '/dashboard/reservas', hint: 'Todas las reservas' },
    { label: 'Cotizaciones', value: counts.cotizaciones, icon: FileText, to: '/dashboard/cotizaciones', hint: 'Pendientes y aprobadas' },
    { label: 'Incidencias', value: counts.incidencias, icon: AlertTriangle, to: '/dashboard/incidencias', hint: 'Registradas en servicios' },
    { label: 'Vehiculos', value: counts.vehiculos, icon: CarIcon, to: '/dashboard/vehiculos', hint: 'Registrados' },
    { label: 'Conductores', value: counts.conductores, icon: User, to: '/dashboard/conductores', hint: 'Registrados' },
    { label: 'Pagos', value: counts.pagos, icon: Coins, to: '/dashboard/pagos', hint: 'Registrados' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Panel general</h1>
        <p className="mt-1 text-sm text-ink-400">Resumen rápido de la operación. Elige un módulo del menú para administrar cada proceso.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="group rounded-2xl border border-ink-100 bg-white p-5 shadow-card transition-colors hover:border-amber"
          >
            <div className="flex items-center justify-between">
              <c.icon size={18} className="text-ink-400 group-hover:text-amber" />
              <span className="font-mono text-2xl font-semibold text-ink-900">
                {c.value === null ? '—' : c.value}
              </span>
            </div>
            <p className="mt-3 text-sm font-medium text-ink-800">{c.label}</p>
            <p className="text-xs text-ink-300">{c.hint}</p>
          </Link>
        ))}
      </div>


    </div>
  )
}
