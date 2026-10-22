import type { PremiumAnswer } from '../types'

// Premium survey log for this browser. It outlives "Start over" so a test
// session can run several checks and read the share who said yes at #/results.
// Hypothesis threshold: at least 10% of completed checks answer yes.
const SURVEY_KEY = 'firstpet-a:survey'

export const PREMIUM_THRESHOLD = 0.1

export type SurveyEntry = {
  code: string
  // When the verdict was first shown, which counts as a completed check.
  completedAt: string
  premium?: PremiumAnswer
  worthIt?: string
}

export function loadSurvey(): SurveyEntry[] {
  try {
    return JSON.parse(localStorage.getItem(SURVEY_KEY) ?? '[]') as SurveyEntry[]
  } catch {
    return []
  }
}

function write(entries: SurveyEntry[]) {
  try {
    localStorage.setItem(SURVEY_KEY, JSON.stringify(entries))
  } catch {
    // Storage disabled: the answer still shows on screen.
  }
}

export function recordCompleted(code: string) {
  const entries = loadSurvey()
  if (entries.some((e) => e.code === code)) return
  write([...entries, { code, completedAt: new Date().toISOString() }])
}

export function recordPremium(code: string, premium: PremiumAnswer) {
  const entries = loadSurvey()
  const existing = entries.find((e) => e.code === code)
  if (existing) existing.premium = premium
  else entries.push({ code, completedAt: new Date().toISOString(), premium })
  write(entries)
}

export function recordWorthIt(code: string, worthIt: string) {
  const entries = loadSurvey()
  const existing = entries.find((e) => e.code === code)
  if (existing) existing.worthIt = worthIt
  else entries.push({ code, completedAt: new Date().toISOString(), worthIt })
  write(entries)
}

export function clearSurvey() {
  write([])
}
