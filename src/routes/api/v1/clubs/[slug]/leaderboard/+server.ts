import { json, isHttpError } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getClubLeaderboard } from '$lib/server/leaderboard';

const cors = {
	'access-control-allow-origin': '*',
	'access-control-allow-methods': 'GET, OPTIONS',
	'access-control-allow-headers': 'accept, content-type'
};

export const OPTIONS: RequestHandler = () => new Response(null, { headers: cors });

export const GET: RequestHandler = async ({ params, url, platform }) => {
	const raw = Number(url.searchParams.get('limit'));
	// Standard bleibt Doppel: bestehende Embeds (<tennisindex-leaderboard>
	// ohne category-Attribut) sollen weiterlaufen, ohne dass jede
	// eingebettete Widget-Instanz nachträglich angepasst werden muss.
	const category = url.searchParams.get('category') === 'singles' ? 'singles' : 'doubles';
	try {
		const board = await getClubLeaderboard(
			params.slug,
			category,
			Number.isFinite(raw) ? raw : undefined,
			platform
		);
		return json(board, {
			headers: {
				...cors,
				'cache-control': 'public, max-age=60, s-maxage=300'
			}
		});
	} catch (err) {
		if (isHttpError(err)) {
			const message =
				typeof err.body === 'object' && err.body && 'message' in err.body
					? String(err.body.message)
					: 'Fehler';
			return json({ message }, { status: err.status, headers: cors });
		}
		throw err;
	}
};
