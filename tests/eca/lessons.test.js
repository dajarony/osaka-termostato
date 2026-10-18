import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSession } from '../../entradas/sesion.js';
import { lessons } from '../../contratos/retos.js';
const config = (patch) => ({ type: 'configure', patch });
const probe = (value, key = 'pr1') => ({ type: 'probe', probe: key, value });
const defrost = { type: 'defrost' };
const advance = (seconds) => ({ type: 'advance', seconds });
const fault = (value) => ({ type: 'fault', probe: 'pr2', value });
const door = (open) => ({ type: 'door', open });
const scenarios = {
  consigna: [config({ SP: 15, rd: 4 }), probe(19), probe(15)],
  frio: [config({ SP: 5, rd: 2 }), probe(5), probe(7), probe(5)],
  sondas: [config({ idS: 'P2' }), probe(17, 'pr2')],
  manual_temp: [config({ dtS: 15, dtE: 17, dPE: 'EP' }), defrost, probe(17, 'pr2')],
  manual_time: [config({ dPE: 'oF', dde: 2 }), defrost, advance(120)],
  auto: [config({ ddi: -5, dSd: -5 }), advance(300)],
  bloqueo: [defrost, config({ dtS: 15 }), defrost],
  fan: [config({ FFL: 25 })],
  fan_def: [defrost, config({ FFE: 'on' })],
  goteo: [config({ dtd: 2 }), defrost, advance(60), advance(120)],
  pp2: [config({ PP2: 2 }), probe(15), probe(19), advance(120)],
  fault: [config({ idS: 'P2' }), fault('open'), fault('none')],
  alarma: [config({ AAy: 1, AHA: 25 }), probe(27), probe(20)],
  door: [config({ iP3: 'dG', iFi: 2 }), door(true), door(false)],
};
for (const lesson of lessons) {
  test(`INV-11 ${lesson.id}: inicializar no aprueba; maniobra completa sí`, () => {
    const session = createSession();
    assert.equal(session.run({ type: 'lesson', id: lesson.id }).ok, true);
    assert.equal(session.run({ type: 'grade' }).value.grade.passed, false);
    for (const input of scenarios[lesson.id]) {
      const result = session.run(input);
      if (!result.ok) assert.equal(result.error.code, 'DEFROST_BLOCKED');
    }
    const result = session.run({ type: 'grade' }).value;
    assert.equal(result.grade.passed, true, JSON.stringify(result.grade));
    assert.ok(result.completed.includes(lesson.id));
  });
}
test('retos de histéresis no aceptan arranque y parada fuera del umbral requerido', () => {
  const session = createSession();
  session.run({ type: 'lesson', id: 'consigna' });
  [config({ SP: 15, rd: 4 }), probe(25), probe(10)].forEach((c) => session.run(c));
  assert.equal(session.run({ type: 'grade' }).value.grade.passed, false);
});
