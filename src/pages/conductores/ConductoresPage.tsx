import { EntityCrudPage } from '../../components/crud/EntityCrudPage'
import { FieldConfig } from '../../components/crud/types'

const fields: FieldConfig[] = [
  { name: 'nombres', label: 'Nombres', type: 'text', required: true },
  { name: 'apellidos', label: 'Apellidos', type: 'text', required: true },
  { name: 'dni', label: 'DNI', type: 'text', required: true },
  { name: 'telefono', label: 'Teléfono', type: 'tel', required: true },
  { name: 'nrolicencia', label: 'N° de licencia', type: 'text', required: true, hint: 'Se valida vigencia antes de asignar un servicio.' },
  { name: 'tipolicencia', label: 'Tipo de licencia', type: 'text' },
  {
    name: 'estado',
    label: 'Estado',
    type: 'select',
    required: true,
    options: [
      { value: 'activo', label: 'Activo' },
      { value: 'inactivo', label: 'Inactivo' },
      { value: 'suspendido', label: 'Suspendido' },
    ],
    badgeTone: (v) => (v === 'activo' ? 'success' : v === 'suspendido' ? 'danger' : 'neutral'),
  },
]

export default function ConductoresPage() {
  return (
    <EntityCrudPage
      title="Conductores"
      description="Registro y control de choferes: estado operativo y vigencia de licencia."
      tableName="conductor"
      primaryKey="id_conductor"
      fields={fields}
      orderBy={{ column: 'created_at', ascending: false }}
      searchPlaceholder="Buscar por nombre, DNI o licencia…"
      searchableFields={['nombres', 'apellidos', 'dni', 'nrolicencia']}
      newLabel="Nuevo conductor"
    />
  )
}
