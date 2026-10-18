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
