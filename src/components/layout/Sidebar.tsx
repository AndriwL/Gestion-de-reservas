import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FileText,
  CalendarCheck,
  Wrench,
  IdCard,
  Truck,
  Route as RouteIcon,
  Wallet,
  ReceiptText,
  AlertTriangle,
} from 'lucide-react'

const navGroups = [
  {
    label: 'Operación',
    items: [
      { to: '/dashboard', label: 'Panel general', icon: LayoutDashboard, end: true },
      { to: '/dashboard/clientes', label: 'Clientes', icon: Users },
      { to: '/dashboard/cotizaciones', label: 'Cotizaciones', icon: FileText },
      { to: '/dashboard/reservas', label: 'Reservas', icon: CalendarCheck },
      { to: '/dashboard/servicios', label: 'Servicios', icon: Wrench },
    ],
  },
  {
    label: 'Flota',
    items: [
      { to: '/dashboard/conductores', label: 'Conductores', icon: IdCard },
      { to: '/dashboard/vehiculos', label: 'Vehículos', icon: Truck },
      { to: '/dashboard/rutas', label: 'Rutas', icon: RouteIcon },
    ],
  },
  {
    label: 'Finanzas',
    items: [
      { to: '/dashboard/pagos', label: 'Pagos', icon: Wallet },
      { to: '/dashboard/comprobantes', label: 'Comprobantes', icon: ReceiptText },
    ],
  },
  {
    label: 'Calidad',
    items: [{ to: '/dashboard/incidencias', label: 'Incidencias', icon: AlertTriangle }],
  },
]

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-cyan-950/15 bg-gradient-to-b from-[#063948] via-[#075a6b] to-[#123a69] text-ink-100 shadow-xl shadow-cyan-950/15 lg:flex">
      <div className="flex min-h-28 flex-col items-center justify-center gap-2.5 border-b border-white/10 px-6 py-3">
        <img src="/images/logo.png" alt="Logo de la empresa" className="h-20 w-auto object-contain" />

      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100/60">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={'end' in item ? item.end : false}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-300 to-blue-500 text-slate-950 shadow-lg shadow-cyan-950/30'
                        : 'text-cyan-50/75 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={16} className={isActive ? 'text-slate-900' : 'text-cyan-200/70 group-hover:text-cyan-100'} />
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

    </aside>
  )
}
