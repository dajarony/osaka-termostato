/* SUME DOCBLOCK
Nombre: vista controlador | Tipo: Salida
Entradas: snapshot y callbacks.
Acciones: presentar panel, demandas y relés sin decidir reglas.
Salidas: DOM y comandos de usuario.
*/
import { displayValue } from './display.js';
import { escape, put } from './dom.js';
export function mountController(root, dispatch, edit, key) {
  root.innerHTML = `<div class="control-device"><div class="device-brand">OSAKA <small>F 30</small></div><div class="device-row"><div class="lcd"><div class="lcd-icons"><span id="led-comp">❄ COMP</span><span id="led-def">◈ DEF</span><span id="led-fan">◎ FAN</span></div><div class="digits" id="display" aria-label="Pantalla del controlador">20.0</div></div><div class="device-keys"><button class="key" id="device-fn" aria-label="Tecla superior programable">⏻</button><button class="key" id="device-up" aria-label="Aumentar consigna">▲</button><button class="key set" id="device-set">SET</button><button class="key" id="device-down" aria-label="Reducir consigna">▼</button><button class="key" id="device-fb" aria-label="Tecla inferior programable">fn</button></div></div><div class="device-bottom"><span>REGULADOR DIGITAL</span><span id="display-unit">°C / NTC</span></div></div>
    <div class="outputs" id="outputs"></div><div class="reason" id="control-reason"></div><div class="control-actions"><button class="btn" id="defrost">◈ Desescarche</button><button class="btn" id="power">⏻ Standby</button><select id="operating-mode" aria-label="Modo de regulación"><option value="normal">Modo normal</option><option value="eco">Modo ECO</option><option value="turbo">Modo Turbo</option></select><button class="btn" id="acknowledge">Reconocer alarma</button></div><div class="panel-foot"><span><span id="buzzer-label">Zumbador inactivo</span><label style="display:block;margin-top:6px"><input id="sound-toggle" type="checkbox"> Sonido</label></span><button class="btn small" id="unlock">Desbloquear teclas</button></div>`;
  root.querySelector('#defrost').onclick = () => dispatch({ type: 'defrost' });
  root.querySelector('#power').onclick = () => key('power');
  root.querySelector('#operating-mode').onchange = (e) => dispatch({ type: 'mode', mode: e.target.value });
  root.querySelector('#acknowledge').onclick = () => dispatch({ type: 'acknowledge' });
  for (const id of ['fn', 'up', 'set', 'down', 'fb'])
    root.querySelector(`#device-${id}`).onclick = () => key(id, edit);
  root.querySelector('#unlock').onclick = () => key('unlock');
}
export function renderController(root, s, locked) {
  put(root, '#display', locked ? 'Ln' : displayValue(s));
  put(root, '#display-unit', `${s.params.iuP.startsWith('F') ? '°F' : '°C'} / NTC`);
  for (const [id, on] of [
    ['comp', s.compressor],
    ['def', s.phase === 'defrost'],
    ['fan', s.fan],
  ])
    root.querySelector(`#led-${id}`).classList.toggle('lit', on);
  root.querySelector('#outputs').innerHTML = s.relays
    .map(
      (on, i) =>
        `<div class="output ${on ? 'on' : ''}">OUT ${i + 1} · ${escape(s.params[`oo${i + 1}`])}<b>${on ? '● ON' : '○ OFF'}</b></div>`,
    )
    .join('');
  put(
    root,
    '#control-reason',
    s.block ||
      (!s.powered
        ? 'Standby. Las salidas de regulación están desactivadas.'
        : s.phase === 'defrost'
          ? 'Desescarche en curso. El fin depende de la sonda y del tiempo máximo.'
          : s.alarms.length
            ? `Avisos activos: ${s.alarms.join(', ')}`
            : s.compressor
              ? 'Demanda activa. El relé asignado a ot alimenta la regulación.'
              : 'Consigna satisfecha. Esperando el umbral de arranque.'),
  );
  put(root, '#power', s.powered ? '⏻ Standby' : '⏻ Encender');
  put(root, '#defrost', s.phase === 'defrost' ? '■ Terminar ciclo' : '◈ Desescarche');
  put(root, '#buzzer-label', s.buzzer ? '● Zumbador de alarma activo' : 'Zumbador inactivo');
  root.querySelector('#operating-mode').value = s.mode;
}
