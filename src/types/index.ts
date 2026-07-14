export type EstadoCotizacion = 'pendiente' | 'aprobada' | 'rechazada'
export type EstadoReserva = 'pendiente' | 'confirmada' | 'en_curso' | 'finalizada' | 'cancelada'
export type EstadoServicio = 'programado' | 'en_curso' | 'finalizado' | 'cancelado'
export type EstadoVehiculo = 'disponible' | 'en_servicio' | 'mantenimiento' | 'inactivo'
export type EstadoConductor = 'activo' | 'inactivo' | 'suspendido'
export type EstadoPago = 'pendiente' | 'parcial' | 'pagado' | 'anulado'
export type EstadoIncidencia = 'abierta' | 'en_revision' | 'resuelta'
export type TipoCliente = 'natural' | 'empresa'

export interface Cliente {
  id_cliente: string
  nombres_razonsocial: string
  apellidos: string | null
  dni_ruc: string
  correo: string
  direccion: string | null
  telefono: string | null
  tipo_cliente: TipoCliente
  id_administrador: string | null
  created_at: string
}

export interface Cotizacion {
  id_cotizacion: string
  id_cliente: string
  id_administrador: string | null
  costo_estimado: number
  fecha_cotizacion: string
  observaciones: string | null
  estado: EstadoCotizacion
  created_at: string
}

export interface Reserva {
  id_reserva: string
  id_cliente: string
  id_cotizacion: string | null
  id_administrador: string | null
  cantidad_pasajeros: number
  costo_total: number
  saldo_pendiente: number
  estado: EstadoReserva
  fecha_reserva: string
  fecha_viaje: string
  hora_salida: string
  hora_retorno: string | null
  punto_recojo: string
  created_at: string
}

export interface Vehiculo {
  id_vehiculo: string
  placa: string
  marca: string
  modelo: string
  tipo: string
  capacidad: number
  estado: EstadoVehiculo
  kilometraje: number
  id_administrador: string | null
  created_at: string
}

export interface Conductor {
  id_conductor: string
  nombres: string
  apellidos: string
  dni: string
  telefono: string | null
  nrolicencia: string
  tipolicencia: string | null
  estado: EstadoConductor
  id_administrador: string | null
  created_at: string
}

export interface Servicio {
  id_servicio: string
  id_reserva: string
  id_conductor: string | null
  id_vehiculo: string | null
  estado: EstadoServicio
  fecha_ejecucion: string
  observaciones: string | null
  created_at: string
}

export interface Ruta {
  id_ruta: string
  id_servicio: string
  origen: string
  destino: string
  distancia_km: number
  created_at: string
}

export interface Incidencia {
  id_incidencia: string
  id_servicio: string
  tipo_incidencia: string
  descripcion: string
  fecha: string
  hora: string
  estado: EstadoIncidencia
  created_at: string
}

export interface Pago {
  id_pago: string
  id_reserva: string
  monto: number
  metodo_pago: string
  banco_origen: string | null
  nro_operacion: string | null
  fecha_pago: string
  estado: EstadoPago
  created_at: string
}

export interface Comprobante {
  id_comprobante: string
  id_pago: string
  nro_comprobante: string
  tipo: string
  monto_total: number
  fecha_emision: string
  created_at: string
}
