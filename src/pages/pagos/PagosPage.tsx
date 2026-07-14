import { useState } from 'react'
import { ReceiptText } from 'lucide-react'
import { EntityCrudPage } from '../../components/crud/EntityCrudPage'
import { FieldConfig } from '../../components/crud/types'
import { supabase } from '../../lib/supabaseClient'

const fields: FieldConfig[] = [
  {
    name: 'id_reserva',
    label: 'Reserva',
    type: 'relation',
    required: true,
    relation: { table: 'reserva', valueField: 'id_reserva', labelFields: ['punto_recojo', 'fecha_viaje'] },
  },
  { name: 'fecha_pago', label: 'Fecha', type: 'date', required: true },
  { name: 'monto', label: 'Monto', type: 'number', required: true, step: '0.01' },
  { name: 'metodo_pago', label: 'Método de pago', type: 'text', required: true, placeholder: 'Efectivo, tarjeta, transferencia…' },
  { name: 'banco_origen', label: 'Banco', type: 'text' },
  { name: 'nro_operacion', label: 'N° de operación', type: 'text' },
  {
    name: 'estado',
    label: 'Estado',
    type: 'select',
    required: true,
    options: [
      { value: 'pendiente', label: 'Pendiente' },
      { value: 'parcial', label: 'Parcial' },
      { value: 'pagado', label: 'Pagado' },
      { value: 'anulado', label: 'Anulado' },
    ],
    badgeTone: (v) => (v === 'pagado' ? 'success' : v === 'anulado' ? 'danger' : v === 'parcial' ? 'warning' : 'neutral'),
  },
]

// Emite un comprobante ligado al pago, con número correlativo simple basado
// en la fecha y un sufijo aleatorio corto.
function GenerarComprobanteButton({ row, refresh }: { row: Record<string, any>; refresh: () => void }) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    const numero = `CMP-${new Date(row.fecha_pago).getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    const { error } = await supabase.from('comprobante').insert({
      id_pago: row.id_pago,
      monto_total: row.monto,
      nro_comprobante: numero,
      tipo: 'boleta',
      fecha_emision: new Date().toISOString().slice(0, 10),
    })
    setLoading(false)
    if (!error) refresh()
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title="Generar comprobante"
      aria-label="Generar comprobante"
      className="rounded-md p-1.5 text-teal hover:bg-teal-light disabled:opacity-50"
    >
      <ReceiptText size={15} />
    </button>
  )
}

export default function PagosPage() {
  return (
    <EntityCrudPage
      title="Pagos"
      description="Registra método, banco, fecha y estado del pago. Genera el comprobante correspondiente con un clic."
      tableName="pago"
      primaryKey="id_pago"
      fields={fields}
      orderBy={{ column: 'created_at', ascending: false }}
      searchPlaceholder="Buscar por método…"
      searchableFields={['metodo_pago', 'banco_origen']}
      newLabel="Nuevo pago"
      extraRowActions={(row, refresh) => <GenerarComprobanteButton row={row} refresh={refresh} />}
    />
  )
}
