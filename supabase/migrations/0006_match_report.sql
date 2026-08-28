-- ============================================================
-- TennisIndex — Match melden (atomar, Einzel ODER Doppel)
-- ============================================================
-- Gleiches Muster wie apply_match_rating() in 0002: mehrere INSERTs über
-- den Supabase-JS-Client sind nicht transaktional. Ohne Transaktion
-- riskiert ein Teilfehler ein Match ohne Teilnehmer/Sätze. Ablauf: eine
-- SQL-Funktion, ein einziger rpc()-Call.
--
-- Validierung doppelt (TS + hier): validateMatchReport() in match-report.ts
-- prüft zuerst für gute Fehlermeldungen im UI, diese Funktion erzwingt die
-- Kerninvarianten nochmal auf DB-Ebene.
--
-- EINZEL VS. DOPPEL — die zentrale Verzweigung dieser Migration:
--   p_match_type = 'singles' -> nur p_reporter_id + p_opponent1_id, Team 1
--     und Team 2 haben je einen Spieler.
--   p_match_type = 'doubles' -> zusätzlich p_partner_id + p_opponent2_id
--     Pflicht, Team 1 und Team 2 haben je zwei Spieler — exakt das
--     PadelIndex-Verhalten (dort war Doppel die einzige Möglichkeit).
-- Der Melder gilt in beiden Fällen als sofort bestätigt (er bürgt fürs
-- Ergebnis); die Gegenseite bestätigt separat (siehe rating/confirm.ts —
-- bei Doppel genügt EIN Spieler des Gegnerteams, bei Einzel ist es ohnehin
-- nur einer).
--
-- p_competition_type ist die reine Wettbewerbs-Kategorie (Freizeit/Turnier/
-- Vereinsliga/...) — unabhängig von match_type, siehe matches.competition_type
-- in 0001_schema.sql.
--
-- Dubletten-Schutz (identische Spieler, gleicher Verein, gleicher
-- Kalendertag) ist von Anfang an eingebaut, nicht erst nachträglich wie bei
-- PadelIndex (dortige Historie: 0006 -> 0011 -> 0024) — pg_advisory_xact_lock
-- serialisiert konkurrierende Aufrufe mit demselben Schlüssel, damit der
-- anschließende exists-Check nicht von zwei gleichzeitigen Transaktionen
-- beide mit "existiert nicht" beantwortet werden kann.

create or replace function create_match_report(
  p_club_id          uuid,
  p_match_type       text,
  p_reporter_id      uuid,
  p_partner_id       uuid,
  p_opponent1_id     uuid,
  p_opponent2_id     uuid,
  p_played_at        timestamptz,
  p_sets             jsonb, -- [{"team1_games": int, "team2_games": int}, ...]
  p_competition_type text default 'freizeit'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_match_id      uuid;
  v_players       uuid[];
  v_sorted        uuid[];
  v_member_count  int;
  v_set_count     int;
  s               jsonb;
  i               int := 0;
begin
  if p_match_type not in ('singles', 'doubles') then
    raise exception 'Ungültige Spielart.';
  end if;

  if p_competition_type not in ('verband', 'turnier', 'vereinsliga', 'tennisindex_challenge', 'freizeit') then
    raise exception 'Ungültiger Wettbewerbs-Typ.';
  end if;

  if p_reporter_id is null or p_opponent1_id is null then
    raise exception 'Melder und Gegner müssen angegeben sein.';
  end if;

  if p_match_type = 'singles' then
    if p_partner_id is not null or p_opponent2_id is not null then
      raise exception 'Einzel hat keinen Partner und keinen zweiten Gegner.';
    end if;
    if p_reporter_id = p_opponent1_id then
      raise exception 'Melder und Gegner müssen unterschiedlich sein.';
    end if;
    v_players := array[p_reporter_id, p_opponent1_id];
  else
    if p_partner_id is null or p_opponent2_id is null then
      raise exception 'Doppel braucht einen Partner und zwei Gegner.';
    end if;
    if p_reporter_id = p_partner_id or p_reporter_id = p_opponent1_id or p_reporter_id = p_opponent2_id
       or p_partner_id = p_opponent1_id or p_partner_id = p_opponent2_id
       or p_opponent1_id = p_opponent2_id then
      raise exception 'Alle vier Spieler müssen unterschiedlich sein.';
    end if;
    v_players := array[p_reporter_id, p_partner_id, p_opponent1_id, p_opponent2_id];
  end if;

  select count(*) into v_member_count
  from club_memberships
  where club_id = p_club_id
    and player_id = any(v_players);

  if v_member_count <> array_length(v_players, 1) then
    raise exception 'Alle Spieler müssen Mitglied dieses Vereins sein.';
  end if;

  select count(*) into v_set_count from jsonb_array_elements(p_sets);
  if v_set_count < 1 or v_set_count > 5 then
    raise exception 'Zwischen einem und fünf Sätzen angeben.';
  end if;

  v_sorted := (select array_agg(x order by x) from unnest(v_players) x);

  perform pg_advisory_xact_lock(
    hashtextextended(
      p_club_id::text || ':' || date_trunc('day', p_played_at)::text || ':' || array_to_string(v_sorted, ','),
      0
    )
  );

  if exists (
    select 1
    from (
      select mp.match_id, array_agg(mp.player_id order by mp.player_id) as players
      from match_participants mp
      join matches m on m.id = mp.match_id
      where m.club_id = p_club_id
        and m.match_type = p_match_type
        and date_trunc('day', m.played_at) = date_trunc('day', p_played_at)
      group by mp.match_id
    ) existing
    where existing.players = v_sorted
  ) then
    raise exception 'Dieses Match wurde für diese Spieler an diesem Tag bereits gemeldet.';
  end if;

  insert into matches (club_id, match_type, competition_type, source, format, played_at, reported_by)
  values (p_club_id, p_match_type, p_competition_type, 'manual', 'best_of_3', p_played_at, p_reporter_id)
  returning id into v_match_id;

  if p_match_type = 'singles' then
    insert into match_participants (match_id, player_id, team, confirmed) values
      (v_match_id, p_reporter_id,  1, true),
      (v_match_id, p_opponent1_id, 2, false);
  else
    insert into match_participants (match_id, player_id, team, confirmed) values
      (v_match_id, p_reporter_id,  1, true),
      (v_match_id, p_partner_id,   1, false),
      (v_match_id, p_opponent1_id, 2, false),
      (v_match_id, p_opponent2_id, 2, false);
  end if;

  for s in select * from jsonb_array_elements(p_sets)
  loop
    i := i + 1;
    insert into match_sets (match_id, set_number, team1_games, team2_games)
    values (v_match_id, i, (s->>'team1_games')::smallint, (s->>'team2_games')::smallint);
  end loop;

  return v_match_id;
end;
$$;

revoke all on function create_match_report(uuid, text, uuid, uuid, uuid, uuid, timestamptz, jsonb, text)
  from public, anon, authenticated;
grant execute on function create_match_report(uuid, text, uuid, uuid, uuid, uuid, timestamptz, jsonb, text)
  to service_role;
