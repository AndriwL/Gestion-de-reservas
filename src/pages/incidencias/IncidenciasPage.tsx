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
  { name: 'tipo_incidencia', label: 'Tipo', type: 'text', required: true, placeholder: 'Retraso, avería, accidente…' },
  { name: 'fecha', label: 'Fecha', type: 'date', required: true },
  { name: 'hora', label: 'Hora', type: 'time', required: true },
  {
    name: 'estado',
    label: 'Estado',
    type: 'select',
    required: true,
    options: [
      { value: 'abierta', label: 'Abierta' },
      { value: 'en_revision', label: 'En revisión' },
      { value: 'resuelta', label: 'Resuelta' },
    ],
    badgeTone: (v) => (v === 'resuelta' ? 'success' : v === 'en_revision' ? 'warning' : 'danger'),
  },
  { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, wide: true, showInTable: false },
]

export default function IncidenciasPage() {
  return (
    <EntityCrudPage
      title="Incidencias"
      description="Registra cualquier evento ocurrido durante un servicio y da seguimiento hasta su resolución."
      tableName="incidencia"
      primaryKey="id_incidencia"
      fields={fields}
      orderBy={{ column: 'created_at', ascending: false }}
      searchPlaceholder="Buscar por tipo…"
      searchableFields={['tipo_incidencia']}
      newLabel="Nueva incidencia"
    />
  )
}
