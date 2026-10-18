/* SUME DOCBLOCK
Nombre: alarmas | Tipo: Lógica
Entradas: lecturas, umbrales, tiempos y memoria.
Acciones: evaluar alarmas con retardo e histéresis.
Salidas: avisos activos, memoria y eventos.
*/
import { reading, probeFor } from './sondas.js';
import { seconds } from './tiempo.js';
import { activeSetpoint, enabled } from './modos.js';
import { record } from './eventos.js';
function temperatureAlarm(s, name, value, threshold, high) {
  if (threshold === 'oF' || value === null) {
    delete s.alarmSince[name];
    return false;
  }
  const was = s.alarms.includes(name),
    diff = s.params.AAd;
  const condition = high ? value > threshold - (was ? diff : 0) : value < threshold + (was ? diff : 0);
  if (!condition) {
    delete s.alarmSince[name];
    return false;
  }
  s.alarmSince[name] ??= s.seconds;
  return s.seconds - s.alarmSince[name] >= seconds(s.params.AAt);
}
export function updateAlarms(s) {
  const p = s.params,
    next = [];
  if (enabled(s)) {
    for (const [i, probe] of ['pr1', 'pr2', 'pr3'].entries()) {
      if (i && ['oF', 'dG'].includes(p[`iP${i + 1}`])) continue;
      if (s.faults[probe] !== 'none') next.push(`${s.faults[probe] === 'short' ? '-' : ''}E${i + 1}`);
    }
    const blocked =
      s.seconds < seconds(p.APA, 'hours') ||
      s.phase === 'defrost' ||
      (s.defrostEnd !== null && s.seconds - s.defrostEnd < seconds(p.AdA, 'hours'));
    if (p.AAy !== 'oF' && !blocked) {
      const type = (p.AAy - 1) % 4,
        probe = type >= 2 ? probeFor(s, 'Au') : 'pr1';
      const value = probe ? reading(s, probe) : null,
        offset = type % 2 ? activeSetpoint(s) : 0;
      if (temperatureAlarm(s, 'Hi', value, p.AHA === 'oF' ? 'oF' : p.AHA + offset, true)) next.push('Hi');
      if (temperatureAlarm(s, 'Lo', value, p.ALA === 'oF' ? 'oF' : p.ALA + offset, false)) next.push('Lo');
    } else {
      delete s.alarmSince.Hi;
      delete s.alarmSince.Lo;
    }
    if (s.digital && [1, 2, 3].includes(Math.abs(p.iFi)) && s.seconds - s.doorSince >= seconds(p.AoA))
      next.push('oP');
    if (s.digital && [4, 5].includes(Math.abs(p.iFi))) next.push('AL');
  }
  for (const alarm of next)
    if (!s.alarms.includes(alarm)) {
      record(s, 'alarm:on', { alarm });
      s.acknowledged = false;
      if (p.AtA === 'on' && !s.alarmMemory.includes(alarm)) s.alarmMemory.push(alarm);
    }
  for (const alarm of s.alarms) if (!next.includes(alarm)) record(s, 'alarm:off', { alarm });
  s.alarms = next;
}
