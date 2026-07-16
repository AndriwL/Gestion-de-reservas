import { useEffect, useState, type FormEvent } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import type { Conductor } from '@/types'
import {
  actualizarConductor,
  eliminarConductor,
  listarConductores,
  registrarConductor,
  verificarVigenciaLicencia,
  type NuevoConductor,
} from '@/services/conductores'
import { Modal } from '@/components/dashboard/Modal'
import { Field } from '@/components/dashboard/Field'

const emptyForm: NuevoConductor = {
  dni: '',
  nombres: '',
  apellidos: '',
  nro_licencia: '',
  tipo_licencia: 'A-I',
  fecha_vencimiento_licencia: '',
  telefono: '',
}

const estadoStyles: Record<Conductor['estado'], string> = {
  disponible: 'bg-emerald-50 text-emerald-600',
  en_servicio: 'bg-amber-50 text-amber-600',
  de_baja: 'bg-rose-50 text-rose-600',
}

export function Conductores() {
  const [conductores, setConductores] = useState<Conductor[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Conductor | null>(null)
  const [form, setForm] = useState<NuevoConductor>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function cargar() {
    setLoading(true)
    try {
      setConductores(await listarConductores())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(c: Conductor) {
    setEditing(c)
    setForm({
      dni: c.dni,
      nombres: c.nombres,
      apellidos: c.apellidos,
      nro_licencia: c.nro_licencia,
      tipo_licencia: c.tipo_licencia,
      fecha_vencimiento_licencia: c.fecha_vencimiento_licencia,
      telefono: c.telefono,
    })
    setFormError(null)
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este conductor?')) return
    await eliminarConductor(id)
    cargar()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.dni.trim() || !form.nombres.trim() || !form.apellidos.trim() || !form.nro_licencia.trim() || !form.fecha_vencimiento_licencia) {
      setFormError('Completa todos los campos obligatorios.')
      return
    }
    if (!verificarVigenciaLicencia(form.fecha_vencimiento_licencia)) {
      setFormError('La licencia ingresada ya está vencida.')
      return
    }
    setSaving(true)
    setFormError(null)
    try {
      if (editing) {
        await actualizarConductor(editing.id, form)
      } else {
        await registrarConductor(form)
      }
      setModalOpen(false)
      cargar()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ocurrió un error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  const filtered = conductores.filter((c) =>
    `${c.nombres} ${c.apellidos} ${c.dni}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold text-ink-950">Conductores</h1>

          </div>
          <p className="mt-1 text-sm text-slate-500">Gestiona licencias, disponibilidad y contacto.</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-teal-400"
        >
          <Plus size={16} /> Registrar conductor
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o DNI…"
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-panel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">DNI</th>
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Licencia</th>
              <th className="px-5 py-3">Vencimiento</th>
              <th className="px-5 py-3">Teléfono</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">Cargando conductores…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                  No hay conductores registrados. Usa “Registrar conductor”.
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-ink-950">{c.dni}</td>
                <td className="px-5 py-3">{c.nombres} {c.apellidos}</td>
                <td className="px-5 py-3 text-slate-500">{c.nro_licencia} ({c.tipo_licencia})</td>
                <td className="px-5 py-3 text-slate-500">{c.fecha_vencimiento_licencia}</td>
                <td className="px-5 py-3 text-slate-500">{c.telefono}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${estadoStyles[c.estado]}`}>
                    {c.estado.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => openEdit(c)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Editar">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="grid h-8 w-8 place-items-center rounded-lg text-rose-400 hover:bg-rose-50" aria-label="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Editar conductor' : 'Registrar conductor'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="DNI" value={form.dni} onChange={(v) => setForm({ ...form, dni: v })} />
              <Field label="Teléfono" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nombres" value={form.nombres} onChange={(v) => setForm({ ...form, nombres: v })} />
              <Field label="Apellidos" value={form.apellidos} onChange={(v) => setForm({ ...form, apellidos: v })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="N° Licencia" value={form.nro_licencia} onChange={(v) => setForm({ ...form, nro_licencia: v })} />
              <Field
                label="Tipo de licencia"
                as="select"
                value={form.tipo_licencia}
                onChange={(v) => setForm({ ...form, tipo_licencia: v })}
                options={[
                  { value: 'A-I', label: 'A-I' },
                  { value: 'A-IIa', label: 'A-IIa' },
                  { value: 'A-IIIc', label: 'A-IIIc' },
                ]}
              />
            </div>
            <Field
              label="Vencimiento de licencia"
              type="date"
              value={form.fecha_vencimiento_licencia}
              onChange={(v) => setForm({ ...form, fecha_vencimiento_licencia: v })}
            />

            {formError && <p className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{formError}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="rounded-lg bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60">
                {saving ? 'Guardando…' : 'Guardar conductor'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
