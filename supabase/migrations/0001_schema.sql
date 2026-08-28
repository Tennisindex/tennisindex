-- ============================================================
-- TennisIndex — Basisschema
-- ============================================================
-- Struktur und Konventionen folgen PadelIndex (padelindex.de) so eng wie
-- sinnvoll — dasselbe Rating-Kern-Prinzip (OpenSkill, mu/sigma, Anzeige-
-- Skala 0-7), dieselbe RLS-/RPC-Aufteilung (Lesen über Policies, Schreiben
-- über service_role-RPCs, siehe Kommentare unten). Zwei bewusste
-- Abweichungen von Anfang an, weil dies ein neues Projekt ist und nicht
-- eine gewachsene Produktions-DB:
--
--   1. SINGLES + DOUBLES: PadelIndex kennt nur Doppel (Padel wird praktisch
--      immer zu viert gespielt). Tennis kennt beides gleichberechtigt.
--      players hat deshalb KEIN eigenes mu/sigma/rating mehr — das liegt
--      in der neuen Tabelle player_ratings, eine Zeile pro (player, category),
--      category in ('singles','doubles'). matches.match_type trägt jetzt
--      genau diese Unterscheidung. Der Rating-KERN (rating-core.ts) ändert
--      sich dadurch NICHT: OpenSkill arbeitet schon immer mit Teams
--      beliebiger Größe — Einzel ist einfach ein Team der Größe 1. Siehe
--      den Kommentarblock in rating-core.ts für die Herleitung.
--
--   2. players ist von Anfang an von auth.users entkoppelt (bei PadelIndex
--      kam das erst nachträglich in einer eigenen Migration, weil zu dem
--      Zeitpunkt schon Nutzer registriert waren). Für ein neues Projekt gibt
--      es keinen Grund, diesen Zwischenschritt zu wiederholen: Profile
--      können von Anfang an vor der Registrierung existieren (Vereins-
--      Import, "Schatten"-Profil beim Melden), ein echter Mensch
--      beansprucht sie später (siehe profile_claims unten).
--
-- Was hingegen unverändert aus PadelIndex übernommen ist: das Grund-Layout
-- (clubs/players/club_memberships/matches/match_participants/match_sets/
-- rating_history/token_transactions/waitlist), die RLS-Strategie und die
-- Namenskonvention public_display_name() für unbeanspruchte/anonyme Profile.

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Clubs
-- ------------------------------------------------------------
create table clubs (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  license_tier  text not null default 'free'
                  check (license_tier in ('free', 'basic', 'pro')),
  accent        text default '#1B6E3C',
  logo_path     text,
  -- Geodaten fürs Entfernungs-Matching (Matchmaking) und /karte.
  latitude      numeric check (latitude between -90 and 90),
  longitude     numeric check (longitude between -180 and 180),
  created_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Players — App-weite Identität, unabhängig von auth.users
-- ------------------------------------------------------------
-- players.id ist die eigene Identität. players.user_id verweist auf
-- auth.users, ist aber NULLABLE: ein Profil kann existieren, bevor sich
-- jemand registriert hat (Vereins-Import, Schatten-Profil beim Match
-- melden — siehe create_shadow_player() weiter unten in diesem Schema und
-- admin_add_unclaimed_member() in 0009_club_member_admin.sql). Ein echter
-- Mensch "beansprucht" ein bestehendes Profil über profile_claims statt ein
-- zweites anzulegen — siehe Abschnitt 5.
--
-- KEIN mu/sigma/rating hier: die liegen pro Spielart in player_ratings
-- (Abschnitt 2). self_assessed_level ist die EINE Selbsteinschätzung beim
-- Onboarding, die beide Kategorien seedet (siehe seedRating() in
-- rating-core.ts) — bewusst nicht zwei getrennte Level-Angaben, um das
-- Onboarding einfach zu halten; wer wirklich unterschiedlich stark im
-- Einzel und Doppel ist, korrigiert sich über gespielte Matches von selbst.
create table players (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid unique references auth.users(id) on delete set null,
  display_name         text not null,
  handle               text not null unique,
  profile_public       boolean not null default true,
  self_assessed_level  numeric check (self_assessed_level between 0 and 7),
  created_at           timestamptz not null default now(),

  -- Beanspruchen (siehe Abschnitt 5)
  claim_status         text not null default 'unclaimed'
                          check (claim_status in
                            ('unclaimed', 'pending', 'awaiting_review', 'claimed', 'rejected')),
  origin               text not null default 'signup'
                          check (origin in ('signup', 'admin_import', 'match_report')),
  claimed_at           timestamptz,
  approved_at          timestamptz,
  approved_by          uuid references players(id) on delete set null,

  -- Selbstauskunft-Profilfelder (nur vom Spieler selbst gepflegt, siehe
  -- GRANT UPDATE weiter unten)
  city                 text,
  playing_hand         text check (playing_hand in ('rechts', 'links')),
  preferred_side       text check (preferred_side in ('rechts', 'links')),
  gender               text check (gender in ('maennlich', 'weiblich', 'divers')),
  show_full_name       boolean not null default false,
  avatar_url           text,

  -- Klassische Registrierung (E-Mail + Passwort), siehe 0014_password_auth.sql.
  -- Ausschließlich vom SECURITY DEFINER-Trigger handle_new_user() gesetzt,
  -- kein GRANT UPDATE an authenticated — ein Spieler kann sein eigenes
  -- Geburtsdatum später nicht mehr ändern (soll für Altersklassen verlässlich
  -- bleiben).
  first_name           text,
  last_name             text,
  birth_date            date,
  club_name             text,

  -- Admin-Kalibrierung (Cold Start), siehe 0020_initial_index_calibration.sql.
  -- Rein deskriptiv fürs Dashboard — die eigentliche Sperre ist
  -- player_ratings.external_seed_locked je Kategorie.
  initial_index_set    boolean not null default false,
  initial_index_tier   text check (initial_index_tier in ('beginner', 'intermediate', 'advanced')),

  constraint players_birth_date_range check (
    birth_date is null
    or (birth_date <= current_date - interval '5 years'
        and birth_date >= current_date - interval '120 years')
  ),
  constraint players_initial_index_consistency
    check ((initial_index_tier is null) = (initial_index_set is false))
);

create index players_claim_status_idx on players (claim_status);

-- ------------------------------------------------------------
-- Player Ratings — eine Zeile je (Spieler, Spielart)
-- ------------------------------------------------------------
-- Kernstück der Singles/Doubles-Erweiterung. Jede Kategorie führt ihr
-- eigenes mu/sigma/matches_played/is_provisional/last_match_at, exakt wie
-- players in PadelIndex EIN Rating führte — hier eben zwei parallele,
-- unabhängige davon. Beide starten mit demselben BASE_MU/BASE_SIGMA
-- (siehe rating-core.ts) und laufen ab dem ersten Match strikt getrennt
-- auseinander: ein Turnier-Einzelspieler und ein Hobby-Doppelspieler sind
-- zwei verschiedene Formkurven derselben Person.
--
-- rating ist wie bei PadelIndex eine generated column auf derselben
-- 0-7-Skala (toDisplayRating() in rating-core.ts rechnet identisch).
create table player_ratings (
  player_id             uuid not null references players(id) on delete cascade,
  category              text not null check (category in ('singles', 'doubles')),
  mu                    numeric not null default 25.0,
  sigma                 numeric not null default (25.0 / 3.0),
  matches_played        int not null default 0,
  is_provisional        boolean not null default true,
  last_match_at         timestamptz,
  -- Anti-Manipulations-Grenze für externe Ranking-Nachweise UND
  -- Admin-Kalibrierung — siehe 0003_external_claims.sql /
  -- 0020_initial_index_calibration.sql. Je Kategorie, weil ein Spieler in
  -- Doppel schon aktiv sein kann, während sein Einzel-Rating noch am
  -- Startwert steht (und umgekehrt).
  external_seed_locked  boolean not null default false,
  created_at            timestamptz not null default now(),
  rating                numeric generated always as (
                           greatest(
                             0::numeric,
                             least(
                               7::numeric,
                               round(((mu - 2 * sigma) * 7.0 / 50.0)::numeric, 2)
                             )
                           )
                         ) stored,
  primary key (player_id, category)
);

create index player_ratings_rating_idx on player_ratings (category, rating desc);

-- ------------------------------------------------------------
-- Mitgliedschaften
-- ------------------------------------------------------------
create table club_memberships (
  club_id     uuid not null references clubs(id) on delete cascade,
  player_id   uuid not null references players(id) on delete cascade,
  role        text not null default 'member' check (role in ('admin', 'member')),
  created_at  timestamptz not null default now(),
  primary key (club_id, player_id)
);

create index club_memberships_player_idx on club_memberships (player_id);

-- ------------------------------------------------------------
-- Matches
-- ------------------------------------------------------------
-- match_type ist HIER die Spielart (singles/doubles) — die zentrale neue
-- Unterscheidung. competition_type entspricht dem, was bei PadelIndex
-- "match_type" hieß (GPS/Turnier/Vereinsliga/Challenge/Freizeit): eine rein
-- beschreibende Wettbewerbs-Kategorie, unabhängig von der Spielart. Die
-- beiden Namen bewusst verschieden, um genau diese Verwechslung
-- auszuschließen.
--
-- format ist bei PadelIndex freier Text ohne Constraint; hier bewusst
-- eingeschränkt, weil Tennis (anders als Padel) beides wirklich braucht:
-- Turniere spielen teils best_of_5, Amateur-/Liga-Matches praktisch immer
-- best_of_3.
create table matches (
  id                uuid primary key default gen_random_uuid(),
  club_id           uuid references clubs(id) on delete set null,
  match_type        text not null check (match_type in ('singles', 'doubles')),
  competition_type  text not null default 'freizeit'
                      check (competition_type in
                        ('verband', 'turnier', 'vereinsliga', 'tennisindex_challenge', 'freizeit')),
  status            text not null default 'pending'
                      check (status in ('pending', 'confirmed', 'declined', 'cancelled')),
  rating_applied    boolean not null default false,
  source            text not null default 'manual'
                      check (source in ('manual', 'club_league', 'tournament', 'import')),
  format            text not null default 'best_of_3' check (format in ('best_of_3', 'best_of_5')),
  played_at         timestamptz not null default now(),
  reported_by       uuid references players(id) on delete set null,
  confirm_deadline  timestamptz not null default (now() + interval '48 hours'),
  confirmed_at      timestamptz,
  created_at        timestamptz not null default now()
);

create index matches_status_deadline_idx on matches (status, confirm_deadline);
create index matches_club_idx on matches (club_id, played_at desc);

create table match_participants (
  match_id    uuid not null references matches(id) on delete cascade,
  player_id   uuid not null references players(id) on delete cascade,
  team        smallint not null check (team in (1, 2)),
  confirmed   boolean not null default false,
  primary key (match_id, player_id)
);

create index match_participants_player_idx on match_participants (player_id);

-- Verteidigung in der Tiefe: die eigentliche Zählung ("Einzel = genau 2,
-- Doppel = genau 4") erzwingt schon create_match_report() weiter unten
-- (der einzige vorgesehene Schreibweg). Dieser Trigger fängt zusätzlich
-- jeden anderen/zukünftigen Schreibpfad ab, statt sich allein auf die
-- RPC-Disziplin zu verlassen.
create or replace function enforce_match_participant_count()
returns trigger
language plpgsql
as $$
declare
  v_match_type text;
  v_count      int;
  v_expected   int;
begin
  select match_type into v_match_type from matches where id = coalesce(new.match_id, old.match_id);
  if v_match_type is null then
    return coalesce(new, old);
  end if;

  select count(*) into v_count from match_participants where match_id = coalesce(new.match_id, old.match_id);
  v_expected := case v_match_type when 'singles' then 2 else 4 end;

  if v_count > v_expected then
    raise exception 'Zu viele Teilnehmer für ein % (erwartet %, gefunden %).', v_match_type, v_expected, v_count;
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_enforce_match_participant_count on match_participants;
create constraint trigger trg_enforce_match_participant_count
  after insert on match_participants
  deferrable initially deferred
  for each row execute function enforce_match_participant_count();

create table match_sets (
  match_id      uuid not null references matches(id) on delete cascade,
  set_number    smallint not null check (set_number between 1 and 5),
  team1_games   smallint not null check (team1_games between 0 and 99),
  team2_games   smallint not null check (team2_games between 0 and 99),
  primary key (match_id, set_number)
);

-- ------------------------------------------------------------
-- Rating-Historie + Tokens
-- ------------------------------------------------------------
-- category zusätzlich zu match_id (match_id ist bei inactivity_decay/seed/
-- manual_adjust null): jede Historienzeile gehört eindeutig zu einer
-- Spielart, damit sich Einzel- und Doppel-Verlauf ohne Join gegen matches
-- getrennt anzeigen lassen (Profilseite: "Einzel-Historie" / "Doppel-
-- Historie" / "Gesamter Verlauf" mit Label).
create table rating_history (
  id              uuid primary key default gen_random_uuid(),
  player_id       uuid not null references players(id) on delete cascade,
  category        text not null check (category in ('singles', 'doubles')),
  match_id        uuid references matches(id) on delete set null,
  mu_before       numeric not null,
  sigma_before    numeric not null,
  mu_after        numeric not null,
  sigma_after     numeric not null,
  rating_before   numeric not null,
  rating_after    numeric not null,
  factors         jsonb not null default '{}'::jsonb,
  reason          text not null
                    check (reason in ('match', 'inactivity_decay', 'seed', 'manual_adjust')),
  created_at      timestamptz not null default now()
);

create index rating_history_player_idx on rating_history (player_id, category, created_at desc);

create table token_transactions (
  id          uuid primary key default gen_random_uuid(),
  player_id   uuid not null references players(id) on delete cascade,
  club_id     uuid references clubs(id) on delete set null,
  amount      int not null check (amount > 0),
  reason      text not null,
  match_id    uuid references matches(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index token_transactions_player_idx on token_transactions (player_id, created_at desc);

-- ------------------------------------------------------------
-- Waitlist (Landing)
-- ------------------------------------------------------------
create table waitlist (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  club_name     text,
  token_hash    text,
  confirmed_at  timestamptz,
  created_at    timestamptz not null default now(),
  constraint waitlist_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create unique index waitlist_email_lower_idx on waitlist (lower(email));
create unique index waitlist_token_hash_idx on waitlist (token_hash);

-- ------------------------------------------------------------
-- Vereins-Demo-Anfragen (separater Funnel von der Spieler-Warteliste)
-- ------------------------------------------------------------
create table club_demo_requests (
  id            uuid primary key default gen_random_uuid(),
  club_name     text not null,
  contact_name  text not null,
  email         text not null,
  message       text,
  created_at    timestamptz not null default now(),
  constraint club_demo_requests_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

alter table club_demo_requests enable row level security;
-- Keine Policy für anon/authenticated: läuft ausschließlich über service_role.

-- ------------------------------------------------------------
-- Auth-Identität -> Spielerzeile
-- ------------------------------------------------------------
-- Alle Policies vergleichen gegen current_player_id() statt gegen
-- auth.uid(), weil players.id nicht die Auth-ID ist (siehe oben).
create or replace function current_player_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from players where user_id = auth.uid()
$$;

-- ------------------------------------------------------------
-- Öffentlicher Anzeigename
-- ------------------------------------------------------------
-- Unbeansprucht ODER beansprucht-ohne-Zustimmung -> "Robin K.". Voller
-- Name nur nach explizitem Opt-in (show_full_name) UND claim_status =
-- 'claimed' — identisch zur PadelIndex-Endfassung (dort nachträglich per
-- Migration ergänzt, hier von Anfang an so).
create or replace function public_display_name(p_name text, p_claim_status text, p_show_full_name boolean)
returns text
language sql
immutable
as $$
  select case
    when p_claim_status = 'claimed' and p_show_full_name then p_name
    when p_name is null or position(' ' in trim(p_name)) = 0 then p_name
    else split_part(trim(p_name), ' ', 1) || ' ' ||
         left(split_part(trim(p_name), ' ', 2), 1) || '.'
  end
$$;

-- ------------------------------------------------------------
-- Eindeutigen Handle erzeugen
-- ------------------------------------------------------------
-- Von handle_new_user() UND admin_add_unclaimed_member()/create_shadow_player()
-- genutzt, damit alle drei Wege (Signup, Admin legt an, Melder legt beim
-- Match-Melden an) exakt dieselbe Slugify+Eindeutigkeits-Logik verwenden.
create or replace function generate_unique_handle(p_name text)
returns text
language plpgsql
set search_path = public
as $$
declare
  v_handle text;
begin
  v_handle := lower(regexp_replace(p_name, '[^a-zA-Z0-9]+', '-', 'g'));
  v_handle := trim(both '-' from v_handle);
  if v_handle is null or v_handle = '' then
    v_handle := 'player';
  end if;
  if exists (select 1 from players where handle = v_handle) then
    v_handle := v_handle || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);
  end if;
  return v_handle;
end;
$$;

revoke all on function generate_unique_handle(text) from public, anon, authenticated;

-- ------------------------------------------------------------
-- Profil beanspruchen statt neu anlegen
-- ------------------------------------------------------------
-- Ablauf: Spieler tippt Name + E-Mail -> Server findet das unbeanspruchte
-- Profil -> pending Claim -> Magic Link -> beim ersten Login löst
-- handle_new_user() den Claim ein und verknüpft das BESTEHENDE Profil samt
-- Rating und Matchhistorie (in BEIDEN Kategorien), statt ein neues
-- anzulegen. Nach dem Verknüpfen steht das Profil auf 'awaiting_review' —
-- erst ein Vereins-Admin, der die Mitglieder persönlich kennt, schaltet es
-- endgültig auf 'claimed' (siehe 0009_club_member_admin.sql).
create table profile_claims (
  id              uuid primary key default gen_random_uuid(),
  player_id       uuid not null references players(id) on delete cascade,
  email           text not null,
  requested_name  text not null,
  status          text not null default 'pending'
                    check (status in ('pending', 'approved', 'rejected', 'expired')),
  created_at      timestamptz not null default now(),
  expires_at      timestamptz not null default (now() + interval '7 days'),
  resolved_at     timestamptz,
  constraint profile_claims_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create unique index profile_claims_one_pending_idx
  on profile_claims (player_id) where status = 'pending';
create index profile_claims_email_idx on profile_claims (lower(email), status);

alter table profile_claims enable row level security;
-- Keine Policy für anon/authenticated: Claims laufen ausschließlich
-- serverseitig über service_role.

-- ------------------------------------------------------------
-- Auth: neuer User -> Spielerzeile (oder bestehenden Claim einlösen)
-- ------------------------------------------------------------
-- first_name/last_name/birth_date/club_name kommen aus der klassischen
-- Registrierung (raw_user_meta_data, von signUp({options:{data:{...}}})
-- gesetzt, siehe 0014_password_auth.sql) — für Magic-Link-Signups ohne
-- diese Felder bleibt der Fallback auf E-Mail-Lokalteil/"Spieler".
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claim_id    uuid;
  v_player_id   uuid;
  v_linked      int;
  v_name        text;
  v_first_name  text;
  v_last_name   text;
  v_birth_date  date;
  v_club_name   text;
begin
  -- 1. Offenen Claim für diese E-Mail suchen
  select pc.id, pc.player_id
    into v_claim_id, v_player_id
    from profile_claims pc
   where lower(pc.email) = lower(new.email)
     and pc.status = 'pending'
     and pc.expires_at > now()
   order by pc.created_at desc
   limit 1;

  if v_claim_id is not null then
    -- claimed_at = E-Mail-Besitz bestätigt, approved_at = Vereins-Admin hat
    -- zugestimmt (separater Schritt).
    update players
       set user_id      = new.id,
           claim_status = 'awaiting_review',
           claimed_at   = now()
     where id = v_player_id
       and user_id is null;

    get diagnostics v_linked = row_count;

    if v_linked = 1 then
      update profile_claims
         set status = 'approved', resolved_at = now()
       where id = v_claim_id;
      return new;
    end if;

    -- Profil war schon vergeben -> Claim entwerten, normal weitermachen
    update profile_claims
       set status = 'rejected', resolved_at = now()
     where id = v_claim_id;
  end if;

  -- 2. Kein Claim: frisches Profil.
  v_first_name := nullif(trim(new.raw_user_meta_data->>'first_name'), '');
  v_last_name  := nullif(trim(new.raw_user_meta_data->>'last_name'), '');
  v_club_name  := nullif(trim(new.raw_user_meta_data->>'club_name'), '');

  begin
    v_birth_date := nullif(trim(new.raw_user_meta_data->>'birth_date'), '')::date;
  exception when others then
    v_birth_date := null;
  end;

  v_name := coalesce(
    nullif(trim(concat_ws(' ', v_first_name, v_last_name)), ''),
    nullif(trim(new.raw_user_meta_data->>'display_name'), ''),
    split_part(new.email, '@', 1),
    'Spieler'
  );

  insert into players (
    user_id, display_name, handle, claim_status, origin,
    first_name, last_name, birth_date, club_name
  )
  values (
    new.id, v_name, generate_unique_handle(v_name), 'claimed', 'signup',
    v_first_name, v_last_name, v_birth_date, v_club_name
  )
  returning id into v_player_id;

  -- Beide Rating-Kategorien anlegen, unabhängig davon, was der Spieler am
  -- Ende tatsächlich spielt — sie starten identisch am BASE_MU/BASE_SIGMA
  -- und divergieren erst mit echten Matches.
  insert into player_ratings (player_id, category) values
    (v_player_id, 'singles'),
    (v_player_id, 'doubles');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ------------------------------------------------------------
-- Shadow-Profil beim Match melden
-- ------------------------------------------------------------
-- "Wir haben spontan gespielt, einer hat noch keinen Account" — jedes
-- Vereinsmitglied kann beim Melden direkt ein Platzhalter-Profil anlegen,
-- ohne einen Admin zu bitten (admin_add_unclaimed_member in
-- 0009_club_member_admin.sql bleibt daneben bestehen, für die Verwaltungsseite).
create or replace function create_shadow_player(p_club_id uuid, p_display_name text)
returns table(id uuid, handle text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player_id uuid;
  v_name      text := trim(p_display_name);
  v_handle    text;
begin
  if v_name = '' then
    raise exception 'Name darf nicht leer sein.';
  end if;

  v_handle := generate_unique_handle(v_name);

  insert into players (display_name, handle, claim_status, origin)
  values (v_name, v_handle, 'unclaimed', 'match_report')
  returning players.id into v_player_id;

  insert into player_ratings (player_id, category) values
    (v_player_id, 'singles'),
    (v_player_id, 'doubles');

  insert into club_memberships (club_id, player_id) values (p_club_id, v_player_id);

  return query select v_player_id, v_handle;
end;
$$;

-- Die Autorisierung ("ist der Aufrufer Mitglied GENAU dieses Vereins?")
-- prüft der TS-Aufrufer nicht extra vorher — sie ergibt sich daraus, dass
-- create_match_report() das neue Profil ohnehin ablehnt, sobald es nicht
-- Mitglied von p_club_id ist. Trotzdem service_role-only, damit niemand per
-- direktem RPC-Call beliebige Vereine mit Platzhaltern fluten kann.
revoke all on function create_shadow_player(uuid, text) from public, anon, authenticated;
grant execute on function create_shadow_player(uuid, text) to service_role;

-- ------------------------------------------------------------
-- Öffentliches Leaderboard (nie mu/sigma nach außen)
-- ------------------------------------------------------------
-- EINE Zeile je (Spieler, Kategorie) statt je Spieler: /rankings/singles
-- und /rankings/doubles (siehe leaderboard.ts) filtern beide aus derselben
-- View auf `category`, statt zwei fast identische Views zu pflegen. Läuft
-- als SECURITY DEFINER (security_invoker = false), weil players selbst
-- für anon nicht direkt lesbar ist (siehe RLS unten) — die View filtert
-- und maskiert stattdessen selbst.
create or replace view club_leaderboard
with (security_invoker = false) as
select
  c.id           as club_id,
  c.slug         as club_slug,
  c.name         as club_name,
  c.license_tier,
  c.accent,
  p.id           as player_id,
  p.handle,
  pr.category,
  public_display_name(p.display_name, p.claim_status, p.show_full_name) as name,
  (p.claim_status = 'claimed') as claimed,
  pr.rating,
  round(
    greatest(0::numeric, least(1::numeric, 1 - (pr.sigma / (25.0 / 3.0))))::numeric,
    4
  ) as confidence,
  pr.matches_played as matches,
  pr.is_provisional as provisional,
  coalesce((
    select rh.rating_after - rh.rating_before
    from rating_history rh
    where rh.player_id = p.id
      and rh.category = pr.category
      and rh.reason = 'match'
    order by rh.created_at desc
    limit 1
  ), 0) as trend,
  pr.last_match_at
from clubs c
join club_memberships cm on cm.club_id = c.id
join players p on p.id = cm.player_id
join player_ratings pr on pr.player_id = p.id
where p.profile_public = true;

grant select on club_leaderboard to anon, authenticated;

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
alter table clubs enable row level security;
alter table players enable row level security;
alter table player_ratings enable row level security;
alter table club_memberships enable row level security;
alter table matches enable row level security;
alter table match_participants enable row level security;
alter table match_sets enable row level security;
alter table rating_history enable row level security;
alter table token_transactions enable row level security;
alter table waitlist enable row level security;

create policy clubs_public_read on clubs
  for select using (true);

-- players ist NICHT direkt für anon lesbar: importierte Klarnamen wären
-- sonst über die Tabelle direkt abfragbar. Öffentlich sichtbar ist nur die
-- kuratierte View club_leaderboard weiter oben in dieser Datei.
create policy players_self_select on players
  for select using (user_id = auth.uid());

create policy players_self_update on players
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy player_ratings_self_select on player_ratings
  for select using (player_id = current_player_id());

create policy memberships_public_read on club_memberships
  for select using (true);

-- Die Policies unten fragen match_participants aus einer Policy AUF
-- match_participants heraus ab — Endlosrekursion, sobald die Tabelle
-- Zeilen hat. security definer umgeht RLS innerhalb der Prüfung und bricht
-- den Zyklus.
create or replace function plays_in_match(p_match_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from match_participants mp
    where mp.match_id = p_match_id
      and mp.player_id = current_player_id()
  )
$$;

create policy matches_participant_read on matches
  for select using (plays_in_match(id));

create policy match_participants_self_read on match_participants
  for select using (plays_in_match(match_id));

create policy match_sets_participant_read on match_sets
  for select using (plays_in_match(match_id));

create policy rating_history_self_read on rating_history
  for select using (player_id = current_player_id());

create policy token_transactions_self_read on token_transactions
  for select using (player_id = current_player_id());

-- waitlist/club_demo_requests: nur service_role (Insert-Policy für anon
-- kommt separat, siehe 0004_waitlist_anon_insert.sql).

grant select on table clubs, club_memberships to anon, authenticated;
grant select on table players, player_ratings, rating_history to authenticated;
grant update (city, playing_hand, preferred_side, gender, self_assessed_level, show_full_name, avatar_url)
  on table players to authenticated;
