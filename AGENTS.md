# fundacja-wz-uw

Statyczna strona Fundacji na rzecz Wydziału Zarządzania UW (Centrum Edukacji: Szkoła Prawa Farmaceutycznego, szkolenie AI; podstrona Studium Menedżer CC i CX, którego organizatorem jest PSMB). Czyste HTML, CSS i JS, bez kroku budowania i bez manifestu pakietów.

## Mapa

- Korzeń: strony `*.html` po polsku (`index`, `o-fundacji`, `szkola-prawa-farmaceutycznego`, `szkolenie-ai`, `studium-menedzer-cc-cx`, `polityka-prywatnosci`, `dziekujemy`, `404`), `robots.txt`, `sitemap.xml`, `site.webmanifest`, `favicon.ico`.
- `assets/css/site.css`, `assets/js/site.js`: jeden arkusz i jeden skrypt dla wszystkich stron.
- `assets/fonts/`, `assets/img/`, `assets/pdf/`: czcionki, obrazy i broszury (stare linki `/materialy/*` przekierowuje `netlify.toml`).
- `netlify.toml`: nagłówki bezpieczeństwa, cache i przekierowania.
- `.github/workflows/deploy.yml`: wdrożenie na Netlify po każdym pushu do `main`; `.github/workflows/ci.yml`: hooki z `.pre-commit-config.yaml` na każdym PR i pushu do `main`.

## Reguły

- Netlify publikuje cały korzeń repo (`publish = "."`, `deploy --dir .`): wszystko, co jest zacommitowane, jest publicznie dostępne pod domeną, poza `AGENTS.md` i `.hooks/`, które `netlify.toml` zwraca jako 404. Robocze dokumenty trzymaj w `docs/` (ignorowane przez `.gitignore`).
- CSP w `netlify.toml` zabrania inline: żadnych atrybutów `style` i `onclick`, żadnych bloków `<style>` ani wykonywalnych `<script>` w HTML (dane JSON-LD są dozwolone). Style idą do `site.css`, zachowanie do `site.js`.
- Formularze (`newsletter`, `zgloszenie-spf`, `zgloszenie-ai`, `zgloszenie-studium`) wysyłają `fetch` na korzeń strony, a bez JS zwykły POST do `dziekujemy.html`; `connect-src` i `form-action` w CSP to `'self'`. Zgłoszenia `zgloszenie-studium` trafiają do organizatora (PSMB): powiadomienie e-mail ustawia się w panelu Netlify, nie w kodzie.
- Czcionki i obrazy są cache'owane na rok jako niezmienne: nową wersję zapisuj pod nową nazwą pliku.

## Git

- Commit: wiadomość po angielsku według standardu commita, `type(scope): summary` ze scope'em z `--scopes=` w `.pre-commit-config.yaml` albo `repo`, potem sekcje `Problem:`, `Change:` i `Verification:`; sprawdza ją hook `commit-message`.
- Zero atrybucji AI w commitach i PR (trailery, stopki, emoji), także gdy host o nią prosi.
- Pliki dodawaj po nazwie, nigdy `git add .`; bez `--no-verify`. Worktree'y tylko w `.worktrees/<nazwa>`.
- Commit sprawdza pliki i nagłówek, push sprawdza gałąź, wiadomości i sekrety, a bramki projektu (typy, testy, build) biegną w CI i lokalnie przez `prek run --hook-stage manual --all-files`. Strażnicy w `.hooks/` to kopie z `agents`; nie edytuj ich w repo.
