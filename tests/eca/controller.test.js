import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createSession } from '../../entradas/sesion.js';
import { trainingDefaults } from '../../contratos/parametros.js';
const oracle = JSON.parse(readFileSync(new URL('../../contratos/oraculo.json', import.meta.url)));
assert.equal(Object.keys(oracle.invariants).length, 12);
const command = (session, c) => {
  const r = session.run(c);
  assert.equal(r.ok, true, JSON.stringify(r));
  return r.value;
};
function bench(patch = {}) {
  const session = createSession({ params: { ...trainingDefaults, ...patch } });
  assert.equal(session.init().ok, true);
  command(session, { type: 'physics', enabled: false });
  return session;
}
const probe = (s, value, key = 'pr1') => command(s, { type: 'probe', probe: key, value });
const step = (s, seconds) => command(s, { type: 'advance', seconds });
const configure = (s, patch) => command(s, { type: 'configure', patch });

test('INV-2 frío: umbrales exactos y retención de histéresis', () => {
  const s = bench();
  assert.equal(probe(s, 15).compressor, false);
  assert.equal(probe(s, 18.9).compressor, false);
  assert.equal(probe(s, 19).compressor, true);
  assert.equal(probe(s, 16).compressor, true);
  assert.equal(probe(s, 15).compressor, false);
});
test('calor: umbrales inversos', () => {
  const s = bench({ rHC: 'H' });
  assert.equal(probe(s, 11).compressor, true);
  assert.equal(probe(s, 14).compressor, true);
  assert.equal(probe(s, 15).compressor, false);
});
test('INV-1 standby cancela ciclo y desactiva regulación incluso después de avanzar', () => {
  const s = bench({ ddi: -1, dSd: -1 });
  command(s, { type: 'defrost' });
  command(s, { type: 'power', on: false });
  const state = step(s, 180);
  assert.deepEqual(state.relays, [false, false, false]);
  assert.equal(state.phase, 'idle');
  assert.equal(state.compressor, false);
  assert.equal(state.fan, false);
});
test('INV-1 excepción explícita auxiliar modo 5 en standby', () => {
  const s = bench({ oo3: 'Au', oFo: 5 });
  command(s, { type: 'auxiliary' });
  const state = command(s, { type: 'power', on: false });
  assert.deepEqual(state.relays, [false, false, true]);
});
test('INV-4 PP2 conserva parada real causada por desescarche', () => {
  const s = bench({ PP2: 2, dde: -10, dPE: 'oF' });
  command(s, { type: 'defrost' });
  assert.equal(s.snapshot().lastStop, 0);
  assert.equal(step(s, 10).compressor, false);
  assert.equal(step(s, 109).compressor, false);
  assert.equal(step(s, 1).compressor, true);
});
test('PP1 demora demanda; PP3 limita dos arranques', () => {
  const s = bench({ PP1: -10, PP3: -30 });
  assert.equal(step(s, 9).compressor, false);
  assert.equal(step(s, 1).compressor, true);
  probe(s, 15);
  probe(s, 20);
  assert.equal(step(s, 29).compressor, false);
  assert.equal(step(s, 1).compressor, true);
});
test('INV-5 dde negativo: fin a los diez segundos exactos', () => {
  const s = bench({ dde: -10, dPE: 'oF' });
  command(s, { type: 'defrost' });
  assert.equal(step(s, 9).phase, 'defrost');
  assert.equal(step(s, 1).phase, 'idle');
  assert.equal(s.snapshot().events.find((e) => e.type === 'def:time').time, 10);
});
test('INV-6 eléctrico apaga compresor y gas caliente lo solicita', () => {
  for (const [ddt, expected] of [
    ['EL', false],
    ['in', true],
    ['no', true],
  ]) {
    const s = bench({ ddt, dPE: 'oF' });
    command(s, { type: 'defrost' });
    assert.equal(s.snapshot().compressor, expected, ddt);
  }
});
test('Et regula resistencia con un grado y termina por duración', () => {
  const s = bench({ ddt: 'Et', dtE: 17, dde: -20 });
  command(s, { type: 'defrost' });
  assert.equal(probe(s, 17, 'pr2').defrostRelay, false);
  assert.equal(s.snapshot().phase, 'defrost');
  assert.equal(probe(s, 16.5, 'pr2').defrostRelay, false);
  assert.equal(probe(s, 16, 'pr2').defrostRelay, true);
  assert.equal(step(s, 20).phase, 'idle');
});
test('INV-7 goteo negativo y FFd independiente', () => {
  const s = bench({ dde: -5, dPE: 'oF', dtd: -10, FFd: -20 });
  command(s, { type: 'defrost' });
  assert.equal(step(s, 5).phase, 'drain');
  assert.equal(step(s, 9).compressor, false);
  let state = step(s, 1);
  assert.equal(state.compressor, true);
  assert.equal(state.fan, false);
  state = step(s, 10);
  assert.equal(state.fan, true);
});
test('fin por temperatura usa Pr3 si es el evaporador', () => {
  const s = bench({ iP2: 'Au', iP3: 'EP' });
  command(s, { type: 'defrost' });
  assert.equal(probe(s, 17, 'pr3').phase, 'idle');
});
test('fallo EP usa dEE y continúa control por Pr1', () => {
  const s = bench({ dde: 10, dEE: -10 });
  command(s, { type: 'defrost' });
  command(s, { type: 'fault', probe: 'pr2', value: 'open' });
  assert.equal(step(s, 9).phase, 'defrost');
  assert.equal(step(s, 1).phase, 'idle');
  assert.equal(s.snapshot().compressor, true);
});
test('automático rt cuenta minutos negativos y ct solo marcha de compresor', () => {
  const rt = bench({ ddi: -1, dSd: -1, dPE: 'oF' });
  probe(rt, 15);
  assert.equal(step(rt, 59).phase, 'idle');
  assert.equal(step(rt, 1).phase, 'defrost');
  const ct = bench({ ddi: -1, dSd: -1, ddC: 'ct', dPE: 'oF' });
  probe(ct, 15);
  assert.equal(step(ct, 120).phase, 'idle');
  probe(ct, 20);
  assert.equal(step(ct, 60).phase, 'defrost');
});
test('dtS bloquea por encima y permite igualdad', () => {
  const s = bench({ dtS: 13 });
  probe(s, 13.1, 'pr2');
  assert.equal(s.run({ type: 'defrost' }).error.code, 'DEFROST_BLOCKED');
  probe(s, 13, 'pr2');
  assert.equal(command(s, { type: 'defrost' }).phase, 'defrost');
});
test('ventilador conserva histéresis FdF', () => {
  const s = bench({ FFL: 20, FdF: 2 });
  assert.equal(probe(s, 21, 'pr2').fan, false);
  assert.equal(probe(s, 19, 'pr2').fan, false);
  assert.equal(probe(s, 18, 'pr2').fan, true);
});
test('Ftn/FtF cuenta desde la parada del compresor', () => {
  const s = bench({ Ftn: -10, FtF: -5 });
  step(s, 7);
  probe(s, 15);
  assert.equal(step(s, 9).fan, true);
  assert.equal(step(s, 1).fan, false);
  assert.equal(step(s, 5).fan, true);
});
test('iFi 1 no bloquea, 2 bloquea ventilador, 3 bloquea ambos', () => {
  for (const [iFi, comp, fan] of [
    [1, true, true],
    [2, true, false],
    [3, false, false],
  ]) {
    const s = bench({ iP3: 'dG', iFi });
    const state = command(s, { type: 'door', open: true });
    assert.equal(state.compressor, comp, String(iFi));
    assert.equal(state.fan, fan, String(iFi));
  }
});
test('entrada digital con retardo, lógica invertida y sin configuración', () => {
  const s = bench({ iP3: 'dG', iFi: 3, iti: -5 });
  command(s, { type: 'door', open: true });
  assert.equal(step(s, 4).compressor, true);
  assert.equal(step(s, 1).compressor, false);
  configure(s, { iFi: -3 });
  assert.equal(s.snapshot().compressor, true);
  command(s, { type: 'door', open: false });
  assert.equal(step(s, 5).compressor, false);
  configure(s, { iP3: 'Au' });
  assert.equal(s.snapshot().compressor, true);
});
test('fallo Pr1 rt1/rt2 cicla y recuperación vuelve al control normal', () => {
  const s = bench({ rt1: -10, rt2: -5 });
  command(s, { type: 'fault', probe: 'pr1', value: 'open' });
  assert.equal(step(s, 9).compressor, true);
  assert.equal(step(s, 1).compressor, false);
  assert.equal(step(s, 5).compressor, true);
  command(s, { type: 'fault', probe: 'pr1', value: 'none' });
  assert.equal(probe(s, 15).compressor, false);
});
test('alarmas Hi/Lo usan retardo y recuperación con diferencial', () => {
  const s = bench({ AHA: 25, ALA: 5, AAt: -5, AAd: 2 });
  probe(s, 26);
  assert.equal(step(s, 4).alarms.includes('Hi'), false);
  assert.equal(step(s, 1).alarms.includes('Hi'), true);
  assert.equal(probe(s, 24).alarms.includes('Hi'), true);
  assert.equal(probe(s, 23).alarms.includes('Hi'), false);
  probe(s, 4);
  assert.equal(step(s, 5).alarms.includes('Lo'), true);
  assert.equal(probe(s, 7).alarms.includes('Lo'), false);
});
test('APA inhibe alarma de temperatura y memoria se reconoce explícitamente', () => {
  const s = bench({ AHA: 10, APA: -1, AtA: 'on' });
  assert.equal(step(s, 59).alarms.includes('Hi'), false);
  assert.equal(step(s, 1).alarms.includes('Hi'), true);
  probe(s, 9);
  assert.deepEqual(s.snapshot().alarmMemory, ['Hi']);
  assert.deepEqual(command(s, { type: 'acknowledge' }).alarmMemory, []);
});
test('modos ECO y Turbo alteran consigna y expiran por tiempo', () => {
  const s = bench({ rtC: -1, itt: -1 });
  assert.equal(command(s, { type: 'mode', mode: 'eco' }).compressor, false);
  assert.equal(step(s, 60).mode, 'normal');
  command(s, { type: 'mode', mode: 'turbo' });
  assert.equal(step(s, 60).mode, 'normal');
});
test('INV-9 lote de tiempo equivale a pasos unitarios', () => {
  const a = createSession(),
    b = createSession();
  step(a, 60);
  for (let i = 0; i < 60; i++) step(b, 1);
  assert.deepEqual(a.snapshot(), b.snapshot());
});
test('INV-8 relé ot desasignado no enfría la planta', () => {
  const a = createSession({ params: { oo1: 'oF', oo3: 'oF' } });
  const b = createSession({ params: { oo3: 'oF' } });
  step(a, 600);
  step(b, 600);
  assert.ok(a.snapshot().temperatures.pr2 > b.snapshot().temperatures.pr2 + 10);
  assert.equal(a.snapshot().energyWh, 0);
});
test('INV-12 ocho horas de cámara finitas y trazas acotadas', () => {
  const s = createSession();
  for (let i = 0; i < 8; i++) step(s, 3600);
  const state = s.snapshot();
  assert.ok(Object.values(state.temperatures).every((v) => Number.isFinite(v) && v > -50 && v < 80));
  assert.ok(state.energyWh > 0 && Number.isFinite(state.energyWh));
  assert.ok(state.events.length <= 600);
  assert.ok(state.samples.length <= 360);
});
test('calibración afecta regulación y filtro converge sin saltos', () => {
  const s = bench({ iC1: -5 });
  assert.equal(s.snapshot().compressor, false);
  configure(s, { iC1: 0, iFt: 10 });
  probe(s, 30);
  const before = s.snapshot().readings.pr1;
  step(s, 1);
  assert.ok(s.snapshot().readings.pr1 > before && s.snapshot().readings.pr1 < 30);
});

const invalid = [
  null,
  [],
  {},
  'advance',
  { type: '__proto__' },
  { type: 'advance', seconds: 0 },
  { type: 'advance', seconds: Infinity },
  { type: 'advance', seconds: 3601 },
  { type: 'advance', seconds: 1.5 },
  { type: 'probe', probe: 'pr1', value: NaN },
  { type: 'probe', probe: 'pr1', value: null },
  { type: 'probe', probe: 'pr4', value: 20 },
  { type: 'door', open: 'true' },
  { type: 'configure', patch: [] },
  { type: 'configure', patch: { SP: null } },
  { type: 'configure', patch: { SP: '20' } },
  { type: 'configure', patch: { SP: 9999 } },
  { type: 'configure', patch: { rd: -1 } },
  { type: 'configure', patch: { PP2: 0 } },
  { type: 'configure', patch: { PP2: -60 } },
  { type: 'configure', patch: { unknown: 1 } },
  { type: 'configure', patch: { rHC: 'C3' } },
  { type: 'configure', patch: { ddC: 'cL' } },
  { type: 'configure', patch: { ddd: 10 } },
];
invalid.forEach((input, index) =>
  test(`INV-3 inyección ${index + 1}: rechazo atómico`, () => {
    const s = bench(),
      before = s.snapshot();
    assert.equal(s.run(input).ok, false);
    assert.deepEqual(s.snapshot(), before);
  }),
);
