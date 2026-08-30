// ============================================================
// TennisIndex — Doppel-K.o.-Turnierbaum: reine Planungslogik
// ============================================================
// Reine Funktion ohne DB-Zugriff, damit sie sich wie rating-core.ts und
// box-americano.ts direkt testen lässt. planDoubleElimination() bekommt
// nur eine Teilnehmerzahl und liefert den kompletten Baum als flache
// Liste von Partien mit Vorwärtszeigern (welche Partie bekommt wessen
// Sieger/Verlierer) — die DB-Schicht (bracket-admin.ts) ordnet den
// abstrakten "Seed"-Nummern 1..N erst beim Persistieren echte
// bracket_participants-IDs zu.
//
// Freilose (Draw-Größe ist die nächste Zweierpotenz >= Teilnehmerzahl)
// werden hier vollständig aufgelöst, auch wenn sie mehrstufig
// kaskadieren (z. B. 5 Teilnehmer in einem 8er-Baum: ein Verlierer-Slot
// im Loser-Bracket kann von ZWEI Freilosen gespeist werden und damit
// selbst komplett entfallen — planDoubleElimination() erzeugt in dem
// Fall gar keine Partie an dieser Stelle, sondern reicht die Verweise
// transparent weiter). Alles läuft in einem einzigen Vorwärtsdurchlauf:
// jede Partie referenziert ausschließlich früher gebaute Partien, eine
// zweite Auflösungs-Runde ist nie nötig.
//
// Grand-Final-Reset (falls die Loser-Bracket-Seite gewinnt und der
// bislang verlustfreien Winner-Bracket-Seite die erste Niederlage
// zufügt) wird NICHT vorgeplant — der gibt es erst zur Laufzeit, wenn
// das Ergebnis feststeht (siehe record_bracket_match_result() in der
// Migration). grandFinalWbSlot verrät der Laufzeit-Logik, welcher der
// beiden Slots die bislang verlustfreie Seite ist.

export type BracketSide = 'winners' | 'losers' | 'grand_final';

export interface BracketMatchPlan {
	/** Vorab erzeugte UUID, damit Vorwärtszeiger in einem einzigen Insert auflösbar sind. */
	id: string;
	bracket: BracketSide;
	/** 1-indexiert, jeweils eigene Zählung je bracket-Seite. */
	round: number;
	/** 1-indexierte Position innerhalb der Runde. */
	slot: number;
	entry1Seed: number | null;
	entry2Seed: number | null;
	/** true = Freilos, bereits mit bekanntem Sieger, niemand spielt hier wirklich. */
	isBye: boolean;
	byeWinnerSeed: number | null;
	nextMatchWinnerId: string | null;
	nextMatchWinnerSlot: 1 | 2 | null;
	/** Nur bei winners-Partien gesetzt: wohin der Verlierer ins Loser-Bracket fällt. */
	nextMatchLoserId: string | null;
	nextMatchLoserSlot: 1 | 2 | null;
	/** Nur auf der grand_final-Partie: welcher Slot die bislang verlustfreie Seite ist. */
	grandFinalWbSlot: 1 | 2 | null;
}

export interface BracketPlan {
	drawSize: number;
	matches: BracketMatchPlan[];
}

/** Kleinste Zweierpotenz >= n. */
function nextPowerOfTwo(n: number): number {
	let size = 1;
	while (size < n) size *= 2;
	return size;
}

/**
 * Klassische rekursive Turnierbaum-Setzreihenfolge (1, size, size/2+1, ...):
 * für size=8 liefert sie [1,8,4,5,2,7,3,6] — Runde 1 spielt also 1v8, 4v5,
 * 2v7, 3v6, das übliche Bild eines gesetzten Turnierbaums.
 */
export function standardSeedOrder(drawSize: number): number[] {
	let order = [1, 2];
	while (order.length < drawSize) {
		const n = order.length * 2 + 1;
		const next: number[] = [];
		for (const s of order) next.push(s, n - s);
		order = next;
	}
	return order;
}

type Source = { type: 'seed'; seed: number } | { type: 'ref'; matchIdx: number; role: 'winner' | 'loser' };

type Resolved =
	| { kind: 'bye' }
	| { kind: 'known'; seed: number }
	| { kind: 'pending'; matchIdx: number; role: 'winner' | 'loser' };

interface WorkingMatch {
	bracket: BracketSide;
	round: number;
	slot: number;
	source1: Source;
	source2: Source;
	/** Diese Partie wird für die DB persistiert (echtes Spiel ODER sichtbares Freilos). */
	persisted: boolean;
	id: string;
	// Nach Auflösung befüllt:
	resolved1?: Resolved;
	resolved2?: Resolved;
	/** Was diese Partie für NACHFOLGER als "Sieger von mir" bedeutet. */
	asWinnerSource?: Resolved;
	/** Was diese Partie für NACHFOLGER als "Verlierer von mir" bedeutet (nur winners-Seite genutzt). */
	asLoserSource?: Resolved;
	isBye?: boolean;
	byeWinnerSeed?: number | null;
	entry1Seed?: number | null;
	entry2Seed?: number | null;
	nextMatchWinnerId?: string | null;
	nextMatchWinnerSlot?: 1 | 2 | null;
	nextMatchLoserId?: string | null;
	nextMatchLoserSlot?: 1 | 2 | null;
	grandFinalWbSlot?: 1 | 2 | null;
}

/**
 * Baut den kompletten Doppel-K.o.-Baum für `participantCount` Teilnehmer.
 * Mindestens 4 (bei weniger ist "doppelte Chance" kein sinnvolles eigenes
 * Konzept mehr — bei 2 Teilnehmern gäbe es nur ein einziges Spiel, bei 3
 * eine Sonderform ohne echtes Loser-Bracket).
 */
export function planDoubleElimination(participantCount: number): BracketPlan {
	if (participantCount < 4) {
		throw new Error('Doppel-K.o. braucht mindestens 4 Teilnehmer:innen.');
	}

	const drawSize = nextPowerOfTwo(participantCount);
	const k = Math.log2(drawSize); // Anzahl Winner-Bracket-Runden

	const working: WorkingMatch[] = [];
	const wbIndex: number[][] = []; // wbIndex[round-1][slot-1] -> working index
	const lbIndex: number[][] = [];

	function push(w: Omit<WorkingMatch, 'id' | 'persisted'>): number {
		working.push({ ...w, id: crypto.randomUUID(), persisted: false });
		return working.length - 1;
	}

	// ---- Winner-Bracket ----
	const seedOrder = standardSeedOrder(drawSize);
	{
		const round1: number[] = [];
		for (let m = 0; m < drawSize / 2; m++) {
			const idx = push({
				bracket: 'winners',
				round: 1,
				slot: m + 1,
				source1: { type: 'seed', seed: seedOrder[m * 2] },
				source2: { type: 'seed', seed: seedOrder[m * 2 + 1] }
			});
			round1.push(idx);
		}
		wbIndex.push(round1);
	}
	for (let r = 2; r <= k; r++) {
		const prev = wbIndex[r - 2];
		const round: number[] = [];
		for (let m = 0; m < prev.length / 2; m++) {
			const idx = push({
				bracket: 'winners',
				round: r,
				slot: m + 1,
				source1: { type: 'ref', matchIdx: prev[m * 2], role: 'winner' },
				source2: { type: 'ref', matchIdx: prev[m * 2 + 1], role: 'winner' }
			});
			round.push(idx);
		}
		wbIndex.push(round);
	}

	// ---- Loser-Bracket ----
	// Für j = 1..k-1: "minor" Runde (2j-1) und "major" Runde (2j) haben je
	// drawSize / 2^(j+1) Partien (siehe Herleitung in der Modul-Doku).
	if (k >= 2) {
		for (let j = 1; j <= k - 1; j++) {
			const minorRound = 2 * j - 1;
			const majorRound = 2 * j;
			const minor: number[] = [];

			if (j === 1) {
				// Minor Runde 1: Verlierer der WB-Runde 1 paarweise gegeneinander.
				const wbR1 = wbIndex[0];
				for (let m = 0; m < wbR1.length / 2; m++) {
					const idx = push({
						bracket: 'losers',
						round: minorRound,
						slot: m + 1,
						source1: { type: 'ref', matchIdx: wbR1[m * 2], role: 'loser' },
						source2: { type: 'ref', matchIdx: wbR1[m * 2 + 1], role: 'loser' }
					});
					minor.push(idx);
				}
			} else {
				// Minor Runde j>1: Sieger der vorigen Major-Runde paarweise gegeneinander.
				const prevMajor = lbIndex[2 * (j - 1) - 1];
				for (let m = 0; m < prevMajor.length / 2; m++) {
					const idx = push({
						bracket: 'losers',
						round: minorRound,
						slot: m + 1,
						source1: { type: 'ref', matchIdx: prevMajor[m * 2], role: 'winner' },
						source2: { type: 'ref', matchIdx: prevMajor[m * 2 + 1], role: 'winner' }
					});
					minor.push(idx);
				}
			}
			lbIndex[minorRound - 1] = minor;

			// Major Runde: Sieger der Minor-Runde vs. Verlierer der WB-Runde (j+1),
			// in umgekehrter Reihenfolge gepaart, um ein sofortiges Rematch etwas
			// unwahrscheinlicher zu machen.
			const wbLosers = wbIndex[j]; // WB-Runde j+1 (0-indexiert j)
			const major: number[] = [];
			for (let m = 0; m < minor.length; m++) {
				const wbLoserIdx = wbLosers[wbLosers.length - 1 - m];
				const idx = push({
					bracket: 'losers',
					round: majorRound,
					slot: m + 1,
					source1: { type: 'ref', matchIdx: minor[m], role: 'winner' },
					source2: { type: 'ref', matchIdx: wbLoserIdx, role: 'loser' }
				});
				major.push(idx);
			}
			lbIndex[majorRound - 1] = major;
		}
	}

	const wbFinalIdx = wbIndex[k - 1][0];
	const lbFinalRound = lbIndex.length; // letzte (major) Runde
	const lbFinalIdx = lbFinalRound > 0 ? lbIndex[lbFinalRound - 1][0] : wbFinalIdx; // s.u. Sonderfall k=... nie erreicht, k>=2 garantiert lbFinalRound>=1

	const gfIdx = push({
		bracket: 'grand_final',
		round: 1,
		slot: 1,
		source1: { type: 'ref', matchIdx: wbFinalIdx, role: 'winner' },
		source2: { type: 'ref', matchIdx: lbFinalIdx, role: 'winner' }
	});

	// ---- Auflösung in Abhängigkeitsreihenfolge (= Aufbaureihenfolge) ----
	function resolveSource(src: Source): Resolved {
		if (src.type === 'seed') {
			return src.seed <= participantCount ? { kind: 'known', seed: src.seed } : { kind: 'bye' };
		}
		const src_match = working[src.matchIdx];
		const outcome = src.role === 'winner' ? src_match.asWinnerSource! : src_match.asLoserSource!;
		return outcome;
	}

	for (let i = 0; i < working.length; i++) {
		const w = working[i];
		const r1 = resolveSource(w.source1);
		const r2 = resolveSource(w.source2);
		w.resolved1 = r1;
		w.resolved2 = r2;

		const isLoserSourceAllowed = w.bracket === 'winners'; // nur WB-Verlierer fallen weiter

		if (r1.kind === 'bye' && r2.kind === 'bye') {
			// Beide Seiten leer: diese Partie entfällt komplett.
			w.persisted = false;
			w.asWinnerSource = { kind: 'bye' };
			w.asLoserSource = isLoserSourceAllowed ? { kind: 'bye' } : { kind: 'bye' };
			continue;
		}

		if (r1.kind === 'pending' && r2.kind === 'bye') {
			// Durchreichen: kein sichtbares Spiel, Freilos-Kaskade.
			w.persisted = false;
			w.asWinnerSource = r1;
			w.asLoserSource = { kind: 'bye' };
			continue;
		}
		if (r2.kind === 'pending' && r1.kind === 'bye') {
			w.persisted = false;
			w.asWinnerSource = r2;
			w.asLoserSource = { kind: 'bye' };
			continue;
		}

		if ((r1.kind === 'known' && r2.kind === 'bye') || (r2.kind === 'known' && r1.kind === 'bye')) {
			const known = r1.kind === 'known' ? r1 : (r2 as { kind: 'known'; seed: number });
			w.persisted = true;
			w.isBye = true;
			w.byeWinnerSeed = known.seed;
			w.entry1Seed = r1.kind === 'known' ? r1.seed : null;
			w.entry2Seed = r2.kind === 'known' ? r2.seed : null;
			w.asWinnerSource = { kind: 'known', seed: known.seed };
			w.asLoserSource = { kind: 'bye' };
			continue;
		}

		// Beide Seiten real (bekannt oder noch offen): echte Partie.
		w.persisted = true;
		w.isBye = false;
		w.byeWinnerSeed = null;
		w.entry1Seed = r1.kind === 'known' ? r1.seed : null;
		w.entry2Seed = r2.kind === 'known' ? r2.seed : null;
		w.asWinnerSource = { kind: 'pending', matchIdx: i, role: 'winner' };
		w.asLoserSource = isLoserSourceAllowed
			? { kind: 'pending', matchIdx: i, role: 'loser' }
			: { kind: 'bye' };

		// Rückverweise setzen: wer als 'pending' auf diese Partie zeigt, bekommt
		// meine id + den Slot eingetragen, den er hier befüllt.
		if (r1.kind === 'pending') {
			const src = working[r1.matchIdx];
			if (r1.role === 'winner') {
				src.nextMatchWinnerId = w.id;
				src.nextMatchWinnerSlot = 1;
			} else {
				src.nextMatchLoserId = w.id;
				src.nextMatchLoserSlot = 1;
			}
		}
		if (r2.kind === 'pending') {
			const src = working[r2.matchIdx];
			if (r2.role === 'winner') {
				src.nextMatchWinnerId = w.id;
				src.nextMatchWinnerSlot = 2;
			} else {
				src.nextMatchLoserId = w.id;
				src.nextMatchLoserSlot = 2;
			}
		}

		if (w.bracket === 'grand_final') {
			w.grandFinalWbSlot = r1.kind !== 'bye' && w.source1.type === 'ref' && w.source1.matchIdx === wbFinalIdx ? 1 : 2;
		}
	}

	const matches: BracketMatchPlan[] = working
		.filter((w) => w.persisted)
		.map((w) => ({
			id: w.id,
			bracket: w.bracket,
			round: w.round,
			slot: w.slot,
			entry1Seed: w.entry1Seed ?? null,
			entry2Seed: w.entry2Seed ?? null,
			isBye: w.isBye ?? false,
			byeWinnerSeed: w.byeWinnerSeed ?? null,
			nextMatchWinnerId: w.nextMatchWinnerId ?? null,
			nextMatchWinnerSlot: w.nextMatchWinnerSlot ?? null,
			nextMatchLoserId: w.nextMatchLoserId ?? null,
			nextMatchLoserSlot: w.nextMatchLoserSlot ?? null,
			grandFinalWbSlot: w.grandFinalWbSlot ?? null
		}));

	return { drawSize, matches };
}
