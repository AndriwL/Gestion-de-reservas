// Tipos de dominio del Sistema Web GAL
// Reflejan 1:1 las clases del Diagrama de Clases Técnico (Figura 30):
// Cliente, Administrador, Vehiculo, Conductor, Ruta, Cotizacion,
// Reserva, Servicio, Incidencia, Pago, Comprobante.

export type EstadoCliente = 'activo' | 'inactivo'
export type TipoCliente = 'natural' | 'empresa'

// Clase: Cliente
export interface Cliente {
  id: string
  dni_ruc: string
  nombres_razon_social: string
  apellidos: string | null
  correo: string
  telefono: string
  direccion: string | null
  tipo_cliente: TipoCliente
  estado: EstadoCliente
  created_at: string
}

// Clase: Administrador (perfil del usuario del dashboard, sobre Supabase Auth)
export interface Perfil {
  id: string
  dni: string | null
  nombres: string
  apellidos: string
  telefono: string | null
  usuario: string | null
  rol: 'administrador' | 'operador'
  created_at: string
}

export type EstadoVehiculo = 'disponible' | 'en_servicio' | 'mantenimiento' | 'inactivo'
export type TipoVehiculo = 'auto' | 'van' | 'minibus' | 'bus'

// Clase: Vehiculo
export interface Vehiculo {
  id: string
  placa: string
  marca: string
  modelo: string
  tipo: TipoVehiculo
  capacidad: number
  kilometraje: number
  estado: EstadoVehiculo
  imagen_url: string | null
  created_at: string
}

export type EstadoConductor = 'disponible' | 'en_servicio' | 'de_baja'

// Clase: Conductor
export interface Conductor {
  id: string
  dni: string
  nombres: string
  apellidos: string
  nro_licencia: string
  tipo_licencia: string
  fecha_vencimiento_licencia: string
  telefono: string
  estado: EstadoConductor
  created_at: string
}

// Clase: Ruta
export interface Ruta {
  id: string
  origen: string
  destino: string
  distancia_km: number | null
  created_at: string
}

export type EstadoCotizacion = 'pendiente' | 'aprobada' | 'cancelada' | 'convertida'

// Clase: Cotizacion
export interface Cotizacion {
  id: string
  codigo: string
  cliente_id: string
  ruta_id: string | null
  origen: string
  destino: string
  pasajeros: number
  tipo_vehiculo: TipoVehiculo
  fecha: string
  hora: string
  observaciones: string | null
  costo_estimado: number
  estado: EstadoCotizacion
  created_at: string
}

export type EstadoReserva = 'pendiente' | 'confirmada' | 'cancelada' | 'convertida'

// Clase: Reserva (entidad intermedia: Cotizacion -> Reserva -> Servicio)
export interface Reserva {
  id: string
  codigo: string
  cotizacion_id: string
  cliente_id: string
  cantidad_pasajeros: number
  fecha_reserva: string
  fecha_viaje: string
  hora_salida: string
  hora_retorno: string | null
  punto_recojo: string | null
  costo_total: number
  saldo_pendiente: number
  estado: EstadoReserva
  created_at: string
}

export type EstadoServicio = 'programado' | 'en_proceso' | 'finalizado' | 'cancelado'

// Clase: Servicio
export interface Servicio {
  id: string
  codigo: string
  reserva_id: string | null
  cliente_id: string
  vehiculo_id: string
  conductor_id: string
  ruta_id: string | null
  origen: string
  destino: string
  fecha: string
  hora: string
  fecha_ejecucion: string | null
  estado: EstadoServicio
  observaciones: string | null
  created_at: string
}

export type EstadoIncidencia = 'abierta' | 'en_revision' | 'resuelta'

// Clase: Incidencia
export interface Incidencia {
  id: string
  servicio_id: string
  tipo_incidencia: string
  descripcion: string
  hora: string
  estado: EstadoIncidencia
  created_at: string
}

export type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta' | 'yape_plin'
export type EstadoPago = 'pendiente' | 'parcial' | 'cancelado'

// Clase: Pago
export interface Pago {
  id: string
  codigo: string
  servicio_id: string
  monto: number
  saldo: number
  metodo_pago: MetodoPago
  banco_origen: string | null
  nro_operacion: string | null
  fecha_pago: string
  estado: EstadoPago
  created_at: string
}

// Clase: Comprobante
export interface Comprobante {
  id: string
  pago_id: string
  nro_comprobante: string
  tipo: 'boleta' | 'factura'
  monto_total: number
  fecha_emision: string
}
