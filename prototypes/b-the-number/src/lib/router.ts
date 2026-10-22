import { useEffect, useState } from 'react'

// Hash routing so deep links work on GitHub Pages: #/number, #/tune, etc.
function parse(): string {
  return window.location.hash.replace(/^#/, '').split('?')[0] || '/'
}

export function useHashRoute(): string {
  const [path, setPath] = useState(parse)
  useEffect(() => {
    const onChange = () => {
      setPath(parse())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return path
}

export function navigate(to: string) {
  window.location.hash = to
}
