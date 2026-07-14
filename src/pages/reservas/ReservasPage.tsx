import { EntityCrudPage } from '../../components/crud/EntityCrudPage'
import { FieldConfig } from '../../components/crud/types'

const fields: FieldConfig[] = [
  {
    name: 'id_cliente',
    label: 'Cliente',
    type: 'relation',
    required: true,
    relation: { table: 'cliente', valueField: 'id_cliente', labelFields: ['nombres_razonsocial', 'apellidos'] },
  },
  {
    name: 'id_cotizacion',
    label: 'Cotización de origen',
    type: 'relation',
    relation: { table: 'cotizacion', valueField: 'id_cotizacion', labelFields: ['id_cotizacion'] },
    showInTable: false,
  },
  { name: 'fecha_reserva', label: 'Fecha de reserva', type: 'date', required: true },
  { name: 'fecha_viaje', label: 'Fecha de viaje', type: 'date', required: true },
  { name: 'hora_salida', label: 'Hora de salida', type: 'time', required: true },
  { name: 'hora_retorno', label: 'Hora de retorno', type: 'time' },
  { name: 'punto_recojo', label: 'Punto de recojo', type: 'text', required: true, wide: true },
  { name: 'cantidad_pasajeros', label: 'Pasajeros', type: 'number', required: true },
  { name: 'costo_total', label: 'Costo total', type: 'number', required: true, step: '0.01' },
  { name: 'saldo_pendiente', label: 'Saldo pendiente', type: 'number', required: true, step: '0.01' },
  {
    name: 'estado',
    label: 'Estado',
    type: 'select',
    required: true,
    options: [
      { value: 'pendiente', label: 'Pendiente' },
      { value: 'confirmada', label: 'Confirmada' },
      { value: 'en_curso', label: 'En curso' },
      { value: 'finalizada', label: 'Finalizada' },
      { value: 'cancelada', label: 'Cancelada' },
    ],
    badgeTone: (v) =>
      v === 'confirmada' || v === 'finalizada' ? 'success' : v === 'cancelada' ? 'danger' : v === 'en_curso' ? 'info' : 'warning',
  },
]

export default function ReservasPage() {
  return (
    <EntityCrudPage
      title="Reservas"
      description="Crea, modifica, cancela y consulta reservas. Cada una se relaciona con un cliente, una cotización, un servicio y un pago."
      tableName="reserva"
      primaryKey="id_reserva"
      fields={fields}
      orderBy={{ column: 'created_at', ascending: false }}
      searchPlaceholder="Buscar por punto de recojo…"
      searchableFields={['punto_recojo']}
      newLabel="Nueva reserva"
    />
  )
}
