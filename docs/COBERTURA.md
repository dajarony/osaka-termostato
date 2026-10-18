# Cobertura verificable

Esta entrega es un simulador funcional de la cámara de referencia. No se declara emulación
completa del firmware ni cobertura total de las variantes de hardware del fabricante.

| Área | Implementado | Límite explícito |
|---|---|---|
| Consignas | SP, SPE, SPH, límites SLS/SHS, diferenciales | Temperaturas configuradas en °C |
| Regulación | C, H, nr, HC, ECO/Turbo seleccionables, tiempos | C3 automático rechazado |
| Sondas | Pr1/2/3, EP/Au/dG, filtro, offsets, errores abierto/corto | Sin curva resistencia NTC ni ruido |
| Digital | iFi ±1..±10, retardo, puerta, alarma, ECO, standby, Turbo, inicio/fin defrost | Contacto único compartido con puerta del banco |
| Desescarche | EL/in/no/Et, rt/ct/cS, tiempo/temperatura, dtF/dSt, dcd, dEi/dEE, goteo | cL RTC y ddd≠0 rechazados |
| Ventiladores | Límites/histéresis, ciclos, FFE, FFd independiente | Capacidad aerodinámica de referencia |
| Protecciones | PP1/2/3 y Pod | Standby lógico no simula corte de suministro con EEPROM |
| Alarmas | Hi/Lo absolutas/relativas Pr1/Au, retardo, inhibiciones, memoria, puerta | Sin registro HACCP de hardware |
| Relés | ot/dF/Fn/Au/HE y variantes de alarma, auxiliar 1..5 | Relés ideales; sin soldadura/contacto defectuoso |
| Panel | Display, mensajes, °C/°F, bloqueo, contraseña, consignas tEd, tUF/tFb, sonido optativo | Navegación didáctica; no pulsaciones largas ni niveles ocultos |
| Formación | 14 retos completos con evaluación de maniobras posteriores al inicio | Cobertura acotada a objetivos declarados |
| Persistencia | Local versionada, exportación/importación validada y atómica | No nube, cuentas, sincronización ni migración automática de archivos V1 |

Tres parámetros tienen cobertura parcial declarada: rHC, ddC y ddd. Una opción no soportada
devuelve UNSUPPORTED_MODE antes de modificar la configuración. No existen valores aceptados
como “implementados” para esas opciones.

Pruebas en escritorio y viewport móvil con Chromium/Edge. La emulación móvil comprueba
layout e interacción táctil; no sustituye pruebas en un iPhone físico ni en Safari/WebKit.
