# CLAUDE.md

Context for every session working in this repo. Read this first.

## What this repo is

Prototypes for FirstPet's prototype assignment (Duke AIPI, PM Coding course). Three distinct, interactive, clickable prototypes, each embodying a different hypothesis and tied to a persona, live at a shared link and usable without a guided tour. Due Sunday Oct 25, 2026.

Team: Justin Winkler (CEO), Caleb McNeill (VP Dev), Sala Bozeman-Dean (VP Sales/Marketing), Ben Dushnitzky (VP Finance).

## Product summary

FirstPet is a readiness check for first-time pet adopters. You answer questions about your household (time, money, expectations), get a first-year cost for your ZIP code with an emergency cushion built in, build a care plan with names on it, and receive a verdict: **ready**, **ready once a few things change**, or **not yet**. Where the care plan has gaps, FirstPet points to vetted local pet care professionals.

Business model: owners never pay. Professionals pay an annual membership to be in the vetted network. Shelters are the main channel.

### Two hard rules (from customer discovery)

1. **The verdict can be "not yet."** Nobody else in the market will say that. Never soften it away.
2. **No paid ranking. The verdict is never for sale.** Membership gets a professional into the vetted network; it never changes a verdict, an order, or a recommendation.

## Personas

- **Priya and Marcus** (owners, the user). Suburban parents, two kids, first pet. Priya researches; Marcus is the skeptic who wants a number before he agrees. Pain: no local cost number, who does the daily work, too many opinions.
- **Vicky** (a local vet, stands in for pet care professionals, the payer). Pain: clients arrive unprepared and get surprised by costs. Her real problem is earning a new client's trust, not being found.
- **Carla** (a shelter adoption counselor, the partner and channel). Pain: adopters have not thought about cost or schedule until they are at the counter, and there is no follow-up before a return happens.

## Customer discovery findings

- Almost nobody will pay to help decide.
- One partner is usually the researcher and the other the skeptic, so one person must be able to start alone and invite the other.
- The surprise vet bill is the number one fear.
- Nobody trusted ChatGPT's national-average budget.
- People abandon tools that require an account before giving value. Give value before asking for anything.

## The three prototypes

| Path | Folder                         | Name             | Persona                                  | Draft hypothesis                                                                                                                                                                                    |
| ---- | ------------------------------ | ---------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/a` | `prototypes/a-shared-check`    | Shared Check     | Priya and Marcus                         | A couple will finish a readiness check together if one person can start alone, invite the other by link, and see their answers side by side before the verdict.                                     |
| `/b` | `prototypes/b-the-number`      | The Number       | Vicky's future clients (cost-first path) | Leading with a first-year local cost and emergency cushion, before any other questions, is what moves the skeptic from "no" to "ready once X changes."                                              |
| `/c` | `prototypes/c-shelter-handoff` | Shelter Hand-off | Carla                                    | Adopters will complete a readiness check when a shelter asks for it as step one of adoption, and a one-page readiness summary plus a week-two check-in is something a counselor would actually use. |

Hypotheses are drafts. The source of truth is `docs/hypotheses.md`. The three prototypes must be genuinely different products, not one product with a different color.

## Repo layout

```
packages/theme/          shared Tailwind preset, base.css, logo.png
prototypes/a-shared-check/   Vite + React + TS + Tailwind app, served at /a
prototypes/b-the-number/     served at /b
prototypes/c-shelter-handoff/ served at /c
site/                    plain HTML landing page, served at /
docs/                    hypotheses, scope cards, prompt logs, presentation, demo script
scripts/assemble-site.mjs   collects builds into _site/ for Pages
.github/workflows/deploy.yml  builds everything and deploys to GitHub Pages
```

## Visual system

Shared across all prototypes. Tokens live in `packages/theme/tailwind-preset.js`; every app uses it as a Tailwind preset and imports `@firstpet/theme/base.css`.

- **Fonts:** Nunito for headings (`font-heading`), Nunito Sans for body (`font-sans`, the default). Loaded from Google Fonts in each `index.html`.
- **Colors:**
  - navy `#1F2E4D` (`navy`): headings, primary text emphasis
  - teal `#1F9BA6` (`teal`): primary actions, links
  - orange `#F0A43C` (`orange`): accents, warnings, highlights
  - body gray `#3B475E` (`body`): body text
  - border `#DDE3E8` (`line`, also the default border color)
  - background `#FAFBF9` (`canvas`): page background
  - light teal `#E6F0EF` (`teal-light`)
  - peach `#FFF3E0` (`peach`)
- **Cards:** rounded with a thin `#DDE3E8` border. Use the `fp-card` class.
- **Icons:** in small teal or orange circles. Use `fp-icon-teal` or `fp-icon-orange` around an inline SVG.
- **Logo:** `packages/theme/logo.png`, imported as `@firstpet/theme/logo.png`. The committed file is a placeholder until the deck logo is dropped in.

## Coding rules

- TypeScript everywhere. Functional components only.
- Tailwind for styling, using the shared preset. No external UI kits (no MUI, Chakra, shadcn, etc).
- No backend, no auth, no database. State lives in memory or `localStorage` only.
- No fake backend calls: do not simulate network requests, loading spinners for fake APIs, or `fetch` to made-up endpoints. Read mock data directly.
- Mock data lives in `src/data/` of each app.
- Never fabricate statistics or quotes. If a number is a placeholder, label it as one in the UI and in code. Do not invent customer quotes or attribute words to real people.
- Use "we" in any copy.
- No em dashes anywhere in UI text or docs. Use a colon, comma, period, or parentheses instead.
- Each app must work as a static build served from a subpath (`/<repo>/a/` etc). Use relative asset imports, never hard-code `/` root paths. If you add routing, use hash routing so deep links work on GitHub Pages.
- Keep the three apps independent. Shared code goes in `packages/` only when it is truly shared (the theme today).
- Run `npm run build:all` before committing; it type-checks and builds every app.

## Prompt log rule

Every substantive prompt during prototype work gets appended to that prototype's prompt log (`docs/prompt-log/a.md`, `b.md`, or `c.md`) before the session ends: Date, Prompt (what we asked), Intent (what we were trying to learn or decide), Result (what we kept or changed). The assignment requires at least five entries per prototype. When a session works on a prototype, add the row as part of the same change.

## Commands

```
npm install          # once, from the repo root
npm run dev:a        # http://localhost:5173
npm run dev:b        # http://localhost:5174
npm run dev:c        # http://localhost:5175
npm run build:all    # type-check, build all three, assemble _site/
npm run format       # Prettier
```
