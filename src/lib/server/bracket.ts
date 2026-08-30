// ============================================================
// TennisIndex — Turnierbaum-Modul: Datenzugriff (lesend)
// ============================================================
// Analog zu league.ts: reine Übersetzung zwischen bracket_*-Tabellen und
// Ansichts-Typen fürs UI. Die Planungslogik (double-elimination.ts) und
// die schreibenden Operationen (bracket-admin.ts) leben bewusst getrennt.
//
// Namen kommen ausschließlich aus bracket_participant_view (0020) — der
// gleichen Anonymisierung wie league_box_lineup/club_leaderboard.

import { error } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';

export type BracketCategory = 'singles' | 'doubles';
export type BracketEventStatus = 'draft' | 'running' | 'completed';
export type BracketSide = 'winners' | 'losers' | 'grand_final';
export type BracketMatchStatus = 'pending' | 'scheduled' | 'bye' | 'walkover' | 'played';

export type BracketEvent = {
	id: string;
	clubId: string;
	clubName: string | null;
	clubSlug: string | null;
	name: string;
	slug: string;
	category: BracketCategory;
	status: BracketEventStatus;
	drawSize: number | null;
	championEntryId: string | null;
};

export type BracketEntryPlayer = {
	playerId: string;
	name: string;
	handle: string | null;
	claimed: boolean;
	rating: number;
};

export type BracketEntry = {
	id: string;
	seed: number;
	players: BracketEntryPlayer[];
	/** "Name A" bei Einzel, "Name A / Name B" bei Doppel — fürs UI, nicht neu zu bauen an jeder Stelle. */
	displayName: string;
};

export type BracketMatchView = {
	id: string;
	bracket: BracketSide;
	round: number;
	slot: number;
	entry1: BracketEntry | null;
	entry2: BracketEntry | null;
	winnerEntryId: string | null;
	status: BracketMatchStatus;
	/** Nur bei status='played' gefüllt — team1/team2 entsprechen entry1/entry2. */
	sets: { team1Games: number; team2Games: number }[];
};

export async function loadBracketEvent(sb: SupabaseClient, slug: string): Promise<BracketEvent | null> {
	const { data, error: err } = await sb
		.from('bracket_events')
		.select('id, club_id, name, slug, category, status, draw_size, champion_entry_id, clubs(name, slug)')
		.eq('slug', slug)
		.maybeSingle();

	if (err) throw error(500, err.message);
	if (!data) return null;

	const club = data.clubs as unknown as { name: string; slug: string } | null;
	return {
		id: data.id,
		clubId: data.club_id,
		clubName: club?.name ?? null,
		clubSlug: club?.slug ?? null,
		name: data.name,
		slug: data.slug,
		category: data.category,
		status: data.status,
		drawSize: data.draw_size,
		championEntryId: data.champion_entry_id
	};
}

function entryDisplayName(players: BracketEntryPlayer[]): string {
	return players.map((p) => p.name).join(' / ');
}

/** Alle Teilnehmer:innen eines Turniers, gruppiert je Teilnehmer:in (bei Doppel 2 Zeilen -> 1 Entry). */
export async function loadBracketEntries(
	sb: SupabaseClient,
	eventId: string
): Promise<Map<string, BracketEntry>> {
	const { data, error: err } = await sb
		.from('bracket_participant_view')
		.select('participant_id, seed, player_id, handle, name, claimed, rating')
		.eq('event_id', eventId);

	if (err) throw error(500, err.message);

	const byParticipant = new Map<string, { seed: number; players: BracketEntryPlayer[] }>();
	for (const row of data ?? []) {
		const existing = byParticipant.get(row.participant_id);
		const player: BracketEntryPlayer = {
			playerId: row.player_id,
			name: row.name,
			handle: row.handle,
			claimed: row.claimed,
			rating: Number(row.rating ?? 0)
		};
		if (existing) {
			existing.players.push(player);
		} else {
			byParticipant.set(row.participant_id, { seed: row.seed, players: [player] });
		}
	}

	const result = new Map<string, BracketEntry>();
	for (const [id, v] of byParticipant) {
		result.set(id, { id, seed: v.seed, players: v.players, displayName: entryDisplayName(v.players) });
	}
	return result;
}

/**
 * `sb` sollte der Admin-Client sein, sobald das Ergebnis öffentlich
 * angezeigt wird: match_sets ist wie überall in diesem Schema per RLS auf
 * Beteiligte beschränkt (siehe /turnier/[slug]/+page.server.ts — gleiche
 * Begründung, gleiche Lösung).
 */
export async function loadBracketMatches(
	sb: SupabaseClient,
	eventId: string
): Promise<BracketMatchView[]> {
	const [{ data: matchRows, error: mErr }, entries] = await Promise.all([
		sb
			.from('bracket_matches')
			.select('id, bracket, round, slot, entry1_id, entry2_id, winner_entry_id, status, match_id')
			.eq('event_id', eventId)
			.order('bracket', { ascending: true })
			.order('round', { ascending: true })
			.order('slot', { ascending: true }),
		loadBracketEntries(sb, eventId)
	]);

	if (mErr) throw error(500, mErr.message);

	const matchIds = (matchRows ?? []).map((m) => m.match_id).filter((id): id is string => id !== null);
	const setsByMatchId = new Map<string, { team1Games: number; team2Games: number }[]>();
	if (matchIds.length > 0) {
		const { data: setRows, error: sErr } = await sb
			.from('match_sets')
			.select('match_id, set_number, team1_games, team2_games')
			.in('match_id', matchIds)
			.order('set_number', { ascending: true });
		if (sErr) throw error(500, sErr.message);
		for (const row of setRows ?? []) {
			const list = setsByMatchId.get(row.match_id) ?? [];
			list.push({ team1Games: row.team1_games, team2Games: row.team2_games });
			setsByMatchId.set(row.match_id, list);
		}
	}

	return (matchRows ?? []).map((m) => ({
		id: m.id,
		bracket: m.bracket,
		round: m.round,
		slot: m.slot,
		entry1: m.entry1_id ? (entries.get(m.entry1_id) ?? null) : null,
		entry2: m.entry2_id ? (entries.get(m.entry2_id) ?? null) : null,
		winnerEntryId: m.winner_entry_id,
		status: m.status,
		sets: m.match_id ? (setsByMatchId.get(m.match_id) ?? []) : []
	}));
}

export type ClubBracketEventSummary = {
	id: string;
	name: string;
	slug: string;
	category: BracketCategory;
	status: BracketEventStatus;
};

/** Für /verein/[slug]: alle Turnierbäume dieses Vereins, neueste zuerst. */
export async function listClubBracketEvents(
	sb: SupabaseClient,
	clubId: string
): Promise<ClubBracketEventSummary[]> {
	const { data, error: err } = await sb
		.from('bracket_events')
		.select('id, name, slug, category, status')
		.eq('club_id', clubId)
		.order('created_at', { ascending: false });

	if (err) throw error(500, err.message);
	return data ?? [];
}
