/* SUME DOCBLOCK
Nombre: regulación | Tipo: Lógica
Entradas: sondas, consigna, fases y protecciones.
Acciones: resolver histéresis y proteger toda transición de compresor.
Salidas: demanda, salida y razón de espera.
*/
import { seconds, elapsedSince } from './tiempo.js';
import { reading } from './sondas.js';
import { activeSetpoint, activeDifferential, enabled } from './modos.js';
import { record } from './eventos.js';
export function hysteresis(value, setpoint, differential, previous, heating = false) {
  if (heating) return value >= setpoint ? false : value <= setpoint - differential ? true : previous;
  return value <= setpoint ? false : value >= setpoint + differential ? true : previous;
}
function faultDemand(s) {
  s.faultSince ??= s.seconds;
  const on = seconds(s.params.rt1),
    off = seconds(s.params.rt2);
  return on > 0 && (!off || (s.seconds - s.faultSince) % (on + off) < on);
}
function protection(s) {
  const p = s.params;
  if (s.seconds < seconds(p.Pod)) return 'Pod · retardo inicial';
  if (s.seconds < s.drainUntil) return 'dtd · goteo';
  if (elapsedSince(s.seconds, s.lastStop) < seconds(p.PP2)) return 'PP2 · mínimo tiempo parado';
  if (elapsedSince(s.seconds, s.lastStart) < seconds(p.PP3)) return 'PP3 · tiempo entre arranques';
  if (elapsedSince(s.seconds, s.demandSince) < seconds(p.PP1)) return 'PP1 · retardo de demanda';
  return '';
}
export function updateRegulation(s) {
  const p = s.params,
    value = reading(s, 'pr1'),
    before = s.compressor;
  s.demand =
    value === null
      ? faultDemand(s)
      : hysteresis(value, activeSetpoint(s), activeDifferential(s), s.demand, p.rHC === 'H');
  if (value !== null) s.faultSince = null;
  s.heat =
    value !== null &&
    ['nr', 'HC'].includes(p.rHC) &&
    hysteresis(value, p.rHC === 'HC' ? p.SPH : activeSetpoint(s), p.rHd, s.heat, true);
  let wanted = s.demand;
  if (s.phase === 'defrost' && p.ddt !== 'no') wanted = p.ddt === 'in';
  const disabled = !enabled(s) || (s.digital && [3, 5].includes(Math.abs(p.iFi)));
  if (disabled || s.phase === 'drain') wanted = false;
  if (wanted) s.demandSince ??= s.seconds;
  else s.demandSince = null;
  s.block = wanted && !before ? protection(s) : s.phase === 'drain' ? 'dtd · goteo' : '';
  s.compressor = wanted && !s.block;
  s.heat = s.heat && !disabled && s.phase === 'idle' && !s.compressor;
  if (s.seconds < seconds(p.Pod)) {
    s.compressor = false;
    s.heat = false;
    s.block = 'Pod · retardo inicial';
  }
  if (before !== s.compressor) {
    if (s.compressor) {
      s.lastStart = s.seconds;
      s.starts++;
    } else s.lastStop = s.seconds;
    record(s, s.compressor ? 'comp:on' : 'comp:off', {
      pr1: value,
      SP: activeSetpoint(s),
      rd: activeDifferential(s),
    });
  }
  if (s.block && s.block !== s.previousBlock)
    record(s, s.block.startsWith('dtd') ? 'comp:drain' : 'comp:protect', { reason: s.block });
  s.previousBlock = s.block;
}
