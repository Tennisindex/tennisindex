import { isHttpError } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getClubLeaderboardPage } from '$lib/server/leaderboard';
import type { RatingCategory } from '$lib/leaderboard';

export const load: PageServerLoad = async ({ params, url, platform }) => {
	const rawPage = Number(url.searchParams.get('page'));
	const category: RatingCategory = url.searchParams.get('kategorie') === 'einzel' ? 'singles' : 'doubles';
	try {
		const board = await getClubLeaderboardPage(
			params.slug,
			category,
			Number.isFinite(rawPage) ? rawPage : undefined,
			platform
		);
		return { board, unavailable: false };
	} catch (err) {
		if (isHttpError(err) && err.status === 503) {
			return { board: null, unavailable: true };
		}
		throw err;
	}
};
