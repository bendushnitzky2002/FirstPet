import type { State } from '../types'

// Decisions and join clicks for this browser, so a test session survives a
// refresh and can be read back on #/log.
const KEY = 'firstpet-b-network'

export const emptyState = (): State => ({ decisions: {}, joins: [], requests: {} })

export function loadState(): State {
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? { ...emptyState(), ...(JSON.parse(raw) as State) } : emptyState()
  } catch {
    return emptyState()
  }
}

export function saveState(state: State) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Private mode or storage full: the demo still works for this visit.
  }
}
