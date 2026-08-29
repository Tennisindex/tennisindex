// ============================================================
// TennisIndex — Format "singles_ladder": Rundenplan, Tabelle, Auf-/Abstieg
// ============================================================
// Zweites Turnier-Format neben box_americano_4 (Doppel) — für Einzel. Eine
// Gruppe von boxSize Spielern (4-8) spielt eine vollständige Round-Robin-
// Runde: jeder gegen jeden genau einmal, kein Partner-Konzept, keine
// Sitz-Rotation nötig (jeder Sitz IST bereits ein Spieler, kein Team).
//
// Tabelle, Sieger-Ermittlung, Tiebreaker und Auf-/Abstiegsvorschlag sind
// bewusst NICHT hier neu implementiert: computeBoxStandings(),
// winnerOfBoxMatch(), isBoxComplete(), proposePromotions() aus
// box-americano.ts sind format-agnostisch (siehe Kommentar dort) und
// funktionieren unverändert, wenn team1/team2 hier je genau einen Sitz
// statt zwei enthalten. Nur die RUNDENPLANUNG unterscheidet sich
// tatsächlich — die steht hier.

import type { BoxLeagueConfig, RoundPairing } from './box-americano';

export const SINGLES_LADDER_DEFAULTS: BoxLeagueConfig = {
	boxSize: 6,
	rounds: 5, // Round-Robin bei geradem boxSize: boxSize - 1 Runden
	pointsPerWin: 1,
	promote: 1,
	relegate: 1,
	relegateTopBox: 2,
	promoteBottomBox: 2,
	tiebreakers: ['match_points', 'set_diff', 'game_diff'],
	selfServiceWeeks: 3
};

/**
 * Round-Robin nach dem Kreisverfahren ("circle method"): Sitz 1 bleibt
 * fest, alle anderen rotieren im Kreis. Bei gerader Spielerzahl ergibt das
 * genau boxSize-1 Runden, in denen jeder gegen jeden einmal spielt. Bei
 * ungerader Spielerzahl bekommt ein rechnerischer "Freilos"-Sitz (0)
 * ergänzt — wer in einer Runde gegen 0 gelost wird, hat spielfrei; dieser
 * Sitz erscheint nie in einem echten league_box_members-Eintrag, das
 * Aufrufer-Ende (league.ts) filtert Runden mit Sitz 0 einfach heraus,
 * statt eine eigene "bye"-Semantik im Schema zu brauchen.
 */
export function roundPairings(boxSize: number): RoundPairing[] {
	if (boxSize < 2 || boxSize > 8) {
		throw new Error(`Ladder-Rundenplan ist nur für 2-8 Spieler definiert (angefragt: ${boxSize}).`);
	}

	// Sitze 1..boxSize. Bei ungerader Zahl kommt Sitz 0 als rechnerischer
	// Freilos-Platzhalter dazu, damit die Teilnehmerzahl für den Algorithmus
	// gerade ist (n). Sitz 0 bleibt an Position 0 FIX, während alle echten
	// Sitze um ihn herum rotieren — dadurch trifft in jeder Runde ein
	// ANDERER echter Sitz auf 0 (= hat diese Runde spielfrei), nicht immer
	// derselbe. Eine Paarung mit 0 wird unten übersprungen, taucht also nie
	// als RoundPairing auf.
	const isOdd = boxSize % 2 !== 0;
	const n = isOdd ? boxSize + 1 : boxSize;
	const rounds = n - 1;

	const fixed = isOdd ? 0 : 1;
	let rotating = isOdd
		? Array.from({ length: boxSize }, (_, i) => i + 1)
		: Array.from({ length: boxSize - 1 }, (_, i) => i + 2);

	const pairings: RoundPairing[] = [];
	for (let round = 1; round <= rounds; round++) {
		const current = [fixed, ...rotating];
		const half = current.length / 2;
		for (let i = 0; i < half; i++) {
			const a = current[i];
			const b = current[current.length - 1 - i];
			if (a === 0 || b === 0) continue; // Freilos — keine echte Partie diese Runde
			pairings.push({ roundNumber: round, team1: [a], team2: [b] });
		}
		// Rotation: letztes Element nach vorn (direkt hinter dem fixen Sitz).
		rotating = [rotating[rotating.length - 1], ...rotating.slice(0, -1)];
	}

	return pairings;
}
