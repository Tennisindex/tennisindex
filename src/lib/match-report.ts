// ============================================================
// TennisIndex — reine Validierung fürs Match-Melden
// ============================================================
//
// Meldeformular denkt in "ich (+ Partner) gegen Gegner (+ zweiter Gegner)"
// (team1 = Melder-Team, team2 = Gegner-Team) statt in generischer
// Team-Zuordnung — so berichtet ein Spieler tatsächlich von seinem Match.
//
// EINZEL/DOPPEL vs. WETTBEWERBS-KATEGORIE — zwei unabhängige Achsen, die
// bei PadelIndex noch denselben Namen ("matchType") teilten, weil es dort
// nur Doppel gab. Hier bewusst getrennt:
//   - `discipline`: 'singles' | 'doubles' — WIE gespielt wurde, bestimmt
//     die Anzahl Positionen im Formular UND welches player_ratings-Konto
//     (siehe supabase/migrations/0001_schema.sql) das Ergebnis verändert.
//   - `competitionType`: 'freizeit' | 'verband' | ... — WOFÜR gespielt
//     wurde, rein beschreibend für Anzeige/Filter, ändert nie das Rating
//     direkt (das steuert weiterhin matches.source, siehe rating-core.ts
//     computeTokenGrants()).

import { m } from '$lib/paraglide/messages.js';

export type SetScoreInput = { team1Games: number; team2Games: number };

export type Discipline = 'singles' | 'doubles';

export type CompetitionType = 'verband' | 'turnier' | 'vereinsliga' | 'tennisindex_challenge' | 'freizeit';

export const COMPETITION_TYPES: readonly CompetitionType[] = [
	'freizeit',
	'verband',
	'turnier',
	'vereinsliga',
	'tennisindex_challenge'
];

/** Verband = vom Deutschen Tennis Bund (oder Landesverband) organisierte Punktspiele. */
export function competitionTypeLabels(): Record<CompetitionType, string> {
	return {
		freizeit: m.mt_freizeit(),
		verband: m.mt_verband(),
		turnier: m.mt_turnier(),
		vereinsliga: m.mt_vereinsliga(),
		tennisindex_challenge: m.mt_tennisindex_challenge()
	};
}

export function disciplineLabels(): Record<Discipline, string> {
	return {
		singles: m.discipline_singles(),
		doubles: m.discipline_doubles()
	};
}

export type MatchReportInput = {
	discipline: Discipline;
	reporterId: string;
	/** Nur bei discipline='doubles' gesetzt/relevant. */
	partnerId: string;
	opponent1Id: string;
	/** Nur bei discipline='doubles' gesetzt/relevant. */
	opponent2Id: string;
	sets: SetScoreInput[];
	competitionType: CompetitionType;
};

export type ValidationResult = { ok: true } | { ok: false; message: string };

export const MAX_SETS = 3;
export const MAX_GAMES = 99;

export function validateMatchReport(input: MatchReportInput): ValidationResult {
	if (input.discipline !== 'singles' && input.discipline !== 'doubles') {
		return { ok: false, message: 'Ungültige Spielart.' };
	}

	const ids =
		input.discipline === 'singles'
			? [input.reporterId, input.opponent1Id]
			: [input.reporterId, input.partnerId, input.opponent1Id, input.opponent2Id];

	if (ids.some((id) => !id)) {
		return {
			ok: false,
			message:
				input.discipline === 'singles'
					? 'Bitte dich und deinen Gegner auswählen.'
					: 'Bitte alle vier Spieler auswählen.'
		};
	}
	if (new Set(ids).size !== ids.length) {
		return {
			ok: false,
			message:
				input.discipline === 'singles'
					? 'Melder und Gegner müssen unterschiedlich sein.'
					: 'Alle vier Spieler müssen unterschiedlich sein.'
		};
	}
	if (!COMPETITION_TYPES.includes(input.competitionType)) {
		return { ok: false, message: 'Ungültiger Wettbewerbs-Typ.' };
	}

	if (input.sets.length === 0 || input.sets.length > MAX_SETS) {
		return { ok: false, message: `Zwischen einem und ${MAX_SETS} Sätzen angeben.` };
	}

	for (const s of input.sets) {
		if (!Number.isInteger(s.team1Games) || !Number.isInteger(s.team2Games)) {
			return { ok: false, message: 'Spielstände müssen ganze Zahlen sein.' };
		}
		if (
			s.team1Games < 0 ||
			s.team1Games > MAX_GAMES ||
			s.team2Games < 0 ||
			s.team2Games > MAX_GAMES
		) {
			return { ok: false, message: `Spielstand muss zwischen 0 und ${MAX_GAMES} liegen.` };
		}
		if (s.team1Games === s.team2Games) {
			return { ok: false, message: 'Ein Satz kann nicht unentschieden enden.' };
		}
	}

	return { ok: true };
}
