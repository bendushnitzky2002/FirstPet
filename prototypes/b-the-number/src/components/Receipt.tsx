import { money, type FirstYear } from '../data/costs'
import { ShieldIcon } from './ui'

// The first-year number as an itemized receipt. The cushion is always its own
// line, marked Required, because the surprise vet bill is the fear we heard
// most in discovery.
export function Receipt({ number, flash = [] }: { number: FirstYear; flash?: string[] }) {
  return (
    <div className="fp-card overflow-hidden">
      <ul className="divide-y divide-line">
        {number.lines.map((line) =>
          line.required ? (
            <li key={line.key} className="flex items-start gap-3 bg-peach px-4 py-4">
              <span className="fp-icon-orange shrink-0 bg-white" aria-hidden="true">
                <ShieldIcon />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 font-semibold text-navy">
                  {line.label}
                  <span className="rounded-full bg-orange px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                    Required
                  </span>
                </p>
                <p className="text-sm">{line.detail}</p>
              </div>
              <p className="font-heading text-lg font-extrabold text-navy">{money(line.amount)}</p>
            </li>
          ) : (
            <li
              key={line.key}
              className={`flex items-start gap-3 px-4 py-3 ${flash.includes(line.key) ? 'fp-flash' : ''}`}
            >
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 font-semibold text-navy">
                  {line.label}
                  {line.oneTime && (
                    <span className="rounded-full bg-teal-light px-2 py-0.5 text-xs font-semibold text-teal">
                      One time
                    </span>
                  )}
                </p>
                <p className="text-sm">{line.detail}</p>
              </div>
              <p className="font-heading text-lg font-bold text-navy">{money(line.amount)}</p>
            </li>
          ),
        )}
      </ul>
      <div className="flex items-baseline justify-between border-t-2 border-navy/80 px-4 py-4">
        <p className="font-heading text-lg font-extrabold text-navy">First year</p>
        <p className="font-heading text-2xl font-extrabold text-navy">{money(number.total)}</p>
      </div>
    </div>
  )
}

export function SampleNote({ number }: { number: FirstYear }) {
  return (
    <p className="text-xs text-body/80">
      Sample numbers for this prototype. We wrote them; they are not from a vet or a survey.
      {number.isDefault && (
        <> We do not have numbers for ZIP {number.zip} yet, so this uses our default sample.</>
      )}
    </p>
  )
}
