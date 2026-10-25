import type { Check } from '../types'
import { getVerdict } from '../data/verdict'
import { PET_OPTIONS } from '../data/questions'
import { CompareTable } from '../components/CompareTable'
import { CostBlock } from '../components/CostBlock'
import { useState } from 'react'
import { PremiumSurvey } from '../components/PremiumSurvey'
import { Button, LogoMark, SparkleIcon, TopBar } from '../components/ui'
import { navigate } from '../lib/router'
import { VERDICT_TONE } from './Verdict'

// Printable one-page summary. The buttons hide when printing.
export function Summary({ check, save }: { check: Check; save: (c: Check) => void }) {
  const v = getVerdict(check)
  const [premiumOpen, setPremiumOpen] = useState(false)
  const people = [check.starter.name, ...(check.partner?.done ? [check.partner.name] : [])].join(
    ' and ',
  )
  const pet = PET_OPTIONS.find((p) => p.value === check.pet)?.label ?? ''
  const date = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-16 pt-6 print:max-w-none print:p-0 print:text-[12px]">
      <TopBar onBack={() => navigate('/verdict')} />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 print:hidden">
        <Button onClick={() => window.print()}>Print or save as PDF</Button>
        <Button variant="secondary" onClick={() => navigate('/verdict')}>
          Back to the verdict
        </Button>
      </div>

      <article className="fp-card p-6 sm:p-8 print:border-0 print:p-0">
        <header className="flex items-center gap-4 border-b border-line pb-4">
          <LogoMark />
          <div className="flex-1">
            <p className="font-heading text-xl font-extrabold text-navy">
              FirstPet readiness summary
            </p>
            <p className="text-sm">
              {people}
              {pet ? `, thinking about: ${pet.toLowerCase()}` : ''}. {date}. Check {check.code}.
            </p>
          </div>
        </header>

        {v.basedOnOne && (
          <p className="mt-4 rounded-lg bg-peach px-3 py-2 text-sm font-semibold text-navy">
            This is based on one person's answers. Your partner hasn't answered yet.
          </p>
        )}

        <section className={`mt-4 rounded-card px-5 py-4 ${VERDICT_TONE[v.kind].bg}`}>
          <p className="text-xs font-bold uppercase tracking-wide">Our verdict</p>
          <p className={`font-heading text-3xl font-extrabold ${VERDICT_TONE[v.kind].text}`}>
            {v.title}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy">
            {v.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        {v.todo.length > 0 && (
          <section className="mt-5">
            <h2 className="text-lg font-extrabold">{v.todoTitle}</h2>
            <ul className="mt-2 space-y-1">
              {v.todo.map((t) => (
                <li key={t.id} className="flex items-start gap-2">
                  <span className="mt-0.5 inline-block h-4 w-4 shrink-0 rounded border-2 border-body/60 text-center text-[10px] leading-3">
                    {check.checked.includes(t.id) ? '✓' : ''}
                  </span>
                  {t.text}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2 print:mt-4 print:grid-cols-2 print:gap-4">
          <section>
            <h2 className="mb-1 text-lg font-extrabold">What each of us said</h2>
            <CompareTable check={check} compact />
          </section>
          <section>
            <CostBlock check={check} />
          </section>
        </div>
      </article>

      {/* Second, quiet entry to the Premium question. The household shares this
          page with the partner, so it reaches the second decision maker. Still
          one answer per household. Hidden when printing. */}
      <div className="mt-6 print:hidden">
        {premiumOpen ? (
          <PremiumSurvey check={check} save={save} from="summary" />
        ) : (
          <p className="text-sm text-muted">
            Premium takes over after adoption day.{' '}
            <button
              type="button"
              onClick={() => setPremiumOpen(true)}
              className="inline-flex items-center gap-1 font-bold text-orange-ink underline-offset-4 hover:underline"
            >
              <SparkleIcon className="fp-sparkle h-4 w-4" />
              See Premium
            </button>
          </p>
        )}
      </div>
    </main>
  )
}
