/* SUME DOCBLOCK
Nombre: modos y entrada digital | Tipo: Lógica
Entradas: contacto de puerta, configuración y reloj.
Acciones: resolver modo operativo y contacto retardado.
Salidas: estado normal/eco/turbo y entrada digital efectiva.
*/
import { seconds } from './tiempo.js';
export function setMode(s, mode) {
  s.mode = mode;
  s.modeSince = s.seconds;
}
export function updateModes(s) {
  const p = s.params,
    wired = p.iP2 === 'dG' || p.iP3 === 'dG';
  const contact = p.iFi < 0 ? !s.door : s.door;
  s.digital = wired && contact && s.seconds - s.doorSince >= seconds(p.iti);
  if (!s.digital && s.digitalPrevious && Math.abs(p.iFi) === 6) setMode(s, 'normal');
  if (s.digital && Math.abs(p.iFi) === 6 && s.mode !== 'eco') setMode(s, 'eco');
  if (s.digital && Math.abs(p.iFi) === 8 && !s.digitalPrevious) setMode(s, 'turbo');
  if (
    s.powered &&
    !s.door &&
    s.mode === 'normal' &&
    seconds(p.iEt, 'hours') &&
    s.seconds - s.closedSince >= seconds(p.iEt, 'hours')
  )
    setMode(s, 'eco');
  const limit = seconds(s.mode === 'turbo' ? p.rtC : p.itt, 'hours');
  if (s.mode !== 'normal' && limit && s.seconds - s.modeSince >= limit) {
    setMode(s, 'normal');
    s.closedSince = s.seconds;
  }
}
export const activeSetpoint = (s) => s.params[s.mode === 'eco' ? 'SPE' : s.mode === 'turbo' ? 'SPH' : 'SP'];
export const activeDifferential = (s) =>
  s.params[s.mode === 'eco' ? 'rEd' : s.mode === 'turbo' ? 'rHd' : 'rd'];
export const enabled = (s) => s.powered && !(s.digital && Math.abs(s.params.iFi) === 7);
