import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Answers, Check, FirstTake } from '../types'
import { firstYear, money, OVERNIGHT_OPTIONS, WALKER_HOURS } from '../data/costs'
import { navigate } from '../lib/router'
import { Button, Chip, Page, TopBar } from '../components/ui'
import { Receipt, SampleNote } from '../components/Receipt'

const LEAD: Record<FirstTake, string> = {
  no: "Fair. Let's see what it would take.",
  unsure: "Let's make it yours.",
  yes: "Let's check it against your household.",
}

// Four levers, one screen, and the number moves as you go.
export function Tune({ check, save }: { check: Check; save: (c: Check) => void }) {
  const { answers, pet } = check
  const number = firstYear(check.zip, pet, answers)
  const delta = useDelta(number.total)
  const flash = useNewLines(number.lines.map((l) => l.key))

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    save({
      ...check,
      answers: { ...answers, [key]: value },
      touched: check.touched.includes(key) ? check.touched : [...check.touched, key],
    })
  const guess = (key: keyof Answers) => !check.touched.includes(key)

  return (
    <Page>
      <TopBar onBack={() => navigate('/number')} />

      <h1 className="text-3xl font-extrabold">{LEAD[check.firstTake ?? 'unsure']}</h1>
      <p className="mt-2">Move each one to match your household. The number updates as you go.</p>

      {/* The number stays in view while the levers move it. */}
      <div className="sticky top-0 z-10 -mx-4 mt-5 bg-canvas/95 px-4 py-3 backdrop-blur sm:-mx-5 sm:px-5">
        <div className="flex items-center justify-between rounded-card bg-navy px-5 py-4 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
              Your first year
            </p>
            <p className="font-heading text-4xl font-extrabold leading-tight">
              {money(number.total)}
            </p>
          </div>
          <div className="text-right">
            {delta !== 0 && (
              <p
                key={`${number.total}`}
                className={`fp-pop inline-block rounded-full px-2 py-0.5 text-sm font-bold ${
                  delta > 0 ? 'bg-orange text-navy' : 'bg-teal text-white'
                }`}
              >
                {delta > 0 ? '+' : '−'}
                {money(Math.abs(delta))}
              </p>
            )}
            <p className="mt-1 text-sm text-white/80">{money(number.monthly)} a month of care</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <Lever
          title="On a normal weekday, how many hours is nobody home?"
          guess={guess('hoursAway')}
          hint={
            pet === 'dog'
              ? `${WALKER_HOURS} hours or more adds a midday walker.`
              : 'Cats handle a workday alone. No walker needed.'
          }
        >
          <Slider
            label="Hours nobody is home"
            min={0}
            max={12}
            step={1}
            value={answers.hoursAway}
            onChange={(v) => set('hoursAway', v)}
            show={(v) => `${v} ${v === 1 ? 'hour' : 'hours'}`}
          />
        </Lever>

        <Lever
          title="How many nights a month is nobody home overnight?"
          guess={guess('overnights')}
          hint="Each night away is a night with a sitter."
        >
          <div role="radiogroup" aria-label="Nights away" className="grid grid-cols-2 gap-2">
            {OVERNIGHT_OPTIONS.map((o) => (
              <Chip
                key={o.value}
                selected={answers.overnights === o.value}
                onClick={() => set('overnights', o.value)}
              >
                {o.label}
              </Chip>
            ))}
          </div>
        </Lever>

        <Lever
          title="How much do you already have set aside for a surprise vet bill?"
          guess={guess('saved')}
          hint={`The cushion for ${number.place} is ${money(number.cushion)}.`}
        >
          <Slider
            label="Already set aside"
            min={0}
            max={3000}
            step={50}
            value={answers.saved}
            onChange={(v) => set('saved', v)}
            show={(v) => (v >= 3000 ? '$3,000 or more' : money(v))}
          />
        </Lever>

        <Lever
          title="What could your household put toward a pet each month?"
          guess={guess('monthlyRoom')}
          hint={`Care here runs about ${money(number.monthly)} a month with your schedule.`}
        >
          <Slider
            label="Each month"
            min={0}
            max={800}
            step={10}
            value={answers.monthlyRoom}
            onChange={(v) => set('monthlyRoom', v)}
            show={(v) => `${money(v)} a month`}
          />
        </Lever>
      </div>

      <h2 className="mb-3 mt-10 text-xl font-extrabold">Line by line</h2>
      <Receipt number={number} flash={flash} />
      <div className="mt-2">
        <SampleNote number={number} />
      </div>

      <div className="mt-8">
        <Button onClick={() => navigate('/verdict')}>See our verdict</Button>
      </div>
    </Page>
  )
}

function Lever({
  title,
  hint,
  guess,
  children,
}: {
  title: string
  hint: string
  guess: boolean
  children: ReactNode
}) {
  return (
    <section className="fp-card p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold leading-snug">{title}</h2>
        {guess && (
          <span className="shrink-0 rounded-full bg-peach px-2 py-0.5 text-xs font-semibold text-navy">
            Our guess
          </span>
        )}
      </div>
      {children}
      <p className="mt-3 text-sm">{hint}</p>
    </section>
  )
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  show,
}: {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
  show: (v: number) => string
}) {
  return (
    <div>
      <p className="mb-2 font-heading text-2xl font-extrabold text-navy">{show(value)}</p>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-10 w-full cursor-pointer accent-teal"
      />
      <div className="flex justify-between text-xs text-body/70">
        <span>{show(min)}</span>
        <span>{show(max)}</span>
      </div>
    </div>
  )
}

// How much the total moved on the last change.
function useDelta(total: number) {
  const prev = useRef(total)
  const [delta, setDelta] = useState(0)
  useEffect(() => {
    if (total !== prev.current) {
      setDelta(total - prev.current)
      prev.current = total
    }
  }, [total])
  return delta
}

// Receipt lines that appeared since the last render, so they can flash.
function useNewLines(keys: string[]) {
  const prev = useRef(keys)
  const [fresh, setFresh] = useState<string[]>([])
  const joined = keys.join(',')
  useEffect(() => {
    const added = keys.filter((k) => !prev.current.includes(k))
    prev.current = keys
    if (added.length) setFresh(added)
  }, [joined])
  return fresh
}
