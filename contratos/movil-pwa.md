<!-- SUME DOCBLOCK
Nombre: móvil y PWA | Tipo: Contrato
Entradas: petición de operar todo desde un móvil.
Acciones: definir interacción táctil, instalación y funcionamiento sin conexión.
Salidas: criterios verificables de aceptación móvil.
-->
# Móvil como interfaz principal

Estado: Draft técnico. Fecha: 2026-10-18. Interpretación de «wpa»: PWA.

- Todos los controles del laboratorio, 72 parámetros, ejercicios, diagnóstico e
  importación/exportación deben estar disponibles desde el navegador móvil.
- Navegación inferior permanente, controles de tiempo accesibles en las cuatro
  secciones y objetivos táctiles de al menos 44 × 44 píxeles CSS.
- Pantallas de 320 a 430 píxeles sin desbordamiento horizontal. Diálogos desplazables
  en horizontal y al reducirse el espacio de pantalla. Ninguna función depende de hover.
- Valores negativos y desactivación `oF` accesibles con botones/casillas, sin depender
  de caracteres ausentes en el teclado decimal. Los inputs conservan validación de dominio.
- Manifiesto con ámbito relativo, nombre, iconos PNG 192/512 y modo standalone.
- En producción HTTPS (o localhost para pruebas), precargar toda la aplicación.
  Solo anunciar disponibilidad offline cuando el service worker esté listo.
- Después de esa preparación, recargar sin red, editar, simular y conservar
  configuración/progreso. La primera visita requiere conexión.
- Cada compilación tiene una versión de caché basada en el contenido. Las nuevas
  versiones esperan a que el usuario pulse Actualizar app; no interrumpir una sesión
  automáticamente. La actualización recarga y reinicia la simulación transitoria.
- Aislar cachés por ámbito. Solo eliminar versiones propias anteriores. No cachear
  servicios externos ni documentos importados.
- Al ocultar la app o bloquear el dispositivo, pausar. Configuración y retos persisten;
  reloj, temperaturas y eventos transitorios no prometen continuidad tras cerrar la app.
- Instalación nativa depende del navegador. Mostrar instrucciones para Safari/iOS
  y Android si no se ofrece un prompt. No afirmar que emulación sustituye pruebas físicas.

Verificación: `npm run test:ui` construye y prueba producción en el puerto 4174.
Incluye recarga offline real con la red del contexto deshabilitada, persistencia,
recorridos táctiles, dimensiones de controles y edición en horizontal.
La publicación HTTPS es una acción separada; localhost en el PC no es una URL móvil.
