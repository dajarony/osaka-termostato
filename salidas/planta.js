/* SUME DOCBLOCK
Nombre: vista de cámara | Tipo: Salida
Entradas: temperaturas y actuadores de la sesión.
Acciones: representar físicamente aire, evaporador y producto.
Salidas: diagrama SVG anotado y animación de estado.
*/
import { temperature } from './dom.js';
export function renderPlant(root, s, running) {
  const active = (role) => s.relays.some((on, i) => on && s.params[`oo${i + 1}`] === role);
  const cooling = active('ot'),
    fan = active('Fn'),
    defrost = active('dF');
  root.innerHTML = `<div class="chamber-wrap"><svg viewBox="0 0 580 315" role="img" aria-label="Cámara: aire ${temperature(s.temperatures.pr1)} grados, evaporador ${temperature(s.temperatures.pr2)} grados, puerta ${s.door ? 'abierta' : 'cerrada'}">
  <defs><pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" fill="none" stroke="var(--line)" stroke-width=".45"/></pattern><linearGradient id="wall" x2="0" y2="1"><stop stop-color="var(--surface)"/><stop offset="1" stop-color="var(--line)"/></linearGradient></defs>
  <rect width="580" height="315" fill="url(#grid)"/><text x="22" y="27" class="plant-tag">CÁMARA 01 · VISTA DE CORTE</text><text x="448" y="27" class="plant-tag">${s.physics ? 'MODELO TÉRMICO' : 'BANCO MANUAL'}</text>
  <ellipse cx="326" cy="283" rx="204" ry="13" fill="var(--line)" opacity=".45"/>
  <path d="M145 68L180 47H476L505 68V266L477 282H145Z" fill="url(#wall)" stroke="var(--muted)" stroke-width="1.5"/>
  <path d="M160 79H490V267H160Z" fill="var(--surface)" stroke="var(--line)"/><path d="M160 248H490L477 267H160Z" fill="var(--paper)"/>
  <path d="M160 79L180 63H476L490 79" fill="none" stroke="var(--line)"/><path d="M477 79V248" stroke="var(--line)"/>
  <rect x="345" y="79" width="112" height="35" rx="4" fill="var(--paper)" stroke="var(--muted)"/>
  ${[352, 359, 366, 373, 380, 387].map((x) => `<path d="M${x} 83V109" stroke="${defrost ? 'var(--accent)' : 'var(--blue)'}" stroke-width="2"/>`).join('')}
  <circle cx="408" cy="95" r="15" fill="var(--surface)" stroke="var(--muted)"/><g class="${fan && running ? 'fan-rotor' : ''}" fill="var(--muted)"><path d="M408 94C389 77 400 75 409 91C430 79 429 90 411 96C423 115 411 115 407 99C387 109 387 96 404 95Z"/></g><circle cx="408" cy="95" r="3" fill="var(--ink)"/>
  <path d="M401 124C399 146 379 155 350 157M423 124C425 150 444 161 462 165" fill="none" stroke="var(--blue)" stroke-width="2" opacity="${fan ? '.7' : '.15'}" class="${fan && running ? 'circuit' : ''}"/>
  <g fill="var(--accent-soft)" stroke="var(--accent)"><rect x="207" y="194" width="55" height="51" rx="2"/><rect x="267" y="194" width="55" height="51" rx="2"/><rect x="218" y="152" width="62" height="39" rx="2"/><path d="M235 194V245M294 194V245M249 152V191" opacity=".5"/></g><path d="M195 247H337V254H195Z" fill="var(--muted)"/>
  <path d="M${s.door ? '145 79L104 102V281L145 267' : '145 79L174 85V267L145 267'}Z" fill="var(--paper)" stroke="var(--muted)" stroke-width="1.5"/><path d="M${s.door ? '114 178V205' : '166 173V199'}" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>
  <rect x="22" y="183" width="82" height="67" rx="9" fill="var(--dark)"/><circle cx="63" cy="211" r="21" fill="var(--ink)" stroke="var(--muted)"/><path d="M49 211H77M63 197V225" stroke="${cooling ? 'var(--display)' : 'var(--muted)'}" stroke-width="2"/><text x="31" y="239" fill="var(--surface)" font-size="8" font-family="var(--mono)">COMPRESOR</text>
  <path d="M62 183V97H145M104 217H128V124H345" fill="none" stroke="var(--blue)" stroke-width="3" opacity=".7" class="${cooling && running ? 'circuit' : ''}"/>
  <rect x="185" y="92" width="115" height="49" rx="6" fill="var(--green-soft)"/><text x="195" y="108" class="plant-tag">Pr1 / AIRE</text><text x="195" y="130" class="plant-value">${temperature(s.temperatures.pr1)}°</text>
  <text x="350" y="193" class="plant-tag">Pr2 / EVAPORADOR</text><text x="350" y="216" class="plant-value">${temperature(s.temperatures.pr2)}°</text>
  <text x="202" y="275" class="plant-label">Pr3 ${temperature(s.temperatures.pr3)}°</text><text x="22" y="298" class="plant-tag">${s.door ? 'PUERTA ABIERTA · ENTRADA DE CALOR' : 'PUERTA CERRADA · RECINTO AISLADO'}</text>
  <circle cx="527" cy="89" r="4" fill="${defrost ? 'var(--accent)' : 'var(--line)'}"/><text x="516" y="108" class="plant-tag">DEF</text></svg></div>`;
}
