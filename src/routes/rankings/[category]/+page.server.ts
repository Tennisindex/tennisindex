// ============================================================
// TennisIndex — /rankings/singles und /rankings/doubles
// ============================================================
// Vereinsübergreifende Bestenliste, getrennt nach Spielart — anders als
// /c/[slug] (PadelIndex-Konzept: eine Rangliste PRO Verein) gibt es hier
// keinen Club-Kontext. Ein Spieler kann in dieser Liste auftauchen, auch
// wenn sein Verein selbst noch keine eigene "starke" Rangliste hat — was
// zählt, ist ausschließlich sein persönliches Rating in dieser Kategorie.

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getGlobalLeaderboard } from '$lib/server/leaderboard';
import type { RatingCategory } from '$lib/leaderboard';

export const load: PageServerLoad = async ({ params, platform }) => {
	if (params.category !== 'singles' && params.category !== 'doubles') {
		throw error(404, 'Unbekannte Rangliste');
	}
	const category = params.category as RatingCategory;
	const board = await getGlobalLeaderboard(category, platform);
	return { board };
};
