# Cámara de referencia

Hipótesis explícita aceptada por el usuario: cámara frigorífica de referencia, sin calibración de una instalación concreta.
Las reglas de termostato se contrastan con el [manual F30 V2](https://www.osakasolutions.com/hubfs/Productos/Termostatos/F30/MU_EN_F%2030_v2.pdf?hsLang=es-es).
La documentación consultada se pudo recuperar mediante el índice de búsqueda del fabricante;
la descarga directa del PDF devolvió 404 durante esta revisión. No se infieren reglas faltantes de otro modelo.

## Modelo de tres masas

Temperatura interna en °C, tiempo en segundos, potencia en W, capacidad térmica en J/K.
Cada paso de 1 s integra energía con Euler explícito. La capacidad del nodo aire incluye
la inercia efectiva de superficies ligeras del recinto: no representa únicamente la masa de aire.

| Coeficiente | Valor | Significado |
|---|---:|---|
| Capacidad aire efectiva | 18.000 J/K | Aire y superficies rápidas |
| Capacidad producto | 180.000 J/K | Carga térmica de referencia |
| Capacidad evaporador | 9.000 J/K | Metal y masa térmica equivalente |
| Conductancia pared | 8 W/K | Entrada de calor con puerta cerrada |
| Conductancia puerta | 95 W/K | Entrada de calor con puerta abierta |
| Conductancia producto | 22 W/K | Intercambio producto/aire |
| Aire/evaporador con ventilador | 100 W/K | Convección forzada |
| Aire/evaporador sin ventilador | 8 W/K | Convección natural |
| Potencia nominal frío | 1.700 W | Se reduce al enfriar el evaporador y con escarcha |
| Potencia de desescarche | 1.500 W | Resistencia o equivalente térmico de gas caliente |
| Compresor eléctrico | 650 W | Estimación de consumo, no potencia frigorífica |
| Ventilador eléctrico | 35 W | Consumo con Fn realmente asignado |

Qpared = (Tambiente − Taire) × conductancia de puerta/pared.
Qproducto = (Tproducto − Taire) × conductancia de producto.
Qevap = (Taire − Tevap) × conductancia de ventilación.
ΔTaire = (Qpared + Qproducto − Qevap + Qcalor) / Caire.
ΔTproducto = −Qproducto / Cproducto.
ΔTevap = (Qevap − Qfrío + Qdesescarche) / Cevap.

Solo los relés conectados aportan potencia. Gas caliente requiere ot y dF simultáneos;
la válvula dF sin compresor no crea energía. Consumo acumulado en Wh = suma W/3600 por segundo.
Escarcha es un indicador relativo 0..2 que reduce capacidad; no es una estimación de masa de hielo.

## Límites

No hay cálculo de presión, refrigerante, supercalentamiento, humedad absoluta ni averías mecánicas.
La aproximación explica inercia, puerta, producto, ciclos, protecciones y recuperación tras desescarche.
No certifica COP real, dimensionamiento, consumo facturable ni seguridad de hardware.
El modo manual suspende evolución física y permite medidas exactas para ECA y formación.

## Reproducibilidad

Mismo estado inicial y mismos comandos producen los mismos resultados. La UI no introduce
aleatoriedad ni usa tiempo de pared para decidir reglas. La equivalencia 60 s frente a 60×1 s
se verifica por igualdad completa del snapshot, incluidos eventos, energía y muestras.
