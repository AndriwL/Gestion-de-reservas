import { supabase } from '@/lib/supabase'
import type { Vehiculo } from '@/types'

// Clase: Vehiculo
// Métodos del diagrama: validarPlaca() · actualizarEstado() ·
// actualizarKilometraje() · estaDisponible()

export type NuevoVehiculo = Omit<Vehiculo, 'id' | 'created_at' | 'estado'>

export async function listarVehiculos(): Promise<Vehiculo[]> {
  const { data, error } = await supabase
    .from('vehiculos')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Vehiculo[]
}

/** validarPlaca(): boolean — la placa debe ser única. */
export async function validarPlaca(placa: string, excluirId?: string): Promise<boolean> {
  let query = supabase.from('vehiculos').select('id').eq('placa', placa)
  if (excluirId) query = query.neq('id', excluirId)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []).length === 0
}

/** estaDisponible(): boolean — CU-06, consulta rápida de disponibilidad. */
export async function estaDisponible(id: string): Promise<boolean> {
  const { data, error } = await supabase.from('vehiculos').select('estado').eq('id', id).single()
  if (error) throw error
  return data?.estado === 'disponible'
}

export async function registrarVehiculo(input: NuevoVehiculo) {
  const placaValida = await validarPlaca(input.placa)
  if (!placaValida) throw new Error('Ya existe un vehículo registrado con esa placa.')

  const { data, error } = await supabase
    .from('vehiculos')
    .insert({ ...input, estado: 'disponible' })
    .select()
    .single()
  if (error) throw error
  return data as Vehiculo
}

export async function actualizarVehiculo(id: string, cambios: Partial<NuevoVehiculo>) {
  if (cambios.placa) {
    const placaValida = await validarPlaca(cambios.placa, id)
    if (!placaValida) throw new Error('Ya existe un vehículo registrado con esa placa.')
  }
  const { error } = await supabase.from('vehiculos').update(cambios).eq('id', id)
  if (error) throw error
}

/** actualizarEstado(): void */
export async function actualizarEstadoVehiculo(id: string, estado: Vehiculo['estado']) {
  const { error } = await supabase.from('vehiculos').update({ estado }).eq('id', id)
  if (error) throw error
}

/** actualizarKilometraje(): void */
export async function actualizarKilometraje(id: string, kilometraje: number) {
  const { error } = await supabase.from('vehiculos').update({ kilometraje }).eq('id', id)
  if (error) throw error
}

export async function eliminarVehiculo(id: string) {
  const { error } = await supabase.from('vehiculos').delete().eq('id', id)
  if (error) throw error
}
