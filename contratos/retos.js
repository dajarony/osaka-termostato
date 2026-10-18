/* SUME DOCBLOCK
Nombre: retos | Tipo: Contrato
Entradas: catálogo del repositorio original 0c3f30d.
Acciones: declarar contenido educativo.
Salidas: datos estáticos independientes del motor.
*/
export const lessons = [
  {
    "id": "consigna",
    "level": "1 · Fundamentos",
    "title": "Arranque a 19 °C, parada a 15 °C",
    "desc": "Ajusta la consigna y la histéresis; demuestra un ciclo completo usando Pr1.",
    "setup": {
      "p": {
        "SP": 12,
        "rd": 2,
        "rHC": "C",
        "ddi": "oF"
      },
      "t": {
        "pr1": 13
      }
    },
    "hint": "Busca SP (consigna) y rd (diferencial). En frío, arranque = SP + rd y parada = SP. Mueve Pr1 a 19 °C y después a 15 °C.",
    "goals": [
      "SP = 15 °C",
      "rd = 4 °C",
      "El compresor arranca a 19 °C",
      "Después se detiene a 15 °C"
    ]
  },
  {
    "id": "frio",
    "level": "1 · Fundamentos",
    "title": "Otra consigna: 7 → 5 °C",
    "desc": "Adapta el equipo a otra cámara, sin usar los valores del ejercicio anterior.",
    "setup": {
      "p": {
        "SP": 15,
        "rd": 4,
        "ddi": "oF"
      },
      "t": {
        "pr1": 6
      }
    },
    "hint": "Si quieres que arranque a 7 y pare a 5, diferencia 2 °C. Ajusta SP=5 y rd=2. Haz Pr1=7 y luego Pr1=5.",
    "goals": [
      "SP = 5 °C",
      "rd = 2 °C",
      "Arranque de compresor observado",
      "Parada de compresor observada"
    ]
  },
  {
    "id": "sondas",
    "level": "1 · Fundamentos",
    "title": "Encontrar Pr2 en la pantalla",
    "desc": "Identifica cuál sonda lee el evaporador y cambia la lectura que se muestra.",
    "setup": {
      "p": {
        "idS": "P1",
        "iP2": "EP"
      },
      "t": {
        "pr2": 13
      }
    },
    "hint": "iP2 indica para qué se utiliza la sonda. idS elige qué temperatura se muestra en la pantalla. Mueve el deslizador Pr2 a 17 °C.",
    "goals": [
      "Pr2 está configurada como EP",
      "Mostrar Pr2: idS = P2",
      "Cambiar la lectura de Pr2 a 17 °C"
    ]
  },
  {
    "id": "manual_temp",
    "level": "2 · Desescarche",
    "title": "Desescarche por temperatura",
    "desc": "Con agua simulada a 13 °C, inicia un desescarche y acaba por temperatura, no por tiempo.",
    "setup": {
      "p": {
        "dtS": 10,
        "dtE": 8,
        "dPE": "oF",
        "dde": 10,
        "ddi": "oF"
      },
      "t": {
        "pr2": 13,
        "pr1": 16
      }
    },
    "hint": "Usa dtS=15, dtE=17 y dPE=EP. Pulsa «Iniciar desescarche manual» cuando Pr2 esté a 13; después mueve Pr2 a 17.",
    "goals": [
      "Permitir inicio: dtS = 15 °C",
      "Final: dtE = 17 °C",
      "Finalización por sonda: dPE = EP",
      "Inicio registrado",
      "Fin por temperatura de Pr2"
    ]
  },
  {
    "id": "manual_time",
    "level": "2 · Desescarche",
    "title": "Desescarche de 2 minutos",
    "desc": "Haz que el desescarche termine por tiempo aunque Pr2 no se caliente.",
    "setup": {
      "p": {
        "dPE": "EP",
        "dde": 10,
        "ddi": "oF",
        "dtS": 15,
        "dtE": 17
      },
      "t": {
        "pr2": 13
      }
    },
    "hint": "Pon dPE=oF y dde=2. Con Pr2 a 13, inicia el desescarche y pulsa dos veces «Avanzar 1 minuto».",
    "goals": [
      "dPE = oF (solo tiempo)",
      "dde = 2 minutos",
      "Inicio registrado",
      "Fin por tiempo registrado"
    ]
  },
  {
    "id": "auto",
    "level": "2 · Desescarche",
    "title": "Desescarche automático cada 5 min",
    "desc": "El reloj debe arrancar por sí mismo un desescarche transcurrido el primer intervalo.",
    "setup": {
      "p": {
        "ddi": 6,
        "dSd": 6,
        "ddC": "rt",
        "dde": 2,
        "dPE": "oF",
        "dtS": 15
      },
      "t": {
        "pr2": 13
      }
    },
    "hint": "En ddi/dSd, un valor negativo indica minutos; positivo, horas. Programa -5 en ambos y pulsa cinco veces «Avanzar 1 minuto».",
    "goals": [
      "ddC = rt",
      "ddi = -5 (5 minutos)",
      "dSd = -5 (primer ciclo)",
      "El tiempo inició un desescarche automático"
    ]
  },
  {
    "id": "bloqueo",
    "level": "2 · Desescarche",
    "title": "Por qué el desescarche no empieza",
    "desc": "Aprende a identificar que la sonda está demasiado caliente para el umbral configurado.",
    "setup": {
      "p": {
        "dtS": 10,
        "dPE": "EP",
        "dtE": 17,
        "ddi": "oF"
      },
      "t": {
        "pr2": 13
      }
    },
    "hint": "Primero intenta el desescarche sin cambiar nada: debe quedar bloqueado. Luego sube dtS a 15 y vuelve a intentarlo.",
    "goals": [
      "Intento denegado con 13 > 10 °C",
      "Ajustar dtS = 15 °C",
      "Después consigue iniciar el desescarche"
    ]
  },
  {
    "id": "fan",
    "level": "3 · Ventiladores",
    "title": "Ventilador bloqueado por temperatura",
    "desc": "Una sonda de evaporador demasiado caliente impide la salida del ventilador.",
    "setup": {
      "p": {
        "FFL": 10,
        "FLF": -25,
        "oo3": "Fn",
        "FFE": "oF",
        "ddi": "oF"
      },
      "t": {
        "pr1": 20,
        "pr2": 13
      }
    },
    "hint": "Si Pr2 marca 13 y FFL es 10, el ventilador está bloqueado. Cambia FFL a 25 °C sin tocar Pr2 y comprueba el indicador FAN.",
    "goals": [
      "Asignar oo3 = Fn",
      "Subir FFL a 25 °C",
      "Salida del ventilador activada"
    ]
  },
  {
    "id": "fan_def",
    "level": "3 · Ventiladores",
    "title": "Ventilador durante el desescarche",
    "desc": "Comprueba su parada y luego su funcionamiento cuando se autoriza durante el ciclo.",
    "setup": {
      "p": {
        "FFL": 25,
        "oo3": "Fn",
        "FFE": "oF",
        "dPE": "oF",
        "dde": 10,
        "ddi": "oF",
        "dtS": 15
      },
      "t": {
        "pr1": 20,
        "pr2": 13
      }
    },
    "hint": "Antes de iniciar, asegúrate de que FAN estaba encendido. Con FFE=oF se parará al iniciar desescarche. Cambia FFE=on durante el ciclo y observarás la diferencia.",
    "goals": [
      "Iniciar desescarche",
      "Ventilador parado durante el desescarche",
      "Configurar FFE = on",
      "Ventilador activado en desescarche"
    ]
  },
  {
    "id": "goteo",
    "level": "4 · Protecciones",
    "title": "Goteo después del desescarche",
    "desc": "Evita que el compresor se reactive durante dos minutos después del ciclo.",
    "setup": {
      "p": {
        "dtd": "oF",
        "dPE": "oF",
        "dde": 1,
        "ddi": "oF",
        "dtS": 15,
        "PP2": "oF"
      },
      "t": {
        "pr1": 20,
        "pr2": 13
      }
    },
    "hint": "Pon dtd=2. Inicia desescarche, avanza 1 minuto; ha terminado, pero el compresor seguirá bloqueado. Avanza otros 2 minutos.",
    "goals": [
      "dtd = 2 minutos",
      "Finalizar un desescarche",
      "Compresor retenido por goteo",
      "Compresor vuelve a arrancar después"
    ]
  },
  {
    "id": "pp2",
    "level": "4 · Protecciones",
    "title": "Anticiclos: tiempo mínimo de paro",
    "desc": "Impide un rearranque inmediato para proteger el compresor.",
    "setup": {
      "p": {
        "PP2": "oF",
        "ddi": "oF",
        "SP": 15,
        "rd": 4
      },
      "t": {
        "pr1": 20
      }
    },
    "hint": "Pon PP2=2 mientras el compresor está encendido. Baja Pr1 a 15 para pararlo. Sube a 19: espera 2 minutos simulados para que vuelva a arrancar.",
    "goals": [
      "PP2 = 2 minutos",
      "Parar el compresor a 15 °C",
      "Rearranque temporalmente bloqueado",
      "Se permite arrancar pasados 2 min"
    ]
  },
  {
    "id": "fault",
    "level": "5 · Diagnóstico",
    "title": "Diagnóstico de avería Pr2",
    "desc": "Diferencia una alarma de la sonda del evaporador de una falta de frío.",
    "setup": {
      "p": {
        "idS": "P1",
        "iP2": "EP",
        "ddi": "oF"
      }
    },
    "hint": "Pon idS=P2, pulsa «Avería Pr2» y observa -E2. Pulsa de nuevo para resolverla. Es una avería simulada, no una medición física.",
    "goals": [
      "Ver Pr2: idS = P2",
      "Provocar E2 (sonda averiada)",
      "Reparar la avería"
    ]
  },
  {
    "id": "alarma",
    "level": "5 · Diagnóstico",
    "title": "Alarma de temperatura alta",
    "desc": "Provoca un aviso Hi por superar el límite absoluto de cámara.",
    "setup": {
      "p": {
        "AAy": "oF",
        "AHA": 35,
        "ddi": "oF"
      },
      "t": {
        "pr1": 20
      }
    },
    "hint": "Configura AAy=1 y AHA=25. Sube Pr1 a 27 °C y luego bájala a 20 °C. Simplificado: sin temporizaciones ni histéresis adicional.",
    "goals": [
      "AAy = 1 (alarma absoluta Pr1)",
      "AHA = 25 °C",
      "Aviso Hi detectado",
      "La alarma desaparece al enfriar"
    ]
  },
  {
    "id": "door",
    "level": "5 · Diagnóstico",
    "title": "Entrada digital: puerta abierta",
    "desc": "Comprueba el estado oP y el bloqueo didáctico de ventilador con puerta abierta.",
    "setup": {
      "p": {
        "iP3": "Au",
        "iFi": 0,
        "oo3": "Fn",
        "FFL": 25,
        "ddi": "oF"
      },
      "t": {
        "pr1": 20,
        "pr2": 13
      }
    },
    "hint": "Pon iP3=dG y iFi=2. Pulsa «Abrir puerta» y fíjate en oP y FAN; después cierra la puerta. Es una simulación simplificada.",
    "goals": [
      "Asignar Pr3 como entrada digital (dG)",
      "Configurar iFi = 2 (puerta y ventilador)",
      "Simular puerta abierta",
      "Simular puerta cerrada"
    ]
  }
];
