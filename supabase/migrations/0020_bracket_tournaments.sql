-- ============================================================
-- TennisIndex — Turnierbaum: Doppel-K.o.-Turniere (Draw-basiert)
-- ============================================================
-- Eigenständiges Modul NEBEN dem Box-Liga-"Turnier" aus 0011
-- (leagues/league_boxes/...): dort gibt es bewusst KEINE Playoff-/
-- K.o.-Tabellen (siehe Kommentar dort) — genau die Lücke füllt dieses
-- Modul. Beide laufen komplett unabhängig, ein Verein kann beides
-- gleichzeitig haben. URL-Raum: /turnierbaum/[slug] (öffentlich),
-- /turnierbaum/[slug]/verwaltung (Vereins-Admin) — bewusst ein anderes
-- Wort als /turnier, damit "Box-Liga" und "K.o.-Baum" nicht verwechselt
-- werden.
--
-- Der eigentliche Baum (Vorwärtszeiger zwischen Partien, Freilos-Kaskaden)
-- wird komplett in TypeScript geplant (src/lib/bracket/
-- double-elimination.ts, reine Funktion, siehe dortige Tests) und hier nur
-- als fertige Liste persistiert — SQL kennt kein Setz- oder
-- Kaskadenwissen, nur die Struktur, die es bekommt.
--
-- Wie überall in diesem Schema: keine INSERT/UPDATE/DELETE-Policies,
-- Schreibzugriff nur über service_role aus SvelteKit; die Autorisierung
-- ("ist diese Person Admin GENAU dieses Vereins?") prüft isClubAdmin()
-- in TypeScript vorher (siehe requireBracketAdmin in bracket-admin.ts).

-- ------------------------------------------------------------
-- 1. Turnier (ein Draw = ein Event, z. B. "Vereinsmeisterschaft 2026")
-- ------------------------------------------------------------
create table bracket_events (
  id          uuid primary key default gen_random_uuid(),
  club_id     uuid not null references clubs(id) on delete cascade,
  name        text not null,
  slug        text not null unique,
  category    text not null check (category in ('singles', 'doubles')),
  status      text not null default 'draft'
                check (status in ('draft', 'running', 'completed')),
  -- Erst ab dem Auslosungs-Start bekannt (create_bracket_draw), vorher null.
  draw_size   int check (draw_size is null or draw_size >= 4),
  starts_on   date,
  created_at  timestamptz not null default now()
);

create index bracket_events_club_idx on bracket_events (club_id);

-- ------------------------------------------------------------
-- 2. Teilnehmer:in (1 Spieler bei Einzel, 2 bei Doppel — siehe
--    bracket_participant_players) mit fester Setzliste-Nummer
-- ------------------------------------------------------------
create table bracket_participants (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references bracket_events(id) on delete cascade,
  seed        int not null check (seed >= 1),
  created_at  timestamptz not null default now(),
  unique (event_id, seed)
);

create table bracket_participant_players (
  participant_id  uuid not null references bracket_participants(id) on delete cascade,
  player_id       uuid not null references players(id) on delete cascade,
  primary key (participant_id, player_id)
);

create index bracket_participant_players_player_idx on bracket_participant_players (player_id);

-- Jetzt nachträglich möglich (Vorwärtsreferenz von 1 auf 2 aufgelöst):
-- der Champion, sobald das (ggf. zweite) Grand Final entschieden ist.
alter table bracket_events
  add column champion_entry_id uuid references bracket_participants(id) on delete set null;

-- ------------------------------------------------------------
-- 3. Partien des Baums
-- ------------------------------------------------------------
-- status:
--   pending   — mind. ein Slot noch unbekannt (wartet auf eine frühere Partie)
--   scheduled — beide Teilnehmer:innen stehen fest, noch nicht gespielt
--   bye       — Freilos, Sieger steht schon bei Erzeugung fest, kein echtes Spiel
--   walkover  — kampflos entschieden (kein matches-Eintrag, kein Rating)
--   played    — echtes Ergebnis erfasst (matches-Zeile vorhanden)
--
-- next_match_winner_*/next_match_loser_* sind die von double-elimination.ts
-- vorausberechneten Vorwärtszeiger: wer hier gewinnt/verliert, füllt einen
-- festen Slot (1 oder 2) einer späteren Partie. next_match_loser_* ist nur
-- bei bracket='winners' gesetzt — Verlierer im Loser-Bracket und im Grand
-- Final sind schlicht ausgeschieden (bzw. das Grand-Final-Reset entsteht
-- eigens zur Laufzeit, siehe record_bracket_match_result unten).
create table bracket_matches (
  id                      uuid primary key default gen_random_uuid(),
  event_id                uuid not null references bracket_events(id) on delete cascade,
  bracket                 text not null check (bracket in ('winners', 'losers', 'grand_final')),
  round                   smallint not null check (round >= 1),
  slot                    smallint not null check (slot >= 1),
  entry1_id               uuid references bracket_participants(id) on delete set null,
  entry2_id               uuid references bracket_participants(id) on delete set null,
  winner_entry_id         uuid references bracket_participants(id) on delete set null,
  status                  text not null default 'pending'
                            check (status in ('pending', 'scheduled', 'bye', 'walkover', 'played')),
  match_id                uuid unique references matches(id) on delete set null,
  next_match_winner_id    uuid references bracket_matches(id) on delete set null,
  next_match_winner_slot  smallint check (next_match_winner_slot in (1, 2)),
  next_match_loser_id     uuid references bracket_matches(id) on delete set null,
  next_match_loser_slot   smallint check (next_match_loser_slot in (1, 2)),
  grand_final_wb_slot     smallint check (grand_final_wb_slot in (1, 2)),
  scheduled_at            timestamptz,
  court                   text,
  created_at              timestamptz not null default now(),
  unique (event_id, bracket, round, slot),
  constraint bracket_matches_played_needs_match
    check (status <> 'played' or match_id is not null),
  constraint bracket_matches_decided_needs_winner
    check (status not in ('bye', 'walkover', 'played') or winner_entry_id is not null)
);

create index bracket_matches_event_idx on bracket_matches (event_id, bracket, round, slot);

-- ------------------------------------------------------------
-- 4. RLS
-- ------------------------------------------------------------
alter table bracket_events              enable row level security;
alter table bracket_participants        enable row level security;
alter table bracket_participant_players enable row level security;
alter table bracket_matches             enable row level security;

create policy bracket_events_public_read on bracket_events
  for select using (status <> 'draft');

create policy bracket_matches_public_read on bracket_matches
  for select using (
    exists (
      select 1 from bracket_events e
      where e.id = bracket_matches.event_id and e.status <> 'draft'
    )
  );

grant select on table bracket_events, bracket_matches to anon, authenticated;

-- bracket_participants/bracket_participant_players bekommen bewusst KEINE
-- Policy — wie league_box_members: nur über die anonymisierte View unten
-- bzw. service_role erreichbar, damit unbeanspruchte Profile nicht per
-- direkter Tabellenabfrage voll auslesbar sind.

-- ------------------------------------------------------------
-- 5. Öffentliche, anonymisierte Teilnehmer:innen-Ansicht
-- ------------------------------------------------------------
-- Eine Zeile je (Teilnehmer:in, Spieler:in) — bei Doppel also zwei Zeilen
-- pro participant_id. Die aufrufende Seite (bracket.ts) gruppiert client-
-- seitig zu "Name A / Name B", genau wie league_box_lineup es den
-- Aufrufern überlässt, Sitze zu einer Box-Aufstellung zu gruppieren.
create or replace view bracket_participant_view
with (security_invoker = false) as
select
  bpp.participant_id,
  bp.event_id,
  bp.seed,
  p.id as player_id,
  case when p.profile_public then p.handle end as handle,
  case
    when p.profile_public
      then public_display_name(p.display_name, p.claim_status, p.show_full_name)
    else 'Nicht gelistet'
  end as name,
  (p.profile_public and p.claim_status = 'claimed') as claimed,
  pr.rating
from bracket_participant_players bpp
join bracket_participants bp on bp.id = bpp.participant_id
join bracket_events be        on be.id = bp.event_id
join players p                on p.id = bpp.player_id
left join player_ratings pr
  on pr.player_id = p.id and pr.category = be.category;

grant select on bracket_participant_view to anon, authenticated;

-- ------------------------------------------------------------
-- 6. Auslosung anlegen (atomar: gesamter Baum in einem Insert)
-- ------------------------------------------------------------
-- p_matches ist die JSON-Serialisierung von BracketPlan.matches
-- (double-elimination.ts) mit Seed-Nummern bereits durch echte
-- bracket_participants-IDs ersetzt (Zuordnung passiert in bracket-
-- admin.ts, bevor diese Funktion aufgerufen wird) — SQL selbst plant
-- nichts, es persistiert nur. Self-referenzierende next_match_*-IDs
-- funktionieren in einem einzigen mehrzeiligen INSERT, weil Postgres
-- nicht-deferrable FK-Constraints erst am Ende des Statements prüft,
-- nicht Zeile für Zeile — alle referenzierten Zeilen sind zu dem
-- Zeitpunkt schon eingefügt.
create or replace function create_bracket_draw(
  p_event_id  uuid,
  p_draw_size int,
  p_matches   jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status        text;
  v_existing_cnt  int;
begin
  select status into v_status from bracket_events where id = p_event_id for update;
  if not found then
    raise exception 'Turnier % nicht gefunden', p_event_id;
  end if;
  if v_status <> 'draft' then
    raise exception 'Auslosung ist nur im Status "draft" möglich (aktuell: %).', v_status;
  end if;

  select count(*) into v_existing_cnt from bracket_matches where event_id = p_event_id;
  if v_existing_cnt > 0 then
    raise exception 'Für dieses Turnier existiert schon eine Auslosung.';
  end if;

  if jsonb_array_length(p_matches) < 1 then
    raise exception 'Leerer Spielplan.';
  end if;

  insert into bracket_matches (
    id, event_id, bracket, round, slot,
    entry1_id, entry2_id, winner_entry_id, status,
    next_match_winner_id, next_match_winner_slot,
    next_match_loser_id, next_match_loser_slot,
    grand_final_wb_slot
  )
  select
    (x->>'id')::uuid, p_event_id, x->>'bracket', (x->>'round')::smallint, (x->>'slot')::smallint,
    (x->>'entry1_id')::uuid, (x->>'entry2_id')::uuid, (x->>'winner_entry_id')::uuid, x->>'status',
    (x->>'next_match_winner_id')::uuid, (x->>'next_match_winner_slot')::smallint,
    (x->>'next_match_loser_id')::uuid, (x->>'next_match_loser_slot')::smallint,
    (x->>'grand_final_wb_slot')::smallint
  from jsonb_array_elements(p_matches) x;

  update bracket_events set status = 'running', draw_size = p_draw_size where id = p_event_id;
end;
$$;

revoke all on function create_bracket_draw(uuid, int, jsonb) from public, anon, authenticated;
grant execute on function create_bracket_draw(uuid, int, jsonb) to service_role;

-- ------------------------------------------------------------
-- 7. Ergebnis einer Turnierbaum-Partie erfassen (Admin, atomar)
-- ------------------------------------------------------------
-- p_team1/p_team2 müssen genau der Spieler:innen-Liste von entry1/entry2
-- entsprechen (Schutz gegen vertauschte Teilnehmer:innen im Formular).
-- p_winner_side (1|2) statt Ableitung aus den Sätzen, weil auch
-- p_is_walkover=true ohne Sätze ankommen kann. Walkover erzeugt bewusst
-- KEINE matches-Zeile (kein echtes Spiel, kein Rating-Effekt) — exakt wie
-- admin_set_league_box_walkover in 0011.
create or replace function record_bracket_match_result(
  p_bracket_match_id uuid,
  p_admin_id         uuid,
  p_team1            uuid[],
  p_team2            uuid[],
  p_sets             jsonb default '[]'::jsonb,
  p_winner_side      smallint default null,
  p_is_walkover      boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_id        uuid;
  v_club_id         uuid;
  v_category        text;
  v_bracket         text;
  v_round           smallint;
  v_status          text;
  v_entry1_id       uuid;
  v_entry2_id       uuid;
  v_next_win_id     uuid;
  v_next_win_slot   smallint;
  v_next_lose_id    uuid;
  v_next_lose_slot  smallint;
  v_gf_wb_slot      smallint;
  v_team_size       smallint;
  v_match_type      text;
  v_winner_entry    uuid;
  v_loser_entry     uuid;
  v_match_id        uuid;
  v_entry1_players  uuid[];
  v_entry2_players  uuid[];
  v_set_count       int;
  s                 jsonb;
  i                 int := 0;
  v_target_status   text;
  v_target_entry1   uuid;
  v_target_entry2   uuid;
begin
  if p_winner_side not in (1, 2) then
    raise exception 'Sieger-Seite muss 1 oder 2 sein.';
  end if;

  select bm.event_id, be.club_id, be.category, bm.bracket, bm.round, bm.status,
         bm.entry1_id, bm.entry2_id,
         bm.next_match_winner_id, bm.next_match_winner_slot,
         bm.next_match_loser_id, bm.next_match_loser_slot,
         bm.grand_final_wb_slot
    into v_event_id, v_club_id, v_category, v_bracket, v_round, v_status,
         v_entry1_id, v_entry2_id,
         v_next_win_id, v_next_win_slot, v_next_lose_id, v_next_lose_slot,
         v_gf_wb_slot
  from bracket_matches bm
  join bracket_events be on be.id = bm.event_id
  where bm.id = p_bracket_match_id
  for update of bm;

  if not found then
    raise exception 'Partie % nicht gefunden', p_bracket_match_id;
  end if;

  if v_status <> 'scheduled' then
    raise exception 'Partie ist nicht spielbereit (status=%).', v_status;
  end if;

  v_team_size := case when v_category = 'doubles' then 2 else 1 end;
  v_match_type := v_category;

  if array_length(p_team1, 1) <> v_team_size or array_length(p_team2, 1) <> v_team_size then
    raise exception 'Beide Teams brauchen genau % Spieler.', v_team_size;
  end if;

  select array_agg(player_id order by player_id) into v_entry1_players
    from bracket_participant_players where participant_id = v_entry1_id;
  select array_agg(player_id order by player_id) into v_entry2_players
    from bracket_participant_players where participant_id = v_entry2_id;

  if v_entry1_players is distinct from (select array_agg(x order by x) from unnest(p_team1) x) then
    raise exception 'Team 1 stimmt nicht mit der eingelosten Paarung überein.';
  end if;
  if v_entry2_players is distinct from (select array_agg(x order by x) from unnest(p_team2) x) then
    raise exception 'Team 2 stimmt nicht mit der eingelosten Paarung überein.';
  end if;

  v_winner_entry := case p_winner_side when 1 then v_entry1_id else v_entry2_id end;
  v_loser_entry  := case p_winner_side when 1 then v_entry2_id else v_entry1_id end;

  if p_is_walkover then
    update bracket_matches
       set status = 'walkover', winner_entry_id = v_winner_entry
     where id = p_bracket_match_id;
  else
    select count(*) into v_set_count from jsonb_array_elements(p_sets);
    if v_set_count < 1 or v_set_count > 5 then
      raise exception 'Zwischen einem und fünf Sätzen angeben.';
    end if;

    insert into matches (club_id, match_type, competition_type, source, format, played_at, reported_by)
    values (v_club_id, v_match_type, 'turnier', 'tournament', 'best_of_3', now(), p_admin_id)
    returning id into v_match_id;

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

    update bracket_matches
       set status = 'played', winner_entry_id = v_winner_entry, match_id = v_match_id
     where id = p_bracket_match_id;
  end if;

  -- Sieger in die nächste Partie durchreichen.
  if v_next_win_id is not null then
    if v_next_win_slot = 1 then
      update bracket_matches set entry1_id = v_winner_entry where id = v_next_win_id;
    else
      update bracket_matches set entry2_id = v_winner_entry where id = v_next_win_id;
    end if;
    select status, entry1_id, entry2_id into v_target_status, v_target_entry1, v_target_entry2
      from bracket_matches where id = v_next_win_id;
    if v_target_status = 'pending' and v_target_entry1 is not null and v_target_entry2 is not null then
      update bracket_matches set status = 'scheduled' where id = v_next_win_id;
    end if;
  end if;

  -- Verlierer ins Loser-Bracket durchreichen (nur bei winners-Partien gesetzt).
  if v_next_lose_id is not null then
    if v_next_lose_slot = 1 then
      update bracket_matches set entry1_id = v_loser_entry where id = v_next_lose_id;
    else
      update bracket_matches set entry2_id = v_loser_entry where id = v_next_lose_id;
    end if;
    select status, entry1_id, entry2_id into v_target_status, v_target_entry1, v_target_entry2
      from bracket_matches where id = v_next_lose_id;
    if v_target_status = 'pending' and v_target_entry1 is not null and v_target_entry2 is not null then
      update bracket_matches set status = 'scheduled' where id = v_next_lose_id;
    end if;
  end if;

  -- Grand Final: entweder direkt entschieden, oder Reset nötig/entscheidend.
  if v_bracket = 'grand_final' then
    if v_round = 1 then
      if p_winner_side = v_gf_wb_slot then
        -- Winner-Bracket-Seite gewinnt ohne jede Niederlage: Turnier entschieden.
        update bracket_events set status = 'completed', champion_entry_id = v_winner_entry
          where id = v_event_id;
      else
        -- Loser-Bracket-Seite schlägt die bislang verlustfreie Seite: Reset.
        insert into bracket_matches (
          event_id, bracket, round, slot, entry1_id, entry2_id, status, grand_final_wb_slot
        )
        select v_event_id, 'grand_final', 2, 1, bm.entry1_id, bm.entry2_id, 'scheduled', bm.grand_final_wb_slot
        from bracket_matches bm where bm.id = p_bracket_match_id;
      end if;
    else
      -- Reset-Partie (Runde 2): wer hier gewinnt, gewinnt das Turnier.
      update bracket_events set status = 'completed', champion_entry_id = v_winner_entry
        where id = v_event_id;
    end if;
  end if;

  return coalesce(v_match_id, p_bracket_match_id);
end;
$$;

revoke all on function record_bracket_match_result(uuid, uuid, uuid[], uuid[], jsonb, smallint, boolean)
  from public, anon, authenticated;
grant execute on function record_bracket_match_result(uuid, uuid, uuid[], uuid[], jsonb, smallint, boolean)
  to service_role;
