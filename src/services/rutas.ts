import { supabase } from '@/lib/supabase'
import type { Ruta } from '@/types'

// Clase: Ruta (entidad de apoyo)
// Método del diagrama: calcularDistancia(): int

export type NuevaRuta = Omit<Ruta, 'id' | 'created_at'>

export async function listarRutas(): Promise<Ruta[]> {
  const { data, error } = await supabase.from('rutas').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Ruta[]
}

/** calcularDistancia(): int — placeholder simple; en producción se integraría con un servicio de mapas. */
export function calcularDistancia(origen: string, destino: string): number {
  // Estimación simple basada en la longitud combinada de los nombres,
  // solo para tener un valor por defecto editable por el usuario.
  return Math.max(5, (origen.length + destino.length) * 3)
}

export async function obtenerOCrearRuta(origen: string, destino: string): Promise<Ruta> {
  const { data: existente } = await supabase
    .from('rutas')
    .select('*')
    .eq('origen', origen)
    .eq('destino', destino)
    .maybeSingle()

  if (existente) return existente as Ruta

  const { data, error } = await supabase
    .from('rutas')
    .insert({ origen, destino, distancia_km: calcularDistancia(origen, destino) })
    .select()
    .single()
  if (error) throw error
  return data as Ruta
}
