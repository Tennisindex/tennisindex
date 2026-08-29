// ============================================================
// TennisIndex — Fiktive Demo-Daten für die lokale Entwicklung
// ============================================================
//
//   npm run seed:demo
//
// Erzeugt supabase/seed.sql: ein Verein (STC Oberland), eine Anlage,
// 16 frei erfundene Spieler:innen und eine chronologische Folge
// simulierter Einzel- und Doppel-Matches der letzten ~10 Wochen — durch
// den ECHTEN Rating-Kern (computeMatchRatings() aus rating-core.ts)
// gerechnet, nicht durch geratene mu/sigma-Werte. Zusätzlich ein kleines
// Turnier (Slug "oberland", Format box_americano_4, 2 Boxen), damit
// /turnier/oberland (siehe Homepage/Footer-Link) nicht ins Leere zeigt.
//
// Alle Namen sind erfunden. Das Skript ersetzt die frühere
// scripts/import-bavaro*.ts-Familie, die echte Klarnamen eines echten
// Vereins verarbeitete (siehe Git-Historie) — für TennisIndex als neues
// Projekt ohne echten Piloten gibt es dafür keine Grundlage mehr.
//
// supabase/seed.sql ist NICHT gitignored (anders als die alten
// seed-*.local.sql): die Supabase-CLI führt eine Datei mit genau diesem
// Namen bei `supabase db reset` automatisch aus — das ist hier
// gewünscht, es sind ja keine echten Personendaten mehr.
//
// Deterministisch: Namensraum + Namen ergeben über mehrere Läufe
// hinweg exakt dieselben UUIDs, ein erneuter Lauf überschreibt seed.sql
// identisch statt neue Zeilen zu erzeugen.

import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { computeMatchRatings, type MatchInput, type PlayerState } from '../src/lib/rating-core';
import { roundPairings, BOX_AMERICANO_4_DEFAULTS } from '../src/lib/league/box-americano';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'supabase/seed.sql');

const NAMESPACE = '6f9619ff-8b86-d011-b42d-00c04fc964ff';

function uuidv5(name: string, namespace = NAMESPACE): string {
	const nsBytes = Buffer.from(namespace.replace(/-/g, ''), 'hex');
	const hash = createHash('sha1')
		.update(Buffer.concat([nsBytes, Buffer.from(name, 'utf8')]))
		.digest();
	const b = Buffer.from(hash.subarray(0, 16));
	b[6] = (b[6] & 0x0f) | 0x50; // Version 5
	b[8] = (b[8] & 0x3f) | 0x80; // Variante RFC 4122
	const h = b.toString('hex');
	return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

const q = (v: string | null | undefined) =>
	v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`;
const n = (v: number | null | undefined) => (v === null || v === undefined ? 'null' : String(v));
const b = (v: boolean) => (v ? 'true' : 'false');

// ---------- Fiktiver Verein + Anlage ----------
const CLUB_ID = uuidv5('club:stc-oberland');
const CLUB_NAME = 'STC Oberland';
const CLUB_SLUG = 'stc-oberland';
const VENUE_ID = uuidv5('venue:stc-oberland');

// ---------- Fiktive Spieler:innen ----------
// trueSkill (0-7, Anzeige-Skala) steuert NUR die Simulation der
// Match-Ergebnisse unten — landet nirgends in der DB. Die tatsächlichen
// Ratings entstehen ausschließlich aus den simulierten Ergebnissen,
// genau wie bei echten Spieler:innen.
const PLAYERS: { name: string; trueSkill: number }[] = [
	{ name: 'Lena Vogel', trueSkill: 5.4 },
	{ name: 'Paul Brandt', trueSkill: 4.8 },
	{ name: 'Sophie Krüger', trueSkill: 3.9 },
	{ name: 'Tim Wolter', trueSkill: 5.6 },
	{ name: 'Mara Schuster', trueSkill: 2.8 },
	{ name: 'Jonas Reiter', trueSkill: 4.1 },
	{ name: 'Nina Falk', trueSkill: 3.4 },
	{ name: 'Leon Achatz', trueSkill: 5.9 },
	{ name: 'Hanna Berger', trueSkill: 2.3 },
	{ name: 'Finn Roth', trueSkill: 4.6 },
	{ name: 'Clara Weiss', trueSkill: 3.1 },
	{ name: 'Elias Sommer', trueSkill: 5.0 },
	{ name: 'Anna Lechner', trueSkill: 2.6 },
	{ name: 'Max Huber', trueSkill: 4.4 },
	{ name: 'Lea Steiner', trueSkill: 3.7 },
	{ name: 'David Winkler', trueSkill: 5.2 }
];

function slugifyHandle(name: string): string {
	return name
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

type Player = { id: string; name: string; handle: string; trueSkill: number };
const players: Player[] = PLAYERS.map((p) => ({
	id: uuidv5(`player:${p.name}`),
	name: p.name,
	handle: slugifyHandle(p.name),
	trueSkill: p.trueSkill
}));

// ---------- Match-Simulation ----------
// Kein Anspruch auf statistische Strenge — realistisch genug aussehende
// Tennis-Ergebnisse, deren RICHTUNG (wer gewinnt) vom Skill-Gefälle
// abhängt. Die tatsächlichen Rating-Änderungen kommen danach immer aus
// computeMatchRatings(), nie aus diesem Skript direkt.
function pWin(strengthA: number, strengthB: number): number {
	return 1 / (1 + Math.exp(-(strengthA - strengthB) * 0.9));
}

function simulateSet(pTeam1: number): { team1Games: number; team2Games: number } {
	const team1Wins = Math.random() < pTeam1;
	const closeness = 1 - Math.abs(pTeam1 - 0.5) * 2; // 1 = sehr eng, 0 = klar
	const roll = Math.random();
	let winnerGames = 6;
	let loserGames: number;
	if (closeness > 0.75 && roll < 0.4) {
		// Tiebreak-Satz
		winnerGames = 7;
		loserGames = 6;
	} else if (closeness > 0.5) {
		loserGames = 4 + Math.floor(Math.random() * 2); // 4-5, evtl. 7:5
		if (loserGames === 6) loserGames = 5;
		if (Math.random() < 0.3) {
			winnerGames = 7;
			loserGames = 5;
		}
	} else if (closeness > 0.25) {
		loserGames = 2 + Math.floor(Math.random() * 2); // 2-3
	} else {
		loserGames = Math.floor(Math.random() * 2); // 0-1
	}
	return team1Wins
		? { team1Games: winnerGames, team2Games: loserGames }
		: { team1Games: loserGames, team2Games: winnerGames };
}

function simulateMatch(strengthTeam1: number, strengthTeam2: number) {
	const p1 = pWin(strengthTeam1, strengthTeam2);
	const sets: { team1Games: number; team2Games: number }[] = [];
	let s1 = 0;
	let s2 = 0;
	while (s1 < 2 && s2 < 2) {
		const set = simulateSet(p1);
		sets.push(set);
		if (set.team1Games > set.team2Games) s1++;
		else s2++;
	}
	return sets;
}

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

// ---------- Rating-Zustand über die ganze Simulation ----------
type Category = 'singles' | 'doubles';
const state = new Map<string, Record<Category, PlayerState>>();
for (const p of players) {
	state.set(p.id, {
		singles: { playerId: p.id, mu: 25.0, sigma: 25.0 / 3.0, matchesPlayed: 0, currentStreak: 0 },
		doubles: { playerId: p.id, mu: 25.0, sigma: 25.0 / 3.0, matchesPlayed: 0, currentStreak: 0 }
	});
}

type SeededMatch = {
	id: string;
	matchType: Category;
	competitionType: 'freizeit' | 'vereinsliga';
	source: 'manual' | 'club_league';
	team1: string[];
	team2: string[];
	sets: { team1Games: number; team2Games: number }[];
	playedAt: Date;
	winnerTeam: 1 | 2;
};

const seededMatches: SeededMatch[] = [];

function playAndRecord(
	team1Ids: string[],
	team2Ids: string[],
	category: Category,
	competitionType: 'freizeit' | 'vereinsliga',
	source: 'manual' | 'club_league',
	playedAt: Date
): SeededMatch {
	const byId = new Map(players.map((p) => [p.id, p]));
	const strength1 = team1Ids.reduce((sum, id) => sum + byId.get(id)!.trueSkill, 0) / team1Ids.length;
	const strength2 = team2Ids.reduce((sum, id) => sum + byId.get(id)!.trueSkill, 0) / team2Ids.length;
	const sets = simulateMatch(strength1, strength2);
	const t1Sets = sets.filter((s) => s.team1Games > s.team2Games).length;
	const winnerTeam: 1 | 2 = t1Sets > sets.length / 2 ? 1 : 2;

	const input: MatchInput = {
		team1: team1Ids.map((id) => state.get(id)![category]),
		team2: team2Ids.map((id) => state.get(id)![category]),
		sets
	};
	const results = computeMatchRatings(input);
	for (const r of results) {
		const s = state.get(r.playerId)![category];
		s.mu = r.muAfter;
		s.sigma = r.sigmaAfter;
		s.matchesPlayed += 1;
		const won = r.factors.won;
		s.currentStreak = won ? Math.max(s.currentStreak, 0) + 1 : Math.min(s.currentStreak, 0) - 1;
	}

	const match: SeededMatch = {
		id: uuidv5(`match:${category}:${playedAt.toISOString()}:${team1Ids.join(',')}:${team2Ids.join(',')}`),
		matchType: category,
		competitionType,
		source,
		team1: team1Ids,
		team2: team2Ids,
		sets,
		playedAt,
		winnerTeam
	};
	seededMatches.push(match);
	return match;
}

// ---------- Zeitplan: 10 Wochen freies Spiel ----------
const WEEKS = 10;
const now = new Date();
const start = new Date(now.getTime() - WEEKS * 7 * 24 * 60 * 60 * 1000);

for (let week = 0; week < WEEKS; week++) {
	const matchesThisWeek = 5 + Math.floor(Math.random() * 3); // 5-7
	for (let i = 0; i < matchesThisWeek; i++) {
		const playedAt = new Date(
			start.getTime() + (week * 7 + Math.floor(Math.random() * 7)) * 24 * 60 * 60 * 1000
		);
		const pool = shuffle(players.map((p) => p.id));
		const isDoubles = Math.random() < 0.55;
		if (isDoubles && pool.length >= 4) {
			playAndRecord(
				[pool[0], pool[1]],
				[pool[2], pool[3]],
				'doubles',
				'freizeit',
				'manual',
				playedAt
			);
		} else {
			playAndRecord([pool[0]], [pool[1]], 'singles', 'freizeit', 'manual', playedAt);
		}
	}
}

// ---------- Turnier: /turnier/oberland, Format box_americano_4, 2 Boxen ----------
const LEAGUE_ID = uuidv5('league:oberland');
const SEASON_ID = uuidv5('league_season:oberland:1');
const CYCLE_ID = uuidv5('league_cycle:oberland:1');
const BOX_A_ID = uuidv5('league_box:oberland:1:1');
const BOX_B_ID = uuidv5('league_box:oberland:1:2');

const leagueRoster = shuffle(players.map((p) => p.id));
const boxAPlayers = leagueRoster.slice(0, 4);
const boxBPlayers = leagueRoster.slice(4, 8);

const cycleStart = new Date(now.getTime() - 3 * 7 * 24 * 60 * 60 * 1000);
const cycleEnd = new Date(now.getTime() + 3 * 7 * 24 * 60 * 60 * 1000);

type BoxMatchRow = {
	id: string;
	boxId: string;
	roundNumber: number;
	matchId: string | null;
	status: 'played' | 'scheduled';
};
const boxMatchRows: BoxMatchRow[] = [];

function seedBox(boxId: string, boxPlayers: string[], ladderPosition: number) {
	const pairings = roundPairings(BOX_AMERICANO_4_DEFAULTS.boxSize);
	pairings.forEach((pairing, idx) => {
		const roundNumber = pairing.roundNumber;
		// Nur die erste Runde ist schon gespielt — realistischer Zwischenstand
		// eines laufenden Zyklus statt einer komplett fertigen Box.
		const played = idx === 0;
		if (played) {
			const seatToPlayer = (seat: number) => boxPlayers[seat - 1];
			const team1 = pairing.team1.map(seatToPlayer);
			const team2 = pairing.team2.map(seatToPlayer);
			const playedAt = new Date(cycleStart.getTime() + 4 * 24 * 60 * 60 * 1000);
			const match = playAndRecord(team1, team2, 'doubles', 'vereinsliga', 'club_league', playedAt);
			boxMatchRows.push({
				id: uuidv5(`league_box_match:${boxId}:${roundNumber}`),
				boxId,
				roundNumber,
				matchId: match.id,
				status: 'played'
			});
		} else {
			boxMatchRows.push({
				id: uuidv5(`league_box_match:${boxId}:${roundNumber}`),
				boxId,
				roundNumber,
				matchId: null,
				status: 'scheduled'
			});
		}
	});
}

seedBox(BOX_A_ID, boxAPlayers, 1);
seedBox(BOX_B_ID, boxBPlayers, 2);

// ---------- SQL erzeugen ----------
const L: string[] = [];
L.push('-- ERZEUGT von scripts/seed-demo.ts — nicht von Hand bearbeiten.');
L.push('-- Frei erfundene Demo-Daten (Club, Spieler:innen, Matches, Turnier) für die');
L.push('-- lokale Entwicklung. Läuft automatisch bei `supabase db reset`.');
L.push('');
L.push('begin;');
L.push('');

L.push('-- ---------- Verein + Anlage ----------');
L.push(
	`insert into clubs (id, name, slug, license_tier, accent) values (${q(CLUB_ID)}, ${q(CLUB_NAME)}, ${q(CLUB_SLUG)}, 'pro', '#4C7A1F') on conflict (id) do nothing;`
);
L.push(
	`insert into tennis_venues (id, name, city, postal_code, club_id, source) values (${q(VENUE_ID)}, ${q(CLUB_NAME)}, 'Wolfratshausen', '82515', ${q(CLUB_ID)}, 'manual') on conflict (id) do nothing;`
);
L.push('');

L.push('-- ---------- Spieler:innen ----------');
for (const p of players) {
	L.push(
		`insert into players (id, display_name, handle, profile_public, claim_status, origin) values (${q(p.id)}, ${q(p.name)}, ${q(p.handle)}, true, 'unclaimed', 'admin_import') on conflict (id) do nothing;`
	);
	L.push(
		`insert into player_ratings (player_id, category) values (${q(p.id)}, 'singles'), (${q(p.id)}, 'doubles') on conflict (player_id, category) do nothing;`
	);
}
L.push('');

L.push('-- ---------- Mitgliedschaften (erste Person als Vereins-Admin) ----------');
players.forEach((p, i) => {
	const role = i === 0 ? 'admin' : 'member';
	L.push(
		`insert into club_memberships (club_id, player_id, role) values (${q(CLUB_ID)}, ${q(p.id)}, ${q(role)}) on conflict (club_id, player_id) do nothing;`
	);
});
L.push('');

L.push('-- ---------- Matches, Teilnehmer, Sätze ----------');
for (const m of seededMatches) {
	L.push(
		`insert into matches (id, club_id, match_type, competition_type, status, rating_applied, source, format, played_at, confirm_deadline, confirmed_at) values (${q(m.id)}, ${q(CLUB_ID)}, ${q(m.matchType)}, ${q(m.competitionType)}, 'confirmed', true, ${q(m.source)}, 'best_of_3', ${q(m.playedAt.toISOString())}, ${q(m.playedAt.toISOString())}, ${q(m.playedAt.toISOString())}) on conflict (id) do nothing;`
	);
	m.team1.forEach((playerId) => {
		L.push(
			`insert into match_participants (match_id, player_id, team, confirmed) values (${q(m.id)}, ${q(playerId)}, 1, true) on conflict (match_id, player_id) do nothing;`
		);
	});
	m.team2.forEach((playerId) => {
		L.push(
			`insert into match_participants (match_id, player_id, team, confirmed) values (${q(m.id)}, ${q(playerId)}, 2, true) on conflict (match_id, player_id) do nothing;`
		);
	});
	m.sets.forEach((s, idx) => {
		L.push(
			`insert into match_sets (match_id, set_number, team1_games, team2_games) values (${q(m.id)}, ${n(idx + 1)}, ${n(s.team1Games)}, ${n(s.team2Games)}) on conflict (match_id, set_number) do nothing;`
		);
	});
}
L.push('');

L.push('-- ---------- Finaler Rating-Stand ----------');
for (const p of players) {
	for (const category of ['singles', 'doubles'] as const) {
		const s = state.get(p.id)![category];
		const lastMatchAt = seededMatches
			.filter((m) => m.matchType === category && (m.team1.includes(p.id) || m.team2.includes(p.id)))
			.sort((a, b2) => b2.playedAt.getTime() - a.playedAt.getTime())[0]?.playedAt;
		L.push(
			`update player_ratings set mu = ${n(s.mu)}, sigma = ${n(s.sigma)}, matches_played = ${n(s.matchesPlayed)}, is_provisional = ${b(s.matchesPlayed < 12)}, last_match_at = ${lastMatchAt ? q(lastMatchAt.toISOString()) : 'null'} where player_id = ${q(p.id)} and category = ${q(category)};`
		);
	}
}
L.push('');

L.push('-- ---------- Turnier: /turnier/oberland (box_americano_4, 2 Boxen) ----------');
L.push(
	`insert into leagues (id, club_id, name, slug, format, config, status) values (${q(LEAGUE_ID)}, ${q(CLUB_ID)}, 'Turnier STC Oberland', 'oberland', 'box_americano_4', '{"box_size":4,"rounds":3,"points_per_win":1,"promote":1,"relegate":1,"relegate_top_box":2,"promote_bottom_box":2,"tiebreakers":["match_points","set_diff","game_diff"],"self_service_weeks":3}'::jsonb, 'active') on conflict (id) do nothing;`
);
L.push(
	`insert into league_seasons (id, league_id, name, starts_on, ends_on, status) values (${q(SEASON_ID)}, ${q(LEAGUE_ID)}, 'Saison 1', ${q(cycleStart.toISOString().slice(0, 10))}, ${q(cycleEnd.toISOString().slice(0, 10))}, 'running') on conflict (id) do nothing;`
);
L.push(
	`insert into league_cycles (id, season_id, ordinal, name, start_date, end_date, status) values (${q(CYCLE_ID)}, ${q(SEASON_ID)}, 1, 'Zyklus 1', ${q(cycleStart.toISOString().slice(0, 10))}, ${q(cycleEnd.toISOString().slice(0, 10))}, 'running') on conflict (id) do nothing;`
);
L.push(
	`insert into league_boxes (id, cycle_id, ladder_position, label) values (${q(BOX_A_ID)}, ${q(CYCLE_ID)}, 1, 'Box 1') on conflict (id) do nothing;`
);
L.push(
	`insert into league_boxes (id, cycle_id, ladder_position, label) values (${q(BOX_B_ID)}, ${q(CYCLE_ID)}, 2, 'Box 2') on conflict (id) do nothing;`
);
[
	[BOX_A_ID, boxAPlayers],
	[BOX_B_ID, boxBPlayers]
].forEach(([boxId, boxPlayers]) => {
	(boxPlayers as string[]).forEach((playerId, i) => {
		L.push(
			`insert into league_box_members (box_id, player_id, seat) values (${q(boxId as string)}, ${q(playerId)}, ${n(i + 1)}) on conflict (box_id, player_id) do nothing;`
		);
	});
	L.push(
		`insert into league_registrations (league_id, player_id, status) select ${q(LEAGUE_ID)}, player_id, 'active' from league_box_members where box_id = ${q(boxId as string)} on conflict (league_id, player_id) do nothing;`
	);
});
for (const row of boxMatchRows) {
	L.push(
		`insert into league_box_matches (id, box_id, round_number, match_id, status) values (${q(row.id)}, ${q(row.boxId)}, ${n(row.roundNumber)}, ${row.matchId ? q(row.matchId) : 'null'}, ${q(row.status)}) on conflict (id) do nothing;`
	);
}
L.push('');
L.push('commit;');
L.push('');

writeFileSync(OUT, L.join('\n'), 'utf8');

console.log(`Geschrieben: ${OUT}`);
console.log(
	`${players.length} Spieler:innen, ${seededMatches.length} Matches (${seededMatches.filter((m) => m.matchType === 'singles').length} Einzel, ${seededMatches.filter((m) => m.matchType === 'doubles').length} Doppel), 1 Verein, 1 Turnier mit 2 Boxen.`
);
