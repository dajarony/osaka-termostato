/* SUME DOCBLOCK
Nombre: documento de sesión | Tipo: Entrada
Entradas: JSON no confiable de archivo o almacenamiento.
Acciones: validar versión, tamaño, parámetros y progreso.
Salidas: Result del documento normalizado.
*/
import { validateParameters, plainObject } from './parametros.js';
import { lessons } from '../contratos/retos.js';
import { fail, ok } from '../contratos/result.js';
export function parseDocument(text) {
  if (typeof text !== 'string' || text.length > 100000)
    return fail('INVALID_DOCUMENT', 'Archivo demasiado grande (máximo 100 KB).');
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return fail('INVALID_DOCUMENT', 'El archivo no contiene JSON válido.');
  }
  if (!plainObject(data) || data.app !== 'osaka-lab' || data.version !== 3 || !plainObject(data.params))
    return fail('INVALID_DOCUMENT', 'Se requiere un archivo Osaka Lab versión 3.');
  const result = validateParameters(data.params);
  if (!result.ok) return result;
  if (!Array.isArray(data.completed) || !data.completed.every((id) => lessons.some((l) => l.id === id)))
    return fail('INVALID_DOCUMENT', 'El progreso contiene retos desconocidos.');
  return ok({ params: result.value, completed: [...new Set(data.completed)] });
}
