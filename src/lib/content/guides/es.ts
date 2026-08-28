// ============================================================
// TennisIndex — Contenido de la guía (Español)
// ============================================================
// Misma estructura que de.ts (slugs, IDs de sección, category/
// difficulty/relatedSlugs idénticos), solo cambia el texto — ver
// guides.test.ts para las comprobaciones de paridad que este archivo
// debe cumplir.

import type { GuideArticle } from '../../guides';

export const GUIDES_ES: GuideArticle[] = [
	// ------------------------------------------------------------
	// REGLAS Y CONOCIMIENTOS
	// ------------------------------------------------------------
	{
		slug: 'tennis-regeln',
		title: 'Reglas del tenis explicadas de forma sencilla: la guía completa para principiantes',
		metaTitle: 'Reglas del tenis explicadas de forma sencilla: la guía completa para principiantes',
		metaDescription:
			'Las reglas más importantes del tenis explicadas de forma sencilla: saque, puntuación, fuera, dejadas y situaciones de juego habituales.',
		excerpt:
			'Saque, puntuación y reglas de fuera: todo lo que necesitas saber antes de tu primer partido, explicado con claridad.',
		category: 'regeln',
		difficulty: 'einsteiger',
		readingTime: 9,
		updatedAt: '2026-08-01',
		popular: true,
		beginnerRecommended: true,
		relatedSlugs: ['tennis-begriffe', 'tennis-fuer-anfaenger', 'tennis-einzel-doppel', 'tennis-doppel'],
		sections: [
			{
				id: 'was-ist-tennis',
				heading: '¿Qué es el tenis?',
				paragraphs: [
					'El tenis es un deporte de raqueta que se juega tanto en individuales (1 contra 1) como en dobles (2 contra 2). Se juega en una pista rectangular dividida por una red — sobre tierra batida, pista dura o hierba.',
					'El objetivo es golpear la pelota por encima de la red para que caiga dentro del campo contrario y el rival no pueda devolverla de forma reglamentaria. A diferencia de otros deportes de raqueta, no hay paredes ni vallas que sigan en juego — la pelota está fuera en cuanto bota fuera de las líneas.',
					'Se golpea con una raqueta encordada, y la pelota es una bola de goma rellena de aire y recubierta de fieltro. Para niños y principiantes absolutos existen además pelotas de espuma y fieltro más lentas y con menos presión (etapas roja/naranja/verde antes de la pelota amarilla "normal").'
				]
			},
			{
				id: 'spielfeld-und-grundprinzip',
				heading: 'Pista y principio básico',
				paragraphs: [
					'Una pista de tenis mide 8,23 m de ancho y 23,77 m de largo en individuales. En dobles se añade a cada lado una franja adicional de 1,37 m (el "pasillo"), que no cuenta en individuales. La red está algo más alta en los postes (1,07 m) que en el centro (0,914 m).',
					'Cada lado de la pista tiene, justo detrás de la red, dos cuadros de saque (izquierda y derecha), y detrás de ellos el resto del campo para continuar el peloteo.',
					'Principio básico: tras cada golpe, la pelota debe botar dentro de las líneas del lado contrario. Después puede botar exactamente una vez antes de que el otro lado la devuelva — si bota una segunda vez, el punto termina. Golpear la pelota directamente del aire antes de que bote (una volea) está permitido en cualquier momento.'
				]
			},
			{
				id: 'zaehlweise',
				heading: 'Cómo se cuenta en el tenis',
				paragraphs: [
					'Dentro de un juego se cuenta 15, 30, 40 y juego. Con 40 iguales se dice deuce (o "iguales") — a partir de ahí, un lado debe ganar dos puntos seguidos para llevarse el juego (el primero de esos dos puntos se llama ventaja).',
					'Muchos partidos de ocio y algunos de liga juegan en su lugar el "punto decisivo" (no-ad) en el deuce: quien gane el siguiente punto se lleva el juego directamente — suele acordarse de antemano.',
					'Ganar seis juegos (con una diferencia de al menos dos) da un set. Con 6-6 suele decidir un tie-break: se cuenta 1, 2, 3, etc., y se gana con al menos 7 puntos y dos de diferencia. Un partido suele jugarse al mejor de tres sets; muchas ligas amateur juegan un tie-break de partido a 10 en lugar de un tercer set completo para ahorrar tiempo.'
				]
			},
			{
				id: 'aufschlag-regeln',
				heading: 'Reglas del saque',
				paragraphs: [
					'El saque se golpea por arriba: lanzas la pelota hacia arriba y la golpeas antes de que toque el suelo, dirigiéndola en diagonal al cuadro de saque contrario. Debes estar detrás de la línea de fondo y no puedes tocarla ni pisarla antes del golpe (falta de pie).',
					'Cada punto empieza alternando entre el lado derecho (con marcador par) y el lado izquierdo (con marcador impar). El saque cambia de lado tras cada juego, y en dobles ambos compañeros se turnan para sacar dentro de su equipo.',
					'Si el primer saque no entra, hay un segundo intento. Si ese también falla, es doble falta y el punto va directamente para el otro lado. Si el saque toca la cinta de la red y aun así entra correctamente en el cuadro, es un "let" — el saque se repite y no cuenta.'
				]
			},
			{
				id: 'aus-und-linien',
				heading: '¿Cuándo está la pelota fuera?',
				paragraphs: [
					'Una línea forma parte de la pista: si la pelota toca cualquier parte de la línea, se considera buena. Solo está fuera si bota completamente fuera de todas las líneas.',
					'Para los golpes normales, todo el ancho de la pista incluidos los pasillos solo cuenta en dobles — en individuales, los pasillos exteriores no son campo válido. Para el saque, en cambio, solo cuenta el cuadro de saque diagonal correspondiente, en ambos formatos.',
					'Si la pelota bota dos veces antes de ser devuelta, el punto también termina, sin importar dónde ocurra ese segundo bote.'
				]
			},
			{
				id: 'let-und-stoerungen',
				heading: 'Let, toques de red e interrupciones',
				paragraphs: [
					'"Let" significa que el punto no cuenta y se repite. Ocurre típicamente cuando el saque toca la cinta de la red y aun así entra correctamente en el cuadro de saque — o cuando ocurre una interrupción externa real durante el peloteo (por ejemplo, una pelota que rueda desde una pista vecina).',
					'En cambio, si una pelota toca la red durante el peloteo normal (no en el saque) y después cae de forma reglamentaria en el campo contrario, sigue en juego — eso no es un let, sino un golpe válido completamente normal.'
				]
			},
			{
				id: 'anfaengerfehler',
				heading: 'Errores típicos de principiantes',
				box: {
					kind: 'mistakes',
					title: 'Estos errores se ven en casi todos los partidos de principiantes',
					items: [
						'Pisar la línea de fondo al sacar (falta de pie), a menudo sin darse cuenta.',
						'Confundirse con el marcador, sobre todo en deuce y ventaja.',
						'Intentar jugar una pelota que ya ha botado dos veces.',
						'Golpear con toda la fuerza por nerviosismo, en lugar de jugar primero de forma segura dentro de la pista.',
						'En dobles, no acordar quién cubre la red y quién se queda atrás, dejando pelotas por el centro sin jugar.'
					]
				}
			},
			{
				id: 'checkliste',
				heading: 'Checklist rápida de reglas',
				box: {
					kind: 'checklist',
					title: 'Antes de tu primer partido',
					items: [
						'Saque por arriba, desde detrás de la línea de fondo, en diagonal hacia el cuadro correcto.',
						'La pelota solo puede botar una vez antes de ser devuelta.',
						'Puntuación: 15, 30, 40, juego — deuce en 40 iguales, luego hace falta una diferencia de dos puntos (salvo con no-ad).',
						'La línea forma parte de la pista — una pelota sobre la línea es buena, no fuera.',
						'Las voleas están permitidas en cualquier momento, mientras la pelota no haya botado y no estés dentro del campo contrario.'
					]
				}
			}
		],
		faq: [
			{
				question: '¿Es difícil aprender a jugar al tenis?',
				answer:
					'Las reglas básicas se entienden en pocos minutos, y los primeros peloteos sencillos suelen funcionar tras unas pocas clases. La constancia, el juego de piernas y la táctica, en cambio, se desarrollan durante meses — típico de un deporte con una barrera de entrada baja, pero con mucha profundidad después.'
			},
			{
				question: '¿Qué pasa en el deuce?',
				answer:
					'Con 40 iguales, un lado debe ganar dos puntos seguidos para llevarse el juego. El primero de esos dos puntos se llama ventaja — si se gana también el siguiente, el juego termina; si no, se vuelve a deuce. Algunos partidos de ocio juegan no-ad en su lugar: un único punto decisivo.'
			},
			{
				question: '¿Una pelota sobre la línea cuenta como fuera?',
				answer:
					'No, todo lo contrario: si la pelota toca la línea en cualquier punto, se considera buena. Solo está fuera cuando bota completamente fuera de todas las líneas de la pista.'
			},
			{
				question: '¿Cuántos sets se juegan normalmente?',
				answer:
					'En el ámbito amateur y de liga, normalmente al mejor de tres sets, y muchas ligas juegan un tie-break de partido a 10 en lugar de un tercer set completo para ahorrar tiempo. A nivel profesional, algunos torneos (sobre todo de individual masculino en Grand Slams) también juegan al mejor de cinco.'
			}
		]
	},
	{
		slug: 'tennis-einzel-doppel',
		title: 'Individuales vs. dobles en tenis: las diferencias más importantes',
		metaTitle: 'Individuales vs. dobles en tenis: las diferencias más importantes explicadas',
		metaDescription:
			'Qué diferencia realmente a individuales y dobles en tenis: pista, táctica, saque y qué formato te conviene más.',
		excerpt:
			'Mismo deporte, dos juegos muy distintos: así se diferencian individuales y dobles en pista, táctica y ritmo.',
		category: 'regeln',
		difficulty: 'einsteiger',
		readingTime: 6,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-regeln', 'tennis-doppel', 'tennis-taktik'],
		sections: [
			{
				id: 'ueberblick',
				heading: 'Dos formatos, un mismo deporte',
				paragraphs: [
					'Las reglas básicas — puntuación, saque, el principio de fuera — son idénticas en individuales y dobles. Aun así, ambos formatos se juegan de forma muy distinta: en individuales cubres toda la pista tú solo, en dobles compartes pista y responsabilidad con tu pareja.',
					'TennisIndex mantiene un rating independiente para cada formato — tu nivel en individuales no dice necesariamente nada sobre tu nivel en dobles, y viceversa. Muchos jugadores son claramente más fuertes en un formato que en el otro.'
				]
			},
			{
				id: 'spielfeldgroesse',
				heading: 'Tamaño de pista: con o sin pasillos',
				paragraphs: [
					'La pista en sí tiene el mismo tamaño en ambos formatos, pero en dobles los dos pasillos exteriores (1,37 m cada uno) también cuentan como campo válido — el ancho de juego es mayor en dobles. En el saque no cambia nada: el cuadro de saque es idéntico en ambos formatos.',
					'En individuales, el ancho de juego más reducido significa más carrera para ti solo, pero también una responsabilidad más clara — cada error y cada buen punto son inequívocamente tuyos.'
				]
			},
			{
				id: 'taktik-unterschiede',
				heading: 'Táctica: carrera de fondo vs. posición en la red',
				paragraphs: [
					'En individuales gira mucho en torno al juego de fondo, la resistencia y la capacidad de mover al rival por la pista — los puntos suelen construirse a lo largo de varios golpes.',
					'En dobles, en cambio, la posición en la red decide más a menudo: un equipo que llega pronto y con confianza a la red tiene más opciones de puntos cortos y contundentes. Comunicarse con tu pareja (quién juega qué pelota, quién cubre el centro) se vuelve casi tan importante como la técnica de golpeo en sí.'
				]
			},
			{
				id: 'aufschlag-unterschiede',
				heading: 'Saque y resto',
				paragraphs: [
					'En individuales sacas tú cada dos puntos y después debes defender toda la pista tú solo. En dobles, ambos compañeros se turnan para sacar dentro de un mismo juego, y quien saca suele avanzar directamente a la red tras el saque, mientras su pareja ya suele estar allí.'
				]
			},
			{
				id: 'was-passt-zu-dir',
				heading: '¿Qué te conviene más?',
				paragraphs: [
					'Si te gusta correr, los peloteos largos y jugar de forma independiente, probablemente disfrutes más de individuales. Si te gusta el juego táctico en equipo, los puntos más cortos y un juego más social, dobles suele encajar mejor — muchos jugadores simplemente practican ambos, según el día y la disponibilidad de compañeros.'
				]
			}
		],
		faq: [
			{
				question: '¿Es dobles más fácil que individuales?',
				answer:
					'No necesariamente más fácil, sino exigente de otra manera: recorres menos distancia, pero necesitas reaccionar más rápido, jugar más cerca de la red y coordinarte constantemente con tu pareja.'
			},
			{
				question: '¿Se puntúa igual en dobles que en individuales?',
				answer:
					'Sí, puntos, juegos y sets se cuentan de forma idéntica. La única diferencia estructural es que, dentro de un equipo, el saque se alterna entre ambos compañeros.'
			},
			{
				question: '¿Necesito una pareja fija para jugar dobles?',
				answer:
					'No — muchos clubes y la búsqueda de partidos de TennisIndex te ayudan a encontrar compañeros de dobles adecuados de forma espontánea. Un equipo consolidado tiene ventaja en la comunicación, pero las parejas nuevas también funcionan bien.'
			}
		]
	},
	{
		slug: 'tennis-begriffe',
		title: 'Términos de tenis explicados: ace, break, slice, volea y más',
		metaTitle: 'Términos de tenis explicados: el gran glosario para principiantes',
		metaDescription:
			'Los términos de tenis más importantes explicados de forma sencilla: ace, break, slice, volea, dejada y más.',
		excerpt:
			'Ace, break, slice, dejada — un glosario compacto de los términos de tenis más importantes para principiantes.',
		category: 'regeln',
		difficulty: 'einsteiger',
		readingTime: 5,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-regeln', 'tennis-technik', 'tennis-taktik'],
		sections: [
			{
				id: 'einleitung',
				heading: '¿Por qué un glosario?',
				paragraphs: [
					'En tu primer entrenamiento en el club o viendo un partido, aparecen rápidamente términos como ace, break o error no forzado, que sin explicación dicen poco. Este glosario reúne los más importantes en un solo lugar para que puedas consultarlos con facilidad.'
				]
			},
			{
				id: 'die-wichtigsten-begriffe',
				heading: 'Los términos más importantes de un vistazo',
				box: {
					kind: 'info',
					title: 'De la A a la V',
					items: [
						'Ace: un saque que el rival ni siquiera toca — punto directo.',
						'Break: ganar el juego de saque del rival.',
						'Deuce (iguales): marcador de 40 iguales dentro de un juego.',
						'Doble falta: fallan ambos intentos de saque — punto para el otro lado.',
						'Línea de fondo: la línea trasera de la pista, desde donde se saca.',
						'Let: el punto se repite, normalmente porque el saque tocó la cinta de la red.',
						'Globo (lob): una pelota alta que pasa por encima del rival, a menudo situado en la red.',
						'Passing shot: una pelota que pasa por el lateral a un jugador situado en la red.',
						'Resto: el primer golpe tras el saque del rival.',
						'Slice: un golpe con efecto cortado, la pelota vuela más plana y bota más baja.',
						'Dejada (dropshot): una pelota corta y suave que cae justo detrás de la red.',
						'Tie-break: desempate con marcador de 6-6 en el set, contado en puntos individuales.',
						'Topspin: un golpe con efecto liftado hacia adelante, la pelota bota más alta y rápida tras el bote.',
						'Error no forzado: un fallo evitable cometido sin presión apreciable del rival.',
						'Volea: golpear la pelota directamente del aire antes de que bote.'
					]
				}
			},
			{
				id: 'begriffe-rund-ums-match',
				heading: 'Términos relacionados con el partido',
				paragraphs: [
					'"Perder el saque" significa perder tu propio juego de saque — más habitual entre amateurs que entre profesionales, donde mantener el saque suele considerarse una clara ventaja. Una "remontada" describe superar una desventaja considerable.',
					'"Error no forzado" y "error forzado" distinguen si un fallo ocurre por sí solo (por ejemplo, golpear a la red sin presión del rival) o fue provocado por un buen golpe contrario — esta distinción no influye en tu rating de TennisIndex, donde solo se valora el resultado final.'
				]
			}
		],
		faq: [
			{
				question: '¿Cuál es la diferencia entre slice y topspin?',
				answer:
					'El slice se golpea con efecto cortado: la pelota vuela más plana y bota más baja y plana tras el impacto. El topspin se golpea con efecto liftado hacia adelante: la pelota vuela en un arco más alto y bota más alta y rápida hacia adelante tras el impacto.'
			},
			{
				question: '¿Qué significa "break"?',
				answer:
					'Un break ocurre cuando ganas el juego de saque de tu rival — es decir, ganas un juego aunque el otro lado estuviera sacando. Táctimente suele considerarse un punto especialmente valioso.'
			}
		]
	},
	// ------------------------------------------------------------
	// EQUIPAMIENTO
	// ------------------------------------------------------------
	{
		slug: 'tennis-ausruestung',
		title: 'Equipamiento de tenis: lo que realmente necesitas para empezar',
		metaTitle: 'Equipamiento de tenis para principiantes: la visión completa',
		metaDescription:
			'Raquetas, pelotas, zapatillas, ropa: el equipamiento de tenis que realmente necesitas para empezar, y lo que puede esperar.',
		excerpt:
			'Raquetas, pelotas, zapatillas y ropa: una visión honesta de lo que realmente necesitas para empezar.',
		category: 'ausruestung',
		difficulty: 'einsteiger',
		readingTime: 7,
		updatedAt: '2026-08-01',
		popular: true,
		relatedSlugs: ['tennis-schlaeger', 'tennis-schuhe', 'tennis-kosten'],
		sections: [
			{
				id: 'grundausstattung',
				heading: 'El equipamiento básico',
				paragraphs: [
					'Para tus primeras clases, en el fondo solo necesitas tres cosas: una raqueta de tenis, zapatillas de tenis adecuadas y ropa deportiva cómoda. Las pelotas suelen ponerlas el club o el entrenador en tu primer entrenamiento o clase de prueba.',
					'Todo lo demás — pelotas propias, bolsa de raqueta, grip, toalla en el poste de la red — es práctico, pero no imprescindible al principio. Mejor comprar poco y con criterio que todo el equipamiento de golpe.'
				]
			},
			{
				id: 'schlaeger',
				heading: 'Raquetas',
				paragraphs: [
					'Para empezar conviene una raqueta más ligera con una cabeza más grande — eso amplía el punto dulce y perdona más los golpes imprecisos que una raqueta de torneo pequeña y pesada. Muchos clubes prestan raquetas para las clases de prueba, así que no hace falta comprar una propia de inmediato.',
					'Los detalles para elegir raqueta (tamaño de cabeza, peso, grosor de puño) están en la guía específica de raquetas.'
				]
			},
			{
				id: 'baelle',
				heading: 'Pelotas',
				paragraphs: [
					'Las pelotas de tenis normales existen en dos versiones: "regular duty" para superficies blandas como la tierra batida, "extra duty" con fieltro más resistente para pista dura. Para niños y principiantes absolutos también hay pelotas más lentas y con menos presión (roja/naranja/verde) que facilitan el inicio.',
					'Una pelota va perdiendo presión interna y rebote con el tiempo — para un entrenamiento informal, eso suele seguir siendo suficiente durante bastante tiempo.'
				]
			},
			{
				id: 'schuhe-und-kleidung',
				heading: 'Zapatillas y ropa',
				paragraphs: [
					'Las zapatillas de correr normales no son adecuadas para el tenis: les falta la estabilidad lateral necesaria para los cambios rápidos de dirección, y su dibujo de suela a menudo no encaja con la superficie. Más detalles en la guía específica de zapatillas.',
					'En la ropa, lo que más importa es la libertad de movimiento y un tejido transpirable — en pistas de tierra batida, la ropa clara también es práctica, porque el polvo rojo se nota más sobre tejidos oscuros.'
				]
			},
			{
				id: 'kann-warten',
				heading: 'Puede esperar hasta saber si el tenis es tu deporte',
				box: {
					kind: 'tips',
					title: 'Mejor ahorrar para más adelante',
					items: [
						'Una segunda raqueta más cara — la primera es de sobra para los primeros meses.',
						'Una bolsa de raqueta con varios compartimentos.',
						'Reserva de grips y antivibradores especiales.',
						'Pelotas de torneo en botes grandes.',
						'Relojes específicos de tenis o wearables de seguimiento.'
					]
				}
			},
			{
				id: 'vor-dem-kauf',
				heading: 'Antes de tu primera compra',
				box: {
					kind: 'checklist',
					title: 'Comprobación rápida',
					items: [
						'Toma una o dos clases de prueba con raqueta prestada antes de comprar la tuya.',
						'Deja que te midan el grosor de puño en una tienda especializada, no lo adivines.',
						'Ten en cuenta la superficie principal de tu club (tierra vs. pista dura) al elegir zapatillas.',
						'Elige la ropa por libertad de movimiento, no solo por estética.'
					]
				}
			}
		],
		faq: [
			{
				question: '¿Necesito mi propia raqueta desde el principio?',
				answer:
					'No. Para tus primeras clases de prueba suele bastar con una raqueta prestada del club. Cuando quede claro que vas a seguir jugando de forma regular, merece la pena comprar la tuya con el asesoramiento adecuado.'
			},
			{
				question: '¿Sirven las zapatillas deportivas normales para jugar al tenis?',
				answer:
					'Para una única clase de prueba, en apuros, sí — pero no a largo plazo: las zapatillas de tenis ofrecen estabilidad lateral y un dibujo adaptado a la superficie que las zapatillas de correr normales no tienen, algo importante para prevenir lesiones.'
			}
		]
	},
	{
		slug: 'tennis-schlaeger',
		title: 'Raquetas de tenis para principiantes: tamaño de cabeza, peso y elección',
		metaTitle: 'Raquetas de tenis para principiantes: la guía de compra completa',
		metaDescription:
			'Tamaño de cabeza, peso, grosor de puño y encordado: cómo encontrar la raqueta de tenis adecuada como principiante.',
		excerpt:
			'Tamaño de cabeza, peso y grosor de puño explicados de forma sencilla: cómo encontrar tu primera raqueta.',
		category: 'ausruestung',
		difficulty: 'einsteiger',
		readingTime: 8,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-ausruestung', 'tennis-technik', 'tennis-kosten'],
		sections: [
			{
				id: 'kopfgroesse',
				heading: 'Tamaño de cabeza: más grande perdona más',
				paragraphs: [
					'El tamaño de la cabeza de la raqueta se mide en pulgadas cuadradas, normalmente entre unas 95 y 115. Una cabeza más grande ofrece un punto dulce más amplio y perdona mejor los golpes imprecisos — ideal para empezar.',
					'Los jugadores más experimentados suelen pasar a cabezas más pequeñas porque permiten jugar con más precisión y control una vez que la técnica está asentada. Para el primer año o dos, la opción más grande y perdonadora suele ser casi siempre la mejor.'
				]
			},
			{
				id: 'gewicht-und-balance',
				heading: 'Peso y balance',
				paragraphs: [
					'Las raquetas para principiantes suelen pesar entre 250 y 285 gramos sin encordar — lo suficientemente ligeras para usarlas durante toda una sesión sin fatigarse. Las raquetas más pesadas (a partir de unos 300 gramos) ofrecen más estabilidad y potencia en el impacto sólido, pero exigen más fuerza de brazo y una técnica limpia.',
					'El balance (con más peso en la cabeza, en el mango, o equilibrado) influye en la maniobrabilidad. Las raquetas con más peso en la cabeza dan más potencia con menos swing, las de más peso en el mango dan más control y maniobrabilidad — para empezar, un balance equilibrado o ligeramente hacia el mango suele funcionar mejor.'
				]
			},
			{
				id: 'griffstaerke',
				heading: 'Grosor de puño',
				paragraphs: [
					'El grosor de puño suele indicarse en tallas de L0 a L5 (aproximadamente entre 4 1/8 y 4 5/8 pulgadas). Un puño demasiado grueso dificulta el giro de muñeca en algunos golpes; uno demasiado fino obliga a la mano a apretar más de lo necesario — ambos favorecen la tensión con el tiempo.',
					'En una tienda especializada pueden medirte la talla adecuada rápidamente; como regla general, debería quedar aproximadamente el ancho de un dedo entre las yemas de los dedos y la palma con la mano rodeando el puño.'
				]
			},
			{
				id: 'besaitung',
				heading: 'Encordado y tensión',
				paragraphs: [
					'La mayoría de las raquetas se venden ya encordadas, normalmente con nylon sintético — sólido y económico para empezar. Las cuerdas de tripa natural o multifilamento ofrecen más sensación de juego, pero cuestan más.',
					'La tensión de encordado influye en control y potencia: más tensa suele significar más control pero menos potencia natural; más floja, lo contrario. Para empezar, el encordado de fábrica casi siempre es un buen punto de partida — el ajuste fino llega más adelante, con más sensación de juego.'
				]
			},
			{
				id: 'haeufiger-frust',
				heading: 'Lo que más frustración genera con una raqueta nueva',
				box: {
					kind: 'mistakes',
					title: 'Errores de compra habituales',
					items: [
						'Una "raqueta de profesional" con cabeza pequeña y mucho peso, solo porque la usa tu jugador favorito.',
						'Adivinar el grosor de puño solo por el tamaño de la mano, sin medirlo.',
						'Encordar demasiado tenso "porque más tenso suena mejor" — eso sobre todo resta potencia y comodidad.',
						'La raqueta se queda meses sin usar en un rincón porque no se sintió bien desde el primer swing.'
					]
				}
			},
			{
				id: 'vor-dem-kauf-schlaeger',
				heading: 'Comprobar antes de comprar',
				box: {
					kind: 'checklist',
					title: 'Comprobación rápida',
					items: [
						'Tamaño de cabeza desde unas 100 pulgadas cuadradas para empezar.',
						'Peso sin encordar en el rango de 250–285 gramos.',
						'Grosor de puño medido en tienda especializada, no adivinado.',
						'Probar una raqueta de demostración si la tienda la ofrece, antes de comprar.'
					]
				}
			}
		],
		faq: [
			{
				question: '¿Cuánto cuesta una buena raqueta para principiantes?',
				answer:
					'El rango de precios es amplio y cambia constantemente — una tienda especializada cerca de ti te dará la información más actual y fiable. Más importante que el precio para empezar es acertar con el tamaño de cabeza, el peso y el grosor de puño.'
			},
			{
				question: '¿Sirve una raqueta usada para empezar?',
				answer:
					'Sí, siempre que el tamaño de cabeza, el peso y el grosor de puño encajen. Eso sí, conviene revisar el estado del encordado — unas cuerdas muy desgastadas o quebradizas suelen poderse volver a encordar de forma económica.'
			}
		]
	},
	{
		slug: 'tennis-schuhe',
		title: 'Zapatillas de tenis: en qué fijarte al comprarlas',
		metaTitle: 'Comprar zapatillas de tenis: suela, superficie y ajuste explicados',
		metaDescription:
			'Tierra batida, pista dura o all-court: los dibujos de suela y criterios que debes conocer antes de comprar zapatillas de tenis.',
		excerpt:
			'Tierra batida o pista dura — el dibujo de suela adecuado marca la mayor diferencia al elegir zapatillas de tenis.',
		category: 'ausruestung',
		difficulty: 'einsteiger',
		readingTime: 6,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-ausruestung', 'tennis-schlaeger', 'tennis-fuer-anfaenger'],
		sections: [
			{
				id: 'warum-spezielle-schuhe',
				heading: '¿Por qué zapatillas específicas de tenis?',
				paragraphs: [
					'El tenis exige muchos cambios rápidos de dirección, paradas y pasos laterales — mucha más carga lateral que correr. Las zapatillas de tenis están construidas para eso, con zonas de refuerzo lateral y una suela más resistente y plana que las zapatillas de correr normales.',
					'Jugar de forma habitual con zapatillas de correr no solo implica peor agarre, sino también un desgaste más rápido de la suela y un mayor riesgo de lesión en movimientos bruscos.'
				]
			},
			{
				id: 'sohle-nach-belag',
				heading: 'Dibujo de suela según la superficie',
				paragraphs: [
					'Para tierra batida son adecuadas las zapatillas con un dibujo fino de espiga (herringbone) — ese dibujo agarra bien en la tierra suelta y aun así permite un deslizamiento controlado al frenar, algo incluso deseable en tierra batida.',
					'Para pista dura son habituales dibujos más resistentes, normalmente algo más gruesos, que aguantan el mayor desgaste. Las zapatillas "all-court" con un dibujo mixto son un buen compromiso si juegas en superficies variadas.',
					'Las pistas de hierba (menos habituales en el ámbito amateur) necesitan a su vez zapatillas propias, normalmente con pequeños tacos — las zapatillas normales de tierra o pista dura resbalan demasiado o dañan la superficie.'
				]
			},
			{
				id: 'passform-und-daempfung',
				heading: 'Ajuste y amortiguación',
				paragraphs: [
					'Las zapatillas de tenis deberían dejar algo más de espacio en la puntera que el calzado del día a día, porque el pie tiende a deslizarse hacia adelante en los movimientos laterales. Un buen agarre en el talón importa más que la máxima amortiguación — una amortiguación demasiado blanda puede incluso sentirse menos estable en cambios rápidos de dirección.',
					'Quien tenga molestias de rodilla o articulaciones suele beneficiarse de algo más de amortiguación en el antepié; en caso de duda, conviene una breve consulta en una tienda especializada.'
				]
			},
			{
				id: 'falsche-wahl',
				heading: 'Elecciones de zapatillas de las que uno suele arrepentirse',
				box: {
					kind: 'mistakes',
					title: 'Errores de compra habituales',
					items: [
						'Zapatillas de correr para el primer entrenamiento en el club, "porque ya están en el armario".',
						'Zapatillas de pista dura sobre tierra batida — peor agarre y desgaste más rápido.',
						'Talla demasiado ajustada, sin espacio para el deslizamiento del pie hacia adelante.',
						'No hacer una breve prueba en tienda o pista de prueba antes de comprar.'
					]
				}
			},
			{
				id: 'vor-dem-schuhkauf',
				heading: 'Antes de comprar zapatillas',
				box: {
					kind: 'checklist',
					title: 'Comprobación rápida',
					items: [
						'Elegir el dibujo de suela según la superficie principal de tu club.',
						'Prever algo más de espacio en el antepié que en el calzado diario.',
						'Probar el agarre del talón y la estabilidad lateral, no solo la amortiguación.',
						'Considerar un modelo all-court si juegas en superficies variadas.'
					]
				}
			}
		],
		faq: [
			{
				question: '¿Puedo usar unas mismas zapatillas en todas las superficies?',
				answer:
					'Con un modelo all-court, en gran parte sí, con compromisos notables frente a una zapatilla pensada específicamente para una superficie. Si juegas sobre todo en una superficie, un dibujo de suela especializado suele rendir mejor.'
			},
			{
				question: '¿Con qué frecuencia debería cambiar mis zapatillas de tenis?',
				answer:
					'Depende mucho de la frecuencia de juego y la superficie — la tierra batida desgasta la suela notablemente más rápido que la pista dura. En cuanto el dibujo se alise visiblemente o el agarre lateral disminuya, toca cambiarlas, independientemente de un plazo fijo.'
			}
		]
	},
	// ------------------------------------------------------------
	// TÉCNICA Y TÁCTICA
	// ------------------------------------------------------------
	{
		slug: 'tennis-technik',
		title: 'Técnica de tenis: los golpes más importantes explicados de forma sencilla',
		metaTitle: 'Técnica de tenis: derecha, revés, saque y volea explicados',
		metaDescription:
			'Derecha, revés, saque, volea y slice: los golpes de fondo más importantes del tenis explicados con claridad.',
		excerpt:
			'Derecha, revés, saque y volea: los golpes de fondo sobre los que se construye toda técnica posterior.',
		category: 'technik-taktik',
		difficulty: 'fortgeschritten',
		readingTime: 9,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-taktik', 'tennis-training', 'tennis-begriffe'],
		sections: [
			{
				id: 'vorhand',
				heading: 'Derecha (forehand)',
				paragraphs: [
					'La derecha suele ser el primer golpe fiable de la mayoría de jugadores y a menudo su arma más potente. Se golpea en el lado de la mano de la raqueta, normalmente con un movimiento de preparación que baja la raqueta por debajo del punto de contacto antes de impulsarla hacia adelante y arriba.',
					'Hay dos familias de empuñadura habituales: una semi-western u western para mucho topspin, o una eastern más plana para una trayectoria más directa y plana. Para principiantes suele funcionar bien una empuñadura intermedia, dejando ambas opciones abiertas.'
				]
			},
			{
				id: 'rueckhand',
				heading: 'Revés (backhand)',
				paragraphs: [
					'El revés se golpea a una o dos manos. A dos manos aporta estabilidad y potencia extra, y suele ser el punto de entrada más fácil para principiantes. A una mano permite más alcance y muchos lo consideran más elegante, pero requiere más práctica hasta que la fuerza y el control encajan.',
					'Qué variante conviene más depende mucho de la fuerza, el alcance y la preferencia personal — ambas se juegan con éxito incluso a alto nivel.'
				]
			},
			{
				id: 'aufschlag',
				heading: 'Saque',
				paragraphs: [
					'El saque es el único golpe en el que tienes control total sobre el lanzamiento de la pelota y el tiempo — por eso merece la pena practicarlo de forma deliberada. Elementos clave son un lanzamiento constante y limpio, un movimiento de preparación fluido (la "posición de trofeo") y un punto de contacto lo más alto y adelantado posible.',
					'Para principiantes, la constancia es lo que más importa: mejor un primer saque algo más lento pero fiable que muchas dobles faltas por arriesgar demasiado.'
				]
			},
			{
				id: 'volley',
				heading: 'Volea',
				paragraphs: [
					'En la volea se golpea la pelota directamente del aire, normalmente con un movimiento corto y compacto en lugar de un gran swing. La posición base en la red importa: el peso hacia adelante, la raqueta delante del cuerpo, para poder reaccionar a pelotas rápidas.',
					'Un error habitual de principiantes es dar demasiado swing en la volea — los movimientos cortos y controlados suelen ser más precisos y fiables.'
				]
			},
			{
				id: 'slice-und-topspin',
				heading: 'Slice y topspin',
				paragraphs: [
					'El slice (efecto cortado) produce una pelota más plana y con un bote más bajo — útil para quitar velocidad o ganar tiempo para reposicionarse. El topspin (efecto liftado) produce un arco más alto y un bote más pronunciado y rápido — útil para más seguridad sobre la red manteniendo velocidad.',
					'Ambos complementan los golpes de fondo en lugar de sustituirlos — la mayoría de jugadores avanzados alternan entre uno y otro según la situación.'
				]
			},
			{
				id: 'fortschritt',
				heading: 'Con qué progresas más rápido',
				box: {
					kind: 'tips',
					title: 'Consejos de entrenamiento',
					items: [
						'Entrena primero la constancia por el centro de la red, y solo después la velocidad y los ángulos.',
						'No descuides el juego de piernas — la mejor técnica de golpeo sirve de poco sin un posicionamiento a tiempo.',
						'Practica regularmente contra una pared o máquina lanzapelotas para aumentar las repeticiones.',
						'Graba en vídeo tus propios golpes y revísalos con un entrenador o entrenadora.'
					]
				}
			}
		],
		faq: [
			{
				question: '¿Debería aprender el revés a una mano o a dos manos?',
				answer:
					'Para la mayoría de principiantes, a dos manos es el inicio más fácil y estable, porque la segunda mano aporta fuerza y control extra. A una mano merece la pena sobre todo si quieres desarrollar de forma deliberada más alcance y versatilidad con el slice.'
			},
			{
				question: '¿Cuánto se tarda en tener un saque sólido?',
				answer:
					'Un saque razonablemente constante y fiable suele conseguirse en algunas semanas de entrenamiento regular. Más velocidad y precisión se siguen desarrollando después durante meses — el saque se considera con razón uno de los golpes técnicamente más exigentes.'
			}
		]
	},
	{
		slug: 'tennis-taktik',
		title: 'Táctica de tenis: juega mejor en individuales',
		metaTitle: 'Táctica de tenis en individuales: fundamentos para ganar más puntos',
		metaDescription:
			'Juego de fondo, subidas a la red y elección de golpe: cómo construir una táctica más clara en individuales de tenis.',
		excerpt:
			'Juego de fondo, subidas a la red y una elección de golpe inteligente: gana más puntos en individuales sin golpear más fuerte.',
		category: 'technik-taktik',
		difficulty: 'fortgeschritten',
		readingTime: 8,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-technik', 'tennis-doppel', 'tennis-einzel-doppel'],
		sections: [
			{
				id: 'grundlinienspiel',
				heading: 'Juego de fondo: la posición es media batalla',
				paragraphs: [
					'Volver al centro de la pista tras cada golpe propio es uno de los fundamentos tácticos más importantes en individuales — desde ahí cubres ambos lados de forma aproximadamente equilibrada. Quedarse en el lateral en cambio deja casi abierta la otra mitad de la pista.',
					'El golpe cruzado (por la diagonal larga) suele ser el más seguro, porque la red está más baja ahí y hay más pista disponible. El paralelo es más arriesgado, pero a menudo más sorprendente y efectivo que un intercambio previsible por cruzado.'
				]
			},
			{
				id: 'netzangriff',
				heading: 'Cuándo conviene subir a la red',
				paragraphs: [
					'Una pelota corta y floja del rival suele ser la mejor oportunidad para avanzar y terminar el punto con una volea o un smash, en lugar de seguir jugando desde el fondo. Estar en la red reduce considerablemente el tiempo de reacción del rival.',
					'Subir muy pocas veces regala puntos fáciles; subir demasiado a menudo y sin buen motivo hace fácil que te pasen o te hagan un globo — el equilibrio marca la diferencia.'
				]
			},
			{
				id: 'schlagwahl-unter-druck',
				heading: 'Elección de golpe bajo presión',
				paragraphs: [
					'En situaciones ajustadas (deuce, punto de set) conviene apostar por tu golpe más fiable en lugar de un experimento arriesgado. Muchos puntos no se pierden por golpes ganadores espectaculares del rival, sino por errores no forzados propios y evitables en momentos así.',
					'Una regla sencilla: cuanto más ajustado el marcador, más margen de seguridad conviene dejar — mejor jugar un golpe algo menos arriesgado pero terminar el punto de forma fiable.'
				]
			},
			{
				id: 'muster-erkennen',
				heading: 'Reconocer los patrones del rival',
				paragraphs: [
					'Muchos jugadores tienen preferencias inconscientes — como jugar casi siempre cruzado en vez de paralelo, o elegir casi siempre el mismo golpe bajo presión. Quien reconoce esos patrones durante un partido puede ajustarse de forma deliberada, por ejemplo anticipando antes una posición o buscando el lado más débil.'
				]
			},
			{
				id: 'punktekosten',
				heading: 'Esto cuesta más puntos en la práctica',
				box: {
					kind: 'mistakes',
					title: 'Errores tácticos habituales',
					items: [
						'Quedarse quieto tras el propio golpe en lugar de volver al centro.',
						'Buscar la máxima velocidad en cada bola en lugar de priorizar colocación y constancia.',
						'Ignorar las pelotas cortas del rival en lugar de subir sistemáticamente a la red.',
						'Probar golpes innecesariamente arriesgados en puntos importantes en lugar de confiar en lo fiable.'
					]
				}
			},
			{
				id: 'im-kopf-behalten',
				heading: 'Ten esto en cuenta antes y durante el partido',
				box: {
					kind: 'checklist',
					title: 'Comprobación rápida',
					items: [
						'Volver al centro de la pista tras cada golpe.',
						'Usar sistemáticamente las pelotas cortas como señal para subir a la red.',
						'Confiar en tu golpe más fiable en los puntos ajustados.',
						'Observar los patrones del rival durante el partido y aprovecharlos.'
					]
				}
			}
		],
		faq: [
			{
				question: '¿Deberían los principiantes trabajar ya la táctica?',
				answer:
					'Sí, de forma sencilla — sobre todo volver al centro de la pista tras cada golpe se puede practicar desde el principio y aporta de inmediato notablemente más puntos ganados, sin necesitar aún mejor técnica de golpeo.'
			},
			{
				question: '¿Es mejor opción el cruzado o el paralelo?',
				answer:
					'El cruzado suele ser la opción base más segura, porque la red está más baja ahí y hay más pista disponible. El paralelo merece la pena de forma deliberada como factor sorpresa, o cuando el rival está muy preparado para golpes cruzados.'
			}
		]
	},
	{
		slug: 'tennis-doppel',
		title: 'Dobles de tenis: posicionamiento, comunicación y juego en equipo',
		metaTitle: 'Dobles de tenis: posicionamiento, comunicación y formaciones explicadas',
		metaDescription:
			'Posición en la red, comunicación y formaciones de saque: cómo jugar de forma más inteligente como equipo de dobles.',
		excerpt:
			'Posición en la red, acuerdos claros y la formación adecuada: así se convierten dos jugadores en un verdadero equipo.',
		category: 'technik-taktik',
		difficulty: 'fortgeschritten',
		readingTime: 8,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-taktik', 'tennis-einzel-doppel', 'tennis-technik'],
		sections: [
			{
				id: 'grundformation',
				heading: 'Formación base: uno en la red, otro atrás',
				paragraphs: [
					'La formación clásica de dobles en el propio saque: quien saca se queda atrás, mientras su pareja ya está en la red. Tras un buen primer saque, quien saca también avanza rápidamente hacia la red, para que ambos lleguen cuanto antes a la posición fuerte de red.',
					'En el resto suele ser al revés: quien resta se queda atrás en la línea de fondo, mientras su pareja también se mantiene algo más cauta al principio, hasta que aparece una buena oportunidad para avanzar.'
				]
			},
			{
				id: 'kommunikation',
				heading: 'Comunicación: pequeña, pero decisiva',
				paragraphs: [
					'Avisos cortos y claros como "mía" o "tuya" para las pelotas por el centro evitan el fallo de dobles más habitual: que ambos se queden quietos porque cada uno pensaba que su pareja se hacía cargo.',
					'También conviene un acuerdo breve antes del saque, por ejemplo si quien está en la red debe intentar activamente el "poach" (interceptar el resto) o quedarse en su lado — los movimientos sorpresa espontáneos funcionan mejor si se avisan brevemente de antemano.'
				]
			},
			{
				id: 'formationen',
				heading: 'Formaciones más allá de la disposición estándar',
				paragraphs: [
					'La "formación australiana" coloca a ambos miembros del equipo en el mismo lado de la pista, para cortarle a un rival con un revés cruzado fuerte ese golpe preferido. La "formación en I" coloca a quien está en la red justo detrás de quien saca, en el centro, y solo se desplaza a un lado tras el saque, dificultando prever la dirección del resto.',
					'Estas formaciones merecen la pena sobre todo contra restos muy trabajados del rival — para empezar, la formación base clásica es más que suficiente.'
				]
			},
			{
				id: 'gasse-abdecken',
				heading: 'Cubrir el pasillo',
				paragraphs: [
					'Un objetivo habitual del rival es un golpe hacia el pasillo exterior cuando ahí se abre un hueco. La regla básica: quien está en la red cubre también el pasillo de su lado en cuanto el rival se coloca en buena posición para un golpe paralelo — para eso hace falta seguir todo el punto constantemente, no solo la propia pelota.'
				]
			},
			{
				id: 'bremst-teams-aus',
				heading: 'Esto frena a la mayoría de equipos',
				box: {
					kind: 'mistakes',
					title: 'Errores habituales en dobles',
					items: [
						'Dejar pelotas por el centro sin jugar porque no está claro quién es responsable.',
						'Quedarse demasiado pasivo en la red en lugar de interceptar activamente las pelotas.',
						'Retroceder de inmediato tras el propio resto en lugar de aprovechar la ocasión para avanzar.',
						'No acordar nada brevemente antes del saque, con lo que los momentos sorpresa se desperdician.'
					]
				}
			}
		],
		faq: [
			{
				question: '¿Quién debería estar en la red?',
				answer:
					'En general, quien no esté restando ni sacando en ese momento — la posición de red suele ser la más fuerte en dobles, porque obliga al rival a tiempos de reacción más cortos y permite más puntos ganados de forma directa.'
			},
			{
				question: '¿Qué es "poachear"?',
				answer:
					'Poachear significa interceptar activamente, como jugador de red, una pelota que en realidad iba dirigida a tu pareja — normalmente en el resto, para sorprender al rival. Funciona mejor con un aviso breve de antemano.'
			}
		]
	},
	// ------------------------------------------------------------
	// PRIMEROS PASOS
	// ------------------------------------------------------------
	{
		slug: 'tennis-fuer-anfaenger',
		title: 'Tenis para principiantes: todo lo que necesitas saber antes de tu primer partido',
		metaTitle: 'Tenis para principiantes: la guía completa de inicio',
		metaDescription:
			'Encontrar club, primera clase, equipamiento: la guía completa de inicio para tu primer partido de tenis.',
		excerpt:
			'Encontrar club, tomar tu primera clase, conseguir equipamiento: un camino sencillo hacia el tenis.',
		category: 'einstieg',
		difficulty: 'einsteiger',
		readingTime: 8,
		updatedAt: '2026-08-01',
		popular: true,
		beginnerRecommended: true,
		relatedSlugs: ['tennis-regeln', 'tennis-ausruestung', 'tennis-einzel-doppel', 'tennis-training'],
		sections: [
			{
				id: 'verein-oder-platz-finden',
				heading: 'Encontrar club o pista',
				paragraphs: [
					'La forma más sencilla de empezar suele ser una oferta de prueba en un club cercano — muchos ofrecen clases de prueba gratuitas o económicas. Alternativamente, en muchas ciudades también se pueden reservar pistas públicas o comerciales por horas, sin ninguna vinculación a un club.',
					'En TennisIndex, /vereine y /karte muestran de un vistazo los clubes y pistas cerca de ti.'
				]
			},
			{
				id: 'erste-trainerstunde',
				heading: 'La primera clase con entrenador',
				paragraphs: [
					'Una primera clase guiada por un entrenador o entrenadora suele merecer más la pena que golpear sin coordinación con un amigo — los movimientos mal aprendidos luego cuestan mucho corregirlos.',
					'En la primera clase espera sobre todo trabajo de base: agarre, movimientos sencillos de derecha y revés, primeros peloteos cortos a poca distancia — todavía no un partido completo.'
				]
			},
			{
				id: 'was-mitbringen',
				heading: 'Qué llevar',
				paragraphs: [
					'Para la primera clase basta con ropa deportiva cómoda y zapatillas deportivas firmes — la mayoría de clubes o entrenadores prestan una raqueta al principio. Una botella de agua y, con sol, protección solar no son mala idea en pista, sobre todo en verano.'
				]
			},
			{
				id: 'entspannter-court-besuch',
				heading: 'Para que tu primera visita a la pista sea relajada',
				box: {
					kind: 'tips',
					title: 'Consejos prácticos',
					items: [
						'Llegar algo antes para familiarizarte con la pista y el entorno.',
						'No intentar golpear fuerte de inmediato — primero encontrar el timing y el punto de contacto.',
						'Preguntar brevemente al final de la clase en qué trabajar hasta la próxima.',
						'Si tienes dudas sobre la etiqueta (por ejemplo, quién recoge las pelotas), simplemente pregunta con educación.'
					]
				}
			},
			{
				id: 'anfaenger-typisch',
				heading: 'Típico al principio, pero fácil de evitar',
				box: {
					kind: 'mistakes',
					title: 'Errores habituales de principiantes',
					items: [
						'Quedarse demasiado lejos de la línea de fondo por inseguridad ante las pelotas rápidas.',
						'Agarrar la raqueta con demasiada fuerza, lo que quita swing y sensación.',
						'Darle muchas vueltas a un punto fallado en lugar de centrarse rápido en el siguiente.',
						'Practicar muy poco entre clases — la constancia surge sobre todo de la repetición.'
					]
				}
			},
			{
				id: 'bevor-es-losgeht',
				heading: 'Antes de empezar',
				box: {
					kind: 'checklist',
					title: 'Comprobación rápida',
					items: [
						'Buscar una clase de prueba en un club cercano.',
						'Llevar ropa deportiva cómoda y zapatillas deportivas firmes.',
						'No olvidar la botella de agua y la protección solar.',
						'Mantener expectativas modestas — los primeros golpes rara vez entran "como en la tele".'
					]
				}
			}
		],
		faq: [
			{
				question: '¿A partir de qué edad se puede empezar a jugar al tenis?',
				answer:
					'Se puede empezar a jugar al tenis prácticamente a cualquier edad. Para niños existen pelotas más lentas y pistas más pequeñas para un inicio más fácil, y para adultos de cualquier edad, cursos de iniciación normales en la mayoría de clubes.'
			},
			{
				question: '¿Necesito estar en forma para empezar?',
				answer:
					'No — los fundamentos se pueden aprender independientemente del nivel de forma física, y la condición se desarrolla por sí sola con el juego regular. Un buen calentamiento antes de cada sesión ayuda a evitar lesiones desde el principio.'
			},
			{
				question: '¿Con qué rapidez encontraré compañeros de mi nivel?',
				answer:
					'A través de un club, normalmente bastante rápido, ya que ahí suelen entrenar juntos muchos principiantes. TennisIndex también ayuda, mediante la clasificación del club y la búsqueda de partidos, a encontrar rivales adecuados para tu nivel actual.'
			}
		]
	},
	{
		slug: 'tennis-training',
		title: 'Entrenamiento de tenis: ejercicios de técnica, táctica y mejores partidos',
		metaTitle: 'Entrenamiento de tenis: ejercicios de técnica, forma física y táctica',
		metaDescription:
			'Desde el entrenamiento contra pared hasta la simulación de partidos: ejercicios que mejoran técnica, forma física y táctica.',
		excerpt:
			'Desde el entrenamiento contra pared hasta la simulación de partidos: estos ejercicios te hacen avanzar, sea cual sea tu nivel.',
		category: 'einstieg',
		difficulty: 'fortgeschritten',
		readingTime: 7,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-technik', 'tennis-taktik', 'tennis-fuer-anfaenger'],
		sections: [
			{
				id: 'technikuebungen',
				heading: 'Ejercicios de técnica para golpes de fondo constantes',
				paragraphs: [
					'El entrenamiento contra pared es uno de los ejercicios más eficientes para principiantes: la pelota vuelve al instante, lo que permite muchas más repeticiones en poco tiempo que jugar con pareja. El objetivo al principio es la pura constancia — golpear la pelota limpiamente diez, veinte, treinta veces seguidas antes de añadir velocidad.',
					'Una máquina lanzapelotas (si el club dispone de una) permite practicar de forma dirigida tipos de golpe concretos con velocidad y colocación constantes, sin depender de una pareja de entrenamiento.'
				]
			},
			{
				id: 'beinarbeit',
				heading: 'Juego de piernas y forma física',
				paragraphs: [
					'Los ejercicios de salto lateral (side shuffles), sprints cortos entre marcas y el sombra (patrones de movimiento sin pelota) mejoran la velocidad de reacción, que a menudo decide los puntos en el juego real — unas piernas más rápidas te llevan antes a la posición de golpeo.',
					'La resistencia de base se puede trabajar además con carrera, ciclismo o natación — el tenis en sí, con sus muchos sprints cortos y pausas, es más un deporte de intervalos que uno puramente de resistencia.'
				]
			},
			{
				id: 'taktikuebungen',
				heading: 'Ejercicios de táctica con pareja',
				paragraphs: [
					'Los puntos con reglas restringidas — por ejemplo, solo se permiten golpes cruzados, o un punto solo cuenta tras al menos cinco golpes — entrenan de forma deliberada la constancia y el pensamiento táctico, en lugar de solo golpear con velocidad.',
					'Las situaciones de partido simuladas (por ejemplo, "vas 3-5 abajo, gana este juego") ayudan a entrenar de forma deliberada la fortaleza mental bajo presión, en lugar de probarla por primera vez en una competición real.'
				]
			},
			{
				id: 'einstiegsrahmen',
				heading: 'Un marco de inicio sencillo — adáptalo a tu nivel',
				box: {
					kind: 'info',
					title: 'Sesión de entrenamiento de ejemplo (60–75 minutos)',
					items: [
						'10 minutos de calentamiento: carrera suave, estiramientos, primeros peloteos suaves.',
						'15 minutos de golpes de fondo: derecha y revés cruzados, con foco en la constancia.',
						'10 minutos de práctica de saque y resto.',
						'15 minutos de práctica de volea y juego de red.',
						'15–20 minutos de puntos o un partido reducido para aplicarlo todo.',
						'5 minutos de vuelta a la calma y una breve reflexión sobre qué funcionó y qué no.'
					]
				}
			}
		],
		faq: [
			{
				question: '¿Con qué frecuencia deberían entrenar los principiantes?',
				answer:
					'Con una o dos sesiones por semana es más que suficiente para un progreso notable al principio. La regularidad suele importar más que la frecuencia — mejor entrenar de forma constante una vez por semana que de forma esporádica con largos huecos entre medias.'
			},
			{
				question: '¿Sirve realmente el entrenamiento contra pared?',
				answer:
					'Sí, especialmente para la constancia y el timing — las muchas repeticiones en poco tiempo ayudan a fijar el movimiento base más rápido que el juego normal, donde no todos los peloteos se desarrollan igual.'
			}
		]
	},
	// ------------------------------------------------------------
	// COSTES
	// ------------------------------------------------------------
	{
		slug: 'tennis-kosten',
		title: '¿Cuánto cuesta el tenis? Equipamiento, cuota de club y costes recurrentes explicados',
		metaTitle: '¿Cuánto cuesta el tenis? Equipamiento, cuota de club y precio de pista',
		metaDescription:
			'Cuota de club, precio de pista, equipamiento y clases: los factores de coste del tenis explicados de un vistazo.',
		excerpt:
			'Cuota de club, precio de pista y equipamiento — una visión honesta de los factores de coste del tenis.',
		category: 'kosten',
		difficulty: 'einsteiger',
		readingTime: 6,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-ausruestung', 'tennis-schlaeger', 'tennis-fuer-anfaenger'],
		sections: [
			{
				id: 'einmalige-kosten',
				heading: 'Costes puntuales: equipamiento',
				paragraphs: [
					'La mayor compra puntual es la raqueta, seguida de unas zapatillas de tenis adecuadas. Cuánto gastes depende mucho de si compras nueva en una tienda especializada, eliges un modelo para principiantes o empiezas con algo de segunda mano — los precios además cambian constantemente, así que una consulta actual en una tienda cercana es más útil que una cifra fija aquí.',
					'La ropa y los accesorios (pelotas, quizá una bolsa) se suman a eso, pero suelen ser mucho más económicos que la raqueta y las zapatillas juntas.'
				]
			},
			{
				id: 'laufende-kosten',
				heading: 'Costes recurrentes: cuota de club y precio de pista',
				paragraphs: [
					'Jugar a través de un club suele implicar una cuota anual o mensual, que varía mucho según el club, la región y las instalaciones (número de pistas, capacidad cubierta, servicios adicionales). Algunos clubes cobran además una cuota de inscripción única.',
					'Jugar sin vinculación a un club suele implicar en cambio pagar una tarifa por hora en instalaciones públicas o comerciales — práctico para jugar de forma irregular, pero a menudo más caro a largo plazo que una cuota de club si juegas con regularidad.'
				]
			},
			{
				id: 'training-und-unterricht',
				heading: 'Entrenamiento y clases',
				paragraphs: [
					'Las clases individuales con un entrenador o entrenadora suelen ser la forma de entrenamiento más cara, pero también la más personalizada. Las clases en grupo son más económicas por persona y añaden además el componente social de aprender juntos — a menudo la mejor opción para empezar.',
					'El coste de las clases varía mucho según la región, la cualificación del entrenador o entrenadora y lo que ofrece el club.'
				]
			},
			{
				id: 'laufende-kleinkosten',
				heading: 'Pequeños costes recurrentes',
				paragraphs: [
					'Las pelotas se desgastan y hay que reponerlas con regularidad, especialmente si juegas a menudo. Las cuerdas se rompen o pierden tensión — un reencordado ocasional forma parte del mantenimiento normal para quien juega con regularidad.',
					'Si participas en partidos de liga o torneos, hay que contar además con cuotas de inscripción, según la federación y la competición.'
				]
			},
			{
				id: 'bezahlbar-bleiben',
				heading: 'Cómo mantener el tenis asequible',
				box: {
					kind: 'tips',
					title: 'Consejos de ahorro para empezar',
					items: [
						'Probar primero con raqueta prestada y clases de prueba antes de compras mayores.',
						'Elegir clases en grupo en lugar de individuales para empezar.',
						'Revisar raquetas y equipamiento de segunda mano en una tienda especializada o a través del club.',
						'Comparar la cuota de club con el precio de pista pública según tu forma real de jugar, en lugar de decidir de forma general.'
					]
				}
			},
			{
				id: 'vor-dem-einstieg-klaeren',
				heading: 'Aclarar antes de empezar',
				box: {
					kind: 'checklist',
					title: 'Comprobación rápida',
					items: [
						'Preguntar directamente en el club deseado por la cuota y una posible cuota de inscripción.',
						'Comprobar si se ofrece una cuota de prueba o un periodo de prueba.',
						'Aclarar si se facilita raqueta o pelotas al principio.',
						'Comparar precios de clases en grupo e individuales antes de decidirte.'
					]
				}
			}
		],
		faq: [
			{
				question: '¿Es el tenis un deporte caro?',
				answer:
					'Los costes de inicio se pueden mantener bajos con equipamiento prestado y clases en grupo. Se encarece sobre todo con equipamiento propio de alta gama, clases individuales regulares y participación en competiciones — para jugar de forma informal, empezar sigue siendo asequible.'
			},
			{
				question: '¿Merece la pena una cuota de club frente al precio de pista?',
				answer:
					'Eso depende sobre todo de con qué frecuencia juegues. Con juego regular, una cuota de club suele salir más barata que reservas individuales repetidas; con juego muy irregular, el precio de pista por horas sin ningún compromiso fijo puede encajar mejor.'
			}
		]
	}
];
