-- ============================================================
-- TennisIndex — Anlagen-Verzeichnis (Deutschlandkarte)
-- ============================================================
-- Ein Verzeichnis ALLER Tennisanlagen, unabhängig davon, ob sie
-- TennisIndex nutzen. Grundlage für /karte.
--
-- WARUM EINE EIGENE TABELLE UND NICHT clubs:
-- An clubs hängen Mitgliedschaften, Ranglisten, /c/[slug]-Seiten, die
-- Sitemap, Matchmaking und die Ligen. Eine fremde Anlage dort einzutragen
-- würde in all diesen Abfragen als "Verein ohne Mitglieder" auftauchen.
-- tennis_venues ist deshalb ein reines Adressverzeichnis; clubs bleibt der
-- zahlende/aktive Mandant.
--
-- PARTNER-STATUS IST ABGELEITET, KEIN FLAG: Eine Anlage ist genau dann
-- Partner, wenn club_id gesetzt ist.
--
-- KOORDINATEN SIND OPTIONAL: ein Import (OSM, CSV) liefert nicht für jede
-- Anlage brauchbare Koordinaten — sie werden trotzdem gespeichert und
-- erscheinen nur nicht auf der Karte.

create table tennis_venues (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  city         text,
  postal_code  text,
  address      text,
  website      text,
  latitude     numeric check (latitude between -90 and 90),
  longitude    numeric check (longitude between -180 and 180),

  -- Gesetzt = diese Anlage nutzt TennisIndex. on delete set null: verlässt
  -- ein Verein die Plattform, bleibt die Anlage im Verzeichnis stehen und
  -- wird wieder als Nicht-Partner geführt.
  club_id      uuid references clubs(id) on delete set null,

  -- Herkunft, damit ein erneuter Import dieselbe Zeile trifft statt
  -- Dubletten anzulegen (siehe unique index unten).
  source       text not null default 'manual'
                 check (source in ('manual', 'osm', 'import')),
  source_ref   text,

  -- Von Hand gepflegte Einträge sollen ein Re-Import nicht überschreiben.
  locked       boolean not null default false,

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint tennis_venues_coords_complete
    check ((latitude is null) = (longitude is null))
);

create unique index tennis_venues_source_ref_idx
  on tennis_venues (source, source_ref)
  where source_ref is not null;

create index tennis_venues_city_idx on tennis_venues (city);
create index tennis_venues_club_idx on tennis_venues (club_id)
  where club_id is not null;

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
alter table tennis_venues enable row level security;

create policy tennis_venues_public_read on tennis_venues
  for select using (true);

grant select on table tennis_venues to anon, authenticated;

-- ------------------------------------------------------------
-- updated_at pflegen
-- ------------------------------------------------------------
create or replace function touch_tennis_venues_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger tennis_venues_touch_updated_at
  before update on tennis_venues
  for each row execute function touch_tennis_venues_updated_at();
