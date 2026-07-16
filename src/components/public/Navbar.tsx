import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/#nosotros', label: 'Nosotros' },
  { to: '/#servicios', label: 'Servicios' },
  { to: '/#vehiculos', label: 'Vehículos' },
  { to: '/#contacto', label: 'Contacto' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-500 font-display text-lg font-extrabold text-ink-950">
            G
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-extrabold text-white">GAL</span>
            <span className="block text-[11px] uppercase tracking-wide text-slate-400">
              Transporte Turístico
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/login"
            className="rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-teal-400"
          >
            Iniciar sesión
          </Link>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink-950 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-300 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-teal-500 px-5 py-2.5 text-center text-sm font-semibold text-ink-950"
            >
              Iniciar sesión
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
