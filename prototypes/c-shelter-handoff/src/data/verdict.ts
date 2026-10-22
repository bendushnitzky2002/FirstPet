import type { Answers } from '../types'
import { firstYearCost, money } from './costs'
import type { Pet } from './shelter'

// Verdict rules for the shelter readiness check. They are deliberately simple
// and visible so a counselor can see why an adopter got their result. The
// verdict is about this household and this pet. It is never a placement
// decision: the counselor and the adopter decide together.

export type VerdictKind = 'ready' | 'ready-once' | 'not-yet'

export const verdictLabel: Record<VerdictKind, string> = {
  ready: 'Ready',
  'ready-once': 'Ready once a few things change',
  'not-yet': 'Not yet',
}

export type Verdict = {
  kind: VerdictKind
  // Plain-language reasons, written to the adopter.
  reasons: string[]
  // Things that would change the result, written as a checklist.
  checklist: string[]
  // What the counselor should raise at the counter.
  talkingPoints: string[]
}

// How far past the pet's limit on hours alone turns "ready once" into "not yet".
const HOURS_OVER_LIMIT_FOR_NOT_YET = 4

export function decideVerdict(a: Answers, pet: Pet): Verdict {
  const cost = firstYearCost(pet)
  const reasons: string[] = []
  const checklist: string[] = []
  const talkingPoints: string[] = []
  const hoursOver = a.hoursAlone - pet.maxHoursAlone

  // Rule 1, not yet: a $1,500 vet bill is not possible right now.
  const cantCoverVet = a.vetBill === 'Not possible right now'
  if (cantCoverVet) {
    reasons.push(
      `A $1,500 vet bill isn't possible right now. Emergencies happen in year one, and ${pet.name} would need that care.`,
    )
    checklist.push(`Build a ${money(cost.cushion)} emergency cushion`)
    talkingPoints.push(
      'Said a $1,500 vet bill is not possible right now. Ask what would change that.',
    )
  } else if (a.vetBill === 'Tight but doable') {
    reasons.push('A $1,500 vet bill would be tight.')
    checklist.push(`Set aside the ${money(cost.cushion)} cushion before ${pet.name} comes home`)
    talkingPoints.push('Vet bill would be tight. Walk through the cushion line together.')
  } else {
    reasons.push('You could cover a surprise vet bill.')
  }

  // Rule 2, not yet: far more hours alone than this pet can handle.
  const farTooLong = hoursOver > HOURS_OVER_LIMIT_FOR_NOT_YET
  if (hoursOver > 0) {
    reasons.push(
      `${pet.name} does best with ${pet.maxHoursAlone} hours alone or less. You said about ${a.hoursAlone}.`,
    )
    checklist.push(`Plan a midday break so ${pet.name} is alone ${pet.maxHoursAlone} hours or less`)
    talkingPoints.push(
      `Weekday alone time is ${a.hoursAlone} hours; ${pet.name}'s limit is ${pet.maxHoursAlone}. Ask who could come home at midday.`,
    )
  } else {
    reasons.push(`Your weekday schedule fits ${pet.name}.`)
  }

  // Rule 3, ready once: the landlord hasn't said yes yet.
  if (a.home === "We rent, and haven't asked yet") {
    reasons.push("Your landlord hasn't said yes yet.")
    checklist.push("Get your landlord's yes in writing")
    talkingPoints.push('Renting and has not asked the landlord. Ask them to get a yes in writing.')
  }

  // Rule 4, ready once: no backup when they travel.
  if (a.backup === 'No plan yet') {
    reasons.push(`There's no plan yet for who looks after ${pet.name} when you travel.`)
    checklist.push(`Name who looks after ${pet.name} when you travel`)
    talkingPoints.push('No backup care for trips yet. Ask about family, friends, or a sitter.')
  }

  // Worries do not change the verdict. They become talking points.
  for (const w of a.worries) talkingPoints.push(worryPoint[w])

  let kind: VerdictKind
  if (cantCoverVet || farTooLong) kind = 'not-yet'
  else if (checklist.length === 0) kind = 'ready'
  else kind = 'ready-once'

  return { kind, reasons, checklist, talkingPoints }
}

const worryPoint: Record<Answers['worries'][number], string> = {
  'The cost': 'Worried about cost. Go over the first-year number line by line.',
  'Having enough time': 'Worried about time. Ask what a normal weekday looks like.',
  'How the kids will do': 'Worried about the kids. Plan how the kids meet the pet.',
  "My partner isn't sure": "Partner isn't sure yet. Invite them to the meet and greet.",
  "I don't know where to start":
    "Doesn't know where to start. Walk through the first week together.",
}
