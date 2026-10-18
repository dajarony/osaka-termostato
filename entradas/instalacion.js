/* SUME DOCBLOCK
Nombre: ciclo de instalación | Tipo: Entrada
Entradas: eventos del navegador y vista de instalación.
Acciones: registrar caché de producción y gestionar consentimiento de actualización.
Salidas: instalación, disponibilidad offline y recarga solicitada.
*/
import { mountInstallation } from '../salidas/instalacion.js';
export function createInstallation(root) {
  const ui = mountInstallation(root);
  let prompt = null,
    registration = null,
    ready = false,
    reloadRequested = false;
  const installed = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const connectivity = () =>
    ui.status(
      ready
        ? navigator.onLine
          ? 'Disponible sin conexión'
          : 'Sin conexión · simulador disponible'
        : 'La copia sin conexión todavía no está preparada',
    );
  const beforeInstall = (event) => {
    event.preventDefault();
    prompt = event;
  };
  const onInstalled = () => {
    prompt = null;
    ui.install.hidden = true;
  };
  const controllerChanged = () => {
    ready = true;
    connectivity();
    if (reloadRequested) location.reload();
  };
  ui.install.hidden = Boolean(installed());
  ui.install.onclick = async () => {
    if (!prompt) return ui.help();
    const event = prompt;
    prompt = null;
    try {
      await event.prompt();
      await event.userChoice;
    } catch {
      ui.help();
    }
  };
  ui.update.onclick = () => {
    if (!registration?.waiting) return;
    reloadRequested = true;
    registration.waiting.postMessage({ type: 'ACTIVATE_UPDATE' });
  };
  window.addEventListener('beforeinstallprompt', beforeInstall);
  window.addEventListener('appinstalled', onInstalled);
  window.addEventListener('online', connectivity);
  window.addEventListener('offline', connectivity);
  if (import.meta.env.PROD && isSecureContext && 'serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', controllerChanged);
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then((reg) => {
        registration = reg;
        const checkUpdate = () => {
          ui.update.hidden = !reg.waiting;
        };
        checkUpdate();
        reg.addEventListener('updatefound', () =>
          reg.installing?.addEventListener('statechange', checkUpdate),
        );
        return navigator.serviceWorker.ready;
      })
      .then(() => {
        ready = true;
        connectivity();
      })
      .catch(() => {
        ui.status('No se pudo preparar el acceso sin conexión. Reabre la app con internet.');
      });
  } else
    ui.status(
      import.meta.env.DEV
        ? 'Vista de desarrollo · instalación en la versión publicada'
        : 'Para instalar y usar sin conexión, abre la app por HTTPS',
    );
  return {
    shutdown() {
      window.removeEventListener('beforeinstallprompt', beforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('online', connectivity);
      window.removeEventListener('offline', connectivity);
      navigator.serviceWorker?.removeEventListener('controllerchange', controllerChanged);
    },
  };
}
