import { NavLink } from 'react-router-dom'
import {
  ArrowLeftCircle,
  Calendar,
  Car,
  ClipboardList,
  History,
  Home,
  LogOut,
  UserCircle,
  Users,
  Wallet,
  Contact as UserSteering,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const items = [
  { to: '/dashboard', label: 'Inicio', icon: Home, end: true },
  { to: '/dashboard/calendario', label: 'Calendario', icon: Calendar },
  { to: '/dashboard/clientes', label: 'Clientes', icon: Users },
  { to: '/dashboard/vehiculos', label: 'Vehículos', icon: Car },
  { to: '/dashboard/conductores', label: 'Conductores', icon: UserSteering },
  { to: '/dashboard/cotizaciones', label: 'Cotizaciones', icon: ClipboardList },
  { to: '/dashboard/servicios', label: 'Servicios', icon: ClipboardList },
  { to: '/dashboard/pagos', label: 'Pagos', icon: Wallet },
  { to: '/dashboard/historial', label: 'Historial', icon: History },
  { to: '/dashboard/perfil', label: 'Perfil', icon: UserCircle },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { signOut } = useAuth()

  return (
    <aside className="flex h-full w-64 flex-col bg-ink-950 text-slate-300">
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-500 font-display text-lg font-extrabold text-ink-950">
          G
        </span>
        <span className="leading-tight">
          <span className="block font-display font-extrabold text-white">GAL</span>
          <span className="block text-[11px] uppercase tracking-wide text-slate-500">Panel</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-500/10 text-teal-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <NavLink
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeftCircle size={18} /> Volver al sitio web
        </NavLink>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10"
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
