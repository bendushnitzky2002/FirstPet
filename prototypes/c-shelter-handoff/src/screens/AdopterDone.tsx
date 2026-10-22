import { CostCard, PetCard, StepRail, VerdictBlock } from '../components/shelter'
import { Button, CalendarIcon, LogoMark, Page } from '../components/ui'
import { getPet, shelter } from '../data/shelter'
import { decideVerdict } from '../data/verdict'
import { navigate } from '../lib/router'
import { useStore } from '../lib/storage'
import { NotFound } from './NotFound'

// The adopter's result. The same verdict goes to the counselor; nothing is
// hidden from the adopter that the shelter sees.
export function AdopterDone({ id }: { id: string }) {
  const { applicants } = useStore()
  const applicant = applicants.find((a) => a.id === id)
  if (!applicant) return <NotFound />

  const pet = getPet(applicant.petId)
  const verdict = decideVerdict(applicant.answers, pet)
  const firstName = applicant.answers.name.split(' ')[0]

  return (
    <Page>
      <div className="flex items-center gap-3">
        <LogoMark />
        <p className="font-heading font-extrabold text-navy">{shelter.name}</p>
      </div>

      <h1 className="mt-6 text-3xl font-extrabold leading-tight">Thanks, {firstName}.</h1>
      <p className="mt-2 text-lg">
        We sent this to {shelter.short}. Show this screen at the counter, or give them your check
        number: <span className="font-heading font-extrabold tracking-widest text-navy">{id}</span>
      </p>

      <div className="mt-6">
        <StepRail current={2} />
      </div>

      <div className="mt-6 space-y-4">
        <PetCard pet={pet} compact />
        <VerdictBlock verdict={verdict} who="adopter" />
        <CostCard pet={pet} />

        <section className="fp-card flex gap-4 p-5">
          <span className="fp-icon-teal shrink-0">
            <CalendarIcon />
          </span>
          <div>
            <h3 className="text-lg font-extrabold">Two weeks after {pet.name} comes home</h3>
            <p>
              {shelter.short} will send you six quick questions. If something is hard, they want to
              help early.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-8 space-y-3">
        <Button onClick={() => navigate(`/counselor/a/${id}`)}>See what the counselor sees</Button>
        <Button variant="quiet" onClick={() => navigate('/')}>
          Back to the start
        </Button>
      </div>
    </Page>
  )
}
