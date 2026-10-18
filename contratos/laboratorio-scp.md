<!-- SUME DOCBLOCK
Nombre: laboratorio-scp | Tipo: Contrato
Entradas: CMCF y FASER.
Acciones: definir la pantalla de laboratorio.
Salidas: contrato SCP con trece secciones.
-->
# P1 · Laboratorio F30
status: Draft
route: /
version: 1.1.0

## 1. Objetivo
Operar y observar una cámara frigorífica de referencia.
## 2. Alcance
Simulación, parámetros, formación y diagnóstico. Excluye control de equipos reales.
## 3. Módulos
Sesión requerida/eager; persistencia requerida/eager con fallback; vistas requeridas/eager.
## 4. DI
bootstrap inyecta sesión, repositorio y callbacks en vistas. Sin globales de negocio.
## 5. Estados
Inicial → listo; listo en pausa/marcha; standby; diálogo; error recuperable.
## 6. Datos
Snapshot de sesión, catálogo, estado de filtros, aviso de almacenamiento y reto activo.
## 7. Componentes
Cabecera, navegación, controlador, cámara SVG, gráfica, sondas, parámetros, retos, bitácora.
En móvil: navegación inferior fija, mando de tiempo accesible y controlador antes de métricas.
Instalación y disponibilidad offline según [contrato móvil](movil-pwa.md).
## 8. Acciones
Reproducir/pausar, velocidad, +1 s/+1 min, reset, power, desescarche, modo,
puerta, sonda, avería, ambiente, editar, importar/exportar, reto/comprobar y reconocer alarma.
Todas disponibles en listo; avanzar automático únicamente en marcha; bloquear doble temporizador.
## 9. Navegación
Ruta /; pestañas Laboratorio/Parámetros/Entrenamiento/Diagnóstico conservan sesión.
## 10. Validaciones
Las de FASER. JSON máx. 100 KB, versión reconocida, validación completa previa a importar.
## 11. Errores
Aviso textual en vivo. Importación fallida mantiene configuración; diálogo inválido sigue abierto.
## 12. Resultado
Temperaturas, relés, motivos de bloqueo, fase, alarmas y tendencias sincronizados.
## 13. Pruebas
Arranque, edición inválida/válida, sondas, ciclo manual, persistencia, navegación,
teclado, móvil sin desbordamiento y cero errores de consola.
Producción offline, objetivos táctiles de 44 px, signo/oF y diálogo en horizontal.

## Decisiones y estado
2026-10-18: Draft técnico implementable bajo la solicitud explícita del sistema completo.
No se atribuye aprobación formal del contrato al usuario.
