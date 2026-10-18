/* SUME DOCBLOCK
Nombre: planta térmica | Tipo: Lógica
Entradas: relés físicos, puerta y ambiente; paso de un segundo.
Acciones: integrar balance energético de aire, producto y evaporador.
Salidas: temperaturas °C, escarcha relativa y energía eléctrica Wh.
*/
export const plant = Object.freeze({
  airCapacity: 18000,
  productCapacity: 180000,
  evaporatorCapacity: 9000,
  wallConductance: 8,
  doorConductance: 95,
  productConductance: 22,
  fanConductance: 100,
  naturalConductance: 8,
  coolingW: 1700,
  defrostW: 1500,
  compressorW: 650,
  fanW: 35,
});
export function advancePlant(s) {
  if (!s.physics) return;
  const t = s.temperatures,
    k = plant;
  const has = (role) => s.relays.some((on, i) => on && s.params[`oo${i + 1}`] === role);
  const cooling = has('ot') && s.params.rHC !== 'H';
  const heating = has('HE') || (has('ot') && s.params.rHC === 'H');
  const defrosting = has('dF');
  const airEvap = (t.pr1 - t.pr2) * (has('Fn') ? k.fanConductance : k.naturalConductance);
  const productAir = (t.pr3 - t.pr1) * k.productConductance;
  const ambientAir = (s.ambient - t.pr1) * (s.door ? k.doorConductance : k.wallConductance);
  const gasHeat = defrosting && s.params.ddt === 'in';
  const defrostW = defrosting && (!gasHeat || cooling) ? k.defrostW : 0;
  const coolingW = cooling && !gasHeat ? (k.coolingW * Math.max(0, (t.pr2 + 35) / 48)) / (1 + s.frost) : 0;
  t.pr1 += (ambientAir + productAir - airEvap + (heating ? 1600 : 0)) / k.airCapacity;
  t.pr2 += (airEvap - coolingW + defrostW) / k.evaporatorCapacity;
  t.pr3 -= productAir / k.productCapacity;
  s.frost = Math.min(
    2,
    Math.max(0, s.frost + (t.pr2 < 0 && cooling ? (s.door ? 0.0003 : 0.00002) : 0) - (t.pr2 > 0 ? 0.001 : 0)),
  );
  s.energyWh +=
    ((has('ot') ? k.compressorW : 0) +
      (has('Fn') ? k.fanW : 0) +
      (defrosting && !gasHeat ? k.defrostW : 0) +
      (has('HE') ? 1600 : 0)) /
    3600;
}
