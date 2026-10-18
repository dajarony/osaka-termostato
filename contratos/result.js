/* SUME DOCBLOCK
Nombre: Result | Tipo: Contrato
Entradas: valor o código de error.
Acciones: normalizar resultados esperados.
Salidas: unión discriminada serializable.
*/
export const ok = value => ({ ok: true, value });
export const fail = (code, message, context = {}) => ({ ok: false, error: { code, message, context } });
