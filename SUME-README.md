# SUME + STDG · Osaka Lab

| Capa | Responsabilidad |
|---|---|
| entradas | Validación, sesión, reloj, DOM de entrada y almacenamiento |
| logica | Políticas de refrigeración, planta y aprendizaje puros |
| salidas | Vistas, estilos, display y documentos |
| contratos | Catálogo, esquemas, FASER, SCP, oráculo y módulos |
| mapa-global | Grafo generado desde los imports reales |
| cambios | Registro acumulativo de modificaciones |

`main.js` solo inicia la aplicación. Cada archivo de fuente declara entradas, acciones
y salidas en su DOCBLOCK. JSON utiliza su propio esquema de datos sin comentarios inválidos.
El grafo se genera con `npm run map`; `npm run check` falla si deriva de los imports,
si existen ciclos, si se supera el límite de tamaño de módulos o si el dominio importa IO.

Para añadir una política: declarar contrato/oráculo, implementar módulo puro, componer
en controlador, cubrir la puerta pública en ECA y registrar el cambio.
La interfaz funciona con snapshots; no se permite que una vista modifique el estado de sesión.
