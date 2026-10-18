/* SUME DOCBLOCK
Nombre: actualización de pantalla | Tipo: Salida
Entradas: snapshot y vistas montadas.
Acciones: distribuir estado hacia sus regiones visuales.
Salidas: métricas y vistas sincronizadas.
*/
import { renderController } from './controlador.js';
import { renderPlant } from './planta.js';
import { renderProbes } from './sondas.js';
import { renderChart } from './grafica.js';
import { renderLessons } from './retos.js';
import { renderDiagnostics } from './diagnostico.js';
import { activeSetpoint, activeDifferential } from '../logica/modos.js';
import { put, temperature, clock, escape } from './dom.js';
export function createRenderer(root, parameters) {
  const q = (selector) => root.querySelector(selector);
  return function render(s, running, locked) {
    put(root, '#session-clock', clock(s.seconds));
    put(root, '#metric-air', s.faults.pr1 === 'none' ? temperature(s.readings.pr1) : 'E1');
    put(root, '#metric-evap', s.faults.pr2 === 'none' ? temperature(s.readings.pr2) : 'E2');
    put(root, '#metric-sp', temperature(activeSetpoint(s)));
    put(
      root,
      '#metric-band',
      `Arranque a ${temperature(activeSetpoint(s) + (s.params.rHC === 'H' ? -1 : 1) * activeDifferential(s))} °C`,
    );
    put(
      root,
      '#metric-state',
      !s.powered
        ? 'Standby'
        : s.phase === 'defrost'
          ? 'Desescarche'
          : s.phase === 'drain'
            ? 'Goteo'
            : s.block
              ? 'Protección'
              : s.compressor
                ? s.params.rHC === 'H'
                  ? 'Calentando'
                  : 'Enfriando'
                : 'En reposo',
    );
    put(
      root,
      '#metric-state-note',
      s.alarms.length
        ? `Avisos: ${s.alarms.join(', ')}`
        : `Modo ${s.mode} · ${running ? 'reloj en marcha' : 'en pausa'}`,
    );
    put(root, '#physics-badge', s.physics ? 'FÍSICA ACTIVA' : 'SONDAS MANUALES');
    put(root, '#frost-label', `Escarcha ${(s.frost * 50).toFixed(0)}%`);
    put(root, '#door-toggle', s.door ? 'Cerrar puerta' : 'Abrir puerta');
    q('#physics-toggle').checked = s.physics;
    if (q('#ambient') !== document.activeElement) q('#ambient').value = s.ambient;
    renderController(q('#controller'), s, locked);
    renderPlant(q('#plant'), s, running);
    renderProbes(q('#probes'), s);
    renderChart(q('#chart'), s);
    if (!q('#view-parameters').hidden) parameters(s);
    if (!q('#view-lessons').hidden) renderLessons(q('#lessons'), s);
    if (!q('#view-diagnostics').hidden) renderDiagnostics(q('#diagnostics'), s);
    q('#active-banner').hidden = !s.lesson;
    if (s.lesson)
      q('#active-banner').innerHTML =
        `<span>◎ Reto activo: <b>${escape(s.lesson)}</b> · ${s.lessonProgress.goals.filter((g) => g.passed).length}/${s.lessonProgress.goals.length} objetivos</span><button class="btn small" data-view="lessons">Ver objetivos</button>`;
  };
}
