import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSession } from '../../entradas/sesion.js';
import { trainingDefaults } from '../../contratos/parametros.js';
const run = (s, c) => {
  const r = s.run(c);
  assert.equal(r.ok, true, JSON.stringify(r));
  return r.value;
};
const setup = (patch) => {
  const s = createSession({ params: { ...trainingDefaults, ...patch } });
  assert.equal(s.init().ok, true);
  run(s, { type: 'physics', enabled: false });
  return s;
};

test('ECO digital vuelve a normal al liberar el contacto', () => {
  const s = setup({ iP3: 'dG', iFi: 6 });
  assert.equal(run(s, { type: 'door', open: true }).mode, 'eco');
  assert.equal(run(s, { type: 'door', open: false }).mode, 'normal');
});
test('entradas digitales 9 y 10 disparan y terminan el ciclo por flanco', () => {
  const s = setup({ iP3: 'dG', iFi: 9, iti: -3 });
  run(s, { type: 'door', open: true });
  assert.equal(run(s, { type: 'advance', seconds: 2 }).phase, 'idle');
  assert.equal(run(s, { type: 'advance', seconds: 1 }).phase, 'defrost');
  run(s, { type: 'door', open: false });
  run(s, { type: 'configure', patch: { iFi: 10 } });
  run(s, { type: 'door', open: true });
  assert.equal(run(s, { type: 'advance', seconds: 3 }).phase, 'idle');
});
test('sin sonda de fin ni límite de tiempo el desescarche se rechaza', () => {
  const s = setup({ iP2: 'Au', dPE: 'EP', dde: 'oF' });
  assert.equal(s.run({ type: 'defrost' }).ok, false);
  assert.equal(s.snapshot().phase, 'idle');
});
test('F30 sin energía de compresor no genera calor de gas caliente', () => {
  const s = createSession({ params: { ...trainingDefaults, oo1: 'oF', oo3: 'oF', ddt: 'in', dPE: 'oF' } });
  run(s, { type: 'defrost' });
  const initial = s.snapshot().temperatures.pr2;
  const after = run(s, { type: 'advance', seconds: 60 });
  assert.ok(after.temperatures.pr2 - initial < 1, 'Un relé de válvula no aporta energía sin compresor');
});
test('opciones de sesión inválidas devuelven error controlado en init', () => {
  for (const options of [null, [], { completed: {} }, { completed: ['missing'] }, { params: { rd: -2 } }]) {
    const s = createSession(options);
    assert.equal(s.init().ok, false);
  }
});
