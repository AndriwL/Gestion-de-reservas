import { useEffect, useState } from 'react'
import { Bell, Menu } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { obtenerPerfil } from '@/services/perfil'

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { session } = useAuth()
  const [now, setNow] = useState(new Date())
  const [nombre, setNombre] = useState('')
  const [rol, setRol] = useState('Administrador')

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!session) return
    obtenerPerfil(session.user.id).then((p) => {
      if (!p) return
      setNombre(`${p.nombres} ${p.apellidos}`.trim())
      setRol(p.rol)
    })
  }, [session])

  const nombreMostrado = nombre || session?.user.email || 'Usuario'

  return (
    <header className="flex h-[4.5rem] items-center justify-between border-b border-slate-100 bg-white/90 px-4 backdrop-blur-xl md:px-8">
      <button
        onClick={onMenuClick}
        className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-teal-50 hover:text-teal-600 md:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      <div className="hidden text-sm text-slate-500 md:block">
        {now.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
        {' · '}
        {now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
      </div>

      <div className="flex items-center gap-4">

        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 text-sm font-semibold text-ink-950 shadow-lg shadow-cyan-500/20">
            {nombreMostrado.slice(0, 1).toUpperCase()}
          </div>
          <div className="hidden leading-tight md:block">
            <p className="text-sm font-semibold text-ink-950">{nombreMostrado}</p>
            <p className="text-xs capitalize text-slate-500">{rol}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
