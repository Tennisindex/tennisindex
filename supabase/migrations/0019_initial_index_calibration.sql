-- ============================================================
-- TennisIndex — Admin-Kalibrierung: Skill-Einstufung für neue Spieler
-- ============================================================
-- Cold-Start-Problem: ein erfahrener Neuzugang startet sonst mit dem
-- MU/Sigma-Standardwert und trifft in den ersten Matches auf Anfänger,
-- bevor genug Matches gespielt sind, um das echte Niveau zu belegen. Ein
-- Vereins-Admin, der den Spieler persönlich kennt, darf deshalb VOR dessen
-- erstem Match in DIESER KATEGORIE einen Startwert setzen — getrennt für
-- Einzel und Doppel, weil beide unabhängig kalibriert werden können (ein
-- starker Einzelspieler ist nicht zwingend ein ebenso starker Doppelspieler).
--
-- Die Autorisierung ("ist diese Person Admin GENAU dieses Vereins UND ist
-- der Spieler Mitglied?") prüft wie überall der Aufrufer in TypeScript VOR
-- dem Call — nicht hier. Es gibt bewusst KEINE RLS-UPDATE-Policy auf
-- player_ratings für mu/sigma: der einzige Schreibweg bleibt dieser
-- service_role-only RPC-Call (und apply_match_rating() für echte Matches).
--
-- Was hier an DB-seitiger Durchsetzung dazukommt (über die
-- TypeScript-Autorisierung hinaus):
--   1. admin_set_initial_index() verweigert den Call, sobald
--      external_seed_locked = true für (Spieler, Kategorie).
--   2. Ein Trigger auf player_ratings sperrt zusätzlich JEDE Änderung an
--      mu, sobald external_seed_locked = true UND sich matches_played
--      dabei NICHT mitändert (= kein echtes Match über
--      apply_match_rating) — als Netz für versehentliche Direktschreiber.

create or replace function guard_player_index_integrity()
returns trigger
language plpgsql
as $$
begin
  if new.mu is distinct from old.mu
     and old.external_seed_locked
     and new.matches_played = old.matches_played then
    raise exception
      'player_ratings.mu ist gesperrt (external_seed_locked) — nur apply_match_rating() darf es nach dem ersten Match noch ändern.';
  end if;
  return new;
end;
$$;

create trigger player_ratings_guard_index_integrity
  before update on player_ratings
  for each row execute function guard_player_index_integrity();

-- ------------------------------------------------------------
-- admin_set_initial_index(): Skill-Stufe -> mu/sigma, atomar + Audit
-- ------------------------------------------------------------
-- Zielwerte MÜSSEN mit SKILL_TIER_TARGET_INDEX in rating-core.ts
-- übereinstimmen (dort auch seedRatingForTier() für TS-Seite + Tests).
create or replace function admin_set_initial_index(
  p_player_id  uuid,
  p_category   text,
  p_skill_tier text,
  p_admin_id   uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_locked         boolean;
  v_matches_played int;
  v_mu_before      numeric;
  v_sigma_before   numeric;
  v_rating_before  numeric;
  v_target         numeric;
  v_sigma_after    numeric := 25.0 / 3.0; -- BASE_SIGMA
  v_mu_after       numeric;
begin
  if p_category not in ('singles', 'doubles') then
    raise exception 'Ungültige Kategorie: %', p_category;
  end if;

  select external_seed_locked, matches_played, mu, sigma, rating
    into v_locked, v_matches_played, v_mu_before, v_sigma_before, v_rating_before
    from player_ratings
   where player_id = p_player_id and category = p_category
     for update;

  if not found then
    raise exception 'Spieler % (Kategorie %) nicht gefunden.', p_player_id, p_category;
  end if;

  if v_locked then
    raise exception
      'Spieler hat bereits ein Match in dieser Kategorie gespielt (matches_played=%) — Kalibrierung nicht mehr möglich.',
      v_matches_played;
  end if;

  v_target := case p_skill_tier
    when 'beginner'     then 1.0
    when 'intermediate' then 3.0
    when 'advanced'     then 5.0
    else null
  end;

  if v_target is null then
    raise exception 'Unbekannte Skill-Stufe: %', p_skill_tier;
  end if;

  v_mu_after := v_target * 50.0 / 7.0 + 2 * v_sigma_after;

  update player_ratings
     set mu    = v_mu_after,
         sigma = v_sigma_after
   where player_id = p_player_id and category = p_category;

  update players
     set initial_index_set  = true,
         initial_index_tier = p_skill_tier
   where id = p_player_id;

  insert into rating_history (
    player_id, category, mu_before, sigma_before, mu_after, sigma_after,
    rating_before, rating_after, factors, reason
  ) values (
    p_player_id, p_category, v_mu_before, v_sigma_before, v_mu_after, v_sigma_after,
    v_rating_before, v_target,
    jsonb_build_object('skillTier', p_skill_tier, 'setByAdminId', p_admin_id),
    'manual_adjust'
  );
end;
$$;

revoke all on function admin_set_initial_index(uuid, text, text, uuid) from public, anon, authenticated;
grant execute on function admin_set_initial_index(uuid, text, text, uuid) to service_role;
