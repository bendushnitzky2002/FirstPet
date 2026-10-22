// Sample shelter and pets for this prototype. Maple Street Animal Shelter is
// made up; it stands in for Carla's shelter. Pet names and needs are invented.

export const shelter = {
  name: 'Maple Street Animal Shelter',
  short: 'Maple Street',
  area: 'Durham, NC',
}

export type Species = 'dog' | 'cat'

export type Pet = {
  id: string
  name: string
  species: Species
  description: string
  // The most hours a weekday this pet should be alone, per the shelter's notes.
  maxHoursAlone: number
  adoptionFee: number
  needs: string[]
  // A first-year cost line this pet needs that others may not.
  extra?: { label: string; amount: number }
  available: boolean
}

export const pets: Pet[] = [
  {
    id: 'biscuit',
    name: 'Biscuit',
    species: 'dog',
    description: '2-year-old hound mix',
    maxHoursAlone: 6,
    adoptionFee: 150,
    needs: ['A long walk or run every day', 'No more than 6 hours alone', 'Fine with kids over 6'],
    extra: { label: 'Basic training class', amount: 180 },
    available: true,
  },
  {
    id: 'luna',
    name: 'Luna',
    species: 'cat',
    description: '1-year-old shorthair',
    maxHoursAlone: 10,
    adoptionFee: 75,
    needs: ['Indoor only', 'A quiet room to settle in', 'Shy for the first week'],
    available: true,
  },
  {
    id: 'hank',
    name: 'Hank',
    species: 'dog',
    description: '9-year-old lab mix',
    maxHoursAlone: 8,
    adoptionFee: 50,
    needs: ['Daily joint medication', 'Short, slow walks', 'Vet visits twice a year'],
    extra: { label: 'Joint medication', amount: 480 },
    available: true,
  },
  {
    id: 'pip',
    name: 'Pip',
    species: 'dog',
    description: '11-year-old terrier',
    maxHoursAlone: 8,
    adoptionFee: 50,
    needs: ['Senior bloodwork twice a year', 'Short walks'],
    extra: { label: 'Senior bloodwork', amount: 300 },
    available: false,
  },
  {
    id: 'juniper',
    name: 'Juniper',
    species: 'dog',
    description: '1-year-old shepherd mix',
    maxHoursAlone: 5,
    adoptionFee: 150,
    needs: ['Lots of exercise', 'No more than 5 hours alone', 'Still learning leash manners'],
    extra: { label: 'Basic training class', amount: 180 },
    available: false,
  },
  {
    id: 'olive',
    name: 'Olive',
    species: 'cat',
    description: '4-year-old tabby',
    maxHoursAlone: 10,
    adoptionFee: 75,
    needs: ['Indoor only', 'Prefers a home without other cats'],
    available: false,
  },
  {
    id: 'rocket',
    name: 'Rocket',
    species: 'dog',
    description: '3-year-old beagle mix',
    maxHoursAlone: 6,
    adoptionFee: 150,
    needs: ['Secure fence or leash at all times', 'Daily walks'],
    available: false,
  },
]

export function getPet(id: string | undefined): Pet {
  return pets.find((p) => p.id === id) ?? pets[0]
}
