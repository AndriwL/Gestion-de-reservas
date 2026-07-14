// Tipos que representan cada entidad del modelo de datos descrito en el
// documento de requerimientos. Se mantienen alineados 1:1 con las tablas
// definidas en supabase/schema.sql

export type EstadoCotizacion = 'pendiente' | 'aprobada' | 'rechazada'
export type EstadoReserva = 'pendiente' | 'confirmada' | 'en_curso' | 'finalizada' | 'cancelada'
export type EstadoServicio = 'programado' | 'en_curso' | 'finalizado' | 'cancelado'
export type EstadoVehiculo = 'disponible' | 'en_servicio' | 'mantenimiento' | 'inactivo'
export type EstadoConductor = 'activo' | 'inactivo' | 'suspendido'
export type EstadoPago = 'pendiente' | 'parcial' | 'pagado' | 'anulado'
export type EstadoIncidencia = 'abierta' | 'en_revision' | 'resuelta'
export type TipoCliente = 'natural' | 'empresa'

export interface Cliente {
  id: string
  nombres: string
  apellidos: string
  dni: string
  correo: string
  direccion: string | null
  telefono: string
  tipo_cliente: TipoCliente
  created_at: string
}

export interface Cotizacion {
  id: string
  cliente_id: string
  costo_estimado: number
  fecha_cotizacion: string
  observaciones: string | null
  estado: EstadoCotizacion
  created_at: string
  cliente?: Cliente
}

export interface Reserva {
  id: string
  cliente_id: string
  cotizacion_id: string | null
  cantidad_pasajeros: number
  costo_total: number
  saldo_pendiente: number
  estado: EstadoReserva
  fecha: string
  hora_salida: string
  hora_retorno: string | null
  punto_recojo: string
  created_at: string
  cliente?: Cliente
  cotizacion?: Cotizacion
}

export interface Vehiculo {
  id: string
  placa: string
  modelo: string
  tipo: string
  capacidad: number
  estado: EstadoVehiculo
  kilometraje: number
  created_at: string
}

export interface Conductor {
  id: string
  nombres: string
  apellidos: string
  dni: string
  telefono: string
  licencia: string
  estado: EstadoConductor
  created_at: string
}

export interface Servicio {
  id: string
  reserva_id: string
  conductor_id: string | null
  vehiculo_id: string | null
  estado: EstadoServicio
  fecha_ejecucion: string
  observaciones: string | null
  created_at: string
  reserva?: Reserva
  conductor?: Conductor
  vehiculo?: Vehiculo
}

export interface Ruta {
  id: string
  servicio_id: string
  origen: string
  destino: string
  distancia: number
  created_at: string
  servicio?: Servicio
}

export interface Incidencia {
  id: string
  servicio_id: string
  tipo: string
  descripcion: string
  fecha: string
  hora: string
  estado: EstadoIncidencia
  created_at: string
  servicio?: Servicio
}

export interface Pago {
  id: string
  reserva_id: string
  fecha: string
  metodo: string
  banco: string | null
  estado: EstadoPago
  monto: number
  created_at: string
  reserva?: Reserva
}

export interface Comprobante {
  id: string
  pago_id: string
  monto_total: number
  numero: string
  tipo: string
  fecha_emision: string
  created_at: string
  pago?: Pago
}
