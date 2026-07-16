import { supabase } from '@/lib/supabase'
import type { Reserva, Servicio, Vehiculo, Conductor } from '@/types'
import { generarCodigo } from './codigo'

// Clase: Reserva (entidad intermedia Cotizacion -> Reserva -> Servicio)
// Métodos del diagrama: calcularCostoTotal() · actualizarSaldoPendiente() ·
// confirmarReserva() · generarServicio(): Servicio ·
// verificarDisponibilidadRecursos() · cambiarEstado()

export async function listarReservas(): Promise<Reserva[]> {
  const { data, error } = await supabase.from('reservas').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Reserva[]
}

/** calcularCostoTotal(): int */
export async function calcularCostoTotal(id: string, costoTotal: number) {
  const { error } = await supabase.from('reservas').update({ costo_total: costoTotal }).eq('id', id)
  if (error) throw error
}

/** actualizarSaldoPendiente(): void */
export async function actualizarSaldoPendiente(id: string, saldoPendiente: number) {
  const { error } = await supabase.from('reservas').update({ saldo_pendiente: saldoPendiente }).eq('id', id)
  if (error) throw error
}

/** cambiarEstado(): void */
export async function cambiarEstadoReserva(id: string, estado: Reserva['estado']) {
  const { error } = await supabase.from('reservas').update({ estado }).eq('id', id)
  if (error) throw error
}

/** confirmarReserva(): boolean */
export async function confirmarReserva(id: string): Promise<boolean> {
  const disponible = await verificarDisponibilidadRecursos()
  if (!disponible) return false
  await cambiarEstadoReserva(id, 'confirmada')
  return true
}

/**
 * verificarDisponibilidadRecursos(): boolean
 * Comprueba que existan vehículos y conductores disponibles antes de
 * confirmar o generar el servicio (CU-06).
 */
export async function verificarDisponibilidadRecursos(): Promise<boolean> {
  const [{ count: vehiculosDisp }, { count: conductoresDisp }] = await Promise.all([
    supabase.from('vehiculos').select('id', { count: 'exact', head: true }).eq('estado', 'disponible'),
    supabase.from('conductores').select('id', { count: 'exact', head: true }).eq('estado', 'disponible'),
  ])
  return (vehiculosDisp ?? 0) > 0 && (conductoresDisp ?? 0) > 0
}

export async function listarVehiculosDisponibles(): Promise<Vehiculo[]> {
  const { data, error } = await supabase.from('vehiculos').select('*').eq('estado', 'disponible')
  if (error) throw error
  return (data ?? []) as Vehiculo[]
}

export async function listarConductoresDisponibles(): Promise<Conductor[]> {
  const { data, error } = await supabase.from('conductores').select('*').eq('estado', 'disponible')
  if (error) throw error
  return (data ?? []) as Conductor[]
}

/**
 * generarServicio(): Servicio
 * Crea el Servicio a partir de una Reserva confirmada, asignando
 * vehículo y conductor (equivalente a CU-05/CU-07: Asignar Servicio).
 */
export async function generarServicio(
  reservaId: string,
  vehiculoId: string,
  conductorId: string
): Promise<Servicio> {
  const { data: reserva, error } = await supabase.from('reservas').select('*').eq('id', reservaId).single()
  if (error) throw error
  const res = reserva as Reserva

  const { data: cotizacion, error: cotError } = await supabase
    .from('cotizaciones')
    .select('origen, destino, ruta_id')
    .eq('id', res.cotizacion_id)
    .single()
  if (cotError) throw cotError

  const { count, error: countError } = await supabase.from('servicios').select('id', { count: 'exact', head: true })
  if (countError) throw countError
  const codigo = generarCodigo('SRV', (count ?? 0) + 1)

  const { data: servicio, error: servicioError } = await supabase
    .from('servicios')
    .insert({
      codigo,
      reserva_id: res.id,
      cliente_id: res.cliente_id,
      vehiculo_id: vehiculoId,
      conductor_id: conductorId,
      ruta_id: cotizacion.ruta_id,
      origen: cotizacion.origen,
      destino: cotizacion.destino,
      fecha: res.fecha_viaje,
      hora: res.hora_salida,
      estado: 'programado',
    })
    .select()
    .single()
  if (servicioError) throw servicioError

  await Promise.all([
    supabase.from('vehiculos').update({ estado: 'en_servicio' }).eq('id', vehiculoId),
    supabase.from('conductores').update({ estado: 'en_servicio' }).eq('id', conductorId),
    cambiarEstadoReserva(res.id, 'convertida'),
  ])

  return servicio as Servicio
}
