import type { Check } from '../types'

// Each check is one localStorage entry keyed by its code. A second key points
// at the check this browser is working on, so a refresh lands in the same place.
const CHECK_PREFIX = 'firstpet-a:check:'
const CURRENT_KEY = 'firstpet-a:current'

// Letters and digits, minus the ones people misread (0/O, 1/I/L).
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function newCode(): string {
  let code = ''
  for (let i = 0; i < 6; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  return code
}

export function normalizeCode(raw: string): string {
  return raw
    .replace(/[^a-z0-9]/gi, '')
    .toUpperCase()
    .slice(0, 6)
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // Private mode or storage disabled: the check still works until a refresh.
  }
}

export function loadCheck(code: string): Check | null {
  const raw = read(CHECK_PREFIX + code)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Check
  } catch {
    return null
  }
}

export function saveCheck(check: Check) {
  write(CHECK_PREFIX + check.code, JSON.stringify(check))
  write(CURRENT_KEY, check.code)
}

export function loadCurrent(): Check | null {
  const code = read(CURRENT_KEY)
  return code ? loadCheck(code) : null
}

export function clearCheck(code?: string) {
  if (code) write(CHECK_PREFIX + code, null)
  write(CURRENT_KEY, null)
}

export function emptyCheck(): Check {
  return {
    code: newCode(),
    createdAt: new Date().toISOString(),
    step: 0,
    starter: { name: '', done: false },
    checked: [],
  }
}
