import { ReactNode } from 'react'

export type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'time'
  | 'email'
  | 'tel'
  | 'textarea'
  | 'select'
  | 'relation'

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

export interface FieldOption {
  value: string
  label: string
}

export interface RelationConfig {
  /** Tabla de Supabase de la que se cargan las opciones */
  table: string
  /** Columnas que se concatenan para formar la etiqueta visible, ej. ['nombres','apellidos'] */
  labelFields: string[]
  /** Columna usada como value, por defecto 'id' */
  valueField?: string
  /** Filtro opcional: columna=valor, ej. para solo mostrar cotizaciones aprobadas */
  filterColumn?: string
  filterValue?: string
}

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  required?: boolean
  options?: FieldOption[]
  relation?: RelationConfig
  /** Si es false, la columna no se muestra en la tabla listado (solo en el formulario) */
  showInTable?: boolean
  /** Formatea el valor mostrado en la tabla */
  formatTable?: (value: unknown, row: Record<string, unknown>) => ReactNode
  /** Si se define, el valor de la columna se pinta como Badge con este tono */
  badgeTone?: (value: unknown) => BadgeTone
  step?: string
  placeholder?: string
  hint?: string
  /** Ancho de 2 columnas en la grilla del formulario */
  wide?: boolean
  /** Excluir del formulario (solo lectura, calculado, ej. saldo_pendiente autogenerado) */
  readOnlyInForm?: boolean
}
