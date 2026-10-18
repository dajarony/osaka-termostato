/* SUME DOCBLOCK
Nombre: catálogo | Tipo: Contrato
Entradas: catálogo del repositorio original 0c3f30d.
Acciones: declarar contenido educativo.
Salidas: datos estáticos independientes del motor.
*/
export const catalog = [
  {
    "code": "SLS",
    "description": "Consigna mínima permitida",
    "category": "Control",
    "id": 1
  },
  {
    "code": "SHS",
    "description": "Consigna máxima permitida",
    "category": "Control",
    "id": 2
  },
  {
    "code": "SP",
    "description": "Temperatura de consigna normal",
    "category": "Control",
    "id": 3
  },
  {
    "code": "SPE",
    "description": "Consigna del modo económico",
    "category": "Control",
    "id": 4
  },
  {
    "code": "SPH",
    "description": "Consigna Turbo / calentamiento independiente",
    "category": "Control",
    "id": 5
  },
  {
    "code": "iuP",
    "description": "Unidad °C/°F y resolución",
    "category": "Sondas",
    "id": 6
  },
  {
    "code": "iFt",
    "description": "Filtro de lectura de sondas",
    "category": "Sondas",
    "id": 7
  },
  {
    "code": "iC1",
    "description": "Calibración de Pr1",
    "category": "Sondas",
    "id": 8
  },
  {
    "code": "iC2",
    "description": "Calibración de Pr2",
    "category": "Sondas",
    "id": 9
  },
  {
    "code": "iC3",
    "description": "Calibración de Pr3",
    "category": "Sondas",
    "id": 10
  },
  {
    "code": "iCU",
    "description": "Corrección de temperatura mostrada",
    "category": "Sondas",
    "id": 11
  },
  {
    "code": "iP2",
    "description": "Función de entrada Pr2",
    "category": "Sondas",
    "id": 12
  },
  {
    "code": "iP3",
    "description": "Función de entrada Pr3",
    "category": "Sondas",
    "id": 13
  },
  {
    "code": "iFi",
    "description": "Función y lógica de entrada digital",
    "category": "Sondas",
    "id": 14
  },
  {
    "code": "iti",
    "description": "Retardo de la entrada digital",
    "category": "Sondas",
    "id": 15
  },
  {
    "code": "iEt",
    "description": "Tiempo para ECO con puerta cerrada",
    "category": "Sondas",
    "id": 16
  },
  {
    "code": "itt",
    "description": "Máximo tiempo en modo ECO",
    "category": "Sondas",
    "id": 17
  },
  {
    "code": "idS",
    "description": "Temperatura o valor mostrado",
    "category": "Sondas",
    "id": 18
  },
  {
    "code": "rd",
    "description": "Diferencial / histéresis normal",
    "category": "Control",
    "id": 19
  },
  {
    "code": "rEd",
    "description": "Diferencial de modo ECO",
    "category": "Control",
    "id": 20
  },
  {
    "code": "rHd",
    "description": "Diferencial modo Turbo / calor",
    "category": "Control",
    "id": 21
  },
  {
    "code": "rt1",
    "description": "Marcha del relé ante fallo Pr1",
    "category": "Control",
    "id": 22
  },
  {
    "code": "rt2",
    "description": "Parada del relé ante fallo Pr1",
    "category": "Control",
    "id": 23
  },
  {
    "code": "rHC",
    "description": "Modo refrigeración o calefacción",
    "category": "Control",
    "id": 24
  },
  {
    "code": "rtC",
    "description": "Duración del modo Turbo",
    "category": "Control",
    "id": 25
  },
  {
    "code": "dtE",
    "description": "Temperatura final del desescarche",
    "category": "Desescarche",
    "id": 26
  },
  {
    "code": "dtS",
    "description": "Temperatura límite para permitir inicio",
    "category": "Desescarche",
    "id": 27
  },
  {
    "code": "dtF",
    "description": "Temperatura que fuerza desescarche",
    "category": "Desescarche",
    "id": 28
  },
  {
    "code": "dSt",
    "description": "Retardo de inicio por temperatura",
    "category": "Desescarche",
    "id": 29
  },
  {
    "code": "ddL",
    "description": "Visualización bloqueada en desescarche",
    "category": "Desescarche",
    "id": 30
  },
  {
    "code": "dcd",
    "description": "Inicio tras funcionamiento continuo del compresor",
    "category": "Desescarche",
    "id": 31
  },
  {
    "code": "dde",
    "description": "Duración máxima del desescarche",
    "category": "Desescarche",
    "id": 32
  },
  {
    "code": "dtd",
    "description": "Goteo: retardo del compresor al finalizar",
    "category": "Desescarche",
    "id": 33
  },
  {
    "code": "ddt",
    "description": "Tipo de desescarche",
    "category": "Desescarche",
    "id": 34
  },
  {
    "code": "ddC",
    "description": "Método de inicio de desescarche",
    "category": "Desescarche",
    "id": 35
  },
  {
    "code": "dPE",
    "description": "Cómo termina el desescarche",
    "category": "Desescarche",
    "id": 36
  },
  {
    "code": "ddi",
    "description": "Intervalo entre desescarches",
    "category": "Desescarche",
    "id": 37
  },
  {
    "code": "dSd",
    "description": "Retardo del primer desescarche al encender",
    "category": "Desescarche",
    "id": 38
  },
  {
    "code": "ddd",
    "description": "Reducción dinámica del intervalo (%)",
    "category": "Desescarche",
    "id": 39
  },
  {
    "code": "dEi",
    "description": "Intervalo si falla la sonda del evaporador",
    "category": "Desescarche",
    "id": 40
  },
  {
    "code": "dEE",
    "description": "Duración si falla la sonda del evaporador",
    "category": "Desescarche",
    "id": 41
  },
  {
    "code": "Ftn",
    "description": "Tiempo de marcha de ventilador con compresor parado",
    "category": "Ventilador",
    "id": 42
  },
  {
    "code": "FtF",
    "description": "Tiempo de paro de ventilador con compresor parado",
    "category": "Ventilador",
    "id": 43
  },
  {
    "code": "FFL",
    "description": "Temperatura alta que bloquea ventilador",
    "category": "Ventilador",
    "id": 44
  },
  {
    "code": "FLF",
    "description": "Temperatura baja que bloquea ventilador",
    "category": "Ventilador",
    "id": 45
  },
  {
    "code": "FdF",
    "description": "Diferencial de bloqueo del ventilador",
    "category": "Ventilador",
    "id": 46
  },
  {
    "code": "FFE",
    "description": "Ventilador encendido durante desescarche",
    "category": "Ventilador",
    "id": 47
  },
  {
    "code": "FFd",
    "description": "Retardo de ventilador después del desescarche",
    "category": "Ventilador",
    "id": 48
  },
  {
    "code": "PP1",
    "description": "Retardo de activación del compresor",
    "category": "Protecciones",
    "id": 49
  },
  {
    "code": "PP2",
    "description": "Tiempo mínimo de compresor apagado",
    "category": "Protecciones",
    "id": 50
  },
  {
    "code": "PP3",
    "description": "Tiempo mínimo entre arranques",
    "category": "Protecciones",
    "id": 51
  },
  {
    "code": "Pod",
    "description": "Retardo inicial de las salidas",
    "category": "Protecciones",
    "id": 52
  },
  {
    "code": "AAy",
    "description": "Tipo de alarma de temperatura",
    "category": "Alarmas",
    "id": 53
  },
  {
    "code": "AHA",
    "description": "Alarma de temperatura alta",
    "category": "Alarmas",
    "id": 54
  },
  {
    "code": "ALA",
    "description": "Alarma de temperatura baja",
    "category": "Alarmas",
    "id": 55
  },
  {
    "code": "AAd",
    "description": "Diferencial de temperatura de alarma",
    "category": "Alarmas",
    "id": 56
  },
  {
    "code": "AAt",
    "description": "Retardo de alarma de temperatura",
    "category": "Alarmas",
    "id": 57
  },
  {
    "code": "AtA",
    "description": "Memoria de alarma",
    "category": "Alarmas",
    "id": 58
  },
  {
    "code": "APA",
    "description": "Retardo de alarma al conectar el equipo",
    "category": "Alarmas",
    "id": 59
  },
  {
    "code": "AdA",
    "description": "Retardo alarma postdesescarche / desbloqueo pantalla",
    "category": "Alarmas",
    "id": 60
  },
  {
    "code": "AoA",
    "description": "Retardo alarma de puerta abierta",
    "category": "Alarmas",
    "id": 61
  },
  {
    "code": "oo1",
    "description": "Función del relé OUT1",
    "category": "Salidas",
    "id": 62
  },
  {
    "code": "oo2",
    "description": "Función del relé OUT2",
    "category": "Salidas",
    "id": 63
  },
  {
    "code": "oo3",
    "description": "Función del relé OUT3",
    "category": "Salidas",
    "id": 64
  },
  {
    "code": "obu",
    "description": "Comportamiento del zumbador",
    "category": "Salidas",
    "id": 65
  },
  {
    "code": "oFo",
    "description": "Modo de la salida auxiliar",
    "category": "Salidas",
    "id": 66
  },
  {
    "code": "otu",
    "description": "Temporización salida auxiliar",
    "category": "Salidas",
    "id": 67
  },
  {
    "code": "tUF",
    "description": "Función de tecla superior",
    "category": "Panel",
    "id": 68
  },
  {
    "code": "tFb",
    "description": "Función de tecla inferior",
    "category": "Panel",
    "id": 69
  },
  {
    "code": "tLo",
    "description": "Bloqueo automático de teclas",
    "category": "Panel",
    "id": 70
  },
  {
    "code": "tEd",
    "description": "Consignas accesibles mediante SET",
    "category": "Panel",
    "id": 71
  },
  {
    "code": "tPP",
    "description": "Contraseña de acceso",
    "category": "Panel",
    "id": 72
  }
];
