# Auditoría Dajarony y revisión de cambios

Base: `0c3f30d`. Fecha: 2026-10-18. Alcance: implementación local de la cámara de referencia.

## Pendientes explícitos

- P1 de fidelidad: modos C3, cL/RTC y ddd dinámico no emulados. La puerta los rechaza
  con UNSUPPORTED_MODE; no hay éxito falso. Requieren especificación fiable y banco propio.
- P2 de independencia ECA: el mismo agente implementa y prepara el banco. Oráculo en Git,
  hipótesis visibles, sin aprobación humana ni separación de permisos del banco.
- P2 de validación física: coeficientes de referencia; falta calibración con una instalación
  real si se quisiera convertir la herramienta en gemelo de un equipo concreto.
- P2 de portabilidad: móvil emulado con Chromium; Safari físico no probado.
- Revisión externa R1/R2: pérdida de la condición de fin y cambio de tipo durante
  desescarche, reproducidos y abiertos en COMPARACION-REPOS.md. No se atribuye aún
  su política al F30 real.

## Hallazgos corregidos

Cinco fallos observables de lógica y un defecto de nombres accesibles documentados en
ECA-INFORME.md. Sus regresiones pasan. No se afirma ausencia absoluta de defectos.

## Consistencia de artefactos

- Ruta `/`: SCP único con 13 secciones; cuatro pestañas en la misma pantalla.
- Contratos humanos Approved: 0. Draft técnico: 1 SCP; FASER y oráculo con hipótesis explícitas.
- Estado propiedad de sesión, puerta validada, snapshots aislados y ciclo de vida comprobado.
- Configuración/progreso versionados; importación completa previa a aplicación; errores IO visibles.
- Dominio sin DOM/red/Storage/reloj real. Dependencias directas explícitas, sin ciclos.
- Mapa generado desde fuentes; DOCBLOCKs comprobados; registro de cambios acumulativo.
- Pruebas observables actuales: 84 Node y 18 UI pasan; 2 casos táctiles se omiten
  en escritorio. Check, formato y build correctos. El resumen original de 12 UI
  conserva la evidencia de la entrega inicial; pwa.json recoge la ampliación móvil.
- No hay backend, cuentas, credenciales, servicios externos ni hardware que desplegar.
- PWA construida con caché de versión por ámbito, instalación y actualización
  manual. Recarga offline verificada en producción; publicación HTTPS pendiente.

## Skills aplicadas y límites

init y SUME/STDG establecen estructura; CMCF, FASER, SCP y module declaran responsabilidades;
domain-modeling fija vocabulario; codebase-design mantiene las fronteras; TDD y diagnosing-bugs
reproducen regresiones antes de arreglar; ECA/dajarony-eca contrasta promesas con resultados;
audit/code-review revisan coherencia; status registra evidencia; writing-for-agents deja continuidad.
La petición global autorizó implementación y correcciones, sin atribuir firmas de contratos al humano.
No se invocan stacks ajenos como Caché/IRIS ni se añade una base de datos solo para usar una skill.
