import { describe, expect, it } from 'vitest';
import { validateMatchReport, type MatchReportInput } from './match-report';

const doubles: MatchReportInput = {
	discipline: 'doubles',
	reporterId: 'p1',
	partnerId: 'p2',
	opponent1Id: 'p3',
	opponent2Id: 'p4',
	sets: [{ team1Games: 6, team2Games: 3 }],
	competitionType: 'freizeit'
};

const singles: MatchReportInput = {
	discipline: 'singles',
	reporterId: 'p1',
	partnerId: '',
	opponent1Id: 'p3',
	opponent2Id: '',
	sets: [{ team1Games: 6, team2Games: 3 }],
	competitionType: 'freizeit'
};

describe('validateMatchReport — Doppel', () => {
	it('akzeptiert ein gültiges Einzelsatz-Match', () => {
		expect(validateMatchReport(doubles)).toEqual({ ok: true });
	});

	it('akzeptiert bis zu drei Sätze', () => {
		expect(
			validateMatchReport({
				...doubles,
				sets: [
					{ team1Games: 6, team2Games: 4 },
					{ team1Games: 4, team2Games: 6 },
					{ team1Games: 7, team2Games: 6 }
				]
			})
		).toEqual({ ok: true });
	});

	it('lehnt weniger als vier verschiedene Spieler ab', () => {
		expect(validateMatchReport({ ...doubles, partnerId: 'p1' }).ok).toBe(false);
	});

	it('lehnt fehlende Spieler ab', () => {
		expect(validateMatchReport({ ...doubles, opponent2Id: '' }).ok).toBe(false);
	});

	it('lehnt null oder mehr als drei Sätze ab', () => {
		expect(validateMatchReport({ ...doubles, sets: [] }).ok).toBe(false);
		expect(
			validateMatchReport({
				...doubles,
				sets: [
					{ team1Games: 6, team2Games: 0 },
					{ team1Games: 6, team2Games: 0 },
					{ team1Games: 6, team2Games: 0 },
					{ team1Games: 6, team2Games: 0 }
				]
			}).ok
		).toBe(false);
	});

	it('lehnt unentschiedene Sätze ab', () => {
		expect(validateMatchReport({ ...doubles, sets: [{ team1Games: 6, team2Games: 6 }] }).ok).toBe(
			false
		);
	});

	it('lehnt Spielstände außerhalb 0-99 ab', () => {
		expect(
			validateMatchReport({ ...doubles, sets: [{ team1Games: 100, team2Games: 3 }] }).ok
		).toBe(false);
		expect(
			validateMatchReport({ ...doubles, sets: [{ team1Games: -1, team2Games: 3 }] }).ok
		).toBe(false);
	});

	it('lehnt Nicht-Ganzzahlen ab', () => {
		expect(
			validateMatchReport({ ...doubles, sets: [{ team1Games: 6.5, team2Games: 3 }] }).ok
		).toBe(false);
	});

	it('lehnt ungültigen Wettbewerbs-Typ ab', () => {
		// @ts-expect-error absichtlich ungültiger Wert
		expect(validateMatchReport({ ...doubles, competitionType: 'urlaub' }).ok).toBe(false);
	});

	it('akzeptiert alle fünf gültigen Wettbewerbs-Typen', () => {
		for (const competitionType of [
			'verband',
			'turnier',
			'vereinsliga',
			'tennisindex_challenge',
			'freizeit'
		] as const) {
			expect(validateMatchReport({ ...doubles, competitionType })).toEqual({ ok: true });
		}
	});
});

describe('validateMatchReport — Einzel', () => {
	it('akzeptiert ein gültiges Einzel-Match mit nur zwei Spielern', () => {
		expect(validateMatchReport(singles)).toEqual({ ok: true });
	});

	it('lehnt fehlenden Gegner ab', () => {
		expect(validateMatchReport({ ...singles, opponent1Id: '' }).ok).toBe(false);
	});

	it('lehnt identischen Melder und Gegner ab', () => {
		expect(validateMatchReport({ ...singles, opponent1Id: 'p1' }).ok).toBe(false);
	});

	it('ignoriert einen versehentlich gesetzten Partner/zweiten Gegner nicht als Konflikt', () => {
		// partnerId/opponent2Id fließen bei Einzel gar nicht in die
		// Eindeutigkeitsprüfung ein — nur reporterId/opponent1Id zählen.
		expect(validateMatchReport({ ...singles, partnerId: 'p1' }).ok).toBe(true);
	});
});
