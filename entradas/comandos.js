/* SUME DOCBLOCK
Nombre: comandos | Tipo: Entrada
Entradas: solicitud externa.
Acciones: validar la puerta pública antes de mutación.
Salidas: Result del comando.
*/
import { ok, fail } from '../contratos/result.js';
import { plainObject } from './parametros.js';
import { lessons } from '../contratos/retos.js';
const finite = (x, min, max) => typeof x === 'number' && Number.isFinite(x) && x >= min && x <= max;
const probes = ['pr1', 'pr2', 'pr3'];
const validators = {
  configure: (c) => plainObject(c.patch),
  advance: (c) => Number.isInteger(c.seconds) && finite(c.seconds, 1, 3600),
  probe: (c) => probes.includes(c.probe) && finite(c.value, -50, 80),
  fault: (c) => probes.includes(c.probe) && ['none', 'open', 'short'].includes(c.value),
  door: (c) => typeof c.open === 'boolean',
  power: (c) => typeof c.on === 'boolean',
  physics: (c) => typeof c.enabled === 'boolean',
  mode: (c) => ['normal', 'eco', 'turbo'].includes(c.mode),
  environment: (c) => finite(c.ambient, 0, 45),
  lesson: (c) => lessons.some((l) => l.id === c.id),
  defrost: () => true,
  acknowledge: () => true,
  reset: () => true,
  grade: () => true,
  auxiliary: () => true,
  endLesson: () => true,
};
export function validateCommand(command) {
  if (!plainObject(command) || !Object.hasOwn(validators, command.type) || !validators[command.type](command))
    return fail('INVALID_COMMAND', 'Comando o valores no válidos.');
  return ok(command);
}
