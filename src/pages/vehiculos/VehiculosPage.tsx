import { EntityCrudPage } from '../../components/crud/EntityCrudPage'
import { FieldConfig } from '../../components/crud/types'

const fields: FieldConfig[] = [
  { name: 'placa', label: 'Placa', type: 'text', required: true },
  { name: 'modelo', label: 'Modelo', type: 'text', required: true },
  { name: 'tipo', label: 'Tipo', type: 'text', required: true, placeholder: 'Van, bus, auto…' },
  { name: 'capacidad', label: 'Capacidad', type: 'number', required: true, hint: 'N° de pasajeros' },
  { name: 'kilometraje', label: 'Kilometraje', type: 'number', required: true, step: '1' },
  {
    name: 'estado',
    label: 'Estado',
    type: 'select',
    required: true,
    options: [
      { value: 'disponible', label: 'Disponible' },
      { value: 'en_servicio', label: 'En servicio' },
      { value: 'mantenimiento', label: 'Mantenimiento' },
      { value: 'inactivo', label: 'Inactivo' },
    ],
    badgeTone: (v) => (v === 'disponible' ? 'success' : v === 'en_servicio' ? 'info' : v === 'mantenimiento' ? 'warning' : 'neutral'),
  },
]

export default function VehiculosPage() {
  return (
    <EntityCrudPage
      title="Vehículos"
      description="Administración completa de la flota: disponibilidad, capacidad y kilometraje."
      tableName="vehiculos"
      fields={fields}
      orderBy={{ column: 'created_at', ascending: false }}
      searchPlaceholder="Buscar por placa o modelo…"
      searchableFields={['placa', 'modelo', 'tipo']}
      newLabel="Nuevo vehículo"
    />
  )
}
