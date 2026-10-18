# Contraste con controladores públicos

Fecha: 2026-10-18. Sujeto local: `92fff8f`. Autor: Codex.
Petición: revisar código externo y explicar qué aporta a la fidelidad del F30.
Revisión estática de fuentes y pruebas externas; ejecución de seis casos locales
y dos exploraciones. No se compiló ni ejecutó ninguno de los tres firmwares externos.
No se incorporó código de terceros ni se cambió el motor.

## Fuentes fijadas

| Proyecto | Revisión consultada | Licencia declarada |
|---|---|---|
| [ModESP_v4](https://github.com/Zapadenec1982/ModESP_v4/tree/7784e3d226d05fc402e1540366c17e9d4bcf3a75) | `7784e3d226d05fc402e1540366c17e9d4bcf3a75` | PolyForm Noncommercial 1.0.0 |
| [STC-1000+](https://github.com/matsstaff/stc1000p/tree/24be0127fb94209f18ca702d9dc7b8461c51b673) | `24be0127fb94209f18ca702d9dc7b8461c51b673` | GPL-3.0 |
| [Secop fridge-controller](https://github.com/microfarad-de/fridge-controller/tree/b014f36c8de087794e3e63a0a4093bf35daa62ea) | `b014f36c8de087794e3e63a0a4093bf35daa62ea` | GPL-3.0 |

## Lo que coincide y lo que cambia

- ModESP regula frío con arranque `T >= SP + diferencial` y parada `T <= SP`,
  igual que nuestro motor si se satisfacen las protecciones. Su
  [regulación](https://github.com/Zapadenec1982/ModESP_v4/blob/7784e3d226d05fc402e1540366c17e9d4bcf3a75/modules/thermostat/src/thermostat_module.cpp#L372)
  también exige un mínimo de marcha antes de parar. Ese mínimo NO debe confundirse
  con PP3 del F30, que limita el tiempo entre dos arranques.
- STC-1000+ usa `T > SP + diferencial` para arrancar y `T <= SP` para parar.
  [Código, líneas 557–615](https://github.com/matsstaff/stc1000p/blob/24be0127fb94209f18ca702d9dc7b8461c51b673/src/page0.c#L557).
  A la igualdad exacta hay una diferencia: no es un sustituto directo del F30.
  Además desactiva ambas salidas al entrar en alarma (líneas 1274–1282), mientras
  que nuestro fallo Pr1 puede mantener un ciclo configurado con rt1/rt2.
- El [controlador Secop](https://github.com/microfarad-de/fridge-controller/blob/b014f36c8de087794e3e63a0a4093bf35daa62ea/fridge-controller.ino#L350)
  recibe demanda externa, impone mínimos de marcha/parada y controla velocidad.
  Su desescarche (líneas 690–756) depende de horas acumuladas y ciclo de trabajo,
  y espera una parada del compresor. No reproduce los modos EL/in/Et del F30.
- ModESP conserva el tipo de desescarche al iniciar el ciclo y mantiene un límite
  temporal de 1–120 minutos incluso ante valores fuera de rango. Véanse
  [configuración del límite](https://github.com/Zapadenec1982/ModESP_v4/blob/7784e3d226d05fc402e1540366c17e9d4bcf3a75/modules/defrost/src/defrost_module.cpp#L41)
  y [ciclo activo](https://github.com/Zapadenec1982/ModESP_v4/blob/7784e3d226d05fc402e1540366c17e9d4bcf3a75/modules/defrost/src/defrost_module.cpp#L377).
  Tiene pruebas específicas de cambio de tipo durante el ciclo y bloqueo de
  compresor en gas caliente. Son escenarios útiles para nuestro banco, no reglas
  automáticamente atribuibles al Osaka.

## Comprobaciones locales ejecutadas

Puerta: `createSession({params: {...trainingDefaults, ...patch}}).run(command)`.
En todos los casos se desactiva la física con `physics:false` para aislar el control.
Las expectativas de las seis comprobaciones se fijaron antes de ejecutar. Se
basan en nuestro contrato existente; no constituyen ejecución diferencial contra
los firmwares. Resultado: **6/6 correctas**.

| Caso | Configuración/estímulo | Resultado esperado y observado |
|---|---|---|
| Histéresis | SP=4, rd=2; Pr1=4,5.9,6,5,4 | compresor OFF,OFF,ON,ON,OFF |
| Mínimo parado | PP2=-10; Pr1=15 y luego 20 | OFF a 9 s; ON a 10 s |
| Fallo Pr1 | rt1=-5,rt2=-5; sonda abierta | ON a 0 s, OFF a 5 s, ON a 10 s |
| Eléctrico | ddt=EL,dPE=oF; iniciar | compresor OFF, desescarche ON |
| Gas caliente | ddt=in,dPE=oF; iniciar | compresor ON, desescarche ON |
| Fallo EP | dde=10,dEE=-10; iniciar y abrir Pr2 | sigue a 9 s; termina a 10 s |

Los seis casos son una comprobación adicional, no seis pruebas nuevas incorporadas
al contador de 84 de la entrega. [Resultado estructurado](evidencias/reference-review.json).

## Dos observaciones reproducidas

### R1 — Pérdida de la única condición automática de fin

Prioridad de revisión: alta para robustez de la simulación; equivalencia F30 sin resolver.
Configurar `ddt=EL,dde=oF,dEE=oF,dPE=EP`, iniciar desescarche, abrir Pr2 y avanzar
3600 segundos. Observado: fase `defrost`, relé de desescarche activo, alarma E2.
`startDefrost` acepta la sonda sana como condición de fin; `runningDefrost`
no dispone después de sonda válida ni temporizador. Archivos:
`logica/desescarche.js:21` y `logica/desescarche.js:55`.

Propuesta: definir explícitamente una política ante pérdida de la última condición
de fin (rechazo previo, límite de respaldo o aborto). Para atribuirla al F30 hay
que verificar su manual/firmware o medir un equipo. No se cambió el contrato para
convertir esta observación en un fallo artificial de una regla no especificada.

### R2 — Cambio de tipo durante el desescarche

Prioridad de revisión: media; diferencia confirmada con ModESP, política F30 desconocida.
Configurar `ddt=EL,dPE=oF`, iniciar y enviar `configure {ddt:'in'}`.
Observado: sin terminar el ciclo, compresor pasa de OFF a ON y desescarche sigue ON.
La configuración entra inmediatamente en `logica/acciones.js:23`; regulación y
planta consultan el tipo actual. ModESP fija el tipo al comienzo del ciclo.

Propuesta: conservar el tipo activo hasta terminar o restringir el cambio durante
el ciclo, si ese es el contrato deseado. No confundir el comportamiento observado
del simulador con evidencia de una conexión eléctrica peligrosa en un equipo real:
este proyecto no controla hardware y también cambia su modelo térmico al cambiar ddt.

## Reutilización recomendada

1. Usar escenarios independientes de fallo, límites y cambios de configuración
   para ampliar ECA. Escribir nuestras propias pruebas y contrastar cada regla
   del dispositivo con el manual F30, conservando fuente y revisión.
2. Mantener nuestra separación SUME. El código externo usa C/C++ y dependencias
   de hardware; pegarlo no mejora automáticamente nuestra arquitectura ni fidelidad.
3. No importar ModESP al producto comercial sin resolver su licencia. Cualquier
   incorporación de código GPL exige revisar la compatibilidad de distribución.
4. Conservar como pendientes C3, RTC y ddd: ninguno de estos tres proyectos
   demuestra su implementación específica en el F30.

La tabla indexada del manual oficial F30 V2 confirma la distinción PP1/PP2/PP3 y
los parámetros de duración; la URL oficial devolvió 404 al intentar descargar el
PDF. No se ha considerado una lectura completa ni una validación de firmware.
No se dispone de trazas de un F30 físico. Por tanto, esta revisión aporta contraste
independiente de diseño y casos, pero no certifica equivalencia con el dispositivo.
