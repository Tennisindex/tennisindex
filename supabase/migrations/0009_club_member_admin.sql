-- ============================================================
-- TennisIndex — Vereins-Admin: Mitglieder pflegen
-- ============================================================
-- Ein Vereins-Admin kann bestehende, registrierte Spieler suchen und
-- hinzufügen, oder — für Spieler, die sich noch nicht selbst registriert
-- haben — einen unbeanspruchten Platzhalter anlegen (origin='admin_import',
-- Pendant zu create_shadow_player() aus 0001, das dieselbe Situation aus
-- Sicht eines normalen Mitglieds beim Match-Melden abdeckt).

create or replace function admin_add_unclaimed_member(p_club_id uuid, p_display_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player_id uuid;
  v_name text := trim(p_display_name);
begin
  if v_name = '' then
    raise exception 'Name darf nicht leer sein.';
  end if;

  insert into players (display_name, handle, claim_status, origin)
  values (v_name, generate_unique_handle(v_name), 'unclaimed', 'admin_import')
  returning id into v_player_id;

  insert into player_ratings (player_id, category) values
    (v_player_id, 'singles'),
    (v_player_id, 'doubles');

  insert into club_memberships (club_id, player_id) values (p_club_id, v_player_id);

  return v_player_id;
end;
$$;

-- Die Autorisierung ("ist diese Person Admin GENAU dieses Vereins?") prüft
-- wie überall der Aufrufer in TypeScript (isClubAdmin(), siehe
-- club-admin.ts) VOR diesem Call, nicht hier — service_role ist der
-- einzige Grantee.
revoke all on function admin_add_unclaimed_member(uuid, text) from public, anon, authenticated;
grant execute on function admin_add_unclaimed_member(uuid, text) to service_role;
