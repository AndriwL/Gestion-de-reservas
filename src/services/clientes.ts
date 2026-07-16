import { supabase } from '@/lib/supabase'
import type { Cliente } from '@/types'

// Clase: Cliente
// Métodos del diagrama: actualizarDatos(): void · validarDniRuc(): boolean
// + operaciones CRUD necesarias para el CU-01 (Registrar Cliente).

export type NuevoCliente = Omit<Cliente, 'id' | 'created_at' | 'estado'>

export async function listarClientes(): Promise<Cliente[]> {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Cliente[]
}

/** validarDniRuc(): boolean — verifica que el DNI/RUC no esté ya registrado. */
export async function validarDniRuc(dniRuc: string, excluirId?: string): Promise<boolean> {
  let query = supabase.from('clientes').select('id').eq('dni_ruc', dniRuc)
  if (excluirId) query = query.neq('id', excluirId)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []).length === 0
}

/** registrar() + crear() — alta de un nuevo cliente (CU-01). */
export async function registrarCliente(input: NuevoCliente) {
  const dniValido = await validarDniRuc(input.dni_ruc)
  if (!dniValido) throw new Error('Ya existe un cliente registrado con ese DNI/RUC.')

  const { data, error } = await supabase
    .from('clientes')
    .insert({ ...input, estado: 'activo' })
    .select()
    .single()
  if (error) throw error
  return data as Cliente
}

/** actualizarDatos(): void */
export async function actualizarDatosCliente(id: string, cambios: Partial<NuevoCliente>) {
  if (cambios.dni_ruc) {
    const dniValido = await validarDniRuc(cambios.dni_ruc, id)
    if (!dniValido) throw new Error('Ya existe un cliente registrado con ese DNI/RUC.')
  }
  const { error } = await supabase.from('clientes').update(cambios).eq('id', id)
  if (error) throw error
}

export async function eliminarCliente(id: string) {
  const { error } = await supabase.from('clientes').delete().eq('id', id)
  if (error) throw error
}
