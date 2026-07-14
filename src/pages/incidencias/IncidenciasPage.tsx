import { EntityCrudPage } from '../../components/crud/EntityCrudPage'
import { FieldConfig } from '../../components/crud/types'

const fields: FieldConfig[] = [
  {
    name: 'servicio_id',
    label: 'Servicio',
    type: 'relation',
    required: true,
    relation: { table: 'servicios', labelFields: ['fecha_ejecucion'] },
  },
  { name: 'tipo', label: 'Tipo', type: 'text', required: true, placeholder: 'Retraso, avería, accidente…' },
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
      tableName="incidencias"
      fields={fields}
      orderBy={{ column: 'created_at', ascending: false }}
      searchPlaceholder="Buscar por tipo…"
      searchableFields={['tipo']}
      newLabel="Nueva incidencia"
    />
  )
}
