# CMCF · cámara frigorífica

## Intención global
Practicar regulación, averías y diagnóstico de un F30 sobre una cámara frigorífica reproducible.

## Alcance
Dentro: tres sondas, 72 códigos catalogados y validados, relés, control térmico,
desescarche, protecciones, alarmas, 14 retos, historial, exportación y sesión local.
Fuera: cableado real, certificación del fabricante, red frigorífica bifásica detallada,
conector KEY USB y reloj RTC del hardware. Las diferencias se muestran en cobertura.

## Bloques principales
| BP | Responsabilidad | Interfaz | Estado |
|---|---|---|---|
| Parámetros | validar configuración coherente | validateParameters | no |
| Regulador | decidir demanda y relés por segundo | updateController | sesión |
| Planta | balance térmico determinista | advancePlant | sesión |
| Sesión | ordenar comandos y conservar trazas | createSession | exclusivo |
| Aprendizaje | evaluar maniobras ordenadas | evaluateLesson | sesión |
| Presentación | mostrar y recoger interacciones | mount/render/dispatch | visual |
| Persistencia | guardar/restaurar configuración y progreso | load/save | navegador |

## UAF e interfaces
- validar comando: objeto externo → comando tipado o INVALID_COMMAND; sin efectos si falla.
- validar parámetros: parche + catálogo → configuración completa o INVALID_PARAMETER.
- leer sondas: temperaturas físicas + calibración/filtro → lecturas o fallo explícito.
- decidir histéresis: lectura + demanda previa + consigna → demanda.
- proteger arranque: demanda + marcas de tiempo → salida permitida/motivo.
- actualizar desescarche: sondas + reloj → fase y relé.
- decidir ventilación: fase + demanda + límites → salida.
- evaluar alarma: lectura + umbral + reloj → avisos activos y memoria.
- integrar planta: energía/segundo + estados → temperaturas finitas.
- registrar transición: estado anterior/nuevo → evento con tiempo y causa.
- evaluar reto: especificación + evidencia ordenada → objetivos satisfechos.
- persistir: documento versionado → Result; fallo visible, sesión continúa en memoria.

## Flujo y decisiones
DOM/JSON → validación → sesión → sensores/control/planta → snapshot → vistas/JSON.
Las reglas no importan vistas. La sesión inyecta su reloj simulado; no hay EventBus global.
Las llamadas directas se declaran como dependencias en el mapa. Eventos son datos de auditoría.
El modo manual permite ensayar valores exactos; la planta física es el modo inicial.
Próximos artefactos: FASER regulador, SCP laboratorio y oráculo ECA.
