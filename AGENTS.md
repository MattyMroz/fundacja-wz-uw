# fundacja-wz-uw

Statyczna strona Fundacji na rzecz Wydziału Zarządzania UW (Centrum Edukacji: Szkoła Prawa Farmaceutycznego, szkolenie AI; podstrona Studium Menedżer CC i CX, którego organizatorem jest PSMB). Czyste HTML, CSS i JS, bez kroku budowania i bez manifestu pakietów.

## Mapa

- Korzeń: strony `*.html` po polsku (`index`, `o-fundacji`, `szkola-prawa-farmaceutycznego`, `szkolenie-ai`, `studium-menedzer-cc-cx`, `polityka-prywatnosci`, `dziekujemy`, `404`), `robots.txt`, `sitemap.xml`, `site.webmanifest`, `favicon.ico`.
- `assets/css/site.css`, `assets/js/site.js`: jeden arkusz i jeden skrypt dla wszystkich stron.
- `assets/fonts/`, `assets/img/`, `assets/pdf/`: czcionki, obrazy i broszury (stare linki `/materialy/*` przekierowuje `netlify.toml`).
- `netlify.toml`: nagłówki bezpieczeństwa, cache i przekierowania.
- `.github/workflows/deploy.yml`: wdrożenie na Netlify po każdym pushu do `main`.

## Reguły

- Netlify publikuje cały korzeń repo (`publish = "."`, `deploy --dir .`): wszystko, co jest zacommitowane, jest publicznie dostępne pod domeną, poza `AGENTS.md`, który `netlify.toml` zwraca jako 404. Robocze dokumenty trzymaj w `docs/` (ignorowane przez `.gitignore`).
- CSP w `netlify.toml` zabrania inline: żadnych atrybutów `style` i `onclick`, żadnych bloków `<style>` ani wykonywalnych `<script>` w HTML (dane JSON-LD są dozwolone). Style idą do `site.css`, zachowanie do `site.js`.
- Formularze (`newsletter`, `zgloszenie-spf`, `zgloszenie-ai`, `zgloszenie-studium`) wysyłają `fetch` na korzeń strony, a bez JS zwykły POST do `dziekujemy.html`; `connect-src` i `form-action` w CSP to `'self'`. Zgłoszenia `zgloszenie-studium` trafiają do organizatora (PSMB): powiadomienie e-mail ustawia się w panelu Netlify, nie w kodzie.
- Czcionki i obrazy są cache'owane na rok jako niezmienne: nową wersję zapisuj pod nową nazwą pliku.

## Git

- Commit: nagłówek Conventional Commits po angielsku, `type(scope): opis`, ze scope'em z listy w `.pre-commit-config.yaml`; po pustej linii streszczenie „co i dlaczego”; potem sekcja `Validation:` z kontrolami uruchomionymi na finalnym indeksie. Format: https://github.com/MattyMroz/agents/blob/main/presets/hooks/references/commit-message.md
- Kontrole uruchamiaj przez `mm-validate run "<kontrola>" -- <komenda>`, blok `Validation:` bierz z `mm-validate list`. Hooki `conventional-pre-commit` i `commit-validation` odrzucą inny commit.
- Pliki dodawaj po nazwie, nigdy `git add .`; bez `--no-verify`. Worktree'y tylko w `.worktrees/<nazwa>`.
