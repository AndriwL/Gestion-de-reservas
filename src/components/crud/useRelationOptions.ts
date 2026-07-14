import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { FieldConfig, FieldOption } from './types'

/**
 * Carga en paralelo las opciones de todos los campos tipo "relation" de un
 * formulario, para poblar los <select> que referencian otras tablas
 * (ej. reserva -> cliente, servicio -> conductor, etc.).
 */
export function useRelationOptions(fields: FieldConfig[]) {
  const [optionsByField, setOptionsByField] = useState<Record<string, FieldOption[]>>({})
  const [loading, setLoading] = useState(true)

  const relationFields = fields.filter((f) => f.type === 'relation' && f.relation)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      const results = await Promise.all(
        relationFields.map(async (f) => {
          const rel = f.relation!
          const valueField = rel.valueField ?? 'id'
          let query = supabase.from(rel.table).select([valueField, ...rel.labelFields].join(','))
          if (rel.filterColumn && rel.filterValue) {
            query = query.eq(rel.filterColumn, rel.filterValue)
          }
          const { data, error } = await query
          if (error || !data) return [f.name, [] as FieldOption[]] as const
          const opts: FieldOption[] = (data as unknown as Record<string, unknown>[]).map((row) => ({
            value: String(row[valueField]),
            label: rel.labelFields.map((lf) => row[lf]).filter(Boolean).join(' '),
          }))
          return [f.name, opts] as const
        }),
      )
      if (!active) return
      const map: Record<string, FieldOption[]> = {}
      results.forEach(([name, opts]) => {
        map[name] = opts
      })
      setOptionsByField(map)
      setLoading(false)
    }
    if (relationFields.length > 0) void load()
    else setLoading(false)
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.map((f) => f.name).join(',')])

  return { optionsByField, loading }
}
