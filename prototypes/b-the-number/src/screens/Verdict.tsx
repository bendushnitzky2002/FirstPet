import { useState } from 'react'
import type { Check, LastTake } from '../types'
import { money } from '../data/costs'
import { decide, VERDICT_COPY, type VerdictKind } from '../data/verdict'
import { navigate } from '../lib/router'
import { Button, CheckIcon, Page, TopBar } from '../components/ui'
import { FIRST_TAKE_LABEL, LAST_TAKES } from '../data/takes'

const TONE: Record<VerdictKind, string> = {
  ready: 'bg-teal-light text-navy',
  'ready-once': 'bg-peach text-navy',
  'not-yet': 'bg-navy text-white',
}

type Props = { check: Check; save: (c: Check) => void; onReset: () => void }

export function Verdict({ check, save, onReset }: Props) {
  const v = decide(check)
  const copy = VERDICT_COPY[v.kind]
  const [done, setDone] = useState<number[]>([])
  const toggle = (i: number) =>
    setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))

  const guesses = 4 - check.touched.length

  return (
    <Page>
      <TopBar onBack={() => navigate('/tune')} />

      <section className={`rounded-card px-5 py-6 ${TONE[v.kind]}`}>
        <p className="text-sm font-semibold uppercase tracking-wide opacity-80">Our verdict</p>
        <h1
          className={`mt-1 text-4xl font-extrabold leading-tight sm:text-5xl ${v.kind === 'not-yet' ? 'text-white' : ''}`}
        >
          {copy.title}
        </h1>
        <p className="mt-2 text-lg">{copy.sub}</p>
      </section>

      {guesses > 0 && (
        <p className="mt-3 rounded-card border border-orange/50 bg-white px-4 py-2 text-sm">
          {guesses === 1 ? 'One answer is' : `${guesses} answers are`} still our guess.{' '}
          <button
            type="button"
            onClick={() => navigate('/tune')}
            className="font-semibold text-teal underline-offset-4 hover:underline"
          >
            Set {guesses === 1 ? 'it' : 'them'} for your household
          </button>
        </p>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-extrabold">Why</h2>
        <ul className="mt-3 space-y-2">
          {v.reasons.map((r) => (
            <li key={r} className="flex gap-3">
              <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      {v.changes.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-extrabold">What would change the answer</h2>
          <ul className="mt-3 space-y-2">
            {v.changes.map((c, i) => (
              <li key={c}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={done.includes(i)}
                  onClick={() => toggle(i)}
                  className="fp-card flex w-full items-start gap-3 p-4 text-left"
                >
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                      done.includes(i) ? 'border-teal bg-teal text-white' : 'border-line'
                    }`}
                  >
                    {done.includes(i) && <CheckIcon className="h-4 w-4" />}
                  </span>
                  <span className={done.includes(i) ? 'line-through opacity-60' : ''}>{c}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="fp-card mt-8 grid grid-cols-3 divide-x divide-line text-center">
        <Stat label="First year" value={money(v.number.total)} />
        <Stat label="Each month" value={money(v.monthly)} />
        <Stat label="Cushion" value={money(v.number.cushion)} />
      </section>
      <button
        type="button"
        onClick={() => navigate('/tune')}
        className="mt-2 text-sm font-semibold text-teal underline-offset-4 hover:underline"
      >
        Adjust the numbers
      </button>

      <section className="mt-10 rounded-card bg-teal-light p-5">
        <h2 className="text-xl font-extrabold">Where are you now?</h2>
        {check.firstTake && (
          <p className="mt-1 text-sm">
            When you first saw the number, you said: "{FIRST_TAKE_LABEL[check.firstTake]}"
          </p>
        )}
        <div role="radiogroup" aria-label="Where are you now" className="mt-4 space-y-2">
          {LAST_TAKES.map((t) => (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={check.lastTake === t.value}
              onClick={() => save({ ...check, lastTake: t.value as LastTake })}
              className={`flex min-h-[52px] w-full items-center gap-3 rounded-card border-2 bg-white px-4 py-3 text-left font-semibold ${
                check.lastTake === t.value ? 'border-teal text-navy' : 'border-white'
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  check.lastTake === t.value ? 'border-teal bg-teal text-white' : 'border-line'
                }`}
              >
                {check.lastTake === t.value && <CheckIcon className="h-3 w-3" />}
              </span>
              {t.label}
            </button>
          ))}
        </div>
        {check.lastTake && <p className="mt-3 text-sm">Thanks. We put this on your summary.</p>}
      </section>

      <div className="mt-8 space-y-3">
        <Button onClick={() => navigate('/summary')}>Save this as a one-page summary</Button>
        <Button variant="secondary" onClick={onReset}>
          Start over
        </Button>
      </div>
    </Page>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-4">
      <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-1 font-heading text-xl font-extrabold text-navy sm:text-2xl">{value}</p>
    </div>
  )
}
