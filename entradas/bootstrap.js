/* SUME DOCBLOCK
Nombre: bootstrap | Tipo: Entrada
Entradas: raíz DOM y almacenamiento del navegador.
Acciones: componer módulos y administrar su ciclo de vida.
Salidas: aplicación iniciada con dependencias explícitas.
*/
import { createSession } from './sesion.js';
import { createRepository } from './almacenamiento.js';
import { createClock } from './reloj.js';
import { createKeypad } from './teclado.js';
import { createNavigation } from './navegacion.js';
import { createFiles } from './archivos.js';
import { bindInteractions } from './interacciones.js';
import { createInstallation } from './instalacion.js';
import { mount } from '../salidas/estructura.js';
import { mountController } from '../salidas/controlador.js';
import { mountProbes } from '../salidas/sondas.js';
import { mountParameters } from '../salidas/parametros.js';
import { createEditor } from '../salidas/editor.js';
import { createRenderer } from '../salidas/pantalla.js';
import { createSound } from '../salidas/sonido.js';
export function bootstrap(root) {
  mount(root);
  const installation = createInstallation(root.querySelector('#install-panel'));
  const notice = (message) => {
    const n = root.querySelector('#notice');
    n.textContent = message;
    n.hidden = !message;
  };
  const storage = {
    getItem: (key) => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
  };
  const repository = createRepository(storage),
    loaded = repository.load();
  let storageWarning = loaded.ok ? '' : `Configuración no recuperada: ${loaded.error.message}`;
  let session = createSession(loaded.ok && loaded.value ? loaded.value : {}),
    running = false;
  let render = () => {};
  const getState = () => session.snapshot();
  function save() {
    const result = repository.save(getState());
    storageWarning = result.ok ? '' : result.error.message;
    if (storageWarning) notice(storageWarning);
  }
  function dispatch(command) {
    const result = session.run(command);
    if (!result.ok) notice(result.error.message);
    else {
      if (command.type !== 'advance') notice(storageWarning);
      if (['configure', 'grade', 'lesson'].includes(command.type)) save();
    }
    if (['reset', 'lesson'].includes(command.type)) keypad.reset();
    render();
    return result;
  }
  const edit = createEditor(root.querySelector('#parameter-dialog'), getState, dispatch);
  const keypad = createKeypad(getState, dispatch, edit, notice);
  const sound = createSound(notice);
  const clock = createClock(
    (seconds) => dispatch({ type: 'advance', seconds }),
    (value) => {
      running = value;
      root.querySelector('#play').textContent = value ? 'Ⅱ Pausar' : '▶ Iniciar';
      render();
    },
  );
  mountController(root.querySelector('#controller'), dispatch, edit, (name) => {
    sound.key(getState().params);
    keypad.key(name);
    render();
  });
  root.querySelector('#sound-toggle').onchange = async (event) => {
    const input = event.target;
    if (!(await sound.enable(input.checked))) input.checked = false;
  };
  mountProbes(root.querySelector('#probes'), dispatch);
  const parameters = mountParameters(root.querySelector('#parameters'), edit);
  const renderScreen = createRenderer(root, parameters);
  render = () => {
    const state = getState();
    renderScreen(state, running, keypad.locked());
    sound.alarm(state.buzzer);
  };
  const navigate = createNavigation(root, render);
  const files = createFiles(
    root.querySelector('#import-file'),
    getState,
    (options) => {
      clock.pause();
      session.shutdown();
      session = createSession(options);
      keypad.reset();
      save();
      render();
    },
    notice,
  );
  bindInteractions(root, { clock, dispatch, getState, navigate, files });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clock.pause();
  });
  window.addEventListener('pagehide', () => {
    clock.pause();
    save();
  });
  parameters(getState());
  navigate('lab');
  if (!loaded.ok) notice(`Configuración no recuperada: ${loaded.error.message}`);
  return {
    shutdown: () => {
      clock.shutdown();
      session.shutdown();
      sound.shutdown();
      installation.shutdown();
    },
  };
}
