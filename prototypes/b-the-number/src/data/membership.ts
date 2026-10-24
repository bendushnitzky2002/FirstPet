import type { Tier } from '../types'

// PLACEHOLDER PRICES. We have not tested any price yet. The UI labels these
// as placeholders. The per-introduction price is set so that 12 accepted
// households a year cost the same as Solo, so neither option is obviously
// cheaper. All three options get the same introductions in the same order.

export type Plan = {
  tier: Tier
  name: string
  kind: string
  forWho: string
  price: string
  perMonth: string
  includes: string[]
}

export const PLANS: Plan[] = [
  {
    tier: 'solo',
    name: 'Solo',
    kind: 'Yearly membership',
    forWho: 'One professional: a walker, sitter, trainer, or solo vet',
    price: '$300 a year',
    perMonth: 'About $25 a month, billed yearly',
    includes: [
      'Vetted badge on your network profile',
      'Unlimited introductions in your area',
      'Each household’s plan, shared by consent',
      'One login',
    ],
  },
  {
    tier: 'clinic',
    name: 'Clinic',
    kind: 'Yearly membership',
    forWho: 'A practice or business with a team',
    price: '$1,200 a year',
    perMonth: 'About $100 a month, billed yearly',
    includes: [
      'Everything in Solo',
      'Up to 3 locations',
      'Up to 10 staff logins',
      'Route introductions to the right person on your team',
    ],
  },
  {
    tier: 'per-intro',
    name: 'Pay per introduction',
    kind: 'No yearly fee',
    forWho: 'Any professional or team, paying only for households you accept',
    price: '$25 a household',
    perMonth: 'Charged only when you accept an introduction',
    includes: [
      'Vetted badge on your network profile',
      'Every introduction in your area to review',
      'Each household’s plan, shared by consent',
      'Passing on an introduction is free',
    ],
  },
]

// Neutral comparison line for the page, from the placeholder prices above.
export const BREAK_EVEN = 12

export const TIER_LABEL: Record<Tier, string> = {
  solo: 'Solo membership',
  clinic: 'Clinic membership',
  'per-intro': 'Would rather pay per introduction',
}
