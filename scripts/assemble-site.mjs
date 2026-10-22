// Collects the landing page and the three app builds into _site/ for GitHub Pages.
// Layout: _site/ (landing), _site/a, _site/b, _site/c
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, '_site')

const apps = [
  { dir: 'prototypes/a-shared-check', path: 'a', persona: 'Priya' },
  { dir: 'prototypes/b-the-number', path: 'b', persona: 'Dana' },
  { dir: 'prototypes/c-shelter-handoff', path: 'c', persona: 'Carla' },
]

// A small "switch persona" link added to every app page so testers can get back to the
// persona chooser. Added here (not in each app) so the three apps stay independent.
// Plain HTML with inline styles so it does not depend on any app's CSS. Hidden when printing.
const switchLink = (persona) => `
<a href="../" class="fp-switch-persona" style="position:fixed;right:16px;bottom:16px;z-index:50;display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;background:#fff;border:1px solid #dde3e9;box-shadow:0 8px 24px rgba(20,45,78,.14);font:700 13px/1.2 'DM Sans',system-ui,sans-serif;color:#142d4e;text-decoration:none">
  <span aria-hidden="true" style="color:#f47b35">&larr;</span> Testing as ${persona}: switch persona
</a>
<style>body{padding-bottom:64px}@media print{.fp-switch-persona{display:none!important}body{padding-bottom:0}}</style>
`

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })

cpSync(join(root, 'site'), out, { recursive: true })
cpSync(join(root, 'packages/theme/logo.png'), join(out, 'logo.png'))

for (const app of apps) {
  const dist = join(root, app.dir, 'dist')
  if (!existsSync(dist)) {
    throw new Error(`Missing build output: ${dist}. Run the app build first.`)
  }
  cpSync(dist, join(out, app.path), { recursive: true })

  const page = join(out, app.path, 'index.html')
  const html = readFileSync(page, 'utf8')
  if (!html.includes('</body>')) throw new Error(`No </body> in ${page}`)
  writeFileSync(page, html.replace('</body>', `${switchLink(app.persona)}</body>`))
}

// Tell GitHub Pages not to run Jekyll over the output.
writeFileSync(join(out, '.nojekyll'), '')

console.log(`Assembled site in ${out}`)
