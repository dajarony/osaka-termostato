/* SUME DOCBLOCK
Nombre: evaluación de retos | Tipo: Lógica
Entradas: escenario, parámetros y evidencia posterior al inicio.
Acciones: comprobar maniobras y orden causal.
Salidas: objetivos y resultado del reto.
*/
import { lessons } from '../contratos/retos.js';
function facts(s) {
  const events = s.lessonEvidence ?? [];
  const find = (type, test = () => true) => events.find((e) => e.type === type && test(e.detail));
  const after = (first, second) => {
    const a = find(first);
    return Boolean(a && events.some((e) => e.type === second && e.id > a.id));
  };
  return { find, after, events };
}
function cycle(s, sp, rd) {
  const { events } = facts(s);
  const on = events.find(
    (e) => e.type === 'comp:on' && e.detail.SP === sp && e.detail.rd === rd && e.detail.pr1 === sp + rd,
  );
  const off =
    on &&
    events.find((e) => e.type === 'comp:off' && e.id > on.id && e.detail.SP === sp && e.detail.pr1 === sp);
  return [Boolean(on), Boolean(off)];
}
export function evaluateLesson(s) {
  const lesson = lessons.find((l) => l.id === s.lesson);
  if (!lesson) return null;
  const p = s.params,
    t = s.temperatures,
    { find, after } = facts(s);
  const checks = {
    consigna: () => [p.SP === 15, p.rd === 4, ...cycle(s, 15, 4)],
    frio: () => [p.SP === 5, p.rd === 2, ...cycle(s, 5, 2)],
    sondas: () => [p.iP2 === 'EP', p.idS === 'P2', t.pr2 === 17 && find('probe', (d) => d.probe === 'pr2')],
    manual_temp: () => [
      p.dtS === 15,
      p.dtE === 17,
      p.dPE === 'EP',
      find('def:start'),
      after('def:start', 'def:temp'),
    ],
    manual_time: () => [p.dPE === 'oF', p.dde === 2, find('def:start'), after('def:start', 'def:time')],
    auto: () => [p.ddC === 'rt', p.ddi === -5, p.dSd === -5, find('def:auto')],
    bloqueo: () => [find('def:reject'), p.dtS === 15, after('def:reject', 'def:start')],
    fan: () => [p.oo3 === 'Fn', p.FFL === 25, s.fan && find('fan:on')],
    fan_def: () => [
      find('def:start'),
      after('def:start', 'fan:off'),
      p.FFE === 'on',
      s.phase === 'defrost' && s.fan && after('fan:off', 'fan:on'),
    ],
    goteo: () => [
      p.dtd === 2,
      after('def:start', 'def:time'),
      after('def:time', 'comp:drain'),
      after('comp:drain', 'comp:on'),
    ],
    pp2: () => [
      p.PP2 === 2,
      find('comp:off', (d) => d.pr1 === 15),
      after('comp:off', 'comp:protect'),
      after('comp:protect', 'comp:on'),
    ],
    fault: () => [
      p.idS === 'P2',
      find('fault', (d) => d.probe === 'pr2' && d.value !== 'none'),
      after('probe2:bad', 'probe2:ok') && s.faults.pr2 === 'none',
    ],
    alarma: () => [
      p.AAy === 1,
      p.AHA === 25,
      find('alarm:on', (d) => d.alarm === 'Hi'),
      after('alarm:on', 'alarm:off'),
    ],
    door: () => [p.iP3 === 'dG', p.iFi === 2, find('door:open'), after('door:open', 'door:close') && !s.door],
  }[s.lesson]();
  const goals = lesson.goals.map((label, index) => ({ label, passed: Boolean(checks[index]) }));
  return { id: lesson.id, goals, passed: goals.every((g) => g.passed) };
}
