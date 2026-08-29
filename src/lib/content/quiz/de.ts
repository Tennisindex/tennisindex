// ============================================================
// TennisIndex — Quiz-Inhalte (Deutsch)
// ============================================================
// Neue Frage ergänzen: Objekt vom Typ QuizQuestion an QUIZ_QUESTIONS_DE
// anhängen, difficulty korrekt setzen, dieselbe id-Struktur in en.ts/
// es.ts ergänzen — quiz-data.test.ts prüft die Parität automatisch.

import type { QuizDifficulty, QuizQuestion, QuizResultTier } from '../../quiz';

export const QUIZ_DIFFICULTIES_DE: QuizDifficulty[] = [
	{
		slug: 'anfaenger',
		label: 'Anfänger',
		description: 'Grundregeln, Zählweise, Aufschlag, Ausrüstung und einfache Spielsituationen.',
		color: '#8BC53F',
		metaTitle: 'Tennis-Quiz für Anfänger: Kennst du die wichtigsten Regeln?',
		metaDescription:
			'Teste dein Wissen zu Tennis-Regeln, Aufschlag, Zählweise, Ausrüstung und einfachen Spielsituationen.',
		recommendedGuideSlugs: ['tennis-regeln', 'tennis-fuer-anfaenger', 'tennis-ausruestung']
	},
	{
		slug: 'fortgeschritten',
		label: 'Fortgeschritten',
		description:
			'Taktische Entscheidungen, Aufschlagvarianten, Volley, Netzspiel und Doppel-Kommunikation.',
		color: '#4C7A1F',
		metaTitle: 'Tennis-Quiz für Fortgeschrittene: Technik, Taktik und Spielsituationen',
		metaDescription:
			'Teste dein Tennis-Wissen zu Aufschlag, Volley, Doppel-Taktik, Positionierung und Schlagwahl.',
		recommendedGuideSlugs: ['tennis-technik', 'tennis-taktik', 'tennis-doppel']
	},
	{
		slug: 'experte',
		label: 'Experte',
		description:
			'Komplexe Regelfälle, Matchstrategie, Schlagwahl unter Druck, Winkel, Tempo und Risiko.',
		color: '#0F1F13',
		metaTitle: 'Tennis-Experten-Quiz: Taktik, Strategie und komplexe Spielsituationen',
		metaDescription:
			'Das schwierige Tennis-Quiz für erfahrene Spieler: Matchstrategie, Schlagwahl, Risiko und taktische Entscheidungen.',
		recommendedGuideSlugs: ['tennis-taktik', 'tennis-training', 'tennis-doppel']
	}
];

export const QUIZ_RESULT_TIERS_DE: QuizResultTier[] = [
	{
		minPercentage: 0,
		maxPercentage: 39,
		title: 'Noch Luft nach oben',
		text: 'Du kennst die Grundlagen noch nicht sicher. Starte mit den wichtigsten Regeln und einfachen Spielsituationen.'
	},
	{
		minPercentage: 40,
		maxPercentage: 69,
		title: 'Solide Basis',
		text: 'Du hast schon ein gutes Grundverständnis. Mit etwas mehr Regelwissen und Taktik wirst du schnell sicherer.'
	},
	{
		minPercentage: 70,
		maxPercentage: 89,
		title: 'Starkes Tennis-Wissen',
		text: 'Du verstehst viele wichtige Situationen bereits gut. Jetzt lohnt sich der nächste Schritt in Technik und Matchtaktik.'
	},
	{
		minPercentage: 90,
		maxPercentage: 100,
		title: 'Tennis-Experte',
		text: 'Sehr stark! Du kennst dich mit Regeln, Taktik und Spielsituationen richtig gut aus.'
	}
];

export const QUIZ_QUESTIONS_DE: QuizQuestion[] = [
	// ------------------------------------------------------------
	// ANFÄNGER
	// ------------------------------------------------------------
	{
		id: 'anfaenger-1',
		difficulty: 'anfaenger',
		question: 'Was ist Tennis hauptsächlich?',
		options: [
			{ id: 'A', text: 'Ein Rückschlagsport, der im Einzel oder im Doppel gespielt wird' },
			{ id: 'B', text: 'Eine Variante von Squash ohne Netz' },
			{ id: 'C', text: 'Ein reines Konditionstraining ohne Punktezählung' },
			{ id: 'D', text: 'Ein Mannschaftssport mit sechs Spielern pro Seite' }
		],
		correctOptionId: 'A',
		explanation:
			'Tennis ist ein Rückschlagsport, der sowohl im Einzel (1 gegen 1) als auch im Doppel (2 gegen 2) gespielt wird.',
		relatedGuideSlugs: ['tennis-regeln']
	},
	{
		id: 'anfaenger-2',
		difficulty: 'anfaenger',
		question: 'Wie wird beim Tennis innerhalb eines Spiels normalerweise gezählt?',
		options: [
			{ id: 'A', text: '1, 2, 3, 4' },
			{ id: 'B', text: '0, 1, 2, 3' },
			{ id: 'C', text: '15, 30, 40, Spiel' },
			{ id: 'D', text: 'Jeder Ballwechsel zählt als ein Satz' }
		],
		correctOptionId: 'C',
		explanation: 'Innerhalb eines Spiels zählt man 15, 30, 40 und Spielgewinn.',
		relatedGuideSlugs: ['tennis-regeln']
	},
	{
		id: 'anfaenger-3',
		difficulty: 'anfaenger',
		question: 'Wie muss der Aufschlag beim Tennis ausgeführt werden?',
		options: [
			{
				id: 'A',
				text: 'Von oben: Der Ball wird hochgeworfen und vor dem Bodenkontakt geschlagen'
			},
			{ id: 'B', text: 'Von unten, nachdem der Ball einmal auf dem Boden aufgesprungen ist' },
			{ id: 'C', text: 'Direkt aus der Luft als Volley ohne vorherigen Wurf' },
			{ id: 'D', text: 'Immer mit beiden Händen gleichzeitig' }
		],
		correctOptionId: 'A',
		explanation:
			'Der Aufschlag erfolgt von oben: Du wirfst den Ball hoch und schlägst ihn, bevor er den Boden berührt.',
		relatedGuideSlugs: ['tennis-regeln']
	},
	{
		id: 'anfaenger-4',
		difficulty: 'anfaenger',
		question: 'Zählt ein Ball, der genau auf der Linie aufkommt, als aus?',
		options: [
			{ id: 'A', text: 'Ja, die Linie gehört nicht mehr zum Feld' },
			{ id: 'B', text: 'Nein, er zählt als gut, solange er die Linie berührt' },
			{ id: 'C', text: 'Nur beim Aufschlag zählt die Linie als aus' },
			{ id: 'D', text: 'Das entscheidet allein der Schiedsrichter nach Gefühl' }
		],
		correctOptionId: 'B',
		explanation:
			'Berührt der Ball auch nur einen Teil der Linie, gilt er als gut. Aus ist er erst außerhalb aller Linien.',
		relatedGuideSlugs: ['tennis-regeln']
	},
	{
		id: 'anfaenger-5',
		difficulty: 'anfaenger',
		question: 'Wie viele Spieler stehen bei einem Tennis-Doppel auf dem Platz?',
		options: [
			{ id: 'A', text: '2' },
			{ id: 'B', text: '3' },
			{ id: 'C', text: '4' },
			{ id: 'D', text: '6' }
		],
		correctOptionId: 'C',
		explanation: 'Im Doppel stehen sich zwei Teams mit je zwei Spieler:innen gegenüber, also vier insgesamt.',
		relatedGuideSlugs: ['tennis-doppel']
	},
	{
		id: 'anfaenger-6',
		difficulty: 'anfaenger',
		question: 'Was ist ein Lob?',
		options: [
			{ id: 'A', text: 'Ein kurzer Ball direkt hinter das Netz' },
			{ id: 'B', text: 'Ein hoher Ball über die Gegner hinweg' },
			{ id: 'C', text: 'Ein Aufschlagfehler' },
			{ id: 'D', text: 'Ein zweiter Aufschlagversuch' }
		],
		correctOptionId: 'B',
		explanation: 'Ein Lob ist ein hoher Ball, der eine am Netz stehende Person überspielen soll.',
		relatedGuideSlugs: ['tennis-begriffe', 'tennis-technik']
	},
	{
		id: 'anfaenger-7',
		difficulty: 'anfaenger',
		question: 'Was passiert, wenn der Ball zweimal auf dem Boden aufkommt, bevor er zurückgespielt wird?',
		options: [
			{ id: 'A', text: 'Der Ballwechsel geht ganz normal weiter' },
			{ id: 'B', text: 'Der Punkt ist vorbei, die Gegenseite bekommt den Punkt' },
			{ id: 'C', text: 'Der Punkt wird immer wiederholt' },
			{ id: 'D', text: 'Beide Seiten bekommen je einen halben Punkt' }
		],
		correctOptionId: 'B',
		explanation:
			'Der Ball darf nur einmal aufkommen, bevor er zurückgeschlagen wird. Beim zweiten Aufkommen ist der Punkt vorbei.',
		relatedGuideSlugs: ['tennis-regeln']
	},
	{
		id: 'anfaenger-8',
		difficulty: 'anfaenger',
		question: 'Was ist für Anfänger:innen besonders wichtig?',
		options: [
			{ id: 'A', text: 'Immer maximal hart schlagen' },
			{ id: 'B', text: 'Jeden Ball als Smash spielen' },
			{ id: 'C', text: 'Den Ball kontrolliert im Spiel halten' },
			{ id: 'D', text: 'Nie mit dem Partner oder der Partnerin sprechen' }
		],
		correctOptionId: 'C',
		explanation: 'Kontrolle und Konstanz sind für Anfänger:innen wichtiger als pure Schlaghärte.',
		relatedGuideSlugs: ['tennis-fuer-anfaenger']
	},
	{
		id: 'anfaenger-9',
		difficulty: 'anfaenger',
		question: 'Welche Ausrüstung braucht man für den Einstieg mindestens?',
		options: [
			{ id: 'A', text: 'Tennisschläger, passende Schuhe und Bälle' },
			{ id: 'B', text: 'Tennisschläger und Fußballschuhe' },
			{ id: 'C', text: 'Einen Squashschläger und einen Helm' },
			{ id: 'D', text: 'Nur Handschuhe' }
		],
		correctOptionId: 'A',
		explanation: 'Für Tennis braucht man einen Tennisschläger, geeignete Schuhe und Tennisbälle.',
		relatedGuideSlugs: ['tennis-ausruestung']
	},
	{
		id: 'anfaenger-10',
		difficulty: 'anfaenger',
		question: 'Was ist ein häufiger Anfängerfehler?',
		options: [
			{ id: 'A', text: 'Zu viel Kommunikation mit dem Partner oder der Partnerin' },
			{ id: 'B', text: 'Zu kontrolliertes Spiel' },
			{ id: 'C', text: 'Nach dem eigenen Schlag zur Feldmitte zurückkehren' },
			{ id: 'D', text: 'Jeden Ball zu hart schlagen wollen' }
		],
		correctOptionId: 'D',
		explanation:
			'Viele Anfänger:innen versuchen, zu oft hart zu schlagen. Im Tennis sind Platzierung, Geduld und Kontrolle meist wichtiger.',
		relatedGuideSlugs: ['tennis-fuer-anfaenger', 'tennis-taktik']
	},

	// ------------------------------------------------------------
	// FORTGESCHRITTEN
	// ------------------------------------------------------------
	{
		id: 'fortgeschritten-1',
		difficulty: 'fortgeschritten',
		question: 'Warum ist der Lob im Tennis taktisch wichtig?',
		options: [
			{ id: 'A', text: 'Er beendet automatisch den Punkt' },
			{ id: 'B', text: 'Er hilft, eine am Netz stehende Person nach hinten zu drängen' },
			{ id: 'C', text: 'Er zählt doppelt' },
			{ id: 'D', text: 'Er darf nur von Profis gespielt werden' }
		],
		correctOptionId: 'B',
		explanation:
			'Mit einem guten Lob kann man Gegner:innen vom Netz nach hinten drängen und selbst eine bessere Position einnehmen.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'fortgeschritten-2',
		difficulty: 'fortgeschritten',
		question: 'Was ist das Hauptziel eines Slice-Schlags?',
		options: [
			{ id: 'A', text: 'Den Punkt immer sofort zu gewinnen' },
			{ id: 'B', text: 'Den Ball flacher fliegen und niedriger abspringen zu lassen' },
			{ id: 'C', text: 'Den Ball absichtlich ins Aus zu schlagen' },
			{ id: 'D', text: 'Den Aufschlag komplett zu ersetzen' }
		],
		correctOptionId: 'B',
		explanation:
			'Slice wird mit Unterschnitt gespielt: Der Ball fliegt flacher und springt nach dem Aufkommen niedriger ab.',
		relatedGuideSlugs: ['tennis-technik']
	},
	{
		id: 'fortgeschritten-3',
		difficulty: 'fortgeschritten',
		question: 'Wann ist ein Volley besonders sinnvoll?',
		options: [
			{ id: 'A', text: 'Wenn man am Netz steht und den Ball früh nehmen kann' },
			{ id: 'B', text: 'Wenn der Ball weit hinter der eigenen Grundlinie ist' },
			{ id: 'C', text: 'Nur unmittelbar beim eigenen Aufschlag' },
			{ id: 'D', text: 'Nie, Volleys sind im Tennis nicht erlaubt' }
		],
		correctOptionId: 'A',
		explanation:
			'Volleys werden meist am Netz gespielt, um den Ball früh zu nehmen und Druck aufzubauen.',
		relatedGuideSlugs: ['tennis-technik']
	},
	{
		id: 'fortgeschritten-4',
		difficulty: 'fortgeschritten',
		question: 'Welche Position ist im Tennis häufig vorteilhaft, um Druck auszuüben?',
		options: [
			{ id: 'A', text: 'Beide Spieler:innen dauerhaft ganz hinten an der Grundlinie' },
			{ id: 'B', text: 'Eine kontrollierte Position am Netz' },
			{ id: 'C', text: 'Außerhalb der Feldbegrenzung' },
			{ id: 'D', text: 'Direkt auf der Aufschlaglinie stehend' }
		],
		correctOptionId: 'B',
		explanation:
			'Das Netz ist im Tennis oft eine starke Position, weil man von dort mit weniger Reaktionszeit für die Gegenseite Druck aufbauen kann.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'fortgeschritten-5',
		difficulty: 'fortgeschritten',
		question: 'Was ist bei der Kommunikation im Doppel wichtig?',
		options: [
			{ id: 'A', text: 'Möglichst gar nicht reden' },
			{ id: 'B', text: 'Nur nach dem Match sprechen' },
			{ id: 'C', text: 'Klare Ansagen wie „meiner“, „aus“ oder „Lob“' },
			{ id: 'D', text: 'Den Partner oder die Partnerin während des Ballwechsels verwirren' }
		],
		correctOptionId: 'C',
		explanation: 'Kurze, klare Ansagen helfen, Missverständnisse und liegen gelassene Bälle zu vermeiden.',
		relatedGuideSlugs: ['tennis-doppel']
	},
	{
		id: 'fortgeschritten-6',
		difficulty: 'fortgeschritten',
		question: 'Was ist ein Stoppball (Drop Shot)?',
		options: [
			{ id: 'A', text: 'Ein sehr harter Aufschlag' },
			{ id: 'B', text: 'Ein kurzer, sanft gespielter Ball knapp hinter das Netz' },
			{ id: 'C', text: 'Ein Ball, der absichtlich ins Netz geschlagen wird' },
			{ id: 'D', text: 'Ein Aufschlag, der wiederholt werden muss' }
		],
		correctOptionId: 'B',
		explanation:
			'Ein Stoppball ist ein kurzer, sanfter Ball knapp hinter das Netz, der eine weit hinten stehende Person zum Sprint nach vorne zwingt.',
		relatedGuideSlugs: ['tennis-begriffe', 'tennis-taktik']
	},
	{
		id: 'fortgeschritten-7',
		difficulty: 'fortgeschritten',
		question: 'Warum lohnt sich gezieltes Üben des Aufschlags besonders?',
		options: [
			{ id: 'A', text: 'Weil er der einzige Schlag ist, den man komplett selbst kontrolliert' },
			{ id: 'B', text: 'Weil er beim Doppel nicht zählt' },
			{ id: 'C', text: 'Weil er immer von unten gespielt wird' },
			{ id: 'D', text: 'Weil er nie wiederholt werden darf' }
		],
		correctOptionId: 'A',
		explanation:
			'Anders als bei allen anderen Schlägen bestimmst du beim Aufschlag Ballwurf und Timing komplett selbst — deshalb lohnt sich gezieltes Training besonders.',
		relatedGuideSlugs: ['tennis-technik']
	},
	{
		id: 'fortgeschritten-8',
		difficulty: 'fortgeschritten',
		question: 'Was ist im Doppel am Netz ein taktischer Fehler?',
		options: [
			{ id: 'A', text: 'Den Ball früh zu nehmen' },
			{ id: 'B', text: 'Die Gegenseite unter Druck zu setzen' },
			{ id: 'C', text: 'Zu große Lücken zwischen den Partner:innen zu lassen' },
			{ id: 'D', text: 'Den Ball kontrolliert zu platzieren' }
		],
		correctOptionId: 'C',
		explanation:
			'Große Lücken zwischen den Partner:innen eröffnen der Gegenseite einfache Angriffsmöglichkeiten.',
		relatedGuideSlugs: ['tennis-doppel']
	},
	{
		id: 'fortgeschritten-9',
		difficulty: 'fortgeschritten',
		question: 'Warum sollte man nicht jeden hohen Ball voll durchschmettern?',
		options: [
			{ id: 'A', text: 'Weil Schmetterbälle im Tennis nie erlaubt sind' },
			{ id: 'B', text: 'Weil ein schlechter Smash der Gegenseite eine gute Konterchance geben kann' },
			{ id: 'C', text: 'Weil hohe Bälle automatisch als aus zählen' },
			{ id: 'D', text: 'Weil der Punkt dadurch immer wiederholt wird' }
		],
		correctOptionId: 'B',
		explanation:
			'Ein unplatzierter oder zu schwacher Smash kann leicht verteidigt oder gekontert werden.',
		relatedGuideSlugs: ['tennis-technik', 'tennis-taktik']
	},
	{
		id: 'fortgeschritten-10',
		difficulty: 'fortgeschritten',
		question: 'Was ist beim Return besonders wichtig?',
		options: [
			{ id: 'A', text: 'Sofort maximal hart schlagen' },
			{ id: 'B', text: 'Den Ball sicher ins Spiel bringen und möglichst tief platzieren' },
			{ id: 'C', text: 'Möglichst nah ans Netz laufen, bevor der Ball überhaupt da ist' },
			{ id: 'D', text: 'Absichtlich ins Netz spielen' }
		],
		correctOptionId: 'B',
		explanation:
			'Ein sicherer, tiefer Return verhindert einfache Angriffe der aufschlagenden Seite.',
		relatedGuideSlugs: ['tennis-taktik']
	},

	// ------------------------------------------------------------
	// EXPERTE
	// ------------------------------------------------------------
	{
		id: 'experte-1',
		difficulty: 'experte',
		question:
			'Du stehst am Netz, die Gegenseite spielt einen sehr guten Lob über deine Rückhandseite. Was ist oft die beste Entscheidung?',
		options: [
			{ id: 'A', text: 'Rückwärts sprinten und blind schmettern' },
			{ id: 'B', text: 'Den Ball kontrolliert mit Überkopf-Slice oder defensivem Schlag zurückbringen' },
			{ id: 'C', text: 'Den Ball absichtlich durchlassen' },
			{ id: 'D', text: 'Den Partner oder die Partnerin ignorieren' }
		],
		correctOptionId: 'B',
		explanation:
			'Unter Druck ist Kontrolle wichtiger als Risiko. Ein kontrollierter Überkopf-Slice oder ein geordneter Rückzug ist oft besser als ein erzwungener Smash.',
		relatedGuideSlugs: ['tennis-taktik', 'tennis-technik']
	},
	{
		id: 'experte-2',
		difficulty: 'experte',
		question: 'Warum ist Tempoveränderung im Tennis auf hohem Niveau wichtig?',
		options: [
			{ id: 'A', text: 'Damit der Ballwechsel zufällig wird' },
			{ id: 'B', text: 'Um Rhythmus, Position und Reaktionszeit der Gegenseite zu stören' },
			{ id: 'C', text: 'Weil harte Bälle immer automatisch gewinnen' },
			{ id: 'D', text: 'Weil langsame Bälle im Reglement verboten sind' }
		],
		correctOptionId: 'B',
		explanation: 'Wechsel zwischen Tempo, Höhe und Platzierung machen das Spiel schwerer lesbar.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'experte-3',
		difficulty: 'experte',
		question: 'Wann ist ein harter Smash strategisch riskant?',
		options: [
			{
				id: 'A',
				text: 'Wenn er nicht platziert ist und die Gegenseite ihn zurückspielen kann'
			},
			{ id: 'B', text: 'Wenn man den Punkt gewinnen will' },
			{ id: 'C', text: 'Wenn der Ball hoch kommt' },
			{ id: 'D', text: 'Immer im ersten Spiel des Satzes' }
		],
		correctOptionId: 'A',
		explanation: 'Ein ungenauer Smash kann zurückkommen und die eigene Position schwächen.',
		relatedGuideSlugs: ['tennis-technik']
	},
	{
		id: 'experte-4',
		difficulty: 'experte',
		question:
			'Was ist ein sinnvolles Ziel eines tief und flach auf die Füße einer am Netz stehenden Person gespielten Balls?',
		options: [
			{ id: 'A', text: 'Die Gegenseite zu einem schwierigen Volley von unten zu zwingen' },
			{ id: 'B', text: 'Den Ball möglichst hoch über das ganze Feld zu spielen' },
			{ id: 'C', text: 'Den Punkt direkt zu verschenken' },
			{ id: 'D', text: 'Den eigenen Aufschlag zu ersetzen' }
		],
		correctOptionId: 'A',
		explanation:
			'Ein tiefer, flacher Ball auf die Füße zwingt die Gegenseite zu einem unangenehmen Volley von unten und kann helfen, selbst das Netz zu erobern.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'experte-5',
		difficulty: 'experte',
		question: 'Welche Entscheidung ist bei eigenem Druck am Netz oft sinnvoll?',
		options: [
			{ id: 'A', text: 'Nur auf maximale Schlaghärte setzen' },
			{
				id: 'B',
				text: 'Winkel öffnen, auf die Füße spielen oder Lücken zwischen den Gegnern suchen'
			},
			{ id: 'C', text: 'Den Ballwechsel bewusst abbrechen' },
			{ id: 'D', text: 'Immer in die Mitte der eigenen Hälfte spielen' }
		],
		correctOptionId: 'B',
		explanation:
			'Am Netz sind Platzierung, Winkel und Druck auf die Füße oft effektiver als reine Schlaghärte.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'experte-6',
		difficulty: 'experte',
		question: 'Warum ist die Mitte zwischen zwei Doppel-Gegnern häufig ein gutes Ziel?',
		options: [
			{ id: 'A', text: 'Weil dort nie jemand steht' },
			{ id: 'B', text: 'Weil Zuständigkeiten unklar werden können und Winkel reduziert werden' },
			{ id: 'C', text: 'Weil der Ball dort doppelt zählt' },
			{ id: 'D', text: 'Weil nur dorthin gespielt werden darf' }
		],
		correctOptionId: 'B',
		explanation:
			'Die Mitte kann Kommunikation und Zuständigkeit der Gegenseite testen und nimmt ihr oft Winkel für den Rückschlag.',
		relatedGuideSlugs: ['tennis-doppel', 'tennis-taktik']
	},
	{
		id: 'experte-7',
		difficulty: 'experte',
		question:
			'Du verteidigst tief im Doppel, die Gegenseite steht sehr nah am Netz. Welche Option ist häufig sinnvoll?',
		options: [
			{ id: 'A', text: 'Ein kontrollierter Lob über beide Gegner:innen' },
			{ id: 'B', text: 'Ein langsamer Ball direkt ins eigene Netz' },
			{ id: 'C', text: 'Ein Smash aus der tiefen Verteidigung' },
			{ id: 'D', text: 'Ein flacher Slice ohne jede Höhe direkt in die Mitte' }
		],
		correctOptionId: 'A',
		explanation:
			'Ein guter Lob kann das Netz zurückerobern und Druck aus der Situation nehmen.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'experte-8',
		difficulty: 'experte',
		question: 'Was zeichnet gute Doppel-Taktik aus?',
		options: [
			{ id: 'A', text: 'Beide Spieler:innen treffen unabhängig voneinander Entscheidungen' },
			{ id: 'B', text: 'Gemeinsame Bewegungen, klare Rollen und abgestimmte Risikowahl' },
			{ id: 'C', text: 'Nur die stärkere Person spielt alle Bälle' },
			{ id: 'D', text: 'Möglichst große Abstände zwischen den Spieler:innen' }
		],
		correctOptionId: 'B',
		explanation:
			'Erfolgreiche Doppel-Teams bewegen sich abgestimmt und treffen taktische Entscheidungen gemeinsam.',
		relatedGuideSlugs: ['tennis-doppel']
	},
	{
		id: 'experte-9',
		difficulty: 'experte',
		question: 'Wann kann ein langsamer Ball effektiver sein als ein harter Ball?',
		options: [
			{
				id: 'A',
				text: 'Wenn er die Gegenseite zu einem unbequemen Treffpunkt oder einer schwierigen Bewegung zwingt'
			},
			{ id: 'B', text: 'Nie' },
			{ id: 'C', text: 'Nur beim Einspielen vor dem Match' },
			{ id: 'D', text: 'Nur bei Matchball' }
		],
		correctOptionId: 'A',
		explanation:
			'Ein langsamer, gut platzierter Ball kann den Rhythmus der Gegenseite brechen und Fehler provozieren.',
		relatedGuideSlugs: ['tennis-taktik']
	},
	{
		id: 'experte-10',
		difficulty: 'experte',
		question: 'Was ist ein Zeichen für taktische Reife im Tennis?',
		options: [
			{ id: 'A', text: 'Jeden Ball maximal riskant spielen' },
			{ id: 'B', text: 'Zwischen Risiko, Kontrolle, Platzierung und Position bewusst wählen' },
			{ id: 'C', text: 'Grundsätzlich keine Lobs zu spielen' },
			{ id: 'D', text: 'Nur durch reine Kraft Punkte machen zu wollen' }
		],
		correctOptionId: 'B',
		explanation: 'Gute Spieler:innen wählen situationsabhängig zwischen Sicherheit, Druck und Risiko.',
		relatedGuideSlugs: ['tennis-taktik', 'tennis-training']
	}
];
