// ============================================================
// TennisIndex — Öffentliches Spielerprofil (/p/[handle])
// ============================================================
//
// players ist seit 0001_schema.sql nicht mehr direkt für anon lesbar
// (siehe club_leaderboard-View dort). Für ein Profil reicht aber keine
// einfache View — Matchhistorie, Formkurve und bevorzugte Partner brauchen
// mehrere Tabellen und echte Berechnung. Deshalb wie claims.ts/matches.ts:
// service_role + Maskierung in TypeScript statt einer weiteren SQL-View.
//
// SINGLES + DOUBLES: ein Spieler hat zwei unabhängige Ratings (Tabelle
// player_ratings, eine Zeile je Kategorie — siehe 0001_schema.sql).
// loadPublicProfile() liefert deshalb `singles`/`doubles` als zwei
// getrennte CategoryRating-Objekte statt eines einzelnen `rating`-Felds.
// Die Matchhistorie (loadPublicMatchHistory) trägt auf jedem Eintrag ein
// `discipline`-Feld ('singles'|'doubles') — das ist matches.match_type,
// zu unterscheiden von matches.competition_type (Freizeit/Turnier/...).
//
// abbreviateName() maskiert unbeanspruchte Profile exakt wie
// public_display_name() in der DB (siehe claim-match.ts) — Klarnamen
// importierter, nie beanspruchter Profile bleiben so auch hier verborgen.

import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { formatPlayerName } from '$lib/claim-match';
import type { CompetitionType } from '$lib/match-report';
import type { RatingCategory } from '$lib/leaderboard';

export type PlayingHand = 'rechts' | 'links';
export type PreferredSide = 'rechts' | 'links';
export type Gender = 'maennlich' | 'weiblich' | 'divers';

export type CategoryRating = {
	rating: number;
	confidence: number;
	matchesPlayed: number;
	provisional: boolean;
};

export type PublicProfile = {
	id: string;
	handle: string;
	name: string;
	claimed: boolean;
	singles: CategoryRating;
	doubles: CategoryRating;
	city: string | null;
	playingHand: PlayingHand | null;
	preferredSide: PreferredSide | null;
	gender: Gender | null;
	selfAssessedLevel: number | null;
	avatarUrl: string | null;
};

function toCategoryRating(row: {
	rating: number | string;
	sigma: number | string;
	matches_played: number;
	is_provisional: boolean;
}): CategoryRating {
	const sigma = Number(row.sigma);
	const confidence = Math.max(0, Math.min(1, 1 - sigma / (25 / 3)));
	return {
		rating: Number(row.rating),
		confidence: Number(confidence.toFixed(4)),
		matchesPlayed: row.matches_played,
		provisional: row.is_provisional
	};
}

/** null = nicht gefunden ODER profile_public=false — Aufrufer soll das nicht unterscheiden (404 in beiden Fällen). */
export async function loadPublicProfile(
	admin: SupabaseClient,
	handle: string
): Promise<PublicProfile | null> {
	const { data, error: err } = await admin
		.from('players')
		.select(
			'id, handle, display_name, claim_status, show_full_name, profile_public, city, playing_hand, preferred_side, gender, self_assessed_level, avatar_url'
		)
		.eq('handle', handle)
		.maybeSingle();

	if (err) throw error(500, err.message);
	if (!data || !data.profile_public) return null;

	const { data: ratings, error: ratingsErr } = await admin
		.from('player_ratings')
		.select('category, rating, sigma, matches_played, is_provisional')
		.eq('player_id', data.id);
	if (ratingsErr) throw error(500, ratingsErr.message);

	const byCategory = new Map((ratings ?? []).map((r) => [r.category, r]));
	const fallback = { rating: 0, sigma: 25 / 3, matches_played: 0, is_provisional: true };

	const claimed = data.claim_status === 'claimed';

	return {
		id: data.id,
		handle: data.handle,
		name: formatPlayerName(data.display_name, data.claim_status, data.show_full_name),
		claimed,
		singles: toCategoryRating(byCategory.get('singles') ?? fallback),
		doubles: toCategoryRating(byCategory.get('doubles') ?? fallback),
		city: data.city,
		playingHand: data.playing_hand,
		preferredSide: data.preferred_side,
		gender: data.gender,
		selfAssessedLevel: data.self_assessed_level === null ? null : Number(data.self_assessed_level),
		avatarUrl: data.avatar_url
	};
}

export type ProfileMatchEntry = {
	matchId: string;
	playedAt: string;
	won: boolean;
	ratingAfter: number;
	ratingDelta: number;
	myTeam: 1 | 2;
	/** 'singles' | 'doubles' — WIE gespielt wurde (matches.match_type). */
	discipline: RatingCategory;
	/** Freizeit/Turnier/Vereinsliga/... — WOFÜR gespielt wurde (matches.competition_type). */
	competitionType: CompetitionType;
	/** Nur bei discipline='doubles' gesetzt. */
	partner: { id: string; handle: string; name: string; claimed: boolean } | null;
	team1: { name: string; claimed: boolean }[];
	team2: { name: string; claimed: boolean }[];
	sets: { team1Games: number; team2Games: number }[];
};

type RawParticipant = {
	match_id: string;
	player_id: string;
	team: 1 | 2;
	players: {
		handle: string;
		display_name: string;
		claim_status: string;
		show_full_name: boolean;
		gender: string | null;
	} | null;
};

const nameOf = (p: RawParticipant['players']) =>
	p ? formatPlayerName(p.display_name, p.claim_status, p.show_full_name) : '?';

/**
 * Matchhistorie neueste-zuerst (für die Anzeige) — Formkurve/Badges
 * schneiden sich ihr eigenes Fenster daraus, drehen bei Bedarf selbst um.
 * `category` filtert auf Einzel ODER Doppel (für die getrennten "Singles
 * rating & history"/"Doubles rating & history"-Abschnitte); ohne Filter
 * (null) liefert sie die "Combined match history" mit discipline-Label auf
 * jedem Eintrag. rating_history trägt `category` bereits direkt (siehe
 * 0001_schema.sql) — kein Join gegen matches nötig, um zu filtern.
 * mixedMatchCount zählt Doppel-Matches, bei denen sich das Geschlecht von
 * Spieler und Partner unterscheidet (beide müssen es angegeben haben) —
 * bei Einzel gibt es strukturell keinen Partner, `partnerRow` ist dort
 * immer null, kein Sonderfall nötig.
 */
export async function loadPublicMatchHistory(
	admin: SupabaseClient,
	playerId: string,
	category: RatingCategory | null = null,
	limit = 40
): Promise<{ entries: ProfileMatchEntry[]; mixedMatchCount: number }> {
	let query = admin
		.from('rating_history')
		.select('match_id, rating_before, rating_after, factors, created_at')
		.eq('player_id', playerId)
		.eq('reason', 'match')
		.order('created_at', { ascending: false })
		.limit(limit);
	if (category) query = query.eq('category', category);

	const { data: history, error: histErr } = await query;

	if (histErr) throw error(500, histErr.message);
	if (!history || history.length === 0) return { entries: [], mixedMatchCount: 0 };

	const matchIds = history.map((h) => h.match_id).filter((id): id is string => id !== null);

	const [{ data: myGenderRow }, { data: matches }, { data: participants }, { data: sets }] =
		await Promise.all([
			admin.from('players').select('gender').eq('id', playerId).maybeSingle(),
			admin.from('matches').select('id, played_at, match_type, competition_type').in('id', matchIds),
			admin
				.from('match_participants')
				.select(
					'match_id, player_id, team, players(handle, display_name, claim_status, show_full_name, gender)'
				)
				.in('match_id', matchIds),
			admin
				.from('match_sets')
				.select('match_id, set_number, team1_games, team2_games')
				.in('match_id', matchIds)
		]);

	const playedAtByMatch = new Map((matches ?? []).map((m) => [m.id, m.played_at]));
	const disciplineByMatch = new Map(
		(matches ?? []).map((m) => [m.id, m.match_type as RatingCategory])
	);
	const competitionTypeByMatch = new Map(
		(matches ?? []).map((m) => [m.id, m.competition_type as CompetitionType])
	);
	const myGender = myGenderRow?.gender ?? null;
	let mixedMatchCount = 0;

	const entries: ProfileMatchEntry[] = history.map((h) => {
		const matchId = h.match_id as string;
		const mine = (participants ?? []).filter(
			(p) => p.match_id === matchId
		) as unknown as RawParticipant[];
		const myRow = mine.find((p) => p.player_id === playerId);
		const myTeam = (myRow?.team ?? 1) as 1 | 2;
		const partnerRow = mine.find((p) => p.player_id !== playerId && p.team === myTeam);

		if (myGender && partnerRow?.players?.gender && partnerRow.players.gender !== myGender) {
			mixedMatchCount++;
		}

		const toEntry = (p: RawParticipant) => ({
			name: nameOf(p.players),
			claimed: p.players?.claim_status === 'claimed'
		});

		return {
			matchId,
			playedAt: playedAtByMatch.get(matchId) ?? h.created_at,
			won: (h.factors as { won?: boolean } | null)?.won === true,
			ratingAfter: Number(h.rating_after),
			ratingDelta: Number(h.rating_after) - Number(h.rating_before),
			myTeam,
			discipline: disciplineByMatch.get(matchId) ?? 'doubles',
			competitionType: competitionTypeByMatch.get(matchId) ?? 'freizeit',
			partner: partnerRow
				? {
						id: partnerRow.player_id,
						handle: partnerRow.players?.handle ?? '',
						name: nameOf(partnerRow.players),
						claimed: partnerRow.players?.claim_status === 'claimed'
					}
				: null,
			team1: mine.filter((p) => p.team === 1).map(toEntry),
			team2: mine.filter((p) => p.team === 2).map(toEntry),
			sets: (sets ?? [])
				.filter((s) => s.match_id === matchId)
				.sort((a, b) => a.set_number - b.set_number)
				.map((s) => ({ team1Games: s.team1_games, team2Games: s.team2_games }))
		};
	});

	return { entries, mixedMatchCount };
}

/** club_most_improved (siehe 0008_player_profile.sql) ist service_role-only — reines Vergleichs-Ergebnis, keine sensiblen Daten. */
export async function isMostImprovedInClub(
	admin: SupabaseClient,
	clubId: string,
	category: RatingCategory,
	playerId: string,
	sinceDays = 30
): Promise<boolean> {
	const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000).toISOString();
	const { data } = await admin.rpc('club_most_improved', {
		p_club_id: clubId,
		p_category: category,
		p_since: since
	});
	return data === playerId;
}
