/* SUME DOCBLOCK
Nombre: vista de diagnóstico | Tipo: Salida
Entradas: salud y eventos observados.
Acciones: presentar decisiones, cobertura y trazas.
Salidas: evidencia legible del controlador.
*/
import { clock, escape } from './dom.js';
const labels = {
  'comp:on': 'Regulación activada',
  'comp:off': 'Regulación detenida',
  'comp:protect': 'Protección de arranque',
  'comp:drain': 'Espera por goteo',
  'def:start': 'Inicio de desescarche',
  'def:temp': 'Fin por temperatura',
  'def:time': 'Fin por tiempo',
  'def:manual': 'Fin manual',
  'def:reject': 'Desescarche denegado',
  'def:auto': 'Inicio automático',
  'fan:on': 'Ventilador activado',
  'fan:off': 'Ventilador detenido',
  'alarm:on': 'Alarma activada',
  'alarm:off': 'Alarma restablecida',
  configure: 'Parámetros actualizados',
  probe: 'Perturbación de sonda',
  fault: 'Cambio de avería',
  'door:open': 'Puerta abierta',
  'door:close': 'Puerta cerrada',
};
export function renderDiagnostics(root, s) {
  const rows = [
    ['Fase', s.phase],
    ['Demanda de regulación', s.demand ? 'Sí' : 'No'],
    ['Protección', s.block || 'Libre'],
    ['Bloqueo ventilador', s.fanBlock || 'Libre'],
    ['Alarmas', s.alarms.join(', ') || 'Ninguna'],
    ['Memoria', s.alarmMemory.join(', ') || 'Vacía'],
    ['Entrada digital', s.digital ? 'Activa' : 'Inactiva'],
    ['Auxiliar', s.auxiliary ? 'ON' : 'OFF'],
  ];
  root.innerHTML = `<div class="section-heading"><div class="eyebrow">TRAZABILIDAD DE CADA DECISIÓN</div><h2>Entiende por qué ocurre.</h2><p>Estado observable, secuencia de eventos y límites del modelo.</p></div><div class="diagnostics-grid"><section class="panel"><div class="panel-head"><h2>Estado interno</h2><span class="badge">${clock(s.seconds)}</span></div><table class="health-table">${rows.map(([k, v]) => `<tr><td>${k}</td><td>${escape(v)}</td></tr>`).join('')}</table><div class="toolbar" style="margin-top:16px"><button class="btn" data-command="auxiliary">Conmutar auxiliar</button><button class="btn" data-action="trace">Exportar evidencia</button></div></section><section class="panel"><h2>Bitácora de la sesión</h2><div class="log-list">${
    [...s.events]
      .reverse()
      .map(
        (e) =>
          `<div class="log-entry"><time>${clock(e.time)}</time><div>${escape(labels[e.type] || e.type)}<small>${escape(JSON.stringify(e.detail))}</small></div></div>`,
      )
      .join('') || '<p class="empty">Sin eventos. Ejecuta una maniobra en el laboratorio.</p>'
  }</div></section><section class="panel" style="grid-column:1/-1"><h2>Cobertura y supuestos del simulador</h2><ul class="coverage-list"><li>Control C/H/nr/HC, ECO y Turbo manual; histéresis, calibración y filtro; protecciones PP1/PP2/PP3/Pod; desescarche EL/in/no/Et; ventilación y alarmas.</li><li>72 códigos catalogados. RTC (ddC=cL), conmutación C3 y reducción dinámica (ddd≠0) se rechazan explícitamente; no se presentan como emulados.</li><li>Las teclas son un acceso didáctico, con funciones tUF/tFb, tLo, tPP y tEd. No reproducen las pulsaciones largas ni los niveles ocultos del firmware.</li><li>La planta usa balances de energía de tres masas térmicas. Inercia de producto, puerta, ambiente, escarcha y consumo son estimaciones de referencia, sin calibración contra una instalación real.</li><li>Entradas digitales: el interruptor de puerta representa un contacto eléctrico; iFi negativo invierte su lógica. iFi 1 no bloquea el compresor; 2 bloquea ventilador; 3 bloquea ambos.</li><li>Temperaturas internas y parámetros siempre en °C. iuP convierte solo la pantalla; las gráficas y la mesa de laboratorio mantienen °C.</li><li>Fuente de contraste: <a href="https://www.osakasolutions.com/hubfs/Productos/Termostatos/F30/MU_EN_F%2030_v2.pdf?hsLang=es-es" target="_blank" rel="noreferrer">manual oficial F30 V2</a>. Sin conexión a equipos reales.</li></ul></section></div>`;
}
