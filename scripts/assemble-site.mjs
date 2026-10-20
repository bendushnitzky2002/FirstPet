// Collects the landing page and the three app builds into _site/ for GitHub Pages.
// Layout: _site/ (landing), _site/a, _site/b, _site/c
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, '_site')

const apps = [
  { dir: 'prototypes/a-shared-check', path: 'a' },
  { dir: 'prototypes/b-the-number', path: 'b' },
  { dir: 'prototypes/c-shelter-handoff', path: 'c' },
]

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
}

// Tell GitHub Pages not to run Jekyll over the output.
writeFileSync(join(out, '.nojekyll'), '')

console.log(`Assembled site in ${out}`)
