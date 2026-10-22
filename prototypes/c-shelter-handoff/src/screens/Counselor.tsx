import { useState, type ReactNode } from 'react'
import {
  AlertIcon,
  Avatar,
  BackLink,
  ChevronRight,
  LogoMark,
  Page,
  SampleNote,
  StatusChip,
  VerdictChip,
} from '../components/ui'
import { checkInDue, daysUntil, reviewCheckIn, type CheckInStatus } from '../data/checkin'
import { getPet, shelter } from '../data/shelter'
import { decideVerdict, type VerdictKind } from '../data/verdict'
import { day, when } from '../lib/format'
import { navigate } from '../lib/router'
import { useStore } from '../lib/storage'
import type { Applicant } from '../types'
import { PlansTab, upcoming, UpgradeTeaser, VisitsTab } from './Visits'

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
  const needsAttention = reviews.filter(
    (x) => x.r.status === 'call' || x.r.status === 'message',
  ).length

  return (
    <Page wide>
      <BackLink onClick={() => navigate('/')}>Home</BackLink>
      <header className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <LogoMark />
          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-teal">
              Adoption counter
            </p>
            <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">{shelter.name}</h1>
          </div>
        </div>
      </header>

      <nav
        className="-mx-4 mt-6 flex gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0"
        aria-label="Workspace"
      >
        <TabLink active={tab === 'visits'} onClick={() => navigate('/counselor')}>
          <span className="hidden sm:inline">Upcoming visits</span>
          <span className="sm:hidden">Visits</span>{' '}
          <Count n={upcoming(applicants).length + requests.length} />
        </TabLink>
        <TabLink active={tab === 'checkins'} onClick={() => navigate('/counselor/checkins')}>
          <span className="hidden sm:inline">Week-two check-ins</span>
          <span className="sm:hidden">Check-ins</span>{' '}
          {needsAttention > 0 && <Count n={needsAttention} hot />}
        </TabLink>
        <TabLink active={tab === 'adopters'} onClick={() => navigate('/counselor/adopters')}>
          <span className="hidden sm:inline">All adopters</span>
          <span className="sm:hidden">Adopters</span>
        </TabLink>
        <TabLink active={tab === 'plans'} onClick={() => navigate('/counselor/plans')}>
          Plans
        </TabLink>
      </nav>

      {toCall.length > 0 && tab !== 'plans' && (
        <button
          type="button"
          onClick={() => navigate(`/counselor/a/${toCall[0].a.id}`)}
          className="mt-6 flex w-full items-center gap-4 rounded-card border-2 border-orange bg-peach p-4 text-left"
        >
          <span className="fp-icon-orange shrink-0 bg-white">
            <AlertIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-bold uppercase tracking-wide text-[#9a5b06]">
              Call this week
            </span>
            <span className="block font-heading font-extrabold text-navy">
              {toCall[0].a.answers.name}: {toCall[0].r.reasons[0]}.
            </span>
            <span className="block text-sm">
              From their week-two check-in with {getPet(toCall[0].a.petId).name}.
              {toCall.length > 1 && ` ${toCall.length - 1} more to call.`}
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-teal" />
        </button>
      )}

      {tab === 'visits' && <VisitsTab applicants={applicants} requests={requests} />}
      {tab === 'adopters' && <AdoptersTab applicants={applicants} />}
      {tab === 'checkins' && <CheckInsTab reviews={reviews} />}
      {tab === 'plans' && <PlansTab />}
    </Page>
  )
}

function TabLink({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`-mb-px inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 font-heading text-sm font-bold sm:text-base ${
        active ? 'border-teal text-navy' : 'border-transparent text-body/70 hover:text-navy'
      }`}
    >
      {children}
    </button>
  )
}

function Count({ n, hot = false }: { n: number; hot?: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs ${hot ? 'bg-orange text-navy' : 'bg-teal-light text-teal'}`}
    >
      {n}
    </span>
  )
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
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Checks before a visit" value={rows.length} />
        <Metric label="Ready" value={counts.ready} />
        <Metric label="Ready once" value={counts['ready-once']} />
        <Metric label="Not yet" value={counts['not-yet']} />
      </div>

      <section className="fp-card mt-6 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search adopter or pet"
            className="min-h-[44px] flex-1 rounded-full border border-line bg-canvas px-4 outline-none focus:border-teal"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | VerdictKind)}
            aria-label="Filter by readiness result"
            className="min-h-[44px] rounded-full border border-line bg-white px-4 font-semibold text-navy"
          >
            {filters.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden grid-cols-[2fr_1.2fr_1.2fr_1fr_24px] gap-4 border-b border-line bg-canvas px-4 py-2 text-xs font-bold uppercase tracking-wide text-body/70 md:grid">
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
              className="grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 border-b border-line px-4 py-3 text-left last:border-b-0 hover:bg-canvas md:grid-cols-[2fr_1.2fr_1.2fr_1fr_24px]"
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

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="fp-card p-4">
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-1 font-heading text-3xl font-extrabold text-navy">{value}</p>
    </div>
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
      <p className="mt-6">
        Two weeks after each adoption we ask the adopter six questions and compare the answers with
        their plan. People to call are at the top.
      </p>
      <section className="fp-card mt-4 overflow-hidden">
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
                className="flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left last:border-b-0 hover:bg-canvas"
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
      <UpgradeTeaser />
      <div className="mt-4">
        <SampleNote>Sample adopters. Dates move with today so check-ins are always due.</SampleNote>
      </div>
    </>
  )
}
