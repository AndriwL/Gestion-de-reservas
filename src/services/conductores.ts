import { supabase } from '@/lib/supabase'
import type { Conductor } from '@/types'

// Clase: Conductor
// Métodos del diagrama: validarLicencia() · verificarVigenciaLicencia() ·
// actualizarEstado()

export type NuevoConductor = Omit<Conductor, 'id' | 'created_at' | 'estado'>

export async function listarConductores(): Promise<Conductor[]> {
  const { data, error } = await supabase
    .from('conductores')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Conductor[]
}

/** validarLicencia(): boolean — DNI único + licencia con formato válido. */
export async function validarLicencia(dni: string, nroLicencia: string, excluirId?: string): Promise<boolean> {
  if (!nroLicencia.trim()) return false
  let query = supabase.from('conductores').select('id').eq('dni', dni)
  if (excluirId) query = query.neq('id', excluirId)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []).length === 0
}

/** verificarVigenciaLicencia(): boolean — CU-03, la licencia no debe estar vencida. */
export function verificarVigenciaLicencia(fechaVencimiento: string): boolean {
  return new Date(fechaVencimiento) >= new Date(new Date().toDateString())
}

export async function registrarConductor(input: NuevoConductor) {
  const licenciaValida = await validarLicencia(input.dni, input.nro_licencia)
  if (!licenciaValida) throw new Error('Ya existe un conductor registrado con ese DNI.')
  if (!verificarVigenciaLicencia(input.fecha_vencimiento_licencia)) {
    throw new Error('La licencia ingresada ya está vencida.')
  }

  const { data, error } = await supabase
    .from('conductores')
    .insert({ ...input, estado: 'disponible' })
    .select()
    .single()
  if (error) throw error
  return data as Conductor
}

export async function actualizarConductor(id: string, cambios: Partial<NuevoConductor>) {
  const { error } = await supabase.from('conductores').update(cambios).eq('id', id)
  if (error) throw error
}

/** actualizarEstado(): void */
export async function actualizarEstadoConductor(id: string, estado: Conductor['estado']) {
  const { error } = await supabase.from('conductores').update({ estado }).eq('id', id)
  if (error) throw error
}

export async function eliminarConductor(id: string) {
  const { error } = await supabase.from('conductores').delete().eq('id', id)
  if (error) throw error
}
