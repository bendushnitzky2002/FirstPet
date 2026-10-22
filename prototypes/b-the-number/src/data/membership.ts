import type { Tier } from '../types'

// PLACEHOLDER PRICES. We have not tested any price yet. The UI labels these
// as placeholders. Both tiers are annual: no per-lead fee anywhere.

export type Plan = {
  tier: Exclude<Tier, 'per-intro'>
  name: string
  forWho: string
  price: string
  perMonth: string
  includes: string[]
}

export const PLANS: Plan[] = [
  {
    tier: 'solo',
    name: 'Solo',
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
]

export const TIER_LABEL: Record<Tier, string> = {
  solo: 'Solo membership',
  clinic: 'Clinic membership',
  'per-intro': 'Would rather pay per introduction',
}
