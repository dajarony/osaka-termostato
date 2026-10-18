<!-- SUME DOCBLOCK
Nombre: simulador.faser | Tipo: Contrato
Entradas: petición de cámara de referencia y manual F30 V2.
Acciones: declarar estados, eventos e invariantes antes de implementar.
Salidas: especificación funcional verificable.
-->
# FASER · sesión de refrigeración · 1.0.0

## Definición
Servicio local determinista. Hipótesis de implementación autorizadas por la petición global;
no certificación de equivalencia exacta al firmware. Fuente: manual oficial F30 V2,
https://www.osakasolutions.com/hubfs/Productos/Termostatos/F30/MU_EN_F%2030_v2.pdf?hsLang=es-es

## Estado
seconds:number=0; powered:boolean=true; mode:normal|eco|turbo=normal;
physics:boolean=true; temperatures={pr1:20,pr2:13,pr3:15}; faults=ninguno;
door:boolean=false; compressor/fan/heater/defrost=false; lastStart/lastStop=null;
phase=idle|defrost|drain; alarms:string[]=[]; events/samples acotados;
lesson=null; completed:string[]=[]. Configuración/progreso persistentes; reloj y planta transitorios.

## Entradas
Comandos configure, probe, fault, door, power, mode, physics, environment, advance,
defrost, acknowledge, auxiliary, reset, lesson y grade. Todos validados antes de mutación.
advance acepta enteros 1..3600 segundos. Lecturas manuales -50..80 °C.

## Eventos, acciones y resultados
1. configure válido: validar parche y relaciones → aplicar atómicamente → recalcular → evento.
2. advance válido: repetir exactamente un segundo de planta/reloj/control → snapshot.
3. probe/fault/door: aplicar perturbación → recalcular → relés y avisos observables.
4. defrost: rechazar en standby, goteo o EP mayor a dtS; iniciar si permitido.
   Fin por dPE/dtE o tiempo dde; goteo dtd y espera de ventilador FFd separados.
5. power off: detener actuadores, cancelar ciclo; conservar marcas anticiclos.
6. reset: iniciar escenario conservando configuración, limpiar eventos/tiempo y retos activos.
7. lesson: cargar fixture manual aislado; grade requiere acciones posteriores al inicio.

## Validaciones
Números finitos; enums cerrados; configuración sin claves desconocidas; SLS ≤ SP ≤ SHS;
SLS ≤ SPH ≤ SP ≤ SPE ≤ SHS; FLF ≤ FFL; diferencial ≥0.
Temporizadores negativos=segundos o minutos según familia; oF desactiva.
Fronteras y límites documentados en catálogo. No aceptar objetos como valores numéricos.

## Errores y recuperación
INVALID_COMMAND/INVALID_PARAMETER: ningún cambio. DEFROST_BLOCKED: explicar causa.
STORAGE_UNAVAILABLE/CORRUPT_STORAGE: aviso visible y continuar en memoria.
SHUTDOWN: rechazar comandos después de cerrar módulo. Fallos de sonda: alarma y rt1/rt2.

## UX y accesibilidad
Estados listos, pausa, marcha, standby y error visible. Etiquetas reales, foco de teclado,
diálogo con Escape, avisos aria-live; métricas textuales acompañan el gráfico.

## Pruebas
Histéresis exacta, segundos negativos, standby, fin de ciclo, fallos, protecciones,
importación atómica, equivalencia avanzar 60 vs 60×1, trazas de retos y ciclo de vida.

## Decisiones
Modelo térmico de referencia con unidades SI; temperatura interna siempre °C.
iuP cambia presentación; ajustes térmicos de la mesa se expresan siempre °C para evitar ambigüedad.
RTC cL, optimización dinámica ddd y automatismo C3 se catalogan como no reproducidos;
se rechazan al activarlos hasta disponer de modelo y banco específico.
