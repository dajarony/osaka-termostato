/* SUME DOCBLOCK
Nombre: eventos | Tipo: Lógica
Entradas: estado, tipo y detalle de transición.
Acciones: registrar evidencia acotada y ordenada.
Salidas: eventos y muestras con reloj simulado.
*/
export function record(s, type, detail = {}) {
  const event = { id: ++s.sequence, time: s.seconds, type, detail: { ...detail } };
  s.events.push(event);
  if (s.events.length > 600) s.events.shift();
  if (s.lesson && s.lessonEvidence.length < 1000) s.lessonEvidence.push(event);
}
export function sample(s) {
  const point = { time: s.seconds, ...s.temperatures, compressor: s.compressor, phase: s.phase };
  if (s.samples.at(-1)?.time === s.seconds) s.samples[s.samples.length - 1] = point;
  else s.samples.push(point);
  if (s.samples.length > 360) s.samples.shift();
}
