-- ============================================================
-- TennisIndex — Matchmaking, Spielanfragen, Challenges
-- ============================================================
-- Vier Bereiche, die aufeinander aufbauen:
--   1. player_availabilities — wann/wo/wie will jemand spielen
--   2. play_requests         — konkrete Anfrage an einen Mitspieler
--   3. challenges            — Herausforderung höher platzierter Spieler
--   4. notifications         — In-App-Benachrichtigungen (E-Mail läuft
--      weiterhin über lib/server/email.ts)
--
-- NAMENSKOLLISION VERMIEDEN: PadelIndex nannte die Spielabsicht-Spalte
-- ("freizeit"/"wettkampf"/"training"/"turniervorbereitung") ebenfalls
-- match_type — bei uns ist match_type auf der matches-Tabelle bereits
-- Einzel/Doppel belegt (0001). Diese Spalte heißt hier deshalb
-- session_type, und eine NEUE Spalte discipline trägt, was der Spieler
-- suchen will: 'singles', 'doubles' oder 'either' (unentschieden).
--
-- ANNAHME 1 — "Rangliste" = Verein + Kategorie. Die Ranglisten der App sind
-- club_leaderboard (0001_schema.sql), gefiltert auf category (siehe
-- leaderboard.ts); ein Rang existiert nur innerhalb EINES Vereins UND
-- EINER Spielart. challenges.category trägt deshalb fest, für welche
-- Rangliste die Herausforderung gilt.
--
-- ANNAHME 2 — Ränge werden nicht gespeichert, sondern abgeleitet. rating
-- ist eine generated column (0001); der Rang ist reine Sortierung.
-- challenger_rank_at_creation/challenged_rank_at_creation sind bewusst nur
-- Schnappschüsse fürs Protokoll ("war damals erlaubt"), nie die Wahrheit.
--
-- ANNAHME 3 — Challenge != automatischer Match. Eine angenommene Challenge
-- erzeugt deshalb KEINEN Match, sondern nur die Verabredung. Gespielt wird
-- über den normalen Melde-Weg (create_match_report, 0006) mit
-- competition_type='tennisindex_challenge' und derselben Spielart wie die
-- Challenge; danach wird der Match über challenges.result_match_id
-- zurückverknüpft. Das Rating bleibt vollständig in der bestehenden Logik
-- (apply_match_rating, 0002) — eine Challenge verschafft nur Zugang zu
-- stärkeren Gegnern, sie tauscht niemals Plätze.

-- ------------------------------------------------------------
-- 1. Freie Spielzeiten
-- ------------------------------------------------------------
create table player_availabilities (
  id               uuid primary key default gen_random_uuid(),
  player_id        uuid not null references players(id) on delete cascade,
  -- Entweder wiederkehrend (weekday gesetzt) oder einmalig (specific_date
  -- gesetzt) — der CHECK unten erzwingt genau eines von beiden.
  weekday          smallint check (weekday between 0 and 6),
  specific_date    date,
  start_time       time not null,
  end_time         time not null,
  is_recurring     boolean not null default true,
  club_id          uuid references clubs(id) on delete set null,
  max_distance_km  int not null default 25 check (max_distance_km between 0 and 500),
  session_type     text not null default 'friendly'
                     check (session_type in ('friendly', 'competitive', 'training', 'tournament_prep')),
  discipline       text not null default 'either' check (discipline in ('singles', 'doubles', 'either')),
  desired_level    text not null default 'any'
                     check (desired_level in ('similar', 'slightly_stronger', 'much_stronger', 'any')),
  status           text not null default 'active'
                     check (status in ('active', 'paused', 'deleted')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  constraint availability_end_after_start check (end_time > start_time),
  constraint availability_when_exactly_one check (
    (is_recurring and weekday is not null and specific_date is null)
    or (not is_recurring and specific_date is not null)
  )
);

create index availabilities_active_idx
  on player_availabilities (weekday, start_time) where status = 'active';
create index availabilities_player_idx on player_availabilities (player_id, status);
create index availabilities_club_idx on player_availabilities (club_id) where status = 'active';

-- ------------------------------------------------------------
-- 2. Spielanfragen
-- ------------------------------------------------------------
create table play_requests (
  id              uuid primary key default gen_random_uuid(),
  sender_id       uuid not null references players(id) on delete cascade,
  receiver_id     uuid not null references players(id) on delete cascade,
  availability_id uuid references player_availabilities(id) on delete set null,
  proposed_date   date not null,
  proposed_start  time not null,
  proposed_end    time not null,
  club_id         uuid references clubs(id) on delete set null,
  location_text   text,
  session_type    text not null default 'friendly'
                    check (session_type in ('friendly', 'competitive', 'training', 'tournament_prep')),
  discipline      text not null default 'either' check (discipline in ('singles', 'doubles', 'either')),
  message         text,
  status          text not null default 'pending'
                    check (status in ('pending', 'accepted', 'declined', 'cancelled', 'expired')),
  expires_at      timestamptz not null default (now() + interval '7 days'),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint play_request_not_self check (sender_id <> receiver_id),
  constraint play_request_end_after_start check (proposed_end > proposed_start)
);

create index play_requests_receiver_idx on play_requests (receiver_id, status, created_at desc);
create index play_requests_sender_idx on play_requests (sender_id, status, created_at desc);
create index play_requests_expiry_idx on play_requests (expires_at) where status = 'pending';

create unique index play_requests_one_open_idx
  on play_requests (sender_id, receiver_id) where status = 'pending';

-- ------------------------------------------------------------
-- 3. Challenges
-- ------------------------------------------------------------
create table challenges (
  id                          uuid primary key default gen_random_uuid(),
  challenger_id               uuid not null references players(id) on delete cascade,
  challenged_player_id        uuid not null references players(id) on delete cascade,
  club_id                     uuid not null references clubs(id) on delete cascade,
  category                    text not null default 'singles' check (category in ('singles', 'doubles')),
  challenger_rank_at_creation int not null check (challenger_rank_at_creation > 0),
  challenged_rank_at_creation int not null check (challenged_rank_at_creation > 0),
  proposed_time_slots         jsonb not null default '[]'::jsonb,
  selected_time_slot          jsonb,
  message                     text,
  status                      text not null default 'pending'
                                check (status in ('pending', 'accepted', 'declined',
                                                  'cancelled', 'expired', 'completed')),
  expires_at                  timestamptz not null default (now() + interval '7 days'),
  result_match_id             uuid references matches(id) on delete set null,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),

  constraint challenge_not_self check (challenger_id <> challenged_player_id),
  -- Herausgefordert wird immer nach OBEN: kleinerer Rang = besser platziert.
  constraint challenge_target_is_above check (challenged_rank_at_creation < challenger_rank_at_creation)
);

create index challenges_challenged_idx on challenges (challenged_player_id, status, created_at desc);
create index challenges_challenger_idx on challenges (challenger_id, status, created_at desc);
create index challenges_expiry_idx on challenges (expires_at) where status = 'pending';

-- "Nicht mehrfach denselben Gegner gleichzeitig herausfordern": pending UND
-- accepted zählen als offen.
create unique index challenges_one_open_per_pair_idx
  on challenges (challenger_id, challenged_player_id)
  where status in ('pending', 'accepted');

-- ------------------------------------------------------------
-- 4. In-App-Benachrichtigungen
-- ------------------------------------------------------------
create table notifications (
  id         uuid primary key default gen_random_uuid(),
  player_id  uuid not null references players(id) on delete cascade,
  kind       text not null
               check (kind in ('play_request_received', 'play_request_accepted',
                               'play_request_declined', 'challenge_received',
                               'challenge_accepted', 'challenge_declined',
                               'challenge_expiring', 'challenge_expired',
                               'league_substitute_assigned', 'league_substitute_joined',
                               'league_schedule_reminder', 'league_slot_assigned',
                               'league_cycle_closed')),
  title      text not null,
  body       text,
  link       text,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_player_idx on notifications (player_id, created_at desc);
create index notifications_unread_idx on notifications (player_id) where read_at is null;

-- ------------------------------------------------------------
-- 5. Ausgeblendete Vorschläge ("Nicht interessiert" / blockieren)
-- ------------------------------------------------------------
create table suggestion_dismissals (
  player_id           uuid not null references players(id) on delete cascade,
  dismissed_player_id uuid not null references players(id) on delete cascade,
  blocked             boolean not null default false,
  created_at          timestamptz not null default now(),
  primary key (player_id, dismissed_player_id),

  constraint dismissal_not_self check (player_id <> dismissed_player_id)
);

-- ------------------------------------------------------------
-- 6. RLS
-- ------------------------------------------------------------
alter table player_availabilities enable row level security;
alter table play_requests         enable row level security;
alter table challenges            enable row level security;
alter table notifications         enable row level security;
alter table suggestion_dismissals enable row level security;

create policy availabilities_self_read on player_availabilities
  for select using (player_id = current_player_id());

create policy play_requests_involved_read on play_requests
  for select using (
    sender_id = current_player_id() or receiver_id = current_player_id()
  );

create policy challenges_involved_read on challenges
  for select using (
    challenger_id = current_player_id() or challenged_player_id = current_player_id()
  );

create policy notifications_self_read on notifications
  for select using (player_id = current_player_id());

create policy dismissals_self_read on suggestion_dismissals
  for select using (player_id = current_player_id());

grant select on table player_availabilities, play_requests, challenges,
                      notifications, suggestion_dismissals
  to authenticated;

-- ------------------------------------------------------------
-- 7. Abgelaufene Anfragen/Challenges markieren
-- ------------------------------------------------------------
-- Läuft im bestehenden 15-Minuten-Cron mit (siehe
-- src/routes/api/cron/confirm-matches/+server.ts).
create or replace function expire_stale_requests_and_challenges()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_requests   int;
  v_challenges int;
  v_expiring   jsonb;
begin
  update play_requests
     set status = 'expired', updated_at = now()
   where status = 'pending' and expires_at <= now();
  get diagnostics v_requests = row_count;

  update challenges
     set status = 'expired', updated_at = now()
   where status = 'pending' and expires_at <= now();
  get diagnostics v_challenges = row_count;

  select coalesce(jsonb_agg(jsonb_build_object(
           'challenge_id', c.id,
           'challenger_id', c.challenger_id,
           'challenged_player_id', c.challenged_player_id,
           'expires_at', c.expires_at
         )), '[]'::jsonb)
    into v_expiring
    from challenges c
   where c.status = 'pending'
     and c.expires_at > now()
     and c.expires_at <= now() + interval '24 hours'
     and not exists (
       select 1 from notifications n
        where n.player_id = c.challenged_player_id
          and n.kind = 'challenge_expiring'
          and n.link = '/challenges'
          and n.created_at > c.created_at
     );

  return jsonb_build_object(
    'expired_requests', v_requests,
    'expired_challenges', v_challenges,
    'expiring_soon', v_expiring
  );
end;
$$;

revoke all on function expire_stale_requests_and_challenges() from public, anon, authenticated;
grant execute on function expire_stale_requests_and_challenges() to service_role;
