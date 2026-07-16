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
    <aside className="flex h-full w-64 flex-col border-r border-white/10 bg-ink-950 text-slate-300 shadow-[8px_0_28px_rgba(14,37,48,0.12)]">
      <div className="flex justify-center items-center gap-3 border-b border-white/10 px-6 py-7">
        <img className="w-40 h-auto max-w-full" src="/public/logo-sf.png" alt="Descripción de la imagen"/>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-ink-950 shadow-lg shadow-cyan-950/20'
                  : 'text-slate-300 hover:translate-x-0.5 hover:bg-cyan-400/10 hover:text-white'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10"
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
