import type { Check } from '../types'

// Demo check for rehearsal and as a backup if the live flow breaks.
// Loaded by pressing "d" three times on the landing page (see docs/demo-script.md).
// Priya and Marcus are our persona; their answers here are made up for the demo.
export function demoCheck(code: string): Check {
  return {
    code,
    createdAt: new Date().toISOString(),
    deciding: 'family',
    pet: 'dog',
    zip: '27514',
    step: 6,
    starter: {
      name: 'Priya',
      done: true,
      hoursAlone: 4,
      overnights: 'few',
      vetCost: 'fine',
      worries: ['cost', 'time'],
    },
    partner: {
      name: 'Marcus',
      done: true,
      hoursAlone: 9,
      overnights: 'few',
      vetCost: 'tight',
      worries: ['cost', 'time'],
    },
    checked: [],
  }
}
