# Construcción Dajarony

SUME tiene prioridad como organización física; las características viven dentro de cada capa.
Se aplican init, SUME/STDG, CMCF, FASER, SCP, module, domain-modeling,
codebase-design, TDD, ECA/dajarony-eca, audit y code-review.
fase organiza la construcción; status certifica las comprobaciones al terminar.
Las skills de Caché/IRIS, bases de datos productivas, servicios externos y otros productos
no corresponden a este simulador estático. No se crean dependencias artificiales para invocarlas.

| Fase | Entrega | Puerta / definición de terminado |
|---|---|---|
| 1 | Result, catálogo, tokens | check + tests de validación |
| 2 | index y bootstrap | build + arranque en navegador |
| 3 | sesión con init/run/fallback/checkHealth/shutdown | tests de ciclo de vida |
| 4 | CMCF, FASER, SCP y oráculo | secciones completas, sin aprobación inventada |
| 5 | sensores, control, temporizadores, planta | tests de umbrales y conservación |
| 6 | sesión y almacenamiento versionado | tests de rechazo atómico y fallos de IO |
| 7 | panel, gráfica, planta, parámetros | navegador y responsive |
| 8 | comandos conectados, retos y diagnóstico | recorridos UI completos |
| 9 | ECA, arquitectura, construcción y regresiones | check, test, build, test:ui |

El alcance físico es una aproximación determinista de balances térmicos con aire,
producto y evaporador. Sus coeficientes se documentan; no equivalen a calibración de equipo real.
El reloj simulado avanza en segundos discretos y es independiente del refresco visual.
Cada nueva característica declara su contrato, lo prueba por la puerta pública y actualiza STDG.
