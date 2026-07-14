import { EntityCrudPage } from '../../components/crud/EntityCrudPage'
import { FieldConfig } from '../../components/crud/types'

const fields: FieldConfig[] = [
  { name: 'numero', label: 'N° comprobante', type: 'text', required: true },
  {
    name: 'tipo',
    label: 'Tipo',
    type: 'select',
    required: true,
    options: [
      { value: 'boleta', label: 'Boleta' },
      { value: 'factura', label: 'Factura' },
      { value: 'recibo', label: 'Recibo' },
    ],
  },
  {
    name: 'pago_id',
    label: 'Pago asociado',
    type: 'relation',
    required: true,
    relation: { table: 'pagos', labelFields: ['metodo', 'fecha'] },
  },
  { name: 'monto_total', label: 'Monto total', type: 'number', required: true, step: '0.01' },
  { name: 'fecha_emision', label: 'Fecha de emisión', type: 'date', required: true },
]

export default function ComprobantesPage() {
  return (
    <EntityCrudPage
      title="Comprobantes"
      description="Documentos generados después de cada pago. También pueden emitirse directamente desde el módulo de Pagos."
      tableName="comprobantes"
      fields={fields}
      orderBy={{ column: 'created_at', ascending: false }}
      searchPlaceholder="Buscar por número…"
      searchableFields={['numero']}
      newLabel="Nuevo comprobante"
    />
  )
}
