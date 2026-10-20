import type { FormEvent, ReactNode } from 'react'
import type { Check, SharedAnswers } from '../types'
import { DECIDING_OPTIONS, PET_OPTIONS } from '../data/questions'
import {
  SHARED_TITLES,
  SharedQuestion,
  isAnswered,
  type SharedId,
} from '../components/SharedQuestion'
import { Button, OptionButton, Page, Progress, TopBar } from '../components/ui'
import { navigate } from '../lib/router'

const STEPS = ['who', 'pet', 'zip', 'hours', 'overnights', 'vet', 'worries'] as const

type Props = {
  check: Check
  save: (check: Check) => void
}

export function Questions({ check, save }: Props) {
  const step = Math.min(check.step, STEPS.length - 1)
  const id = STEPS[step]
  const s = check.starter

  const update = (patch: Partial<Check>) => save({ ...check, ...patch })
  const updateStarter = (patch: SharedAnswers & { name?: string }) =>
    update({ starter: { ...s, ...patch } })

  const back = () => (step === 0 ? navigate('/') : update({ step: step - 1 }))
  const next = () => {
    if (step < STEPS.length - 1) return update({ step: step + 1 })
    save({ ...check, starter: { ...s, done: true } })
    navigate(check.deciding === 'solo' ? '/compare' : '/invite')
  }

  let title = ''
  let help: string | undefined
  let body: ReactNode
  let canNext = true

  if (id === 'who') {
    title = "First, who's deciding?"
    help = "If it's more than you, we'll invite them after your questions."
    canNext = !!s.name.trim() && !!check.deciding
    body = (
      <>
        <label htmlFor="first-name" className="mb-2 block font-semibold text-navy">
          Your first name
        </label>
        <input
          id="first-name"
          value={s.name}
          onChange={(e) => updateStarter({ name: e.target.value })}
          placeholder="e.g. Sam"
          autoComplete="given-name"
          className="mb-6 min-h-[56px] w-full rounded-card border-2 border-line bg-white px-5 text-lg text-navy focus:border-teal focus:outline-none"
        />
        <div className="space-y-3" role="radiogroup" aria-label="Who's deciding">
          {DECIDING_OPTIONS.map((o) => (
            <OptionButton
              key={o.value}
              selected={check.deciding === o.value}
              onClick={() => update({ deciding: o.value })}
            >
              {o.label}
            </OptionButton>
          ))}
        </div>
      </>
    )
  } else if (id === 'pet') {
    title = 'What are you thinking about?'
    canNext = !!check.pet
    body = (
      <div className="space-y-3" role="radiogroup">
        {PET_OPTIONS.map((o) => (
          <OptionButton
            key={o.value}
            selected={check.pet === o.value}
            onClick={() => update({ pet: o.value })}
          >
            {o.label}
          </OptionButton>
        ))}
      </div>
    )
  } else if (id === 'zip') {
    title = "What's your ZIP code?"
    help = 'We use it to estimate local costs.'
    canNext = /^\d{5}$/.test(check.zip ?? '')
    body = (
      <input
        aria-label="ZIP code"
        inputMode="numeric"
        autoComplete="postal-code"
        value={check.zip ?? ''}
        onChange={(e) => update({ zip: e.target.value.replace(/\D/g, '').slice(0, 5) })}
        placeholder="5 digits"
        className="min-h-[64px] w-full rounded-card border-2 border-line bg-white px-5 text-center font-heading text-3xl font-bold tracking-[0.3em] text-navy placeholder:text-lg placeholder:font-normal placeholder:tracking-normal focus:border-teal focus:outline-none"
      />
    )
  } else {
    const sid = id as SharedId
    title = SHARED_TITLES[sid].title
    help = SHARED_TITLES[sid].help
    canNext = isAnswered(sid, s)
    body = (
      <SharedQuestion
        id={sid}
        answers={s}
        onChange={updateStarter}
        hidePartnerWorry={check.deciding === 'solo'}
      />
    )
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (canNext) next()
  }

  return (
    <Page>
      <TopBar onBack={back} />
      <Progress current={step + 1} total={STEPS.length} />
      <form onSubmit={onSubmit} className="flex flex-1 flex-col">
        <h1 className="text-3xl font-extrabold leading-tight">{title}</h1>
        {help && <p className="mt-2">{help}</p>}
        <div className="mt-8">{body}</div>
        <div className="mt-auto pt-10">
          <Button type="submit" disabled={!canNext}>
            {step === STEPS.length - 1 ? 'Done' : 'Next'}
          </Button>
        </div>
      </form>
    </Page>
  )
}
