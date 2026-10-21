import { useEffect, useState } from 'react'

// Hash routing so deep links work on GitHub Pages: #/start, #/counselor, etc.
export type Route = { path: string; parts: string[] }

function parse(): Route {
  const path = window.location.hash.replace(/^#/, '').split('?')[0] || '/'
  return { path, parts: path.split('/').filter(Boolean) }
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

// A full link to a route in this app, for the counter link and check-in links.
export function linkTo(path: string): string {
  return `${window.location.origin}${window.location.pathname}#${path}`
}
