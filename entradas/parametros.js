/* SUME DOCBLOCK
Nombre: validación de parámetros | Tipo: Entrada
Entradas: parche externo y configuración base.
Acciones: validar tipos, cobertura y relaciones sin mutar.
Salidas: Result de configuración completa.
*/
import { schema, defaults } from '../contratos/parametros.js';
import { fail, ok } from '../contratos/result.js';
export const plainObject = (value) =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  [Object.prototype, null].includes(Object.getPrototypeOf(value));
function validValue(rule, value) {
  if (rule.options) return rule.options.includes(value);
  if (value === 'oF') return rule.optional;
  if (typeof value !== 'number' || !Number.isFinite(value)) return false;
  if (rule.integer && !Number.isInteger(value)) return false;
  if (rule.timer)
    return (value >= -59 && value <= -1) || (value >= 1 && value <= (rule.code === 'tLo' ? 30 : 99));
  return value >= rule.min && value <= rule.max;
}
export function validateParameters(patch, base = defaults) {
  if (!plainObject(patch)) return fail('INVALID_PARAMETER', 'La configuración debe ser un objeto.');
  for (const [code, value] of Object.entries(patch)) {
    if (!Object.hasOwn(schema, code) || !validValue(schema[code], value))
      return fail('INVALID_PARAMETER', `Valor no permitido para ${code}.`, { code });
  }
  const p = { ...base, ...patch };
  if (!(p.SLS <= p.SPH && p.SPH <= p.SP && p.SP <= p.SPE && p.SPE <= p.SHS))
    return fail('INVALID_PARAMETER', 'Debe cumplirse SLS ≤ SPH ≤ SP ≤ SPE ≤ SHS.');
  if (p.FLF > p.FFL) return fail('INVALID_PARAMETER', 'FLF no puede superar FFL.');
  if (p.AHA !== 'oF' && p.ALA !== 'oF' && p.ALA > p.AHA)
    return fail('INVALID_PARAMETER', 'ALA no puede superar AHA.');
  if (p.iP2 === 'EP' && p.iP3 === 'EP')
    return fail('INVALID_PARAMETER', 'Asigna una sola sonda de evaporador.');
  if (p.ddC === 'cL' || p.rHC === 'C3' || p.ddd !== 0)
    return fail(
      'UNSUPPORTED_MODE',
      'RTC cL, C3 y reducción dinámica ddd requieren un modelo específico; no están emulados.',
    );
  return ok(p);
}
