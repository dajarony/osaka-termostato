# Estado · Osaka F30

Fecha: 2026-10-18. Autor: Codex.
Estado: cámara de referencia implementada y verificada localmente y en CI de GitHub.
Entrega revisable: https://github.com/dajarony/osaka-termostato/pull/1 (borrador).
PWA publicada: https://dajarony.github.io/osaka-termostato/ — fuente e8dec7e,
rama de distribución gh-pages, commit 79cdcdb. Publicación autorizada por el usuario.
La fidelidad extendida C3/RTC/ddd queda pendiente; ver docs/COBERTURA.md.

- [x] 1. Fundamentos y contratos base
- [x] 2. Arranque y pantalla
- [x] 3. Módulos y ciclo de vida
- [x] 4. Contratos funcionales y pantalla redactados (Draft; sin firma humana formal)
- [x] 5. Dominio puro
- [x] 6. Servicios y persistencia
- [x] 7. Componentes visuales
- [x] 8. Presentación
- [x] 9. Pruebas y ECA del alcance documentado

## Puerta de verificación
- `npm run check`: 65 archivos SUME, 72 parámetros, dominio puro, sin ciclos, mapa sincronizado.
- `npm run format:check`: formato correcto.
- `npm test`: 84/84, cero fallidos; 70 corresponden al banco ECA.
- `npm run test:ui`: 18 aprobadas y 2 omitidas por ser exclusivas de móvil en el proyecto escritorio; 0 fallos. Producción, móvil táctil y recarga offline en Edge/Chromium.
- `npm run build`: correcto; salida estática en dist/.
- `git diff --check`: correcto.

Las fases se verifican como una entrega integrada solicitada por el usuario. No se inventan
aprobaciones humanas ni ejecuciones históricas separadas para cada fase.

## Bitácora
| Fecha | Fase | Autor | Acción |
|---|---|---|---|
| 2026-10-18 | — | Codex | Revisado commit 0c3f30d. HTML único, 72 códigos, 14 retos y lógica parcial. Usuario confirma cámara frigorífica de referencia. |
| 2026-10-18 | 1–3 | Codex | Fundamentos, bootstrap y módulo de sesión verificados mediante análisis y pruebas de ciclo de vida. |
| 2026-10-18 | 4 | Codex | CMCF, FASER, SCP y oráculo documentados como hipótesis técnicas; sin firma Approved. |
| 2026-10-18 | 5–6 | Codex | Dominio, planta y persistencia verificados por 84 pruebas; cinco regresiones ECA reproducidas y corregidas. |
| 2026-10-18 | 7–9 | Codex | Presentación y alcance documentado cerrados con check, formato, build y 12 pruebas UI. Capturas revisadas. Fidelidad extendida pendiente explícita. |
| 2026-10-18 | Entrega | Codex | Commit 93b4d0f publicado en feat/sume-simulator; PR #1 en borrador. CI 39089734121 completa correctamente instalación, análisis, formato, 84 tests, build y 12 UI en Linux/Chromium. |
| 2026-10-18 | Móvil / PWA | Codex | Navegación inferior, áreas táctiles, edición de signo/oF, manifiesto y caché offline. 84 pruebas de lógica y 18 UI correctas; 2 casos solo móviles se omiten en escritorio. Publicación HTTPS e instalación en móvil físico pendientes. |
| 2026-10-18 | Publicación | Codex | Usuario autoriza GitHub Pages. Distribución 79cdcdb construida desde e8dec7e, HTTPS activo. URL real verificada con móvil Pixel 7 emulado: edición, persistencia, recarga offline, avance de tiempo y cuatro pestañas, sin excepciones JS. Instalación en hardware físico pendiente. |
