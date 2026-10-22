import { CostCard, VerdictBlock } from '../components/shelter'
import { BackLink, Button, LogoMark } from '../components/ui'
import { checkInDue, reviewCheckIn, statusLabel } from '../data/checkin'
import { getPet, shelter } from '../data/shelter'
import { decideVerdict } from '../data/verdict'
import { day } from '../lib/format'
import { navigate } from '../lib/router'
import { useStore } from '../lib/storage'
import { Answers } from './ApplicantSummary'
import { NotFound } from './NotFound'

// The one-page readiness summary a counselor prints or keeps in the file.
export function PrintSummary({ id }: { id: string }) {
  const { applicants } = useStore()
  const a = applicants.find((x) => x.id === id)
  if (!a) return <NotFound />

  const pet = getPet(a.petId)
  const verdict = decideVerdict(a.answers, pet)
  const due = checkInDue(a)
  const review = reviewCheckIn(a)

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 print:max-w-none print:p-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <BackLink onClick={() => navigate(`/counselor/a/${id}`)}>Back to {a.answers.name}</BackLink>
        <Button size="sm" full={false} onClick={() => window.print()}>
          Print or save as PDF
        </Button>
      </div>

      <article className="space-y-4 rounded-card border border-line bg-white p-6 print:space-y-3 print:border-0 print:p-0">
        <header className="flex items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="font-heading text-sm font-bold uppercase tracking-wide text-teal">
                Readiness summary
              </p>
              <h1 className="text-2xl font-extrabold leading-tight">
                {a.answers.name} and {pet.name}
              </h1>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold text-navy">{shelter.name}</p>
            <p>
              Check {a.id}, {day(new Date(a.submittedAt))}
            </p>
          </div>
        </header>

        <VerdictBlock verdict={verdict} who="counselor" />

        {verdict.talkingPoints.length > 0 && (
          <section>
            <h2 className="text-lg font-extrabold">Talk about these at the counter</h2>
            <ol className="mt-1 list-decimal space-y-1 pl-5">
              {verdict.talkingPoints.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </section>
        )}

        <div className="grid gap-4 sm:grid-cols-2 print:grid-cols-2">
          <Answers a={a} />
          <CostCard pet={pet} />
        </div>

        <section className="rounded-xl bg-canvas p-4">
          <h2 className="text-lg font-extrabold">Week-two check-in</h2>
          <p>
            {due
              ? `Goes out ${day(due)}. Status: ${statusLabel[review.status].toLowerCase()}.`
              : 'Scheduled for two weeks after adoption day.'}
          </p>
        </section>

        <p className="text-xs text-body/70">
          This summary supports a conversation. FirstPet does not approve or deny adoptions, and no
          one can pay to change a result. Costs are sample numbers for this prototype.
        </p>
      </article>
    </main>
  )
}
