/* SUME DOCBLOCK
Nombre: ciclo del controlador | Tipo: Lógica
Entradas: estado de sesión y paso de tiempo.
Acciones: ordenar políticas declaradas de regulación.
Salidas: estado coherente tras cada comando o segundo.
*/
import { updateReadings } from './sondas.js';
import { updateModes } from './modos.js';
import { updateDefrost, startDefrost, endDefrost } from './desescarche.js';
import { updateRegulation } from './regulacion.js';
import { updateFan } from './ventilacion.js';
import { updateAlarms } from './alarmas.js';
import { updateRelays } from './reles.js';
import { sample } from './eventos.js';
export function recalculate(s, dt = 0) {
  updateReadings(s, dt);
  updateModes(s);
  if (s.digital && !s.digitalPrevious) {
    if (Math.abs(s.params.iFi) === 9) startDefrost(s, 'entrada digital');
    if (Math.abs(s.params.iFi) === 10 && s.phase === 'defrost') endDefrost(s, 'digital');
  }
  updateDefrost(s, dt);
  const previous = s.compressor;
  updateRegulation(s);
  if (s.params.ddC === 'cS' && previous && !s.compressor && !s.demand && s.phase === 'idle') {
    startDefrost(s, 'parada por consigna');
    updateRegulation(s);
  }
  updateFan(s);
  updateAlarms(s);
  updateRelays(s);
  s.digitalPrevious = s.digital;
  sample(s);
}
