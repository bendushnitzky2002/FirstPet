import type { FirstTake, LastTake } from '../types'

// The before and after answers. Comparing them is how a test session reads
// the hypothesis: did "that's a no" become "ready once these change"?
export const FIRST_TAKE_LABEL: Record<FirstTake, string> = {
  yes: 'That works for us',
  unsure: 'Not sure yet',
  no: "Honestly, that's a no",
}

export const LAST_TAKES: { value: LastTake; label: string }[] = [
  { value: 'ready', label: 'Ready now' },
  { value: 'ready-once', label: 'Ready once these change' },
  { value: 'no', label: 'Still a no' },
]
