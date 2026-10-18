/* SUME DOCBLOCK
Nombre: archivos de usuario | Tipo: Entrada
Entradas: archivos JSON y solicitudes de exportación.
Acciones: validar antes de reemplazar configuración y progreso.
Salidas: documento portable o error visible.
*/
import { parseDocument } from './documento.js';
import { serialize, download } from '../salidas/documento.js';
export function createFiles(input, getState, replace, notice) {
  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;
    try {
      if (file.size > 100000) {
        notice('Archivo demasiado grande (máximo 100 KB).');
        return;
      }
      const result = parseDocument(await file.text());
      if (!result.ok) {
        notice(result.error.message);
        return;
      }
      replace(result.value);
      notice('Configuración importada. Se ha iniciado una sesión nueva.');
    } catch {
      notice('No se pudo leer el archivo seleccionado.');
    } finally {
      input.value = '';
    }
  };
  return (action) => {
    if (action === 'import') input.click();
    if (action === 'export') download('osaka-lab-configuracion.json', serialize(getState()));
    if (action === 'trace')
      download('osaka-lab-evidencia.json', JSON.stringify({ version: 3, ...getState() }, null, 2));
  };
}
