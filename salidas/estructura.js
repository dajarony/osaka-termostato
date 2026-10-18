/* SUME DOCBLOCK
Nombre: estructura de pantalla | Tipo: Salida
Entradas: contenedor DOM vacío.
Acciones: montar regiones accesibles de laboratorio.
Salidas: pantalla con puntos de montaje para vistas.
*/
const tabs = [
  ['lab', '◫', 'Laboratorio'],
  ['parameters', '☷', 'Parámetros'],
  ['lessons', '◎', 'Entrenamiento'],
  ['diagnostics', '⌁', 'Diagnóstico'],
];
function panel(number, title, subtitle, target, badge = '') {
  return `<section class="panel"><div class="panel-head"><div><div class="eyebrow">${number} / ${subtitle}</div><h2>${title}</h2></div><span class="badge">${badge}</span></div><div id="${target}"></div></section>`;
}
export function mount(root) {
  root.innerHTML = `<div class="app-shell">
  <aside class="sidebar"><div class="brand">osaka<span>lab.</span><small>REFRIGERATION STUDIO</small></div>
    <nav class="nav" role="tablist" aria-label="Secciones del laboratorio">
      ${tabs.map(([id, icon, label]) => `<button id="tab-${id}" role="tab" aria-controls="view-${id}" aria-selected="${id === 'lab'}" data-view="${id}"><span class="icon" aria-hidden="true">${icon}</span>${label}</button>`).join('')}
    </nav><div class="sidebar-bottom"><span class="eyebrow">TU BANCO DE PRUEBAS</span><b>Cámara de referencia</b>3 sondas · 3 relés · 1 controlador<br><br><span class="status-dot"></span> Todo se ejecuta en tu navegador<br><br>Simulación educativa. Sin conexión a equipos reales.</div>
  </aside><main class="workspace">
    <div class="topline"><span class="breadcrumb">ESPACIO DE TRABAJO / <b>OSAKA F30</b></span><span class="mono"><span class="status-dot"></span> LOCAL <span id="session-clock">00:00:00</span></span></div>
    <header class="heading"><div><div class="eyebrow">APRENDER HACIENDO</div><h1>El frío, bajo tu control.</h1><p>Explora la cámara, ajusta el regulador y observa cómo responde el sistema.</p></div><div class="toolbar"><button class="btn" data-action="export">↓ Exportar</button><button class="btn" data-action="import">↑ Importar</button><input type="file" id="import-file" accept="application/json,.json" hidden></div></header>
    <div id="notice" class="notice" role="status" aria-live="polite" hidden></div><div id="active-banner" class="active-banner" hidden></div>
    <section id="view-lab" role="tabpanel" aria-labelledby="tab-lab">
      <div class="metrics">
        <div class="metric"><span class="eyebrow">TEMPERATURA DE CÁMARA</span><strong><span id="metric-air">20,0</span> <small>°C</small></strong><span class="caption" id="metric-air-note">Pr1 · lectura de control</span></div>
        <div class="metric"><span class="eyebrow">CONSIGNA ACTIVA</span><strong><span id="metric-sp">4,0</span> <small>°C</small></strong><span class="caption" id="metric-band">Arranque a 6,0 °C</span></div>
        <div class="metric"><span class="eyebrow">EVAPORADOR</span><strong><span id="metric-evap">13,0</span> <small>°C</small></strong><span class="caption">Pr2 · intercambio térmico</span></div>
        <div class="metric"><span class="eyebrow">ESTADO DEL SISTEMA</span><strong id="metric-state" style="font-size:21px">Enfriando</strong><span class="caption" id="metric-state-note">Regulación normal</span></div>
      </div>
      <div class="lab-grid">${panel('01', 'El centro de mando', 'CONTROLADOR', 'controller', 'F 30')}
        <section class="panel"><div class="panel-head"><div><div class="eyebrow">02 / PLANTA TÉRMICA</div><h2>Dentro de la cámara</h2></div><span class="badge" id="physics-badge">FÍSICA ACTIVA</span></div><div id="plant"></div>
          <div class="plant-options"><label><input type="checkbox" id="physics-toggle" checked> Evolución física</label><label for="ambient">Ambiente <input id="ambient" type="number" min="0" max="45" step="1" value="28"> °C</label><button class="btn small" id="door-toggle">Abrir puerta</button></div>
          <div class="panel-foot"><span>Balance térmico · aire + producto + evaporador</span><span id="frost-label">Escarcha 0%</span></div>
        </section>
      </div><div class="lower-grid">${panel('03', 'Tres puntos de vista', 'MEDICIÓN Y AVERÍAS', 'probes', 'NTC')}
        <section class="panel"><div class="panel-head"><div><div class="eyebrow">04 / TELEMETRÍA</div><h2>La historia de la temperatura</h2></div><span class="badge">°C</span></div><div id="chart"></div>
          <div class="toolbar" style="margin-top:18px"><button class="btn primary" id="play">▶ Iniciar</button><select id="speed" aria-label="Velocidad de simulación"><option value="1">1× real</option><option value="10">10×</option><option value="60" selected>60×</option><option value="300">300×</option></select><button class="btn small" id="step-second">+1 s</button><button class="btn small" id="step-minute">+1 min</button><button class="btn small" id="reset">↺ Reiniciar</button></div><p class="muted" style="font-size:10px;margin-top:10px">El reloj se pausa al ocultar esta pestaña.</p>
        </section></div>
    </section>
    ${tabs
      .slice(1)
      .map(
        ([id]) =>
          `<section id="view-${id}" role="tabpanel" aria-labelledby="tab-${id}" hidden><div id="${id}"></div></section>`,
      )
      .join('')}
    <footer class="footer"><span>OSAKA LAB / 03 · UN LABORATORIO PARA ENTENDER, NO SOLO MIRAR.</span><span>Modelo educativo de referencia · F30 V2</span></footer>
  </main></div><dialog id="parameter-dialog" aria-labelledby="dialog-title"></dialog>`;
}
