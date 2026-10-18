/* SUME DOCBLOCK
Nombre: sondas | Tipo: Lógica
Entradas: planta, calibraciones y averías.
Acciones: filtrar medición y seleccionar función de sonda.
Salidas: lecturas de control en °C o null por avería.
*/
export function updateReadings(s, dt = 0) {
  for (const [index, probe] of ['pr1', 'pr2', 'pr3'].entries()) {
    const target = s.temperatures[probe] + s.params[`iC${index + 1}`];
    const tau = s.params.iFt === 'oF' ? 0 : s.params.iFt;
    if (!tau) s.readings[probe] = target;
    else if (dt) s.readings[probe] += (target - s.readings[probe]) * (1 - Math.exp(-dt / tau));
  }
}
export const reading = (s, probe) => (s.faults[probe] === 'none' ? s.readings[probe] : null);
export function probeFor(s, role) {
  return ['pr2', 'pr3'].find((_, i) => s.params[`iP${i + 2}`] === role) ?? null;
}
export const evaporator = (s) => {
  const key = probeFor(s, 'EP');
  return key ? reading(s, key) : null;
};
