import type { Check } from '../types'
import { firstYear, money } from '../data/costs'

export function CostBlock({ check }: { check: Check }) {
  const c = firstYear(check)
  const petWord =
    c.pet === 'unsure' ? 'a dog (the higher estimate, since you are not sure yet)' : `a ${c.pet}`

  return (
    <section className="fp-card p-5 sm:p-6">
      <h2 className="text-xl font-extrabold">First-year cost</h2>
      <p className="mt-1 text-sm">
        For {petWord} in {c.isDefault ? `ZIP ${c.zip}` : `${c.place} ${c.zip}`}.
      </p>

      <dl className="mt-5 divide-y divide-line">
        <Line label="Routine vet care" value={money(c.routineVet)} />
        <Line label="Food and supplies" value={money(c.foodSupplies)} />
        <Line
          label="Sitter for nights away"
          note={
            c.sitterNights
              ? `About ${c.sitterNights} nights a year at ${money(c.sitterPerDay)}`
              : `None planned. A sitter or walker runs ${money(c.sitterPerDay)} a day here.`
          }
          value={money(c.sitter)}
        />
        <Line label="First year" value={money(c.subtotal)} strong />
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-card bg-peach px-4 py-3">
        <div>
          <p className="font-heading font-bold text-navy">
            Emergency cushion{' '}
            <span className="ml-1 rounded-full bg-orange px-2 py-0.5 align-middle text-xs font-bold uppercase tracking-wide text-navy">
              Required
            </span>
          </p>
          <p className="text-sm">Set aside before adoption day, for the surprise vet bill.</p>
        </div>
        <p className="font-heading text-xl font-extrabold text-navy">{money(c.cushion)}</p>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <p className="font-heading font-bold text-navy">Plan for, with the cushion</p>
        <p className="font-heading text-2xl font-extrabold text-navy">{money(c.total)}</p>
      </div>

      <p className="mt-4 text-xs text-body/80">
        {c.isDefault ? 'Estimated from national averages; local data coming. ' : ''}
        Sample numbers for this prototype.
      </p>
    </section>
  )
}

function Line({
  label,
  value,
  note,
  strong,
}: {
  label: string
  value: string
  note?: string
  strong?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt>
        <span className={strong ? 'font-heading font-bold text-navy' : ''}>{label}</span>
        {note && <span className="block text-xs text-body/80">{note}</span>}
      </dt>
      <dd
        className={`font-heading tabular-nums ${strong ? 'text-lg font-extrabold text-navy' : 'font-bold text-navy'}`}
      >
        {value}
      </dd>
    </div>
  )
}
