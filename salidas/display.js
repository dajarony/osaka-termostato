/* SUME DOCBLOCK
Nombre: display F30 | Tipo: Salida
Entradas: snapshot del controlador.
Acciones: resolver lectura, mensajes y conversión visual.
Salidas: texto de display independiente del DOM.
*/
import { activeSetpoint } from '../logica/modos.js';
import { seconds } from '../logica/tiempo.js';
export function displayValue(s) {
  const p = s.params;
  if (!s.powered) return 'OFF';
  if (p.idS === 'oF') return '';
  if (s.alarms.some((x) => x.includes('E'))) return s.alarms.find((x) => x.includes('E'));
  if (s.alarms.length && (p.AAy <= 4 || !['Hi', 'Lo'].includes(s.alarms[0]))) return s.alarms[0];
  if (s.seconds < seconds(p.Pod)) return 'od';
  const post =
    s.defrostEnd !== null &&
    s.seconds - s.defrostEnd < seconds(p.AdA, 'hours') &&
    s.readings.pr1 > Math.min(s.lockedReading, activeSetpoint(s) + p.rd);
  const locked = s.phase === 'defrost' || post;
  if (locked && p.ddL === 'Lb') return s.phase === 'defrost' ? 'dEF' : 'PdF';
  if (p.idS === 'Ec' && s.mode === 'eco') return 'Eco';
  const probe = p.idS === 'P2' ? 'pr2' : p.idS === 'P3' ? 'pr3' : 'pr1';
  let value =
    locked && p.ddL === 'on' ? s.lockedReading : p.idS === 'SP' ? activeSetpoint(s) : s.readings[probe];
  value += p.iCU;
  if (p.iuP.startsWith('F')) value = (value * 9) / 5 + 32;
  return value.toFixed(p.iuP.endsWith('1') ? 1 : 0);
}
