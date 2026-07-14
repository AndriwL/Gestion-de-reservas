import { FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { session, loading, signIn } = useAuth()
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
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
      <div className="relative min-h-screen overflow-hidden bg-ink-950 text-white">
        <img
            src="/images/hero-bg.png"
            alt="Fondo turístico"
            className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-ink-950/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/50 via-transparent to-ink-950" />

        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="relative z-10 border-b border-white/10 bg-ink-950/45 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <img src="/images/logo.png" alt="Logo de la empresa" className="h-11 w-auto object-contain" />
                <span className="hidden text-lg font-bold tracking-wide text-white sm:inline">
                T&T GAL
              </span>
              </div>
            </div>
          </header>

          <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 place-items-center gap-10 px-6 py-8 lg:grid-cols-2 lg:place-items-center lg:gap-16">
            <section className="mx-auto w-full max-w-2xl text-center lg:mx-0 lg:justify-self-start lg:text-left">

              <h1 className="mt-7 font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Gestion de reservas,{' '}
                <span className="text-cyan-300">viajes y operaciones</span>
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/70 lg:mx-0">
                Un sistema privado para controlar clientes, cotizaciones, reservas, servicios, vehículos,
                conductores, pagos e incidencias desde un solo lugar.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-extrabold text-cyan-300">01</p>
                  <p className="mt-1 text-xs font-semibold text-white/70">Cotiza</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-extrabold text-cyan-300">02</p>
                  <p className="mt-1 text-xs font-semibold text-white/70">Reserva</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-extrabold text-cyan-300">03</p>
                  <p className="mt-1 text-xs font-semibold text-white/70">Gestiona</p>
                </div>
              </div>

            </section>

            <section className="flex w-full justify-center lg:justify-end">
              <div className="w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
                <div className="mb-8 text-center">

                  <h2 className="font-display text-3xl font-extrabold text-white">Iniciar sesión</h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="usuario" className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
                      Correo electrónico
                    </label>

                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-white transition focus-within:border-cyan-300/70 focus-within:bg-white/15 focus-within:ring-4 focus-within:ring-cyan-300/10">
                      <Mail size={18} className="text-cyan-300" />
                      <input
                          id="usuario"
                          type="email"
                          required
                          autoComplete="username"
                          placeholder="admin@empresa.com"
                          className="w-full bg-transparent text-sm outline-none placeholder:text-white/30"
                          value={usuario}
                          onChange={(e) => setUsuario(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
                      Contraseña
                    </label>

                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-white transition focus-within:border-cyan-300/70 focus-within:bg-white/15 focus-within:ring-4 focus-within:ring-cyan-300/10">
                      <Lock size={18} className="text-cyan-300" />
                      <input
                          id="password"
                          type="password"
                          required
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="w-full bg-transparent text-sm outline-none placeholder:text-white/30"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
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
                      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3.5 text-sm font-extrabold text-ink-950 shadow-xl shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Ingresando…' : 'Ingresar al panel'}
                    {!submitting && <ArrowRight size={17} />}
                  </button>

                  <p className="text-center text-xs leading-5 text-white/35">
                    No existe registro público. Solo puede acceder la cuenta administradora autorizada.
                  </p>
                </form>
              </div>
            </section>
          </main>

          <footer className="border-t border-white/10 bg-ink-950/60 px-6 py-7 text-center text-xs text-white/40 backdrop-blur">
            © 2026 GAL Transporte y Turismo - Todos los derechos reservados
          </footer>
        </div>
      </div>
  )
}