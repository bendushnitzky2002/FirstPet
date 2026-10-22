import type { Answers } from '../types'
import type { Pet } from './shelter'

// What is still missing before the visit. The counselor sees these on the
// upcoming visits list so the conversation starts with the gaps, not with a
// form. They are separate from the verdict: a "ready" household can still be
// missing something worth bringing to the visit.

// Answers that name nobody in particular.
const VAGUE_CARE = ['everyone', 'we', 'us', 'all of us', 'family', 'the family', 'whoever']

export function missingBeforeVisit(a: Answers, pet: Pet): string[] {
  const missing: string[] = []
  if (a.home === "We rent, and haven't asked yet") missing.push("Landlord's yes in writing")
  if (a.backup === 'No plan yet') missing.push('Backup care for trips')
  if (VAGUE_CARE.includes(a.dailyCare.trim().toLowerCase()))
    missing.push('A named person for daily care')
  if (a.hoursAlone > pet.maxHoursAlone) missing.push(`Midday plan for ${pet.name}`)
  if (a.vetBill !== 'Fine') missing.push('Emergency cushion set aside')
  if (a.worries.includes("My partner isn't sure")) missing.push("Partner's yes")
  return missing
}
