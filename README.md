# TennisIndex

> **Proprietary software.** This repository is **not** open source. All rights reserved — see [LICENSE](LICENSE).

Unabhängiges Rating für Tennis-Amateure — Einzel und Doppel getrennt, aus
bestätigten Matches statt Selbsteinschätzung. SvelteKit auf einem Cloudflare
Worker, Daten in Supabase.

Vollständiger Funktionsumfang: Spielerprofile, Vereinsverwaltung,
Match-Meldung mit gegenseitiger Bestätigung, öffentliche Ranglisten und
Suche, ein Admin-Dashboard, ein Liga-Modul (Doppel-Boxen und eine
Einzel-Ladder), Matchmaking/Roulette, ein Ratgeber- und Quiz-Bereich,
In-App-Chat, ein Werbe-/Kampagnenmodul, Badges/Token-Belohnungen sowie
Capacitor-Hüllen für iOS und Android. Dieses Repo ist eine für Tennis
adaptierte, um Einzel erweiterte Portierung von
[PadelIndex](https://padelindex.de) (padelindex.de) — siehe
["Warum eine Portierung von PadelIndex?"](#warum-eine-portierung-von-padelindex)
unten für den genauen Umfang und die bewussten Abweichungen.

## Einzel und Doppel: wie das Rating funktioniert

Der Rating-Kern (`src/lib/rating-core.ts`) basiert auf
[OpenSkill](https://github.com/philihp/openskill.js), einem Bayes'schen
TrueSkill-artigen Verfahren. Jede:r Spieler:in hat ein `mu`/`sigma`-Paar
**pro Kategorie** (Einzel und Doppel laufen komplett unabhängig
voneinander, Tabelle `player_ratings`, eine Zeile je (Spieler, Kategorie))
— wer im Doppel stark ist, kann im Einzel provisorisch oder schwächer
bewertet sein, und umgekehrt.

Der entscheidende technische Punkt: **`computeMatchRatings()` musste für
Einzel nicht geändert werden.** OpenSkills `rate([team1, team2], ...)`
nimmt Teams beliebiger Größe entgegen — ein Doppel ist ein Match mit zwei
Spieler:innen pro Team, ein Einzel ist exakt derselbe Code-Pfad mit einem
Spieler pro Team. Es gibt keine "Team-Durchschnitt"-Sonderrechnung für
Doppel, die für Einzel getrennt behandelt werden müsste — beide Kategorien
laufen auf derselben mu/sigma-Skala, mit denselben Konstanten
(`BASE_MU`/`BASE_SIGMA`/`PROVISIONAL_MATCHES`) durch denselben
mathematischen Kern. Der ausführliche Kommentarblock am Anfang von
`rating-core.ts` erklärt die Herleitung im Detail.

Was sich zwischen den Kategorien unterscheidet, ist nicht die Formel,
sondern das Konto: `matches.match_type` legt fest, ob ein Match Einzel
oder Doppel ist, `create_match_report()`
(`supabase/migrations/0006_match_report.sql`) verlangt entsprechend genau
2 oder genau 4 Teilnehmer:innen (zusätzlich durch einen Datenbank-Trigger
abgesichert), und `apply_match_rating()`
(`supabase/migrations/0002_apply_match_rating.sql`) schreibt das Ergebnis
in die passende `player_ratings`-Zeile. Ein Doppel-Ergebnis verändert nie
das Einzel-Rating einer Person und umgekehrt.

Auf der Oberfläche zeigt sich das in getrennten Ranglisten
(`/rankings/singles`, `/rankings/doubles`, dazu ein Kategorie-Umschalter
auf jeder Vereinsseite), getrennten Ratings auf dem Profil und einer
kombinierten Matchhistorie mit klarer Disziplin-Kennzeichnung pro Zeile.
Beim Melden eines Matches wählt man zuerst Einzel oder Doppel, danach
passen sich Spieler-/Team-Auswahl und Formular entsprechend an
(`src/routes/c/[slug]/match/neu/`).

## Stack

- **SvelteKit 2** (Svelte 5, Runes) mit `@sveltejs/adapter-cloudflare`
- **Cloudflare Workers** — ein Worker mit statischen Assets (`[assets]` in
  `wrangler.toml`), **kein** Pages-only-Projekt
- **Supabase** — Postgres, Auth, Storage (Avatare), pg_cron/pg_net für
  zeitgesteuerte Jobs
- **Paraglide/inlang** — i18n mit Pfad-Präfix-Routing (`/en/…`, `/es/…`)
  für eine kuratierte Liste öffentlicher Seiten, Deutsch als
  unpräfigierte Basissprache
- **OpenSkill** — Rating-Kern, siehe oben
- **Capacitor 8** — dünne WebView-Hüllen für iOS/Android, laden die
  Live-Domain statt eines gebündelten Builds

## Lokal starten

```bash
npm install
npx paraglide-js compile --project ./project.inlang --outdir ./src/lib/paraglide
cp .env.example .env
# Keys eintragen, siehe "Supabase-Projekt" unten
npm run seed:demo   # optional, aber empfohlen: erzeugt supabase/seed.sql
npm run dev
```

Die `paraglide-js compile`-Zeile läuft normalerweise automatisch als
Vite-Plugin beim ersten `npm run dev`/`npm run build` — nur `npm run
check` (svelte-check) startet Vite nicht und braucht die generierten
Dateien deshalb vorher einmal manuell erzeugt.

```bash
npm test          # vitest, 330+ Tests
npm run check      # svelte-kit sync + svelte-check
npm run build       # Produktions-Build für den Cloudflare Worker
```

- Site: [http://localhost:5173](http://localhost:5173)
- Vereinsseite: `/c/tc-talstadt` (der fiktive Demo-Verein, siehe
  ["Demo-Daten"](#demo-daten-für-die-lokale-entwicklung))
- Widget-API: `/api/v1/clubs/tc-talstadt/leaderboard?limit=10&category=doubles`
- iframe-Fallback: `/embed/tc-talstadt`
- Widget-Skript: `/embed.js`

Ohne Supabase-Keys läuft die Landing-Page trotzdem; alles, was Daten
braucht (Waitlist, Leaderboard, Login, …), antwortet dann mit einem
Fehler statt eines echten Ergebnisses.

## Supabase-Projekt

1. Neues Projekt anlegen (EU-Region empfohlen, z. B. `eu-central-1`) —
   **niemals** die Keys eines bestehenden Projekts (z. B. von PadelIndex)
   wiederverwenden.
2. SQL Editor: alle Migrationen unter [`supabase/migrations/`](supabase/migrations)
   der Reihe nach ausführen, `0001` bis `0019`:

   | Datei | Inhalt |
   | --- | --- |
   | `0001_schema.sql` | Kern: clubs, players, player_ratings, matches, club_leaderboard-View |
   | `0002_apply_match_rating.sql` | `apply_match_rating()`, Inaktivitäts-Decay, pg_cron/pg_net |
   | `0003_club_admin.sql` | Vereins-Admin-Rollen |
   | `0004_external_claims.sql` | Externe Ranking-Nachweise (UTR, DTB-LK, ITF-WTN, …) |
   | `0005_waitlist_anon_insert.sql` | Anonyme Warteliste-Einträge |
   | `0006_match_report.sql` | `create_match_report()` — der zentrale Einzel/Doppel-Schreibweg |
   | `0007_rewards.sql` | Token-Belohnungen |
   | `0008_player_profile.sql` | Profil-Aggregate, `club_most_improved()` |
   | `0009_club_member_admin.sql` | Mitgliederverwaltung, Skill-Kalibrierung |
   | `0010_matchmaking.sql` | Spielanfragen, Verfügbarkeiten |
   | `0011_league_module.sql` | Liga-Grundgerüst: `box_americano_4` + `singles_ladder` |
   | `0012_tennis_venues.sql` | Anlagenverzeichnis (`/karte`) |
   | `0013_tennis_roulette.sql` | Zufalls-Matchmaking |
   | `0014_password_auth.sql` | Klassische Registrierung (E-Mail + Passwort) |
   | `0015_avatar_upload.sql` | Profilbilder (Storage) |
   | `0016_match_chat.sql` | Chat je Match |
   | `0017_advertising_campaigns.sql` | Werbebanner-Verwaltung |
   | `0018_h2h_stats.sql` | Head-to-Head-Statistik |
   | `0019_initial_index_calibration.sql` | Admin-Kaltstart-Kalibrierung |

3. Authentication → Providers → **Email** aktivieren (Magic Link +
   Passwort). Unter Sign In / Providers → Email **"Confirm email"**
   einschalten — ohne diesen Schalter lässt `signInWithPassword()` auch
   unbestätigte Accounts durch.
4. Authentication → Emails → Templates: **Confirm signup** und **Reset
   Password** müssen wie **Magic Link** token-basiert verlinken, nicht
   mit `{{ .ConfirmationURL }}` (ein gemeinsamer Handler für alle drei
   liegt unter `src/routes/auth/confirm/+server.ts`):

   ```
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup&next={{ .RedirectTo }}
   ```

   Für **Reset Password** dieselbe Zeile mit `type=recovery`.
5. Authentication → URL Configuration: Site URL = eure Domain (lokal
   `http://localhost:5173`).
6. Database → Extensions: `pg_cron` und `pg_net` aktivieren (werden von
   `0002_apply_match_rating.sql` für die 48h-Auto-Bestätigung und den
   Inaktivitäts-Decay gebraucht — siehe
   [`src/routes/api/cron/confirm-matches/+server.ts`](src/routes/api/cron/confirm-matches/+server.ts)
   für den genauen Ablauf).
7. Storage: Der Bucket `avatars` für Profilbilder wird bereits von
   `0015_avatar_upload.sql` selbst angelegt (inklusive Policies) — kein
   manueller Schritt nötig.
8. Keys unter Project Settings → API:
   - Project URL → `PUBLIC_SUPABASE_URL`
   - `anon` `public` → `PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (nie ins Client-Bundle,
     nie committen)

## Cloudflare Worker deployen

1. Cloudflare-Account, Workers aktivieren, Repo an Workers Builds
   koppeln (`npx wrangler deploy` läuft nach `npm run build`).
2. `wrangler.toml` → `[vars]`: `PUBLIC_SUPABASE_URL` und
   `PUBLIC_SUPABASE_ANON_KEY` auf euer eigenes Projekt setzen (siehe
   Kommentar in der Datei — Platzhalter, niemals ein fremdes Projekt
   wiederverwenden).
3. Unter Workers → `tennisindex` → Settings → Variables and Secrets als
   **encrypted Secret** setzen (nicht als Klartext-Variable, die
   `wrangler deploy` sonst bei jedem Deploy löscht):
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CRON_SECRET` (beliebiger langer Zufallswert — schützt
     `/api/cron/confirm-matches` vor Aufrufen von außen)
   - optional: `RESEND_API_KEY`, `MAIL_FROM`, `PLATFORM_OWNER_EMAIL`
     (siehe [`.env.example`](.env.example))
4. In Supabase: pg_cron so einrichten, dass es alle 15 Minuten per
   pg_net einen HTTP-POST mit `Authorization: Bearer <CRON_SECRET>` auf
   `https://eure-domain/api/cron/confirm-matches` schickt (siehe
   Kommentar am Anfang von `0002_apply_match_rating.sql` und
   `confirm-matches/+server.ts`) — das übernimmt die 48h-Bestätigung und
   den Inaktivitäts-Decay. `@sveltejs/adapter-cloudflare` generiert
   seinen Worker ohne eigenen `scheduled()`-Handler, deshalb läuft der
   Cron über Supabase statt über einen Cloudflare Cron Trigger.
5. Custom Domain im Dashboard unter Domains & Routes an den Worker
   binden (nicht in `wrangler.toml` verwaltet, bleibt bei Code-Deploys
   unangetastet).
6. Supabase → Authentication → URL Configuration: Site URL auf die
   Produktions-Domain setzen, die `*.workers.dev`-Vorschau-URL zusätzlich
   unter Redirect URLs (Fallback für Branch-Previews).

## Demo-Daten für die lokale Entwicklung

```bash
npm run seed:demo
# erzeugt supabase/seed.sql — läuft automatisch bei `supabase db reset`
```

[`scripts/seed-demo.ts`](scripts/seed-demo.ts) legt einen fiktiven Verein
(TC Talstadt, Slug `tc-talstadt`), 16 frei erfundene Spieler:innen, eine
chronologische Folge simulierter Einzel- und Doppel-Matches der letzten
zehn Wochen sowie eine kleine Liga (`/liga/talstadt`, Format
`box_americano_4`) an. Alle Ratings entstehen aus den simulierten
Match-Ergebnissen über dieselbe `computeMatchRatings()`-Funktion, die
auch der Live-Betrieb nutzt — es werden keine mu/sigma-Werte direkt
gesetzt. IDs sind deterministisch aus den Namen abgeleitet, ein
erneuter Lauf überschreibt `seed.sql` identisch.

**Warum kein Import echter Daten:** TennisIndex startet als neues Projekt
ohne echten Piloten. PadelIndex importierte an dieser Stelle die echten
Tabellen eines echten Vereins — diese Skripte (`import-bavaro*.ts`,
`verify-bavaro-standings.ts`) wurden bewusst **nicht** übernommen, weil
sie reale Personendaten voraussetzen, die für dieses Projekt nicht
existieren. `scripts/import-venues.ts` (Anlagen-Import fürs
Verzeichnis unter `/karte`) blieb erhalten, weil es strukturell
generisch ist und keine Personendaten verarbeitet.

`data/` und `*.local.sql` sind weiterhin gitignored — für den Fall, dass
ihr später echte Vereinsdaten importiert, gehören Klarnamen von
Vereinsmitgliedern weder in die Git-Historie noch in eine Migration.

## Profile beanspruchen statt neu anlegen

Importierte oder beim Match-Melden spontan angelegte Spieler existieren
als Profile ohne Auth-User (`players.user_id is null`, `claim_status =
'unclaimed'`).

1. Der Spieler öffnet `/c/<slug>/beanspruchen` und tippt seinen Namen.
2. Der Server sucht das unbeanspruchte Profil. Genau ein eindeutiger
   Treffer oder keiner — bei zwei ähnlichen Namen wird die Zuordnung
   verweigert, statt zu raten.
3. Magic Link an die E-Mail. Beim ersten Login löst `handle_new_user()`
   den Claim ein und verknüpft das **bestehende** Profil samt Rating
   (beider Kategorien) und Matchhistorie. Es entsteht kein Zweitprofil.
4. Danach steht das Profil auf `awaiting_review` — ein Vereins-Admin, der
   die Mitglieder persönlich kennt, schaltet es final auf `claimed`.

Öffentlich sichtbar ist ein unbeanspruchtes Profil nur abgekürzt
("Robin K.") unter einem anonymen Handle. `anon` hat keinen Lesezugriff
auf `players`, sondern ausschließlich auf die View `club_leaderboard`.

## Repo-Struktur

| Pfad | Inhalt |
| --- | --- |
| `src/routes/+page.svelte` | Landing-Page |
| `src/routes/c/[slug]` | Öffentliche Vereinsseite (Kategorie-Tabs) |
| `src/routes/c/[slug]/match/neu` | Match melden — Einzel/Doppel-Umschalter |
| `src/routes/rankings/[category]` | `/rankings/singles`, `/rankings/doubles` |
| `src/routes/p/[handle]` | Öffentliches Spielerprofil (beide Kategorien) |
| `src/routes/liga/[slug]` | Liga-Ansicht + Verwaltung (Boxen, Zyklen, Termine) |
| `src/routes/c/[slug]/roulette` | Zufalls-Matchmaking |
| `src/routes/quiz`, `src/routes/ratgeber` | Quiz- und Ratgeber-Bereich |
| `src/routes/admin` | Super-Admin-Dashboard |
| `src/routes/embed/[slug]`, `static/embed.js` | Widget für Vereinswebsites |
| `src/routes/api/v1/clubs/[slug]/leaderboard` | Öffentliche Widget-API (CORS) |
| `src/lib/rating-core.ts` | Rating-Kern (OpenSkill), siehe oben |
| `src/lib/server/rating/` | Confirm-Worker, externe Claims, Liga-Seed |
| `src/lib/league/` | Box- und Ladder-Rundenlogik (reine Funktionen) |
| `src/lib/content/guides/`, `src/lib/content/quiz/` | Ratgeber-/Quiz-Inhalte je Sprache |
| `scripts/seed-demo.ts` | Fiktive Demo-Daten → `seed.sql` |
| `scripts/import-venues.ts` | Anlagen-Import (CSV/JSON/OSM) → `seed-venues.local.sql` |
| `scripts/generate-icons.ts`, `generate-og-image.ts` | PWA-Icons und Social-Share-Bilder |
| `supabase/migrations/` | Schema + RPCs |
| `android/`, `ios/`, `capacitor.config.ts` | Capacitor-Hüllen für die Stores |
| `docs/` | Widget-Konzept, Verification-Pipeline |

## Mobile Apps (Capacitor)

`android/` und `ios/` sind dünne Capacitor-WebView-Hüllen, die die Live-Domain
laden (`capacitor.config.ts` → `server.url`), kein gebündelter Offline-Build.

```bash
npm run cap:sync            # native Projekte mit web-seitigen Änderungen abgleichen
npm run cap:open:android    # in Android Studio öffnen
npm run cap:open:ios        # in Xcode öffnen
```

`npm run icons` (bzw. `scripts/generate-icons.ts`) erzeugt sowohl die
Web-PWA-Icons unter `static/icons/` als auch die Capacitor-Quellbilder
unter `assets/` (für `npx capacitor-assets generate`).

## Umfangsentscheidungen und bekannte Lücken

Damit niemand von stillen Annahmen überrascht wird:

- **Übersetzungsvollständigkeit:** Alle drei Sprachen (`de`/`en`/`es`)
  sind strukturell vollständig und werden per Test abgesichert
  (`guides.test.ts`, `quiz-data.test.ts` prüfen Parität in Slugs,
  Sektions-IDs, Fragenanzahl und -Reihenfolge). Inhaltlich sind es
  eigenständige Texte je Sprache, keine Wort-für-Wort-Übersetzungen —
  bei Änderungen an einer Sprache die anderen beiden bewusst mitpflegen.
- **`discipline`-Feld:** `player_availabilities.discipline` existiert im
  Schema (`0010_matchmaking.sql`), ist aber weder in der
  Matchmaking-Logik noch in der Oberfläche verdrahtet — `doublesRating()`
  in `src/lib/server/matchmaking.ts` bewertet aktuell mit einem einzigen
  repräsentativen Rating (Doppel, historisch der einzige Fall bei
  PadelIndex) statt getrennt nach Einzel/Doppel. Bewusste Vereinfachung
  fürs erste Release, mit Kommentar im Code markiert.
- **Support-Widget entfernt:** PadelIndex band einen eigenen
  Board-Support-Chat-Account ein. Dieser gehört nicht zu TennisIndex und
  wurde ersatzlos entfernt (siehe Kommentar in `src/app.html`), statt
  fremde Chat-Anfragen in ein falsches Postfach laufen zu lassen. Bei
  Bedarf ein eigenes Konto anlegen und neu verdrahten (`app.html`,
  `svelte.config.js` CSP, ggf. eine eigene Migration).
- **Kein Löschen von Import-Skripten für echte Vereinsdaten:** siehe
  ["Demo-Daten"](#demo-daten-für-die-lokale-entwicklung) oben.
- **Preise/Zahlen:** Wo im Ratgeber-Content Kosten variieren (Preise,
  Mitgliedsbeiträge, Ausrüstungskosten), steht das bewusst so da
  (Bandbreiten statt erfundener fester Zahlen), statt eine falsche
  Genauigkeit vorzutäuschen.

### Warum eine Portierung von PadelIndex?

TennisIndex übernimmt Architektur, Datenmodell-Konventionen (RLS zum
Lesen, service_role-RPCs zum Schreiben) und den kompletten Funktionsumfang
von PadelIndex — Quiz, Roulette, Chat, Werbemodul, Liga-Modul,
Badges/Token, Ratgeber-Inhalte, Capacitor-Hüllen — 1:1, jeweils für Tennis
angepasst und um Einzel erweitert (siehe
["Einzel und Doppel"](#einzel-und-doppel-wie-das-rating-funktioniert)
oben für die zentrale Erweiterung). Die auffälligsten Abweichungen vom
Original sind an anderer Stelle in dieser README bereits benannt: kein
Import echter Personendaten, kein übernommenes Support-Widget, neue
Marke/Farben/Logo, ein zusätzliches Liga-Format (`singles_ladder`) und
das grundlegend neue `player_ratings`-Datenmodell für die
Kategorie-Trennung.

## License

This software is **proprietary**.
See the [LICENSE](LICENSE) file for full details.

Copyright © 2025–2026 Alec Hahn / Sportcenter Hahn GmbH
All rights reserved. Unauthorized use, copying, modification, distribution or commercial exploitation is strictly prohibited.
