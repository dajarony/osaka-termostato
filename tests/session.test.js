import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSession } from '../entradas/sesion.js';
test('la sesión acepta comandos y deja de operar tras shutdown', () => {
  const session = createSession();
  assert.equal(session.init().ok, true);
  assert.equal(session.run({ type: 'advance', seconds: 1 }).value.seconds, 1);
  session.shutdown();
  assert.equal(session.checkHealth().healthy, false);
  assert.equal(session.run({ type: 'advance', seconds: 1 }).error.code, 'SHUTDOWN');
});
test('un snapshot externo no modifica el regulador', () => {
  const session = createSession();
  const snapshot = session.snapshot();
  snapshot.params.SP = 900;
  snapshot.temperatures.pr1 = NaN;
  assert.equal(session.snapshot().params.SP, 4);
  assert.equal(session.snapshot().temperatures.pr1, 20);
});
