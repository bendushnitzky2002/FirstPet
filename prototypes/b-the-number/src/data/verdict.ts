import type { Check } from '../types'
import { firstYear, money, type FirstYear } from './costs'

// The verdict rules for The Number. Everything is money, because this
// prototype is about the number. Plain rules, visible here, no weighting.
//
// Terms:
//   monthly   ongoing care per month (vet, food, walker, sitter), no setup
//   room      what the household says it could put toward a pet each month
//   saved     what is already set aside for a surprise vet bill
//   gap       cushion minus saved (what is still missing from the cushion)
//
// We assume the household saves at its full monthly room until the cushion
// is there, then adopts. So months to the cushion = gap / room.
//
// NOT YET when either is true:
//   1. room covers less than half of monthly, or
//   2. the cushion would take more than a year to save (or room is $0 and
//      there is a gap).
// READY when room covers monthly and the cushion is already saved.
// READY ONCE A FEW THINGS CHANGE: everything else. We list each change with
// a dollar amount so the skeptic can see exactly what moves the answer.

export const MAX_MONTHS_TO_CUSHION = 12

export type VerdictKind = 'ready' | 'ready-once' | 'not-yet'

export type Verdict = {
  kind: VerdictKind
  number: FirstYear
  monthly: number
  room: number
  saved: number
  gap: number
  budgetGap: number
  monthsToCushion: number // Infinity when room is 0 and there is a gap
  reasons: string[] // plain language, why this verdict
  changes: string[] // what would move the answer, in dollars
}

export function decide(check: Check): Verdict {
  const { answers } = check
  const number = firstYear(check.zip, check.pet, answers)
  const { monthly } = number
  const room = answers.monthlyRoom
  const saved = answers.saved
  const gap = Math.max(0, number.cushion - saved)
  const budgetGap = Math.max(0, monthly - room)
  const monthsToCushion = gap === 0 ? 0 : room > 0 ? Math.ceil(gap / room) : Infinity

  const reasons: string[] = []
  const changes: string[] = []

  // What would change the answer. Same list for "ready once" and "not yet".
  if (gap > 0) {
    changes.push(
      room > 0
        ? `Set aside ${money(gap)} more for the cushion. At ${money(room)} a month, that is about ${monthsToCushion} ${monthsToCushion === 1 ? 'month' : 'months'}.`
        : `Set aside ${money(gap)} more for the cushion before the pet comes home.`,
    )
  }
  if (budgetGap > 0) {
    changes.push(`Find ${money(budgetGap)} more a month, or bring a cost down.`)
    if (number.walker > 0) {
      changes.push(
        `The midday walker is about ${money(number.walker / 12)} a month. A neighbor, a shift change, or a shorter day alone could cover it.`,
      )
    }
    if (number.sitter > 0) {
      changes.push(
        `The overnight sitter is about ${money(number.sitter / 12)} a month. Fewer nights away, or a friend who will cover, brings it down.`,
      )
    }
  }

  const tooThin = room < monthly / 2
  const cushionTooFar = monthsToCushion > MAX_MONTHS_TO_CUSHION

  if (tooThin || cushionTooFar) {
    if (tooThin) {
      reasons.push(
        `You could put ${money(room)} a month toward a pet. Care here runs about ${money(monthly)} a month, so that covers less than half.`,
      )
    }
    if (cushionTooFar) {
      reasons.push(
        room > 0
          ? `The ${money(number.cushion)} cushion would take about ${monthsToCushion} months to save. We want it there before day one.`
          : `There is nothing left each month to build the ${money(number.cushion)} cushion, and we want it there before day one.`,
      )
    }
    return {
      kind: 'not-yet',
      number,
      monthly,
      room,
      saved,
      gap,
      budgetGap,
      monthsToCushion,
      reasons,
      changes,
    }
  }

  if (gap === 0 && budgetGap === 0) {
    reasons.push(`Your ${money(room)} a month covers the ${money(monthly)} a month care runs here.`)
    reasons.push(`The ${money(number.cushion)} cushion is already set aside.`)
    return {
      kind: 'ready',
      number,
      monthly,
      room,
      saved,
      gap,
      budgetGap,
      monthsToCushion,
      reasons,
      changes,
    }
  }

  if (budgetGap === 0) {
    reasons.push(`Your ${money(room)} a month covers the ${money(monthly)} a month care runs here.`)
  } else {
    reasons.push(
      `Care here runs about ${money(monthly)} a month. You are ${money(budgetGap)} short of that.`,
    )
  }
  if (gap > 0) {
    reasons.push(`The cushion is ${money(number.cushion)}. You have ${money(saved)} of it today.`)
  } else {
    reasons.push(`The ${money(number.cushion)} cushion is already set aside.`)
  }
  return {
    kind: 'ready-once',
    number,
    monthly,
    room,
    saved,
    gap,
    budgetGap,
    monthsToCushion,
    reasons,
    changes,
  }
}

export const VERDICT_COPY: Record<VerdictKind, { title: string; sub: string }> = {
  ready: { title: 'Ready', sub: 'The numbers work for your household.' },
  'ready-once': {
    title: 'Ready once a few things change',
    sub: 'You are close. Here is exactly what moves the answer.',
  },
  'not-yet': {
    title: 'Not yet',
    sub: 'Not yet is not never. Here is what would change the answer.',
  },
}
