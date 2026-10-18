/* SUME DOCBLOCK
Nombre: catálogo de parámetros | Tipo: Salida
Entradas: esquema y snapshot.
Acciones: filtrar y presentar parámetros editables.
Salidas: tabla de 72 códigos con cobertura visible.
*/
import { schema } from '../contratos/parametros.js';
import { escape } from './dom.js';
export const rangeLabel = (r) =>
  r.options
    ? r.options.join(' · ')
    : r.timer
      ? `${r.timer === 'hours' ? '− = minutos / + = horas' : '− = segundos / + = minutos'}; oF = desactivado`
      : `${r.min} … ${r.max}${r.optional ? ' / oF' : ''}`;
export function mountParameters(root, edit) {
  const groups = [...new Set(Object.values(schema).map((r) => r.category))];
  root.innerHTML = `<div class="section-heading"><div class="eyebrow">CONFIGURACIÓN DEL EQUIPO</div><h2>Un ajuste. Una consecuencia.</h2><p>72 códigos del F30. Las temperaturas de configuración se expresan en °C; iuP solo cambia el display.</p></div><div class="panel"><div class="param-tools"><input id="param-search" type="search" placeholder="Buscar código o función…" aria-label="Buscar parámetro"><select id="param-category" aria-label="Categoría de parámetros"><option value="">Todas las categorías</option>${groups.map((g) => `<option>${g}</option>`).join('')}</select><span class="badge" id="param-count"></span></div><div class="table-wrap"><table class="parameter-table"><thead><tr><th>CÓDIGO</th><th>FUNCIÓN / RANGO</th><th class="category-col">GRUPO</th><th>VALOR</th></tr></thead><tbody id="param-rows"></tbody></table></div></div>`;
  let current;
  function render(s = current) {
    current = s;
    const query = root.querySelector('#param-search').value.toLocaleLowerCase('es');
    const category = root.querySelector('#param-category').value;
    const rows = Object.values(schema).filter(
      (r) =>
        (!category || r.category === category) &&
        `${r.code} ${r.description}`.toLocaleLowerCase('es').includes(query),
    );
    root.querySelector('#param-count').textContent = `${rows.length} / 72`;
    root.querySelector('#param-rows').innerHTML =
      rows
        .map(
          (r) =>
            `<tr><td><code>${r.code}</code></td><td>${escape(r.description)}<small>${escape(rangeLabel(r))}${r.coverage === 'partial' ? ' · cobertura parcial: ver Diagnóstico' : ''}</small></td><td class="category-col"><span class="badge">${r.category}</span></td><td><button class="btn small value-btn" data-edit="${r.code}" aria-label="Editar ${r.code}">${escape(s.params[r.code])} ↗</button></td></tr>`,
        )
        .join('') || '<tr><td colspan="4" class="empty">No hay parámetros que coincidan.</td></tr>';
  }
  root.querySelector('#param-search').oninput = () => render();
  root.querySelector('#param-category').onchange = () => render();
  root.onclick = (e) => {
    const button = e.target.closest('[data-edit]');
    if (button) edit(button.dataset.edit);
  };
  return render;
}
