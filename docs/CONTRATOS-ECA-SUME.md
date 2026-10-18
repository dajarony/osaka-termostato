# Contratos ECA / SUME — OSAKA F30

## Límites
**Frontera de simulación**: el navegador emula la lógica de un termostato, no opera un dispositivo físico. El alumno cambia solo condiciones externas (temperaturas, entrada digital y reloj). Toda programación y maniobra del regulador pasa por las cuatro teclas.

## Módulos y responsabilidades
| SUME | Archivo | Responsabilidad |
|---|---|---|
| Entradas | `src/domain/panel.js` | FSM de teclas SET/▲/▼/⏻ y tiempos de pulsación. |
| Contratos | `src/domain/catalog.js` | 72 códigos; valores fábrica, tipos y rangos. |
| Lógica | `src/domain/plant.js` | Histeresis, relés, desescarche, retardos, sonda EP, ventilador. |
| Entrenamiento | `src/training/lessons.js` | 14 ejercicios y objetivos verificables. |
| Salidas | `src/ui/app.js` y `styles.css` | Proyección de pantalla/LEDs y banco de pruebas. |
| Oráculos | `tests/f30.test.cjs` | Transiciones esperadas en tests automáticos. |

## Invariantes de maniobra
- **Frío**: en rHC=C, el relé ot se activa al alcanzar SP+rd y se desactiva al bajar a SP; el estado intermedio mantiene histéresis.
- **Calor**: en rHC=H, se activa en SP-rd y se desactiva al subir a SP.
- **Desescarche**: solo se solicita con condiciones de sonda permitidas; por temperatura finaliza al llegar a dtE; por tiempo expira al cumplir dde. En ddt=EL se desconecta ot.
- **Contaje de ddi/dSd**: valores negativos = minutos, positivos = horas; duraciones dde/dtd negativos = segundos, positivos = minutos.
- **Panel**: SET corto edita consigna; SET 5 s lista parámetros; SET guarda valor y vuelve al código; ▲ 5 s inicia/cancela desescarche; ⏻ 2 s abandona programación.
- **Relés**: no inferir que el icono activado implica un componente físico conectado; consultar asignación oo1/oo2/oo3.
- **Sondas**: iP2 y iP3 no pueden tener ambas una misma función EP, Au o dG.
- **Ventilador**: respetar bloqueo por EP/FFL/FLF y el ajuste FFE durante desescarche.
- **Protecciones**: PP1/2/3 retienen salida ot; dtd retiene tras descarche.

## Oráculos y criterios de salida
- `node --test tests/*.test.cjs` sin fallos.
- Contraste del código/función con manual: p.2–3 teclado, p.8–11 regulación/desescarche/ventilador, p.14–15 parámetros.
- Prueba con equipo real aún **pendiente**. No extrapolar temporizadores internos más allá del subconjunto verificado por documentación.

## Pendientes
La emulación exhaustiva de Eco/Turbo, zona neutra avanzada, calendario por reloj, adelanto dinámico, alarma temporal/latch y todo el firmware no ha sido verificada. Estos códigos se consultan y editan, pero sus efectos no deben presentarse como físicamente equivalentes. Ver STATUS.
