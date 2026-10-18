# Osaka F30 · contrato de trabajo

Simulador educativo de una cámara frigorífica de referencia. No controla hardware.
Stack: JavaScript ESM, HTML y CSS; Node 22 para herramientas y pruebas.
Raíz de fuentes: `.`. SUME organiza las características por responsabilidad:
`entradas/` valida comandos y adaptadores; `logica/` contiene dominio puro;
`salidas/` presenta y exporta; `contratos/` declara esquemas, catálogo y especificaciones.
Pruebas: `tests/`; ECA: `tests/eca/`; evidencia: `docs/evidencias/`.

## Reglas
- Una responsabilidad por archivo, funciones pequeñas y dependencias explícitas.
- Ningún DOM, reloj real, almacenamiento o red dentro del dominio.
- DOCBLOCK SUME en cada archivo de las cuatro capas. Mapa y registro actualizados.
- Estado propiedad exclusiva de la sesión; snapshots aislados; comandos validados antes de mutar.
- Errores esperados devuelven Result. Nunca ocultar fallos de persistencia.
- No añadir bases de datos, servicios remotos ni hardware sin un requisito concreto.
- Contratos Draft: hipótesis declaradas; nunca firmar Approved en nombre del usuario.
- El usuario ha autorizado implementar el sistema completo y la cámara de referencia.
  Se implementan las hipótesis documentadas sin presentar la firma técnica como aprobación humana.
- ECA fija expectativas antes del resultado y registra cambios de contrato por separado.
- No cerrar fases sin ejecutar sus comprobaciones. No reescribir la bitácora.

## Verificación
`npm run check` · sintaxis, fronteras SUME y trazabilidad.
`npm test` · Node test runner, dominio, integración y ECA.
`npm run build` · distribución estática.
`npm run test:ui` · navegador real, escritorio y móvil.

Leer STATUS.md, docs/PLAYBOOK.md y contratos antes de continuar.
