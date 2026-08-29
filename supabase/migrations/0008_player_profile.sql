-- ============================================================
-- TennisIndex — Öffentliches Spielerprofil: "Most Improved"
-- ============================================================
-- Die Selbstauskunft-Profilfelder (city/playing_hand/preferred_side/
-- gender/show_full_name/avatar_url) stehen bereits seit 0001_schema.sql auf
-- players — anders als bei PadelIndex (dort kamen sie nachträglich per
-- Migration dazu) gibt es hier keinen historischen Zwischenstand zu
-- replizieren.
--
-- "Most Improved Player": größter Rating-Zuwachs im Verein seit p_since,
-- JE KATEGORIE — wer im Doppel stark zugelegt hat, aber im Einzel gar
-- nicht spielt, soll auf der Einzel-Auswertung nicht auftauchen.

create or replace function club_most_improved(p_club_id uuid, p_category text, p_since timestamptz)
returns uuid
language sql
stable
as $$
  with windowed as (
    select
      rh.player_id,
      rh.rating_before,
      rh.rating_after,
      row_number() over (partition by rh.player_id order by rh.created_at asc)  as rn_first,
      row_number() over (partition by rh.player_id order by rh.created_at desc) as rn_last
    from rating_history rh
    join club_memberships cm
      on cm.player_id = rh.player_id and cm.club_id = p_club_id
    where rh.reason = 'match' and rh.category = p_category and rh.created_at >= p_since
  ),
  deltas as (
    select
      first_row.player_id,
      last_row.rating_after - first_row.rating_before as delta
    from (select player_id, rating_before from windowed where rn_first = 1) first_row
    join (select player_id, rating_after from windowed where rn_last = 1) last_row
      using (player_id)
  )
  select player_id from deltas order by delta desc limit 1;
$$;

revoke all on function club_most_improved(uuid, text, timestamptz) from public, anon, authenticated;
grant execute on function club_most_improved(uuid, text, timestamptz) to service_role;
