-- ============================================================
-- TennisIndex — Minimaler Vereins-Admin: wer darf was pflegen?
-- ============================================================
-- "Ist Spieler X Admin von Verein Y?" — die Schreibzugriffe selbst laufen
-- wie überall in diesem Schema über service_role aus SvelteKit, nicht über
-- RLS-INSERT-Policies (die Prüfung "ist wirklich Admin dieses Vereins"
-- gehört in TypeScript, siehe club-admin.ts).
--
-- Bewusst an players statt an auth.users gehängt: ein Admin ist damit
-- automatisch ein ganz normaler Spieler-Login (bestehender Magic-Link-/
-- Passwort-Flow, kein separates Identitätssystem für "Leute ohne
-- Spielerprofil").
--
-- Früh in der Migrationsreihenfolge (vor externen Ranking-Nachweisen,
-- Rewards, Matchmaking etc.), weil mehrere spätere RLS-Policies bereits auf
-- club_admins verweisen (statt auf das rein dekorative
-- club_memberships.role).

create table club_admins (
  club_id     uuid not null references clubs(id) on delete cascade,
  player_id   uuid not null references players(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (club_id, player_id)
);

alter table club_admins enable row level security;

-- Nur "bin ich selbst Admin von irgendeinem Verein" muss lesbar sein (um
-- den "Vereins-Admin"-Link auf /konto zu zeigen) — nicht, wer sonst noch
-- Admin ist.
create policy club_admins_self_read on club_admins
  for select using (player_id = current_player_id());

grant select on table club_admins to authenticated;
