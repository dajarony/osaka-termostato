/* SUME DOCBLOCK
Nombre: instalación móvil | Tipo: Salida
Entradas: contenedor y estado de instalación.
Acciones: presentar disponibilidad sin conexión e instrucciones por plataforma.
Salidas: controles accesibles para instalar o actualizar.
*/
export function mountInstallation(root) {
  root.innerHTML = `<div class="install-bar"><span id="offline-status" role="status">Preparando acceso sin conexión…</span><button class="btn small" id="install-app">Instalar app</button><button class="btn small" id="update-app" title="Reinicia la simulación y conserva tus ajustes y retos" hidden>Actualizar app</button></div>
    <dialog id="install-dialog" aria-labelledby="install-title"><h2 id="install-title">Osaka Lab en tu móvil</h2>
    <p><b>iPhone / iPad:</b> abre esta dirección en Safari, pulsa Compartir y «Añadir a pantalla de inicio».</p>
    <p><b>Android:</b> en el menú del navegador, elige «Instalar aplicación» o «Añadir a pantalla de inicio».</p>
    <p id="install-requirements">Necesitas abrir una dirección HTTPS. Espera a que aparezca «Disponible sin conexión» antes de desconectarte.</p>
    <p>La configuración y los retos se guardan en este dispositivo. El reloj y las temperaturas de la sesión se reinician al volver a abrir. Exporta una copia para pasar tus ajustes a otro móvil.</p>
    <div class="dialog-actions"><button class="btn primary" id="install-close">Entendido</button></div></dialog>`;
  const dialog = root.querySelector('#install-dialog');
  root.querySelector('#install-close').onclick = () => dialog.close();
  return {
    install: root.querySelector('#install-app'),
    update: root.querySelector('#update-app'),
    status: (message) => (root.querySelector('#offline-status').textContent = message),
    help: () => dialog.showModal(),
  };
}
