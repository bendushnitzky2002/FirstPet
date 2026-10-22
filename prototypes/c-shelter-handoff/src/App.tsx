import { useHashRoute } from './lib/router'
import { AdopterDone } from './screens/AdopterDone'
import { AdopterStart } from './screens/AdopterStart'
import { ApplicantSummary } from './screens/ApplicantSummary'
import { Check } from './screens/Check'
import { CheckIn } from './screens/CheckIn'
import { Counselor, tabs, type Tab } from './screens/Counselor'
import { Landing } from './screens/Landing'
import { PrintSummary } from './screens/PrintSummary'

// Routes (hash based):
//   #/                      two doors: adopter or counselor
//   #/start[/petId[/requestId]] the shelter asks the adopter to take the check
//   #/check                 readiness questions, one per screen
//   #/done/:id              the adopter's result
//   #/counselor             upcoming visits, with missing information flagged
//   #/counselor/adopters    every adopter who took the check
//   #/counselor/checkins    week-two check-ins, people to call first
//   #/counselor/plans       free plan and the analytics upgrade
//   #/counselor/a/:id       one adopter's readiness summary
//   #/summary/:id           printable one-page summary
//   #/checkin/:id           the adopter's week-two check-in
export default function App() {
  const { path, parts } = useHashRoute()
  return <div key={path}>{screen(parts)}</div>
}

function screen([first, second, third]: string[]) {
  switch (first) {
    case 'start':
      return <AdopterStart petId={second} requestId={third} />
    case 'check':
      return <Check />
    case 'done':
      return <AdopterDone id={second ?? ''} />
    case 'counselor':
      if (second === 'a') return <ApplicantSummary id={third ?? ''} />
      return <Counselor tab={tabs.includes(second as Tab) ? (second as Tab) : 'visits'} />
    case 'summary':
      return <PrintSummary id={second ?? ''} />
    case 'checkin':
      return <CheckIn id={second ?? ''} />
    default:
      return <Landing />
  }
}
