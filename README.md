# OSAKA F30 · Escuela de maniobras frigoríficas

Simulador didáctico de la pantalla y las cuatro teclas del **OSAKA F30**. Practica arranque y parada, diferencial, sondas NTC, desescarche manual o automático, ventiladores, goteo, retardos y errores.

## Abrir
Abre `index.html` en Chrome o sirve esta carpeta con `python -m http.server 8000`. No requiere framework ni compilación. GitHub Pages puede alojarlo sin cambios.

## Cómo practicar
1. Elige un ejercicio de la **Escuela de maniobras** y pulsa **Preparar ejercicio**.
2. Utiliza **SET** breve para la consigna o **mantén SET 5 s** para entrar en el menú. Busca códigos con ▲/▼, pulsa SET para editar, flechas para ajustar y SET para guardar. **⏻ 2 s** sale del menú.
3. Desde la pantalla normal, **mantén ▲ 5 s** para iniciar/detener un desescarche manual.
4. Cambia el *entorno* (tres sondas, entrada digital o transcurso del tiempo) desde el banco exterior para observar la respuesta del F30.
5. Pulsa **Comprobar maniobra**. El catálogo de 72 códigos es únicamente de lectura; no permite programar desde fuera del aparato.

Al editar valores, **mantén las flechas** para desplazarte más deprisa, como en el teclado del termostato.

## Práctica de clase: compresor 19→15 y desescarche 5 min/2 min/17°
Programa desde el equipo: `SP=15`, `rd=4`, `rHC=C`, `iP2=EP`, `ddC=rt`, `ddi=-5`, `dSd=-5`, `dde=2`, `dtE=17`, `dPE=EP`. Para iniciar con Pr2 cerca de 13 °C, configura una temperatura de permiso `dtS` adecuada, como 15 °C, **solo para el ejercicio**. Con el vaso a 13 °C el termostato no puede calentarlo hasta 17 °C por sí solo.

## Arquitectura y calidad
- `src/domain/catalog.js`: parámetros y validación
- `src/domain/plant.js`: estado frigorífico determinista
- `src/domain/panel.js`: teclado y menús
- `src/training/lessons.js`: 14 ejercicios y oráculos
- `src/ui/`: proyección y banco exterior
- `tests/`: pruebas unitarias Node (sin dependencias)
- `AGENTS.md`, `docs/CONTRATOS-ECA-SUME.md`, `STATUS.md`: proceso ECA/SUME y límites

Ejecuta `node --test tests/*.test.cjs` y revisa la pestaña Actions.

**Alcance**: simulación pedagógica; **no reproduce aún el firmware completo** y no sustituye controles de seguridad ni protege un compresor real. Documentación OSAKA: [Manual F30](https://www.automatizacionesaep.es/wp-content/Info-tecnica/OSAKA/F30.pdf).
