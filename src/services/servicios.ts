import { supabase } from '@/lib/supabase'
import type { Servicio, Incidencia } from '@/types'

// Clase: Servicio (CU-05, CU-06, CU-07, CU-08)
// Métodos del diagrama: agregarIncidencia() · asignarConductor() ·
// asignarVehiculo() · cambiarEstado() · estaActivo() · finalizarServicio() ·
// iniciarServicio() · notificarConductor() · validarConflictoHorario()

export async function listarServicios(): Promise<Servicio[]> {
  const { data, error } = await supabase.from('servicios').select('*').order('fecha', { ascending: false })
  if (error) throw error
  return (data ?? []) as Servicio[]
}

export async function obtenerServicio(id: string): Promise<Servicio> {
  const { data, error } = await supabase.from('servicios').select('*').eq('id', id).single()
  if (error) throw error
  return data as Servicio
}

/**
 * validarConflictoHorario(): boolean
 * true si el vehículo o el conductor YA tienen un servicio programado/en
 * proceso que se cruza con la fecha indicada.
 */
export async function validarConflictoHorario(
  vehiculoId: string,
  conductorId: string,
  fecha: string,
  excluirServicioId?: string
): Promise<boolean> {
  let query = supabase
    .from('servicios')
    .select('id')
    .eq('fecha', fecha)
    .in('estado', ['programado', 'en_proceso'])
    .or(`vehiculo_id.eq.${vehiculoId},conductor_id.eq.${conductorId}`)

  if (excluirServicioId) query = query.neq('id', excluirServicioId)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).length > 0
}

/** asignarVehiculo(): boolean */
export async function asignarVehiculo(servicioId: string, vehiculoId: string): Promise<boolean> {
  const { error } = await supabase.from('servicios').update({ vehiculo_id: vehiculoId }).eq('id', servicioId)
  if (error) throw error
  return true
}

/** asignarConductor(): boolean */
export async function asignarConductor(servicioId: string, conductorId: string): Promise<boolean> {
  const { error } = await supabase.from('servicios').update({ conductor_id: conductorId }).eq('id', servicioId)
  if (error) throw error
  return true
}

/** cambiarEstado(): void */
export async function cambiarEstadoServicio(id: string, estado: Servicio['estado']) {
  const { error } = await supabase.from('servicios').update({ estado }).eq('id', id)
  if (error) throw error
}

/** estaActivo(): boolean */
export function estaActivo(servicio: Servicio): boolean {
  return servicio.estado === 'programado' || servicio.estado === 'en_proceso'
}

/** iniciarServicio(): void */
export async function iniciarServicio(id: string) {
  await cambiarEstadoServicio(id, 'en_proceso')
  const { error } = await supabase
    .from('servicios')
    .update({ fecha_ejecucion: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

/** finalizarServicio(): void — libera vehículo y conductor. */
export async function finalizarServicio(id: string) {
  const servicio = await obtenerServicio(id)
  await cambiarEstadoServicio(id, 'finalizado')
  await Promise.all([
    supabase.from('vehiculos').update({ estado: 'disponible' }).eq('id', servicio.vehiculo_id),
    supabase.from('conductores').update({ estado: 'disponible' }).eq('id', servicio.conductor_id),
  ])
}

/** notificarConductor(): void — placeholder de notificación (email/push). */
export async function notificarConductor(servicioId: string) {
  // En un entorno real esto dispararía una Edge Function / correo / push.
  // eslint-disable-next-line no-console
  console.info(`Notificación enviada al conductor del servicio ${servicioId}.`)
}

/** agregarIncidencia(): void (CU-08) */
export async function agregarIncidencia(input: Omit<Incidencia, 'id' | 'created_at' | 'estado'>) {
  const { data, error } = await supabase
    .from('incidencias')
    .insert({ ...input, estado: 'abierta' })
    .select()
    .single()
  if (error) throw error
  return data as Incidencia
}

export async function listarIncidenciasPorServicio(servicioId: string): Promise<Incidencia[]> {
  const { data, error } = await supabase
    .from('incidencias')
    .select('*')
    .eq('servicio_id', servicioId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Incidencia[]
}

export async function cancelarServicio(id: string) {
  const servicio = await obtenerServicio(id)
  await cambiarEstadoServicio(id, 'cancelado')
  await Promise.all([
    supabase.from('vehiculos').update({ estado: 'disponible' }).eq('id', servicio.vehiculo_id),
    supabase.from('conductores').update({ estado: 'disponible' }).eq('id', servicio.conductor_id),
  ])
}
