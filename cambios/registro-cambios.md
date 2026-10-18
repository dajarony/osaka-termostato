# Registro de cambios

## 2026-10-18 — Escuela F30 / reestructuración
- **Antes**: archivo HTML único con atajos externos para modificar parámetros y lógica didáctica no aislada.
- **Después**: separación SUME en catálogo, motor, teclado, ejercicios y UI; acceso a parámetros únicamente por el teclado simulado.
- **Seguridad de cambio**: original archivado en `legacy/`.
- **Contratos ECA**: estados frío/calor, temporización, desescarche, sondas, retardo compresor y ventilador.
- **Pruebas**: `node --test tests/f30.test.cjs` y sintaxis de JS en CI.
- **Riesgos pendientes**: el hardware físico aún no se ha contrastado; advanced documentado pero no fielmente emulado.
