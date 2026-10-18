/* SUME DOCBLOCK
Nombre: vista de aprendizaje | Tipo: Salida
Entradas: catálogo, progreso y evidencias de la sesión.
Acciones: presentar retos, objetivos y pistas.
Salidas: comandos de inicio y evaluación.
*/
import { lessons } from '../contratos/retos.js';
import { escape } from './dom.js';
function activeLesson(s) {
  const lesson = lessons.find((l) => l.id === s.lesson);
  if (!lesson) return '';
  return `<div class="lesson-active"><div class="eyebrow">EN PRÁCTICA · ${escape(lesson.level)}</div><h3>${escape(lesson.title)}</h3><ul class="goals">${s.lessonProgress.goals.map((g) => `<li class="${g.passed ? 'passed' : ''}">${escape(g.label)}</li>`).join('')}</ul><details><summary>Necesito una pista</summary><p>${escape(lesson.hint)}</p></details><div class="toolbar"><button class="btn primary" data-command="grade">Comprobar ejercicio</button><button class="btn" data-view="lab">Ir al laboratorio</button><button class="btn" data-command="endLesson">Salir del reto</button></div>${s.grade ? `<p role="status" style="margin-top:12px">${s.grade.passed ? '✓ Reto superado. Maniobra verificada.' : 'Aún faltan objetivos. Revisa las condiciones pendientes.'}</p>` : ''}</div>`;
}
export function renderLessons(root, s) {
  const open = root.querySelector('details')?.open;
  root.innerHTML = `<div class="section-heading"><div class="eyebrow">APRENDE CON EVIDENCIAS</div><h2>14 maniobras. Un criterio real.</h2><p>${s.completed.length} de 14 completadas. Cada reto abre un escenario manual limpio. Los eventos iniciales no cuentan como logros.</p></div>${activeLesson(s)}<div class="lessons-grid">${lessons.map((l, i) => `<article class="lesson-card ${s.lesson === l.id ? 'active' : ''}"><div class="eyebrow">${String(i + 1).padStart(2, '0')} / ${escape(l.level)}</div><h3>${escape(l.title)}</h3><p>${escape(l.desc)}</p><span class="badge">${s.completed.includes(l.id) ? '✓ SUPERADO' : 'POR PRACTICAR'}</span><button class="btn" data-lesson="${l.id}">${s.lesson === l.id ? 'Reiniciar reto' : 'Comenzar ejercicio'}</button></article>`).join('')}</div>`;
  if (open && root.querySelector('details')) root.querySelector('details').open = true;
}
