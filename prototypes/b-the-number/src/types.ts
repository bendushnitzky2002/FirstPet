export type Pet = 'dog' | 'cat'

// The gut check right after the number, before any household questions.
export type FirstTake = 'yes' | 'unsure' | 'no'

// The same person, after the verdict. This pair is what the hypothesis is
// about: does seeing the number first move "no" to "ready once X changes"?
export type LastTake = 'ready' | 'ready-once' | 'no'

export type Overnights = '0' | '1-3' | '4-8' | 'more'

export type Answers = {
  hoursAway: number // weekday hours nobody is home, 0 to 12
  overnights: Overnights // nights a month nobody is home
  saved: number // dollars already set aside for a surprise vet bill
  monthlyRoom: number // dollars a month the household could put toward a pet
}

export type Check = {
  zip: string
  pet: Pet
  firstTake?: FirstTake
  answers: Answers
  // Levers the person has moved. Untouched ones show "our guess".
  touched: (keyof Answers)[]
  lastTake?: LastTake
}
