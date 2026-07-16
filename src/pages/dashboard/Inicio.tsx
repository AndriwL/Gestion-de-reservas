import { useEffect, useMemo, useState } from 'react'
import { Car, ClipboardList, UserCheck, Users, Wallet } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { StatCard } from '@/components/dashboard/StatCard'
import type { Cliente, Pago, Servicio, Vehiculo, Conductor } from '@/types'
import { listarClientes } from '@/services/clientes'
import { listarVehiculos } from '@/services/vehiculos'
import { listarConductores } from '@/services/conductores'
import { listarServicios } from '@/services/servicios'
import { listarPagos } from '@/services/pagos'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export function Inicio() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [conductores, setConductores] = useState<Conductor[]>([])
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listarClientes(), listarVehiculos(), listarConductores(), listarServicios(), listarPagos()])
      .then(([clis, vehis, drivers, srv, pgs]) => {
        setClientes(clis)
        setVehiculos(vehis)
        setConductores(drivers)
        setServicios(srv)
        setPagos(pgs)
      })
      .finally(() => setLoading(false))
  }, [])

  const hoy = new Date().toISOString().slice(0, 10)
  const serviciosHoy = servicios.filter((s) => s.fecha === hoy).length
  const vehiculosDisponibles = vehiculos.filter((v) => v.estado === 'disponible').length
  const conductoresDisponibles = conductores.filter((c) => c.estado === 'disponible').length
  const pagosPendientes = pagos.filter((p) => p.estado !== 'cancelado').length

  const serviciosPorMes = useMemo(() => {
    const conteo = new Array(12).fill(0)
    servicios.forEach((s) => {
      const mesIdx = new Date(`${s.fecha}T00:00:00`).getMonth()
      conteo[mesIdx] += 1
    })
    return MESES.map((mes, i) => ({ mes, servicios: conteo[i] }))
  }, [servicios])

  const ultimosServicios = servicios.slice(0, 3)
  const ultimosPagos = pagos.slice(0, 3)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink-950">Resumen general</h1>
        <p className="mt-1 text-sm text-slate-500">
          Indicadores del sistema. Este panel es solo informativo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={Users} label="Clientes registrados" value={loading ? '—' : clientes.length} accent="teal" />
        <StatCard icon={Car} label="Vehículos disponibles" value={loading ? '—' : vehiculosDisponibles} accent="ink" />
        <StatCard icon={UserCheck} label="Conductores disponibles" value={loading ? '—' : conductoresDisponibles} accent="ink" />
        <StatCard icon={ClipboardList} label="Servicios del día" value={loading ? '—' : serviciosHoy} accent="amber" />
        <StatCard icon={Wallet} label="Pagos pendientes" value={loading ? '—' : pagosPendientes} accent="rose" />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-panel">
        <h2 className="mb-4 font-display font-bold text-ink-950">Servicios por mes</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={serviciosPorMes}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip cursor={{ fill: '#F8FAFC' }} />
            <Bar dataKey="servicios" fill="#14B8A6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-panel">
          <h3 className="mb-4 font-display font-bold text-ink-950">Últimos servicios</h3>
          {ultimosServicios.length === 0 ? (
            <p className="text-sm text-slate-400">Aún no hay servicios registrados.</p>
          ) : (
            <ul className="space-y-3">
              {ultimosServicios.map((s) => (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-ink-950">{s.codigo}</p>
                    <p className="text-slate-500">{s.origen} → {s.destino}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs capitalize text-slate-600">
                    {s.estado.replace('_', ' ')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-panel">
          <h3 className="mb-4 font-display font-bold text-ink-950">Últimos pagos</h3>
          {ultimosPagos.length === 0 ? (
            <p className="text-sm text-slate-400">Aún no hay pagos registrados.</p>
          ) : (
            <ul className="space-y-3">
              {ultimosPagos.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-ink-950">{p.codigo}</p>
                    <p className="capitalize text-slate-500">{p.metodo_pago.replace('_', ' ')}</p>
                  </div>
                  <span className="font-semibold text-teal-600">S/ {Number(p.monto).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
