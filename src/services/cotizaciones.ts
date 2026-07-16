import { supabase } from '@/lib/supabase'
import type { Cotizacion, Reserva } from '@/types'
import { generarCodigo } from './codigo'
import { obtenerOCrearRuta } from './rutas'
import { confirmarReserva } from './reservas'

// Clase: Cotizacion (CU-04)
// Métodos del diagrama: calcularCostoEstimado() · ajustarMonto() ·
// agregarObservaciones() · cambiarEstado() · convertirAReserva(): Reserva

export type NuevaCotizacion = Omit<
  Cotizacion,
  'id' | 'created_at' | 'codigo' | 'costo_estimado' | 'estado' | 'ruta_id'
> & { costo_estimado?: number }

const TARIFA_BASE: Record<Cotizacion['tipo_vehiculo'], number> = {
  auto: 80,
  van: 150,
  minibus: 260,
  bus: 420,
}

export async function listarCotizaciones(): Promise<Cotizacion[]> {
  const { data, error } = await supabase
    .from('cotizaciones')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Cotizacion[]
}

/** calcularCostoEstimado(): int */
export function calcularCostoEstimado(input: {
  tipo_vehiculo: Cotizacion['tipo_vehiculo']
  pasajeros: number
}): number {
  const base = TARIFA_BASE[input.tipo_vehiculo] ?? 100
  const recargoPasajeros = Math.max(0, input.pasajeros - 4) * 10
  return base + recargoPasajeros
}

async function siguienteCodigo(prefijo: string, tabla: 'cotizaciones' | 'reservas' | 'servicios' | 'pagos') {
  const { count, error } = await supabase.from(tabla).select('id', { count: 'exact', head: true })
  if (error) throw error
  return generarCodigo(prefijo, (count ?? 0) + 1)
}

export async function registrarCotizacion(input: NuevaCotizacion) {
  const costo_estimado = input.costo_estimado ?? calcularCostoEstimado(input)
  const ruta = await obtenerOCrearRuta(input.origen, input.destino)
  const codigo = await siguienteCodigo('COT', 'cotizaciones')

  const { data, error } = await supabase
    .from('cotizaciones')
    .insert({ ...input, ruta_id: ruta.id, costo_estimado, codigo, estado: 'pendiente' })
    .select()
    .single()
  if (error) throw error
  return data as Cotizacion
}

/** ajustarMonto(): void */
export async function ajustarMonto(id: string, nuevoMonto: number) {
  const { error } = await supabase.from('cotizaciones').update({ costo_estimado: nuevoMonto }).eq('id', id)
  if (error) throw error
}

/** agregarObservaciones(): void */
export async function agregarObservaciones(id: string, observaciones: string) {
  const { error } = await supabase.from('cotizaciones').update({ observaciones }).eq('id', id)
  if (error) throw error
}

/** cambiarEstado(): void */
export async function cambiarEstadoCotizacion(id: string, estado: Cotizacion['estado']) {
  const { error } = await supabase.from('cotizaciones').update({ estado }).eq('id', id)
  if (error) throw error
}

/**
 * convertirAReserva(): Reserva
 * Aprueba la cotización y genera la Reserva asociada (relación técnica
 * Cotizacion -> Reserva del diagrama de clases).
 */
export async function convertirAReserva(cotizacionId: string): Promise<Reserva> {
  const { data: cotizacion, error } = await supabase
    .from('cotizaciones')
    .select('*')
    .eq('id', cotizacionId)
    .single()
  if (error) throw error
  const cot = cotizacion as Cotizacion

  if (cot.estado === 'convertida') {
    throw new Error('Esta cotización ya fue convertida en una reserva.')
  }

  const codigo = await siguienteCodigo('RES', 'reservas')

  const { data: reserva, error: reservaError } = await supabase
    .from('reservas')
    .insert({
      codigo,
      cotizacion_id: cot.id,
      cliente_id: cot.cliente_id,
      cantidad_pasajeros: cot.pasajeros,
      fecha_viaje: cot.fecha,
      hora_salida: cot.hora,
      costo_total: cot.costo_estimado,
      saldo_pendiente: cot.costo_estimado,
      estado: 'pendiente',
    })
    .select()
    .single()
  if (reservaError) throw reservaError

  await cambiarEstadoCotizacion(cot.id, 'convertida')

  return reserva as Reserva
}

/** Atajo: aprobar + convertir + confirmar en un solo paso desde la UI. */
export async function aprobarYConfirmarReserva(cotizacionId: string) {
  await cambiarEstadoCotizacion(cotizacionId, 'aprobada')
  const reserva = await convertirAReserva(cotizacionId)
  await confirmarReserva(reserva.id)
  return reserva
}

export async function eliminarCotizacion(id: string) {
  const { error } = await supabase.from('cotizaciones').delete().eq('id', id)
  if (error) throw error
}
