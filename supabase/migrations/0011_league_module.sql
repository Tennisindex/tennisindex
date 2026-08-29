-- ============================================================
-- TennisIndex — Liga-Modul (formatunabhängiges Grundgerüst)
-- ============================================================
-- Zwei Formate von Anfang an: 'box_americano_4' (4er-Boxen mit rotierenden
-- Doppel-Partnern über 3 Runden, Auf-/Abstieg zwischen benachbarten Boxen —
-- identisches Regelwerk wie bei PadelIndex, dort für Doppel-Padel) und
-- 'singles_ladder' (Einzel: eine Gruppe von 4-8 Spielern spielt eine
-- vollständige Round-Robin-Runde gegeneinander, kein Partner-Konzept, keine
-- Sitz-Rotation nötig). Beide teilen sich dieselbe Liga-/Saison-/Zyklus-/
-- Box-Struktur — das Unterscheidungsmerkmal ist leagues.format, nicht ein
-- Tabellenpräfix (Struktur 1:1 von PadelIndex übernommen, die genau dafür
-- entworfen wurde). Die konkrete Paarungslogik je Runde lebt in TypeScript
-- (src/lib/league/box-americano.ts für Doppel, src/lib/league/
-- singles-ladder.ts für Einzel) — SQL bekommt sie fertig übergeben und
-- prüft nur noch auf Plausibilität.
--
-- WAS DIESE MIGRATION NICHT TUT (wie bei PadelIndex):
--   * Sie fasst das Rating-Modell nicht an. Ein Liga-Match ist eine ganz
--     normale Zeile in matches (source='club_league',
--     competition_type='vereinsliga', match_type = Einzel oder Doppel je
--     nach Liga-Format); league_box_matches.match_id zeigt nur darauf. Das
--     Index-Rating läuft damit über dieselbe apply_match_rating()-RPC wie
--     jedes andere Match.
--   * Sie legt keine Playoff-/K.o.-Tabellen an.
--   * Sie speichert keine Tabellenstände — die werden aus den Matches
--     berechnet (siehe box-americano.ts / singles-ladder.ts).

-- ------------------------------------------------------------
-- 0. Format -> Spielart/Teamgröße
-- ------------------------------------------------------------
-- Eine einzige Stelle, an der "welches Format bedeutet welche Spielart"
-- steht — von der View und beiden Report-RPCs gleichermaßen genutzt, damit
-- ein drittes Format später nur hier ergänzt werden muss.
create or replace function league_format_category(p_format text)
returns text
language sql
immutable
as $$
  select case p_format
    when 'box_americano_4' then 'doubles'
    when 'singles_ladder'  then 'singles'
  end
$$;

create or replace function league_format_team_size(p_format text)
returns smallint
language sql
immutable
as $$
  select case p_format
    when 'box_americano_4' then 2::smallint
    when 'singles_ladder'  then 1::smallint
  end
$$;

-- ------------------------------------------------------------
-- 1. Liga
-- ------------------------------------------------------------
-- config trägt alle formatspezifischen Stellschrauben, damit ein weiteres
-- Format keine Schemaänderung braucht. Für box_americano_4 z.B.:
--   {"box_size": 4, "rounds": 3, "points_per_win": 1, "promote": 1,
--    "relegate": 1, "relegate_top_box": 2, "promote_bottom_box": 2,
--    "tiebreakers": ["match_points","set_diff","game_diff"]}
-- Für singles_ladder z.B.:
--   {"box_size": 6, "rounds": 5, "points_per_win": 1, "promote": 1,
--    "relegate": 1, "tiebreakers": ["match_points","set_diff","game_diff"]}
create table leagues (
  id          uuid primary key default gen_random_uuid(),
  club_id     uuid references clubs(id) on delete cascade,
  name        text not null,
  slug        text not null unique,
  format      text not null check (format in ('box_americano_4', 'singles_ladder')),
  config      jsonb not null default '{}'::jsonb,
  status      text not null default 'active'
                check (status in ('draft', 'active', 'archived')),
  created_at  timestamptz not null default now(),
  constraint leagues_config_is_object check (jsonb_typeof(config) = 'object')
);

create index leagues_club_idx on leagues (club_id) where status = 'active';

-- ------------------------------------------------------------
-- 2. Saison und Zyklus
-- ------------------------------------------------------------
create table league_seasons (
  id          uuid primary key default gen_random_uuid(),
  league_id   uuid not null references leagues(id) on delete cascade,
  name        text not null,
  starts_on   date,
  ends_on     date,
  status      text not null default 'planned'
                check (status in ('planned', 'running', 'completed')),
  created_at  timestamptz not null default now(),
  unique (league_id, name)
);

create table league_cycles (
  id          uuid primary key default gen_random_uuid(),
  season_id   uuid not null references league_seasons(id) on delete cascade,
  ordinal     int not null check (ordinal >= 1),
  name        text,
  start_date  date not null,
  end_date    date not null,
  status      text not null default 'planned'
                check (status in ('planned', 'running', 'completed')),
  created_at  timestamptz not null default now(),
  unique (season_id, ordinal),
  constraint league_cycles_dates check (end_date >= start_date)
);

-- ------------------------------------------------------------
-- 3. Boxen
-- ------------------------------------------------------------
create table league_boxes (
  id              uuid primary key default gen_random_uuid(),
  cycle_id        uuid not null references league_cycles(id) on delete cascade,
  ladder_position int not null check (ladder_position >= 1),
  label           text,
  scheduled_at    timestamptz,
  court           text,
  created_at      timestamptz not null default now(),
  unique (cycle_id, ladder_position)
);

-- seat bestimmt bei box_americano_4 die Partner-Rotation (Sitz 1-4 ->
-- Runde 1: 1+2 vs 3+4 usw.); bei singles_ladder ist es nur eine stabile
-- Sitznummer für den Round-Robin-Plan, ohne Rotationsbedeutung. Bis 8
-- erlaubt, damit größere Ladder-Gruppen dieselbe Tabelle nutzen können.
create table league_box_members (
  box_id              uuid not null references league_boxes(id) on delete cascade,
  player_id           uuid not null references players(id) on delete cascade,
  seat                smallint not null check (seat between 1 and 8),
  role                text not null default 'regular'
                        check (role in ('regular', 'substitute')),
  replaces_player_id  uuid references players(id) on delete set null,
  created_at          timestamptz not null default now(),
  primary key (box_id, player_id),
  -- deferrable: swap_league_box_seats() (0016) tauscht zwei Sitze in einer
  -- Transaktion, was den Unique-Constraint beim ersten der beiden UPDATEs
  -- sonst kurzzeitig verletzen würde.
  unique (box_id, seat) deferrable initially immediate
);

create index league_box_members_player_idx on league_box_members (player_id);

-- ------------------------------------------------------------
-- 4. Partien einer Box
-- ------------------------------------------------------------
-- match_id ist die Brücke zum allgemeinen Index-Rating: die Ergebnisse
-- selbst (Sätze, Teams) stehen in match_sets/match_participants, nicht
-- hier. status trägt die real vorkommenden Fälle: nicht gespielt, kampflos,
-- abgebrochen. winner_team ist normalerweise null (= aus den Sätzen
-- abgeleitet), gesetzt nur ohne ableitbaren Sieger.
create table league_box_matches (
  id                        uuid primary key default gen_random_uuid(),
  box_id                    uuid not null references league_boxes(id) on delete cascade,
  round_number              smallint not null check (round_number >= 1),
  match_id                  uuid unique references matches(id) on delete set null,
  status                    text not null default 'scheduled'
                              check (status in ('scheduled', 'played', 'abandoned', 'walkover', 'cancelled')),
  winner_team               smallint check (winner_team in (1, 2)),
  note                      text,
  -- Termin-/Platzverwaltung je Runde (6-Wochen-Modell: erste Wochen
  -- Spieler-Selbstorganisation, danach Admin-Vergabe).
  scheduled_at              timestamptz,
  court                     text,
  match_assigned_by_admin   boolean not null default false,
  scheduled_by              uuid references players(id) on delete set null,
  is_replacement            boolean not null default false,
  previous_scheduled_at     timestamptz,
  previous_court            text,
  created_at                timestamptz not null default now(),
  unique (box_id, round_number),
  constraint league_box_matches_played_needs_match
    check (status <> 'played' or match_id is not null),
  constraint league_box_matches_walkover_needs_winner
    check (status <> 'walkover' or winner_team is not null)
);

create index league_box_matches_box_idx on league_box_matches (box_id, round_number);

-- ------------------------------------------------------------
-- 5. Anmeldung, Warteliste, Austritt
-- ------------------------------------------------------------
create table league_registrations (
  id          uuid primary key default gen_random_uuid(),
  league_id   uuid not null references leagues(id) on delete cascade,
  player_id   uuid not null references players(id) on delete cascade,
  status      text not null default 'waitlist'
                check (status in ('active', 'waitlist', 'substitute', 'left')),
  joined_at   timestamptz not null default now(),
  left_at     timestamptz,
  note        text,
  unique (league_id, player_id)
);

create index league_registrations_status_idx on league_registrations (league_id, status);

-- ------------------------------------------------------------
-- 6. Auf-/Abstieg als Vorschlag
-- ------------------------------------------------------------
create table league_promotions (
  id                  uuid primary key default gen_random_uuid(),
  cycle_id            uuid not null references league_cycles(id) on delete cascade,
  player_id           uuid not null references players(id) on delete cascade,
  from_box_id         uuid references league_boxes(id) on delete set null,
  from_rank           smallint,
  to_ladder_position  int check (to_ladder_position >= 1),
  direction           text not null check (direction in ('up', 'down', 'stay')),
  status              text not null default 'proposed'
                        check (status in ('proposed', 'applied', 'rejected')),
  decided_by          uuid references players(id) on delete set null,
  decided_at          timestamptz,
  created_at          timestamptz not null default now(),
  unique (cycle_id, player_id)
);

create index league_promotions_cycle_idx on league_promotions (cycle_id, status);

-- ------------------------------------------------------------
-- 7. RLS
-- ------------------------------------------------------------
alter table leagues              enable row level security;
alter table league_seasons       enable row level security;
alter table league_cycles        enable row level security;
alter table league_boxes         enable row level security;
alter table league_box_matches   enable row level security;
alter table league_box_members   enable row level security;
alter table league_registrations enable row level security;
alter table league_promotions    enable row level security;

create policy leagues_public_read on leagues
  for select using (status <> 'draft');

create policy league_seasons_public_read on league_seasons for select using (true);
create policy league_cycles_public_read on league_cycles for select using (true);
create policy league_boxes_public_read on league_boxes for select using (true);
create policy league_box_matches_public_read on league_box_matches for select using (true);

grant select on table leagues, league_seasons, league_cycles,
                      league_boxes, league_box_matches
  to anon, authenticated;

-- league_box_members, league_registrations, league_promotions bekommen
-- bewusst KEINE Policy: sie verknüpfen Personen mit Spielstärke und sind
-- nur über die anonymisierte View unten bzw. über service_role erreichbar.

-- ------------------------------------------------------------
-- 8. Öffentliche Aufstellung einer Box (anonymisiert)
-- ------------------------------------------------------------
create or replace view league_box_lineup
with (security_invoker = false) as
select
  bm.box_id,
  b.cycle_id,
  b.ladder_position,
  bm.seat,
  bm.role,
  p.id as player_id,
  case when p.profile_public then p.handle end as handle,
  case
    when p.profile_public
      then public_display_name(p.display_name, p.claim_status, p.show_full_name)
    else 'Nicht gelistet'
  end as name,
  (p.profile_public and p.claim_status = 'claimed') as claimed,
  pr.rating
from league_box_members bm
join league_boxes b on b.id = bm.box_id
join league_cycles cy on cy.id = b.cycle_id
join league_seasons se on se.id = cy.season_id
join leagues l on l.id = se.league_id
join players p on p.id = bm.player_id
left join player_ratings pr
  on pr.player_id = p.id and pr.category = league_format_category(l.format);

grant select on league_box_lineup to anon, authenticated;

-- ------------------------------------------------------------
-- 9. Ergebnis einer Box-Runde melden (Spieler-Selbstmeldung)
-- ------------------------------------------------------------
-- Eigene RPC statt create_match_report(): dort wird Vereinsmitgliedschaft
-- geprüft, hier muss es Box-Mitgliedschaft sein. p_team1/p_team2 haben je
-- nach Liga-Format 1 (singles_ladder) oder 2 (box_americano_4) Spieler —
-- league_format_team_size() entscheidet, keine feste Größe im SQL-Code.
-- Die Paarung der Runde bestimmt TypeScript (roundPairings() in
-- box-americano.ts bzw. singles-ladder.ts) — SQL prüft nur Plausibilität.
create or replace function create_league_box_result(
  p_box_match_id uuid,
  p_reporter_id  uuid,
  p_team1        uuid[],
  p_team2        uuid[],
  p_sets         jsonb  -- [{"team1_games": int, "team2_games": int}, ...]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_box_id      uuid;
  v_status      text;
  v_existing    uuid;
  v_club_id     uuid;
  v_format      text;
  v_team_size   smallint;
  v_match_type  text;
  v_played_at   timestamptz;
  v_match_id    uuid;
  v_all         uuid[];
  v_member_cnt  int;
  v_set_count   int;
  s             jsonb;
  i             int := 0;
begin
  select lbm.box_id, lbm.status, lbm.match_id,
         l.club_id, l.format, coalesce(b.scheduled_at, now())
    into v_box_id, v_status, v_existing, v_club_id, v_format, v_played_at
  from league_box_matches lbm
  join league_boxes b   on b.id = lbm.box_id
  join league_cycles cy on cy.id = b.cycle_id
  join league_seasons se on se.id = cy.season_id
  join leagues l        on l.id = se.league_id
  where lbm.id = p_box_match_id
  for update of lbm;

  if not found then
    raise exception 'Runde % nicht gefunden', p_box_match_id;
  end if;

  if v_existing is not null then
    raise exception 'Für diese Runde ist bereits ein Ergebnis eingetragen.';
  end if;

  if v_status <> 'scheduled' then
    raise exception 'Runde ist nicht offen (status=%).', v_status;
  end if;

  v_team_size := league_format_team_size(v_format);
  v_match_type := league_format_category(v_format);

  if array_length(p_team1, 1) <> v_team_size or array_length(p_team2, 1) <> v_team_size then
    raise exception 'Beide Teams brauchen genau % Spieler.', v_team_size;
  end if;

  v_all := p_team1 || p_team2;
  if (select count(distinct x) from unnest(v_all) x) <> array_length(v_all, 1) then
    raise exception 'Alle Spieler müssen unterschiedlich sein.';
  end if;

  select count(*) into v_member_cnt
  from league_box_members
  where box_id = v_box_id and player_id = any(v_all);

  if v_member_cnt <> array_length(v_all, 1) then
    raise exception 'Alle Spieler müssen zu dieser Box gehören.';
  end if;

  if not (p_reporter_id = any(v_all)) then
    raise exception 'Nur wer in dieser Box spielt, darf das Ergebnis melden.';
  end if;

  select count(*) into v_set_count from jsonb_array_elements(p_sets);
  if v_set_count < 1 or v_set_count > 5 then
    raise exception 'Zwischen einem und fünf Sätzen angeben.';
  end if;

  insert into matches (club_id, match_type, competition_type, source, format, played_at, reported_by)
  values (v_club_id, v_match_type, 'vereinsliga', 'club_league', 'best_of_3', v_played_at, p_reporter_id)
  returning id into v_match_id;

  insert into match_participants (match_id, player_id, team, confirmed)
  select v_match_id, x, 1, (x = p_reporter_id) from unnest(p_team1) x
  union all
  select v_match_id, x, 2, (x = p_reporter_id) from unnest(p_team2) x;

  for s in select * from jsonb_array_elements(p_sets)
  loop
    i := i + 1;
    insert into match_sets (match_id, set_number, team1_games, team2_games)
    values (v_match_id, i, (s->>'team1_games')::smallint, (s->>'team2_games')::smallint);
  end loop;

  update league_box_matches
     set match_id = v_match_id,
         status   = 'played'
   where id = p_box_match_id;

  return v_match_id;
end;
$$;

revoke all on function create_league_box_result(uuid, uuid, uuid[], uuid[], jsonb)
  from public, anon, authenticated;
grant execute on function create_league_box_result(uuid, uuid, uuid[], uuid[], jsonb)
  to service_role;

-- ------------------------------------------------------------
-- 10. Admin-Ergebniskorrektur, Walkover, Abbruch, Sitztausch
-- ------------------------------------------------------------
-- Drei eigene Funktionen statt Erweiterung von create_league_box_result:
-- der Selbst-Melde-Pfad der Spieler bleibt unangetastet und behält seine
-- eigene, striktere Prüfung (Melder muss Teilnehmer sein). Alle vier sind
-- nur für service_role ausführbar — die Autorisierung ("ist diese Person
-- Admin GENAU dieser Liga?") prüft requireLeagueAdmin() in TypeScript
-- VORHER, nicht hier. p_admin_id dient nur der Zuschreibung.
--
-- Row-Lock auf der verknüpften matches-Zeile (for update, wo vorhanden) von
-- Anfang an eingebaut, statt wie bei PadelIndex erst nachträglich als
-- Race-Fix nachgezogen (0026 dort): apply_match_rating() (0002) sperrt
-- dieselbe Zeile — wer zuerst sperrt, gewinnt, die andere Transaktion
-- wartet und liest danach den aktuellen Status.
create or replace function admin_report_league_box_result(
  p_box_match_id uuid,
  p_admin_id     uuid,
  p_team1        uuid[],
  p_team2        uuid[],
  p_sets         jsonb,
  p_status       text default 'played',
  p_winner_team  smallint default null,
  p_note         text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_box_id                uuid;
  v_round_status           text;
  v_existing_match_id      uuid;
  v_existing_match_status  text;
  v_club_id                uuid;
  v_format                 text;
  v_team_size              smallint;
  v_match_type             text;
  v_played_at              timestamptz;
  v_match_id               uuid;
  v_all                    uuid[];
  v_member_cnt             int;
  v_set_count              int;
  v_is_replacement         boolean;
  s                        jsonb;
  i                        int := 0;
begin
  if p_status not in ('played', 'abandoned') then
    raise exception 'Status muss "played" oder "abandoned" sein.';
  end if;

  select lbm.box_id, lbm.status, lbm.match_id,
         l.club_id, l.format, coalesce(lbm.scheduled_at, b.scheduled_at, now())
    into v_box_id, v_round_status, v_existing_match_id, v_club_id, v_format, v_played_at
  from league_box_matches lbm
  join league_boxes b   on b.id = lbm.box_id
  join league_cycles cy on cy.id = b.cycle_id
  join league_seasons se on se.id = cy.season_id
  join leagues l        on l.id = se.league_id
  where lbm.id = p_box_match_id
  for update of lbm;

  if not found then
    raise exception 'Runde % nicht gefunden', p_box_match_id;
  end if;

  if v_round_status = 'cancelled' then
    raise exception 'Runde ist storniert.';
  end if;

  v_team_size := league_format_team_size(v_format);
  v_match_type := league_format_category(v_format);

  if array_length(p_team1, 1) <> v_team_size or array_length(p_team2, 1) <> v_team_size then
    raise exception 'Beide Teams brauchen genau % Spieler.', v_team_size;
  end if;

  v_all := p_team1 || p_team2;
  if (select count(distinct x) from unnest(v_all) x) <> array_length(v_all, 1) then
    raise exception 'Alle Spieler müssen unterschiedlich sein.';
  end if;

  select count(*) into v_member_cnt
  from league_box_members
  where box_id = v_box_id and player_id = any(v_all);

  if v_member_cnt <> array_length(v_all, 1) then
    raise exception 'Alle Spieler müssen zu dieser Box gehören.';
  end if;

  select count(*) into v_set_count from jsonb_array_elements(p_sets);
  if v_set_count < 1 or v_set_count > 5 then
    raise exception 'Zwischen einem und fünf Sätzen angeben.';
  end if;

  if v_existing_match_id is not null then
    select status into v_existing_match_status
    from matches where id = v_existing_match_id
    for update;
    if v_existing_match_status = 'confirmed' then
      raise exception 'Ergebnis ist bereits gewertet und lässt sich hier nicht mehr ändern.';
    end if;
    -- Erst auf 'scheduled' zurücksetzen, DANN löschen: sonst verletzt die
    -- ON DELETE SET NULL-Aktion kurzzeitig league_box_matches_played_needs_match
    -- (Postgres prüft Check-Constraints sofort, nicht erst am Transaktionsende).
    update league_box_matches set status = 'scheduled' where id = p_box_match_id;
    delete from matches where id = v_existing_match_id;
  end if;

  insert into matches (club_id, match_type, competition_type, source, format, played_at, reported_by)
  values (v_club_id, v_match_type, 'vereinsliga', 'club_league', 'best_of_3', v_played_at, p_admin_id)
  returning id into v_match_id;

  -- Admin meldet für beide Teams zugleich, deshalb gelten beide sofort als
  -- bestätigt — matches.status bleibt trotzdem 'pending' (Tabellendefault):
  -- die bestehende 48h-Frist und der Cron bestätigen es und wenden das
  -- Rating an, genau wie bei jedem anderen Match. Solange die Frist läuft,
  -- ist das Ergebnis noch korrigierbar.
  insert into match_participants (match_id, player_id, team, confirmed)
  select v_match_id, x, 1, true from unnest(p_team1) x
  union all
  select v_match_id, x, 2, true from unnest(p_team2) x;

  for s in select * from jsonb_array_elements(p_sets)
  loop
    i := i + 1;
    insert into match_sets (match_id, set_number, team1_games, team2_games)
    values (v_match_id, i, (s->>'team1_games')::smallint, (s->>'team2_games')::smallint);
  end loop;

  select exists(
    select 1 from league_box_members
    where box_id = v_box_id and player_id = any(v_all) and role = 'substitute'
  ) into v_is_replacement;

  update league_box_matches
     set match_id       = v_match_id,
         status         = p_status,
         winner_team    = p_winner_team,
         note           = p_note,
         is_replacement = v_is_replacement
   where id = p_box_match_id;

  return v_match_id;
end;
$$;

revoke all on function admin_report_league_box_result(uuid, uuid, uuid[], uuid[], jsonb, text, smallint, text)
  from public, anon, authenticated;
grant execute on function admin_report_league_box_result(uuid, uuid, uuid[], uuid[], jsonb, text, smallint, text)
  to service_role;

-- Walkover: rein ein Box-Tabellen-Ereignis, KEIN matches-Eintrag — fließt
-- deshalb bewusst nicht ins Index-Rating: es wurde schlicht nicht gespielt.
create or replace function admin_set_league_box_walkover(
  p_box_match_id uuid,
  p_admin_id     uuid,
  p_winner_team  smallint,
  p_note         text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status   text;
  v_existing uuid;
begin
  if p_winner_team not in (1, 2) then
    raise exception 'Sieger-Team muss 1 oder 2 sein.';
  end if;

  select status, match_id into v_status, v_existing
  from league_box_matches
  where id = p_box_match_id
  for update;

  if not found then
    raise exception 'Runde % nicht gefunden', p_box_match_id;
  end if;

  if v_existing is not null then
    raise exception 'Für diese Runde ist schon ein Ergebnis erfasst — erst zurücksetzen.';
  end if;

  if v_status <> 'scheduled' then
    raise exception 'Runde ist nicht offen (status=%).', v_status;
  end if;

  update league_box_matches
     set status      = 'walkover',
         winner_team = p_winner_team,
         note        = p_note
   where id = p_box_match_id;
end;
$$;

revoke all on function admin_set_league_box_walkover(uuid, uuid, smallint, text)
  from public, anon, authenticated;
grant execute on function admin_set_league_box_walkover(uuid, uuid, smallint, text)
  to service_role;

-- Zurücksetzen: macht eine Walkover-/Abbruch-/Ergebnis-Eintragung rückgängig,
-- solange sie noch nicht gewertet (rating-angewendet) ist.
create or replace function admin_reset_league_box_match(
  p_box_match_id uuid,
  p_admin_id     uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_match_id     uuid;
  v_existing_match_status text;
begin
  select match_id into v_existing_match_id
  from league_box_matches
  where id = p_box_match_id
  for update;

  if not found then
    raise exception 'Runde % nicht gefunden', p_box_match_id;
  end if;

  if v_existing_match_id is not null then
    select status into v_existing_match_status from matches where id = v_existing_match_id;
    if v_existing_match_status = 'confirmed' then
      raise exception 'Ergebnis ist bereits gewertet und lässt sich nicht mehr zurücksetzen.';
    end if;
    update league_box_matches set status = 'scheduled' where id = p_box_match_id;
    delete from matches where id = v_existing_match_id;
  end if;

  update league_box_matches
     set match_id       = null,
         status         = 'scheduled',
         winner_team    = null,
         note           = null,
         is_replacement = false
   where id = p_box_match_id;
end;
$$;

revoke all on function admin_reset_league_box_match(uuid, uuid)
  from public, anon, authenticated;
grant execute on function admin_reset_league_box_match(uuid, uuid)
  to service_role;

-- Sitztausch innerhalb einer Box (Drag & Drop) — braucht die deferred
-- unique(box_id, seat) aus Abschnitt 3.
create or replace function swap_league_box_seats(
  p_box_id    uuid,
  p_player_a  uuid,
  p_player_b  uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_seat_a smallint;
  v_seat_b smallint;
begin
  set constraints league_box_members_box_id_seat_key deferred;

  select seat into v_seat_a from league_box_members
    where box_id = p_box_id and player_id = p_player_a
    for update;
  select seat into v_seat_b from league_box_members
    where box_id = p_box_id and player_id = p_player_b
    for update;

  if v_seat_a is null or v_seat_b is null then
    raise exception 'Beide Spieler müssen in dieser Box sitzen.';
  end if;

  if v_seat_a = v_seat_b then
    return;
  end if;

  update league_box_members set seat = v_seat_b where box_id = p_box_id and player_id = p_player_a;
  update league_box_members set seat = v_seat_a where box_id = p_box_id and player_id = p_player_b;
end;
$$;

revoke all on function swap_league_box_seats(uuid, uuid, uuid)
  from public, anon, authenticated;
grant execute on function swap_league_box_seats(uuid, uuid, uuid)
  to service_role;
