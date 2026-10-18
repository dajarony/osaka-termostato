# OSAKA F30 · Contrato de trabajo para agentes

## Objetivo
Crear un **entrenador didáctico** que imite, de manera verificable, el teclado y la lógica frigorífica del OSAKA F30. No pretende conectar con equipos energizados.

## Fuentes de verdad
1. Manual de usuario OSAKA F30 V1/V2: https://www.automatizacionesaep.es/wp-content/Info-tecnica/OSAKA/F30.pdf
2. `docs/CONTRATOS-ECA-SUME.md` y `STATUS.md`
3. `src/domain/catalog.js` (parámetros) y tests.
4. `cambios/registro-cambios.md`

## Reglas obligatorias (SUME / ECA / Gauntlet)
- **Entradas**: exclusivamente eventos del teclado físico simulado para ajustes, y sensores/tiempo/DI como perturbaciones del laboratorio.
- **Lógica**: `Plant` simula estados y relés; `Panel` implementa la navegación del teclado; `catalog` valida códigos/rangos.
- **Salidas**: la UI solo pinta el estado. No dar accesos directos a ajustar parámetros desde catálogo o retos.
- **Contratos ECA**: definir entradas, salidas, invariantes y oráculo antes de cada nueva maniobra. Probar por evento y comportamiento, no solo por estado final.
- **TDD**: añadir prueba de regresión a `tests/f30.test.cjs` antes de corregir un fallo. `node --test tests/*.test.cjs` debe pasar.
- **Una responsabilidad**: evitar lógica de compresor, ventilador y desescarche escondida en el renderizador.
- **Hardware**: jamás afirmar "100 % fiel", certificación o conexión a un F30 real sin contraste reproducible con hardware. Documentar en STATUS limitaciones conocidas.
- **Seguridad**: no explicar conexiones de 230 V desde esta aplicación, sin promesas de protección en planta real.
- **Cambios**: registrar antes/después, pruebas y limitaciones en `cambios/registro-cambios.md`; commits pequeños.
- **Reutilizar antes de construir**: usar JS estándar, sin dependencias no justificadas.

## Gates
1. Código revisable por módulo.
2. Sintaxis de cada JS correcta.
3. 72 códigos únicos sin duplicados.
4. Teclas cortas/largas, histéresis, desescarche, ventilador y goteo cubiertos por tests.
5. CI verde.
6. Funciones sin simulación documentadas en STATUS, nunca inventar sus efectos.
