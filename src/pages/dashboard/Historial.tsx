import { useEffect, useMemo, useState } from 'react'
import type { Cliente, Conductor, Servicio, Vehiculo } from '@/types'
import { listarClientes } from '@/services/clientes'
import { listarVehiculos } from '@/services/vehiculos'
import { listarConductores } from '@/services/conductores'
import { listarIncidenciasPorServicio } from '@/services/servicios'
import { consultarHistorialServicios } from '@/services/administrador'
import { Modal } from '@/components/dashboard/Modal'
import { Field } from '@/components/dashboard/Field'
import type { Incidencia } from '@/types'

const estadoStyles: Record<Servicio['estado'], string> = {
  programado: 'bg-teal-50 text-teal-600',
  en_proceso: 'bg-amber-50 text-amber-600',
  finalizado: 'bg-emerald-50 text-emerald-600',
  cancelado: 'bg-rose-50 text-rose-600',
}

export function Historial() {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [conductores, setConductores] = useState<Conductor[]>([])
  const [loading, setLoading] = useState(true)

  const [filtroCliente, setFiltroCliente] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [detalle, setDetalle] = useState<Servicio | null>(null)
  const [incidencias, setIncidencias] = useState<Incidencia[]>([])

  async function cargar() {
    setLoading(true)
    try {
      const [srv, clis, vehis, drivers] = await Promise.all([
        consultarHistorialServicios({ clienteId: filtroCliente || undefined }),
        listarClientes(),
        listarVehiculos(),
        listarConductores(),
      ])
      setServicios(filtroEstado ? srv.filter((s) => s.estado === filtroEstado) : srv)
      setClientes(clis)
      setVehiculos(vehis)
      setConductores(drivers)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroCliente, filtroEstado])

  const clienteNombre = useMemo(() => {
    const map = new Map(clientes.map((c) => [c.id, c.nombres_razon_social]))
    return (id: string) => map.get(id) ?? '—'
  }, [clientes])

  const vehiculoPlaca = useMemo(() => {
    const map = new Map(vehiculos.map((v) => [v.id, v.placa]))
    return (id: string) => map.get(id) ?? '—'
  }, [vehiculos])

  const conductorNombre = useMemo(() => {
    const map = new Map(conductores.map((c) => [c.id, `${c.nombres} ${c.apellidos}`]))
    return (id: string) => map.get(id) ?? '—'
  }, [conductores])

  async function verDetalle(s: Servicio) {
    setDetalle(s)
    setIncidencias(await listarIncidenciasPorServicio(s.id))
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-extrabold text-ink-950">Historial</h1>
          
        </div>
        <p className="mt-1 text-sm text-slate-500">Consulta el detalle completo de servicios pasados.</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="w-56">
          <Field
            label="Cliente"
            as="select"
            value={filtroCliente}
            onChange={setFiltroCliente}
            options={[{ value: '', label: 'Todos' }, ...clientes.map((c) => ({ value: c.id, label: c.nombres_razon_social }))]}
            required={false}
          />
        </div>
        <div className="w-56">
          <Field
            label="Estado"
            as="select"
            value={filtroEstado}
            onChange={setFiltroEstado}
            options={[
              { value: '', label: 'Todos' },
              { value: 'programado', label: 'Programado' },
              { value: 'en_proceso', label: 'En proceso' },
              { value: 'finalizado', label: 'Finalizado' },
              { value: 'cancelado', label: 'Cancelado' },
            ]}
            required={false}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-panel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Servicio</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Vehículo</th>
              <th className="px-5 py-3">Conductor</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Cargando historial…</td></tr>
            )}
            {!loading && servicios.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">No hay servicios que coincidan con el filtro.</td></tr>
            )}
            {servicios.map((s) => (
              <tr key={s.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-ink-950">{s.codigo}</td>
                <td className="px-5 py-3">{clienteNombre(s.cliente_id)}</td>
                <td className="px-5 py-3 text-slate-500">{vehiculoPlaca(s.vehiculo_id)}</td>
                <td className="px-5 py-3 text-slate-500">{conductorNombre(s.conductor_id)}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${estadoStyles[s.estado]}`}>
                    {s.estado.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => verDetalle(s)} className="rounded-md px-2 py-1 text-xs font-medium text-teal-600 hover:bg-teal-50">
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detalle && (
        <Modal title={`Detalle del servicio ${detalle.codigo}`} onClose={() => setDetalle(null)}>
          <div className="space-y-3 text-sm">
            <p><span className="text-slate-500">Cliente:</span> {clienteNombre(detalle.cliente_id)}</p>
            <p><span className="text-slate-500">Vehículo:</span> {vehiculoPlaca(detalle.vehiculo_id)}</p>
            <p><span className="text-slate-500">Conductor:</span> {conductorNombre(detalle.conductor_id)}</p>
            <p><span className="text-slate-500">Ruta:</span> {detalle.origen} → {detalle.destino}</p>
            <p><span className="text-slate-500">Fecha:</span> {detalle.fecha} {detalle.hora}</p>
            <p><span className="text-slate-500">Estado:</span> {detalle.estado}</p>
            {detalle.observaciones && <p><span className="text-slate-500">Observaciones:</span> {detalle.observaciones}</p>}

            <div className="pt-2">
              <p className="mb-2 font-semibold text-ink-950">Incidencias</p>
              {incidencias.length === 0 ? (
                <p className="text-slate-400">Sin incidencias registradas.</p>
              ) : (
                <ul className="space-y-2">
                  {incidencias.map((i) => (
                    <li key={i.id} className="rounded-lg bg-slate-50 px-3 py-2">
                      <span className="font-medium text-ink-950">{i.tipo_incidencia}</span> — {i.descripcion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
