import type { Answers, Check, Pet } from '../types'

// One check per browser, saved so the demo survives a refresh.
const KEY = 'firstpet-b-check'

// Where the levers start on the tune screen. Shown as "our guess" until moved.
export const DEFAULT_ANSWERS: Answers = {
  hoursAway: 4,
  overnights: '0',
  saved: 0,
  monthlyRoom: 150,
}

export function newCheck(zip: string, pet: Pet): Check {
  return { zip, pet, answers: { ...DEFAULT_ANSWERS }, touched: [] }
}

export function loadCheck(): Check | null {
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Check) : null
  } catch {
    return null
  }
}

export function saveCheck(check: Check) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(check))
  } catch {
    // Private mode or storage full: the check still works for this visit.
  }
}

export function clearCheck() {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    // Nothing to clear.
  }
}
