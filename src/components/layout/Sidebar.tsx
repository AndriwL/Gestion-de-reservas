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
    <aside className=" w-56 shrink-0 flex-col bg-ink-900 text-ink-100 lg:flex">
      <div className="flex flex-col items-center justify-center gap-2.5 px-6 py-3">
        <img src="/images/logo.png" alt="Logo de la empresa" className="h-20 w-auto object-contain" />

      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-ink-200">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={'end' in item ? item.end : false}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-ink-800 text-white'
                        : 'text-ink-300 hover:bg-ink-800/60 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={16} className={isActive ? 'text-amber' : 'text-ink-500 group-hover:text-ink-300'} />
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
