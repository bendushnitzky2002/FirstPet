import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Built apps are served from a subpath on GitHub Pages:
//   https://<owner>.github.io/<repo>/a/
// PAGES_BASE is the repo prefix ("/FirstPet"); the deploy workflow sets it.
// Local dev runs at "/".
const pagesBase = process.env.PAGES_BASE ?? '/FirstPet'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? `${pagesBase}/a/` : '/',
  plugins: [react()],
}))
