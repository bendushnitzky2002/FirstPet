import type { Applicant } from '../types'
import { getPet } from './shelter'

// Week-two check-in rules. The check-in compares what the adopter planned in
// the readiness check with what is happening now, and tells the counselor who
// to reach out to first. The goal is to catch a likely return early.

export const CHECKIN_AFTER_DAYS = 14
const DAY = 24 * 60 * 60 * 1000

// How many more hours alone than planned counts as a change worth a call.
const HOURS_DRIFT_FOR_CALL = 2

export type CheckInStatus =
  'call' | 'message' | 'followed' | 'well' | 'due' | 'upcoming' | 'not-adopted'

export const statusLabel: Record<CheckInStatus, string> = {
  call: 'Call this week',
  message: 'Send a note',
  followed: 'Followed up',
  well: 'Doing well',
  due: 'Waiting for reply',
  upcoming: 'Scheduled',
  'not-adopted': 'Not adopted yet',
}

export function checkInDue(a: Applicant): Date | undefined {
  if (!a.adoptedAt) return undefined
  return new Date(new Date(a.adoptedAt).getTime() + CHECKIN_AFTER_DAYS * DAY)
}

export type CheckInReview = { status: CheckInStatus; reasons: string[] }

export function reviewCheckIn(a: Applicant, now = new Date()): CheckInReview {
  if (!a.adoptedAt) return { status: 'not-adopted', reasons: [] }
  const c = a.checkIn
  if (!c) {
    const due = checkInDue(a)!
    return due <= now ? { status: 'due', reasons: [] } : { status: 'upcoming', reasons: [] }
  }

  const pet = getPet(a.petId)
  const call: string[] = []
  const message: string[] = []

  // Call this week: any thought of returning, a hard start, or alone time well over plan.
  if (c.returnThought === "It's crossed my mind")
    call.push(`Returning ${pet.name} has crossed their mind`)
  if (c.returnThought === "Yes, we're thinking about it")
    call.push(`Thinking about returning ${pet.name}`)
  if (c.going === 'Harder than we expected') call.push('Says it is harder than they expected')
  const drift = c.hoursAlone - a.answers.hoursAlone
  if (drift >= HOURS_DRIFT_FOR_CALL)
    call.push(`Alone ${c.hoursAlone} hours a day, planned ${a.answers.hoursAlone}`)

  // Send a note: smaller signals worth a message.
  if (c.going === 'Some bumps') message.push('Some bumps settling in')
  if (c.surpriseCost === '$200 or more') message.push('Surprise costs of $200 or more')
  if (c.careHolding !== 'Yes, as planned')
    message.push(`Daily care plan (${a.answers.dailyCare}): ${c.careHolding.toLowerCase()}`)
  if (c.helpWith.length) message.push(`Asked for help with: ${c.helpWith.join(', ').toLowerCase()}`)

  // Once the counselor has followed up, the flag stays visible but stops asking for action.
  const done = a.followedUp ? 'followed' : undefined
  if (call.length) return { status: done ?? 'call', reasons: [...call, ...message] }
  if (message.length) return { status: done ?? 'message', reasons: message }
  return { status: 'well', reasons: ['Settling in well and the plan is holding'] }
}

export function daysUntil(d: Date, now = new Date()): number {
  return Math.ceil((d.getTime() - now.getTime()) / DAY)
}
