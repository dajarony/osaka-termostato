# Lenguaje del dominio

| Término | Definición y límites | Ejemplo |
|---|---|---|
| Demanda | Decisión de histéresis, anterior a protecciones | Pr1=19 con SP15/rd4 pide frío |
| Salida lógica | Orden permitida por protección; no equivale a cableado | PP2 puede impedir demanda |
| Relé | OUT físico simulado según oo1/oo2/oo3 | ot no asignado implica ausencia de frío físico |
| Sonda | Lectura filtrada/calibrada; distinta de temperatura física | iC1 modifica lectura, no aire |
| Evaporador EP | Función asignable a Pr2 o Pr3, una sola | Pr3 puede terminar desescarche |
| Consigna | Umbral de parada en C y H | ECO usa SPE |
| Fase | idle, defrost o drain | FFd puede seguir activo después de drain |
| Puerta | Abertura física y contacto de banco | iFi negativo invierte contacto, no la transferencia térmica |
| Tiempo simulado | Segundos enteros explícitos | advance(60) equivale a 60×advance(1) |
| Escarcha | Indicador relativo que reduce capacidad del modelo | no es masa de hielo medida |
| Reto | Fixture con acciones ordenadas posteriores al inicio | ver comp:on al cargar no supera consigna |
