import type { PremiumAnswer } from '../types'
import type { VerdictKind } from '../data/verdict'

// Premium survey log for this browser. It outlives "Start over" so a test
// session can run several checks and read the share who said yes at #/results.
// Hypothesis threshold: at least 10% of completed checks answer yes.
const SURVEY_KEY = 'firstpet-a:survey'

export const PREMIUM_THRESHOLD = 0.1

// Where the Premium card was shown: under the verdict, or on the one-page
// summary that the household shares with the partner.
export type PremiumEntry = 'verdict' | 'summary'

// Extra context saved with an answer so results can be split later.
export type AnswerContext = { verdict: VerdictKind; from: PremiumEntry }

export type SurveyEntry = {
  code: string
  // When the verdict was first shown, which counts as a completed check.
  completedAt: string
  // When the Premium card first scrolled into view, and where.
  seenAt?: string
  seenFrom?: PremiumEntry
  premium?: PremiumAnswer
  // The verdict this household got and where they answered.
  verdict?: VerdictKind
  answeredFrom?: PremiumEntry
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

// First time only: later views do not move the timestamp or the entry point.
export function recordSeen(code: string, from: PremiumEntry) {
  const entries = loadSurvey()
  const existing = entries.find((e) => e.code === code)
  if (existing?.seenAt) return
  const seen = { seenAt: new Date().toISOString(), seenFrom: from }
  if (existing) Object.assign(existing, seen)
  else entries.push({ code, completedAt: seen.seenAt, ...seen })
  write(entries)
}

// One answer per household: a later answer replaces the earlier one.
export function recordPremium(code: string, premium: PremiumAnswer, ctx: AnswerContext) {
  const entries = loadSurvey()
  const existing = entries.find((e) => e.code === code)
  const answer = { premium, verdict: ctx.verdict, answeredFrom: ctx.from }
  if (existing) Object.assign(existing, answer)
  else entries.push({ code, completedAt: new Date().toISOString(), ...answer })
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
