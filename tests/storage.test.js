import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseDocument } from '../entradas/documento.js';
import { createRepository } from '../entradas/almacenamiento.js';
import { createSession } from '../entradas/sesion.js';
import { serialize } from '../salidas/documento.js';
test('INV-10 exportación/importación conserva parámetros y progreso', () => {
  const state = createSession().snapshot();
  state.completed = ['consigna'];
  assert.deepEqual(parseDocument(serialize(state)).value, { params: state.params, completed: ['consigna'] });
});
for (const value of ['[]', 'null', '{}', '<script>alert(1)</script>', 'x'.repeat(100001), '{']) {
  test(`documento adversarial se rechaza: ${value.slice(0, 25)}`, () =>
    assert.equal(parseDocument(value).ok, false));
}
test('configuración parcialmente inválida nunca se importa', () => {
  const state = createSession().snapshot();
  state.params.SP = 6;
  state.params.rd = -1;
  assert.equal(parseDocument(serialize(state)).ok, false);
});
test('almacenamiento corrupto y denegado tienen fallback explícito', () => {
  assert.equal(createRepository({ getItem: () => '{' }).load().ok, false);
  const repo = createRepository({
    getItem() {
      throw Error('denied');
    },
    setItem() {
      throw Error('quota');
    },
  });
  assert.equal(repo.load().error.code, 'STORAGE_UNAVAILABLE');
  assert.equal(repo.save(createSession().snapshot()).error.code, 'STORAGE_UNAVAILABLE');
});
