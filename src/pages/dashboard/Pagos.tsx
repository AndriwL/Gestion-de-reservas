import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { FileText, Plus } from 'lucide-react'
import type { Cliente, MetodoPago, Pago, Servicio } from '@/types'
import { listarClientes } from '@/services/clientes'
import { listarServicios } from '@/services/servicios'
import { generarComprobante, listarPagos, obtenerComprobantePorPago, registrarPago, type NuevoPago } from '@/services/pagos'
import { Modal } from '@/components/dashboard/Modal'
import { Field } from '@/components/dashboard/Field'

function formInicial(): NuevoPago {
  return {
    servicio_id: '',
    monto: 0,
    metodo_pago: 'efectivo',
    banco_origen: '',
    nro_operacion: '',
    fecha_pago: new Date().toISOString().slice(0, 10),
  }
}

const estadoStyles: Record<Pago['estado'], string> = {
  pendiente: 'bg-amber-50 text-amber-600',
  parcial: 'bg-teal-50 text-teal-600',
  cancelado: 'bg-emerald-50 text-emerald-600',
}

export function Pagos() {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<NuevoPago>(formInicial())
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [comprobantesGenerados, setComprobantesGenerados] = useState<Record<string, string>>({})

  async function cargar() {
    setLoading(true)
    try {
      const [pgs, srv, clis] = await Promise.all([listarPagos(), listarServicios(), listarClientes()])
      setPagos(pgs)
      setServicios(srv)
      setClientes(clis)

      const entries = await Promise.all(
        pgs.map(async (p) => [p.id, (await obtenerComprobantePorPago(p.id))?.nro_comprobante ?? ''] as const)
      )
      setComprobantesGenerados(Object.fromEntries(entries.filter(([, nro]) => nro)))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const servicioInfo = useMemo(() => {
    const clienteMap = new Map(clientes.map((c) => [c.id, c.nombres_razon_social]))
    const map = new Map(servicios.map((s) => [s.id, s]))
    return (id: string) => {
      const s = map.get(id)
      if (!s) return { codigo: id.slice(0, 6), cliente: '—' }
      return { codigo: s.codigo, cliente: clienteMap.get(s.cliente_id) ?? '—' }
    }
  }, [servicios, clientes])

  function openNew() {
    setForm(formInicial())
    setFormError(null)
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.servicio_id || !form.monto || form.monto <= 0) {
      setFormError('Selecciona un servicio e ingresa un monto válido.')
      return
    }
    setSaving(true)
    setFormError(null)
    try {
      await registrarPago(form)
      setModalOpen(false)
      cargar()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ocurrió un error al registrar el pago.')
    } finally {
      setSaving(false)
    }
  }

  async function handleGenerarComprobante(id: string) {
    const comprobante = await generarComprobante(id)
    setComprobantesGenerados((prev) => ({ ...prev, [id]: comprobante.nro_comprobante }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold text-ink-950">Pagos</h1>

          </div>
          <p className="mt-1 text-sm text-slate-500">
            El saldo y el estado se calculan automáticamente al registrar cada pago.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-teal-400"
        >
          <Plus size={16} /> Registrar pago
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-panel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Código</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Servicio</th>
              <th className="px-5 py-3">Monto</th>
              <th className="px-5 py-3">Saldo</th>
              <th className="px-5 py-3">Método</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-slate-400">Cargando pagos…</td></tr>
            )}
            {!loading && pagos.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                  No hay pagos registrados. Usa “Registrar pago”.
                </td>
              </tr>
            )}
            {pagos.map((p) => {
              const info = servicioInfo(p.servicio_id)
              const comprobante = comprobantesGenerados[p.id]
              return (
                <tr key={p.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 font-medium text-ink-950">{p.codigo}</td>
                  <td className="px-5 py-3">{info.cliente}</td>
                  <td className="px-5 py-3 text-slate-500">{info.codigo}</td>
                  <td className="px-5 py-3 font-medium text-ink-950">S/ {Number(p.monto).toFixed(2)}</td>
                  <td className="px-5 py-3 text-slate-500">S/ {Number(p.saldo).toFixed(2)}</td>
                  <td className="px-5 py-3 capitalize text-slate-500">{p.metodo_pago.replace('_', ' ')}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${estadoStyles[p.estado]}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {comprobante ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                        <FileText size={14} /> {comprobante}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleGenerarComprobante(p.id)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-teal-600 hover:bg-teal-50"
                      >
                        Generar comprobante
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title="Registrar pago" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="Servicio"
              as="select"
              value={form.servicio_id}
              onChange={(v) => setForm({ ...form, servicio_id: v })}
              options={[
                { value: '', label: 'Selecciona un servicio…' },
                ...servicios.map((s) => ({ value: s.id, label: `${s.codigo} · ${s.origen} → ${s.destino}` })),
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Monto"
                type="number"
                value={String(form.monto)}
                onChange={(v) => setForm({ ...form, monto: Number(v) })}
              />
              <Field
                label="Método de pago"
                as="select"
                value={form.metodo_pago}
                onChange={(v) => setForm({ ...form, metodo_pago: v as MetodoPago })}
                options={[
                  { value: 'efectivo', label: 'Efectivo' },
                  { value: 'transferencia', label: 'Transferencia' },
                  { value: 'tarjeta', label: 'Tarjeta' },
                  { value: 'yape_plin', label: 'Yape / Plin' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Banco de origen"
                value={form.banco_origen ?? ''}
                onChange={(v) => setForm({ ...form, banco_origen: v })}
                required={false}
              />
              <Field
                label="N° de operación"
                value={form.nro_operacion ?? ''}
                onChange={(v) => setForm({ ...form, nro_operacion: v })}
                required={false}
              />
            </div>
            <Field label="Fecha" type="date" value={form.fecha_pago} onChange={(v) => setForm({ ...form, fecha_pago: v })} />

            {formError && <p className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{formError}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="rounded-lg bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60">
                {saving ? 'Guardando…' : 'Registrar pago'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
