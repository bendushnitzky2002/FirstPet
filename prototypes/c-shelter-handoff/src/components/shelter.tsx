import { firstYearCost, money } from '../data/costs'
import type { Pet } from '../data/shelter'
import { shelter } from '../data/shelter'
import type { Verdict } from '../data/verdict'
import { verdictLabel } from '../data/verdict'
import { CheckIcon, PawIcon, SampleNote } from './ui'

// The shelter's adoption steps. The readiness check is step one, and the
// week-two check-in closes the loop. This rail is the hypothesis made visible.
const steps = [
  'Readiness check',
  'Talk with a counselor',
  'Meet and take home',
  'Week-two check-in',
]

export function StepRail({ current }: { current: number }) {
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label={`${shelter.short} adoption steps`}>
      {steps.map((label, i) => {
        const n = i + 1
        const done = n < current
        const here = n === current
        return (
          <li key={label} className="flex flex-col items-center gap-1 text-center">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full font-heading text-sm font-extrabold ${
                done
                  ? 'bg-teal text-white'
                  : here
                    ? 'bg-orange text-navy ring-4 ring-peach'
                    : 'border-2 border-line bg-white text-body/60'
              }`}
            >
              {done ? <CheckIcon className="h-4 w-4" /> : n}
            </span>
            <span
              className={`text-[11px] leading-tight sm:text-xs ${here ? 'font-bold text-navy' : 'text-body/80'}`}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export function PetCard({ pet, compact = false }: { pet: Pet; compact?: boolean }) {
  return (
    <div className="fp-card flex gap-4 p-4">
      <span
        aria-hidden="true"
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
          pet.species === 'dog' ? 'bg-peach text-orange' : 'bg-teal-light text-teal'
        }`}
      >
        <PawIcon className="h-7 w-7" />
      </span>
      <div className="min-w-0">
        <p className="font-heading text-lg font-extrabold text-navy">{pet.name}</p>
        <p className="text-sm">{pet.description}</p>
        {!compact && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {pet.needs.map((n) => (
              <li key={n} className="rounded-full bg-canvas px-2.5 py-0.5 text-xs font-semibold">
                {n}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export function CostCard({ pet }: { pet: Pet }) {
  const cost = firstYearCost(pet)
  return (
    <section className="fp-card p-5">
      <h3 className="text-lg font-extrabold">First year with {pet.name}</h3>
      <p className="mb-3 text-sm">
        {shelter.area} area, for a {pet.description}.
      </p>
      <dl className="divide-y divide-line text-sm">
        {cost.lines.map((l) => (
          <div key={l.label} className="flex justify-between gap-4 py-2">
            <dt>{l.label}</dt>
            <dd className="font-semibold text-navy">{money(l.amount)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 py-2 font-bold text-navy">
          <dt>First-year total</dt>
          <dd>{money(cost.total)}</dd>
        </div>
      </dl>
      <div className="mt-2 flex items-center justify-between gap-4 rounded-xl bg-peach px-4 py-3">
        <div>
          <p className="font-bold text-navy">Emergency cushion</p>
          <p className="text-xs">Set aside before day one, on top of the total</p>
        </div>
        <div className="text-right">
          <p className="font-heading text-xl font-extrabold text-navy">{money(cost.cushion)}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-[#9a5b06]">Required</p>
        </div>
      </div>
      <div className="mt-3">
        <SampleNote>Sample numbers for this prototype, not a quote.</SampleNote>
      </div>
    </section>
  )
}

const bigStyle = {
  ready: 'bg-teal-light border-teal',
  'ready-once': 'bg-peach border-orange',
  'not-yet': 'bg-white border-navy',
}

export function VerdictBlock({ verdict, who }: { verdict: Verdict; who: 'adopter' | 'counselor' }) {
  return (
    <section className={`rounded-card border-2 p-5 sm:p-6 ${bigStyle[verdict.kind]}`}>
      <p className="text-sm font-bold uppercase tracking-wide text-body/80">
        {who === 'adopter' ? 'Your result' : 'Readiness result'}
      </p>
      <h2 className="mt-1 text-3xl font-extrabold leading-tight sm:text-4xl">
        {verdictLabel[verdict.kind]}
      </h2>
      <ul className="mt-4 space-y-1.5">
        {verdict.reasons.map((r) => (
          <li key={r} className="flex gap-2">
            <span
              aria-hidden="true"
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-navy/50"
            />
            <span>{r}</span>
          </li>
        ))}
      </ul>
      {verdict.checklist.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 font-heading font-bold text-navy">
            {verdict.kind === 'not-yet' ? 'What would change this' : 'Before the adoption'}
          </p>
          <ul className="space-y-2">
            {verdict.checklist.map((c) => (
              <li key={c} className="flex gap-3 rounded-xl bg-white/80 px-3 py-2">
                <span
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 border-navy/40"
                />
                <span className="font-semibold text-navy">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
