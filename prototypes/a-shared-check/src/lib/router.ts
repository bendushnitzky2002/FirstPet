import { useEffect, useState } from 'react'

// Hash routing so deep links work on GitHub Pages: #/check, #/compare, etc.
export type Route = { path: string; params: URLSearchParams }

function parse(): Route {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [path, query = ''] = raw.split('?')
  return { path: path || '/', params: new URLSearchParams(query) }
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const onChange = () => {
      setRoute(parse())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export function navigate(to: string) {
  window.location.hash = to
}

// The app URL with no hash or query, used to build the partner's invite link.
export function appUrl(): string {
  return window.location.origin + window.location.pathname
}

// Partner entry: /?code=XXXXXX. Move the code into the hash route so the
// query string does not stick around and a refresh keeps working.
export function consumeInviteCode() {
  const code = new URLSearchParams(window.location.search).get('code')
  if (!code) return
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}#/join?code=${encodeURIComponent(code)}`,
  )
}
