import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { actualizarPerfil, obtenerPerfil } from '@/services/perfil'
import type { Perfil } from '@/types'

export function Perfil() {
  const { session, signOut } = useAuth()
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [nombres, setNombres] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [telefono, setTelefono] = useState('')
  const [dni, setDni] = useState('')
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!session) return
    obtenerPerfil(session.user.id).then((p) => {
      if (!p) return
      setPerfil(p)
      setNombres(p.nombres)
      setApellidos(p.apellidos)
      setTelefono(p.telefono ?? '')
      setDni(p.dni ?? '')
    })
  }, [session])

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault()
    if (!session) return
    setSaving(true)
    try {
      await actualizarPerfil(session.user.id, { nombres, apellidos, telefono, dni })
      setMessage({ type: 'ok', text: 'Datos actualizados correctamente.' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'No se pudo actualizar el perfil.' })
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault()
    if (nuevaPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' })
      return
    }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: nuevaPassword })
    setSaving(false)
    setNuevaPassword('')
    setMessage(
      error
        ? { type: 'error', text: error.message }
        : { type: 'ok', text: 'Contraseña actualizada correctamente.' }
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink-950">Perfil</h1>
        <p className="mt-1 text-sm text-slate-500">
          Datos del administrador — usuario: <span className="font-medium text-ink-950">{perfil?.usuario ?? session?.user.email}</span>
        </p>
      </div>

      {message && (
        <p
          className={`rounded-lg px-4 py-2.5 text-sm ${
            message.type === 'ok' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-panel">
        <h2 className="font-display font-bold text-ink-950">Datos personales</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">Nombres</label>
            <input
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">Apellidos</label>
            <input
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">DNI</label>
            <input
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">Teléfono</label>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">Correo</label>
          <input
            disabled
            value={session?.user.email ?? ''}
            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60"
        >
          Guardar cambios
        </button>
      </form>

      <form onSubmit={handleChangePassword} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-panel">
        <h2 className="font-display font-bold text-ink-950">Cambiar contraseña</h2>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
            Nueva contraseña
          </label>
          <input
            type="password"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60"
        >
          Actualizar contraseña
        </button>
      </form>

      <button
        onClick={() => signOut()}
        className="rounded-lg border border-rose-200 px-5 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50"
      >
        Cerrar sesión
      </button>
    </div>
  )
}
