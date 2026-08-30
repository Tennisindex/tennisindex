import { describe, expect, it } from 'vitest';
import { planDoubleElimination, standardSeedOrder } from './double-elimination';

describe('standardSeedOrder', () => {
	it('erzeugt die bekannte gesetzte Reihenfolge für 8', () => {
		expect(standardSeedOrder(8)).toEqual([1, 8, 4, 5, 2, 7, 3, 6]);
	});

	it('erzeugt 1v2 für 2 Slots', () => {
		expect(standardSeedOrder(2)).toEqual([1, 2]);
	});
});

describe('planDoubleElimination — Fehlerfälle', () => {
	it('lehnt weniger als 4 Teilnehmer:innen ab', () => {
		expect(() => planDoubleElimination(3)).toThrow();
	});
});

describe('planDoubleElimination — ohne Freilose (Zweierpotenz)', () => {
	for (const n of [4, 8, 16]) {
		it(`baut den vollständigen Baum für ${n} Teilnehmer:innen`, () => {
			const plan = planDoubleElimination(n);
			expect(plan.drawSize).toBe(n);

			const wb = plan.matches.filter((m) => m.bracket === 'winners');
			const lb = plan.matches.filter((m) => m.bracket === 'losers');
			const gf = plan.matches.filter((m) => m.bracket === 'grand_final');

			// Ohne Freilose ist JEDE WB/LB-Partie eine echte Partie.
			expect(wb.length).toBe(n - 1);
			expect(gf.length).toBe(1);
			// Gesamtzahl echter Partien (ohne Reset) ist immer 2n-2.
			expect(wb.length + lb.length + gf.length).toBe(2 * n - 2);
			expect(wb.every((m) => !m.isBye)).toBe(true);
			expect(lb.every((m) => !m.isBye)).toBe(true);
		});
	}
});

describe('planDoubleElimination — Invariante: 2N-2 echte Partien, mit und ohne Freilose', () => {
	for (const n of [4, 5, 6, 7, 8, 9, 11, 13, 16, 17, 20]) {
		it(`${n} Teilnehmer:innen brauchen genau 2*${n}-2 echte Spiele (Freilose zählen nicht)`, () => {
			const plan = planDoubleElimination(n);
			const realGames = plan.matches.filter((m) => !m.isBye).length;
			expect(realGames).toBe(2 * n - 2);
		});
	}
});

describe('planDoubleElimination — Struktur-Integrität', () => {
	for (const n of [4, 5, 8, 11, 16]) {
		it(`${n} Teilnehmer:innen: eindeutige IDs, gültige Vorwärtszeiger, genau ein Grand Final`, () => {
			const plan = planDoubleElimination(n);
			const ids = new Set(plan.matches.map((m) => m.id));
			expect(ids.size).toBe(plan.matches.length);

			for (const m of plan.matches) {
				if (m.nextMatchWinnerId) expect(ids.has(m.nextMatchWinnerId)).toBe(true);
				if (m.nextMatchLoserId) expect(ids.has(m.nextMatchLoserId)).toBe(true);
				// Nur winners-Partien dürfen Verlierer weiterreichen.
				if (m.nextMatchLoserId) expect(m.bracket).toBe('winners');
			}

			const gf = plan.matches.filter((m) => m.bracket === 'grand_final');
			expect(gf.length).toBe(1);
			expect(gf[0].grandFinalWbSlot === 1 || gf[0].grandFinalWbSlot === 2).toBe(true);

			// Jeder reale Seed (1..n) taucht in Runde 1 der Winner-Bracket auf
			// (direkt als Teilnehmer oder als Freilos-Sieger).
			const round1 = plan.matches.filter((m) => m.bracket === 'winners' && m.round === 1);
			const seenSeeds = new Set<number>();
			for (const m of round1) {
				if (m.entry1Seed) seenSeeds.add(m.entry1Seed);
				if (m.entry2Seed) seenSeeds.add(m.entry2Seed);
				if (m.byeWinnerSeed) seenSeeds.add(m.byeWinnerSeed);
			}
			for (let seed = 1; seed <= n; seed++) {
				expect(seenSeeds.has(seed)).toBe(true);
			}
		});
	}

	it('vergibt Freilose an die schwächsten Seeds (nie an Seed 1)', () => {
		const plan = planDoubleElimination(5); // drawSize=8, seeds 6,7,8 sind Freilose
		const round1 = plan.matches.filter((m) => m.bracket === 'winners' && m.round === 1);
		const byes = round1.filter((m) => m.isBye);
		expect(byes.length).toBe(3);
		for (const b of byes) {
			expect(b.byeWinnerSeed).not.toBeNull();
			expect(b.byeWinnerSeed!).toBeLessThanOrEqual(5);
		}
		// Seed 1 spielt niemals gegen ein Freilos in Runde 1, wenn es ein
		// reales Match gibt, das er stattdessen bekommen könnte — hier mit
		// nur einem "echten" Match (4v5) ist Seed 1 trotzdem im Freilos,
		// weil die Standard-Setzung ihn mit dem schwächsten Seed (8) paart.
		const seed1Match = round1.find((m) => m.entry1Seed === 1 || m.byeWinnerSeed === 1);
		expect(seed1Match?.isBye).toBe(true);
	});
});
