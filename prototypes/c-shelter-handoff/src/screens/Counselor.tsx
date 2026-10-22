import { useState } from 'react'
import { Workspace } from '../components/workspace'
import {
  AlertIcon,
  Avatar,
  ChevronRight,
  Metric,
  PageHead,
  SampleNote,
  StatusChip,
  VerdictChip,
} from '../components/ui'
import { checkInDue, daysUntil, reviewCheckIn, type CheckInStatus } from '../data/checkin'
import { getPet } from '../data/shelter'
import { decideVerdict, type VerdictKind } from '../data/verdict'
import { day, when } from '../lib/format'
import { navigate } from '../lib/router'
import { useStore } from '../lib/storage'
import type { Applicant } from '../types'
import { PlansTab, UpgradeTeaser, VisitsTab } from './Visits'

// The counselor's workspace. The adopter list and its layout are adapted from
// Sala's Shelter Workspace prototype, rebuilt around the readiness verdict and
// the week-two check-in.

export const tabs = ['visits', 'adopters', 'checkins', 'plans'] as const
export type Tab = (typeof tabs)[number]

function lastActivity(a: Applicant): string {
  return (
    a.activity
      .map((x) => x.at)
      .sort()
      .reverse()[0] ?? a.submittedAt
  )
}

export function Counselor({ tab }: { tab: Tab }) {
  const { applicants, requests } = useStore()
  const reviews = applicants.map((a) => ({ a, r: reviewCheckIn(a) }))
  const toCall = reviews.filter((x) => x.r.status === 'call')

  const head = heads[tab]

  return (
    <Workspace section={tab}>
      <PageHead eyebrow="Adoption counter" title={head.title}>
        {head.copy}
      </PageHead>

      {toCall.length > 0 && tab !== 'plans' && (
        <button
          type="button"
          onClick={() => navigate(`/counselor/a/${toCall[0].a.id}`)}
          className="mb-5 grid w-full grid-cols-[38px_1fr_auto] items-center gap-3.5 rounded-[11px] border border-[#F0B99C] bg-[#FFF6F0] px-[18px] py-[15px] text-left hover:border-orange hover:bg-[#FFEFE5]"
        >
          <span className="grid h-[38px] w-[38px] place-items-center rounded-[9px] bg-[#FFDDCB] text-[#A74D22]">
            <AlertIcon />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-extrabold uppercase tracking-[0.08em] text-orange-ink">
              Call this week
            </span>
            <span className="block font-heading font-extrabold text-navy">
              {toCall[0].a.answers.name}: {toCall[0].r.reasons[0]}.
            </span>
            <span className="block text-sm text-[#7C6659]">
              From their week-two check-in with {getPet(toCall[0].a.petId).name}.
              {toCall.length > 1 && ` ${toCall.length - 1} more to call.`}
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-navy" />
        </button>
      )}

      {tab === 'visits' && <VisitsTab applicants={applicants} requests={requests} />}
      {tab === 'adopters' && <AdoptersTab applicants={applicants} />}
      {tab === 'checkins' && <CheckInsTab reviews={reviews} />}
      {tab === 'plans' && <PlansTab />}
    </Workspace>
  )
}

const heads: Record<Tab, { title: string; copy: string }> = {
  visits: {
    title: 'Upcoming visits',
    copy: 'Every adopter gets a free readiness check before they visit. Here is who is coming in, how ready they are, and what is still missing.',
  },
  checkins: {
    title: 'Week-two check-ins',
    copy: 'Two weeks after each adoption we ask the adopter six questions and compare the answers with their plan. People to call are at the top.',
  },
  adopters: {
    title: 'All adopters',
    copy: 'Everyone who took the readiness check, with their result and where they are in adoption.',
  },
  plans: {
    title: 'Plans',
    copy: 'The readiness check, summaries, and check-ins are free for shelters. We never charge for an adoption.',
  },
}

const filters: { value: 'all' | VerdictKind; label: string }[] = [
  { value: 'all', label: 'All results' },
  { value: 'ready', label: 'Ready' },
  { value: 'ready-once', label: 'Ready once' },
  { value: 'not-yet', label: 'Not yet' },
]

function AdoptersTab({ applicants }: { applicants: Applicant[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | VerdictKind>('all')
  const rows = applicants
    .map((a) => ({ a, pet: getPet(a.petId), v: decideVerdict(a.answers, getPet(a.petId)) }))
    .sort((x, y) => lastActivity(y.a).localeCompare(lastActivity(x.a)))
  const counts = {
    ready: rows.filter((r) => r.v.kind === 'ready').length,
    'ready-once': rows.filter((r) => r.v.kind === 'ready-once').length,
    'not-yet': rows.filter((r) => r.v.kind === 'not-yet').length,
  }
  const q = search.trim().toLowerCase()
  const shown = rows.filter(
    (r) =>
      (filter === 'all' || r.v.kind === filter) &&
      (!q || r.a.answers.name.toLowerCase().includes(q) || r.pet.name.toLowerCase().includes(q)),
  )

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric label="Checks before a visit" value={rows.length} />
        <Metric label="Ready" value={counts.ready} />
        <Metric label="Ready once" value={counts['ready-once']} />
        <Metric label="Not yet" value={counts['not-yet']} />
      </div>

      <section className="fp-card mt-5 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search adopter or pet"
            className="fp-input flex-1 px-4"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | VerdictKind)}
            aria-label="Filter by readiness result"
            className="fp-input px-4 font-semibold"
          >
            {filters.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden grid-cols-[2fr_1.2fr_1.2fr_1fr_24px] gap-4 border-b border-[#EDF0F3] bg-[#F7F9FA] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[#7D8897] md:grid">
          <span>Adopter</span>
          <span>Readiness</span>
          <span>Stage</span>
          <span>Last activity</span>
          <span />
        </div>
        {shown.length ? (
          shown.map(({ a, pet, v }) => (
            <button
              key={a.id}
              type="button"
              onClick={() => navigate(`/counselor/a/${a.id}`)}
              className="fp-row grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-5 py-3.5 md:grid-cols-[2fr_1.2fr_1.2fr_1fr_24px]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <Avatar name={a.answers.name} tone={v.kind === 'ready' ? 'teal' : 'orange'} />
                <span className="min-w-0">
                  <span className="block truncate font-bold text-navy">{a.answers.name}</span>
                  <span className="block truncate text-sm">
                    for {pet.name}, {pet.description}
                  </span>
                </span>
              </span>
              <span className="justify-self-end md:justify-self-start">
                <VerdictChip kind={v.kind} />
              </span>
              <span className="text-sm">
                {a.adoptedAt ? `Adopted ${day(new Date(a.adoptedAt))}` : 'Check done, not met yet'}
              </span>
              <span className="justify-self-end text-sm md:justify-self-start">
                {when(lastActivity(a))}
              </span>
              <ChevronRight className="hidden h-5 w-5 text-teal md:block" />
            </button>
          ))
        ) : (
          <p className="p-6 text-center">No adopters match. Try another search or result.</p>
        )}
      </section>
    </>
  )
}

const statusOrder: CheckInStatus[] = ['call', 'message', 'due', 'upcoming', 'well']

function CheckInsTab({
  reviews,
}: {
  reviews: { a: Applicant; r: ReturnType<typeof reviewCheckIn> }[]
}) {
  const adopted = reviews
    .filter((x) => x.r.status !== 'not-adopted')
    .sort((x, y) => statusOrder.indexOf(x.r.status) - statusOrder.indexOf(y.r.status))

  return (
    <>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="fp-card overflow-hidden">
          <div className="fp-panel-head">
            <div>
              <h2>Adopters with a pet at home</h2>
              <p>Sorted by who needs you first.</p>
            </div>
          </div>
          {adopted.length ? (
            adopted.map(({ a, r }) => {
              const pet = getPet(a.petId)
              const due = checkInDue(a)!
              const detail =
                r.status === 'upcoming'
                  ? `Goes out ${day(due)}, in ${daysUntil(due)} ${daysUntil(due) === 1 ? 'day' : 'days'}`
                  : r.status === 'due'
                    ? `Sent ${day(due)}. No reply yet.`
                    : r.reasons[0]
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => navigate(`/counselor/a/${a.id}`)}
                  className="fp-row flex items-center gap-3 px-5 py-3.5"
                >
                  <Avatar
                    name={a.answers.name}
                    tone={r.status === 'call' || r.status === 'message' ? 'orange' : 'teal'}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-navy">
                      {a.answers.name} <span className="font-normal">with {pet.name}</span>
                    </span>
                    <span className="block text-sm">{detail}</span>
                  </span>
                  <StatusChip status={r.status} />
                  <ChevronRight className="hidden h-5 w-5 shrink-0 text-teal sm:block" />
                </button>
              )
            })
          ) : (
            <p className="p-6 text-center">
              No adoptions yet. Mark an adopter as adopted to schedule one.
            </p>
          )}
        </section>
        <aside className="space-y-4">
          <section className="fp-guide">
            <span className="fp-eyebrow text-[#90D2D0]">How we flag</span>
            <h2 className="text-lg leading-snug">Call first, then send a note.</h2>
            <div className="my-4 h-px bg-white/10" />
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="fp-guide-num bg-orange text-white">!</span>
                <span>
                  <strong className="block text-white">Call this week</strong>A sign the adoption
                  might not last.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="fp-guide-num">2</span>
                <span>
                  <strong className="block text-white">Send a note</strong>They asked for help or
                  something changed from their plan.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="fp-guide-num">3</span>
                <span>
                  <strong className="block text-white">Doing well</strong>Nothing to do.
                </span>
              </li>
            </ul>
          </section>
          <UpgradeTeaser />
        </aside>
      </div>
      <div className="mt-4">
        <SampleNote>Sample adopters. Dates move with today so check-ins are always due.</SampleNote>
      </div>
    </>
  )
}
