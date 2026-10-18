# Registro de cambios · Osaka Lab

Registro acumulativo. No reescribir entradas históricas.

## 2026-10-18 — Reconstrucción SUME y cámara de referencia

**Archivos afectados:**
- index.html, main.js, package.json/lock, vite.config.js y configuración de formato.
- entradas/: puerta pública, validación, orquestación, reloj, teclado, navegación, archivos y repositorio.
- logica/: estado, tiempo, sondas, regulación, modos, desescarche, ventilación, alarmas, relés, planta y aprendizaje.
- salidas/: componentes visuales, gráfica, esquema de cámara, editor, diagnóstico, exportación, sonido y estilos por componente.
- contratos/: catálogo conservado del commit 0c3f30d, esquemas, retos, teclas, Result, SCP, FASER, módulos y oráculo.
- scripts/: comprobador y generador de mapa; mapa-global/arquitectura.yaml.
- tests/: ECA, ciclo de vida, teclado, persistencia y navegador; playwright.config.js.
- AGENTS.md, STATUS.md, CONTEXT.md, SUME-README.md, README.md y docs/.
- .github/workflows/verify.yml: puertas automáticas.

**Motivo:** el HTML inicial mezclaba reglas, almacenamiento y presentación; varios parámetros
solo se guardaban y no había verificación reproducible ni planta física.

**Impacto:** reloj por segundos, configuración atómica, modelo térmico determinista, relés
efectivos, errores visibles, ejercicios sin logros de inicialización y frontend responsive.
Los módulos de dominio no dependen de IO y sus importaciones se trazan automáticamente.
Requiere servir módulos mediante HTTP. Archivos importados usan formato versión 3;
el formato antiguo V1 no se migra automáticamente. Se conservan sus datos en el historial Git.
Tres opciones avanzadas se rechazan explícitamente por falta de emulación verificada.

**Verificación:** 84 pruebas Node pasan; análisis SUME y build pasan. Evidencia UI y métricas
se registran en docs/evidencias y docs/ECA-INFORME.md. Cinco hallazgos nuevos se reprodujeron
en rojo antes de corregirse y pasaron con el mismo banco.

**Autor:** Codex por solicitud del usuario; cámara de referencia confirmada en conversación.

## 2026-10-18 — Entrega revisable y verificación remota

**Archivos afectados:** STATUS.md y este registro.
**Motivo:** registrar la entrega efectivamente creada, no un estado previsto.
**Impacto:** PR #1 en borrador; commit de código 93b4d0f y CI 39089734121 correctos.
No se ha fusionado la propuesta. El simulador también está disponible en servidor local.
**Autor:** Codex.

## 2026-10-18 — Contraste con repositorios externos

**Archivos afectados:** docs/COMPARACION-REPOS.md y docs/evidencias/reference-review.json.
**Motivo:** petición de revisar firmware público y explicar qué conviene reutilizar.
**Impacto:** revisión de tres commits externos, seis comprobaciones locales correctas
y dos observaciones sobre desescarche documentadas. No cambia el motor ni su contrato;
no se importó código de terceros ni se ejecutaron los firmwares externos.
**Autor:** Codex.

## 2026-10-18 — Operación móvil e instalación PWA

**Motivo:** petición explícita de manipular todo desde un móvil; «wpa» interpretado como PWA.
**Archivos afectados:** vistas/estilos táctiles, editor, sondas, navegación, bootstrap;
adaptadores de instalación y caché, manifiesto/iconos, constructor Vite, pruebas UI,
contrato móvil, README, STATUS y mapa SUME.
**Impacto:** navegación inferior y tiempo accesibles, controles de 44 px, signo y oF
sin teclado alfanumérico. Producción precarga archivos y permite recargar/editar offline.
Actualizaciones manuales, caché por ámbito y sin cambios en dominio físico.
**Evidencia:** 84 pruebas de lógica y 18 UI correctas, 2 omisiones exclusivas de móvil
en escritorio. La primera prueba offline falló por Vary: Origin en recursos estáticos;
se corrigió la búsqueda del caché y se repitió con la misma expectativa.
**Límites:** pruebas en Edge/Chromium con móvil emulado; no instalación física en iOS/Android.
Publicación HTTPS todavía pendiente. El informe de comparación externa conserva R1/R2 abiertos.
**Autor:** Codex.
