import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Plus } from 'lucide-react'
import type { Cliente, Conductor, Reserva, Servicio, Vehiculo } from '@/types'
import { listarClientes } from '@/services/clientes'
import { listarReservas, listarVehiculosDisponibles, listarConductoresDisponibles, generarServicio } from '@/services/reservas'
import {
  agregarIncidencia,
  cancelarServicio,
  finalizarServicio,
  iniciarServicio,
  listarServicios,
  validarConflictoHorario,
} from '@/services/servicios'
import { Modal } from '@/components/dashboard/Modal'
import { Field } from '@/components/dashboard/Field'

const estadoStyles: Record<Servicio['estado'], string> = {
  programado: 'bg-teal-50 text-teal-600',
  en_proceso: 'bg-amber-50 text-amber-600',
  finalizado: 'bg-emerald-50 text-emerald-600',
  cancelado: 'bg-rose-50 text-rose-600',
}

export function Servicios() {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [reservasDisponibles, setReservasDisponibles] = useState<Reserva[]>([])
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [conductores, setConductores] = useState<Conductor[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [reservaId, setReservaId] = useState('')
  const [vehiculoId, setVehiculoId] = useState('')
  const [conductorId, setConductorId] = useState('')
  const [conflicto, setConflicto] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [incidenciaServicioId, setIncidenciaServicioId] = useState<string | null>(null)
  const [incidenciaTipo, setIncidenciaTipo] = useState('Retraso')
  const [incidenciaDescripcion, setIncidenciaDescripcion] = useState('')

  async function cargar() {
    setLoading(true)
    try {
      const [srv, reservas, vehis, drivers, clis] = await Promise.all([
        listarServicios(),
        listarReservas(),
        listarVehiculosDisponibles(),
        listarConductoresDisponibles(),
        listarClientes(),
      ])
      setServicios(srv)
      setReservasDisponibles(reservas.filter((r) => r.estado === 'confirmada'))
      setVehiculos(vehis)
      setConductores(drivers)
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

  const vehiculoPlaca = useMemo(() => {
    const map = new Map(vehiculos.map((v) => [v.id, v.placa]))
    return (id: string) => map.get(id) ?? id.slice(0, 6)
  }, [vehiculos])

  const conductorNombre = useMemo(() => {
    const map = new Map(conductores.map((c) => [c.id, `${c.nombres} ${c.apellidos}`]))
    return (id: string) => map.get(id) ?? id.slice(0, 6)
  }, [conductores])

  function openNew() {
    setReservaId('')
    setVehiculoId('')
    setConductorId('')
    setConflicto(false)
    setFormError(null)
    setModalOpen(true)
  }

  async function checarConflicto(vId: string, cId: string) {
    const reserva = reservasDisponibles.find((r) => r.id === reservaId)
    if (!vId || !cId || !reserva) return
    const hay = await validarConflictoHorario(vId, cId, reserva.fecha_viaje)
    setConflicto(hay)
  }

  async function handleGenerarServicio() {
    if (!reservaId || !vehiculoId || !conductorId) {
      setFormError('Selecciona la reserva, el vehículo y el conductor.')
      return
    }
    if (conflicto) {
      setFormError('El vehículo o el conductor ya tienen un servicio en esa fecha.')
      return
    }
    setSaving(true)
    setFormError(null)
    try {
      await generarServicio(reservaId, vehiculoId, conductorId)
      setModalOpen(false)
      cargar()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'No se pudo generar el servicio.')
    } finally {
      setSaving(false)
    }
  }

  async function handleIniciar(id: string) {
    await iniciarServicio(id)
    cargar()
  }

  async function handleFinalizar(id: string) {
    await finalizarServicio(id)
    cargar()
  }

  async function handleCancelar(id: string) {
    if (!confirm('¿Cancelar este servicio? Se liberarán el vehículo y el conductor.')) return
    await cancelarServicio(id)
    cargar()
  }

  async function handleAgregarIncidencia() {
    if (!incidenciaServicioId || !incidenciaDescripcion.trim()) return
    await agregarIncidencia({
      servicio_id: incidenciaServicioId,
      tipo_incidencia: incidenciaTipo,
      descripcion: incidenciaDescripcion,
      hora: new Date().toTimeString().slice(0, 5),
    })
    setIncidenciaServicioId(null)
    setIncidenciaDescripcion('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold text-ink-950">Servicios</h1>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-600">
              CU-05 · CU-06 · CU-07 · CU-08
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Asigna vehículo y conductor a una reserva confirmada, y da seguimiento al viaje.
          </p>
        </div>
        <button
          onClick={openNew}
          disabled={reservasDisponibles.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} /> Nuevo servicio
        </button>
      </div>

      {reservasDisponibles.length === 0 && (
        <p className="rounded-lg bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
          No hay reservas confirmadas pendientes de asignar. Aprueba y convierte una cotización primero.
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-panel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Código</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Vehículo</th>
              <th className="px-5 py-3">Conductor</th>
              <th className="px-5 py-3">Origen → Destino</th>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-slate-400">Cargando servicios…</td></tr>
            )}
            {!loading && servicios.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                  Aún no hay servicios generados.
                </td>
              </tr>
            )}
            {servicios.map((s) => (
              <tr key={s.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-ink-950">{s.codigo}</td>
                <td className="px-5 py-3">{clienteNombre(s.cliente_id)}</td>
                <td className="px-5 py-3 text-slate-500">{vehiculoPlaca(s.vehiculo_id)}</td>
                <td className="px-5 py-3 text-slate-500">{conductorNombre(s.conductor_id)}</td>
                <td className="px-5 py-3 text-slate-500">{s.origen} → {s.destino}</td>
                <td className="px-5 py-3 text-slate-500">{s.fecha} {s.hora}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${estadoStyles[s.estado]}`}>
                    {s.estado.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap justify-end gap-1 text-xs">
                    {s.estado === 'programado' && (
                      <button onClick={() => handleIniciar(s.id)} className="rounded-md px-2 py-1 font-medium text-teal-600 hover:bg-teal-50">
                        Iniciar
                      </button>
                    )}
                    {s.estado === 'en_proceso' && (
                      <button onClick={() => handleFinalizar(s.id)} className="rounded-md px-2 py-1 font-medium text-emerald-600 hover:bg-emerald-50">
                        Finalizar
                      </button>
                    )}
                    {(s.estado === 'programado' || s.estado === 'en_proceso') && (
                      <>
                        <button onClick={() => setIncidenciaServicioId(s.id)} className="rounded-md px-2 py-1 text-amber-600 hover:bg-amber-50">
                          Incidencia
                        </button>
                        <button onClick={() => handleCancelar(s.id)} className="rounded-md px-2 py-1 text-rose-500 hover:bg-rose-50">
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title="Nuevo servicio" onClose={() => setModalOpen(false)}>
          <div className="space-y-4">
            <Field
              label="Reserva confirmada"
              as="select"
              value={reservaId}
              onChange={(v) => {
                setReservaId(v)
                setConflicto(false)
              }}
              options={[
                { value: '', label: 'Selecciona una reserva…' },
                ...reservasDisponibles.map((r) => ({
                  value: r.id,
                  label: `${r.codigo} · ${clienteNombre(r.cliente_id)} · ${r.fecha_viaje}`,
                })),
              ]}
            />
            <Field
              label="Vehículo disponible"
              as="select"
              value={vehiculoId}
              onChange={(v) => {
                setVehiculoId(v)
                checarConflicto(v, conductorId)
              }}
              options={[
                { value: '', label: 'Selecciona un vehículo…' },
                ...vehiculos.map((v) => ({ value: v.id, label: `${v.placa} · ${v.marca} ${v.modelo}` })),
              ]}
            />
            <Field
              label="Conductor disponible"
              as="select"
              value={conductorId}
              onChange={(v) => {
                setConductorId(v)
                checarConflicto(vehiculoId, v)
              }}
              options={[
                { value: '', label: 'Selecciona un conductor…' },
                ...conductores.map((c) => ({ value: c.id, label: `${c.nombres} ${c.apellidos}` })),
              ]}
            />

            {conflicto && (
              <p className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
                <AlertTriangle size={16} /> Este vehículo o conductor ya tiene un servicio ese día.
              </p>
            )}
            {formError && <p className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{formError}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100">
                Cancelar
              </button>
              <button
                onClick={handleGenerarServicio}
                disabled={saving}
                className="rounded-lg bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60"
              >
                {saving ? 'Generando…' : 'Confirmar y generar servicio'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {incidenciaServicioId && (
        <Modal title="Registrar incidencia" onClose={() => setIncidenciaServicioId(null)}>
          <div className="space-y-4">
            <Field
              label="Tipo"
              as="select"
              value={incidenciaTipo}
              onChange={setIncidenciaTipo}
              options={[
                { value: 'Retraso', label: 'Retraso' },
                { value: 'Falla mecánica', label: 'Falla mecánica' },
                { value: 'Accidente', label: 'Accidente' },
                { value: 'Otro', label: 'Otro' },
              ]}
            />
            <Field label="Descripción" value={incidenciaDescripcion} onChange={setIncidenciaDescripcion} />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setIncidenciaServicioId(null)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100">
                Cancelar
              </button>
              <button onClick={handleAgregarIncidencia} className="rounded-lg bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800">
                Guardar incidencia
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
