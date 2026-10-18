# ECA · lógica interna de Osaka Lab

Fecha: 2026-10-18. Autor: Codex. Base revisada: `0c3f30d`.
Sujeto: `createSession().run(command)` y efectos de su snapshot público.
Entorno: Node 22.20.0, Windows; dominio en proceso, sin hardware ni llamadas externas.

## Oráculo y alcance

`contratos/oraculo.json` declara doce invariantes antes de medir el nuevo motor.
Son reglas de manual y **hipótesis explícitas de implementación**, no un contrato firmado
por el fabricante o por el usuario. Las regresiones adicionales mantienen su expectativa
durante la comparación rojo/verde. El banco no reescribe el oráculo al ejecutar.

El implementador también ha escrito el banco: esta es una evaluación reproducible de la
puerta pública con diagnóstico profundo, **no una auditoría independiente a ciegas**.
El oráculo y el banco se versionan junto al sistema, no están fuera del alcance de escritura
del agente. Esa limitación de independencia se conserva explícita.

Inventario: configurar, avanzar, sondas, averías, puerta, energía lógica, modos, física,
ambiente, desescarche, reconocimiento, auxiliar, reset, retos y evaluación; init/health/shutdown.
No hay autenticación ni efectos de hardware que autorizar. La contraseña tPP es un ejercicio
de panel local, no una frontera de seguridad del navegador.

## Recorrido ejecutado

1. Puerta: comandos válidos, opciones iniciales inválidas, cierre y snapshots aislados.
2. Normales: frío/calor, sondas, alarmas, modos y los 14 retos de extremo a extremo.
3. Límites: SP, SP+rd, dtS, dtE; 9/10 segundos, 119/120 segundos; umbral de alarma.
4. Inyección: null, arrays, claves desconocidas, NaN, infinito, tipos erróneos,
   temporizadores inválidos, JSON roto/grande y almacenamiento denegado.
5. Invariantes: standby, protecciones, relé físico, energía, fin de ciclos y atomicidad.
6. Consistencia: avance 60 frente a 60×1 compara el estado completo.
7. Resistencia: ocho horas simuladas; temperaturas finitas, eventos y muestras acotados.
8. Número: `npm test` → **84/84**, cero fallidos; dentro de ese total,
   `tests/eca/` aporta **70 casos** (50 controlador, 15 aprendizaje, 5 regresiones).
   Las pruebas de almacenamiento, ciclo de vida y teclado completan los otros 14 casos.

## Hallazgos reproducidos y corregidos

| ID | Gravedad / promesa | Estado e entrada | Antes | Después |
|---|---|---|---|---|
| ECA-01 | Calidad: selección Normal/ECO | iP3=dG, iFi=6; abrir y cerrar contacto | Permanecía ECO tras liberar | Vuelve a normal |
| ECA-02 | Cobertura funcional digital | iFi=9/10, iti=-3 | Configuración rechazada por rango ±8 | Inicio/fin por flanco a los 3 s |
| ECA-03 | Invariante de terminación | Sin EP, dPE=EP, dde=oF; iniciar | Ciclo sin condición de fin | DEFROST_BLOCKED antes de iniciar |
| ECA-04 | Coherencia energética | oo1=oF, oo3=oF, ddt=in; iniciar y avanzar 60 s | Válvula aportaba 1500 W sin compresor | Solo intercambio pasivo |
| ECA-05 | Disponibilidad de la puerta | createSession(null) y progreso malformado | TypeError de inicialización | Result INVALID_SESSION |

Comando de reproducción común: `node --test tests/eca/regressions.test.js`.
Resultado antes: **0/5**. Después de corregir producción sin cambiar expectativas: **5/5**.
La suite completa posterior da **84/84**. Causas confirmadas: transición de modo ausente,
rango de catálogo incompleto, guardia de fin incompleta, potencia no condicionada al relé ot
y acceso a opciones antes de validar su tipo.

Además, los tests UI detectaron un nombre accesible contaminado por iconos de pestaña.
Se corrigió marcando esos iconos como decorativos; los selectores siguen usando nombres de usuario.

## Frontera visual verificada por separado

`npm run test:ui` → **12/12**, seis recorridos en escritorio y los mismos seis en móvil
emulado. Verifica navegación, ancho responsive, edición inválida/válida, persistencia,
Escape, un reto completo, importación inválida, exportación/importación válida,
teclado tEd, contraseña tPP y reloj iniciar/pausar. Las capturas desktop.png y mobile.png
se inspeccionaron visualmente. Este número no se suma al banco de lógica como si fuera ECA.

## Ocho horas de cámara de referencia

Estado inicial: configuración por defecto, aire 20 °C, evaporador 13 °C, producto 15 °C,
ambiente 28 °C, puerta cerrada. Ocho comandos `advance(3600)`.

- Aire final: 4,4883 °C; evaporador: −3,5630 °C; producto: 5,3746 °C.
- Consigna: 4 °C. Arranques: 105. Energía estimada: 1,341965 kWh.
- Desescarche automático en t=21600 s, final por temperatura en t=21659 s.
- Fase final idle. Eventos ≤600; muestras ≤360.

Son cifras de un modelo de referencia, no mediciones reales ni prueba de dimensionamiento.

## Límites de cobertura

No se ha probado hardware, Safari real, red frigorífica, curva NTC ni reglas no soportadas
C3/RTC/ddd. Las reglas exactas de casos no documentados no se inventan.
Un banco verde demuestra estos escenarios; no demuestra ausencia de fallos ni fidelidad
total al firmware. Las desviaciones de producto se enumeran en COBERTURA.md.
