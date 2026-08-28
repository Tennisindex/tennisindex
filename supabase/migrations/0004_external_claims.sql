-- ============================================================
-- TennisIndex — Erweiterung: externe Ranking-Nachweise
-- ============================================================
-- Plattformen sind hier Tennis-spezifisch (bei PadelIndex: Playtomic,
-- RankedIn, Padel Bundesliga). category zusätzlich zu jeder Zeile: ein UTR
-- ist praktisch immer ein Einzel-Rating, eine DTB-Leistungsklasse kann
-- beides einschließen — der Spieler gibt beim Einreichen an, für welche
-- Kategorie der Nachweis gelten soll, computeSeedFromClaims() (siehe
-- external-claims.ts) rechnet dann nur Nachweise derselben Kategorie
-- zusammen.

-- ------------------------------------------------------------
-- 1. Plattform-Skalen: Vertrauensgewicht + Umrechnungstyp
-- ------------------------------------------------------------
create table platform_scale_map (
  platform          text primary key
                     check (platform in
                       ('utr', 'dtb_lk', 'itf_wtn', 'club_ladder', 'other')),
  scale_type        text not null
                     check (scale_type in
                       ('level_0_7', 'points_relative', 'division_tier', 'elo_like', 'unknown')),
  -- Wie sehr vertrauen wir dieser Plattform grundsätzlich (0-1), bevor
  -- überhaupt eine einzelne Extraktion bewertet wird
  base_trust_weight numeric(3,2) not null default 0.50,
  notes             text
);

insert into platform_scale_map (platform, scale_type, base_trust_weight, notes) values
  ('utr',          'elo_like',       0.65,
    'Universal Tennis Rating, algorithmisch aus Matchdaten — kontinuierliche Skala 1-16, gut kalibriert'),
  ('dtb_lk',       'division_tier',  0.60,
    'Leistungsklasse des Deutschen Tennis Bundes (LK1-LK25) — grob gerastert, aber ein starkes, offizielles Signal'),
  ('itf_wtn',      'elo_like',       0.55,
    'ITF World Tennis Number, kontinuierliche Skala 1-40 (niedriger = stärker)'),
  ('club_ladder',  'elo_like',       0.45,
    'Vereinsinterne Rangliste/Ladder — sehr heterogen, abhängig davon was der Screenshot zeigt'),
  ('other',        'unknown',        0.20, null);

-- ------------------------------------------------------------
-- 2. Externe Ranking-Nachweise (Screenshot + Extraktion + Review)
-- ------------------------------------------------------------
create table external_ranking_claims (
  id                    uuid primary key default gen_random_uuid(),
  player_id             uuid not null references players(id) on delete cascade,
  category              text not null check (category in ('singles', 'doubles')),
  platform              text not null references platform_scale_map(platform),
  screenshot_path        text not null,              -- Supabase Storage Pfad, nicht öffentlich
  screenshot_hash        text not null,               -- für Duplikat-Erkennung über Accounts hinweg
  claimed_handle          text not null,               -- vom Spieler selbst eingetippt, vor der Extraktion

  -- Von der Vision-Extraktion befüllt (siehe docs/verification-pipeline.md)
  extracted              jsonb,
  extraction_model       text,                        -- z.B. 'claude-sonnet-5'
  extraction_confidence  numeric(4,3) check (extraction_confidence between 0 and 1),

  -- Von den deterministischen Plausibilitätsregeln befüllt
  plausibility_score     numeric(4,3) check (plausibility_score between 0 and 1),
  plausibility_flags     jsonb default '[]'::jsonb,    -- welche Regeln angeschlagen haben

  status                 text not null default 'pending'
                         check (status in
                           ('pending','auto_verified','needs_review','verified','rejected')),
  reviewed_by            uuid references players(id) on delete set null,
  review_note            text,

  -- Wurde dieser Nachweis tatsächlich in eine Seed-Berechnung einbezogen?
  applied_to_seed        boolean not null default false,

  created_at             timestamptz not null default now(),
  reviewed_at            timestamptz
);

create index on external_ranking_claims (player_id, category, status);
create index on external_ranking_claims (screenshot_hash);

-- ------------------------------------------------------------
-- 3. RLS
-- ------------------------------------------------------------
alter table external_ranking_claims enable row level security;

-- Eigene Nachweise einsehbar
create policy claims_self_read on external_ranking_claims
  for select using (player_id = current_player_id());

-- Einreichen darf nur der Spieler selbst, nur für sich, nur solange der
-- Seed dieser Kategorie nicht gesperrt ist (Anwendungslogik prüft das
-- zusätzlich, hier zur Sicherheit auch auf DB-Ebene).
create policy claims_self_insert on external_ranking_claims
  for insert with check (
    player_id = current_player_id()
    and not exists (
      select 1 from player_ratings pr
      where pr.player_id = current_player_id()
        and pr.category = external_ranking_claims.category
        and pr.external_seed_locked
    )
  );

-- Extraktion, Plausibilitätsbewertung und Statuswechsel laufen
-- ausschließlich serverseitig (service_role) — keine Update-Policy für
-- authenticated Nutzer.

-- Vereins-Admins dürfen needs_review-Fälle ihrer Mitglieder sehen und entscheiden
create policy claims_club_admin_review on external_ranking_claims
  for select using (
    exists (
      select 1
      from club_admins admin_m
      join club_memberships player_m on player_m.club_id = admin_m.club_id
      where admin_m.player_id = current_player_id()
        and player_m.player_id = external_ranking_claims.player_id
    )
  );

-- ------------------------------------------------------------
-- 4. Anti-Manipulations-Grenze: Sperre nach dem ersten echten Match
-- ------------------------------------------------------------
-- Sobald ein erster eigener Match-Rating-Vorgang in dieser Kategorie
-- gelaufen ist, werden externe Nachweise für Spieler+Kategorie gesperrt —
-- unabhängig vom exakten matches_played-Wert (robuster als ein reiner
-- Zahlenvergleich).
create or replace function lock_external_seed_after_first_match()
returns trigger
language plpgsql
as $$
begin
  if new.matches_played > 0 and old.matches_played = 0 then
    update player_ratings
       set external_seed_locked = true
     where player_id = new.player_id and category = new.category;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_lock_external_seed on player_ratings;
create trigger trg_lock_external_seed
  after update of matches_played on player_ratings
  for each row
  execute function lock_external_seed_after_first_match();
