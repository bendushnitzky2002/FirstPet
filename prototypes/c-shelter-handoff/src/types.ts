export type Household = 'Just me' | 'Me and a partner' | 'Family with kids' | 'Roommates'

export type Home =
  'We own our home' | 'We rent, and the landlord said yes' | "We rent, and haven't asked yet"

export type Backup = 'Family or a friend nearby' | "We'd pay a sitter" | 'No plan yet'

export type VetBill = 'Fine' | 'Tight but doable' | 'Not possible right now'

export type Worry =
  | 'The cost'
  | 'Having enough time'
  | 'How the kids will do'
  | "My partner isn't sure"
  | "I don't know where to start"

// What the adopter tells us in the readiness check, before they visit.
export type Answers = {
  name: string
  household: Household
  home: Home
  hoursAlone: number
  dailyCare: string
  backup: Backup
  vetBill: VetBill
  worries: Worry[]
}

export type Going = 'Settling in well' | 'Some bumps' | 'Harder than we expected'
export type SurpriseCost = 'None' | 'Under $200' | '$200 or more'
export type CareHolding = 'Yes, as planned' | 'Mostly' | "No, it's falling on one person"
export type ReturnThought = 'No' | "It's crossed my mind" | "Yes, we're thinking about it"
export type Help = 'Training or behavior' | 'A vet question' | 'Finding a sitter or walker'

// What the adopter tells us two weeks after the pet comes home.
export type CheckIn = {
  submittedAt: string
  going: Going
  hoursAlone: number
  surpriseCost: SurpriseCost
  careHolding: CareHolding
  returnThought: ReturnThought
  helpWith: Help[]
}

export type Activity = {
  id: string
  at: string
  title: string
  detail: string
}

export type Applicant = {
  id: string
  petId: string
  answers: Answers
  submittedAt: string
  adoptedAt?: string
  checkIn?: CheckIn
  note?: string
  activity: Activity[]
}

export type Draft = {
  petId: string
  step: number
  answers: Partial<Answers>
}
