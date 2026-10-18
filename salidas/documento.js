/* SUME DOCBLOCK
Nombre: serialización de sesión | Tipo: Salida
Entradas: snapshot validado.
Acciones: generar documento portable versionado.
Salidas: JSON de parámetros y progreso.
*/
export const serialize = (s) =>
  JSON.stringify({ app: 'osaka-lab', version: 3, params: s.params, completed: s.completed }, null, 2);
export function download(name, text, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
