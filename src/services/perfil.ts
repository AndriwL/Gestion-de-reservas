import { supabase } from '@/lib/supabase'
import type { Perfil } from '@/types'

// Clase: Administrador — datos propios del usuario del dashboard.
// iniciarSesion()/cerrarSesion() se resuelven vía Supabase Auth (AuthContext).

export async function obtenerPerfil(userId: string): Promise<Perfil | null> {
  const { data, error } = await supabase.from('perfiles').select('*').eq('id', userId).maybeSingle()
  if (error) throw error
  return (data as Perfil) ?? null
}

export async function actualizarPerfil(userId: string, cambios: Partial<Pick<Perfil, 'nombres' | 'apellidos' | 'telefono' | 'dni'>>) {
  const { error } = await supabase.from('perfiles').update(cambios).eq('id', userId)
  if (error) throw error
}
