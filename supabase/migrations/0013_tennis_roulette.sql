-- ============================================================
-- TennisIndex — Tennis-Roulette
-- ============================================================
-- Ein Verein legt feste Termine an ("Slots"), Spieler committen sich mit
-- einem Klick — bei genügend Zusagen findet das Match statt. Ein
-- vollgelaufener Slot wird zu einem ganz normalen, gewerteten Match über
-- den bestehenden create_match_report()-Weg (0006) — kein eigener
-- Rating-Pfad, keine Änderung am Rating-Modell.
--
-- SINGLES/DOUBLES: anders als bei PadelIndex (dort immer Doppel, weil
-- Padel praktisch nie anders gespielt wird) legt der Verein je Slot fest,
-- ob er auf zwei (Einzel) oder vier (Doppel) Zusagen wartet —
-- match_type auf roulette_slots, roulette_join() prüft die passende Grenze.
--
-- WARUM VEREINSMITGLIEDSCHAFT PFLICHT IST: create_match_report() verlangt,
-- dass alle Spieler Mitglied des meldenden Vereins sind — ein Slot, an dem
-- ein Nicht-Mitglied teilnimmt, ließe sich später nie als Match melden,
-- deshalb prüft roulette_join() das schon beim Beitritt.
--
-- WARUM EINE SQL-FUNKTION FÜR DEN BEITRITT: "Zähl aktuelle Zusagen, wenn
-- unter der Grenze dann einfügen" ist über den Supabase-JS-Client nicht
-- atomar — zwei gleichzeitige Beitritte könnten beide die Prüfung bestehen.

create table roulette_slots (
  id           uuid primary key default gen_random_uuid(),
  club_id      uuid not null references clubs(id) on delete cascade,
  created_by   uuid references players(id) on delete set null,
  match_type   text not null default 'doubles' check (match_type in ('singles', 'doubles')),
  starts_at    timestamptz not null,
  duration_min smallint not null default 90 check (duration_min between 30 and 240),
  court        text check (char_length(court) <= 40),
  info         text check (char_length(info) <= 160),
  cancelled    boolean not null default false,
  created_at   timestamptz not null default now()
);

create index roulette_slots_club_idx on roulette_slots (club_id, starts_at);

create table roulette_signups (
  id         uuid primary key default gen_random_uuid(),
  slot_id    uuid not null references roulette_slots(id) on delete cascade,
  player_id  uuid not null references players(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (slot_id, player_id)
);

create index roulette_signups_slot_idx on roulette_signups (slot_id);
create index roulette_signups_player_idx on roulette_signups (player_id);

-- ------------------------------------------------------------
-- RLS: öffentlich lesbar (das ist der Zweck), Schreiben ausschließlich
-- über service_role aus SvelteKit.
-- ------------------------------------------------------------
alter table roulette_slots enable row level security;
alter table roulette_signups enable row level security;

create policy roulette_slots_read on roulette_slots for select using (true);
create policy roulette_signups_read on roulette_signups for select using (true);

grant select on table roulette_slots to anon, authenticated;
grant select on table roulette_signups to anon, authenticated;

-- ------------------------------------------------------------
-- Atomarer Beitritt
-- ------------------------------------------------------------
create or replace function roulette_join(p_slot uuid, p_player uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_club  uuid;
  v_type  text;
  v_limit int;
  v_count int;
begin
  select club_id, match_type into v_club, v_type
    from roulette_slots
   where id = p_slot and cancelled = false and starts_at > now()
   for update;

  if v_club is null then
    raise exception 'WEG';
  end if;

  v_limit := case v_type when 'singles' then 2 else 4 end;

  if not exists (
    select 1 from club_memberships where club_id = v_club and player_id = p_player
  ) then
    raise exception 'KEIN_MITGLIED';
  end if;

  -- Wer schon zugesagt hat, bekommt hier still Erfolg statt VOLL — sonst
  -- würde ein Doppelklick auf "Ich bin dabei" bei einem inzwischen vollen
  -- Slot der eigenen, längst gespeicherten Zusage widersprechen.
  if exists (select 1 from roulette_signups where slot_id = p_slot and player_id = p_player) then
    return;
  end if;

  select count(*) into v_count from roulette_signups where slot_id = p_slot;
  if v_count >= v_limit then
    raise exception 'VOLL';
  end if;

  insert into roulette_signups (slot_id, player_id) values (p_slot, p_player);
end;
$$;

revoke all on function roulette_join(uuid, uuid) from public;
grant execute on function roulette_join(uuid, uuid) to service_role;
