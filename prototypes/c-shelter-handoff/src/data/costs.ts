import type { Pet } from './shelter'

// SAMPLE DATA. These first-year numbers are placeholders for the Durham, NC
// area, chosen to be plausible. They do not come from a source and the UI
// labels them as sample numbers. Replace with real local data before any test
// that relies on the amounts.

const base = {
  dog: { routineVet: 700, foodSupplies: 950, sitterPerDay: 50, cushion: 1500 },
  cat: { routineVet: 450, foodSupplies: 650, sitterPerDay: 25, cushion: 1200 },
}

// Days of sitter or boarding we assume in year one (trips, long days).
const SITTER_DAYS = 10

export type CostLine = { label: string; amount: number }

export type FirstYearCost = {
  lines: CostLine[]
  total: number
  cushion: number
}

export function firstYearCost(pet: Pet): FirstYearCost {
  const c = base[pet.species]
  const lines: CostLine[] = [
    { label: 'Adoption fee', amount: pet.adoptionFee },
    { label: 'Routine vet care', amount: c.routineVet },
    { label: 'Food and supplies', amount: c.foodSupplies },
    {
      label: `Sitter or boarding, about ${SITTER_DAYS} days`,
      amount: c.sitterPerDay * SITTER_DAYS,
    },
  ]
  if (pet.extra) lines.push(pet.extra)
  return {
    lines,
    total: lines.reduce((sum, l) => sum + l.amount, 0),
    cushion: c.cushion,
  }
}

export function money(n: number): string {
  return `$${n.toLocaleString('en-US')}`
}
