import { useState } from 'react'
import { ArrowRightCircle } from 'lucide-react'
import { EntityCrudPage } from '../../components/crud/EntityCrudPage'
import { FieldConfig } from '../../components/crud/types'
import { supabase } from '../../lib/supabaseClient'

const fields: FieldConfig[] = [
  {
    name: 'id_cliente',
    label: 'Cliente',
    type: 'relation',
    required: true,
    relation: { table: 'cliente', valueField: 'id_cliente', labelFields: ['nombres_razonsocial', 'apellidos'] },
  },
  { name: 'costo_estimado', label: 'Costo estimado', type: 'number', required: true, step: '0.01' },
  { name: 'fecha_cotizacion', label: 'Fecha', type: 'date', required: true },
  {
    name: 'estado',
    label: 'Estado',
    type: 'select',
    required: true,
    options: [
      { value: 'pendiente', label: 'Pendiente' },
      { value: 'aprobada', label: 'Aprobada' },
      { value: 'rechazada', label: 'Rechazada' },
    ],
    badgeTone: (v) => (v === 'aprobada' ? 'success' : v === 'rechazada' ? 'danger' : 'warning'),
  },
  { name: 'observaciones', label: 'Observaciones', type: 'textarea', wide: true, showInTable: false },
]

// Botón de fila: convierte una cotización aprobada en una reserva, copiando
// cliente y costo estimado como costo total inicial.
function ConvertirEnReservaButton({ row, refresh }: { row: Record<string, any>; refresh: () => void }) {
  const [loading, setLoading] = useState(false)

  if (row.estado !== 'aprobada') return null

  async function handleClick() {
    setLoading(true)
    const { error } = await supabase.from('reserva').insert({
      id_cliente: row.id_cliente,
      id_cotizacion: row.id_cotizacion,
      cantidad_pasajeros: 1,
      costo_total: row.costo_estimado,
      saldo_pendiente: row.costo_estimado,
      estado: 'pendiente',
      fecha_viaje: row.fecha_cotizacion,
      hora_salida: '00:00',
      punto_recojo: 'Por definir',
    })
    setLoading(false)
    if (!error) refresh()
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title="Convertir en reserva"
      aria-label="Convertir en reserva"
      className="rounded-md p-1.5 text-teal hover:bg-teal-light disabled:opacity-50"
    >
      <ArrowRightCircle size={15} />
    </button>
  )
}

export default function CotizacionesPage() {
  return (
    <EntityCrudPage
      title="Cotizaciones"
      description="Genera una propuesta económica antes de confirmar la reserva. Al aprobarla, puede convertirse en reserva con un clic."
      tableName="cotizacion"
      primaryKey="id_cotizacion"
      fields={fields}
      orderBy={{ column: 'created_at', ascending: false }}
      searchPlaceholder="Buscar…"
      newLabel="Nueva cotización"
      extraRowActions={(row, refresh) => <ConvertirEnReservaButton row={row} refresh={refresh} />}
    />
  )
}
