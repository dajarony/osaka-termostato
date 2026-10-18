/* SUME DOCBLOCK
Nombre: zumbador opcional | Tipo: Salida
Entradas: señal de alarma y pulsación del usuario.
Acciones: producir tonos locales solo tras habilitación explícita.
Salidas: audio breve; errores visibles si el navegador lo impide.
*/
export function createSound(notice) {
  let context = null,
    enabled = false,
    previousAlarm = false;
  function beep(frequency = 1000) {
    if (!enabled || !context || context.state !== 'running') return;
    const oscillator = context.createOscillator(),
      gain = context.createGain();
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.13);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  }
  return {
    async enable(value) {
      if (!value) {
        enabled = false;
        return true;
      }
      try {
        context ??= new AudioContext();
        await context.resume();
        enabled = true;
        beep();
        return true;
      } catch {
        enabled = false;
        notice('El navegador no permite sonido. Los avisos visuales siguen activos.');
        return false;
      }
    },
    key(params) {
      if ([2, 3].includes(params.obu)) beep(1200);
    },
    alarm(active) {
      if (active && !previousAlarm) beep(700);
      previousAlarm = active;
    },
    async shutdown() {
      enabled = false;
      if (context)
        try {
          await context.close();
        } catch {
          notice('No se pudo cerrar el dispositivo de audio.');
        }
    },
  };
}
