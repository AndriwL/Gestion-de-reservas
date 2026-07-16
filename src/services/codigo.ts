// Genera códigos correlativos legibles tipo "CLI-0001", "COT-0007", etc.
// (En producción conviene mover esto a una secuencia/trigger en Supabase;
// aquí se resuelve en el cliente contando los registros existentes.)
export function generarCodigo(prefijo: string, siguienteNumero: number): string {
  return `${prefijo}-${String(siguienteNumero).padStart(4, '0')}`
}
