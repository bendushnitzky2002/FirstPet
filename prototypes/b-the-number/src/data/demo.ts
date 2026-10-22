import type { State } from '../types'

// Demo state for rehearsal and as a backup if the live flow breaks. Loaded by
// pressing "d" three times on the profile page. Two introductions are already
// decided, so the membership nudge shows on the introductions screen.
export function demoState(): State {
  const at = new Date().toISOString()
  return {
    decisions: {
      jordan: { kind: 'accepted', at },
      taylor: { kind: 'passed', at, reason: 'need-more', detail: 'Want to see their budget first' },
    },
    joins: [],
  }
}
