import type { Check, Person, Worry } from '../types'
import { firstYear, money } from './costs'
import { hoursLabel, overnightOption, vetOption, worryOption } from './questions'

// ---------------------------------------------------------------------------
// Side by side rules
// ---------------------------------------------------------------------------

// Weekday hours count as a match when the two answers are this close.
// Exact matches on a 0 to 12 slider are rare, and a 1 or 2 hour gap is not
// worth a conversation.
export const HOURS_MATCH_WINDOW = 2

export type RowStatus = 'match' | 'differ' | 'waiting' | 'solo'

export type CompareRow = {
  id: 'hours' | 'overnights' | 'vet' | 'worries'
  label: string
  a: string
  b?: string
  status: RowStatus
  nudge?: string
}

const worriesText = (w: Worry[] = []) =>
  w.length ? w.map((x) => worryOption(x).label).join(', ') : 'Nothing picked'

export function partnerAnswered(check: Check): boolean {
  return !!check.partner?.done
}

export function compareRows(check: Check): CompareRow[] {
  const a = check.starter
  const b = check.partner?.done ? check.partner : undefined
  const pending: RowStatus = check.deciding === 'solo' ? 'solo' : 'waiting'
  const A = a.name
  const B = b?.name ?? ''

  const ha = a.hoursAlone ?? 0
  const oa = overnightOption(a.overnights ?? 'none')
  const va = vetOption(a.vetCost ?? 'fine')

  const rows: CompareRow[] = [
    { id: 'hours', label: 'Weekday hours nobody is home', a: hoursLabel(ha), status: pending },
    { id: 'overnights', label: 'Nights away each month', a: oa.label, status: pending },
    { id: 'vet', label: 'A $1,500 vet bill tomorrow', a: va.label, status: pending },
    { id: 'worries', label: 'Biggest worries', a: worriesText(a.worries), status: pending },
  ]
  if (!b) return rows

  const hb = b.hoursAlone ?? 0
  const ob = overnightOption(b.overnights ?? 'none')
  const vb = vetOption(b.vetCost ?? 'fine')
  const wa = a.worries ?? []
  const wb = b.worries ?? []

  // Weekday hours
  rows[0].b = hoursLabel(hb)
  if (Math.abs(ha - hb) <= HOURS_MATCH_WINDOW) rows[0].status = 'match'
  else {
    rows[0].status = 'differ'
    rows[0].nudge = `${A} sees ${ha} hours alone on weekdays, ${B} sees ${hb}. Who's home at lunch?`
  }

  // Nights away: must be the same answer
  rows[1].b = ob.label
  if (oa.value === ob.value) rows[1].status = 'match'
  else {
    rows[1].status = 'differ'
    rows[1].nudge = `${A} counts ${oa.phrase} away a month, ${B} counts ${ob.phrase}. Who covers those nights?`
  }

  // $1,500 vet bill: must be the same answer
  rows[2].b = vb.label
  if (va.value === vb.value) rows[2].status = 'match'
  else {
    rows[2].status = 'differ'
    rows[2].nudge = `${A} says a $1,500 bill would be ${va.phrase}, ${B} says ${vb.phrase}. Where would that money come from?`
  }

  // Worries: match only when both picked the same set
  rows[3].b = worriesText(wb)
  const onlyA = wa.filter((w) => !wb.includes(w))
  const onlyB = wb.filter((w) => !wa.includes(w))
  if (!onlyA.length && !onlyB.length) rows[3].status = 'match'
  else {
    rows[3].status = 'differ'
    const [who, worry] = onlyB.length ? [B, onlyB[0]] : [A, onlyA[0]]
    rows[3].nudge = `Only ${who} picked ${worryOption(worry).phrase}. Ask what's behind it.`
  }

  return rows
}

// ---------------------------------------------------------------------------
// Verdict rules
// ---------------------------------------------------------------------------
//
// The rules use everyone who has answered: the starter, plus the partner once
// they finish. A preview without the partner, or a "Just me" check, runs the
// same rules on one person.
//
// 1. NOT YET when either:
//    a. anyone answered "Not possible right now" to the $1,500 vet bill, or
//    b. everyone answered "More than 8" nights away a month.
// 2. READY when all of:
//    a. everyone answered "Fine" to the $1,500 vet bill,
//    b. everyone has fewer than 8 weekday hours with nobody home,
//    c. nobody disagrees on nights away (same answer for both).
// 3. READY ONCE A FEW THINGS CHANGE in every other case. Each rule from step 2
//    that failed becomes one checklist item.

export const LONG_DAY_HOURS = 8

export type VerdictKind = 'ready' | 'ready-once' | 'not-yet'

export type TodoItem = { id: string; text: string }

export type Verdict = {
  kind: VerdictKind
  title: string
  summary: string
  reasons: string[]
  todo: TodoItem[]
  todoTitle: string
  basedOnOne: boolean
}

const names = (people: Person[]) => people.map((p) => p.name).join(' and ')

export function getVerdict(check: Check): Verdict {
  const people = [check.starter, ...(check.partner?.done ? [check.partner] : [])]
  const two = people.length === 2
  const basedOnOne = check.deciding !== 'solo' && !two
  const cost = firstYear(check)
  const isDog = cost.basis === 'dog'

  // Rule 1: not yet
  const cantCover = people.filter((p) => p.vetCost === 'not-possible')
  const allAwayMany = people.every((p) => p.overnights === 'many')
  if (cantCover.length || allAwayMany) {
    const reasons: string[] = []
    const todo: TodoItem[] = []
    if (cantCover.length) {
      reasons.push(
        `${two ? names(cantCover) : 'You'} said a $1,500 vet bill is not possible right now. The emergency cushion is required, so we can't say ready yet.`,
      )
      todo.push({ id: 'build-cushion', text: `Build the ${money(cost.cushion)} cushion first` })
    }
    if (allAwayMany) {
      reasons.push(
        `${two ? 'You both' : 'You'} said nobody is home more than 8 nights a month. A first pet needs someone home most nights.`,
      )
      todo.push({
        id: 'fewer-nights',
        text: 'Get nights away down to 8 or fewer a month, or line up a regular sitter',
      })
    }
    return {
      kind: 'not-yet',
      title: 'Not yet',
      summary: "That's a real answer, and a useful one. Here's what would change it.",
      reasons,
      todo,
      todoTitle: 'What would change this',
      basedOnOne,
    }
  }

  // Rule 2: ready, unless one of these fails
  const tight = people.filter((p) => p.vetCost !== 'fine')
  const longDays = people.filter((p) => (p.hoursAlone ?? 0) >= LONG_DAY_HOURS)
  const nightsDiffer = two && people[0].overnights !== people[1].overnights

  if (!tight.length && !longDays.length && !nightsDiffer) {
    const you = two ? 'You both' : 'You'
    return {
      kind: 'ready',
      title: 'Ready',
      summary: two
        ? 'Your household has the time, the cushion, and a shared picture of the year.'
        : 'From your answers, you have the time and the cushion.',
      reasons: [
        `${you} said a $1,500 vet bill would be fine. Keep the ${money(cost.cushion)} cushion set aside anyway.`,
        `The pet would be alone fewer than ${LONG_DAY_HOURS} hours on a normal weekday.`,
        two
          ? `You agree on nights away: ${overnightOption(people[0].overnights ?? 'none').phrase} a month.`
          : `You expect ${overnightOption(people[0].overnights ?? 'none').phrase} away a month.`,
      ],
      todo: [],
      todoTitle: '',
      basedOnOne,
    }
  }

  // Rule 3: ready once a few things change
  const reasons: string[] = []
  const todo: TodoItem[] = []
  if (tight.length) {
    reasons.push(`${two ? names(tight) : 'You'} said a $1,500 vet bill would be tight.`)
    todo.push({ id: 'cushion', text: `Set aside the ${money(cost.cushion)} cushion` })
  }
  if (longDays.length) {
    const who = longDays.map((p) => `${p.name} counts ${p.hoursAlone}`).join(', ')
    reasons.push(`Some weekdays are long: ${who} hours with nobody home.`)
    todo.push({
      id: 'weekdays',
      text: isDog
        ? `Agree on who covers the long weekdays, or budget for a walker (${money(cost.sitterPerDay)} a day here)`
        : 'Agree on who checks in on the long weekdays',
    })
  }
  if (nightsDiffer) {
    const [a, b] = people
    reasons.push(
      `You see nights away differently: ${a.name} says ${overnightOption(a.overnights ?? 'none').phrase}, ${b.name} says ${overnightOption(b.overnights ?? 'none').phrase}.`,
    )
    todo.push({
      id: 'overnights',
      text: 'Agree on how many nights you are away, and who covers them',
    })
  }
  return {
    kind: 'ready-once',
    title: 'Ready once a few things change',
    summary: `${two ? 'You are' : 'You look'} close. Here is what to sort out first.`,
    reasons,
    todo,
    todoTitle: 'Before adoption day',
    basedOnOne,
  }
}
