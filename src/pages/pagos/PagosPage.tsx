import { useState } from 'react'
import { ReceiptText } from 'lucide-react'
import { EntityCrudPage } from '../../components/crud/EntityCrudPage'
import { FieldConfig } from '../../components/crud/types'
import { supabase } from '../../lib/supabaseClient'

const fields: FieldConfig[] = [
  {
    name: 'reserva_id',
    label: 'Reserva',
    type: 'relation',
    required: true,
    relation: { table: 'reservas', labelFields: ['punto_recojo', 'fecha'] },
  },
  { name: 'fecha', label: 'Fecha', type: 'date', required: true },
  { name: 'monto', label: 'Monto', type: 'number', required: true, step: '0.01' },
  { name: 'metodo', label: 'Método de pago', type: 'text', required: true, placeholder: 'Efectivo, tarjeta, transferencia…' },
  { name: 'banco', label: 'Banco', type: 'text' },
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
    const numero = `CMP-${new Date(row.fecha).getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    const { error } = await supabase.from('comprobantes').insert({
      pago_id: row.id,
      monto_total: row.monto,
      numero,
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
      tableName="pagos"
      fields={fields}
      orderBy={{ column: 'created_at', ascending: false }}
      searchPlaceholder="Buscar por método…"
      searchableFields={['metodo', 'banco']}
      newLabel="Nuevo pago"
      extraRowActions={(row, refresh) => <GenerarComprobanteButton row={row} refresh={refresh} />}
    />
  )
}
