import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, CalendarCheck, Eye, EyeOff, Truck, Users } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const features = [
  { icon: CalendarCheck, label: 'Reservas' },
  { icon: Users, label: 'Clientes' },
  { icon: Truck, label: 'Unidades' },
  { icon: Building2, label: 'pagos' },
]

export function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!correo || !password) {
      setError('Completa tu correo y contraseña.')
      return
    }

    setLoading(true)
    const { error: signInError } = await signIn(correo, password)
    setLoading(false)

    if (signInError) {
      setError(signInError)
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Panel izquierdo */}
      <div className="relative hidden overflow-hidden bg-ink-950 md:block">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/80 to-ink-950" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <img className="w-40 h-auto max-w-full" src="/public/logo-sf.png" alt="Descripción de la imagen"/>
              <span className="leading-tight">
                <span className="block font-display font-extrabold text-white">GAL</span>
                <span className="block text-[11px] uppercase tracking-wide text-slate-400">
                  Turísmo Y Transporte
                </span>
              </span>
            </div>

            <h1 className="font-display text-4xl font-extrabold leading-tight text-white md:text-5xl">
              PANEL
              <br />
              ADMINISTRATIVO
            </h1>
            <p className="mt-5 max-w-sm text-slate-400">
              Gestiona reservas, clientes, unidades y rutas desde un solo lugar con total
              control.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-4"
                >
                  <f.icon size={18} className="text-teal-400" />
                  <span className="text-sm font-medium text-white">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Transportes GAL.
          </p>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-sm">

          <h2 className="font-display text-2xl font-extrabold text-ink-950">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-slate-500">
            Ingresa tus credenciales para acceder al panel
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label
                htmlFor="correo"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600"
              >
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                autoComplete="username"
                placeholder="admin@gal.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink-950 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-ink-950 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 grid place-items-center text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm text-rose-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-800 disabled:opacity-60"
            >
              {loading ? 'Verificando…' : 'Acceder al Panel'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}
