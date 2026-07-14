import { EntityCrudPage } from '../../components/crud/EntityCrudPage'
import { FieldConfig } from '../../components/crud/types'

const fields: FieldConfig[] = [
  { name: 'nombres_razonsocial', label: 'Nombres o razón social', type: 'text', required: true },
  { name: 'apellidos', label: 'Apellidos', type: 'text', required: true },
  { name: 'dni_ruc', label: 'DNI / RUC', type: 'text', required: true, hint: 'Documento de identidad o RUC, se valida que sea único.' },
  { name: 'correo', label: 'Correo', type: 'email', required: true },
  { name: 'telefono', label: 'Teléfono', type: 'tel', required: true },
  {
    name: 'tipo_cliente',
    label: 'Tipo de cliente',
    type: 'select',
    required: true,
    options: [
      { value: 'natural', label: 'Persona natural' },
      { value: 'empresa', label: 'Empresa' },
    ],
    badgeTone: (v) => (v === 'empresa' ? 'info' : 'neutral'),
  },
  { name: 'direccion', label: 'Dirección', type: 'text', wide: true, showInTable: false },
]

export default function ClientesPage() {
  return (
    <EntityCrudPage
      title="Clientes"
      description="Registro, edición y consulta de las personas y empresas que solicitan el servicio."
      tableName="cliente"
      primaryKey="id_cliente"
      fields={fields}
      orderBy={{ column: 'created_at', ascending: false }}
      searchPlaceholder="Buscar por nombre, DNI o correo…"
      searchableFields={['nombres_razonsocial', 'apellidos', 'dni_ruc', 'correo']}
      newLabel="Nuevo cliente"
    />
  )
}
