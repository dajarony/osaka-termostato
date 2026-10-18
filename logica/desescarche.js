/* SUME DOCBLOCK
Nombre: desescarche | Tipo: Lógica
Entradas: sondas, reloj y configuración.
Acciones: administrar inicio, regulación térmica, fin y goteo.
Salidas: fase, relé y motivos auditables.
*/
import { seconds } from './tiempo.js';
import { evaporator, reading, probeFor } from './sondas.js';
import { enabled } from './modos.js';
import { record } from './eventos.js';
import { fail, ok } from '../contratos/result.js';
export function startDefrost(s, reason = 'manual') {
  const ep = evaporator(s);
  if (!enabled(s) || s.phase !== 'idle' || (ep !== null && ep > s.params.dtS)) {
    record(s, 'def:reject', { ep, limit: s.params.dtS });
    return fail(
      'DEFROST_BLOCKED',
      'Desescarche bloqueado: standby, ciclo activo, goteo o evaporador por encima de dtS.',
    );
  }
  const temperatureStop =
    s.params.ddt !== 'Et' &&
    (s.params.dPE === 'P1' ? reading(s, 'pr1') !== null : s.params.dPE === 'EP' && ep !== null);
  const faultStop = probeFor(s, 'EP') && ep === null && seconds(s.params.dEE);
  if (!seconds(s.params.dde) && !temperatureStop && !faultStop)
    return fail('DEFROST_BLOCKED', 'Configura un final por tiempo o temperatura.');
  s.phase = 'defrost';
  s.defrostSince = s.seconds;
  s.defrostReason = reason;
  s.lockedReading = s.readings.pr1;
  s.firstDefrost = false;
  s.interval = 0;
  s.defrostRelay = true;
  record(s, 'def:start', { reason, ep });
  if (reason !== 'manual') record(s, 'def:auto', { reason });
  return ok(null);
}
export function endDefrost(s, reason) {
  s.defrostRelay = false;
  s.defrostEnd = s.seconds;
  s.interval = 0;
  s.drainUntil = s.seconds + seconds(s.params.dtd);
  s.fanUntil = s.seconds + seconds(s.params.FFd);
  s.phase = s.drainUntil > s.seconds ? 'drain' : 'idle';
  s.coldSince = null;
  record(s, `def:${reason}`, { duration: s.seconds - s.defrostSince });
}
function runningDefrost(s) {
  const p = s.params,
    ep = evaporator(s),
    sensor = p.dPE === 'P1' ? reading(s, 'pr1') : ep;
  const failed = probeFor(s, 'EP') && ep === null;
  const duration = seconds(p.dde),
    faultDuration = failed ? seconds(p.dEE) : 0;
  const limit = duration && faultDuration ? Math.min(duration, faultDuration) : duration || faultDuration;
  if (p.ddt !== 'Et' && p.dPE !== 'oF' && sensor !== null && sensor >= p.dtE) endDefrost(s, 'temp');
  else if (limit && s.seconds - s.defrostSince >= limit) endDefrost(s, 'time');
  else if (p.ddt === 'Et' && ep !== null) {
    if (ep >= p.dtE) s.defrostRelay = false;
    else if (ep <= p.dtE - 1) s.defrostRelay = true;
  }
}
export function updateDefrost(s, dt) {
  if (!enabled(s)) {
    s.phase = 'idle';
    s.defrostRelay = false;
    return;
  }
  if (s.phase === 'drain' && s.seconds >= s.drainUntil) s.phase = 'idle';
  if (s.phase === 'defrost') {
    runningDefrost(s);
    return;
  }
  if (s.phase !== 'idle') return;
  const p = s.params,
    ep = evaporator(s),
    failed = probeFor(s, 'EP') && ep === null;
  if (p.ddC !== 'ct' || s.compressor) s.interval += dt;
  const normal = seconds(s.firstDefrost && p.dSd !== 'oF' ? p.dSd : p.ddi, 'hours');
  const alternate = failed ? seconds(p.dEi, 'hours') : 0;
  const period = normal && alternate ? Math.min(normal, alternate) : normal || alternate;
  if (ep !== null && ep < p.dtF) s.coldSince ??= s.seconds;
  else s.coldSince = null;
  const byCold = s.coldSince !== null && s.seconds - s.coldSince >= seconds(p.dSt);
  const byRun = s.compressor && seconds(p.dcd, 'hours') && s.seconds - s.lastStart >= seconds(p.dcd, 'hours');
  if ((period && s.interval >= period) || byCold || byRun) {
    s.interval = 0;
    s.coldSince = null;
    s.firstDefrost = false;
    startDefrost(s, byCold ? 'temperatura' : byRun ? 'marcha continua' : 'intervalo');
  }
}
