/* SUME DOCBLOCK
Nombre: acciones de sesión | Tipo: Lógica
Entradas: comando previamente validado y estado.
Acciones: aplicar una intención de usuario.
Salidas: estado mutado exclusivamente por el propietario de sesión.
*/
import { advancePlant } from './planta.js';
import { recalculate } from './controlador.js';
import { record } from './eventos.js';
import { setMode } from './modos.js';
import { startDefrost, endDefrost } from './desescarche.js';
import { evaluateLesson } from './aprendizaje.js';
import { ok } from '../contratos/result.js';
const actions = {
  advance(s, c) {
    for (let i = 0; i < c.seconds; i++) {
      advancePlant(s);
      s.seconds++;
      recalculate(s, 1);
    }
  },
  configure(s, c) {
    s.params = c.patch;
    record(s, 'configure', { codes: c.codes });
  },
  probe(s, c) {
    s.temperatures[c.probe] = c.value;
    record(s, 'probe', c);
  },
  fault(s, c) {
    s.faults[c.probe] = c.value;
    record(s, 'fault', c);
    record(s, `probe${c.probe.slice(-1)}:${c.value === 'none' ? 'ok' : 'bad'}`);
  },
  door(s, c) {
    if (s.door === c.open) return;
    s.door = c.open;
    s.doorSince = s.seconds;
    if (!s.door) s.closedSince = s.seconds;
    else if (s.mode === 'eco') setMode(s, 'normal');
    record(s, c.open ? 'door:open' : 'door:close');
  },
  power(s, c) {
    s.powered = c.on;
    record(s, c.on ? 'power:on' : 'power:off');
  },
  physics(s, c) {
    s.physics = c.enabled;
    record(s, 'physics', { enabled: c.enabled });
  },
  mode(s, c) {
    setMode(s, c.mode);
    record(s, 'mode', { mode: c.mode });
  },
  environment(s, c) {
    s.ambient = c.ambient;
  },
  defrost(s) {
    if (s.phase === 'defrost') {
      endDefrost(s, 'manual');
      return ok(null);
    }
    return startDefrost(s);
  },
  acknowledge(s) {
    s.acknowledged = true;
    s.alarmMemory = [];
    record(s, 'acknowledge');
  },
  auxiliary(s) {
    s.auxManual = !s.auxManual;
    s.auxSince = s.seconds;
  },
  grade(s) {
    s.grade = evaluateLesson(s);
    if (s.grade?.passed && !s.completed.includes(s.lesson)) s.completed.push(s.lesson);
  },
  endLesson(s) {
    s.lesson = null;
    s.lessonEvidence = [];
    s.grade = null;
  },
};
export function applyAction(s, command) {
  const result = actions[command.type](s, command);
  if (command.type !== 'advance') recalculate(s);
  return result ?? ok(null);
}
