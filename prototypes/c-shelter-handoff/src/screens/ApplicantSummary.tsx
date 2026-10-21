import { useState } from 'react'
import { CostCard, VerdictBlock } from '../components/shelter'
import {
  AlertIcon,
  Avatar,
  BackLink,
  Button,
  CalendarIcon,
  ChatIcon,
  Page,
  PrintIcon,
  StatusChip,
  VerdictChip,
} from '../components/ui'
import { checkInDue, reviewCheckIn } from '../data/checkin'
import { getPet, shelter } from '../data/shelter'
import { decideVerdict } from '../data/verdict'
import { day, when } from '../lib/format'
import { linkTo, navigate } from '../lib/router'
import { newId, updateApplicant, useStore } from '../lib/storage'
import type { Applicant } from '../types'
import { NotFound } from './NotFound'

// What the counselor opens at the counter. Layout adapted from the applicant
// detail screen in Sala's Shelter Workspace prototype: the summary on the
// left, actions and history on the right.
export function ApplicantSummary({ id }: { id: string }) {
  const { applicants } = useStore()
  const a = applicants.find((x) => x.id === id)
  if (!a) return <NotFound />

  const pet = getPet(a.petId)
  const verdict = decideVerdict(a.answers, pet)

  return (
    <Page wide>
      <BackLink onClick={() => navigate('/counselor')}>All adopters</BackLink>

      <header className="mt-2 flex flex-wrap items-center gap-4">
        <Avatar name={a.answers.name} tone={verdict.kind === 'ready' ? 'teal' : 'orange'} />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">{a.answers.name}</h1>
          <p>
            for {pet.name}, {pet.description}. Check {a.id}, {when(a.submittedAt).toLowerCase()}.
          </p>
        </div>
        <VerdictChip kind={verdict.kind} />
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0 space-y-4">
          <p className="flex gap-3 rounded-card bg-teal-light px-4 py-3 text-sm">
            <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
            <span>
              <strong className="text-navy">This supports a conversation.</strong> FirstPet does not
              approve or deny adoptions. You and the adopter decide together, and no one can pay to
              change a result.
            </span>
          </p>

          <VerdictBlock verdict={verdict} who="counselor" />

          <section className="rounded-card border-2 border-orange bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="fp-icon-orange">
                <ChatIcon />
              </span>
              <h2 className="text-lg font-extrabold">Talk about these at the counter</h2>
            </div>
            {verdict.talkingPoints.length ? (
              <ol className="mt-3 space-y-2">
                {verdict.talkingPoints.map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-peach text-xs font-bold text-navy">
                      {i + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3">Nothing flagged. Ask what they are most looking forward to.</p>
            )}
          </section>

          <Answers a={a} />
          <CostCard pet={pet} />
          <WeekTwo a={a} />
        </div>

        <aside className="space-y-4">
          <div className="fp-card space-y-2 p-4">
            <Button size="sm" onClick={() => navigate(`/summary/${a.id}`)}>
              <span className="inline-flex items-center gap-2">
                <PrintIcon className="h-4 w-4" /> One-page summary
              </span>
            </Button>
            {!a.adoptedAt && (
              <Button size="sm" variant="secondary" onClick={() => markAdopted(a)}>
                Mark adopted
              </Button>
            )}
          </div>
          <Note a={a} />
          <section className="fp-card p-4">
            <h2 className="text-lg font-extrabold">Activity</h2>
            <ol className="mt-3 space-y-3 border-l-2 border-line pl-4">
              {[...a.activity]
                .sort((x, y) => y.at.localeCompare(x.at))
                .map((x) => (
                  <li key={x.id} className="relative">
                    <span className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-teal" />
                    <p className="font-bold text-navy">{x.title}</p>
                    <p className="text-sm">{x.detail}</p>
                    <p className="text-xs text-body/70">{when(x.at)}</p>
                  </li>
                ))}
            </ol>
          </section>
        </aside>
      </div>
    </Page>
  )
}

function markAdopted(a: Applicant) {
  const now = new Date().toISOString()
  const pet = getPet(a.petId)
  updateApplicant(a.id, (x) => ({
    ...x,
    adoptedAt: now,
    activity: [
      ...x.activity,
      {
        id: newId(),
        at: now,
        title: `Adopted ${pet.name}`,
        detail: 'Week-two check-in scheduled.',
      },
    ],
  }))
}

export function Answers({ a }: { a: Applicant }) {
  const pet = getPet(a.petId)
  const x = a.answers
  const rows: [string, string][] = [
    ['Household', x.household],
    ['Home', x.home],
    ['Hours alone on a weekday', `${x.hoursAlone} (${pet.name}'s limit: ${pet.maxHoursAlone})`],
    ['Daily care', x.dailyCare],
    ['When they travel', x.backup],
    ['A $1,500 vet bill', x.vetBill],
    ['Worries', x.worries.length ? x.worries.join(', ') : 'None picked'],
  ]
  return (
    <section className="fp-card p-5">
      <h2 className="text-lg font-extrabold">Their answers</h2>
      <dl className="mt-2 divide-y divide-line">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 py-2 sm:grid-cols-[200px_1fr] sm:gap-4">
            <dt className="text-sm font-semibold">{k}</dt>
            <dd className="font-semibold text-navy">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function WeekTwo({ a }: { a: Applicant }) {
  const pet = getPet(a.petId)
  const review = reviewCheckIn(a)
  const due = checkInDue(a)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    const url = linkTo(`/checkin/${a.id}`)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link', url)
    }
  }

  return (
    <section className="fp-card p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="fp-icon-teal">
          <CalendarIcon />
        </span>
        <h2 className="flex-1 text-lg font-extrabold">Week-two check-in</h2>
        {review.status !== 'not-adopted' && <StatusChip status={review.status} />}
      </div>

      {review.status === 'not-adopted' && (
        <div className="mt-3 space-y-3">
          <p>
            Two weeks after {pet.name} goes home, we ask {a.answers.name} six questions and compare
            them with this plan. Mark them adopted to schedule it.
          </p>
          <Button size="sm" full={false} onClick={() => markAdopted(a)}>
            Mark adopted and schedule
          </Button>
        </div>
      )}

      {(review.status === 'upcoming' || review.status === 'due') && due && (
        <div className="mt-3 space-y-3">
          <p>
            {review.status === 'upcoming'
              ? `Goes out ${day(due)}. We send the adopter a link; no account needed.`
              : `Sent ${day(due)}. No reply yet.`}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" full={false} onClick={() => navigate(`/checkin/${a.id}`)}>
              Open it as the adopter
            </Button>
            <Button size="sm" variant="secondary" full={false} onClick={copy}>
              {copied ? 'Copied' : 'Copy check-in link'}
            </Button>
          </div>
        </div>
      )}

      {a.checkIn && (
        <div className="mt-3 space-y-4">
          <p className="text-sm">Received {when(a.checkIn.submittedAt).toLowerCase()}.</p>
          <ul className="space-y-1.5">
            {review.reasons.map((r) => (
              <li key={r} className="flex gap-2">
                <span
                  aria-hidden="true"
                  className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${review.status === 'well' ? 'bg-teal' : 'bg-orange'}`}
                />
                <span className="font-semibold text-navy">{r}</span>
              </li>
            ))}
          </ul>
          <PlanVsNow a={a} />
        </div>
      )}
    </section>
  )
}

// The core of the check-in: what they planned at the counter next to what is
// happening now.
function PlanVsNow({ a }: { a: Applicant }) {
  const c = a.checkIn!
  const rows: { label: string; plan: string; now: string; changed: boolean }[] = [
    {
      label: 'Hours alone',
      plan: `${a.answers.hoursAlone}`,
      now: `${c.hoursAlone}`,
      changed: c.hoursAlone > a.answers.hoursAlone,
    },
    {
      label: 'Daily care',
      plan: a.answers.dailyCare,
      now: c.careHolding,
      changed: c.careHolding !== 'Yes, as planned',
    },
    {
      label: 'Money',
      plan: `$1,500 bill: ${a.answers.vetBill.toLowerCase()}`,
      now: `Surprise costs: ${c.surpriseCost.toLowerCase()}`,
      changed: c.surpriseCost === '$200 or more',
    },
    {
      label: 'How it is going',
      plan: 'Ready to start',
      now: c.going,
      changed: c.going !== 'Settling in well',
    },
    {
      label: 'Thought of returning',
      plan: 'No',
      now: c.returnThought,
      changed: c.returnThought !== 'No',
    },
  ]
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <div className="grid grid-cols-[1fr_1fr_1fr] bg-canvas px-3 py-2 text-xs font-bold uppercase tracking-wide text-body/70">
        <span />
        <span>At adoption</span>
        <span>At week two</span>
      </div>
      {rows.map((r) => (
        <div
          key={r.label}
          className={`grid grid-cols-[1fr_1fr_1fr] gap-2 border-t border-line px-3 py-2 text-sm ${r.changed ? 'bg-peach/60' : ''}`}
        >
          <span className="font-semibold">{r.label}</span>
          <span className="text-navy">{r.plan}</span>
          <span className="font-bold text-navy">{r.now}</span>
        </div>
      ))}
      {c.helpWith.length > 0 && (
        <p className="border-t border-line px-3 py-2 text-sm">
          <span className="font-semibold">Asked for help with:</span> {c.helpWith.join(', ')}
        </p>
      )}
    </div>
  )
}

function Note({ a }: { a: Applicant }) {
  const [text, setText] = useState(a.note ?? '')
  const [saved, setSaved] = useState(false)
  return (
    <section className="fp-card p-4">
      <h2 className="text-lg font-extrabold">Notes for {shelter.short} staff</h2>
      <p className="text-xs text-body/70">
        Only your team sees these. They never change the result.
      </p>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setSaved(false)
        }}
        rows={4}
        placeholder="What did you talk about?"
        className="mt-2 w-full rounded-xl border border-line bg-canvas p-3 text-sm outline-none focus:border-teal"
      />
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          updateApplicant(a.id, (x) => ({ ...x, note: text.trim() }))
          setSaved(true)
        }}
      >
        {saved ? 'Saved' : 'Save note'}
      </Button>
    </section>
  )
}
