import type { Check } from '../types'

// Demo check for rehearsal and as a backup if the live flow breaks.
// Loaded by pressing "d" three times on the landing page. The skeptic said
// "that's a no" to the number; the answers land on "ready once a few things
// change" with one change (finish the cushion). Slide weekday hours to 6 or
// more on the tune screen to show the midday walker appear.
export function demoCheck(): Check {
  return {
    zip: '27701',
    pet: 'dog',
    firstTake: 'no',
    answers: { hoursAway: 5, overnights: '1-3', saved: 800, monthlyRoom: 300 },
    touched: ['hoursAway', 'overnights', 'saved', 'monthlyRoom'],
  }
}
