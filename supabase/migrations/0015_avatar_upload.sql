-- ============================================================
-- TennisIndex — Avatar-Upload: Storage-Bucket, RLS
-- ============================================================
-- players.avatar_url + das GRANT UPDATE dafür stehen bereits final in
-- 0001_schema.sql. Bucket-Grenzen gleich final (WebP/JPEG, 1 MiB) statt
-- wie bei PadelIndex erst nachträglich von PNG+2MiB verengt: AvatarUpload.svelte
-- komprimiert von Anfang an clientseitig (Canvas + toBlob(), siehe
-- src/lib/image-compression.ts) auf max. 1024px Kantenlänge und ~500KB,
-- bevor überhaupt hochgeladen wird.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars', 'avatars', true,
  1048576,  -- 1 MiB, Sicherheitsnetz über dem 500KB-Kompressionsziel
  array['image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- RLS auf storage.objects
-- ------------------------------------------------------------
-- Objekt-Pfad-Konvention innerhalb des Buckets: {auth.uid()}/profile.<ext>
-- storage.foldername(name) liefert die Pfad-Segmente vor dem Dateinamen,
-- also ist (storage.foldername(name))[1] die User-ID im ersten Segment.
-- Fester Dateiname pro User -> Re-Upload überschreibt einfach, keine
-- verwaisten alten Dateien, Cache-Busting über ?v=timestamp auf der URL.

create policy avatars_public_read
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy avatars_owner_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy avatars_owner_update
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy avatars_owner_delete
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
