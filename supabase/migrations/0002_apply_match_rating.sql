-- ============================================================
-- TennisIndex — atomare Anwendung eines Rating-Ergebnisses
-- ============================================================
-- Warum eine SQL-Funktion und nicht mehrere Supabase-Client-Calls: der
-- Supabase-JS-Client kennt keine Transaktionen. Ohne Transaktion riskierst
-- du halb angewandte Matches (Rating geschrieben, Tokens nicht). Ablauf: TS
-- berechnet -> ein einziger rpc()-Call schreibt alles atomar.
--
-- Aufruf aus SvelteKit (service_role, NIE mit anon key):
--   await supabaseAdmin.rpc('apply_match_rating', {
--     p_match_id: matchId,
--     p_results: results,   -- JSONB-Array aus computeMatchRatings()
--     p_grants:  grants     -- JSONB-Array aus computeTokenGrants()
--   });
--
-- Singles/Doubles: matches.match_type ('singles'|'doubles') IST die
-- Kategorie in player_ratings — kein zusätzlicher Parameter nötig, die
-- Funktion liest ihn einmal aus der matches-Zeile und schreibt jedes
-- Ergebnis in genau die player_ratings-Zeile mit passender category.
-- computeMatchRatings() (rating-core.ts) weiß dabei selbst nichts von
-- Kategorien — sie bekommt einfach zwei Teams der passenden Größe (1 für
-- Einzel, 2 für Doppel) übergeben, siehe rating/rating.ts.

create or replace function apply_match_rating(
  p_match_id uuid,
  p_results  jsonb,
  p_grants   jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status         text;
  v_rating_applied boolean;
  v_club_id        uuid;
  v_match_type     text;
  r                jsonb;
  g                jsonb;
begin
  -- 1. Match sperren und Vorbedingungen prüfen (Idempotenz!)
  select status, rating_applied, club_id, match_type
    into v_status, v_rating_applied, v_club_id, v_match_type
  from matches
  where id = p_match_id
  for update;

  if not found then
    raise exception 'Match % nicht gefunden', p_match_id;
  end if;

  if v_status <> 'confirmed' then
    raise exception 'Match % ist nicht bestätigt (status=%)', p_match_id, v_status;
  end if;

  -- Doppelanwendung still abbrechen: Retry/Cron darf nichts kaputt machen
  if v_rating_applied then
    return;
  end if;

  -- 2. Rating pro Spieler schreiben + Historie (in der Kategorie des Matches)
  for r in select * from jsonb_array_elements(p_results)
  loop
    insert into rating_history (
      player_id, category, match_id,
      mu_before, sigma_before, mu_after, sigma_after,
      rating_before, rating_after, factors, reason
    ) values (
      (r->>'playerId')::uuid, v_match_type, p_match_id,
      (r->>'muBefore')::numeric, (r->>'sigmaBefore')::numeric,
      (r->>'muAfter')::numeric,  (r->>'sigmaAfter')::numeric,
      (r->>'ratingBefore')::numeric, (r->>'ratingAfter')::numeric,
      r->'factors', 'match'
    );

    update player_ratings
       set mu             = (r->>'muAfter')::numeric,
           sigma          = (r->>'sigmaAfter')::numeric,
           matches_played = matches_played + 1,
           is_provisional = (matches_played + 1) < 12,
           last_match_at  = greatest(
                              coalesce(last_match_at, '-infinity'::timestamptz),
                              (select played_at from matches where id = p_match_id)
                            )
     where player_id = (r->>'playerId')::uuid
       and category = v_match_type;
  end loop;

  -- 3. Token-Gutschriften (nur positiv — Constraint im Schema erzwingt das)
  for g in select * from jsonb_array_elements(p_grants)
  loop
    insert into token_transactions (player_id, club_id, amount, reason, match_id)
    values (
      (g->>'playerId')::uuid,
      v_club_id,
      (g->>'amount')::int,
      g->>'reason',
      p_match_id
    );
  end loop;

  -- 4. Match als angewandt markieren
  update matches
     set rating_applied = true
   where id = p_match_id;
end;
$$;

revoke all on function apply_match_rating(uuid, jsonb, jsonb) from public, anon, authenticated;
grant execute on function apply_match_rating(uuid, jsonb, jsonb) to service_role;


-- ============================================================
-- Bestätigungs-Automatik: 48h-Fenster läuft ab
-- ============================================================
-- Setzt fällige Matches auf 'confirmed'. Die eigentliche Rating-Berechnung
-- holt sich danach der Worker (siehe rating/confirm.ts).

create or replace function auto_confirm_due_matches()
returns setof uuid
language sql
security definer
set search_path = public
as $$
  update matches
     set status = 'confirmed',
         confirmed_at = now()
   where status = 'pending'
     and confirm_deadline <= now()
  returning id;
$$;

grant execute on function auto_confirm_due_matches() to service_role;


-- ============================================================
-- Streak-Ermittlung (Input für die Rating-Berechnung)
-- ============================================================
-- Liefert die aktuelle Serie: positiv = Siege, negativ = Niederlagen.
-- Je Kategorie: eine Einzel-Siegesserie sagt nichts über die Doppel-Form
-- aus und soll den Doppel-Streak-Faktor nicht beeinflussen (und umgekehrt).

create or replace function player_current_streak(p_player_id uuid, p_category text)
returns int
language sql
stable
as $$
  with recent as (
    select (rh.factors->>'won')::boolean as won,
           row_number() over (order by rh.created_at desc) as rn
    from rating_history rh
    where rh.player_id = p_player_id
      and rh.category = p_category
      and rh.reason = 'match'
    order by rh.created_at desc
    limit 30
  ),
  first_val as (select won from recent where rn = 1),
  run as (
    select count(*) as len
    from recent r
    where r.rn <= coalesce(
      (select min(rn) from recent x
        where x.won is distinct from (select won from first_val)), 999
    ) - 1
  )
  select case
           when (select won from first_val) is null then 0
           when (select won from first_val) then (select len from run)::int
           else -(select len from run)::int
         end;
$$;


-- ============================================================
-- Inaktivitäts-Decay (Cron, z.B. wöchentlich via pg_cron)
-- ============================================================
-- Je (Spieler, Kategorie): wer nur Doppel spielt, soll dadurch nicht auch
-- sein ungenutztes Einzel-Rating "künstlich frisch" halten oder umgekehrt.

create or replace function apply_inactivity_decay()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int := 0;
  v_base_sigma numeric := 25.0/3.0;
  pr record;
  v_weeks int;
  v_steps int;
  v_new_sigma numeric;
begin
  for pr in
    select player_id, category, sigma, mu, last_match_at
    from player_ratings
    where last_match_at is not null
      and last_match_at < now() - interval '6 weeks'
      and sigma < v_base_sigma
  loop
    v_weeks := floor(extract(epoch from (now() - pr.last_match_at)) / 604800)::int;
    v_steps := floor((v_weeks - 6) / 4.0)::int + 1;
    v_new_sigma := least(pr.sigma * (1 + 0.08 * v_steps), v_base_sigma);

    if v_new_sigma > pr.sigma then
      insert into rating_history (
        player_id, category, mu_before, sigma_before, mu_after, sigma_after,
        rating_before, rating_after, factors, reason
      ) values (
        pr.player_id, pr.category, pr.mu, pr.sigma, pr.mu, v_new_sigma,
        greatest(0, least(7, (pr.mu - 2*pr.sigma) * 7.0/50.0)),
        greatest(0, least(7, (pr.mu - 2*v_new_sigma) * 7.0/50.0)),
        jsonb_build_object('weeksInactive', v_weeks, 'steps', v_steps),
        'inactivity_decay'
      );

      update player_ratings set sigma = v_new_sigma
        where player_id = pr.player_id and category = pr.category;
      v_count := v_count + 1;
    end if;
  end loop;

  return v_count;
end;
$$;

grant execute on function apply_inactivity_decay() to service_role;
grant execute on function player_current_streak(uuid, text) to service_role;


-- ============================================================
-- Cron-Voraussetzungen (Supabase: pg_cron + pg_net)
-- ============================================================
-- Cloudflare Cron Triggers lassen sich mit @sveltejs/adapter-cloudflare
-- nicht sauber verdrahten: der Adapter überschreibt bei jedem Build
-- unconditional die Datei, auf die wrangler.toml `main` zeigt, mit seinem
-- eigenen generierten Worker (nur fetch(), kein scheduled()). Stattdessen
-- übernimmt Supabase selbst den Zeitplan: pg_cron feuert alle 15 Minuten
-- einen asynchronen HTTP-POST (pg_net) auf /api/cron/confirm-matches, das
-- dieselbe runConfirmCron()-Logik aufruft (siehe rating/confirm.ts), die
-- auch für die manuelle Bestätigung durch den Gegner läuft.
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

-- Nur die Extensions gehören in die versionierte Migration. Der eigentliche
-- cron.schedule()-Aufruf enthält den Bearer-Token für
-- /api/cron/confirm-matches im Klartext (cron.job.command) und wird deshalb
-- NICHT hier eingecheckt, sondern separat direkt im SQL Editor ausgeführt —
-- gleiches Muster wie das SMTP-Passwort, nie im Repo:
--
-- select cron.schedule('confirm-matches', '*/15 * * * *', $$
--   select net.http_post(
--     url := 'https://tennisindex.eu/api/cron/confirm-matches',
--     headers := jsonb_build_object('authorization', 'Bearer <CRON_SECRET>')
--   )
-- $$);
--
-- select cron.schedule('inactivity-decay', '0 4 * * 1',
--   $$select apply_inactivity_decay()$$);
