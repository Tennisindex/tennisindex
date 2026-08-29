-- ============================================================
-- TennisIndex — Rate Limiting für Registrierung, Login, Passwort-Reset
-- ============================================================
-- Die Registrierungsfelder (first_name/last_name/birth_date/club_name) und
-- der claim-aware handle_new_user() stehen bereits final in 0001_schema.sql
-- — anders als bei PadelIndex (dort kam die klassische E-Mail+Passwort-
-- Registrierung nachträglich dazu) gibt es hier keinen Zwischenstand
-- (Magic-Link-only) zu replizieren.
--
-- Zusätzlich zu Supabase Auths eigenen Limits (auth.rate_limit in
-- supabase/config.toml, gilt aufs ganze Projekt) eine eigene, feingranulare
-- Bremse pro Aktion+Schlüssel (IP oder E-Mail) — service_role-only,
-- gleiches Muster wie profile_claims/waitlist (RLS an, keine Policy).

create table auth_rate_limit_hits (
  id          bigint generated always as identity primary key,
  bucket      text not null,
  key         text not null,
  created_at  timestamptz not null default now()
);

create index auth_rate_limit_hits_lookup_idx
  on auth_rate_limit_hits (bucket, key, created_at);

alter table auth_rate_limit_hits enable row level security;

-- Wird pro Registrierung/Login/Reset-Versand aufgerufen. true = erlaubt
-- (und der Versuch wurde gezählt), false = Limit erreicht (nicht gezählt,
-- ein weiterer Versuch im selben Fenster bleibt möglich, sobald ältere
-- Treffer aus dem Fenster fallen).
create or replace function check_rate_limit(
  p_bucket text,
  p_key    text,
  p_max    int,
  p_window interval
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  delete from auth_rate_limit_hits
   where bucket = p_bucket and key = p_key and created_at < now() - p_window;

  select count(*) into v_count
    from auth_rate_limit_hits
   where bucket = p_bucket and key = p_key and created_at > now() - p_window;

  if v_count >= p_max then
    return false;
  end if;

  insert into auth_rate_limit_hits (bucket, key) values (p_bucket, p_key);
  return true;
end;
$$;

revoke all on function check_rate_limit(text, text, int, interval) from public, anon, authenticated;
grant execute on function check_rate_limit(text, text, int, interval) to service_role;
