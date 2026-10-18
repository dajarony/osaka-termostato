/* SUME DOCBLOCK
Nombre: módulo de sesión | Tipo: Entrada
Entradas: comandos y configuración externa.
Acciones: validar y orquestar el dominio aislado.
Salidas: Result, snapshots y salud del módulo.
*/
import { defaults, trainingDefaults } from '../contratos/parametros.js';
import { lessons } from '../contratos/retos.js';
import { fail, ok } from '../contratos/result.js';
import { validateCommand } from './comandos.js';
import { validateParameters, plainObject } from './parametros.js';
import { initialState } from '../logica/estado.js';
import { recalculate } from '../logica/controlador.js';
import { applyAction } from '../logica/acciones.js';
import { evaluateLesson } from '../logica/aprendizaje.js';

export const SESSION_ID = 'osaka.session';
export function createSession(options = {}) {
  const validOptions =
    plainObject(options) &&
    (options.completed === undefined ||
      (Array.isArray(options.completed) &&
        options.completed.every((id) => lessons.some((l) => l.id === id))));
  const validation = validOptions
    ? validateParameters(options.params ?? {}, defaults)
    : fail('INVALID_SESSION', 'Opciones o progreso de sesión no válidos.');
  let state = initialState(validation.ok ? validation.value : defaults);
  let alive = validation.ok;
  state.completed = validation.ok ? [...new Set(options.completed ?? [])] : [];
  recalculate(state);
  const snapshot = () => structuredClone({ ...state, lessonProgress: evaluateLesson(state) });
  function reset(command) {
    const completed = state.completed;
    const lesson = command.type === 'lesson' ? lessons.find((l) => l.id === command.id) : null;
    const params = lesson ? { ...trainingDefaults, ...lesson.setup.p } : state.params;
    state = initialState(params);
    state.completed = completed;
    if (lesson) {
      Object.assign(state.temperatures, lesson.setup.t);
      state.physics = false;
    }
    recalculate(state);
    state.events = [];
    state.sequence = 0;
    if (lesson) {
      state.lesson = lesson.id;
      state.lessonEvidence = [];
    }
    return ok(snapshot());
  }
  function run(command) {
    if (!alive) return fail('SHUTDOWN', 'La sesión está cerrada.');
    const checked = validateCommand(command);
    if (!checked.ok) return checked;
    if (['reset', 'lesson'].includes(command.type)) return reset(command);
    let action = command;
    if (command.type === 'configure') {
      const result = validateParameters(command.patch, state.params);
      if (!result.ok) return result;
      action = { type: 'configure', patch: result.value, codes: Object.keys(command.patch) };
    }
    const result = applyAction(state, action);
    return result.ok ? ok(snapshot()) : result;
  }
  return {
    id: SESSION_ID,
    version: '1.0.0',
    dependencies: ['controller', 'plant', 'learning'],
    init: () => (validation.ok ? ok(snapshot()) : validation),
    run,
    snapshot,
    checkHealth: () => ({ healthy: alive, seconds: state.seconds }),
    fallback: () => ok(snapshot()),
    shutdown: () => {
      alive = false;
      return ok(null);
    },
  };
}
