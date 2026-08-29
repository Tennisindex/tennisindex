// ============================================================
// TennisIndex — Bindeglied: Match bestätigt -> Rating angewandt
// ============================================================
// Wird an zwei Stellen gebraucht:
//   1. Gegner bestätigt manuell  -> SvelteKit Server-Route
//   2. 48h-Frist läuft ab        -> Cloudflare Cron Trigger
// Beide rufen dieselbe Funktion applyRatingForMatch().

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  computeMatchRatings,
  computeTokenGrants,
  type PlayerState,
  type SetScore
} from '$lib/server/rating/rating';
import { completeChallengesForMatch } from '$lib/server/challenges';

// WICHTIG: service_role key nur serverseitig. Niemals im Client-Bundle!
export function adminClient(url: string, serviceRoleKey: string): SupabaseClient {
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

// ------------------------------------------------------------
// Kern: Rating für ein bestätigtes Match berechnen und anwenden
// ------------------------------------------------------------
export async function applyRatingForMatch(sb: SupabaseClient, matchId: string) {
  // 1. Match + Teilnehmer + Sätze laden. match_type ist hier die
  // Spielart (singles/doubles) UND zugleich die Kategorie in
  // player_ratings — beides ist bewusst dieselbe Spalte, siehe
  // supabase/migrations/0001_schema.sql.
  const { data: match, error: mErr } = await sb
    .from('matches')
    .select(
      `
      id, status, rating_applied, source, played_at, format, match_type,
      match_participants ( player_id, team ),
      match_sets ( set_number, team1_games, team2_games )
    `
    )
    .eq('id', matchId)
    .single();

  if (mErr) throw mErr;
  if (match.status !== 'confirmed') return { skipped: 'not_confirmed' };
  if (match.rating_applied) return { skipped: 'already_applied' };

  const category = match.match_type as 'singles' | 'doubles';
  const participants = match.match_participants as { player_id: string; team: 1 | 2 }[];
  const playerIds = participants.map((p) => p.player_id);

  // 2. Aktuelles mu/sigma je Spieler UND Kategorie laden — nicht von
  // players (das führt seit der Singles/Doubles-Erweiterung kein eigenes
  // Rating mehr), sondern von player_ratings, gefiltert auf genau die
  // Kategorie dieses Matches. Ein Doppel-Match darf ein Einzel-Rating
  // niemals lesen oder verändern, und umgekehrt.
  const { data: ratings, error: prErr } = await sb
    .from('player_ratings')
    .select('player_id, mu, sigma, matches_played')
    .eq('category', category)
    .in('player_id', playerIds);
  if (prErr) throw prErr;

  const ratingByPlayer = new Map((ratings ?? []).map((r) => [r.player_id, r]));

  // 3. Streaks holen (eine RPC pro Spieler — bei bis zu 4 Spielern
  // unkritisch), ebenfalls je Kategorie: eine Einzel-Siegesserie darf den
  // Doppel-Streak-Faktor nicht beeinflussen.
  const streaks = new Map<string, number>();
  await Promise.all(
    playerIds.map(async (playerId) => {
      const { data } = await sb.rpc('player_current_streak', {
        p_player_id: playerId,
        p_category: category
      });
      streaks.set(playerId, data ?? 0);
    })
  );

  // 4. In den reinen Rating-Input übersetzen. team1/team2 haben bei Einzel
  // je einen Eintrag, bei Doppel je zwei — computeMatchRatings() (siehe
  // $lib/rating-core.ts) rechnet beides mit derselben Formel, siehe den
  // Kommentar dort zur Team-Größen-Agnostik von OpenSkill.
  const toState = (p: { player_id: string; team: 1 | 2 }): PlayerState => {
    const r = ratingByPlayer.get(p.player_id);
    if (!r) throw new Error(`Match ${matchId}: kein ${category}-Rating für Spieler ${p.player_id}`);
    return {
      playerId: p.player_id,
      mu: Number(r.mu),
      sigma: Number(r.sigma),
      matchesPlayed: r.matches_played,
      currentStreak: streaks.get(p.player_id) ?? 0
    };
  };

  const team1 = participants.filter((p) => p.team === 1).map(toState);
  const team2 = participants.filter((p) => p.team === 2).map(toState);

  if (team1.length === 0 || team2.length === 0) {
    throw new Error(`Match ${matchId}: unvollständige Teams`);
  }

  const sets: SetScore[] = (match.match_sets as any[])
    .sort((a, b) => a.set_number - b.set_number)
    .map((s) => ({ team1Games: s.team1_games, team2Games: s.team2_games }));

  if (sets.length === 0) throw new Error(`Match ${matchId}: keine Sätze erfasst`);

  // 4. Berechnen (reine Funktion, keine Seiteneffekte)
  const results = computeMatchRatings({ team1, team2, sets });
  const grants = computeTokenGrants(
    results,
    [...team1, ...team2],
    match.source as 'manual' | 'club_league' | 'tournament' | 'import'
  );

  // 5. Atomar anwenden — ein einziger Call, Transaktion in Postgres
  const { error: rpcErr } = await sb.rpc('apply_match_rating', {
    p_match_id: matchId,
    p_results: results,
    p_grants: grants
  });
  if (rpcErr) throw rpcErr;

  // 6. Falls dieses Match als Ergebnis einer Challenge gemeldet wurde:
  // Challenge jetzt abschließen — erst hier ist das Ergebnis bestätigt und
  // gewertet. Damit gibt sie ihren Challenge-Platz wieder frei (siehe
  // getOpenChallengesForMatch in challenges.ts). Best-effort: ein Fehler
  // darf das bereits angewandte Rating nicht nachträglich kippen.
  const completedChallenges = await completeChallengesForMatch(sb, matchId);

  return { applied: true, results, grants, completedChallenges };
}

// ------------------------------------------------------------
// Variante 1: Gegner bestätigt manuell
// src/routes/api/matches/[id]/confirm/+server.ts
// ------------------------------------------------------------
export async function confirmMatchByPlayer(
  sb: SupabaseClient,
  matchId: string,
  playerId: string
) {
  // Bestätigung des aufrufenden Spielers vermerken
  const { error } = await sb
    .from('match_participants')
    .update({ confirmed: true })
    .eq('match_id', matchId)
    .eq('player_id', playerId);
  if (error) throw error;

  // Prüfen: hat mindestens ein Spieler des GEGNERteams bestätigt?
  const { data: parts } = await sb
    .from('match_participants')
    .select('player_id, team, confirmed')
    .eq('match_id', matchId);

  const { data: match } = await sb
    .from('matches')
    .select('reported_by, status')
    .eq('id', matchId)
    .single();

  if (!parts || !match || match.status !== 'pending') return { confirmed: false };

  const reporterTeam = parts.find((p) => p.player_id === match.reported_by)?.team;
  const opponentConfirmed = parts.some((p) => p.team !== reporterTeam && p.confirmed);

  if (!opponentConfirmed) return { confirmed: false };

  await sb
    .from('matches')
    .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
    .eq('id', matchId);

  await applyRatingForMatch(sb, matchId);
  return { confirmed: true };
}

// ------------------------------------------------------------
// Variante 2: Cloudflare Cron Trigger (48h-Frist)
// wrangler.toml:  [triggers]  crons = ["*/15 * * * *"]
// ------------------------------------------------------------
export async function runConfirmCron(env: {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}) {
  const sb = adminClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: dueIds, error } = await sb.rpc('auto_confirm_due_matches');
  if (error) throw error;

  const outcomes: Record<string, string> = {};
  for (const id of (dueIds as string[]) ?? []) {
    try {
      await applyRatingForMatch(sb, id);
      outcomes[id] = 'ok';
    } catch (e) {
      // Einzelfehler darf den Rest des Batches nicht blockieren;
      // rating_applied=false lässt den nächsten Lauf erneut versuchen.
      outcomes[id] = `error: ${(e as Error).message}`;
    }
  }
  return outcomes;
}
