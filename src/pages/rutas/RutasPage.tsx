import { EntityCrudPage } from '../../components/crud/EntityCrudPage'
import { FieldConfig } from '../../components/crud/types'

const fields: FieldConfig[] = [
  {
    name: 'id_servicio',
    label: 'Servicio',
    type: 'relation',
    required: true,
    relation: { table: 'servicio', valueField: 'id_servicio', labelFields: ['fecha_ejecucion'] },
  },
  { name: 'origen', label: 'Origen', type: 'text', required: true },
  { name: 'destino', label: 'Destino', type: 'text', required: true },
  { name: 'distancia_km', label: 'Distancia (km)', type: 'number', required: true, step: '0.1' },
]

export default function RutasPage() {
  return (
    <EntityCrudPage
      title="Rutas"
      description="Recorrido de cada servicio: punto de origen, destino y distancia calculada."
      tableName="ruta"
      primaryKey="id_ruta"
      fields={fields}
      orderBy={{ column: 'created_at', ascending: false }}
      searchPlaceholder="Buscar por origen o destino…"
      searchableFields={['origen', 'destino']}
      newLabel="Nueva ruta"
    />
  )
}
