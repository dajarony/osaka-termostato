/* SUME DOCBLOCK
Nombre: utilidades DOM | Tipo: Salida
Entradas: datos de texto y nodos.
Acciones: escapar contenido y actualizar texto.
Salidas: HTML seguro y formatos comunes.
*/
export const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
export const temperature = (value) => Number(value).toFixed(1).replace('.', ',');
export const clock = (seconds) =>
  [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
export function put(root, selector, value) {
  root.querySelector(selector).textContent = value;
}
