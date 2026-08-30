// ============================================================
// TennisIndex — /turnierbaum/[slug]: öffentliche Baum-Ansicht
// ============================================================
// Admin-Client nötig: match_sets ist per RLS auf Beteiligte beschränkt,
// eine öffentliche Baum-Ansicht braucht die Ergebnisse aber vollständig
// (gleiche Begründung wie /turnier/[slug]/+page.server.ts).

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';
import { loadBracketEvent, loadBracketMatches } from '$lib/server/bracket';

export const load: PageServerLoad = async ({ params, platform }) => {
	const admin = supabaseAdmin(platform);
	const event = await loadBracketEvent(admin, params.slug);
	if (!event) throw error(404, 'Diesen Turnierbaum gibt es nicht.');

	const matches = await loadBracketMatches(admin, event.id);
	return { event, matches };
};
