/* SUME DOCBLOCK
Nombre: vista sondas | Tipo: Salida
Entradas: snapshot y función dispatch.
Acciones: presentar lectura y entradas de perturbación.
Salidas: comandos probe y fault validados por sesión.
*/
import { temperature } from './dom.js';
const names = ['Cámara / aire', 'Evaporador', 'Producto / auxiliar'];
export function mountProbes(root, dispatch) {
  root.innerHTML = names
    .map(
      (name, i) =>
        `<div class="probe"><div class="probe-head"><span><b>Pr${i + 1}</b> · ${name}</span><strong id="reading-pr${i + 1}"></strong></div><div class="probe-controls"><input aria-label="Deslizador Pr${i + 1}" type="range" data-probe="pr${i + 1}" min="-50" max="80" step="0.1"><input aria-label="Temperatura Pr${i + 1}" type="number" data-probe="pr${i + 1}" min="-50" max="80" step="0.1"><select aria-label="Avería Pr${i + 1}" data-fault="pr${i + 1}"><option value="none">Sin avería</option><option value="open">Abierta E${i + 1}</option><option value="short">Corto -E${i + 1}</option></select></div></div>`,
    )
    .join('');
  root.querySelectorAll('[data-probe]').forEach(
    (input) =>
      (input.onchange = () =>
        dispatch({
          type: 'probe',
          probe: input.dataset.probe,
          value: input.value === '' ? NaN : Number(input.value),
        })),
  );
  root
    .querySelectorAll('[data-fault]')
    .forEach(
      (input) =>
        (input.onchange = () => dispatch({ type: 'fault', probe: input.dataset.fault, value: input.value })),
    );
}
export function renderProbes(root, s) {
  for (const probe of ['pr1', 'pr2', 'pr3']) {
    root.querySelector(`#reading-${probe}`).textContent =
      s.faults[probe] === 'none'
        ? `${temperature(s.readings[probe])} °C`
        : `${s.faults[probe] === 'short' ? '-' : ''}E${probe.slice(-1)}`;
    root.querySelectorAll(`[data-probe="${probe}"]`).forEach((input) => {
      if (input !== document.activeElement) input.value = s.temperatures[probe].toFixed(1);
    });
    root.querySelector(`[data-fault="${probe}"]`).value = s.faults[probe];
  }
}
