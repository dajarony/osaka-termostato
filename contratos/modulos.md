<!-- SUME DOCBLOCK
Nombre: módulos | Tipo: Contrato
Entradas: CMCF y diseño SUME.
Acciones: declarar fronteras y ciclo de vida.
Salidas: contrato de componentes y dependencias.
-->
# Contratos de módulos

## osaka.session · 1.0.0
Propósito: propietario único del estado y puerta pública de simulación.
Entrada: `createSession({params, completed})`; dependencias: controller, plant, learning.
`init()` devuelve Result de arranque; `run(command)` aplica intenciones validadas;
`snapshot()` devuelve copia aislada; `fallback()` conserva snapshot;
`checkHealth()` devuelve estado de ciclo de vida; `shutdown()` rechaza comandos futuros.
Los errores son INVALID_COMMAND, INVALID_PARAMETER, UNSUPPORTED_MODE,
DEFROST_BLOCKED y SHUTDOWN. Los rechazos de validación no modifican estado.
Eventos emitidos: comp:on/off/protect/drain, fan:on/off, def:start/temp/time/manual/reject/auto,
alarm:on/off, configure, probe, fault, door:open/close, power:on/off, physics, mode, acknowledge.
Payload común: id secuencial, time en segundos simulados, type y detail serializable.
Eventos consumidos: comandos explícitos; no bus global. Dependencias directas documentadas
en mapa-global/arquitectura.yaml. Evidencias acotadas a 600 eventos, 360 muestras,
1000 eventos de reto; prueba de robustez de ocho horas y suite ECA por puerta pública.

## Controlador, planta y aprendizaje
Módulos funcionales sin recursos: inicialización y cierre son propiedad de sesión.
El controlador ordena sensores → modos → desescarche → regulación → ventilación → alarmas → relés.
La planta recibe el estado del segundo anterior y actualiza balances; nunca lee DOM ni reloj real.
Aprendizaje evalúa solo evidencia posterior a iniciar un reto; la inicialización no concede logros.
Pruebas: tests/eca/controller.test.js y tests/eca/lessons.test.js.

## Repositorio local
Dependencia Storage inyectada. `load/save` → Result. No datos personales ni servidor.
Conserva configuración/progreso; no restaura automáticamente una máquina en marcha.
Un fallo de almacenamiento conserva estado en memoria y muestra recuperación por exportación.
Pruebas: tests/storage.test.js.

## Reloj y presentación
Reloj `start/pause/toggle/setSpeed/shutdown`, una única suscripción, paso entero acotado.
La pestaña oculta pausa. La frecuencia visual no modifica las reglas del reloj simulado.
Las vistas reciben snapshots, nunca estado mutable. Las interacciones emiten comandos.
No poseen lógica de refrigeración. Pruebas de navegador en tests/ui.
