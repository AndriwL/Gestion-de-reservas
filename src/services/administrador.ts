import { supabase } from '@/lib/supabase'
import type { Servicio, Vehiculo } from '@/types'

// Clase: Administrador (fachada del sistema)
// - iniciarSesion() / cerrarSesion() -> resueltos por AuthContext (Supabase Auth)
// - registrarCliente() / registrarConductor() / registrarCotizacion() /
//   registrarPago() / registrarSolicitudServicio() -> delegan en el
//   servicio de cada clase (services/clientes.ts, conductores.ts, etc.)
// - asignarServicio() -> services/reservas.ts#generarServicio()
// Aquí solo se implementan las dos consultas propias de este módulo:

/** consultarDisponibilidad(): List<Vehiculo> */
export async function consultarDisponibilidad(): Promise<Vehiculo[]> {
  const { data, error } = await supabase.from('vehiculos').select('*').eq('estado', 'disponible')
  if (error) throw error
  return (data ?? []) as Vehiculo[]
}

/** consultarHistorialServicios(): List<Servicio> (CU-10) */
export async function consultarHistorialServicios(filtros?: {
  clienteId?: string
  vehiculoId?: string
  conductorId?: string
  desde?: string
  hasta?: string
}): Promise<Servicio[]> {
  let query = supabase.from('servicios').select('*').order('fecha', { ascending: false })

  if (filtros?.clienteId) query = query.eq('cliente_id', filtros.clienteId)
  if (filtros?.vehiculoId) query = query.eq('vehiculo_id', filtros.vehiculoId)
  if (filtros?.conductorId) query = query.eq('conductor_id', filtros.conductorId)
  if (filtros?.desde) query = query.gte('fecha', filtros.desde)
  if (filtros?.hasta) query = query.lte('fecha', filtros.hasta)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Servicio[]
}
