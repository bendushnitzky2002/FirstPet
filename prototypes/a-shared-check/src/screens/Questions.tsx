import type { FormEvent, ReactNode } from 'react'
import type { Check, SharedAnswers } from '../types'
import { DECIDING_OPTIONS, PET_OPTIONS } from '../data/questions'
import {
  SHARED_TITLES,
  SharedQuestion,
  isAnswered,
  type SharedId,
} from '../components/SharedQuestion'
import { Button, Guide, OptionButton, Page, Progress, TopBar } from '../components/ui'
import { navigate } from '../lib/router'

const STEPS = ['who', 'pet', 'zip', 'hours', 'overnights', 'vet', 'worries'] as const
const STEP_LABELS = [
  "Who's deciding",
  'Pet',
  'ZIP code',
  'Hours alone',
  'Nights away',
  'A surprise vet bill',
  'Worries',
]

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
          className="fp-input mb-6 min-h-[50px] w-full px-4 text-base"
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
        className="fp-input min-h-[60px] w-full max-w-xs px-5 text-center font-heading text-3xl font-bold tracking-[0.3em] placeholder:text-lg placeholder:font-normal placeholder:tracking-normal"
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
    <Page
      stage="answers"
      aside={
        <Guide
          eyebrow="Your check"
          title="Seven questions, about 5 minutes."
          steps={STEP_LABELS}
          current={step}
        >
          {check.deciding === 'solo'
            ? 'Next: we put your answers together and give you a verdict.'
            : 'Next: we invite your partner to answer four of these, then put you side by side.'}
        </Guide>
      }
    >
      <TopBar onBack={back} />
      <form onSubmit={onSubmit} className="fp-card flex flex-col p-6 sm:p-8">
        <Progress current={step + 1} total={STEPS.length} />
        <h1 className="text-[28px] leading-tight">{title}</h1>
        {help && <p className="mt-2 text-muted">{help}</p>}
        <div className="mt-6 max-w-[640px]">{body}</div>
        <div className="mt-8 flex justify-end border-t border-[#EDF0F3] pt-6">
          <Button type="submit" full={false} disabled={!canNext}>
            {step === STEPS.length - 1 ? 'Done' : 'Next'}
          </Button>
        </div>
      </form>
    </Page>
  )
}
