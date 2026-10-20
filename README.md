# FirstPet Prototypes

FirstPet is a readiness check for first-time pet adopters. This repo holds our three clickable prototypes for the Duke AIPI PM Coding course prototype assignment, plus a landing page that links to them. Each prototype tests a different hypothesis with a different persona. See [CLAUDE.md](CLAUDE.md) for full product context and rules, and [docs/hypotheses.md](docs/hypotheses.md) for the hypotheses.

## Links

Placeholders until GitHub Pages is live.

| Page                                   | Link                                  |
| -------------------------------------- | ------------------------------------- |
| Landing page                           | https://dushben.github.io/FirstPet/   |
| A: Shared Check (Priya and Marcus)     | https://dushben.github.io/FirstPet/a/ |
| B: The Number (Vicky's future clients) | https://dushben.github.io/FirstPet/b/ |
| C: Shelter Hand-off (Carla)            | https://dushben.github.io/FirstPet/c/ |

## Run locally

Requires Node 22 (see `.nvmrc`; with nvm, run `nvm use`).

```
npm install
npm run dev:a    # Shared Check at http://localhost:5173
npm run dev:b    # The Number at http://localhost:5174
npm run dev:c    # Shelter Hand-off at http://localhost:5175
```

To build everything the way Pages will serve it:

```
npm run build:all    # outputs _site/
```

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds all three apps and the landing page and publishes them to GitHub Pages at `/`, `/a`, `/b`, and `/c`. You can also run it by hand from the Actions tab ("Deploy to GitHub Pages", then "Run workflow").

### Enable GitHub Pages (one time)

1. Make sure the default branch is named `main` (Settings, then General, then Default branch). Rename it if needed.
2. In the repo on GitHub, open **Settings**, then **Pages** (left sidebar, under "Code and automation").
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Open the **Actions** tab, choose **Deploy to GitHub Pages**, and click **Run workflow** on `main` (or push any commit to `main`).
5. When the run finishes, the site URL appears on the run summary and in Settings, then Pages. Update the links table above if it differs.

If the repo is private, Pages requires a paid GitHub plan; otherwise make the repo public.

## Repo layout

```
packages/theme/              shared Tailwind preset, base styles, logo
prototypes/a-shared-check/   Prototype A
prototypes/b-the-number/     Prototype B
prototypes/c-shelter-handoff/  Prototype C
site/                        landing page
docs/                        hypotheses, scope cards, prompt logs, presentation outline, demo script
```

## Who owns what

| Area                          | Owner |
| ----------------------------- | ----- |
| Prototype A: Shared Check     |       |
| Prototype B: The Number       |       |
| Prototype C: Shelter Hand-off |       |
| Landing page and deploy       |       |
| Hypotheses and scope cards    |       |
| Prompt logs                   |       |
| Presentation and demo script  |       |
