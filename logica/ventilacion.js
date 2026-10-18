/* SUME DOCBLOCK
Nombre: ventilación | Tipo: Lógica
Entradas: evaporador, fase, puerta y reloj.
Acciones: resolver ciclos e histéresis de bloqueo del ventilador.
Salidas: ventilador y motivo de inhibición.
*/
import { evaporator } from './sondas.js';
import { seconds } from './tiempo.js';
import { enabled } from './modos.js';
import { record } from './eventos.js';
export function updateFan(s) {
  const p = s.params,
    ep = evaporator(s),
    previous = s.fan;
  if (ep === null) s.fanBlock = '';
  else if (ep > p.FFL) s.fanBlock = 'FFL';
  else if (ep < p.FLF) s.fanBlock = 'FLF';
  else if ((s.fanBlock === 'FFL' && ep <= p.FFL - p.FdF) || (s.fanBlock === 'FLF' && ep >= p.FLF + p.FdF))
    s.fanBlock = '';
  const on = seconds(p.Ftn),
    off = seconds(p.FtF);
  const cycle = on > 0 && (!off || (s.seconds - (s.lastStop ?? 0)) % (on + off) < on);
  s.fan = s.phase === 'defrost' ? p.FFE === 'on' : s.compressor || cycle;
  if (
    !enabled(s) ||
    s.fanBlock ||
    s.seconds < seconds(p.Pod) ||
    (s.seconds < s.fanUntil && p.FFE !== 'on') ||
    (s.digital && [2, 3].includes(Math.abs(p.iFi)))
  )
    s.fan = false;
  if (previous !== s.fan) record(s, s.fan ? 'fan:on' : 'fan:off');
}
