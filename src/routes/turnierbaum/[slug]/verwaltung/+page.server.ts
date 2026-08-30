// ============================================================
// TennisIndex — Turnierbaum-Verwaltung: Teilnehmer:innen, Auslosung, Ergebnisse
// ============================================================
// Gleiches Autorisierungsmuster wie /turnier/.../verwaltung: requireBracketAdmin
// prüft bei JEDEM Laden UND JEDER Aktion neu, nie nur einmal (der Slug in
// der URL ist Nutzereingabe).

import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';
import { loadBracketEntries, loadBracketMatches, type BracketEntry, type BracketMatchView } from '$lib/server/bracket';
import {
	addParticipant,
	loadClubMemberOptions,
	removeParticipant,
	reportBracketMatchResult,
	requireBracketAdmin,
	shuffleSeeds,
	startDraw,
	type ClubMemberOption
} from '$lib/server/bracket-admin';

export const load: PageServerLoad = async ({ params, url, platform, locals }) => {
	const event = await requireBracketAdmin(platform, params.slug, locals.player?.id, url.pathname);
	const admin = supabaseAdmin(platform);

	if (event.status === 'draft') {
		const [entries, members] = await Promise.all([
			loadBracketEntries(admin, event.id),
			loadClubMemberOptions(admin, event.clubId)
		]);
		const participants = [...entries.values()].sort((a, b) => a.seed - b.seed);
		const takenPlayerIds = new Set(participants.flatMap((p) => p.players.map((pl) => pl.playerId)));
		const availableMembers = members.filter((m) => !takenPlayerIds.has(m.playerId));
		return { event, participants, availableMembers, matches: [] as BracketMatchView[] };
	}

	const matches = await loadBracketMatches(admin, event.id);
	return {
		event,
		participants: [] as BracketEntry[],
		availableMembers: [] as ClubMemberOption[],
		matches
	};
};

/** Bis zu fünf Sätze aus dem Formular lesen — leere Zeilen am Ende erlaubt, halb ausgefüllte nicht. */
function readSets(
	form: FormData
): { team1Games: number; team2Games: number }[] | { error: string } {
	const sets: { team1Games: number; team2Games: number }[] = [];
	for (let i = 1; i <= 5; i++) {
		const raw1 = String(form.get(`set${i}team1`) ?? '').trim();
		const raw2 = String(form.get(`set${i}team2`) ?? '').trim();
		if (raw1 === '' && raw2 === '') continue;
		if (raw1 === '' || raw2 === '') return { error: `Satz ${i}: bitte beide Spielstände eintragen.` };
		const a = Number(raw1);
		const b = Number(raw2);
		if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0 || a > 99 || b > 99) {
			return { error: `Satz ${i}: nur ganze Zahlen zwischen 0 und 99.` };
		}
		sets.push({ team1Games: a, team2Games: b });
	}
	return sets;
}

export const actions: Actions = {
	addParticipant: async ({ request, params, url, platform, locals }) => {
		const event = await requireBracketAdmin(platform, params.slug, locals.player?.id, url.pathname);
		const admin = supabaseAdmin(platform);
		const form = await request.formData();
		const playerId1 = String(form.get('playerId1') ?? '');
		const playerId2 = String(form.get('playerId2') ?? '');
		if (!playerId1) return fail(400, { message: 'Bitte eine Person auswählen.' });

		const playerIds = event.category === 'doubles' ? [playerId1, playerId2].filter(Boolean) : [playerId1];
		const result = await addParticipant(admin, event, playerIds);
		if (!result.ok) return fail(400, { message: result.message });
		return { success: true, action: 'addParticipant' };
	},

	removeParticipant: async ({ request, params, url, platform, locals }) => {
		const event = await requireBracketAdmin(platform, params.slug, locals.player?.id, url.pathname);
		const admin = supabaseAdmin(platform);
		const form = await request.formData();
		const participantId = String(form.get('participantId') ?? '');
		if (!participantId) return fail(400, { message: 'Ungültige Anfrage.' });

		const result = await removeParticipant(admin, event, participantId);
		if (!result.ok) return fail(400, { message: result.message });
		return { success: true, action: 'removeParticipant' };
	},

	shuffle: async ({ params, url, platform, locals }) => {
		const event = await requireBracketAdmin(platform, params.slug, locals.player?.id, url.pathname);
		const admin = supabaseAdmin(platform);
		const result = await shuffleSeeds(admin, event);
		if (!result.ok) return fail(400, { message: result.message });
		return { success: true, action: 'shuffle' };
	},

	startDraw: async ({ params, url, platform, locals }) => {
		const event = await requireBracketAdmin(platform, params.slug, locals.player?.id, url.pathname);
		const admin = supabaseAdmin(platform);
		const result = await startDraw(admin, event);
		if (!result.ok) return fail(400, { message: result.message });
		return { success: true, action: 'startDraw' };
	},

	report: async ({ request, params, url, platform, locals }) => {
		const event = await requireBracketAdmin(platform, params.slug, locals.player?.id, url.pathname);
		const admin = supabaseAdmin(platform);
		const form = await request.formData();
		const bracketMatchId = String(form.get('bracketMatchId') ?? '');
		const isWalkover = form.get('isWalkover') === 'true';
		const winnerSideRaw = Number(form.get('winnerSide') ?? '');
		if (!bracketMatchId) return fail(400, { message: 'Keine Partie angegeben.' });
		if (winnerSideRaw !== 1 && winnerSideRaw !== 2) {
			return fail(400, { message: 'Bitte die siegende Seite wählen.' });
		}

		const matches = await loadBracketMatches(admin, event.id);
		const match = matches.find((m) => m.id === bracketMatchId);
		if (!match) return fail(404, { message: 'Partie nicht gefunden.' });
		if (!match.entry1 || !match.entry2) {
			return fail(400, { message: 'Diese Partie ist noch nicht vollständig ausgelost.' });
		}

		let sets: { team1Games: number; team2Games: number }[] = [];
		if (!isWalkover) {
			const parsed = readSets(form);
			if ('error' in parsed) return fail(400, { message: parsed.error });
			if (parsed.length === 0) return fail(400, { message: 'Bitte mindestens einen Satz eintragen.' });
			sets = parsed;
		}

		const result = await reportBracketMatchResult(admin, locals.player!.id, {
			bracketMatchId,
			team1PlayerIds: match.entry1.players.map((p) => p.playerId),
			team2PlayerIds: match.entry2.players.map((p) => p.playerId),
			sets,
			winnerSide: winnerSideRaw as 1 | 2,
			isWalkover
		});
		if (!result.ok) return fail(400, { message: result.message });
		return { success: true, action: 'report' };
	}
};
