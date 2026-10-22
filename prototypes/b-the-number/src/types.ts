export type Verdict = 'ready' | 'ready-once'

// One thing a household chose to share with a professional. Anything the
// household did not share is listed by label only, so the pro sees it exists.
export type SharedItem = {
  key: 'verdict' | 'budget' | 'schedule' | 'carePlan' | 'notes'
  label: string
  shared: boolean
  value?: string[] // lines to show when shared
}

export type Introduction = {
  id: string
  household: string // first names only
  area: string // neighborhood and distance, never a street address
  pet: string
  timing: string
  verdict: Verdict
  need: string // what they asked for help with, in their words
  consentedOn: string
  items: SharedItem[]
}

export type PassReason = 'not-my-service' | 'outside-area' | 'fully-booked' | 'need-more'

export type Decision =
  | { kind: 'accepted'; at: string }
  | { kind: 'passed'; at: string; reason: PassReason; detail?: string }

export type Tier = 'solo' | 'clinic' | 'per-intro'

// What a test session records. Read it back on the hidden #/log screen.
export type JoinClick = { tier: Tier; at: string; answer?: string }

// Locked items a pro asked to see, by introduction. This is how we learn what
// pros want before they say yes. In the prototype nothing is sent.
export type Requests = Record<string, SharedItem['key'][]>

export type State = {
  decisions: Record<string, Decision>
  joins: JoinClick[]
  requests: Requests
}
