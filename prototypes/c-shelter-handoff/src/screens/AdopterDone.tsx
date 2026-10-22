import { CostCard, PetCard, StepRail, VerdictBlock } from '../components/shelter'
import { Button, CalendarIcon, Page } from '../components/ui'
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
    <Page
      aside={
        <>
          <section className="fp-guide">
            <span className="fp-eyebrow text-[#90D2D0]">Your check number</span>
            <p className="font-heading text-4xl font-extrabold tracking-widest text-white">{id}</p>
            <p className="mt-2 text-sm">
              Show this screen at the counter, or give them the number.
            </p>
          </section>
          <PetCard pet={pet} compact />
          <section className="fp-card flex gap-4 p-5">
            <span className="fp-icon-teal shrink-0">
              <CalendarIcon />
            </span>
            <div>
              <h3 className="text-base">Two weeks after {pet.name} comes home</h3>
              <p className="text-sm text-muted">
                {shelter.short} will send you six quick questions. If something is hard, they want
                to help early.
              </p>
            </div>
          </section>
          <div className="fp-card space-y-2 p-4">
            <Button onClick={() => navigate(`/counselor/a/${id}`)}>
              See what the counselor sees
            </Button>
            <Button variant="secondary" onClick={() => navigate('/')}>
              Back to the start
            </Button>
          </div>
        </>
      }
    >
      <div className="pb-6">
        <span className="fp-eyebrow">{shelter.name}</span>
        <h1 className="text-[28px] leading-tight sm:text-[34px]">Thanks, {firstName}.</h1>
        <p className="mt-1.5 text-muted">
          We sent this to {shelter.short}. Your counselor goes over it with you at the visit.
        </p>
      </div>

      <section className="fp-card p-6">
        <StepRail current={2} />
      </section>

      <div className="mt-5 space-y-5">
        <VerdictBlock verdict={verdict} who="adopter" />
        <CostCard pet={pet} />
      </div>
    </Page>
  )
}
