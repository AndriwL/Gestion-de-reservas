import { useNavigate } from 'react-router-dom'
import { LogOut, Globe } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Panel general',
  '/dashboard/clientes': 'Clientes',
  '/dashboard/cotizaciones': 'Cotizaciones',
  '/dashboard/reservas': 'Reservas',
  '/dashboard/servicios': 'Servicios',
  '/dashboard/conductores': 'Conductores',
  '/dashboard/vehiculos': 'Vehículos',
  '/dashboard/rutas': 'Rutas',
  '/dashboard/pagos': 'Pagos',
  '/dashboard/comprobantes': 'Comprobantes',
  '/dashboard/incidencias': 'Incidencias',
}

export function Topbar() {
  const { admin, signOut } = useAuth()
  const navigate = useNavigate()
  const path = window.location.pathname
  const title = pageTitles[path] ?? 'Dashboard'

  async function handleSignOut() {
    await signOut()
    navigate('/', { replace: true })
  }

  const initials = admin ? `${admin.nombres[0] ?? ''}${admin.apellidos[0] ?? ''}`.toUpperCase() : 'AD'

  return (
    <header className="flex items-center justify-between border-b border-ink-100 bg-white px-6 py-4">
      <div>
        <p className="text-[13px] font-semibold tracking-widest text-ink-300">T&T GAL - Panel administrativo</p>
        <h1 className="font-display text-lg font-semibold text-ink-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">

        <div className="flex items-center gap-2.5 rounded-lg border border-ink-100 py-1.5 pl-1.5 pr-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-800 text-xs font-semibold text-white">
            {initials}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-medium leading-tight text-ink-800">
              {admin ? `${admin.nombres} ${admin.apellidos}` : 'Administrador'}
            </p>
            <p className="text-[11px] leading-tight text-ink-300">{admin?.correo}</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          aria-label="Cerrar sesión"
          className="rounded-lg p-2 text-ink-400 hover:bg-coral-light hover:text-coral"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  )
}
