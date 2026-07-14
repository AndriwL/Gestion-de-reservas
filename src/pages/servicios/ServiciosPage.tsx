import { EntityCrudPage } from '../../components/crud/EntityCrudPage'
import { FieldConfig } from '../../components/crud/types'

const fields: FieldConfig[] = [
  {
    name: 'reserva_id',
    label: 'Reserva',
    type: 'relation',
    required: true,
    relation: { table: 'reservas', labelFields: ['punto_recojo', 'fecha'] },
  },
  {
    name: 'conductor_id',
    label: 'Conductor',
    type: 'relation',
    relation: { table: 'conductores', labelFields: ['nombres', 'apellidos'], filterColumn: 'estado', filterValue: 'activo' },
  },
  {
    name: 'vehiculo_id',
    label: 'Vehículo',
    type: 'relation',
    relation: { table: 'vehiculos', labelFields: ['placa', 'modelo'] },
  },
  { name: 'fecha_ejecucion', label: 'Fecha de ejecución', type: 'date', required: true },
  {
    name: 'estado',
    label: 'Estado',
    type: 'select',
    required: true,
    options: [
      { value: 'programado', label: 'Programado' },
      { value: 'en_curso', label: 'En curso' },
      { value: 'finalizado', label: 'Finalizado' },
      { value: 'cancelado', label: 'Cancelado' },
    ],
    badgeTone: (v) => (v === 'finalizado' ? 'success' : v === 'cancelado' ? 'danger' : v === 'en_curso' ? 'info' : 'warning'),
  },
  { name: 'observaciones', label: 'Observaciones', type: 'textarea', wide: true, showInTable: false },
]

export default function ServiciosPage() {
  return (
    <EntityCrudPage
      title="Servicios"
      description="Representa el viaje que se ejecuta: asigna conductor y vehículo, cambia el estado e inicia o finaliza el servicio."
      tableName="servicios"
      fields={fields}
      orderBy={{ column: 'created_at', ascending: false }}
      searchPlaceholder="Buscar…"
      newLabel="Nuevo servicio"
    />
  )
}
