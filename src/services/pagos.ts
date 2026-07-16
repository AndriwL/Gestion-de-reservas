import { supabase } from '@/lib/supabase'
import type { Pago, Comprobante } from '@/types'
import { generarCodigo } from './codigo'

// Clase: Pago (CU-09)
// Métodos del diagrama: validarMetodoPago() · calcularSaldoPendiente() ·
// actualizarEstadoPago() · generarComprobante(): Comprobante

const METODOS_VALIDOS: Pago['metodo_pago'][] = ['efectivo', 'transferencia', 'tarjeta', 'yape_plin']

export async function listarPagos(): Promise<Pago[]> {
  const { data, error } = await supabase.from('pagos').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Pago[]
}

/** validarMetodoPago(): boolean */
export function validarMetodoPago(metodo: string): metodo is Pago['metodo_pago'] {
  return METODOS_VALIDOS.includes(metodo as Pago['metodo_pago'])
}

/** calcularSaldoPendiente(): int — costo total del servicio menos lo ya pagado. */
export async function calcularSaldoPendiente(servicioId: string, montoNuevoPago: number): Promise<number> {
  const { data, error } = await supabase.from('pagos').select('monto').eq('servicio_id', servicioId)
  if (error) throw error
  const pagado = (data ?? []).reduce((acc, p) => acc + Number(p.monto), 0)

  const { data: reserva } = await supabase
    .from('reservas')
    .select('costo_total')
    .eq('id', (await servicioReservaId(servicioId)) ?? '')
    .maybeSingle()

  const costoTotal = reserva?.costo_total ?? montoNuevoPago + pagado
  return Math.max(0, Number(costoTotal) - (pagado + montoNuevoPago))
}

async function servicioReservaId(servicioId: string) {
  const { data } = await supabase.from('servicios').select('reserva_id').eq('id', servicioId).maybeSingle()
  return data?.reserva_id ?? null
}

export type NuevoPago = Omit<Pago, 'id' | 'created_at' | 'codigo' | 'saldo' | 'estado'>

export async function registrarPago(input: NuevoPago) {
  if (!validarMetodoPago(input.metodo_pago)) {
    throw new Error('Método de pago no reconocido.')
  }

  const saldo = await calcularSaldoPendiente(input.servicio_id, input.monto)
  const estado: Pago['estado'] = saldo <= 0 ? 'cancelado' : 'parcial'

  const { count, error: countError } = await supabase.from('pagos').select('id', { count: 'exact', head: true })
  if (countError) throw countError
  const codigo = generarCodigo('PAG', (count ?? 0) + 1)

  const { data, error } = await supabase
    .from('pagos')
    .insert({ ...input, codigo, saldo, estado })
    .select()
    .single()
  if (error) throw error

  const reservaId = await servicioReservaId(input.servicio_id)
  if (reservaId) {
    await supabase.from('reservas').update({ saldo_pendiente: saldo }).eq('id', reservaId)
  }

  return data as Pago
}

/** actualizarEstadoPago(): void */
export async function actualizarEstadoPago(id: string, estado: Pago['estado']) {
  const { error } = await supabase.from('pagos').update({ estado }).eq('id', id)
  if (error) throw error
}

/** generarComprobante(): Comprobante */
export async function generarComprobante(
  pagoId: string,
  tipo: Comprobante['tipo'] = 'boleta'
): Promise<Comprobante> {
  const { data: pago, error } = await supabase.from('pagos').select('*').eq('id', pagoId).single()
  if (error) throw error

  const { count, error: countError } = await supabase.from('comprobantes').select('id', { count: 'exact', head: true })
  if (countError) throw countError
  const nro_comprobante = generarCodigo(tipo === 'factura' ? 'F001' : 'B001', (count ?? 0) + 1)

  const { data, error: compError } = await supabase
    .from('comprobantes')
    .insert({
      pago_id: pagoId,
      nro_comprobante,
      tipo,
      monto_total: pago.monto,
    })
    .select()
    .single()
  if (compError) throw compError
  return data as Comprobante
}

export async function obtenerComprobantePorPago(pagoId: string): Promise<Comprobante | null> {
  const { data, error } = await supabase.from('comprobantes').select('*').eq('pago_id', pagoId).maybeSingle()
  if (error) throw error
  return (data as Comprobante) ?? null
}
