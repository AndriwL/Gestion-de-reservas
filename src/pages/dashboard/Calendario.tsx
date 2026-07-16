import { useEffect, useMemo, useState } from 'react'
import type { Cliente, Servicio } from '@/types'
import { listarClientes } from '@/services/clientes'
import { listarServicios } from '@/services/servicios'
import { Modal } from '@/components/dashboard/Modal'

const vistas = ['Mensual', 'Semanal', 'Diaria'] as const

const leyenda: { estado: Servicio['estado']; label: string; color: string }[] = [
  { estado: 'programado', label: 'Programado', color: 'bg-teal-500' },
  { estado: 'en_proceso', label: 'En proceso', color: 'bg-amber-500' },
  { estado: 'finalizado', label: 'Finalizado', color: 'bg-emerald-500' },
  { estado: 'cancelado', label: 'Cancelado', color: 'bg-rose-500' },
]

const colorPorEstado: Record<Servicio['estado'], string> = {
  programado: 'bg-teal-500',
  en_proceso: 'bg-amber-500',
  finalizado: 'bg-emerald-500',
  cancelado: 'bg-rose-500',
}

export function Calendario() {
  const [vista, setVista] = useState<(typeof vistas)[number]>('Mensual')
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [detalle, setDetalle] = useState<Servicio | null>(null)

  useEffect(() => {
    Promise.all([listarServicios(), listarClientes()]).then(([srv, clis]) => {
      setServicios(srv)
      setClientes(clis)
    })
  }, [])

  const clienteNombre = useMemo(() => {
    const map = new Map(clientes.map((c) => [c.id, c.nombres_razon_social]))
    return (id: string) => map.get(id) ?? '—'
  }, [clientes])

  const hoy = new Date()
  const anio = hoy.getFullYear()
  const mes = hoy.getMonth()
  const diasEnMes = new Date(anio, mes + 1, 0).getDate()
  const primerDiaSemana = (new Date(anio, mes, 1).getDay() + 6) % 7 // 0 = lunes

  const serviciosPorDia = useMemo(() => {
    const map = new Map<number, Servicio[]>()
    servicios.forEach((s) => {
      const f = new Date(`${s.fecha}T00:00:00`)
      if (f.getFullYear() === anio && f.getMonth() === mes) {
        const dia = f.getDate()
        map.set(dia, [...(map.get(dia) ?? []), s])
      }
    })
    return map
  }, [servicios, anio, mes])

  const celdas = [...Array(primerDiaSemana).fill(null), ...Array.from({ length: diasEnMes }, (_, i) => i + 1)]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-950">Calendario de servicios</h1>
          <p className="mt-1 text-sm text-slate-500">
            {hoy.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })} — servicios programados en el sistema.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
          {vistas.map((v) => (
            <button
              key={v}
              onClick={() => setVista(v)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                vista === v ? 'bg-ink-950 text-white' : 'text-slate-500 hover:text-ink-950'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          {leyenda.map((l) => (
            <span key={l.estado} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${l.color}`} /> {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-panel">
        <p className="mb-4 text-sm text-slate-500">
          Vista {vista.toLowerCase()} — haz clic en un servicio para ver cliente, vehículo, conductor, hora y
          estado.
        </p>
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-400">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
            <div key={d} className="py-1 font-semibold uppercase">{d}</div>
          ))}
          {celdas.map((dia, idx) => (
            <div
              key={idx}
              className={`flex h-24 flex-col rounded-lg border p-2 text-left ${
                dia ? 'border-slate-100 hover:border-teal-300' : 'border-transparent'
              }`}
            >
              {dia && (
                <>
                  <span className="text-slate-400">{dia}</span>
                  <div className="mt-1 space-y-1 overflow-y-auto">
                    {(serviciosPorDia.get(dia) ?? []).slice(0, 3).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setDetalle(s)}
                        className="flex w-full items-center gap-1 rounded-md bg-slate-50 px-1.5 py-1 text-left text-[11px] text-ink-950"
                        title={`${clienteNombre(s.cliente_id)} · ${s.hora}`}
                      >
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${colorPorEstado[s.estado]}`} />
                        <span className="truncate">{clienteNombre(s.cliente_id)}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {detalle && (
        <Modal title={`Servicio ${detalle.codigo}`} onClose={() => setDetalle(null)}>
          <div className="space-y-2 text-sm">
            <p><span className="text-slate-500">Cliente:</span> {clienteNombre(detalle.cliente_id)}</p>
            <p><span className="text-slate-500">Ruta:</span> {detalle.origen} → {detalle.destino}</p>
            <p><span className="text-slate-500">Fecha:</span> {detalle.fecha} {detalle.hora}</p>
            <p><span className="text-slate-500">Estado:</span> {detalle.estado.replace('_', ' ')}</p>
          </div>
        </Modal>
      )}
    </div>
  )
}
