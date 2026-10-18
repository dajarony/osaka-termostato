/* SUME DOCBLOCK
Nombre: gráfica térmica | Tipo: Salida
Entradas: muestras acotadas del reloj simulado.
Acciones: escalar series según tiempo y temperatura.
Salidas: SVG y resumen numérico accesible.
*/
import { clock } from './dom.js';
export function renderChart(root, s) {
  const points = s.samples,
    first = points[0]?.time ?? 0,
    duration = Math.max(1, s.seconds - first);
  const values = points.flatMap((p) => [p.pr1, p.pr2, p.pr3]);
  const min = Math.floor((Math.min(...values, s.params.SP) - 2) / 5) * 5;
  const max = Math.ceil((Math.max(...values, s.params.SP) + 2) / 5) * 5;
  const x = (p) => 35 + ((p.time - first) / duration) * 420;
  const y = (value) => 144 - ((value - min) / (max - min)) * 125;
  const grid = [0, 1, 2, 3]
    .map((i) => {
      const value = min + ((max - min) * i) / 3;
      return `<path d="M35 ${y(value)}H460" stroke="var(--line)" stroke-dasharray="3 4"/><text x="2" y="${y(value) + 3}" fill="var(--muted)" font-size="9">${value.toFixed(0)}°</text>`;
    })
    .join('');
  const lines = [
    ['pr1', 'green'],
    ['pr2', 'blue'],
    ['pr3', 'accent'],
  ]
    .map(
      ([key, color]) =>
        `<polyline points="${points.map((p) => `${x(p)},${y(p[key])}`).join(' ')}" stroke="var(--${color})" stroke-width="2.2" fill="none"/>`,
    )
    .join('');
  root.innerHTML = `<div class="legend"><span><i></i>Cámara</span><span><i class="evap"></i>Evaporador</span><span><i class="product"></i>Producto</span><span>┄ Consigna</span></div><svg class="chart" viewBox="0 0 480 180" role="img" aria-label="Tendencias de temperatura desde ${clock(first)} hasta ${clock(s.seconds)}">${grid}<path d="M35 ${y(s.params.SP)}H460" stroke="var(--muted)" stroke-dasharray="5 4"/>${lines}<text x="35" y="172" fill="var(--muted)" font-size="9">${clock(first)}</text><text x="407" y="172" fill="var(--muted)" font-size="9">${clock(s.seconds)}</text></svg><div class="chart-summary"><span>Tiempo simulado<b>${clock(s.seconds)}</b></span><span>Consumo estimado<b>${(s.energyWh / 1000).toFixed(3)} kWh</b></span><span>Arranques<b>${s.starts}</b></span></div>`;
}
