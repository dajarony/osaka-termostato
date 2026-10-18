/* SUME DOCBLOCK
Nombre: relés y auxiliar | Tipo: Lógica
Entradas: demandas lógicas y asignaciones de salida.
Acciones: resolver conexión efectiva de OUT1/2/3.
Salidas: relés y zumbador de alarma.
*/
import { seconds } from './tiempo.js';
import { enabled } from './modos.js';
export function updateRelays(s) {
  const p = s.params,
    alarm = s.alarms.length > 0,
    memory = s.alarmMemory.length > 0;
  const timedOut = seconds(p.otu) && s.auxSince !== null && s.seconds - s.auxSince >= seconds(p.otu);
  if (timedOut) s.auxManual = false;
  s.auxiliary =
    p.oFo === 1
      ? s.compressor && s.seconds - s.lastStart >= seconds(p.otu)
      : [2, 5].includes(p.oFo)
        ? s.auxManual
        : p.oFo === 3
          ? s.mode !== 'eco'
          : p.oFo === 4
            ? s.door
            : false;
  if (!enabled(s) && p.oFo !== 5) s.auxiliary = false;
  const values = {
    oF: false,
    ot: s.compressor,
    HE: s.heat,
    dF: s.defrostRelay,
    Fn: s.fan,
    Au: s.auxiliary,
    At: alarm && !s.acknowledged,
    AL: alarm,
    An: memory,
    '-t': !(alarm && !s.acknowledged),
    '-L': !alarm,
    '-n': !memory,
    on: enabled(s),
  };
  s.relays = [p.oo1, p.oo2, p.oo3].map((role) =>
    (!enabled(s) && !(role === 'Au' && p.oFo === 5)) || s.seconds < seconds(p.Pod) ? false : values[role],
  );
  s.buzzer = enabled(s) && [1, 3].includes(p.obu) && alarm && !s.acknowledged;
}
