/* SUME DOCBLOCK
Nombre: repositorio local | Tipo: Entrada
Entradas: adaptador Storage inyectado.
Acciones: leer y escribir documentos versionados con errores visibles.
Salidas: Result; nunca oculta denegación o corrupción.
*/
import { parseDocument } from './documento.js';
import { serialize } from '../salidas/documento.js';
import { ok, fail } from '../contratos/result.js';
export function createRepository(storage) {
  const key = 'osaka_lab_v3';
  return {
    load() {
      try {
        const text = storage.getItem(key);
        return text === null ? ok(null) : parseDocument(text);
      } catch {
        return fail(
          'STORAGE_UNAVAILABLE',
          'No se pudo leer el almacenamiento. La sesión funciona en memoria.',
        );
      }
    },
    save(snapshot) {
      try {
        storage.setItem(key, serialize(snapshot));
        return ok(null);
      } catch {
        return fail('STORAGE_UNAVAILABLE', 'No se pudo guardar. Exporta tu configuración para conservarla.');
      }
    },
  };
}
