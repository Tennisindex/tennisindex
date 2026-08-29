// ============================================================
// TennisIndex — Ratgeber-Inhalte (Deutsch)
// ============================================================
// Lokale Content-Quelle, kein CMS. Neuen Artikel ergänzen: Objekt vom
// Typ GuideArticle an dieses Array anhängen, Slug in relatedSlugs
// anderer Artikel verlinken wo sinnvoll — mehr braucht es nicht, die
// Routen unter /ratgeber/[slug] lesen direkt aus diesem Array.
//
// Bewusst keine erfundenen Zahlen, Preise oder Verbandsangaben:
// wo etwas variiert (Preise, Ausstattung, Vereinsregeln), steht das
// hier auch so da, statt eine falsche Genauigkeit vorzutäuschen.

import type { GuideArticle } from '../../guides';

export const GUIDES_DE: GuideArticle[] = [
	// ------------------------------------------------------------
	// REGELN & WISSEN
	// ------------------------------------------------------------
	{
		slug: 'tennis-regeln',
		title: 'Tennis-Regeln einfach erklärt: Der komplette Guide für Anfänger',
		metaTitle: 'Tennis-Regeln einfach erklärt: Der komplette Guide für Anfänger',
		metaDescription:
			'Die wichtigsten Tennis-Regeln verständlich erklärt: Aufschlag, Zählweise, Aus, Let und typische Spielsituationen.',
		excerpt:
			'Aufschlag, Zählweise und Aus-Regeln — alles, was du für dein erstes Match wissen musst, kompakt erklärt.',
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
				heading: 'Was ist Tennis?',
				paragraphs: [
					'Tennis ist ein Rückschlagsport, der sowohl im Einzel (1 gegen 1) als auch im Doppel (2 gegen 2) gespielt wird. Gespielt wird auf einem rechteckigen Platz, der durch ein Netz in zwei Hälften geteilt ist — auf Sand (Asche), Hartplatz oder Rasen.',
					'Ziel ist es, den Ball so über das Netz zu schlagen, dass er im gegnerischen Feld aufkommt und die Gegenseite ihn nicht regulär zurückspielen kann. Anders als bei manchen anderen Rückschlagsportarten gibt es keine Wände oder Gitter, die aktiv mitspielen — der Ball ist aus, sobald er außerhalb der Linien landet.',
					'Geschlagen wird mit einem besaiteten Schläger, der Ball ist ein mit Filz überzogener, luftgefüllter Gummiball. Für Kinder und blutige Anfänger:innen gibt es zusätzlich langsamere Schaumstoff- und Filzbälle mit weniger Druck (Stufen Rot/Orange/Grün vor dem "normalen" gelben Ball).'
				]
			},
			{
				id: 'spielfeld-und-grundprinzip',
				heading: 'Spielfeld und Grundprinzip',
				paragraphs: [
					'Ein Tennisplatz ist im Einzel 8,23 m breit und 23,77 m lang. Für Doppel kommen links und rechts noch je 1,37 m breite Zusatzstreifen ("Gassen") dazu, die im Einzel nicht zählen. Das Netz ist an den Pfosten etwas höher (1,07 m) als in der Mitte (0,914 m).',
					'Jede Platzhälfte hat direkt hinter dem Netz zwei Aufschlagfelder (links und rechts), dahinter bis zur Grundlinie das restliche Spielfeld für den weiteren Ballwechsel.',
					'Grundprinzip: Der Ball muss nach jedem Schlag im gegnerischen Feld innerhalb der Linien aufkommen. Danach darf er genau einmal auf dem Boden aufspringen, bevor die Gegenseite ihn zurückschlägt — kommt er ein zweites Mal auf, ist der Punkt vorbei. Ein Ball direkt aus der Luft zu nehmen (Volley), bevor er aufkommt, ist jederzeit erlaubt.'
				]
			},
			{
				id: 'zaehlweise',
				heading: 'Zählweise beim Tennis',
				paragraphs: [
					'Innerhalb eines Spiels (Games) zählt man 15, 30, 40 und Spielgewinn. Steht es 40:40, heißt das Einstand — danach muss eine Seite zwei Punkte in Folge gewinnen, um das Spiel zu holen (der erste dieser beiden Punkte heißt Vorteil).',
					'Viele Freizeit- und manche Liga-Runden spielen bei Einstand stattdessen den "entscheidenden Punkt" (No-Ad): Wer den nächsten Ballwechsel gewinnt, holt direkt das Spiel — das ist Vereinbarungssache und steht meist vorher fest.',
					'Sechs gewonnene Spiele (mit mindestens zwei Spielen Vorsprung) ergeben einen Satz. Steht es 6:6, entscheidet meist ein Tiebreak: Hier zählt man 1, 2, 3 usw., gewonnen ist er mit mindestens 7 Punkten und zwei Punkten Vorsprung. Ein Match geht in der Regel über zwei Gewinnsätze, im dritten Satz spielen viele Amateur-Ligen statt eines vollen Satzes einen Match-Tiebreak bis 10.'
				]
			},
			{
				id: 'aufschlag-regeln',
				heading: 'Aufschlag-Regeln',
				paragraphs: [
					'Der Aufschlag erfolgt von oben: Du wirfst den Ball hoch und schlägst ihn, bevor er den Boden berührt, diagonal in das gegnerische Aufschlagfeld. Dabei musst du hinter der Grundlinie stehen — sie darfst du vor dem Treffmoment weder berühren noch übertreten (Fußfehler).',
					'Jeder Punkt beginnt abwechselnd von der rechten Seite (bei geradem Punktestand) und der linken Seite (bei ungeradem Punktestand). Nach jedem gewonnenen Spiel wechselt der Aufschlag zur anderen Seite, im Doppel wechseln sich die beiden Partner:innen dabei innerhalb ihres Teams ab.',
					'Landet der erste Aufschlag nicht regulär im Feld, gibt es einen zweiten Versuch. Geht auch der daneben, ist das ein Doppelfehler und der Punkt geht direkt an die Gegenseite. Berührt der Aufschlag die Netzkante und landet trotzdem korrekt im Feld, ist das ein "Let" — der Aufschlag wird wiederholt, ohne dass er zählt.'
				]
			},
			{
				id: 'aus-und-linien',
				heading: 'Wann ist der Ball im Aus?',
				paragraphs: [
					'Eine Linie gehört zum Feld dazu: Berührt der Ball auch nur einen Teil der Linie, gilt er als "gut" (in). Erst wenn er komplett außerhalb aller Linien aufkommt, ist er aus.',
					'Beim Grundschlag zählt dafür die gesamte Feldbreite inklusive der Doppelgassen nur im Doppel — im Einzel sind die äußeren Gassen kein gültiges Feld. Beim Aufschlag zählt dagegen ausschließlich das jeweils diagonale Aufschlagfeld.',
					'Springt der Ball ein zweites Mal auf, bevor er zurückgeschlagen wird, ist der Punkt ebenfalls vorbei — unabhängig davon, wo der zweite Bodenkontakt stattfindet.'
				]
			},
			{
				id: 'let-und-stoerungen',
				heading: 'Let, Netzberührung und Störungen',
				paragraphs: [
					'"Let" heißt: Der Punkt zählt nicht und wird wiederholt. Das passiert klassischerweise, wenn der Aufschlag die Netzkante streift und trotzdem korrekt im Aufschlagfeld landet — oder wenn während des Ballwechsels eine echte Störung von außen auftritt (z. B. ein Ball von einem Nachbarplatz rollt ins Feld).',
					'Berührt dagegen ein Ball im normalen Ballwechsel (nicht beim Aufschlag) das Netz und fällt danach regulär ins gegnerische Feld, bleibt er im Spiel — das ist kein Let, sondern ein ganz normaler, gültiger Schlag.'
				]
			},
			{
				id: 'anfaengerfehler',
				heading: 'Typische Fehler von Anfängern',
				box: {
					kind: 'mistakes',
					title: 'Diese Fehler siehst du in fast jedem Anfänger-Match',
					items: [
						'Beim Aufschlag über die Grundlinie treten (Fußfehler), oft unbemerkt.',
						'Zählweise durcheinanderbringen, besonders bei Einstand und Vorteil.',
						'Einen Ball spielen wollen, der schon zweimal aufgekommen ist.',
						'Aus Unsicherheit jeden Ball voll durchziehen, statt erst einmal sicher ins Feld zu spielen.',
						'Beim Doppel nicht klären, wer am Netz und wer hinten steht — dadurch bleiben Bälle in der Mitte liegen.'
					]
				}
			},
			{
				id: 'checkliste',
				heading: 'Kurze Regel-Checkliste',
				box: {
					kind: 'checklist',
					title: 'Vor deinem ersten Match',
					items: [
						'Aufschlag von oben, hinter der Grundlinie, diagonal ins richtige Aufschlagfeld.',
						'Ball darf nur einmal aufkommen, bevor er zurückgespielt wird.',
						'Zählweise: 15, 30, 40, Spiel — Einstand bei 40:40, danach zwei Punkte Vorsprung nötig (außer bei No-Ad).',
						'Linie gehört zum Feld — Ball auf der Linie ist gut, nicht aus.',
						'Volleys sind jederzeit erlaubt, außer der Ball hat den Boden noch nicht berührt und du stehst im gegnerischen Feld.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Ist Tennis schwer zu lernen?',
				answer:
					'Die Grundregeln lassen sich in wenigen Minuten verstehen, und erste einfache Ballwechsel gelingen meist schon nach ein paar Trainingsstunden. Konstanz, Beinarbeit und Taktik entwickeln sich dagegen über Monate — typisch für einen Sport mit niedriger Einstiegshürde, aber viel Tiefe nach oben.'
			},
			{
				question: 'Was passiert bei Einstand?',
				answer:
					'Bei 40:40 muss eine Seite zwei Punkte in Folge gewinnen, um das Spiel zu holen. Den ersten dieser beiden Punkte nennt man Vorteil — wird der nächste Punkt ebenfalls gewonnen, ist das Spiel vorbei, sonst geht es zurück auf Einstand. Manche Freizeitrunden spielen stattdessen No-Ad: ein einzelner entscheidender Punkt.'
			},
			{
				question: 'Zählt ein Ball auf der Linie als aus?',
				answer:
					'Nein — im Gegenteil: Berührt der Ball die Linie auch nur an einer Stelle, gilt er als gut. Aus ist er erst, wenn er vollständig außerhalb aller Feldlinien aufkommt.'
			},
			{
				question: 'Wie viele Sätze werden normalerweise gespielt?',
				answer:
					'Im Amateur- und Ligabereich meist zwei Gewinnsätze, wobei viele Ligen im dritten Satz statt eines vollen Satzes einen Match-Tiebreak bis 10 spielen, um Zeit zu sparen. Auf Profi-Ebene sind bei manchen Turnieren (v. a. bei den Herren bei Grand Slams) auch drei Gewinnsätze üblich.'
			}
		]
	},
	{
		slug: 'tennis-einzel-doppel',
		title: 'Tennis Einzel vs. Doppel: Die wichtigsten Unterschiede',
		metaTitle: 'Tennis Einzel vs. Doppel: Die wichtigsten Unterschiede einfach erklärt',
		metaDescription:
			'Was unterscheidet Einzel und Doppel im Tennis wirklich — Spielfeld, Taktik, Aufschlag und welches Format zu dir passt.',
		excerpt:
			'Gleiche Sportart, zwei ganz unterschiedliche Spiele: So unterscheiden sich Einzel und Doppel in Feld, Taktik und Tempo.',
		category: 'regeln',
		difficulty: 'einsteiger',
		readingTime: 6,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-regeln', 'tennis-doppel', 'tennis-taktik'],
		sections: [
			{
				id: 'ueberblick',
				heading: 'Zwei Formate, eine Sportart',
				paragraphs: [
					'Die Grundregeln — Zählweise, Aufschlag, Aus-Linien im Grundprinzip — sind bei Einzel und Doppel identisch. Trotzdem spielen sich beide Formate sehr unterschiedlich: Im Einzel deckst du das ganze Feld allein ab, im Doppel teilst du dir Feld und Verantwortung mit einer Partnerin oder einem Partner.',
					'TennisIndex führt für beide Formate ein eigenes, unabhängiges Rating — dein Einzel-Level sagt nichts zwingend über dein Doppel-Level aus, und umgekehrt. Viele Spieler:innen sind in einem Format deutlich stärker als im anderen.'
				]
			},
			{
				id: 'spielfeldgroesse',
				heading: 'Spielfeld: Mit oder ohne Gassen',
				paragraphs: [
					'Das Feld selbst ist bei beiden Formaten gleich groß, aber im Doppel zählen zusätzlich die beiden äußeren Gassen (je 1,37 m) als gültiges Feld — das Spielfeld ist im Doppel also insgesamt breiter nutzbar. Beim Aufschlag ändert sich dagegen nichts: Das Aufschlagfeld ist in beiden Formaten identisch.',
					'Im Einzel bedeutet das kompaktere Feld: mehr Laufwege für dich allein, aber auch klarere Verantwortung — jeder Fehler und jeder gute Punkt ist eindeutig dir zuzuordnen.'
				]
			},
			{
				id: 'taktik-unterschiede',
				heading: 'Taktik: Laufarbeit vs. Netzpositionierung',
				paragraphs: [
					'Im Einzel dreht sich viel um Grundlinienspiel, Ausdauer und die Fähigkeit, den Gegner im Feld hin und her zu bewegen — Punkte werden oft über mehrere Schläge hinweg erarbeitet.',
					'Im Doppel entscheidet dagegen häufiger die Netzposition: Ein Team, das früh und sicher am Netz steht, hat mehr Chancen auf kurze, druckvolle Punkte. Kommunikation mit der Partnerin oder dem Partner (wer spielt welchen Ball, wer deckt die Mitte) wird fast so wichtig wie die Schlagtechnik selbst.'
				]
			},
			{
				id: 'aufschlag-unterschiede',
				heading: 'Aufschlag und Return',
				paragraphs: [
					'Im Einzel schlägst du jeden zweiten Punkt selbst auf und musst danach das komplette Feld allein verteidigen. Im Doppel wechseln sich beide Partner:innen innerhalb eines Spiels mit dem Aufschlag ab, während die aufschlagende Person nach dem Aufschlag oft direkt ans Netz vorrückt — die Partnerin oder der Partner steht dabei meist schon am Netz.'
				]
			},
			{
				id: 'was-passt-zu-dir',
				heading: 'Was passt zu dir?',
				paragraphs: [
					'Wer gerne läuft, lange Ballwechsel mag und unabhängig spielen will, findet im Einzel mehr Reiz. Wer taktisches Zusammenspiel, kürzere Punkte und geselliges Spielen mag, ist im Doppel oft besser aufgehoben — viele Spieler:innen spielen einfach beides, je nach Tagesform und Verfügbarkeit von Mitspieler:innen.'
				]
			}
		],
		faq: [
			{
				question: 'Ist Doppel einfacher als Einzel?',
				answer:
					'Nicht unbedingt einfacher, aber anders anspruchsvoll: Du legst weniger Strecke zurück, musst dafür aber schneller reagieren, näher am Netz spielen und dich ständig mit deiner Partnerin oder deinem Partner abstimmen.'
			},
			{
				question: 'Zählt für Doppel dieselbe Zählweise wie im Einzel?',
				answer:
					'Ja, Punkte, Spiele und Sätze werden identisch gezählt. Der einzige strukturelle Unterschied ist, dass sich innerhalb eines Teams der Aufschlag zwischen den Partner:innen abwechselt.'
			},
			{
				question: 'Brauche ich für Doppel eine feste Partnerin oder einen festen Partner?',
				answer:
					'Nein — viele Vereine und die TennisIndex-Matchsuche helfen dabei, spontan passende Doppelpartner:innen zu finden. Ein eingespieltes Team hat zwar einen Vorteil bei der Kommunikation, aber auch neu zusammengewürfelte Paarungen funktionieren gut.'
			}
		]
	},
	{
		slug: 'tennis-begriffe',
		title: 'Tennis-Begriffe erklärt: Ass, Break, Slice, Volley und mehr',
		metaTitle: 'Tennis-Begriffe erklärt: Das große Glossar für Einsteiger',
		metaDescription:
			'Die wichtigsten Tennis-Begriffe verständlich erklärt: Ass, Break, Slice, Volley, Stoppball, Passierschlag und mehr.',
		excerpt:
			'Ass, Break, Slice, Stoppball — ein kompaktes Glossar der wichtigsten Tennis-Begriffe für Einsteiger:innen.',
		category: 'regeln',
		difficulty: 'einsteiger',
		readingTime: 5,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-regeln', 'tennis-technik', 'tennis-taktik'],
		sections: [
			{
				id: 'einleitung',
				heading: 'Warum ein eigenes Glossar?',
				paragraphs: [
					'Beim ersten Vereinstraining oder beim Zuschauen fallen schnell Begriffe, die ohne Erklärung wenig Sinn ergeben — Ass, Break, Unforced Error. Dieses Glossar sammelt die wichtigsten Begriffe an einem Ort, damit du sie schnell nachschlagen kannst.'
				]
			},
			{
				id: 'die-wichtigsten-begriffe',
				heading: 'Die wichtigsten Begriffe auf einen Blick',
				box: {
					kind: 'info',
					title: 'Von A bis V',
					items: [
						'Ass: Ein Aufschlag, den die Gegenseite gar nicht berührt — direkter Punktgewinn.',
						'Break: Ein Aufschlagspiel gewinnen, obwohl die Gegenseite aufgeschlagen hat.',
						'Deuce (Einstand): Punktestand 40:40 innerhalb eines Spiels.',
						'Doppelfehler: Beide Aufschlagversuche gehen daneben — Punkt für die Gegenseite.',
						'Grundlinie: Die hintere Begrenzungslinie des Feldes, von der aus aufgeschlagen wird.',
						'Let: Punkt wird wiederholt, meist weil der Aufschlag die Netzkante berührt hat.',
						'Lob: Ein hoher Ball, der die Gegenseite (oft am Netz stehend) überspielt.',
						'Passierschlag: Ein Ball, der an einer am Netz stehenden Person seitlich vorbeigeschlagen wird.',
						'Return: Der erste Schlag nach dem gegnerischen Aufschlag.',
						'Slice: Ein Schlag mit Unterschnitt, der Ball fliegt flacher und springt niedriger ab.',
						'Stoppball: Ein kurzer, sanft gespielter Ball knapp hinter das Netz.',
						'Tiebreak: Entscheidungsspiel bei Satzstand 6:6, gezählt in einzelnen Punkten.',
						'Topspin: Ein Schlag mit Vorwärtsdrall, der Ball springt nach dem Aufkommen steiler ab.',
						'Unforced Error: Ein vermeidbarer eigener Fehler ohne erkennbaren Druck der Gegenseite.',
						'Volley: Der Ball wird direkt aus der Luft gespielt, bevor er den Boden berührt.'
					]
				}
			},
			{
				id: 'begriffe-rund-ums-match',
				heading: 'Begriffe rund ums Match',
				paragraphs: [
					'Ein "Aufschlagverlust" bedeutet, das eigene Aufschlagspiel zu verlieren — im Amateurbereich häufiger als bei Profis, wo das eigene Aufschlagspiel meist als klarer Vorteil gilt. Ein "Comeback" beschreibt, einen deutlichen Rückstand noch aufzuholen.',
					'"Unerzwungener Fehler" und "erzwungener Fehler" unterscheiden, ob ein Fehler aus eigenem Antrieb passiert (z. B. Ball ins Netz ohne Gegnerdruck) oder durch einen guten gegnerischen Schlag provoziert wurde — bei TennisIndex spielt diese Unterscheidung für dein Rating keine Rolle, gewertet wird nur das Endergebnis.'
				]
			}
		],
		faq: [
			{
				question: 'Was ist der Unterschied zwischen Slice und Topspin?',
				answer:
					'Slice wird mit Unterschnitt gespielt: Der Ball fliegt flacher und springt nach dem Aufkommen niedriger und flacher ab. Topspin wird mit Vorwärtsdrall gespielt: Der Ball fliegt in einem höheren Bogen und springt nach dem Aufkommen steiler und schneller nach vorne ab.'
			},
			{
				question: 'Was bedeutet "Break"?',
				answer:
					'Ein Break liegt vor, wenn du das Aufschlagspiel deiner Gegnerin oder deines Gegners gewinnst — also ein Spiel holst, obwohl die andere Seite aufgeschlagen hat. Das gilt taktisch oft als besonders wertvoller Punktgewinn.'
			}
		]
	},
	// ------------------------------------------------------------
	// AUSRÜSTUNG
	// ------------------------------------------------------------
	{
		slug: 'tennis-ausruestung',
		title: 'Tennis-Ausrüstung: Was du zum Spielen wirklich brauchst',
		metaTitle: 'Tennis-Ausrüstung für Anfänger: Die komplette Übersicht',
		metaDescription:
			'Schläger, Bälle, Schuhe, Kleidung: Diese Tennis-Ausrüstung brauchst du wirklich zum Einstieg — und was warten kann.',
		excerpt:
			'Schläger, Bälle, Schuhe und Kleidung: eine ehrliche Übersicht, was du zum Einstieg wirklich brauchst.',
		category: 'ausruestung',
		difficulty: 'einsteiger',
		readingTime: 7,
		updatedAt: '2026-08-01',
		popular: true,
		relatedSlugs: ['tennis-schlaeger', 'tennis-schuhe', 'tennis-kosten'],
		sections: [
			{
				id: 'grundausstattung',
				heading: 'Die Grundausstattung',
				paragraphs: [
					'Für deine ersten Stunden brauchst du im Kern nur drei Dinge: einen Tennisschläger, passende Tennisschuhe und bequeme Sportkleidung. Bälle stellt beim ersten Vereinstraining oder Schnupperkurs meist der Verein oder die Trainerin bzw. der Trainer.',
					'Alles andere — eigene Bälle, Schlägertasche, Griffbänder, Handtuch am Netzpfosten — ist praktisch, aber am Anfang nicht entscheidend. Kaufe lieber wenig und gezielt, als gleich die komplette Ausrüstung auf einmal anzuschaffen.'
				]
			},
			{
				id: 'schlaeger',
				heading: 'Schläger',
				paragraphs: [
					'Für den Einstieg eignet sich ein leichterer Schläger mit größerem Schlägerkopf — das vergrößert die Trefffläche und verzeiht Fehler eher als ein kleiner, schwerer Turnierschläger. Viele Vereine verleihen für Schnupperstunden Leihschläger, sodass ein eigener Kauf nicht sofort nötig ist.',
					'Details zur Schlägerwahl (Kopfgröße, Gewicht, Griffstärke) findest du im eigenen Schläger-Guide.'
				]
			},
			{
				id: 'baelle',
				heading: 'Bälle',
				paragraphs: [
					'Reguläre Tennisbälle gibt es in zwei Ausführungen: "Regular Duty" für weiche Beläge wie Sand, "Extra Duty" mit robusterem Filz für Hartplatz. Für Kinder und blutige Anfänger:innen gibt es zusätzlich langsamere, drucklosere Bälle (Rot/Orange/Grün), die den Einstieg erleichtern.',
					'Ein Ball verliert mit der Zeit Innendruck und Sprungkraft — für lockeres Training reicht das trotzdem meist noch lange aus.'
				]
			},
			{
				id: 'schuhe-und-kleidung',
				heading: 'Schuhe und Kleidung',
				paragraphs: [
					'Normale Laufschuhe sind für Tennis ungeeignet: Ihnen fehlt die seitliche Stabilität für die schnellen Richtungswechsel, und ihr Profil passt oft nicht zum Belag. Details dazu im eigenen Schuh-Guide.',
					'Bei der Kleidung zählt vor allem Bewegungsfreiheit und atmungsaktives Material — auf Sandplätzen ist helle Kleidung zusätzlich praktisch, weil roter Sandstaub auf dunklen Stoffen stärker auffällt.'
				]
			},
			{
				id: 'kann-warten',
				heading: 'Kann warten, bis du weißt, ob Tennis dein Sport wird',
				box: {
					kind: 'tips',
					title: 'Erst mal sparen',
					items: [
						'Ein zweiter, teurerer Schläger — der erste reicht locker für die ersten Monate.',
						'Eigene Schlägertasche mit mehreren Fächern.',
						'Griffband-Vorrat und spezielle Dämpfer.',
						'Turnierbälle in größeren Gebinden.',
						'Spezielle Tennis-Uhren oder Tracking-Wearables.'
					]
				}
			},
			{
				id: 'vor-dem-kauf',
				heading: 'Vor dem ersten Kauf',
				box: {
					kind: 'checklist',
					title: 'Kurz gecheckt',
					items: [
						'Erst ein bis zwei Schnupperstunden mit Leihschläger nehmen, bevor du selbst kaufst.',
						'Beim Schlägerkauf im Fachgeschäft beraten lassen — Griffstärke passt nicht "nach Gefühl".',
						'Auf den Hauptbelag deines Vereins achten (Sand vs. Hartplatz) bei der Schuhwahl.',
						'Kleidung nach Bewegungsfreiheit wählen, nicht nach Optik allein.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Brauche ich sofort einen eigenen Schläger?',
				answer:
					'Nein. Für die ersten Schnupperstunden reicht meist ein Leihschläger vom Verein. Erst wenn klar ist, dass du regelmäßig weiterspielst, lohnt sich der eigene Kauf mit passender Beratung.'
			},
			{
				question: 'Reichen normale Sportschuhe zum Tennisspielen?',
				answer:
					'Für eine einzelne Schnupperstunde notfalls ja, auf Dauer aber nicht: Tennisschuhe bieten seitliche Stabilität und ein zum Belag passendes Profil, das normale Laufschuhe nicht haben — wichtig, um Verletzungen vorzubeugen.'
			}
		]
	},
	{
		slug: 'tennis-schlaeger',
		title: 'Tennisschläger für Anfänger: Kopfgröße, Gewicht und Auswahl erklärt',
		metaTitle: 'Tennisschläger für Anfänger: Der komplette Kaufratgeber',
		metaDescription:
			'Kopfgröße, Gewicht, Griffstärke und Besaitung: So findest du als Anfänger:in den passenden Tennisschläger.',
		excerpt:
			'Kopfgröße, Gewicht und Griffstärke einfach erklärt — so findest du deinen ersten passenden Tennisschläger.',
		category: 'ausruestung',
		difficulty: 'einsteiger',
		readingTime: 8,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-ausruestung', 'tennis-technik', 'tennis-kosten'],
		sections: [
			{
				id: 'kopfgroesse',
				heading: 'Kopfgröße: größer verzeiht mehr',
				paragraphs: [
					'Die Schlägerkopfgröße wird in Quadratzoll angegeben, üblich sind etwa 95 bis 115 Quadratzoll. Ein größerer Kopf bietet eine größere Trefffläche ("Sweet Spot") und verzeiht ungenaue Treffer eher — ideal für den Einstieg.',
					'Erfahrenere Spieler:innen greifen oft zu kleineren Köpfen, weil sie damit präziser und kontrollierter spielen können, sobald die Technik sitzt. Für die ersten ein bis zwei Jahre lohnt sich fast immer die größere, verzeihendere Variante.'
				]
			},
			{
				id: 'gewicht-und-balance',
				heading: 'Gewicht und Balance',
				paragraphs: [
					'Anfänger-Schläger wiegen unbespannt meist zwischen 250 und 285 Gramm — leicht genug, um ihn über eine ganze Trainingsstunde ohne Ermüdung zu führen. Schwerere Schläger (ab etwa 300 Gramm) bieten mehr Stabilität und Power bei festem Kontakt, verlangen aber mehr Armkraft und saubere Technik.',
					'Die Balance (kopflastig, griffstücklastig oder ausgeglichen) beeinflusst, wie wendig sich der Schläger anfühlt. Kopflastige Schläger liefern mehr Power aus wenig Schwung, griffstücklastige mehr Kontrolle und Manövrierbarkeit — für den Einstieg reicht eine ausgeglichene bis leicht griffstücklastige Balance meist am besten.'
				]
			},
			{
				id: 'griffstaerke',
				heading: 'Griffstärke',
				paragraphs: [
					'Die Griffstärke wird meist in Griffgrößen von L0 bis L5 (bzw. 4 1/8 bis 4 5/8 Zoll) angegeben. Ein zu dicker Griff erschwert das Handgelenk-Zuklappen bei manchen Schlägen, ein zu dünner Griff zwingt die Hand, fester zuzugreifen als nötig — beides begünstigt auf Dauer Verspannungen.',
					'Im Fachgeschäft lässt sich die passende Größe unkompliziert messen; als grobe Faustregel sollte zwischen Fingerspitzen und Handballen bei umschlossenem Griff etwa eine Fingerbreite Platz bleiben.'
				]
			},
			{
				id: 'besaitung',
				heading: 'Besaitung und Spannung',
				paragraphs: [
					'Die meisten Schläger werden fertig bespannt verkauft, meist mit synthetischem Nylon-Material — solide und günstig für den Einstieg. Naturdarm- oder Multifilament-Saiten bieten mehr Spielgefühl, sind aber teurer.',
					'Die Saitenspannung beeinflusst Kontrolle und Power: Straffer bespannt bedeutet meist mehr Kontrolle, aber weniger natürliche Power; lockerer bespannt umgekehrt. Für den Einstieg ist die Werksbespannung fast immer eine gute Ausgangsbasis, Feinjustierung kommt später mit wachsendem Spielgefühl.'
				]
			},
			{
				id: 'haeufiger-frust',
				heading: 'Das führt oft zu Frust mit dem neuen Schläger',
				box: {
					kind: 'mistakes',
					title: 'Typische Kauffehler',
					items: [
						'Ein "Profi-Schläger" mit kleinem Kopf und hohem Gewicht, weil das Lieblingsvorbild ihn spielt.',
						'Griffstärke rein nach Handgröße geschätzt, ohne Anprobe.',
						'Zu straff bespannt, "weil härter härter klingt" — das kostet vor allem Power und Komfort.',
						'Der Schläger bleibt monatelang unbenutzt in der Ecke, weil er sich von Anfang an falsch anfühlte.'
					]
				}
			},
			{
				id: 'vor-dem-kauf-schlaeger',
				heading: 'Vor dem Kauf prüfen',
				box: {
					kind: 'checklist',
					title: 'Kurz gecheckt',
					items: [
						'Kopfgröße ab etwa 100 Quadratzoll für den Einstieg.',
						'Gewicht unbespannt im Bereich 250–285 Gramm.',
						'Griffstärke im Fachgeschäft messen lassen, nicht schätzen.',
						'Erst zur Probe schwingen (viele Läden bieten Testschläger), dann kaufen.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Was kostet ein guter Einsteiger-Schläger?',
				answer:
					'Die Preisspanne ist groß und ändert sich laufend — ein Fachgeschäft vor Ort gibt dir dazu die aktuellste und verlässlichste Auskunft. Wichtiger als der Preis ist für den Einstieg ohnehin die passende Kopfgröße, das Gewicht und die richtige Griffstärke.'
			},
			{
				question: 'Reicht ein gebrauchter Schläger zum Einstieg?',
				answer:
					'Ja, solange Kopfgröße, Gewicht und Griffstärke passen. Auf den Zustand der Bespannung solltest du trotzdem achten — stark ausgeleierte oder brüchige Saiten lassen sich meist günstig neu bespannen.'
			}
		]
	},
	{
		slug: 'tennis-schuhe',
		title: 'Tennisschuhe: Worauf du beim Kauf achten solltest',
		metaTitle: 'Tennisschuhe kaufen: Sohle, Belag und Passform erklärt',
		metaDescription:
			'Sandplatz, Hartplatz oder All-Court: Diese Sohlenprofile und Kriterien solltest du beim Kauf von Tennisschuhen kennen.',
		excerpt:
			'Sandplatz oder Hartplatz — das richtige Sohlenprofil macht bei Tennisschuhen den größten Unterschied.',
		category: 'ausruestung',
		difficulty: 'einsteiger',
		readingTime: 6,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-ausruestung', 'tennis-schlaeger', 'tennis-fuer-anfaenger'],
		sections: [
			{
				id: 'warum-spezielle-schuhe',
				heading: 'Warum spezielle Tennisschuhe?',
				paragraphs: [
					'Tennis verlangt viele schnelle Richtungswechsel, Stopps und seitliche Ausfallschritte — deutlich mehr seitliche Belastung als Laufen. Tennisschuhe sind dafür mit verstärkten seitlichen Stützzonen und einer robusteren, flacheren Sohle gebaut als normale Laufschuhe.',
					'Wer dauerhaft mit Laufschuhen spielt, riskiert nicht nur schlechteren Halt, sondern auch schnelleren Verschleiß der Sohle und ein höheres Verletzungsrisiko bei abrupten Bewegungen.'
				]
			},
			{
				id: 'sohle-nach-belag',
				heading: 'Sohlenprofil nach Belag',
				paragraphs: [
					'Für Sandplatz (Asche) eignen sich Schuhe mit feinem Fischgrätenmuster (Herringbone) — dieses Profil greift gut in losen Sand und lässt trotzdem ein kontrolliertes Rutschen beim Abstoppen zu, was auf Sand sogar gewünscht ist.',
					'Für Hartplatz sind robustere, meist etwas gröbere Profile üblich, die dem höheren Abrieb standhalten. "All-Court"-Schuhe mit einem gemischten Profil sind ein guter Kompromiss, wenn du auf wechselnden Belägen spielst.',
					'Rasenplätze (im Amateurbereich seltener) brauchen wiederum eigene, meist mit kleinen Noppen versehene Rasenschuhe — normale Sand- oder Hartplatzschuhe rutschen darauf zu stark oder beschädigen den Belag.'
				]
			},
			{
				id: 'passform-und-daempfung',
				heading: 'Passform und Dämpfung',
				paragraphs: [
					'Tennisschuhe sollten vorne etwas mehr Platz lassen als normale Alltagsschuhe, weil der Fuß bei seitlichen Bewegungen leicht nach vorne rutscht. Ein fester Fersenhalt ist wichtiger als maximale Polsterung — zu weiche Dämpfung kann bei schnellen Richtungswechseln sogar instabiler wirken.',
					'Wer Knie- oder Gelenkprobleme hat, profitiert oft von etwas mehr Dämpfung im Vorfußbereich; hier lohnt sich im Zweifel eine kurze Beratung im Fachgeschäft.'
				]
			},
			{
				id: 'falsche-wahl',
				heading: 'Diese Schuhwahl bereut man oft schnell',
				box: {
					kind: 'mistakes',
					title: 'Häufige Fehlkäufe',
					items: [
						'Laufschuhe fürs erste Vereinstraining, weil "die stehen eh schon im Schrank".',
						'Hartplatzschuhe auf Sandplatz — schlechterer Halt und schnellerer Verschleiß.',
						'Schuhgröße zu eng gewählt, ohne Platz für das Vorrutschen des Fußes.',
						'Vor dem Kauf keine kurze Proberunde in der Halle oder auf dem Testplatz gemacht.'
					]
				}
			},
			{
				id: 'vor-dem-schuhkauf',
				heading: 'Vor dem Schuhkauf',
				box: {
					kind: 'checklist',
					title: 'Kurz gecheckt',
					items: [
						'Sohlenprofil zum Hauptbelag deines Vereins passend wählen.',
						'Etwas mehr Platz im Vorfußbereich einplanen als bei Alltagsschuhen.',
						'Fersenhalt und seitliche Stabilität testen, nicht nur die Dämpfung.',
						'Bei wechselnden Belägen: All-Court-Modell in Betracht ziehen.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Kann ich mit einem Schuh auf allen Belägen spielen?',
				answer:
					'Mit einem All-Court-Modell meist ja, mit spürbaren Kompromissen gegenüber einem speziell auf einen Belag zugeschnittenen Schuh. Wer überwiegend auf einem Belag spielt, fährt mit dem passenden Spezial-Sohlenprofil in der Regel besser.'
			},
			{
				question: 'Wie oft sollte ich meine Tennisschuhe wechseln?',
				answer:
					'Das hängt stark von Spielhäufigkeit und Belag ab — Sandplatz nutzt die Sohle spürbar schneller ab als Hartplatz. Sobald das Profil sichtbar glatt wird oder der seitliche Halt nachlässt, ist ein Wechsel fällig, unabhängig von einer festen Zeitspanne.'
			}
		]
	},
	// ------------------------------------------------------------
	// TECHNIK & TAKTIK
	// ------------------------------------------------------------
	{
		slug: 'tennis-technik',
		title: 'Tennis-Technik: Die wichtigsten Schläge einfach erklärt',
		metaTitle: 'Tennis-Technik: Vorhand, Rückhand, Aufschlag und Volley erklärt',
		metaDescription:
			'Vorhand, Rückhand, Aufschlag, Volley und Slice: die wichtigsten Tennis-Grundschläge verständlich erklärt.',
		excerpt:
			'Vorhand, Rückhand, Aufschlag und Volley — die Grundschläge, auf denen jede weitere Technik aufbaut.',
		category: 'technik-taktik',
		difficulty: 'fortgeschritten',
		readingTime: 9,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-taktik', 'tennis-training', 'tennis-begriffe'],
		sections: [
			{
				id: 'vorhand',
				heading: 'Vorhand (Forehand)',
				paragraphs: [
					'Die Vorhand ist für die meisten Spieler:innen der erste verlässliche Schlag und oft die schlagkräftigste Waffe. Geschlagen wird auf der Seite der Schlaghand, meist mit einer Ausholbewegung, die den Schläger unterhalb der Trefflinie ansetzt und dann nach vorne oben durchzieht.',
					'Zwei Grundvarianten sind verbreitet: der klassische Halbwestern- oder Westerngriff für viel Topspin, oder ein flacherer Ostgriff für eine direktere, flachere Flugbahn. Für Einsteiger:innen lohnt sich meist ein Griff irgendwo dazwischen, um beide Varianten offenzuhalten.'
				]
			},
			{
				id: 'rueckhand',
				heading: 'Rückhand (Backhand)',
				paragraphs: [
					'Die Rückhand wird ein- oder beidhändig gespielt. Beidhändig gibt zusätzliche Stabilität und Kraft, besonders für Einsteiger:innen oft der leichtere Einstieg. Einhändig erlaubt mehr Reichweite und wird von vielen als eleganter empfunden, verlangt aber mehr Übung, bis Kraft und Kontrolle stimmen.',
					'Welche Variante besser passt, hängt stark von Körperkraft, Reichweite und persönlicher Vorliebe ab — beide Varianten werden auch auf hohem Niveau erfolgreich gespielt.'
				]
			},
			{
				id: 'aufschlag',
				heading: 'Aufschlag',
				paragraphs: [
					'Der Aufschlag ist der einzige Schlag, bei dem du volle Kontrolle über Ballwurf und Timing hast — entsprechend lohnt sich gezieltes Üben besonders. Wichtige Elemente sind ein konstanter, sauberer Ballwurf, ein flüssiger Ausholschwung ("Trophy Position") und ein Treffpunkt möglichst weit oben und vorne.',
					'Für den Einstieg zählt vor allem Konstanz: lieber ein etwas langsamerer, sicherer erster Aufschlag als viele Doppelfehler durch zu viel Risiko.'
				]
			},
			{
				id: 'volley',
				heading: 'Volley',
				paragraphs: [
					'Beim Volley wird der Ball direkt aus der Luft gespielt, meist mit kurzer, kompakter Schlagbewegung statt großem Schwung. Die Grundposition am Netz ist wichtig: Gewicht nach vorne, Schläger vor dem Körper, damit du auf schnelle Bälle reagieren kannst.',
					'Ein häufiger Anfängerfehler ist zu viel Schwung beim Volley — kontrollierte, kurze Bewegungen sind meist präziser und zuverlässiger.'
				]
			},
			{
				id: 'slice-und-topspin',
				heading: 'Slice und Topspin',
				paragraphs: [
					'Slice (Unterschnitt) erzeugt einen flacheren, niedriger abspringenden Ball — nützlich, um das Tempo herauszunehmen oder sich Zeit für die nächste Position zu verschaffen. Topspin (Vorwärtsdrall) erzeugt einen höheren Bogen und einen steileren, schnelleren Absprung — nützlich für mehr Sicherheit über das Netz bei gleichzeitig hohem Tempo.',
					'Beide Varianten ergänzen die Grundschläge, statt sie zu ersetzen — die meisten fortgeschrittenen Spieler:innen wechseln je nach Spielsituation zwischen beiden.'
				]
			},
			{
				id: 'fortschritt',
				heading: 'Womit du am schnellsten Fortschritte machst',
				box: {
					kind: 'tips',
					title: 'Übungstipps',
					items: [
						'Erst Konstanz über die Netzmitte trainieren, dann erst auf Tempo und Winkel gehen.',
						'Beinarbeit nicht vernachlässigen — die beste Schlagtechnik hilft wenig ohne rechtzeitige Position.',
						'Regelmäßig gegen eine Wand oder Ballmaschine üben, um Wiederholungen zu erhöhen.',
						'Videos der eigenen Schläge aufnehmen und mit einer Trainerin oder einem Trainer besprechen.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Sollte ich Rückhand einhändig oder beidhändig lernen?',
				answer:
					'Für die meisten Einsteiger:innen ist beidhändig der leichtere und stabilere Start, weil die zweite Hand zusätzliche Kraft und Kontrolle gibt. Einhändig lohnt sich vor allem, wenn du gezielt mehr Reichweite und Slice-Vielseitigkeit aufbauen willst.'
			},
			{
				question: 'Wie lange dauert es, bis der Aufschlag sitzt?',
				answer:
					'Ein einigermaßen konstanter, sicherer Aufschlag lässt sich meist innerhalb einiger Wochen regelmäßigen Trainings aufbauen. Mehr Tempo und Präzision entwickeln sich danach über Monate weiter — der Aufschlag gilt zurecht als einer der technisch anspruchsvollsten Schläge.'
			}
		]
	},
	{
		slug: 'tennis-taktik',
		title: 'Tennis-Taktik: Einfach besser spielen im Einzel',
		metaTitle: 'Tennis-Taktik für Einzel: Grundlagen für mehr gewonnene Punkte',
		metaDescription:
			'Grundlinienspiel, Netzangriff und Schlagwahl: So entwickelst du im Tennis-Einzel eine klarere Taktik.',
		excerpt:
			'Grundlinienspiel, Netzangriff und kluge Schlagwahl — so gewinnst du im Einzel mehr Punkte, ohne härter zu schlagen.',
		category: 'technik-taktik',
		difficulty: 'fortgeschritten',
		readingTime: 8,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-technik', 'tennis-doppel', 'tennis-einzel-doppel'],
		sections: [
			{
				id: 'grundlinienspiel',
				heading: 'Grundlinienspiel: Positionierung ist die halbe Miete',
				paragraphs: [
					'Nach jedem eigenen Schlag zur Feldmitte zurückzukehren, gehört zu den wichtigsten taktischen Grundlagen im Einzel — von dort aus deckst du beide Seiten annähernd gleich gut ab. Wer stattdessen am äußeren Rand stehen bleibt, öffnet der Gegenseite die eine Feldhälfte fast völlig.',
					'Cross (diagonal über die lange Diagonale) ist meist der sicherere Schlag, weil das Netz dort niedriger ist und mehr Feld zur Verfügung steht. Longline (die Linie entlang) ist riskanter, aber oft überraschender und effektiver als Wechselschlag.'
				]
			},
			{
				id: 'netzangriff',
				heading: 'Wann sich der Weg ans Netz lohnt',
				paragraphs: [
					'Ein kurzer, schwacher Ball der Gegenseite ist meist die beste Gelegenheit, ans Netz vorzurücken und den Punkt mit einem Volley oder Smash zu beenden, statt von der Grundlinie aus weiterzuspielen. Am Netz zu stehen verkürzt der Gegenseite die Reaktionszeit erheblich.',
					'Wer zu selten ans Netz geht, verschenkt einfache Punkte; wer zu oft und ohne guten Anlass geht, wird leicht mit einem Lob oder Passierschlag überspielt — die Balance macht den Unterschied.'
				]
			},
			{
				id: 'schlagwahl-unter-druck',
				heading: 'Schlagwahl unter Druck',
				paragraphs: [
					'In engen Spielsituationen (Einstand, Satzball) lohnt es sich, auf den eigenen zuverlässigsten Schlag zu setzen statt auf ein riskantes Experiment. Viele Punkte gehen nicht durch spektakuläre Gewinnschläge verloren, sondern durch vermeidbare eigene Fehler in genau solchen Momenten.',
					'Ein einfacher Grundsatz: Je knapper der Punktestand, desto mehr Sicherheitsmarge einplanen — lieber einen Schlag weniger riskant, aber konstant zu Ende spielen.'
				]
			},
			{
				id: 'muster-erkennen',
				heading: 'Muster der Gegenseite erkennen',
				paragraphs: [
					'Viele Spieler:innen haben unbewusste Vorlieben — etwa fast immer cross statt longline zu spielen, oder bei Druck fast immer denselben Schlag zu wählen. Wer solche Muster im Laufe eines Matches erkennt, kann sich gezielt darauf einstellen, etwa früher an der erwarteten Position stehen oder gezielt in die schwächere Seite spielen.'
				]
			},
			{
				id: 'punktekosten',
				heading: 'Das kostet in der Praxis die meisten Punkte',
				box: {
					kind: 'mistakes',
					title: 'Häufige taktische Fehler',
					items: [
						'Nach dem eigenen Schlag stehen bleiben, statt zur Mitte zurückzulaufen.',
						'Bei jedem Ball auf maximales Tempo spielen, statt Platzierung und Konstanz zu priorisieren.',
						'Kurze Bälle der Gegenseite ignorieren, statt konsequent ans Netz nachzurücken.',
						'In wichtigen Punkten unnötig riskante Schläge probieren, statt auf das Zuverlässige zu setzen.'
					]
				}
			},
			{
				id: 'im-kopf-behalten',
				heading: 'Vor und während des Matches im Kopf behalten',
				box: {
					kind: 'checklist',
					title: 'Kurz gecheckt',
					items: [
						'Nach jedem Schlag zur Mitte zurückpositionieren.',
						'Kurze Bälle konsequent zum Netzangriff nutzen.',
						'In engen Punkten auf den zuverlässigsten Schlag setzen.',
						'Muster der Gegenseite über den Matchverlauf beobachten und ausnutzen.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Sollte ich als Einsteiger:in schon Taktik trainieren?',
				answer:
					'Ja, in einfacher Form durchaus — vor allem die Rückkehr zur Feldmitte nach jedem Schlag lässt sich schon früh üben und bringt sofort spürbar mehr gewonnene Punkte, ganz ohne bessere Schlagtechnik.'
			},
			{
				question: 'Ist Cross oder Longline die bessere Wahl?',
				answer:
					'Cross ist meist die sicherere Grundoption, weil das Netz dort niedriger ist und mehr Feldfläche zur Verfügung steht. Longline lohnt sich gezielt als Überraschungsmoment oder wenn die Gegenseite stark auf Cross-Schläge eingestellt ist.'
			}
		]
	},
	{
		slug: 'tennis-doppel',
		title: 'Tennis-Doppel: Positionierung, Kommunikation und Teamplay',
		metaTitle: 'Tennis-Doppel: Positionierung, Kommunikation und Formationen erklärt',
		metaDescription:
			'Netzposition, Kommunikation und Aufschlagformationen: So spielt ihr als Doppel-Team taktisch klüger zusammen.',
		excerpt:
			'Netzposition, klare Absprachen und die richtige Formation — so wird aus zwei Einzelspieler:innen ein echtes Team.',
		category: 'technik-taktik',
		difficulty: 'fortgeschritten',
		readingTime: 8,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-taktik', 'tennis-einzel-doppel', 'tennis-technik'],
		sections: [
			{
				id: 'grundformation',
				heading: 'Grundformation: Eine Person vorne, eine hinten',
				paragraphs: [
					'Die klassische Doppel-Formation beim eigenen Aufschlag: Die aufschlagende Person steht hinten, die Partnerin oder der Partner bereits am Netz. Nach einem guten ersten Aufschlag rückt auch die aufschlagende Person zügig ans Netz nach, sodass beide möglichst schnell in der starken Netzposition stehen.',
					'Beim Return ist es oft umgekehrt: Die returnierende Person steht hinten an der Grundlinie, die Partnerin oder der Partner meist ebenfalls zunächst etwas zurückhaltender, bis sich eine gute Gelegenheit zum Vorrücken ergibt.'
				]
			},
			{
				id: 'kommunikation',
				heading: 'Kommunikation: Klein, aber entscheidend',
				paragraphs: [
					'Kurze, klare Ansagen wie "meiner" oder "deiner" für Bälle in der Mitte verhindern die häufigste Doppel-Panne: dass beide stehen bleiben, weil jede oder jeder dachte, die Partnerin oder der Partner übernimmt.',
					'Auch vor dem Aufschlag lohnt sich eine kurze Absprache, etwa ob die Person am Netz aktiv "poachen" (den Return abfangen) soll oder auf der eigenen Seite bleibt — spontane Überraschungsmomente funktionieren am besten, wenn sie vorher kurz angekündigt wurden.'
				]
			},
			{
				id: 'formationen',
				heading: 'Formationen jenseits der Standardaufstellung',
				paragraphs: [
					'Die "australische Formation" stellt beide Team-Mitglieder auf dieselbe Feldseite, um eine Gegnerin oder einen Gegner mit starker Cross-Rückhand von diesem bevorzugten Schlag abzuschneiden. Die "I-Formation" positioniert die Netzperson direkt in der Mitte hinter der aufschlagenden Person und weicht erst nach dem Aufschlag zur Seite aus, um die Return-Richtung schwerer vorhersehbar zu machen.',
					'Solche Formationen lohnen sich vor allem gegen eingespielte Returnschläge der Gegenseite — für den Einstieg reicht die klassische Grundformation völlig aus.'
				]
			},
			{
				id: 'gasse-abdecken',
				heading: 'Die Gasse abdecken',
				paragraphs: [
					'Ein häufiges Ziel der Gegenseite ist ein Schlag in die äußere Gasse, wenn dort eine Lücke entsteht. Die Grundregel: Die Person am Netz deckt die Gasse auf ihrer Seite mit ab, sobald sich die Gegenseite in eine gute Position zum Longline-Schlag bringt — dafür braucht es ständiges Mitverfolgen des Spielgeschehens, nicht nur des eigenen Balls.'
				]
			},
			{
				id: 'bremst-teams-aus',
				heading: 'Das bremst die meisten Teams aus',
				box: {
					kind: 'mistakes',
					title: 'Typische Doppel-Fehler',
					items: [
						'Bälle in der Mitte liegen lassen, weil unklar ist, wer zuständig ist.',
						'Als Netzperson zu passiv bleiben, statt aktiv Bälle abzufangen.',
						'Nach dem eigenen Return sofort zurückweichen, statt die Gelegenheit zum Vorrücken zu nutzen.',
						'Keine kurze Absprache vor dem Aufschlag, wodurch Überraschungsmomente verpuffen.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Wer sollte am Netz stehen?',
				answer:
					'Grundsätzlich die Person, die gerade nicht returniert oder aufschlägt — die Netzposition ist im Doppel meist die stärkere, weil sie kürzere Reaktionszeiten für die Gegenseite erzwingt und mehr direkte Punktgewinne ermöglicht.'
			},
			{
				question: 'Was ist "Poachen"?',
				answer:
					'Poachen heißt, als Netzperson aktiv einen Ball abzufangen, der eigentlich zur Partnerin oder zum Partner unterwegs wäre — meist beim Return, um die Gegenseite zu überraschen. Funktioniert am besten mit kurzer Vorab-Absprache.'
			}
		]
	},
	// ------------------------------------------------------------
	// EINSTIEG
	// ------------------------------------------------------------
	{
		slug: 'tennis-fuer-anfaenger',
		title: 'Tennis für Anfänger: Alles, was du vor deinem ersten Match wissen musst',
		metaTitle: 'Tennis für Anfänger: Der komplette Einstiegs-Guide',
		metaDescription:
			'Verein finden, erste Trainerstunde, Ausrüstung: der komplette Einstiegs-Guide für dein erstes Tennis-Match.',
		excerpt:
			'Verein finden, erste Trainerstunde, Ausrüstung besorgen — so gelingt dein Einstieg ins Tennis ohne Umwege.',
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
				heading: 'Verein oder Platz finden',
				paragraphs: [
					'Der einfachste Einstieg ist meist ein Schnupperangebot bei einem Verein in der Nähe — viele bieten kostenlose oder günstige Probestunden an. Alternativ lassen sich in vielen Städten auch öffentliche oder kommerzielle Plätze stundenweise buchen, ganz ohne Vereinsbindung.',
					'Auf TennisIndex findest du unter /vereine und /karte Vereine und Anlagen in deiner Nähe auf einen Blick.'
				]
			},
			{
				id: 'erste-trainerstunde',
				heading: 'Die erste Trainerstunde',
				paragraphs: [
					'Eine angeleitete erste Stunde bei einer Trainerin oder einem Trainer lohnt sich fast immer mehr als ein unkoordiniertes erstes Herumschlagen zu zweit — falsch antrainierte Bewegungsmuster sind später mühsam wieder zu korrigieren.',
					'Erwarte in der ersten Stunde vor allem Grundlagenarbeit: Griffhaltung, einfache Vorhand- und Rückhand-Bewegungen, erste kurze Ballwechsel aus geringer Distanz — noch kein volles Match.'
				]
			},
			{
				id: 'was-mitbringen',
				heading: 'Was du mitbringen solltest',
				paragraphs: [
					'Für die erste Stunde reichen bequeme Sportkleidung und feste Sportschuhe — einen eigenen Schläger verleihen die meisten Vereine oder Trainer:innen für den Anfang. Eine Wasserflasche und bei Sonne Sonnenschutz sind auf dem Platz keine schlechte Idee, gerade im Sommer.'
				]
			},
			{
				id: 'entspannter-court-besuch',
				heading: 'Damit dein erster Court-Besuch entspannt bleibt',
				box: {
					kind: 'tips',
					title: 'Praktische Tipps',
					items: [
						'Etwas früher da sein, um dich mit Platz und Umgebung vertraut zu machen.',
						'Nicht sofort auf Tempo spielen wollen — erst Timing und Balltreffpunkt finden.',
						'Nach der Stunde kurz nachfragen, woran du bis zum nächsten Mal arbeiten kannst.',
						'Bei Unsicherheit zur Etikette (z. B. wer die Bälle aufsammelt) einfach höflich nachfragen.'
					]
				}
			},
			{
				id: 'anfaenger-typisch',
				heading: 'Typisch am Anfang, aber leicht vermeidbar',
				box: {
					kind: 'mistakes',
					title: 'Häufige Einsteiger-Fehler',
					items: [
						'Zu weit von der Grundlinie entfernt stehen, aus Unsicherheit vor schnellen Bällen.',
						'Den Schläger zu fest umklammern, was Schwung und Gefühl nimmt.',
						'Nach einem verpatzten Punkt lange grübeln, statt sich schnell auf den nächsten zu konzentrieren.',
						'Zu selten üben zwischen den Trainerstunden — Konstanz entsteht vor allem durch Wiederholung.'
					]
				}
			},
			{
				id: 'bevor-es-losgeht',
				heading: 'Bevor es losgeht',
				box: {
					kind: 'checklist',
					title: 'Kurz gecheckt',
					items: [
						'Schnupperstunde oder Probetraining bei einem Verein in der Nähe suchen.',
						'Bequeme Sportkleidung und feste Sportschuhe mitbringen.',
						'Wasserflasche und Sonnenschutz nicht vergessen.',
						'Erwartungen niedrig ansetzen — die ersten Bälle gehen selten "wie im Fernsehen" rein.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Ab welchem Alter kann man mit Tennis anfangen?',
				answer:
					'Tennis lässt sich in praktisch jedem Alter beginnen. Für Kinder gibt es eigene, langsamere Bälle und kleinere Felder für einen leichteren Einstieg, für Erwachsene jeden Alters normale Anfängerkurse bei den meisten Vereinen.'
			},
			{
				question: 'Muss ich sportlich fit sein, um anzufangen?',
				answer:
					'Nein — die Grundlagen lassen sich unabhängig vom Fitnessstand erlernen, und die Kondition entwickelt sich mit regelmäßigem Spielen von selbst mit. Ein gutes Aufwärmen vor jeder Einheit hilft, Verletzungen von Anfang an zu vermeiden.'
			},
			{
				question: 'Wie schnell finde ich Mitspieler:innen auf meinem Niveau?',
				answer:
					'Über einen Verein meist recht schnell, da dort ohnehin viele Einsteiger:innen zusammen trainieren. TennisIndex hilft zusätzlich über die Vereins-Rangliste und die Matchsuche dabei, passende Gegner:innen für dein aktuelles Niveau zu finden.'
			}
		]
	},
	{
		slug: 'tennis-training',
		title: 'Tennis-Training: Übungen für Technik, Taktik und bessere Matches',
		metaTitle: 'Tennis-Training: Übungen für Technik, Kondition und Taktik',
		metaDescription:
			'Von Wandtraining bis Matchsimulation: Trainingsübungen, mit denen du Technik, Kondition und Taktik gezielt verbesserst.',
		excerpt:
			'Von Wandtraining bis Matchsimulation — mit diesen Übungen kommst du gezielt voran, egal auf welchem Niveau.',
		category: 'einstieg',
		difficulty: 'fortgeschritten',
		readingTime: 7,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-technik', 'tennis-taktik', 'tennis-fuer-anfaenger'],
		sections: [
			{
				id: 'technikuebungen',
				heading: 'Technikübungen für konstante Grundschläge',
				paragraphs: [
					'Wandtraining ist eine der effizientesten Übungen für Einsteiger:innen: Der Ball kommt sofort zurück, was in kurzer Zeit viel mehr Wiederholungen ermöglicht als das Spiel mit Partner:in. Ziel dabei ist zunächst reine Konstanz — den Ball zehn, zwanzig, dreißig Mal in Folge sauber treffen, bevor Tempo dazukommt.',
					'Eine Ballmaschine (falls im Verein verfügbar) erlaubt gezieltes Üben einzelner Schlagarten mit gleichbleibendem Tempo und Platzierung, ohne auf eine Trainingspartnerin oder einen Trainingspartner angewiesen zu sein.'
				]
			},
			{
				id: 'beinarbeit',
				heading: 'Beinarbeit und Kondition',
				paragraphs: [
					'Seitliche Sprungübungen (Side Shuffles), kurze Sprints zwischen Markierungen und Schattenlaufen (Bewegungsmuster ohne Ball) verbessern die Reaktionsschnelligkeit, die im echten Spiel oft über Punkte entscheidet — schnellere Beine bringen dich früher in Schlagposition.',
					'Grundausdauer lässt sich zusätzlich über Laufen, Radfahren oder Schwimmen aufbauen — Tennis selbst ist durch die vielen kurzen Sprints und Pausen eher ein Intervallsport als ein reiner Ausdauersport.'
				]
			},
			{
				id: 'taktikuebungen',
				heading: 'Taktikübungen mit Partner:in',
				paragraphs: [
					'Punktspiele mit eingeschränkten Regeln — etwa nur Cross-Bälle erlaubt, oder ein Punkt zählt nur nach mindestens fünf Schlägen — trainieren gezielt Konstanz und taktisches Denken, statt nur auf Tempo zu spielen.',
					'Simulierte Matchsituationen (z. B. "du liegst 3:5 zurück, hol das Spiel") helfen, mentale Stärke unter Druck gezielt zu üben, statt sie erst im echten Wettkampf zum ersten Mal zu testen.'
				]
			},
			{
				id: 'einstiegsrahmen',
				heading: 'Ein einfacher Einstiegsrahmen — an dein Niveau anpassen',
				box: {
					kind: 'info',
					title: 'Beispielhafte Trainingseinheit (60–75 Minuten)',
					items: [
						'10 Minuten Aufwärmen: leichtes Laufen, Dehnen, erste lockere Ballwechsel.',
						'15 Minuten Grundschlagtraining: Vorhand und Rückhand cross, Fokus auf Konstanz.',
						'10 Minuten Aufschlag- und Return-Übung.',
						'15 Minuten Volley- und Netzspiel-Übung.',
						'15–20 Minuten Punktspiel oder verkürztes Match zur Anwendung.',
						'5 Minuten Cool-down und kurze Reflexion, was gut lief und was nicht.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Wie oft sollte ich als Einsteiger:in trainieren?',
				answer:
					'Ein bis zwei Einheiten pro Woche reichen für spürbare Fortschritte am Anfang völlig aus. Wichtiger als die Häufigkeit ist meist die Regelmäßigkeit — lieber konstant einmal pro Woche als sporadisch mit langen Pausen dazwischen.'
			},
			{
				question: 'Bringt Wandtraining wirklich etwas?',
				answer:
					'Ja, besonders für Konstanz und Timing — durch die vielen Wiederholungen in kurzer Zeit lässt sich die Grundbewegung schneller festigen als im normalen Spiel, wo lange nicht jeder Ballwechsel gleich verläuft.'
			}
		]
	},
	// ------------------------------------------------------------
	// KOSTEN
	// ------------------------------------------------------------
	{
		slug: 'tennis-kosten',
		title: 'Was kostet Tennis? Ausrüstung, Mitgliedschaft und laufende Kosten erklärt',
		metaTitle: 'Was kostet Tennis? Ausrüstung, Mitgliedschaft und Platzmiete im Überblick',
		metaDescription:
			'Vereinsmitgliedschaft, Platzmiete, Ausrüstung und Trainerstunden: die Kostenfaktoren im Tennis im Überblick.',
		excerpt:
			'Vereinsmitgliedschaft, Platzmiete und Ausrüstung — ein ehrlicher Überblick über die Kostenfaktoren im Tennis.',
		category: 'kosten',
		difficulty: 'einsteiger',
		readingTime: 6,
		updatedAt: '2026-08-01',
		relatedSlugs: ['tennis-ausruestung', 'tennis-schlaeger', 'tennis-fuer-anfaenger'],
		sections: [
			{
				id: 'einmalige-kosten',
				heading: 'Einmalige Kosten: Ausrüstung',
				paragraphs: [
					'Die größte einmalige Anschaffung ist der Schläger, gefolgt von passenden Tennisschuhen. Wie viel du dafür ausgibst, hängt stark davon ab, ob du im Fachgeschäft neu kaufst, ein Einsteigermodell wählst oder gebraucht einsteigst — die Preisspannen ändern sich zudem laufend, ein aktueller Blick ins Fachgeschäft vor Ort lohnt sich mehr als eine feste Zahl hier.',
					'Kleidung und Zubehör (Bälle, ggf. Tasche) kommen dazu, sind aber meist deutlich günstiger als Schläger und Schuhe zusammen.'
				]
			},
			{
				id: 'laufende-kosten',
				heading: 'Laufende Kosten: Mitgliedschaft und Platzmiete',
				paragraphs: [
					'Wer über einen Verein spielt, zahlt meist einen Jahres- oder Monatsbeitrag, der je nach Verein, Region und Ausstattung (Zahl der Plätze, Hallenkapazität, Zusatzangebote) sehr unterschiedlich ausfällt. Manche Vereine erheben zusätzlich eine einmalige Aufnahmegebühr.',
					'Wer ohne Vereinsbindung spielt, zahlt stattdessen meist eine Platzmiete pro Stunde bei öffentlichen oder kommerziellen Anlagen — praktisch für unregelmäßiges Spielen, auf Dauer oft teurer als eine Vereinsmitgliedschaft bei regelmäßigem Spielbetrieb.'
				]
			},
			{
				id: 'training-und-unterricht',
				heading: 'Training und Unterricht',
				paragraphs: [
					'Einzelstunden bei einer Trainerin oder einem Trainer sind meist die teuerste, aber auch individuellste Trainingsform. Gruppentraining ist pro Person günstiger und bietet zusätzlich den sozialen Aspekt des gemeinsamen Lernens — für den Einstieg oft die bessere Wahl.',
					'Die Kosten für Trainerstunden variieren stark nach Region, Qualifikation der Trainerin bzw. des Trainers und Vereinsangebot.'
				]
			},
			{
				id: 'laufende-kleinkosten',
				heading: 'Laufende Kleinkosten',
				paragraphs: [
					'Bälle nutzen sich ab und müssen regelmäßig ersetzt werden, besonders bei häufigem Spielen. Saiten reißen oder verlieren an Spannung — eine gelegentliche Neubespannung gehört für regelmäßig Spielende zur normalen Instandhaltung dazu.',
					'Wer an Liga- oder Turnierspielen teilnimmt, hat je nach Verband und Wettbewerb zusätzlich Startgebühren einzuplanen.'
				]
			},
			{
				id: 'bezahlbar-bleiben',
				heading: 'So bleibt Tennis bezahlbar',
				box: {
					kind: 'tips',
					title: 'Spartipps für den Einstieg',
					items: [
						'Erst mit Leihschläger und Schnupperstunden testen, bevor größere Anschaffungen anstehen.',
						'Gruppentraining statt Einzelstunden für den Einstieg wählen.',
						'Gebrauchte Schläger und Ausrüstung im Fachgeschäft oder über den Verein prüfen.',
						'Vereinsmitgliedschaft und öffentliche Platzmiete für dein Spielverhalten durchrechnen, statt pauschal zu entscheiden.'
					]
				}
			},
			{
				id: 'vor-dem-einstieg-klaeren',
				heading: 'Vor dem Einstieg klären',
				box: {
					kind: 'checklist',
					title: 'Kurz gecheckt',
					items: [
						'Beitragsordnung und Aufnahmegebühr beim Wunschverein direkt erfragen.',
						'Prüfen, ob eine Schnuppermitgliedschaft oder Probezeit angeboten wird.',
						'Klären, ob Schläger/Bälle in der ersten Zeit gestellt werden.',
						'Gruppen- und Einzelunterrichtspreise vergleichen, bevor du dich festlegst.'
					]
				}
			}
		],
		faq: [
			{
				question: 'Ist Tennis ein teurer Sport?',
				answer:
					'Die Einstiegskosten lassen sich mit Leihausrüstung und Gruppentraining klein halten. Teurer wird es meist erst mit eigener hochwertiger Ausrüstung, regelmäßigen Einzelstunden und Wettkampfteilnahmen — für lockeres Freizeitspielen bleibt der Einstieg überschaubar.'
			},
			{
				question: 'Lohnt sich eine Vereinsmitgliedschaft gegenüber Platzmiete?',
				answer:
					'Das hängt vor allem davon ab, wie oft du spielst. Bei regelmäßigem Spielbetrieb ist eine Vereinsmitgliedschaft meist günstiger als wiederholte Einzelbuchungen; bei sehr unregelmäßigem Spielen kann stundenweise Platzmiete ohne feste Bindung besser passen.'
			}
		]
	}
];
