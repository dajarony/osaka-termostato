import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSession } from '../entradas/sesion.js';
import { createKeypad } from '../entradas/teclado.js';
import { quickSetpoints } from '../contratos/teclas.js';
test('tEd respeta todas las combinaciones y consigna activa', () => {
  const expected = [[], ['SP'], ['SPE'], ['SP', 'SPE'], ['SPH'], ['SP', 'SPH'], ['SP', 'SPE', 'SPH']];
  expected.forEach((codes, tEd) => assert.deepEqual(quickSetpoints({ tEd }, 'turbo'), codes));
});
test('tLo bloquea al alcanzar tiempo exacto y desbloqueo recupera teclado', () => {
  const session = createSession({ params: { tLo: -5 } }),
    edits = [],
    notices = [];
  const keypad = createKeypad(
    session.snapshot,
    session.run,
    (...args) => edits.push(args),
    (message) => notices.push(message),
  );
  session.run({ type: 'advance', seconds: 5 });
  keypad.key('set');
  assert.equal(edits.length, 0);
  keypad.key('unlock');
  keypad.key('up');
  assert.equal(edits.length, 1);
  assert.equal(edits[0][1].delta, 1);
});
test('tUF y tFb ejecutan funciones asignadas', () => {
  const session = createSession({ params: { tUF: 2, tFb: 3 } });
  const keypad = createKeypad(
    session.snapshot,
    session.run,
    () => {},
    () => {},
  );
  keypad.key('fn');
  assert.equal(session.snapshot().mode, 'eco');
  keypad.key('fb');
  assert.equal(session.snapshot().powered, false);
});
