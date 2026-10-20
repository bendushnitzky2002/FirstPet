export type Deciding = 'solo' | 'partner' | 'family'
export type Pet = 'dog' | 'cat' | 'unsure'
export type Overnights = 'none' | 'few' | 'some' | 'many'
export type VetCost = 'fine' | 'tight' | 'not-possible'
export type Worry = 'cost' | 'time' | 'kids' | 'partner' | 'start'

// The four questions both people answer. These are the rows on the side by side screen.
export type SharedAnswers = {
  hoursAlone?: number
  overnights?: Overnights
  vetCost?: VetCost
  worries?: Worry[]
}

export type Person = SharedAnswers & {
  name: string
  done: boolean
}

// One readiness check for one household, stored in localStorage under its code.
export type Check = {
  code: string
  createdAt: string
  // Household questions only the starter answers.
  deciding?: Deciding
  pet?: Pet
  zip?: string
  // Which question the starter is on, so a refresh resumes in place.
  step: number
  starter: Person
  partner?: Person
  // Checklist items ticked on the verdict screen.
  checked: string[]
}
