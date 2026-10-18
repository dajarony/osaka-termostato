# Estado del proyecto · OSAKA F30

## Entregado
- Panel OSAKA con cuatro teclas y duraciones de pulsación; sin editar parámetros desde el catálogo.
- Menú estándar, edición rápida de consigna, salida y vista de Pr1/Pr2/Pr3.
- Catálogo de 72 códigos, rangos básicos y valores de fábrica (comparar con revisión hardware).
- Simulación de enfriamiento/calor básico, desescarche manual y periódico, ventilador, goteo, PP1/PP2/PP3, 3 relés, fallos de sonda.
- Banco externo de tres sondas, entrada digital y reloj; 14 retos.
- Pruebas y CI.
- Versión previa preservada en `legacy/entrenador-v2-original.html`.

## Validez
**ENTRENADOR, NO EMULADOR DE FIRMWARE CERTIFICADO**. La navegación principal se apoya en manual OSAKA F30 V1; los tiempos y LEDs tienen simplificaciones. No hay hardware físico comunicado ni se reproducen las tolerancias de sensor NTC reales.

## No implementado/por validar
- Interfaz exacta de claves protegidas / bloqueo de teclado y todos los estados ECO/TURBO.
- Intervalos dinámicos ddd; dcd/dtF; fallo fallback dEi/dEE y programación cL.
- Modos avanzados de regulación nr/HC/C3 y refrigeración/calor doble con toda su lógica.
- Modos completos de alarmas (AHA/ALA, retardo, memoria), salida Aux y zumbador.
- Filtro iFt, offset combinado iCU y conversión Fahrenheit completa.
- Iconografía y patrón de parpadeo LED al milisegundo.
- Ensayo comparativo con equipo OSAKA F30 físico, sonda NTC real y oscilograma de relés.

## Próximos gates
1. Verificar navegación, SP, iP2, dPE y temporizadores observando un equipo F30 real.
2. Comparar cada uno de los 72 rangos/opciones y defaults con versión exacta de firmware.
3. Implementar nuevas familias con contratos/test de regresión.
4. Ejecutar E2E de pulsación larga en Chrome/móvil y contraste en hardware antes de declarar fidelidad plena.

## Guía de botonera añadida
- `guia-botones.html` + `src/ui/guide.js` + `src/ui/guide.css`: página independiente, 8 recetas guiadas, visualización de la tecla que toca pulsar, duración y código de pantalla, búsqueda de los 72 parámetros con distancia de flechas calculada desde `SLS`.
- Enlace prominente sobre la pantalla principal.
- E2E en Chrome: comprueba enlace superior, cargas de recetas, recorrido de pasos, búsquedas y navegación.
- La guía corresponde a la máquina de estados del **simulador** y no está certificada contra hardware de todas las revisiones de firmware.
