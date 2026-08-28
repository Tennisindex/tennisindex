// ============================================================
// TennisIndex — Contenido del quiz (Español)
// ============================================================
// Misma estructura que de.ts (mismos IDs de pregunta, difficulty,
// correctOptionId, relatedGuideSlugs), solo cambia el texto — ver
// quiz-data.test.ts para las comprobaciones de paridad que este
// archivo debe cumplir.

import type { QuizDifficulty, QuizQuestion, QuizResultTier } from '../../quiz';

export const QUIZ_DIFFICULTIES_ES: QuizDifficulty[] = [
	{
		slug: 'anfaenger',
		label: 'Principiante',
		description: 'Reglas básicas, puntuación, saque, equipamiento y situaciones de juego sencillas.',
		color: '#8BC53F',
		metaTitle: '¿Conoces las reglas más importantes del tenis?',
		metaDescription:
			'Pon a prueba tus conocimientos sobre las reglas del tenis, el saque, la puntuación, el equipamiento y situaciones de juego sencillas.',
		recommendedGuideSlugs: ['tennis-regeln', 'tennis-fuer-anfaenger', 'tennis-ausruestung']
	},
	{
		slug: 'fortgeschritten',
		label: 'Intermedio',
		description:
			'Decisiones tácticas, variantes de saque, volea, juego de red y comunicación en dobles.',
		color: '#4C7A1F',
		metaTitle: 'Quiz de tenis para nivel intermedio: técnica, táctica y situaciones de juego',
		metaDescription:
			'Pon a prueba tus conocimientos de tenis sobre saque, volea, táctica de dobles, posicionamiento y elección de golpe.',
		recommendedGuideSlugs: ['tennis-technik', 'tennis-taktik', 'tennis-doppel']
	},
	{
		slug: 'experte',
		label: 'Experto',
		description:
			'Casos de reglas complejos, estrategia de partido, elección de golpe bajo presión, ángulos, ritmo y riesgo.',
		color: '#0F1F13',
		metaTitle: 'Quiz de tenis para expertos: táctica, estrategia y situaciones de juego complejas',
		metaDescription:
			'El quiz de tenis difícil para jugadores con experiencia: estrategia de partido, elección de golpe, riesgo y decisiones tácticas.',
		recommendedGuideSlugs: ['tennis-taktik', 'tennis-training', 'tennis-doppel']
	}
];

export const QUIZ_RESULT_TIERS_ES: QuizResultTier[] = [
	{
		minPercentage: 0,
		maxPercentage: 39,
		title: 'Todavía hay margen de mejora',
		text: 'Aún no dominas del todo lo básico. Empieza por las reglas más importantes y las situaciones de juego sencillas.'
	},
	{
		minPercentage: 40,
		maxPercentage: 69,
		title: 'Base sólida',
		text: 'Ya tienes una buena base. Con algo más de conocimiento de reglas y táctica ganarás confianza rápidamente.'
	},
	{
		minPercentage: 70,
		maxPercentage: 89,
		title: 'Buen conocimiento del tenis',
		text: 'Ya entiendes bien muchas situaciones importantes. Ahora merece la pena dar el siguiente paso en técnica y táctica de partido.'
	},
	{
		minPercentage: 90,
		maxPercentage: 100,
		title: 'Experto en tenis',
		text: '¡Muy bien! Conoces muy bien las reglas, la táctica y las situaciones de juego.'
	}
];

export const QUIZ_QUESTIONS_ES: QuizQuestion[] = [
	// ------------------------------------------------------------
	// PRINCIPIANTE
	// ------------------------------------------------------------
	{
		id: 'anfaenger-1',
		difficulty: 'anfaenger',
		question: '¿Qué es principalmente el tenis?',
		options: [
			{ id: 'A', text: 'Un deporte de raqueta que se juega en individuales o en dobles' },
			{ id: 'B', text: 'Una variante del squash sin red' },
			{ id: 'C', text: 'Puro entrenamiento físico sin ningún tipo de puntuación' },
			{ id: 'D', text: 'Un deporte de equipo con seis jugadores por lado' }
		],
		correctOptionId: 'A',
		explanation:
			'El tenis es un deporte de raqueta que se juega tanto en individuales (1 contra 1) como en dobles (2 contra 2).',
		relatedGuideSlugs: ['tennis-regeln']
	},
	{
		id: 'anfaenger-2',
		difficulty: 'anfaenger',
		question: '¿Cómo se cuenta normalmente un juego en tenis?',
		options: [
			{ id: 'A', text: '1, 2, 3, 4' },
			{ id: 'B', text: '0, 1, 2, 3' },
			{ id: 'C', text: '15, 30, 40, juego' },
			{ id: 'D', text: 'Cada peloteo cuenta como un set' }
		],
		correctOptionId: 'C',
		explanation: 'Dentro de un juego se cuenta 15, 30, 40 y juego.',
		relatedGuideSlugs: ['tennis-regeln']
	},
	{
		id: 'anfaenger-3',
		difficulty: 'anfaenger',
		question: '¿Cómo debe ejecutarse el saque en tenis?',
		options: [
			{ id: 'A', text: 'Por arriba: la pelota se lanza hacia arriba y se golpea antes de que bote' },
			{ id: 'B', text: 'Por abajo, después de que la pelota haya botado una vez en el suelo' },
			{ id: 'C', text: 'Directamente del aire como una volea, sin lanzamiento previo' },
			{ id: 'D', text: 'Siempre con las dos manos a la vez' }
		],
		correctOptionId: 'A',
		explanation:
			'El saque se golpea por arriba: lanzas la pelota hacia arriba y la golpeas antes de que toque el suelo.',
		relatedGuideSlugs: ['tennis-regeln']
	},
	{
		id: 'anfaenger-4',
		difficulty: 'anfaenger',
		question: '¿Cuenta como fuera una pelota que bota justo sobre la línea?',
		options: [
			{ id: 'A', text: 'Sí, la línea ya no forma parte de la pista' },
			{ id: 'B', text: 'No, cuenta como buena mientras toque la línea' },
			{ id: 'C', text: 'Solo en el saque la línea cuenta como fuera' },
			{ id: 'D', text: 'Eso lo decide únicamente el árbitro a su criterio' }
		],
		correctOptionId: 'B',
		explanation:
			'Si la pelota toca cualquier parte de la línea, se considera buena. Solo está fuera cuando bota completamente fuera de todas las líneas.',
		relatedGuideSlugs: ['tennis-regeln']
	},
	{
		id: 'anfaenger-5',
		difficulty: 'anfaenger',
		question: '¿Cuántos jugadores hay en pista en un partido de dobles de tenis?',
		options: [
			{ id: 'A', text: '2' },
			{ id: 'B', text: '3' },
			{ id: 'C', text: '4' },
			{ id: 'D', text: '6' }
		],
		correctOptionId: 'C',
		explanation: 'En dobles se enfrentan dos equipos de dos jugadores cada uno, es decir, cuatro en total.',
		relatedGuideSlugs: ['tennis-doppel']
	},
	{
		id: 'anfaenger-6',
		difficulty: 'anfaenger',
		question: '¿Qué es un globo (lob)?',
		options: [
			{ id: 'A', text: 'Una pelota corta golpeada justo detrás de la red' },
			{ id: 'B', text: 'Una pelota alta que pasa por encima de un rival' },
			{ id: 'C', text: 'Una falta de saque' },
			{ id: 'D', text: 'Un segundo intento de saque' }
		],
		correctOptionId: 'B',
		explanation: 'Un globo es una pelota alta pensada para pasar por encima de un jugador situado en la red.',
		relatedGuideSlugs: ['tennis-begriffe', 'tennis-technik']
	},
	{
		id: 'anfaenger-7',
		difficulty: 'anfaenger',
		question: '¿Qué ocurre si la pelota bota dos veces antes de ser devuelta?',
		options: [
			{ id: 'A', text: 'El peloteo simplemente continúa con normalidad' },
			{ id: 'B', text: 'El punto termina y el otro lado se lleva el punto' },
			{ id: 'C', text: 'El punto siempre se repite' },
			{ id: 'D', text: 'Ambos lados reciben medio punto cada uno' }
		],
		correctOptionId: 'B',
		explanation:
			'La pelota solo puede botar una vez antes de ser devuelta. Con el segundo bote, el punto termina.',
		relatedGuideSlugs: ['tennis-regeln']
	},
	{
		id: 'anfaenger-8',
		difficulty: 'anfaenger',
		question: '¿Qué es especialmente importante para principiantes?',
		options: [
			{ id: 'A', text: 'Golpear siempre con la máxima fuerza posible' },
			{ id: 'B', text: 'Jugar cada pelota como un smash' },
			{ id: 'C', text: 'Mantener la pelota en juego de forma controlada' },
			{ id: 'D', text: 'No hablar nunca con tu pareja' }
		],
		correctOptionId: 'C',
		explanation:
			'El control y la constancia importan más para principiantes que la pura fuerza de golpeo.',
		relatedGuideSlugs: ['tennis-fuer-anfaenger']
	},
	{
		id: 'anfaenger-9',
		difficulty: 'anfaenger',
		question: '¿Qué equipamiento mínimo se necesita para empezar?',
		options: [
			{ id: 'A', text: 'Una raqueta de tenis, zapatillas adecuadas y pelotas' },
			{ id: 'B', text: 'Una raqueta de tenis y botas de fútbol' },
			{ id: 'C', text: 'Una raqueta de squash y un casco' },
			{ id: 'D', text: 'Solo guantes' }
		],
		correctOptionId: 'A',
		explanation: 'Para jugar al tenis hace falta una raqueta de tenis, zapatillas adecuadas y pelotas de tenis.',
		relatedGuideSlugs: ['tennis-ausruestung']
	},
	{
		id: 'anfaenger-10',
		difficulty: 'anfaenger',
		question: '¿Cuál es un error habitual de principiantes?',
		options: [
			{ id: 'A', text: 'Comunicarse demasiado con la pareja' },
			{ id: 'B', text: 'Jugar de forma demasiado controlada' },
			{ id: 'C', text: 'Volver al centro de la pista después del propio golpe' },
			{ id: 'D', text: 'Intentar golpear siempre cada pelota con la máxima fuerza' }
		],
		correctOptionId: 'D',
		explanation:
			'Muchos principiantes intentan golpear fuerte con demasiada frecuencia. En tenis, la colocación, la paciencia y el control suelen importar más.',
		relatedGuideSlugs: ['tennis-fuer-anfaenger', 'tennis-taktik']
	},

	// ------------------------------------------------------------
	// INTERMEDIO
	// ------------------------------------------------------------
	{
		id: 'fortgeschritten-1',
		difficulty: 'fortgeschritten',
		question: '¿Por qué es táctimente importante el globo en tenis?',
		options: [
			{ id: 'A', text: 'Porque termina automáticamente el punto' },
			{ id: 'B', text: 'Porque ayuda a echar hacia atrás a un jugador situado en la red' },
			{ id: 'C', text: 'Porque cuenta doble' },
			{ id: 'D', text: 'Porque solo lo pueden jugar los profesionales' }
		],
		correctOptionId: 'B',
		explanation:
			'Con un buen globo se puede echar hacia atrás a los rivales que están en la red y ocupar tú una mejor posición.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'fortgeschritten-2',
		difficulty: 'fortgeschritten',
		question: '¿Cuál es el objetivo principal de un golpe de slice?',
		options: [
			{ id: 'A', text: 'Ganar siempre el punto de inmediato' },
			{ id: 'B', text: 'Hacer que la pelota vuele más plana y bote más baja' },
			{ id: 'C', text: 'Golpear la pelota fuera a propósito' },
			{ id: 'D', text: 'Sustituir por completo el saque' }
		],
		correctOptionId: 'B',
		explanation:
			'El slice se golpea con efecto cortado: la pelota vuela más plana y bota más baja tras el impacto.',
		relatedGuideSlugs: ['tennis-technik']
	},
	{
		id: 'fortgeschritten-3',
		difficulty: 'fortgeschritten',
		question: '¿Cuándo es especialmente útil una volea?',
		options: [
			{ id: 'A', text: 'Cuando estás en la red y puedes tomar la pelota pronto' },
			{ id: 'B', text: 'Cuando la pelota está muy por detrás de tu propia línea de fondo' },
			{ id: 'C', text: 'Solo justo después de tu propio saque' },
			{ id: 'D', text: 'Nunca, las voleas no están permitidas en tenis' }
		],
		correctOptionId: 'A',
		explanation:
			'Las voleas se juegan normalmente en la red, para tomar la pelota pronto y generar presión.',
		relatedGuideSlugs: ['tennis-technik']
	},
	{
		id: 'fortgeschritten-4',
		difficulty: 'fortgeschritten',
		question: '¿Qué posición suele ser ventajosa en tenis para generar presión?',
		options: [
			{ id: 'A', text: 'Ambos jugadores permanentemente muy atrás, en la línea de fondo' },
			{ id: 'B', text: 'Una posición controlada en la red' },
			{ id: 'C', text: 'De pie fuera del límite de la pista' },
			{ id: 'D', text: 'De pie justo sobre la línea de saque' }
		],
		correctOptionId: 'B',
		explanation:
			'La red suele ser una posición fuerte en tenis, porque desde ahí se reduce el tiempo de reacción del rival.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'fortgeschritten-5',
		difficulty: 'fortgeschritten',
		question: '¿Qué es importante en la comunicación en dobles?',
		options: [
			{ id: 'A', text: 'Hablar lo menos posible' },
			{ id: 'B', text: 'Hablar solo después del partido' },
			{ id: 'C', text: 'Avisos claros como "mía", "fuera" o "globo"' },
			{ id: 'D', text: 'Confundir a la pareja durante el peloteo' }
		],
		correctOptionId: 'C',
		explanation: 'Los avisos cortos y claros ayudan a evitar malentendidos y pelotas sin jugar.',
		relatedGuideSlugs: ['tennis-doppel']
	},
	{
		id: 'fortgeschritten-6',
		difficulty: 'fortgeschritten',
		question: '¿Qué es una dejada (drop shot)?',
		options: [
			{ id: 'A', text: 'Un saque muy fuerte' },
			{ id: 'B', text: 'Una pelota corta y suave que cae justo detrás de la red' },
			{ id: 'C', text: 'Una pelota golpeada a propósito a la red' },
			{ id: 'D', text: 'Un saque que debe repetirse' }
		],
		correctOptionId: 'B',
		explanation:
			'Una dejada es una pelota corta y suave que cae justo detrás de la red, obligando a quien está muy atrás a esprintar hacia adelante.',
		relatedGuideSlugs: ['tennis-begriffe', 'tennis-taktik']
	},
	{
		id: 'fortgeschritten-7',
		difficulty: 'fortgeschritten',
		question: '¿Por qué merece especialmente la pena practicar el saque de forma deliberada?',
		options: [
			{ id: 'A', text: 'Porque es el único golpe que controlas por completo tú mismo' },
			{ id: 'B', text: 'Porque no cuenta en dobles' },
			{ id: 'C', text: 'Porque siempre se golpea por abajo' },
			{ id: 'D', text: 'Porque nunca puede repetirse' }
		],
		correctOptionId: 'A',
		explanation:
			'A diferencia de cualquier otro golpe, en el saque controlas por completo el lanzamiento y el tiempo — por eso merece la pena practicarlo de forma deliberada.',
		relatedGuideSlugs: ['tennis-technik']
	},
	{
		id: 'fortgeschritten-8',
		difficulty: 'fortgeschritten',
		question: '¿Qué es un error táctico en la red durante un dobles?',
		options: [
			{ id: 'A', text: 'Tomar la pelota pronto' },
			{ id: 'B', text: 'Poner presión al rival' },
			{ id: 'C', text: 'Dejar demasiado hueco entre los compañeros' },
			{ id: 'D', text: 'Colocar la pelota con control' }
		],
		correctOptionId: 'C',
		explanation:
			'Los huecos grandes entre compañeros dan al rival oportunidades de ataque fáciles.',
		relatedGuideSlugs: ['tennis-doppel']
	},
	{
		id: 'fortgeschritten-9',
		difficulty: 'fortgeschritten',
		question: '¿Por qué no conviene rematar con toda la fuerza cada pelota alta?',
		options: [
			{ id: 'A', text: 'Porque los remates nunca están permitidos en tenis' },
			{ id: 'B', text: 'Porque un mal remate puede darle al rival una buena oportunidad de contraataque' },
			{ id: 'C', text: 'Porque las pelotas altas cuentan automáticamente como fuera' },
			{ id: 'D', text: 'Porque eso siempre obliga a repetir el punto' }
		],
		correctOptionId: 'B',
		explanation:
			'Un remate mal colocado o demasiado flojo se puede defender o contrarrestar con facilidad.',
		relatedGuideSlugs: ['tennis-technik', 'tennis-taktik']
	},
	{
		id: 'fortgeschritten-10',
		difficulty: 'fortgeschritten',
		question: '¿Qué es especialmente importante en el resto?',
		options: [
			{ id: 'A', text: 'Golpear con la máxima fuerza de inmediato' },
			{ id: 'B', text: 'Poner la pelota en juego de forma segura y colocarla profunda' },
			{ id: 'C', text: 'Correr lo más cerca posible de la red antes de que llegue la pelota' },
			{ id: 'D', text: 'Golpear a la red a propósito' }
		],
		correctOptionId: 'B',
		explanation:
			'Un resto seguro y profundo evita ataques fáciles del equipo que saca.',
		relatedGuideSlugs: ['tennis-taktik']
	},

	// ------------------------------------------------------------
	// EXPERTO
	// ------------------------------------------------------------
	{
		id: 'experte-1',
		difficulty: 'experte',
		question:
			'Estás en la red y el rival juega un globo muy bueno sobre tu lado de revés. ¿Cuál suele ser la mejor decisión?',
		options: [
			{ id: 'A', text: 'Esprintar hacia atrás y rematar a ciegas' },
			{ id: 'B', text: 'Devolver la pelota con control mediante un slice por encima de la cabeza o un golpe defensivo' },
			{ id: 'C', text: 'Dejar pasar la pelota a propósito' },
			{ id: 'D', text: 'Ignorar a tu pareja' }
		],
		correctOptionId: 'B',
		explanation:
			'Bajo presión, el control importa más que el riesgo. Un slice por encima de la cabeza con control o una retirada ordenada suele ser mejor que un remate forzado.',
		relatedGuideSlugs: ['tennis-taktik', 'tennis-technik']
	},
	{
		id: 'experte-2',
		difficulty: 'experte',
		question: '¿Por qué es importante el cambio de ritmo en el tenis de alto nivel?',
		options: [
			{ id: 'A', text: 'Para que el peloteo se vuelva aleatorio' },
			{ id: 'B', text: 'Para alterar el ritmo, la posición y el tiempo de reacción del rival' },
			{ id: 'C', text: 'Porque las pelotas fuertes siempre ganan automáticamente' },
			{ id: 'D', text: 'Porque las pelotas lentas están prohibidas por el reglamento' }
		],
		correctOptionId: 'B',
		explanation: 'Alternar ritmo, altura y colocación hace el juego más difícil de leer.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'experte-3',
		difficulty: 'experte',
		question: '¿Cuándo es arriesgado desde el punto de vista estratégico un remate fuerte?',
		options: [
			{ id: 'A', text: 'Cuando no está bien colocado y el rival puede devolverlo' },
			{ id: 'B', text: 'Cuando quieres ganar el punto' },
			{ id: 'C', text: 'Cuando la pelota llega alta' },
			{ id: 'D', text: 'Siempre, en el primer juego del set' }
		],
		correctOptionId: 'A',
		explanation: 'Un remate impreciso puede volver y debilitar tu propia posición.',
		relatedGuideSlugs: ['tennis-technik']
	},
	{
		id: 'experte-4',
		difficulty: 'experte',
		question:
			'¿Cuál es un objetivo útil de una pelota jugada baja y plana a los pies de un jugador situado en la red?',
		options: [
			{ id: 'A', text: 'Forzar al rival a una volea baja difícil' },
			{ id: 'B', text: 'Jugar la pelota lo más alta posible sobre toda la pista' },
			{ id: 'C', text: 'Regalar el punto directamente' },
			{ id: 'D', text: 'Sustituir tu propio saque' }
		],
		correctOptionId: 'A',
		explanation:
			'Una pelota profunda y plana a los pies obliga a una volea baja incómoda y puede ayudarte a hacerte con la red.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'experte-5',
		difficulty: 'experte',
		question: '¿Qué decisión suele ser inteligente cuando tienes presionado al rival en la red?',
		options: [
			{ id: 'A', text: 'Confiar únicamente en la máxima fuerza' },
			{ id: 'B', text: 'Abrir ángulos, jugar a los pies o buscar huecos entre los rivales' },
			{ id: 'C', text: 'Interrumpir el peloteo a propósito' },
			{ id: 'D', text: 'Jugar siempre al centro de tu propia mitad' }
		],
		correctOptionId: 'B',
		explanation:
			'En la red, la colocación, los ángulos y la presión sobre los pies suelen ser más efectivos que la pura fuerza.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'experte-6',
		difficulty: 'experte',
		question: '¿Por qué el centro entre dos rivales de dobles suele ser un buen objetivo?',
		options: [
			{ id: 'A', text: 'Porque ahí nunca hay nadie' },
			{ id: 'B', text: 'Porque la responsabilidad puede quedar poco clara y se reducen los ángulos del rival' },
			{ id: 'C', text: 'Porque ahí la pelota cuenta doble' },
			{ id: 'D', text: 'Porque solo se puede jugar hacia ahí' }
		],
		correctOptionId: 'B',
		explanation:
			'El centro puede poner a prueba la comunicación y la responsabilidad del rival, y a menudo le quita ángulo para el resto.',
		relatedGuideSlugs: ['tennis-doppel', 'tennis-taktik']
	},
	{
		id: 'experte-7',
		difficulty: 'experte',
		question:
			'Estás defendiendo profundo en un dobles y los rivales están muy cerca de la red. ¿Qué opción suele ser inteligente?',
		options: [
			{ id: 'A', text: 'Un globo controlado por encima de ambos rivales' },
			{ id: 'B', text: 'Una pelota lenta directa a tu propia red' },
			{ id: 'C', text: 'Un remate desde una defensa profunda' },
			{ id: 'D', text: 'Un slice plano sin nada de altura directo al centro' }
		],
		correctOptionId: 'A',
		explanation:
			'Un buen globo puede recuperar la red y quitar presión a la situación.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'experte-8',
		difficulty: 'experte',
		question: '¿Qué caracteriza a una buena táctica de dobles?',
		options: [
			{ id: 'A', text: 'Ambos jugadores toman decisiones de forma independiente' },
			{ id: 'B', text: 'Movimientos coordinados, roles claros y una elección de riesgo compartida' },
			{ id: 'C', text: 'Solo el jugador más fuerte juega todas las pelotas' },
			{ id: 'D', text: 'La mayor distancia posible entre los jugadores' }
		],
		correctOptionId: 'B',
		explanation:
			'Los equipos de dobles exitosos se mueven de forma coordinada y toman decisiones tácticas juntos.',
		relatedGuideSlugs: ['tennis-doppel']
	},
	{
		id: 'experte-9',
		difficulty: 'experte',
		question: '¿Cuándo puede ser más efectiva una pelota lenta que una fuerte?',
		options: [
			{
				id: 'A',
				text: 'Cuando obliga al rival a un punto de contacto incómodo o a un movimiento difícil'
			},
			{ id: 'B', text: 'Nunca' },
			{ id: 'C', text: 'Solo en el peloteo de calentamiento antes del partido' },
			{ id: 'D', text: 'Solo en bola de partido' }
		],
		correctOptionId: 'A',
		explanation:
			'Una pelota lenta y bien colocada puede romper el ritmo del rival y provocar errores.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'experte-10',
		difficulty: 'experte',
		question: '¿Qué es un signo de madurez táctica en el tenis?',
		options: [
			{ id: 'A', text: 'Jugar cada pelota con el máximo riesgo' },
			{ id: 'B', text: 'Elegir de forma consciente entre riesgo, control, colocación y posición' },
			{ id: 'C', text: 'No jugar nunca globos' },
			{ id: 'D', text: 'Querer ganar puntos solo a base de fuerza' }
		],
		correctOptionId: 'B',
		explanation: 'Los buenos jugadores eligen según la situación entre seguridad, presión y riesgo.',
		relatedGuideSlugs: ['tennis-taktik', 'tennis-training']
	}
];
