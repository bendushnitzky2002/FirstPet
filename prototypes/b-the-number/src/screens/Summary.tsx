import type { Check } from '../types'
import { decide, VERDICT_COPY } from '../data/verdict'
import { money, OVERNIGHT_OPTIONS } from '../data/costs'
import { FIRST_TAKE_LABEL, LAST_TAKES } from '../data/takes'
import { navigate } from '../lib/router'
import { Button, LogoMark, Page, TopBar } from '../components/ui'
import { Receipt, SampleNote } from '../components/Receipt'

// One printable page. Something to keep, and to bring to the first vet visit.
export function Summary({ check }: { check: Check }) {
  const v = decide(check)
  const { answers } = check
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const nights = OVERNIGHT_OPTIONS.find((o) => o.value === answers.overnights)!.label

  return (
    <Page>
      <TopBar onBack={() => navigate('/verdict')} />

      <header className="flex items-center gap-4">
        <LogoMark />
        <div>
          <h1 className="text-2xl font-extrabold">Our first-year number</h1>
          <p className="text-sm">
            A {check.pet} in {v.number.place} (ZIP {check.zip}), {today}
          </p>
        </div>
      </header>

      <section className="mt-6 rounded-card border-2 border-navy px-5 py-4">
        <p className="text-sm font-semibold uppercase tracking-wide">Verdict</p>
        <p className="font-heading text-3xl font-extrabold text-navy">
          {VERDICT_COPY[v.kind].title}
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {v.reasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      {v.changes.length > 0 && (
        <section className="mt-5">
          <h2 className="text-lg font-extrabold">What would change the answer</h2>
          <ul className="mt-2 space-y-1">
            {v.changes.map((c) => (
              <li key={c} className="flex gap-2">
                <span aria-hidden="true">☐</span>
                {c}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-5">
        <Receipt number={v.number} />
        <div className="mt-2">
          <SampleNote number={v.number} />
        </div>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <p>Weekday hours nobody home</p>
        <p className="font-semibold text-navy">{answers.hoursAway}</p>
        <p>Nights away a month</p>
        <p className="font-semibold text-navy">{nights}</p>
        <p>Set aside today</p>
        <p className="font-semibold text-navy">{money(answers.saved)}</p>
        <p>Each month for a pet</p>
        <p className="font-semibold text-navy">{money(answers.monthlyRoom)}</p>
        {check.firstTake && (
          <>
            <p>First reaction to the number</p>
            <p className="font-semibold text-navy">{FIRST_TAKE_LABEL[check.firstTake]}</p>
          </>
        )}
        {check.lastTake && (
          <>
            <p>After the verdict</p>
            <p className="font-semibold text-navy">
              {LAST_TAKES.find((t) => t.value === check.lastTake)!.label}
            </p>
          </>
        )}
      </section>

      <p className="mt-6 rounded-card bg-teal-light px-4 py-3 text-sm">
        Bring this page to your first vet visit. It helps your vet plan the first year with you.
      </p>

      <div className="mt-8 space-y-3 print:hidden">
        <Button onClick={() => window.print()}>Print or save as PDF</Button>
        <Button variant="secondary" onClick={() => navigate('/verdict')}>
          Back to the verdict
        </Button>
      </div>
    </Page>
  )
}
