import { useEffect, useState, type FormEvent } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import type { TipoVehiculo, Vehiculo } from '@/types'
import {
  actualizarVehiculo,
  eliminarVehiculo,
  listarVehiculos,
  registrarVehiculo,
  type NuevoVehiculo,
} from '@/services/vehiculos'
import { Modal } from '@/components/dashboard/Modal'
import { Field } from '@/components/dashboard/Field'

const emptyForm: NuevoVehiculo = {
  placa: '',
  marca: '',
  modelo: '',
  tipo: 'van',
  capacidad: 4,
  kilometraje: 0,
  imagen_url: null,
}

const estadoStyles: Record<Vehiculo['estado'], string> = {
  disponible: 'bg-emerald-50 text-emerald-600',
  en_servicio: 'bg-amber-50 text-amber-600',
  mantenimiento: 'bg-slate-100 text-slate-600',
  inactivo: 'bg-rose-50 text-rose-600',
}

export function Vehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Vehiculo | null>(null)
  const [form, setForm] = useState<NuevoVehiculo>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function cargar() {
    setLoading(true)
    try {
      setVehiculos(await listarVehiculos())
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

  function openEdit(v: Vehiculo) {
    setEditing(v)
    setForm({
      placa: v.placa,
      marca: v.marca,
      modelo: v.modelo,
      tipo: v.tipo,
      capacidad: v.capacidad,
      kilometraje: v.kilometraje,
      imagen_url: v.imagen_url,
    })
    setFormError(null)
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este vehículo?')) return
    await eliminarVehiculo(id)
    cargar()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.placa.trim() || !form.marca.trim() || !form.modelo.trim() || form.capacidad <= 0) {
      setFormError('Completa placa, marca, modelo y una capacidad válida.')
      return
    }
    setSaving(true)
    setFormError(null)
    try {
      if (editing) {
        await actualizarVehiculo(editing.id, form)
      } else {
        await registrarVehiculo(form)
      }
      setModalOpen(false)
      cargar()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ocurrió un error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  const filtered = vehiculos.filter((v) =>
    `${v.placa} ${v.marca} ${v.modelo}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold text-ink-950">Vehículos</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">Administra la flota y su disponibilidad.</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-teal-400"
        >
          <Plus size={16} /> Registrar vehículo
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por placa, marca o modelo…"
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-panel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Placa</th>
              <th className="px-5 py-3">Marca / Modelo</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Capacidad</th>
              <th className="px-5 py-3">Kilometraje</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">Cargando vehículos…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                  No hay vehículos registrados. Usa “Registrar vehículo”.
                </td>
              </tr>
            )}
            {filtered.map((v) => (
              <tr key={v.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-ink-950">{v.placa}</td>
                <td className="px-5 py-3">{v.marca} {v.modelo}</td>
                <td className="px-5 py-3 capitalize text-slate-500">{v.tipo}</td>
                <td className="px-5 py-3 text-slate-500">{v.capacidad} pasajeros</td>
                <td className="px-5 py-3 text-slate-500">{v.kilometraje.toLocaleString()} km</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${estadoStyles[v.estado]}`}>
                    {v.estado.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => openEdit(v)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Editar">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(v.id)} className="grid h-8 w-8 place-items-center rounded-lg text-rose-400 hover:bg-rose-50" aria-label="Eliminar">
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
        <Modal title={editing ? 'Editar vehículo' : 'Registrar vehículo'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Placa" value={form.placa} onChange={(v) => setForm({ ...form, placa: v.toUpperCase() })} />
              <Field
                label="Tipo"
                as="select"
                value={form.tipo}
                onChange={(v) => setForm({ ...form, tipo: v as TipoVehiculo })}
                options={[
                  { value: 'auto', label: 'Auto' },
                  { value: 'van', label: 'Van' },
                  { value: 'minibus', label: 'Minibús' },
                  { value: 'bus', label: 'Bus' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Marca" value={form.marca} onChange={(v) => setForm({ ...form, marca: v })} />
              <Field label="Modelo" value={form.modelo} onChange={(v) => setForm({ ...form, modelo: v })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Capacidad"
                type="number"
                value={String(form.capacidad)}
                onChange={(v) => setForm({ ...form, capacidad: Number(v) })}
              />
              <Field
                label="Kilometraje"
                type="number"
                value={String(form.kilometraje)}
                onChange={(v) => setForm({ ...form, kilometraje: Number(v) })}
              />
            </div>

            {formError && <p className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{formError}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="rounded-lg bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60">
                {saving ? 'Guardando…' : 'Guardar vehículo'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
