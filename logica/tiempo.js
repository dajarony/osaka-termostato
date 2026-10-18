/* SUME DOCBLOCK
Nombre: tiempo | Tipo: Lógica
Entradas: valor de temporizador F30 y familia.
Acciones: convertir a segundos sin reloj del sistema.
Salidas: duración; cero significa desactivado.
*/
export function seconds(value, family = 'minutes') {
  if (value === 'oF' || value === 0) return 0;
  return value < 0 ? -value * (family === 'hours' ? 60 : 1) : value * (family === 'hours' ? 3600 : 60);
}
export const elapsedSince = (now, then) => (then === null ? Infinity : now - then);
