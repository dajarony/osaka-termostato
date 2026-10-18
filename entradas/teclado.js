/* SUME DOCBLOCK
Nombre: teclado didáctico | Tipo: Entrada
Entradas: teclas, parámetros y reloj de sesión.
Acciones: aplicar bloqueo y funciones programables.
Salidas: comandos o apertura del editor.
*/
import { seconds } from '../logica/tiempo.js';
import { quickSetpoints } from '../contratos/teclas.js';
export function createKeypad(getState, dispatch, edit, notice) {
  let lastKey = 0;
  const locked = () => {
    const s = getState();
    return seconds(s.params.tLo) > 0 && s.seconds - lastKey >= seconds(s.params.tLo);
  };
  function programmable(value, s) {
    const command = {
      1: { type: 'auxiliary' },
      2: { type: 'mode', mode: s.mode === 'eco' ? 'normal' : 'eco' },
      3: { type: 'power', on: !s.powered },
      4: { type: 'mode', mode: 'turbo' },
    }[value];
    if (command) dispatch(command);
    else notice('Esta tecla no tiene una función asignada.');
  }
  function key(name) {
    const s = getState();
    if (name === 'unlock') {
      lastKey = s.seconds;
      notice('Teclado desbloqueado.');
      return;
    }
    if (name === 'power') {
      dispatch({ type: 'power', on: !s.powered });
      return;
    }
    if (locked()) {
      notice('Teclado bloqueado por tLo. Pulsa «Desbloquear teclas».');
      return;
    }
    lastKey = s.seconds;
    if (name === 'fn' || name === 'fb') {
      programmable(s.params[name === 'fn' ? 'tUF' : 'tFb'], s);
      return;
    }
    const allowed = quickSetpoints(s.params, s.mode);
    if (!allowed.length) {
      notice('tEd=0 oculta las consignas del acceso rápido.');
      return;
    }
    edit(allowed[0], { allowed, delta: name === 'up' ? 1 : name === 'down' ? -1 : 0 });
  }
  return {
    key,
    locked,
    reset: () => {
      lastKey = 0;
    },
  };
}
