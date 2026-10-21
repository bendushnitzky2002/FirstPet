import type { Answers, Overnights, Pet } from '../types'

// SAMPLE DATA. These first-year numbers are placeholders we wrote for the
// prototype so the number has something plausible to show. They are not from
// a survey, a vet, or any published source, and the UI says so.

export type PetCosts = {
  setup: number // one time: crate or carrier, bed, bowls, leash or litter box
  routineVet: number // exams, vaccines, preventives for year one
  foodSupplies: number // food, treats, litter, toys for the year
  walkerPerVisit: number // one midday walk (dogs only; 0 for cats)
  sitterPerNight: number // a sitter for one night away
  cushion: number // emergency cushion we tell people to set aside
}

export type CostEntry = {
  place: string
  dog: PetCosts
  cat: PetCosts
}

export const DEFAULT_COSTS: CostEntry = {
  place: 'your area',
  dog: {
    setup: 400,
    routineVet: 700,
    foodSupplies: 1100,
    walkerPerVisit: 22,
    sitterPerNight: 60,
    cushion: 2000,
  },
  cat: {
    setup: 250,
    routineVet: 450,
    foodSupplies: 700,
    walkerPerVisit: 0,
    sitterPerNight: 35,
    cushion: 1500,
  },
}

const entry = (place: string, dog: number[], cat: number[]): CostEntry => {
  const make = ([
    setup,
    routineVet,
    foodSupplies,
    walkerPerVisit,
    sitterPerNight,
    cushion,
  ]: number[]) => ({
    setup,
    routineVet,
    foodSupplies,
    walkerPerVisit,
    sitterPerNight,
    cushion,
  })
  return { place, dog: make(dog), cat: make(cat) }
}

// Columns: setup, routine vet, food and supplies, walker per visit, sitter per night, cushion.
export const COSTS_BY_ZIP: Record<string, CostEntry> = {
  '27701': entry('Durham, NC', [380, 680, 1050, 20, 55, 2000], [240, 430, 680, 0, 32, 1500]),
  '27514': entry('Chapel Hill, NC', [400, 720, 1080, 22, 58, 2000], [250, 450, 690, 0, 34, 1500]),
  '28202': entry('Charlotte, NC', [390, 690, 1060, 21, 55, 2000], [245, 440, 680, 0, 33, 1500]),
  '33139': entry('Miami Beach, FL', [450, 820, 1200, 26, 70, 2500], [280, 520, 760, 0, 42, 1800]),
  '32801': entry('Orlando, FL', [400, 700, 1080, 21, 58, 2000], [250, 450, 700, 0, 35, 1500]),
  '43215': entry('Columbus, OH', [360, 620, 1000, 18, 50, 1800], [230, 400, 650, 0, 30, 1300]),
  '44113': entry('Cleveland, OH', [350, 600, 980, 18, 48, 1800], [225, 390, 640, 0, 30, 1300]),
  '94110': entry('San Francisco, CA', [520, 980, 1350, 32, 85, 3000], [320, 620, 850, 0, 50, 2200]),
  '90026': entry('Los Angeles, CA', [490, 900, 1300, 28, 75, 2800], [300, 580, 820, 0, 45, 2000]),
  '78704': entry('Austin, TX', [420, 760, 1120, 23, 62, 2200], [260, 480, 720, 0, 38, 1600]),
  '77002': entry('Houston, TX', [400, 700, 1080, 21, 55, 2000], [250, 450, 700, 0, 34, 1500]),
}

// ZIPs we suggest on the landing page so a tester can see a local number.
export const SAMPLE_ZIPS = ['27701', '43215', '94110']

export const OVERNIGHT_OPTIONS: { value: Overnights; label: string; perMonth: number }[] = [
  { value: '0', label: 'None', perMonth: 0 },
  { value: '1-3', label: '1 to 3', perMonth: 2 },
  { value: '4-8', label: '4 to 8', perMonth: 6 },
  { value: 'more', label: 'More than 8', perMonth: 10 },
]

// A dog alone this many weekday hours or more needs a midday walk.
export const WALKER_HOURS = 6
export const WORKDAYS_PER_YEAR = 250

export type Line = {
  key: 'setup' | 'routineVet' | 'foodSupplies' | 'walker' | 'sitter' | 'cushion'
  label: string
  detail: string
  amount: number
  oneTime?: boolean
  required?: boolean
}

export type FirstYear = {
  place: string
  zip: string
  isDefault: boolean
  pet: Pet
  lines: Line[]
  total: number
  monthly: number // ongoing care per month (no setup, no cushion)
  cushion: number
  walker: number
  sitter: number
}

export const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

export function lookup(zip: string): CostEntry | undefined {
  return COSTS_BY_ZIP[zip]
}

// The first-year number. With no answers it is the starting number we show
// before any questions: setup, vet, food, and the cushion. With answers, the
// schedule adds a midday walker and overnight sitter.
export function firstYear(zip: string, pet: Pet, answers?: Answers): FirstYear {
  const local = lookup(zip)
  const c = (local ?? DEFAULT_COSTS)[pet]

  const needsWalker =
    !!answers && pet === 'dog' && c.walkerPerVisit > 0 && answers.hoursAway >= WALKER_HOURS
  const walker = needsWalker ? WORKDAYS_PER_YEAR * c.walkerPerVisit : 0
  const nightsPerMonth = answers
    ? OVERNIGHT_OPTIONS.find((o) => o.value === answers.overnights)!.perMonth
    : 0
  const sitterNights = nightsPerMonth * 12
  const sitter = sitterNights * c.sitterPerNight

  const lines: Line[] = [
    {
      key: 'setup',
      label: 'Getting started',
      detail: pet === 'dog' ? 'Crate, bed, bowls, leash' : 'Carrier, bed, bowls, litter box',
      amount: c.setup,
      oneTime: true,
    },
    {
      key: 'routineVet',
      label: 'Routine vet care',
      detail: 'Exams, vaccines, preventives',
      amount: c.routineVet,
    },
    {
      key: 'foodSupplies',
      label: 'Food and supplies',
      detail: pet === 'dog' ? 'Food, treats, toys' : 'Food, litter, toys',
      amount: c.foodSupplies,
    },
  ]
  if (walker > 0) {
    lines.push({
      key: 'walker',
      label: 'Midday walker',
      detail: `${WORKDAYS_PER_YEAR} weekdays at ${money(c.walkerPerVisit)}`,
      amount: walker,
    })
  }
  if (sitter > 0) {
    lines.push({
      key: 'sitter',
      label: 'Overnight sitter',
      detail: `${sitterNights} nights at ${money(c.sitterPerNight)}`,
      amount: sitter,
    })
  }
  lines.push({
    key: 'cushion',
    label: 'Emergency cushion',
    detail: 'Set aside before day one, for the bill nobody plans for',
    amount: c.cushion,
    required: true,
  })

  const ongoing = c.routineVet + c.foodSupplies + walker + sitter
  return {
    place: local?.place ?? DEFAULT_COSTS.place,
    zip,
    isDefault: !local,
    pet,
    lines,
    total: lines.reduce((sum, l) => sum + l.amount, 0),
    monthly: Math.round(ongoing / 12),
    cushion: c.cushion,
    walker,
    sitter,
  }
}
