/* SUME DOCBLOCK
Nombre: conexiones de interacción | Tipo: Entrada
Entradas: eventos DOM y callbacks de aplicación.
Acciones: traducir controles a intenciones.
Salidas: comandos de sesión sin reglas de negocio duplicadas.
*/
export function bindInteractions(root, api) {
  const q = (selector) => root.querySelector(selector);
  q('#play').onclick = () => api.clock.toggle();
  q('#speed').onchange = (e) => api.clock.setSpeed(Number(e.target.value));
  q('#step-second').onclick = () => api.dispatch({ type: 'advance', seconds: 1 });
  q('#step-minute').onclick = () => api.dispatch({ type: 'advance', seconds: 60 });
  q('#reset').onclick = () => {
    api.clock.pause();
    api.dispatch({ type: 'reset' });
  };
  q('#physics-toggle').onchange = (e) => api.dispatch({ type: 'physics', enabled: e.target.checked });
  q('#ambient').onchange = (e) =>
    api.dispatch({ type: 'environment', ambient: e.target.value === '' ? NaN : Number(e.target.value) });
  q('#door-toggle').onclick = () => api.dispatch({ type: 'door', open: !api.getState().door });
  root.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    if (button.dataset.view) api.navigate(button.dataset.view);
    if (button.dataset.action) api.files(button.dataset.action);
    if (button.dataset.command) api.dispatch({ type: button.dataset.command });
    if (button.dataset.lesson) {
      api.clock.pause();
      api.dispatch({ type: 'lesson', id: button.dataset.lesson });
    }
  });
}
