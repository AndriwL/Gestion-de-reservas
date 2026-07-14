import { FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { session, loading, signIn } = useAuth()
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!loading && session) return <Navigate to="/dashboard" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const result = await signIn(usuario, password)

    setSubmitting(false)

    if (!result.ok) {
      setError(result.message ?? 'No se pudo iniciar sesión.')
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
      <div className="relative min-h-screen overflow-hidden bg-[#061d2a] text-white">
        <img
            src="/images/hero-bg.png"
            alt="Fondo turístico"
            className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#052f3d]/95 via-[#075a6b]/82 to-[#123a69]/72" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#061d2a]/20 via-transparent to-[#061d2a]/80" />
        <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative z-10 flex min-h-screen flex-col">
          <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 place-items-center gap-10 px-6 py-10 lg:grid-cols-2 lg:place-items-center lg:gap-16">
            <section className="mx-auto w-full max-w-2xl text-center lg:mx-0 lg:justify-self-start lg:text-left">
              <div className="flex items-center justify-center gap-4 lg:justify-start">
                <img src="/images/logo.png" alt="Logo de GAL" className="h-20 w-auto object-contain drop-shadow-lg" />
                <div className="border-l border-cyan-100/35 pl-4 text-left">
                  <p className="font-display text-2xl font-extrabold tracking-wide text-white">T&T GAL</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/75">Transporte y turismo</p>
                </div>
              </div>

              <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Gestion de reservas,{' '}
                <span className="text-cyan-200">viajes y operaciones</span>
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/70 lg:mx-0">
                Un sistema privado para controlar clientes, cotizaciones, reservas, servicios, vehículos,
                conductores, pagos e incidencias desde un solo lugar.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-cyan-100/20 bg-cyan-950/30 p-4 shadow-lg shadow-cyan-950/20 backdrop-blur">
                  <p className="text-2xl font-extrabold text-cyan-200">01</p>
                  <p className="mt-1 text-xs font-semibold text-white/70">Cotiza</p>
                </div>

                <div className="rounded-2xl border border-white/25 bg-white/15 p-4 shadow-lg shadow-slate-950/10 backdrop-blur">
                  <p className="text-2xl font-extrabold text-white">02</p>
                  <p className="mt-1 text-xs font-semibold text-white/70">Reserva</p>
                </div>

                <div className="rounded-2xl border border-violet-200/25 bg-violet-950/25 p-4 shadow-lg shadow-violet-950/20 backdrop-blur">
                  <p className="text-2xl font-extrabold text-violet-200">03</p>
                  <p className="mt-1 text-xs font-semibold text-white/70">Gestiona</p>
                </div>
              </div>

            </section>

            <section className="flex w-full justify-center lg:justify-end">
              <div className="w-full max-w-md rounded-[2rem] border border-white/40 bg-white/[0.88] p-6 text-slate-800 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-600/30"><ShieldCheck size={24} /></div>
                  <h2 className="font-display text-3xl font-extrabold text-slate-800">Iniciar sesión</h2>
                  <p className="mt-2 text-sm text-slate-500">Accede al panel administrativo</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="usuario" className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Correo electrónico
                    </label>

                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 transition focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-500/10">
                      <Mail size={18} className="text-cyan-600" />
                      <input
                          id="usuario"
                          type="email"
                          required
                          autoComplete="username"
                          placeholder="admin@empresa.com"
                          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 focus-visible:outline-none"
                          value={usuario}
                          onChange={(e) => setUsuario(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Contraseña
                    </label>

                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 transition focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-500/10">
                      <Lock size={18} className="text-cyan-600" />
                      <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 focus-visible:outline-none"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        className="rounded-lg p-1 text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-700 focus-visible:outline-none"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                      <p className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                        {error}
                      </p>
                  )}

                  <button
                      type="submit"
                      disabled={submitting}
                      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-cyan-600/25 transition hover:-translate-y-0.5 hover:from-cyan-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Ingresando…' : 'Ingresar al panel'}
                    {!submitting && <ArrowRight size={17} />}
                  </button>

                  <p className="text-center text-xs leading-5 text-slate-400">
                    No existe registro público. Solo puede acceder la cuenta administradora autorizada.
                  </p>
                </form>
              </div>
            </section>
          </main>

          <footer className="border-t border-white/10 bg-[#061d2a]/35 px-6 py-7 text-center text-xs text-cyan-50/55 backdrop-blur">
            © 2026 GAL Transporte y Turismo - Todos los derechos reservados
          </footer>
        </div>
      </div>
  )
}
