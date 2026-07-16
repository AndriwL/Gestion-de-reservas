import { useEffect, useState, type FormEvent } from 'react'
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import type { Cliente, TipoCliente } from '@/types'
import {
  actualizarDatosCliente,
  eliminarCliente,
  listarClientes,
  registrarCliente,
  type NuevoCliente,
} from '@/services/clientes'
import { Modal } from '@/components/dashboard/Modal'
import { Field } from '@/components/dashboard/Field'

const emptyForm: NuevoCliente = {
  dni_ruc: '',
  nombres_razon_social: '',
  apellidos: '',
  correo: '',
  telefono: '',
  direccion: '',
  tipo_cliente: 'natural',
}

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Cliente | null>(null)
  const [form, setForm] = useState<NuevoCliente>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function cargar() {
    setLoading(true)
    try {
      setClientes(await listarClientes())
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

  function openEdit(cliente: Cliente) {
    setEditing(cliente)
    setForm({
      dni_ruc: cliente.dni_ruc,
      nombres_razon_social: cliente.nombres_razon_social,
      apellidos: cliente.apellidos ?? '',
      correo: cliente.correo,
      telefono: cliente.telefono,
      direccion: cliente.direccion ?? '',
      tipo_cliente: cliente.tipo_cliente,
    })
    setFormError(null)
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este cliente? Esta acción no se puede deshacer.')) return
    await eliminarCliente(id)
    cargar()
  }

  function validate(): string | null {
    if (
      !form.dni_ruc.trim() ||
      !form.nombres_razon_social.trim() ||
      !form.correo.trim() ||
      !form.telefono.trim()
    ) {
      return 'Todos los campos obligatorios deben completarse.'
    }
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)
    if (!correoValido) return 'Ingresa un correo electrónico válido.'
    return null
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validation = validate()
    if (validation) {
      setFormError(validation)
      return
    }

    setSaving(true)
    setFormError(null)
    try {
      const payload = { ...form, direccion: form.direccion || null }
      if (editing) {
        await actualizarDatosCliente(editing.id, payload)
      } else {
        await registrarCliente(payload)
      }
      setModalOpen(false)
      cargar()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ocurrió un error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  const filtered = clientes.filter((c) =>
    `${c.nombres_razon_social} ${c.apellidos ?? ''} ${c.dni_ruc} ${c.correo}`
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold text-ink-950">Clientes</h1>

          </div>
          <p className="mt-1 text-sm text-slate-500">Administra los clientes registrados en el sistema.</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-teal-400"
        >
          <Plus size={16} /> Nuevo cliente
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, DNI/RUC o correo…"
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-panel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">DNI / RUC</th>
              <th className="px-5 py-3">Nombre / Razón social</th>
              <th className="px-5 py-3">Teléfono</th>
              <th className="px-5 py-3">Correo</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">Cargando clientes…</td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  No se encontraron clientes. Registra el primero con “Nuevo cliente”.
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-ink-950">{c.dni_ruc}</td>
                <td className="px-5 py-3">{c.nombres_razon_social} {c.apellidos}</td>
                <td className="px-5 py-3 text-slate-500">{c.telefono}</td>
                <td className="px-5 py-3 text-slate-500">{c.correo}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      c.estado === 'activo' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {c.estado}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Ver">
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => openEdit(c)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
                      aria-label="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-rose-400 hover:bg-rose-50"
                      aria-label="Eliminar"
                    >
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
        <Modal title={editing ? 'Editar cliente' : 'Nuevo cliente'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="DNI / RUC" value={form.dni_ruc} onChange={(v) => setForm({ ...form, dni_ruc: v })} />
              <Field
                label="Tipo de cliente"
                as="select"
                value={form.tipo_cliente}
                onChange={(v) => setForm({ ...form, tipo_cliente: v as TipoCliente })}
                options={[
                  { value: 'natural', label: 'Persona natural' },
                  { value: 'empresa', label: 'Empresa' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Nombres / Razón social"
                value={form.nombres_razon_social}
                onChange={(v) => setForm({ ...form, nombres_razon_social: v })}
              />
              <Field
                label="Apellidos"
                value={form.apellidos ?? ''}
                onChange={(v) => setForm({ ...form, apellidos: v })}
                required={false}
              />
            </div>
            <Field label="Correo" type="email" value={form.correo} onChange={(v) => setForm({ ...form, correo: v })} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Teléfono" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} />
              <Field
                label="Dirección"
                value={form.direccion ?? ''}
                onChange={(v) => setForm({ ...form, direccion: v })}
                required={false}
              />
            </div>

            {formError && <p className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{formError}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60"
              >
                {saving ? 'Guardando…' : 'Guardar cliente'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
