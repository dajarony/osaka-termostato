/* SUME DOCBLOCK
Nombre: editor de parámetros | Tipo: Salida
Entradas: parámetro, valor actual y dispatch.
Acciones: recoger valor sin mutar hasta validación exitosa.
Salidas: diálogo accesible y errores locales.
*/
import { schema } from '../contratos/parametros.js';
import { escape } from './dom.js';
import { rangeLabel } from './parametros.js';
export function createEditor(dialog, getState, dispatch) {
  return function edit(code, options = {}) {
    const rule = schema[code],
      state = getState(),
      value =
        typeof state.params[code] === 'number'
          ? state.params[code] + (options.delta ?? 0)
          : state.params[code];
    const input = rule.options
      ? `<select id="param-value">${rule.options.map((v) => `<option ${v === value ? 'selected' : ''}>${v}</option>`).join('')}</select>`
      : `<input id="param-value" type="text" inputmode="decimal" value="${escape(value)}" autocomplete="off">`;
    const choices = (options.allowed ?? [])
      .map((key) => `<button type="button" class="btn small" data-quick="${key}">${key}</button>`)
      .join('');
    dialog.innerHTML = `<form id="param-form"><div class="eyebrow">${rule.category} / PARÁMETRO ${rule.id}</div><h2 id="dialog-title">${code}</h2><div class="toolbar">${choices}</div><p>${escape(rule.description)}<br>${escape(rangeLabel(rule))}</p><label for="param-value">Valor programado</label>${input}
      ${state.params.tPP !== 'oF' ? '<label for="param-password" style="margin-top:12px">Contraseña tPP</label><input id="param-password" type="password" inputmode="numeric" autocomplete="off">' : ''}
      <div id="param-error" class="error-text" role="alert"></div><div class="dialog-actions"><button type="button" class="btn" id="param-cancel">Cancelar</button><button type="submit" class="btn primary">Guardar parámetro</button></div></form>`;
    dialog.querySelector('#param-cancel').onclick = () => dialog.close();
    dialog
      .querySelectorAll('[data-quick]')
      .forEach((button) => (button.onclick = () => edit(button.dataset.quick, { allowed: options.allowed })));
    dialog.querySelector('#param-form').onsubmit = (e) => {
      e.preventDefault();
      const password = dialog.querySelector('#param-password');
      if (password && password.value !== String(state.params.tPP)) {
        dialog.querySelector('#param-error').textContent = 'Contraseña incorrecta.';
        return;
      }
      const raw = dialog.querySelector('#param-value').value.trim().replace(',', '.');
      const next = rule.options || raw === 'oF' ? raw : raw === '' ? NaN : Number(raw);
      const result = dispatch({ type: 'configure', patch: { [code]: next } });
      if (result.ok) dialog.close();
      else dialog.querySelector('#param-error').textContent = result.error.message;
    };
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('#param-value').focus();
  };
}
