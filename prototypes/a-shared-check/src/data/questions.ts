import type { Deciding, Overnights, Pet, VetCost, Worry } from '../types'

export const DECIDING_OPTIONS: { value: Deciding; label: string }[] = [
  { value: 'solo', label: 'Just me' },
  { value: 'partner', label: 'Me and a partner' },
  { value: 'family', label: 'Family with kids' },
]

export const PET_OPTIONS: { value: Pet; label: string }[] = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'unsure', label: 'Not sure yet' },
]

// perMonth is the midpoint we use to estimate sitter nights for the cost block.
// "More than 8" is counted as 10. These are our assumptions, not measured data.
export const OVERNIGHT_OPTIONS: {
  value: Overnights
  label: string
  phrase: string
  perMonth: number
}[] = [
  { value: 'none', label: 'None', phrase: 'no nights', perMonth: 0 },
  { value: 'few', label: '1 to 3', phrase: '1 to 3 nights', perMonth: 2 },
  { value: 'some', label: '4 to 8', phrase: '4 to 8 nights', perMonth: 6 },
  { value: 'many', label: 'More than 8', phrase: 'more than 8 nights', perMonth: 10 },
]

export const VET_OPTIONS: { value: VetCost; label: string; phrase: string }[] = [
  { value: 'fine', label: 'Fine', phrase: 'fine' },
  { value: 'tight', label: 'Tight but doable', phrase: 'tight but doable' },
  { value: 'not-possible', label: 'Not possible right now', phrase: 'not possible right now' },
]

export const WORRY_OPTIONS: { value: Worry; label: string; phrase: string }[] = [
  { value: 'cost', label: 'Cost', phrase: 'cost' },
  { value: 'time', label: 'Time', phrase: 'time' },
  { value: 'kids', label: 'The kids', phrase: 'the kids' },
  { value: 'partner', label: "My partner isn't sure", phrase: "a partner who isn't sure" },
  { value: 'start', label: "I don't know where to start", phrase: 'not knowing where to start' },
]

export const HOURS_MAX = 12

export function hoursLabel(hours: number): string {
  if (hours >= HOURS_MAX) return `${HOURS_MAX} or more hours`
  return hours === 1 ? '1 hour' : `${hours} hours`
}

export const overnightOption = (v: Overnights) => OVERNIGHT_OPTIONS.find((o) => o.value === v)!
export const vetOption = (v: VetCost) => VET_OPTIONS.find((o) => o.value === v)!
export const worryOption = (v: Worry) => WORRY_OPTIONS.find((o) => o.value === v)!
