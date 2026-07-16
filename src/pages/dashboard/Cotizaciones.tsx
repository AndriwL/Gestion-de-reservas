import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Plus, Search } from 'lucide-react'
import type { Cliente, Cotizacion, TipoVehiculo } from '@/types'
import { listarClientes } from '@/services/clientes'
import {
  agregarObservaciones,
  ajustarMonto,
  aprobarYConfirmarReserva,
  calcularCostoEstimado,
  cambiarEstadoCotizacion,
  eliminarCotizacion,
  listarCotizaciones,
  registrarCotizacion,
  type NuevaCotizacion,
} from '@/services/cotizaciones'
import { Modal } from '@/components/dashboard/Modal'
import { Field } from '@/components/dashboard/Field'

type FormState = Omit<NuevaCotizacion, 'cliente_id'> & { cliente_id: string }

function formInicial(): FormState {
  return {
    cliente_id: '',
    origen: '',
    destino: '',
    pasajeros: 4,
    tipo_vehiculo: 'van',
    fecha: '',
    hora: '',
    observaciones: '',
  }
}

const estadoStyles: Record<Cotizacion['estado'], string> = {
  pendiente: 'bg-amber-50 text-amber-600',
  aprobada: 'bg-teal-50 text-teal-600',
  cancelada: 'bg-rose-50 text-rose-600',
  convertida: 'bg-emerald-50 text-emerald-600',
}

export function Cotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<FormState>(formInicial())
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  async function cargar() {
    setLoading(true)
    try {
      const [cots, clis] = await Promise.all([listarCotizaciones(), listarClientes()])
      setCotizaciones(cots)
      setClientes(clis)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const clienteNombre = useMemo(() => {
    const map = new Map(clientes.map((c) => [c.id, c.nombres_razon_social]))
    return (id: string) => map.get(id) ?? '—'
  }, [clientes])

  const costoEstimado = calcularCostoEstimado({ tipo_vehiculo: form.tipo_vehiculo, pasajeros: form.pasajeros })

  function openNew() {
    setForm(formInicial())
    setFormError(null)
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.cliente_id || !form.origen.trim() || !form.destino.trim() || !form.fecha || !form.hora) {
      setFormError('Completa cliente, origen, destino, fecha y hora.')
      return
    }
    setSaving(true)
    setFormError(null)
    try {
      await registrarCotizacion({ ...form, costo_estimado: costoEstimado })
      setModalOpen(false)
      cargar()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ocurrió un error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  async function handleAprobar(id: string) {
    await cambiarEstadoCotizacion(id, 'aprobada')
    cargar()
  }

  async function handleCancelar(id: string) {
    await cambiarEstadoCotizacion(id, 'cancelada')
    cargar()
  }

  async function handleConvertir(cot: Cotizacion) {
    try {
      const reserva = await aprobarYConfirmarReserva(cot.id)
      setActionMessage(
        `Reserva ${reserva.codigo} confirmada. Ve a “Servicios” → “Nuevo servicio” para asignar vehículo y conductor.`
      )
      cargar()
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : 'No se pudo convertir la cotización en reserva.')
    }
  }

  async function handleAjustarMonto(cot: Cotizacion) {
    const nuevo = prompt('Nuevo monto estimado (S/):', String(cot.costo_estimado))
    if (nuevo === null) return
    const valor = Number(nuevo)
    if (Number.isNaN(valor) || valor <= 0) return
    await ajustarMonto(cot.id, valor)
    cargar()
  }

  async function handleObservaciones(cot: Cotizacion) {
    const texto = prompt('Observaciones:', cot.observaciones ?? '')
    if (texto === null) return
    await agregarObservaciones(cot.id, texto)
    cargar()
  }

  async function handleEliminar(id: string) {
    if (!confirm('¿Eliminar esta cotización?')) return
    await eliminarCotizacion(id)
    cargar()
  }

  const filtered = cotizaciones.filter((c) =>
    `${c.codigo} ${clienteNombre(c.cliente_id)} ${c.origen} ${c.destino}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold text-ink-950">Cotizaciones</h1>
            
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Registra solicitudes de viaje. Al aprobarlas se generan como Reserva.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-teal-400"
        >
          <Plus size={16} /> Nueva cotización
        </button>
      </div>

      {actionMessage && (
        <p className="rounded-lg bg-teal-50 px-4 py-2.5 text-sm text-teal-700">{actionMessage}</p>
      )}

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por código, cliente, origen o destino…"
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-panel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Código</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Origen → Destino</th>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Costo estimado</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">Cargando cotizaciones…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                  No hay cotizaciones registradas. Usa “Nueva cotización”.
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-ink-950">{c.codigo}</td>
                <td className="px-5 py-3">{clienteNombre(c.cliente_id)}</td>
                <td className="px-5 py-3 text-slate-500">{c.origen} → {c.destino}</td>
                <td className="px-5 py-3 text-slate-500">{c.fecha} {c.hora}</td>
                <td className="px-5 py-3 font-medium text-ink-950">S/ {Number(c.costo_estimado).toFixed(2)}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${estadoStyles[c.estado]}`}>
                    {c.estado}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap justify-end gap-1 text-xs">
                    {c.estado === 'pendiente' && (
                      <button onClick={() => handleAprobar(c.id)} className="rounded-md px-2 py-1 font-medium text-teal-600 hover:bg-teal-50">
                        Aprobar
                      </button>
                    )}
                    {c.estado !== 'convertida' && c.estado !== 'cancelada' && (
                      <button onClick={() => handleConvertir(c)} className="rounded-md px-2 py-1 font-medium text-ink-950 hover:bg-slate-100">
                        Convertir en reserva
                      </button>
                    )}
                    <button onClick={() => handleAjustarMonto(c)} className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100">
                      Ajustar monto
                    </button>
                    <button onClick={() => handleObservaciones(c)} className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100">
                      Observaciones
                    </button>
                    {c.estado === 'pendiente' && (
                      <button onClick={() => handleCancelar(c.id)} className="rounded-md px-2 py-1 text-rose-500 hover:bg-rose-50">
                        Cancelar
                      </button>
                    )}
                    <button onClick={() => handleEliminar(c.id)} className="rounded-md px-2 py-1 text-rose-500 hover:bg-rose-50">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title="Nueva cotización" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="Cliente"
              as="select"
              value={form.cliente_id}
              onChange={(v) => setForm({ ...form, cliente_id: v })}
              options={[
                { value: '', label: 'Selecciona un cliente…' },
                ...clientes.map((c) => ({ value: c.id, label: c.nombres_razon_social })),
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Origen" value={form.origen} onChange={(v) => setForm({ ...form, origen: v })} />
              <Field label="Destino" value={form.destino} onChange={(v) => setForm({ ...form, destino: v })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Pasajeros"
                type="number"
                value={String(form.pasajeros)}
                onChange={(v) => setForm({ ...form, pasajeros: Number(v) })}
              />
              <Field
                label="Tipo de vehículo"
                as="select"
                value={form.tipo_vehiculo}
                onChange={(v) => setForm({ ...form, tipo_vehiculo: v as TipoVehiculo })}
                options={[
                  { value: 'auto', label: 'Auto' },
                  { value: 'van', label: 'Van' },
                  { value: 'minibus', label: 'Minibús' },
                  { value: 'bus', label: 'Bus' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Fecha" type="date" value={form.fecha} onChange={(v) => setForm({ ...form, fecha: v })} />
              <Field label="Hora" type="time" value={form.hora} onChange={(v) => setForm({ ...form, hora: v })} />
            </div>
            <Field
              label="Observaciones"
              value={form.observaciones ?? ''}
              onChange={(v) => setForm({ ...form, observaciones: v })}
              required={false}
            />

            <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Costo estimado (calcularCostoEstimado): <span className="font-semibold text-ink-950">S/ {costoEstimado.toFixed(2)}</span>
            </div>

            {formError && <p className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{formError}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="rounded-lg bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60">
                {saving ? 'Guardando…' : 'Guardar cotización'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
