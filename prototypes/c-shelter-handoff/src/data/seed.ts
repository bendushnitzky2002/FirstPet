import type { Activity, Applicant, CheckRequest } from '../types'

// SAMPLE DATA. Made-up adopters for the counselor workspace. The list and
// applicant summary layout are adapted from Sala's "FirstPet Shelter
// Workspace" Figma Make prototype; the people, pets, and answers are invented.
// Dates are relative to when the demo loads so check-ins are always due.

const DAY = 24 * 60 * 60 * 1000

function ago(days: number, hour = 10, minute = 0): string {
  const d = new Date(Date.now() - days * DAY)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

function ahead(days: number, hour: number, minute = 0): string {
  return ago(-days, hour, minute)
}

function act(id: string, at: string, title: string, detail: string): Activity {
  return { id, at, title, detail }
}

export function sampleApplicants(): Applicant[] {
  return [
    {
      id: 'PM4K2Q',
      petId: 'biscuit',
      submittedAt: ago(0, 9, 42),
      visitAt: ahead(1, 10, 0),
      answers: {
        name: 'Priya and Marcus',
        household: 'Family with kids',
        home: 'We own our home',
        hoursAlone: 8,
        dailyCare: 'Priya mornings, Marcus evenings',
        backup: 'Family or a friend nearby',
        vetBill: 'Tight but doable',
        worries: ['The cost', "My partner isn't sure"],
      },
      activity: [act('a1', ago(0, 9, 42), 'Readiness check done', 'Shared with Maple Street.')],
    },
    {
      id: 'JC7H3M',
      petId: 'luna',
      submittedAt: ago(1, 15, 16),
      visitAt: ahead(0, 15, 30),
      answers: {
        name: 'Jamie Chen',
        household: 'Just me',
        home: 'We rent, and the landlord said yes',
        hoursAlone: 7,
        dailyCare: 'Jamie',
        backup: 'Family or a friend nearby',
        vetBill: 'Fine',
        worries: [],
      },
      activity: [act('a1', ago(1, 15, 16), 'Readiness check done', 'Shared with Maple Street.')],
    },
    {
      id: 'RP2N8D',
      petId: 'biscuit',
      submittedAt: ago(2, 11, 5),
      visitAt: ahead(2, 14, 0),
      answers: {
        name: 'Riley Park',
        household: 'Roommates',
        home: "We rent, and haven't asked yet",
        hoursAlone: 11,
        dailyCare: 'Riley',
        backup: 'No plan yet',
        vetBill: 'Not possible right now',
        worries: ['The cost', "I don't know where to start"],
      },
      activity: [act('a1', ago(2, 11, 5), 'Readiness check done', 'Shared with Maple Street.')],
    },
    {
      id: 'TB5W9J',
      petId: 'juniper',
      submittedAt: ago(19, 14, 0),
      adoptedAt: ago(16, 16, 30),
      answers: {
        name: 'Taylor Brooks',
        household: 'Me and a partner',
        home: 'We rent, and the landlord said yes',
        hoursAlone: 5,
        dailyCare: 'Taylor',
        backup: "We'd pay a sitter",
        vetBill: 'Fine',
        worries: ['Having enough time'],
      },
      checkIn: {
        submittedAt: ago(1, 20, 12),
        going: 'Harder than we expected',
        hoursAlone: 9,
        surpriseCost: 'Under $200',
        careHolding: "No, it's falling on one person",
        returnThought: "It's crossed my mind",
        helpWith: ['Training or behavior'],
      },
      activity: [
        act('a3', ago(1, 20, 12), 'Week-two check-in received', 'Flagged: call this week.'),
        act('a2', ago(16, 16, 30), 'Adopted Juniper', 'Week-two check-in scheduled.'),
        act('a1', ago(19, 14, 0), 'Readiness check done', 'Shared with Maple Street.'),
      ],
    },
    {
      id: 'AR3F6T',
      petId: 'pip',
      submittedAt: ago(18, 11, 5),
      adoptedAt: ago(15, 13, 0),
      answers: {
        name: 'Alex Rivera',
        household: 'Me and a partner',
        home: 'We own our home',
        hoursAlone: 3,
        dailyCare: 'Alex days, partner evenings',
        backup: 'Family or a friend nearby',
        vetBill: 'Fine',
        worries: [],
      },
      checkIn: {
        submittedAt: ago(0, 8, 5),
        going: 'Some bumps',
        hoursAlone: 3,
        surpriseCost: '$200 or more',
        careHolding: 'Yes, as planned',
        returnThought: 'No',
        helpWith: ['A vet question'],
      },
      activity: [
        act('a3', ago(0, 8, 5), 'Week-two check-in received', 'Flagged: send a note.'),
        act('a2', ago(15, 13, 0), 'Adopted Pip', 'Week-two check-in scheduled.'),
        act('a1', ago(18, 11, 5), 'Readiness check done', 'Shared with Maple Street.'),
      ],
    },
    {
      id: 'SO8L1V',
      petId: 'rocket',
      submittedAt: ago(24, 10, 0),
      adoptedAt: ago(21, 12, 0),
      answers: {
        name: 'Sam Okafor',
        household: 'Family with kids',
        home: 'We own our home',
        hoursAlone: 4,
        dailyCare: 'Sam and the kids',
        backup: 'Family or a friend nearby',
        vetBill: 'Fine',
        worries: ['How the kids will do'],
      },
      checkIn: {
        submittedAt: ago(6, 19, 40),
        going: 'Settling in well',
        hoursAlone: 4,
        surpriseCost: 'None',
        careHolding: 'Yes, as planned',
        returnThought: 'No',
        helpWith: [],
      },
      activity: [
        act('a3', ago(6, 19, 40), 'Week-two check-in received', 'Doing well.'),
        act('a2', ago(21, 12, 0), 'Adopted Rocket', 'Week-two check-in scheduled.'),
        act('a1', ago(24, 10, 0), 'Readiness check done', 'Shared with Maple Street.'),
      ],
    },
    {
      id: 'ML6C4R',
      petId: 'olive',
      submittedAt: ago(14, 9, 30),
      adoptedAt: ago(12, 15, 0),
      answers: {
        name: 'Morgan Lee',
        household: 'Just me',
        home: 'We rent, and the landlord said yes',
        hoursAlone: 9,
        dailyCare: 'Morgan',
        backup: "We'd pay a sitter",
        vetBill: 'Fine',
        worries: ['Having enough time'],
      },
      activity: [
        act('a2', ago(12, 15, 0), 'Adopted Olive', 'Week-two check-in scheduled.'),
        act('a1', ago(14, 9, 30), 'Readiness check done', 'Shared with Maple Street.'),
      ],
    },
  ]
}

// Checks the shelter asked for that the adopter has not done yet.
export function sampleRequests(): CheckRequest[] {
  return [
    {
      id: 'CA5R7N',
      name: 'Chris Alvarez',
      petId: 'hank',
      visitAt: ahead(1, 11, 30),
      sentAt: ago(1, 16, 0),
    },
    {
      id: 'PN3J8W',
      name: 'Pat Nguyen',
      petId: 'luna',
      visitAt: ahead(3, 13, 0),
      sentAt: ago(0, 8, 30),
    },
  ]
}

// The "ddd" rehearsal seed adds one adopter who just finished the check at
// home, on top of the sample list, so the demo can start in the workspace.
export function demoApplicants(): Applicant[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'DW9X2B',
      petId: 'biscuit',
      submittedAt: now,
      visitAt: ahead(0, 16, 30),
      answers: {
        name: 'Dana Whitfield',
        household: 'Me and a partner',
        home: "We rent, and haven't asked yet",
        hoursAlone: 7,
        dailyCare: 'Dana',
        backup: 'No plan yet',
        vetBill: 'Tight but doable',
        worries: ['Having enough time'],
      },
      activity: [act('a1', now, 'Readiness check done', 'Shared with Maple Street.')],
    },
    ...sampleApplicants(),
  ]
}
