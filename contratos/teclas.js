/* SUME DOCBLOCK
Nombre: consignas de acceso rápido | Tipo: Contrato
Entradas: configuración tEd y modo operativo.
Acciones: declarar qué consignas expone el teclado.
Salidas: lista de códigos permitidos por acceso rápido.
*/
export function quickSetpoints(params, mode) {
  const active = mode === 'eco' ? 'SPE' : mode === 'turbo' ? 'SPH' : 'SP';
  return { 0: [], 1: ['SP'], 2: ['SPE'], 3: ['SP', 'SPE'], 4: [active],
    5: ['SP', 'SPH'], 6: ['SP', 'SPE', 'SPH'] }[params.tEd];
}
