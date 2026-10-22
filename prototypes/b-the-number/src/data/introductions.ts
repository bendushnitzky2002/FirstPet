import type { Introduction, PassReason } from '../types'

// SAMPLE DATA. Made-up households for the prototype. Each one finished a
// readiness check and chose what to share with a pro. Some share everything,
// some share only the verdict, so a test session can see what pros want
// before they say yes.
//
// We only introduce households whose verdict is ready or ready once a few
// things change. A "not yet" household is never sent to a pro.

export const INTRODUCTIONS: Introduction[] = [
  {
    id: 'priya-marcus',
    household: 'Priya and Marcus',
    area: 'Old West Durham, 1.8 miles away',
    pet: 'Dog, about 2 years old, from a shelter',
    timing: 'Adopting in about 2 weeks',
    verdict: 'ready-once',
    need: 'A vet for the first visit and vaccines, and someone to tell us what the first year really costs.',
    consentedOn: 'October 20',
    items: [
      {
        key: 'verdict',
        label: 'Readiness verdict',
        shared: true,
        value: [
          'Ready once a few things change',
          'Open item: finish setting aside the emergency cushion (about 2 months to go)',
        ],
      },
      {
        key: 'budget',
        label: 'First-year budget',
        shared: true,
        value: ['$4,100 planned for the first year', '$1,200 of a $2,000 cushion set aside'],
      },
      {
        key: 'schedule',
        label: 'Schedule',
        shared: true,
        value: ['Nobody home about 5 hours on weekdays', '1 to 3 nights away a month'],
      },
      {
        key: 'carePlan',
        label: 'Care plan with names',
        shared: true,
        value: ['Mornings: Marcus', 'Evenings: Priya', 'Weekends: the kids help, with a parent'],
      },
      {
        key: 'notes',
        label: 'Their worries',
        shared: true,
        value: ['A surprise vet bill', 'Whether the kids will help'],
      },
    ],
  },
  {
    id: 'jordan',
    household: 'Jordan',
    area: 'Downtown Durham, 0.9 miles away',
    pet: 'Cat, adult, from a shelter',
    timing: 'Adopting this weekend',
    verdict: 'ready',
    need: 'A first exam soon after adoption.',
    consentedOn: 'October 21',
    items: [
      { key: 'verdict', label: 'Readiness verdict', shared: true, value: ['Ready'] },
      {
        key: 'budget',
        label: 'First-year budget',
        shared: true,
        value: ['$2,900 planned for the first year', 'Cushion fully set aside'],
      },
      { key: 'schedule', label: 'Schedule', shared: false },
      { key: 'carePlan', label: 'Care plan with names', shared: false },
      { key: 'notes', label: 'Their worries', shared: false },
    ],
  },
  {
    id: 'sam-riley',
    household: 'Sam and Riley',
    area: 'Trinity Park, 2.6 miles away',
    pet: 'Puppy, about 10 weeks, from a breeder',
    timing: 'Bringing the puppy home in about a month',
    verdict: 'ready-once',
    need: 'A puppy vaccine plan and advice on spay or neuter timing.',
    consentedOn: 'October 19',
    items: [
      {
        key: 'verdict',
        label: 'Readiness verdict',
        shared: true,
        value: ['Ready once a few things change', 'Open item: agree on who covers weekday lunches'],
      },
      { key: 'budget', label: 'First-year budget', shared: false },
      {
        key: 'schedule',
        label: 'Schedule',
        shared: true,
        value: ['Nobody home about 8 hours on weekdays', 'No nights away'],
      },
      {
        key: 'carePlan',
        label: 'Care plan with names',
        shared: true,
        value: ['Mornings: Sam', 'Lunch: not decided yet', 'Evenings: Riley'],
      },
      { key: 'notes', label: 'Their worries', shared: true, value: ['House training', 'Time'] },
    ],
  },
  {
    id: 'taylor',
    household: 'Taylor',
    area: 'Duke Park, 3.4 miles away',
    pet: 'Not sure yet: dog or cat',
    timing: 'Adopting in 1 to 2 months',
    verdict: 'ready',
    need: 'Someone to talk to before choosing.',
    consentedOn: 'October 22',
    items: [
      { key: 'verdict', label: 'Readiness verdict', shared: true, value: ['Ready'] },
      { key: 'budget', label: 'First-year budget', shared: false },
      { key: 'schedule', label: 'Schedule', shared: false },
      { key: 'carePlan', label: 'Care plan with names', shared: false },
      { key: 'notes', label: 'Their worries', shared: false },
    ],
  },
]

export const PASS_REASONS: { value: PassReason; label: string }[] = [
  { value: 'not-my-service', label: 'Not a service we offer' },
  { value: 'outside-area', label: 'Outside our area' },
  { value: 'fully-booked', label: 'We are fully booked' },
  { value: 'need-more', label: 'We would need to see more first' },
]

export const VERDICT_LABEL = {
  ready: 'Ready',
  'ready-once': 'Ready once a few things change',
} as const
