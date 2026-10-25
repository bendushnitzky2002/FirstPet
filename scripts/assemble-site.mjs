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

// A small bar added to every app page: "Reset demo" and a "switch persona" link back to the
// persona chooser. Added here (not in each app) so the three apps stay independent.
// Plain HTML with inline styles so it does not depend on any app's CSS. Hidden when printing.
// Reset demo clears only this app's localStorage keys (all start with "firstpet-<path>"),
// which covers decisions, check answers, and the fake door clicks and answers, then reloads
// the app at its start. The first click asks for a second click so a stray tap mid-demo
// does not wipe anything.
const chip =
  "display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;background:#fff;border:1px solid #dde3e9;box-shadow:0 8px 24px rgba(20,45,78,.14);font:700 13px/1.2 'DM Sans',system-ui,sans-serif;color:#142d4e;text-decoration:none;cursor:pointer"
const demoBar = (app) => `
<div class="fp-demo-bar" style="position:fixed;right:16px;bottom:16px;z-index:50;display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px">
  <button type="button" id="fp-reset-demo" style="${chip}" title="Clear what this browser saved for this prototype and start over">
    <span aria-hidden="true" style="color:#168c91">&#8634;</span> <span>Reset demo</span>
  </button>
  <a href="../" style="${chip}">
    <span aria-hidden="true" style="color:#f47b35">&larr;</span> Testing as ${app.persona}: switch persona
  </a>
</div>
<style>body{padding-bottom:64px}@media (max-width:480px){body{padding-bottom:112px}}@media print{.fp-demo-bar{display:none!important}body{padding-bottom:0}}</style>
<script>
(function () {
  var btn = document.getElementById('fp-reset-demo')
  var label = btn.lastElementChild
  var timer
  btn.addEventListener('click', function () {
    if (!btn.dataset.armed) {
      btn.dataset.armed = '1'
      label.textContent = 'Click again to reset'
      btn.style.borderColor = '#f47b35'
      timer = setTimeout(function () {
        delete btn.dataset.armed
        label.textContent = 'Reset demo'
        btn.style.borderColor = '#dde3e9'
      }, 4000)
      return
    }
    clearTimeout(timer)
    try {
      for (var i = localStorage.length - 1; i >= 0; i--) {
        var key = localStorage.key(i)
        if (key && key.indexOf('firstpet-${app.path}') === 0) localStorage.removeItem(key)
      }
    } catch (e) {}
    location.replace(location.pathname)
  })
})()
</script>
`

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })

cpSync(join(root, 'site'), out, { recursive: true })
for (const file of ['logo.png', 'favicon.png', 'apple-touch-icon.png']) {
  cpSync(join(root, 'packages/theme', file), join(out, file))
}

for (const app of apps) {
  const dist = join(root, app.dir, 'dist')
  if (!existsSync(dist)) {
    throw new Error(`Missing build output: ${dist}. Run the app build first.`)
  }
  cpSync(dist, join(out, app.path), { recursive: true })

  const page = join(out, app.path, 'index.html')
  const html = readFileSync(page, 'utf8')
  if (!html.includes('</body>')) throw new Error(`No </body> in ${page}`)
  writeFileSync(page, html.replace('</body>', `${demoBar(app)}</body>`))
}

// Tell GitHub Pages not to run Jekyll over the output.
writeFileSync(join(out, '.nojekyll'), '')

console.log(`Assembled site in ${out}`)
