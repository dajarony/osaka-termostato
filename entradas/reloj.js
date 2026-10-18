/* SUME DOCBLOCK
Nombre: adaptador de reloj | Tipo: Entrada
Entradas: callbacks de paso y estado de reproducción.
Acciones: emitir pasos acotados con un único temporizador.
Salidas: reloj iniciable, pausable y descartable.
*/
export function createClock(step, change, timers = globalThis) {
  let timer = null,
    speed = 60,
    carry = 0;
  function pause() {
    if (timer !== null) timers.clearInterval(timer);
    timer = null;
    carry = 0;
    change(false);
  }
  function start() {
    if (timer !== null) return;
    timer = timers.setInterval(() => {
      carry += speed / 4;
      const seconds = Math.floor(carry);
      carry -= seconds;
      if (seconds) step(seconds);
    }, 250);
    change(true);
  }
  return {
    start,
    pause,
    toggle: () => (timer === null ? start() : pause()),
    setSpeed: (value) => {
      if ([1, 10, 60, 300].includes(value)) speed = value;
    },
    running: () => timer !== null,
    shutdown: pause,
  };
}
