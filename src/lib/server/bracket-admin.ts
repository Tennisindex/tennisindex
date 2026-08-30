// ============================================================
// TennisIndex — Turnierbaum-Modul: Admin-Schreibzugriffe
// ============================================================
// Gleiches Muster wie league-admin.ts: Schreiben läuft über service_role,
// es gibt bewusst keine INSERT/UPDATE/DELETE-Policies auf den
// bracket_*-Tabellen. Die Autorisierung ("ist diese Person Admin GENAU
// dieses Vereins?") prüft requireBracketAdmin() über isClubAdmin() VOR
// jedem Aufruf, nie nur einmal.
//
// Die Auslosung selbst (Freilos-Kaskaden, Vorwärtszeiger) plant
// double-elimination.ts rein in TypeScript — startDraw() ordnet den
// abstrakten Seed-Nummern hier erst die echten bracket_participants-IDs
// zu und übergibt das fertige Ergebnis an create_bracket_draw() (0020),
// die es atomar in einem Insert persistiert.

import { error, redirect } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin, supabasePublic } from '$lib/server/supabase';
import { isClubAdmin } from '$lib/server/club-admin';
import { loadBracketEvent, type BracketEvent } from '$lib/server/bracket';
import { planDoubleElimination } from '$lib/bracket/double-elimination';

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Gemeinsame Zugriffsprüfung für alle /turnierbaum/[slug]/verwaltung/*-
 * Routen: nicht eingeloggt -> zum Login mit Rücksprung; kein
 * Vereins-Admin -> 403. Bei JEDEM Laden und JEDER Aktion neu geprüft.
 */
export async function requireBracketAdmin(
	platform: App.Platform | undefined,
	slug: string,
	playerId: string | undefined,
	pathname: string
): Promise<BracketEvent> {
	const event = await loadBracketEventForAdmin(platform, slug);
	if (!event) throw error(404, 'Diesen Turnierbaum gibt es nicht.');
	if (!playerId) throw redirect(303, `/anmelden?next=${encodeURIComponent(pathname)}`);

	const ok = await isClubAdmin(supabaseAdmin(platform), event.clubId, playerId);
	if (!ok) throw error(403, 'Nur Vereins-Admins können diesen Turnierbaum verwalten.');

	return event;
}

/** Wie loadBracketEvent, aber über den Admin-Client — Verwaltung muss auch 'draft'-Turniere sehen (RLS lässt nur status<>'draft' öffentlich durch). */
async function loadBracketEventForAdmin(
	platform: App.Platform | undefined,
	slug: string
): Promise<BracketEvent | null> {
	return loadBracketEvent(supabaseAdmin(platform), slug);
}

export type WriteResult<T = undefined> = { ok: true; value: T } | { ok: false; message: string };

function ok<T>(value: T): WriteResult<T> {
	return { ok: true, value };
}
function fail(message: string): WriteResult<never> {
	return { ok: false, message };
}

/**
 * Legt ein neues Turnier im Status 'draft' an. Der Slug wird vom Admin
 * vergeben (wie bei clubs.slug/leagues.slug — keine automatische
 * Ableitung), muss aber schon hier valide sein, sonst wäre der
 * DB-Constraint die einzige Fehlermeldung.
 */
export async function createBracketEvent(
	admin: SupabaseClient,
	clubId: string,
	params: { name: string; slug: string; category: 'singles' | 'doubles' }
): Promise<WriteResult<{ slug: string }>> {
	const name = params.name.trim();
	const slug = params.slug.trim().toLowerCase();
	if (!name) return fail('Name ist Pflicht.');
	if (!SLUG_PATTERN.test(slug)) {
		return fail('Slug darf nur Kleinbuchstaben, Ziffern und Bindestriche enthalten.');
	}

	const { error: err } = await admin.from('bracket_events').insert({
		club_id: clubId,
		name,
		slug,
		category: params.category
	});

	if (err) {
		if (err.code === '23505') return fail(`Der Slug "${slug}" ist schon vergeben.`);
		return fail(err.message);
	}
	return ok({ slug });
}

export type ClubMemberOption = {
	playerId: string;
	name: string;
	handle: string;
};

/** Nächste freie Seed-Nummer — reiner Vorschlag, Admin kann sie beim Mischen neu vergeben. */
async function nextSeed(admin: SupabaseClient, eventId: string): Promise<number> {
	const { data } = await admin
		.from('bracket_participants')
		.select('seed')
		.eq('event_id', eventId)
		.order('seed', { ascending: false })
		.limit(1)
		.maybeSingle();
	return (data?.seed ?? 0) + 1;
}

/**
 * Fügt eine Teilnehmer:in hinzu — 1 Spieler bei Einzel, 2 bei Doppel
 * (playerIds.length muss zur Turnier-Kategorie passen). Nur vor
 * Auslosungsstart möglich (status='draft').
 */
export async function addParticipant(
	admin: SupabaseClient,
	event: BracketEvent,
	playerIds: string[]
): Promise<WriteResult> {
	if (event.status !== 'draft') {
		return fail('Teilnehmer:innen lassen sich nur vor der Auslosung ändern.');
	}
	const expected = event.category === 'doubles' ? 2 : 1;
	if (playerIds.length !== expected || new Set(playerIds).size !== expected) {
		return fail(`Bei ${event.category === 'doubles' ? 'Doppel' : 'Einzel'} genau ${expected} Spieler:in(nen) auswählen.`);
	}

	const seed = await nextSeed(admin, event.id);
	const { data: participant, error: pErr } = await admin
		.from('bracket_participants')
		.insert({ event_id: event.id, seed })
		.select('id')
		.single();
	if (pErr) return fail(pErr.message);

	const { error: linkErr } = await admin
		.from('bracket_participant_players')
		.insert(playerIds.map((playerId) => ({ participant_id: participant.id, player_id: playerId })));
	if (linkErr) {
		await admin.from('bracket_participants').delete().eq('id', participant.id);
		if (linkErr.code === '23505') {
			return fail('Mindestens eine dieser Personen ist schon gemeldet.');
		}
		return fail(linkErr.message);
	}
	return ok(undefined);
}

export async function removeParticipant(
	admin: SupabaseClient,
	event: BracketEvent,
	participantId: string
): Promise<WriteResult> {
	if (event.status !== 'draft') {
		return fail('Teilnehmer:innen lassen sich nur vor der Auslosung ändern.');
	}
	const { error: err } = await admin
		.from('bracket_participants')
		.delete()
		.eq('id', participantId)
		.eq('event_id', event.id);
	if (err) return fail(err.message);
	return ok(undefined);
}

/** Mischt die Setzliste zufällig neu — nur vor Auslosungsstart. */
export async function shuffleSeeds(admin: SupabaseClient, event: BracketEvent): Promise<WriteResult> {
	if (event.status !== 'draft') {
		return fail('Die Setzliste lässt sich nur vor der Auslosung mischen.');
	}
	const { data, error: readErr } = await admin
		.from('bracket_participants')
		.select('id')
		.eq('event_id', event.id);
	if (readErr) return fail(readErr.message);
	if (!data || data.length === 0) return ok(undefined);

	const ids = data.map((r) => r.id);
	for (let i = ids.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[ids[i], ids[j]] = [ids[j], ids[i]];
	}

	// Erst auf negative, garantiert kollisionsfreie Platzhalter setzen —
	// sonst verletzt das Umnummerieren mitten im Durchlauf den
	// unique(event_id, seed)-Constraint (kein "deferrable" auf dieser
	// Tabelle, anders als league_box_members.seat in 0011).
	for (let i = 0; i < ids.length; i++) {
		const { error: e1 } = await admin
			.from('bracket_participants')
			.update({ seed: -(i + 1) })
			.eq('id', ids[i]);
		if (e1) return fail(e1.message);
	}
	for (let i = 0; i < ids.length; i++) {
		const { error: e2 } = await admin
			.from('bracket_participants')
			.update({ seed: i + 1 })
			.eq('id', ids[i]);
		if (e2) return fail(e2.message);
	}
	return ok(undefined);
}

/**
 * Startet die Auslosung: plant den kompletten Baum in TypeScript
 * (double-elimination.ts), ersetzt die abstrakten Seed-Nummern durch
 * echte bracket_participants-IDs und übergibt alles in EINEM RPC-Call an
 * create_bracket_draw (atomar, siehe 0020).
 */
export async function startDraw(admin: SupabaseClient, event: BracketEvent): Promise<WriteResult> {
	if (event.status !== 'draft') {
		return fail('Die Auslosung wurde schon gestartet.');
	}

	const { data: participants, error: pErr } = await admin
		.from('bracket_participants')
		.select('id, seed')
		.eq('event_id', event.id)
		.order('seed', { ascending: true });
	if (pErr) return fail(pErr.message);
	if (!participants || participants.length < 4) {
		return fail('Mindestens 4 Teilnehmer:innen nötig, bevor die Auslosung startet.');
	}

	const seedToParticipantId = new Map(participants.map((p) => [p.seed, p.id]));

	let plan;
	try {
		plan = planDoubleElimination(participants.length);
	} catch (e) {
		return fail(e instanceof Error ? e.message : 'Auslosung fehlgeschlagen.');
	}

	const matches = plan.matches.map((m) => {
		const entry1Id = m.entry1Seed ? (seedToParticipantId.get(m.entry1Seed) ?? null) : null;
		const entry2Id = m.entry2Seed ? (seedToParticipantId.get(m.entry2Seed) ?? null) : null;
		const winnerEntryId = m.isBye
			? (seedToParticipantId.get(m.byeWinnerSeed as number) ?? null)
			: null;
		const status = m.isBye ? 'bye' : entry1Id && entry2Id ? 'scheduled' : 'pending';
		return {
			id: m.id,
			bracket: m.bracket,
			round: m.round,
			slot: m.slot,
			entry1_id: entry1Id,
			entry2_id: entry2Id,
			winner_entry_id: winnerEntryId,
			status,
			next_match_winner_id: m.nextMatchWinnerId,
			next_match_winner_slot: m.nextMatchWinnerSlot,
			next_match_loser_id: m.nextMatchLoserId,
			next_match_loser_slot: m.nextMatchLoserSlot,
			grand_final_wb_slot: m.grandFinalWbSlot
		};
	});

	const { error: rpcErr } = await admin.rpc('create_bracket_draw', {
		p_event_id: event.id,
		p_draw_size: plan.drawSize,
		p_matches: matches
	});
	if (rpcErr) return fail(rpcErr.message);
	return ok(undefined);
}

export type ReportResultParams = {
	bracketMatchId: string;
	team1PlayerIds: string[];
	team2PlayerIds: string[];
	sets: { team1Games: number; team2Games: number }[];
	winnerSide: 1 | 2;
	isWalkover: boolean;
};

export async function reportBracketMatchResult(
	admin: SupabaseClient,
	adminPlayerId: string,
	params: ReportResultParams
): Promise<WriteResult> {
	const { error: err } = await admin.rpc('record_bracket_match_result', {
		p_bracket_match_id: params.bracketMatchId,
		p_admin_id: adminPlayerId,
		p_team1: params.team1PlayerIds,
		p_team2: params.team2PlayerIds,
		p_sets: params.isWalkover
			? []
			: params.sets.map((s) => ({ team1_games: s.team1Games, team2_games: s.team2Games })),
		p_winner_side: params.winnerSide,
		p_is_walkover: params.isWalkover
	});
	if (err) return fail(err.message);
	return ok(undefined);
}

/** Für die Teilnehmer:innen-Verwaltung: Vereinsmitglieder, geeignet als Option in der "hinzufügen"-Auswahl. */
export async function loadClubMemberOptions(
	admin: SupabaseClient,
	clubId: string
): Promise<ClubMemberOption[]> {
	const { data, error: err } = await admin
		.from('club_memberships')
		.select('players!inner(id, display_name, handle)')
		.eq('club_id', clubId);
	if (err) throw error(500, err.message);

	return (data ?? [])
		.map((row) => row.players as unknown as { id: string; display_name: string; handle: string })
		.map((p) => ({ playerId: p.id, name: p.display_name, handle: p.handle }))
		.sort((a, b) => a.name.localeCompare(b.name, 'de'));
}

// supabasePublic re-exportiert für Routen, die nur lesend auf öffentliche
// Turnierbaum-Daten zugreifen (kein Admin-Kontext nötig).
export { supabasePublic };
