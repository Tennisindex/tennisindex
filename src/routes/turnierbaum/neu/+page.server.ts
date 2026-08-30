// ============================================================
// TennisIndex — /turnierbaum/neu: neuen Doppel-K.o.-Turnierbaum anlegen
// ============================================================
// Anders als bei den Box-Ligen (leagues) gibt es hier bewusst eine
// Self-Service-Anlage für Vereins-Admins — ein Turnierbaum ist ein
// einzelnes, wiederholbares Event (nicht die einmalige Grundstruktur
// eines Vereins), das reale Nutzung ohne SQL-Zugriff erlaubt.

import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';
import { loadAdminClubs } from '$lib/server/club-admin';
import { createBracketEvent } from '$lib/server/bracket-admin';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.player || !locals.supabase) {
		throw redirect(303, `/anmelden?next=${encodeURIComponent(url.pathname)}`);
	}
	const clubs = await loadAdminClubs(locals.supabase, locals.player.id);
	if (clubs.length === 0) {
		throw error(403, 'Nur Vereins-Admins können einen Turnierbaum anlegen.');
	}
	return { clubs };
};

export const actions: Actions = {
	default: async ({ request, locals, url, platform }) => {
		if (!locals.player || !locals.supabase) {
			throw redirect(303, `/anmelden?next=${encodeURIComponent(url.pathname)}`);
		}
		const clubs = await loadAdminClubs(locals.supabase, locals.player.id);
		const form = await request.formData();
		const clubId = String(form.get('clubId') ?? '');
		const name = String(form.get('name') ?? '');
		const slug = String(form.get('slug') ?? '');
		const category = String(form.get('category') ?? '') === 'doubles' ? 'doubles' : 'singles';

		if (!clubs.some((c) => c.id === clubId)) {
			return fail(403, { message: 'Kein Admin-Zugriff auf diesen Verein.' });
		}

		const result = await createBracketEvent(supabaseAdmin(platform), clubId, { name, slug, category });
		if (!result.ok) return fail(400, { message: result.message });

		throw redirect(303, `/turnierbaum/${result.value.slug}/verwaltung`);
	}
};
