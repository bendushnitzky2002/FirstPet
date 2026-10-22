import { useState } from 'react'
import { Avatar, Button, CheckIcon, ChevronRight, SampleNote, VerdictChip } from '../components/ui'
import { missingBeforeVisit } from '../data/missing'
import { getPet, pets, shelter } from '../data/shelter'
import { decideVerdict } from '../data/verdict'
import { copyText } from '../lib/clipboard'
import { visitTime, when } from '../lib/format'
import { linkTo, navigate } from '../lib/router'
import { newId, setState, useStore } from '../lib/storage'
import type { Applicant, CheckRequest } from '../types'

// Upcoming visits: who is coming in, how ready they are, and what is still
// missing, so the readiness check reaches the counselor before the visit.

function startOfToday(): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

// Adopters who took the check and have not adopted yet, with no past visit.
export function upcoming(applicants: Applicant[]): Applicant[] {
  const today = startOfToday()
  return applicants.filter((a) => !a.adoptedAt && (!a.visitAt || a.visitAt >= today))
}

function requestLink(r: CheckRequest): string {
  return linkTo(`/start/${r.petId}/${r.id}`)
}

type Row = { kind: 'check'; a: Applicant } | { kind: 'request'; r: CheckRequest }

function rowTime(row: Row): string {
  return (row.kind === 'check' ? row.a.visitAt : row.r.visitAt) ?? '9999'
}

export function VisitsTab({
  applicants,
  requests,
}: {
  applicants: Applicant[]
  requests: CheckRequest[]
}) {
  const rows: Row[] = [
    ...upcoming(applicants).map((a) => ({ kind: 'check' as const, a })),
    ...requests.map((r) => ({ kind: 'request' as const, r })),
  ].sort((x, y) => rowTime(x).localeCompare(rowTime(y)))

  return (
    <>
      <p className="mt-6">
        Every adopter gets a free readiness check before they visit. Here is who is coming in, how
        ready they are, and what is still missing.
      </p>

      <RequestCheck />

      <section className="mt-6 space-y-3">
        {rows.map((row) =>
          row.kind === 'check' ? (
            <CheckedVisit key={row.a.id} a={row.a} />
          ) : (
            <RequestedVisit key={row.r.id} r={row.r} />
          ),
        )}
        {rows.length === 0 && (
          <p className="fp-card p-6 text-center">No visits coming up. Request a check above.</p>
        )}
      </section>

      <CounterLink />
    </>
  )
}

function When({ iso }: { iso?: string }) {
  return <p className="fp-eyebrow">{iso ? visitTime(iso) : 'No visit booked yet'}</p>
}

function CheckedVisit({ a }: { a: Applicant }) {
  const pet = getPet(a.petId)
  const verdict = decideVerdict(a.answers, pet)
  const missing = missingBeforeVisit(a.answers, pet)
  const x = a.answers
  return (
    <button
      type="button"
      onClick={() => navigate(`/counselor/a/${a.id}`)}
      className="fp-card block w-full p-4 text-left transition-colors hover:border-teal sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <When iso={a.visitAt} />
        <VerdictChip kind={verdict.kind} />
      </div>
      <div className="mt-2 flex items-center gap-3">
        <Avatar name={x.name} tone={verdict.kind === 'ready' ? 'teal' : 'orange'} />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-navy">
            {x.name} <span className="font-normal">to meet {pet.name}</span>
          </p>
          <p className="text-sm">
            {x.household}. {x.hoursAlone} hours alone on weekdays. A $1,500 vet bill:{' '}
            {x.vetBill.toLowerCase()}.
          </p>
        </div>
        <ChevronRight className="hidden h-5 w-5 shrink-0 text-teal sm:block" />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {missing.length ? (
          missing.map((m) => (
            <span
              key={m}
              className="rounded-full bg-peach px-2.5 py-1 text-xs font-bold text-orange-ink"
            >
              Missing: {m}
            </span>
          ))
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-light px-2.5 py-1 text-xs font-bold text-teal-dark">
            <CheckIcon className="h-3.5 w-3.5" /> Nothing missing
          </span>
        )}
      </div>
    </button>
  )
}

function RequestedVisit({ r }: { r: CheckRequest }) {
  const pet = getPet(r.petId)
  const [copied, setCopied] = useState(false)
  return (
    <div className="fp-card border-dashed p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <When iso={r.visitAt} />
        <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-bold">
          Check not done yet
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <Avatar name={r.name} tone="orange" />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-navy">
            {r.name} <span className="font-normal">to meet {pet.name}</span>
          </p>
          <p className="text-sm">Check requested {when(r.sentAt).toLowerCase()}.</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-peach px-2.5 py-1 text-xs font-bold text-orange-ink">
          Missing: Readiness check
        </span>
        <span className="flex-1" />
        <Button
          size="sm"
          full={false}
          onClick={async () => {
            await copyText(requestLink(r))
            setCopied(true)
          }}
        >
          {copied ? 'Link copied' : 'Request a check'}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          full={false}
          onClick={() => navigate(`/start/${r.petId}/${r.id}`)}
        >
          Open as the adopter
        </Button>
      </div>
    </div>
  )
}

function tomorrowDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// One click: book the visit, get a personal link, and it is on the clipboard.
function RequestCheck() {
  const available = pets.filter((p) => p.available)
  const [name, setName] = useState('')
  const [petId, setPetId] = useState(available[0].id)
  const [date, setDate] = useState(tomorrowDate())
  const [hour, setHour] = useState('10:00')
  const [sent, setSent] = useState<CheckRequest | null>(null)

  const request = async () => {
    const r: CheckRequest = {
      id: newId(),
      name: name.trim(),
      petId,
      visitAt: new Date(`${date}T${hour}`).toISOString(),
      sentAt: new Date().toISOString(),
    }
    setState((s) => ({ ...s, requests: [...s.requests, r] }))
    await copyText(requestLink(r))
    setSent(r)
    setName('')
  }

  const field = 'fp-input px-4'

  return (
    <section className="fp-card mt-4 p-5">
      <h2 className="text-lg font-extrabold">Request a check before a visit</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Adopter's name"
          aria-label="Adopter's name"
          className={field}
        />
        <select
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
          aria-label="Pet they want to meet"
          className={field}
        >
          {available.map((p) => (
            <option key={p.id} value={p.id}>
              To meet {p.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Visit date"
          className={field}
        />
        <input
          type="time"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          aria-label="Visit time"
          className={field}
        />
        <Button size="sm" full={false} disabled={!name.trim() || !date} onClick={request}>
          Request a check
        </Button>
      </div>
      {sent && (
        <p className="mt-3 rounded-xl bg-teal-light px-4 py-3 text-sm">
          <span className="font-bold text-navy">Link copied.</span> Send it to {sent.name} by email
          or text. Their visit is on the list below.
          <span className="mt-1 block truncate font-mono text-xs text-navy">
            {requestLink(sent)}
          </span>
        </p>
      )}
    </section>
  )
}

// The general link for the shelter's website and counter tablet, for walk-ins.
export function CounterLink() {
  const [copied, setCopied] = useState(false)
  const url = linkTo('/start')
  return (
    <section className="mt-6 flex flex-col gap-3 rounded-card bg-canvas p-5 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-extrabold">For walk-ins and your website</h2>
        <p className="text-sm">One link for everyone. Results show up here.</p>
        <p className="mt-2 truncate rounded-lg bg-white px-3 py-2 font-mono text-xs text-navy">
          {url}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          size="sm"
          variant="secondary"
          full={false}
          onClick={async () => {
            await copyText(url)
            setCopied(true)
          }}
        >
          {copied ? 'Copied' : 'Copy link'}
        </Button>
        <Button size="sm" variant="secondary" full={false} onClick={() => navigate('/start')}>
          Open as an adopter
        </Button>
      </div>
    </section>
  )
}

export function UpgradeTeaser() {
  return (
    <button
      type="button"
      onClick={() => navigate('/counselor/plans')}
      className="mt-6 flex w-full items-center gap-4 rounded-card border border-line bg-white p-5 text-left hover:border-teal"
    >
      <span className="min-w-0 flex-1">
        <span className="block font-heading text-lg font-extrabold text-navy">
          Which answers come before a return?
        </span>
        <span className="block text-sm">
          See check-in flags and returns across every adoption and location with Analytics and
          multi-location.
        </span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-teal" />
    </button>
  )
}

// TEST PRICE. Chosen for the prototype so the Subscribe Now click means
// something; it is not based on pricing research. Priced per location so it
// grows with multi-location shelters.
const TEST_PRICE = '$49'

const freeFeatures = [
  'A readiness check link for every adopter',
  'Upcoming visits with each result and what is missing',
  'One-page readiness summaries',
  'Week-two check-ins with flags',
]

const paidFeatures = [
  'Return rates across all your adoptions, by readiness result',
  'Which check-in answers came before a return',
  'Every location in one view, with shared adopter lists',
  'A monthly report you can share with your board',
]

// The test: does a shelter click Subscribe Now, and what would make it worth it?
export function PlansTab() {
  const { upgrade } = useStore()
  const [stage, setStage] = useState<'offer' | 'ask' | 'thanks'>('offer')
  const [answer, setAnswer] = useState('')

  const subscribe = () => {
    setState((s) => ({
      ...s,
      upgrade: { ...s.upgrade, clicks: [...s.upgrade.clicks, new Date().toISOString()] },
    }))
    setStage('ask')
  }

  const send = () => {
    setState((s) => ({
      ...s,
      upgrade: {
        ...s.upgrade,
        answers: [...s.upgrade.answers, { at: new Date().toISOString(), text: answer.trim() }],
      },
    }))
    setAnswer('')
    setStage('thanks')
  }

  return (
    <>
      <p className="mt-6">
        The readiness check, summaries, and check-ins are free for shelters. We never charge for an
        adoption.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="fp-card flex flex-col p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-extrabold">Free for shelters</h2>
            <span className="rounded-full bg-teal-light px-3 py-1 text-xs font-bold text-teal-dark">
              Your plan
            </span>
          </div>
          <p className="mt-1 font-heading text-3xl font-extrabold text-navy">$0</p>
          <p className="text-sm">Always, for every adoption.</p>
          <FeatureList items={freeFeatures} />
        </section>

        <section className="flex flex-col rounded-card border-2 border-orange bg-white p-6">
          <h2 className="text-xl font-extrabold">Analytics and multi-location</h2>
          <p className="mt-1 font-heading text-3xl font-extrabold text-navy">
            {TEST_PRICE}
            <span className="ml-1 text-base font-bold text-body">a month per location</span>
          </p>
          <p className="text-sm">Test price for this prototype.</p>
          <p className="mt-3 text-sm font-semibold text-navy">Everything in Free, plus:</p>
          <FeatureList items={paidFeatures} />
          <div className="mt-auto pt-6">
            {stage === 'offer' && <Button onClick={subscribe}>Subscribe Now</Button>}
            {stage === 'ask' && (
              <div className="rounded-xl bg-peach p-4">
                <p className="font-bold text-navy">
                  Thanks. We are not taking payment yet. One question:
                </p>
                <label
                  htmlFor="worth-it"
                  className="mt-2 block font-heading text-lg font-extrabold text-navy"
                >
                  What would make our service worth it?
                </label>
                <textarea
                  id="worth-it"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-line bg-white p-3 outline-none focus:border-teal"
                />
                <div className="mt-2">
                  <Button size="sm" disabled={!answer.trim()} onClick={send}>
                    Send answer
                  </Button>
                </div>
              </div>
            )}
            {stage === 'thanks' && (
              <p className="flex gap-2 rounded-xl bg-teal-light p-4 font-semibold text-navy">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                Thanks. We read every answer, and it shapes what we build next for {shelter.short}.
              </p>
            )}
          </div>
        </section>
      </div>

      <details className="mt-6 text-sm">
        <summary className="cursor-pointer text-body/80">
          For our test: {upgrade.clicks.length} Subscribe Now{' '}
          {upgrade.clicks.length === 1 ? 'click' : 'clicks'} and {upgrade.answers.length}{' '}
          {upgrade.answers.length === 1 ? 'answer' : 'answers'} recorded in this browser
        </summary>
        <ul className="mt-2 space-y-1">
          {upgrade.answers.map((x) => (
            <li key={x.at} className="rounded-lg bg-white px-3 py-2">
              <span className="text-xs text-body/70">{when(x.at)}:</span> {x.text}
            </li>
          ))}
        </ul>
      </details>
      <div className="mt-2">
        <SampleNote>Nothing is charged and nothing leaves this browser.</SampleNote>
      </div>
    </>
  )
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((f) => (
        <li key={f} className="flex gap-2">
          <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  )
}
