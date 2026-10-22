import { useState, type FormEvent } from 'react'
import type { Check, SharedAnswers } from '../types'
import {
  SHARED_TITLES,
  SharedQuestion,
  isAnswered,
  type SharedId,
} from '../components/SharedQuestion'
import { Button, LogoMark, Page, Progress, TopBar } from '../components/ui'
import { navigate } from '../lib/router'

const STEPS: SharedId[] = ['hours', 'overnights', 'vet', 'worries']

type Props = {
  code: string
  check: Check | null
  save: (check: Check) => void
}

// The partner's path. They arrive from the invite link and answer only the
// four shared questions, then go straight to the side by side screen.
export function Join({ code, check, save }: Props) {
  // -1 is the intro screen with the name field.
  const [step, setStep] = useState(-1)
  const [name, setName] = useState(check?.partner?.name ?? '')
  const [answers, setAnswers] = useState<SharedAnswers>(() => {
    const { hoursAlone, overnights, vetCost, worries } = check?.partner ?? {}
    return { hoursAlone, overnights, vetCost, worries }
  })

  if (!check) {
    return (
      <Page>
        <TopBar />
        <h1 className="text-3xl font-extrabold">We couldn't find check {code || 'that code'}.</h1>
        <p className="mt-4 text-lg">
          In this prototype a check lives in the browser where it started, with no account and no
          server. Open the link in that same browser, or start a check of your own.
        </p>
        <div className="mt-10 space-y-3">
          <Button onClick={() => navigate('/')}>Go to the start</Button>
        </div>
      </Page>
    )
  }

  const starter = check.starter.name || 'Your partner'

  if (step === -1) {
    const start = (e: FormEvent) => {
      e.preventDefault()
      if (name.trim()) setStep(0)
    }
    return (
      <Page>
        <form onSubmit={start} className="flex flex-1 flex-col justify-center py-10">
          <LogoMark size="lg" />
          <h1 className="mt-8 text-3xl font-extrabold leading-tight sm:text-4xl">
            {starter} started a readiness check for your household.
          </h1>
          <p className="mt-3 text-lg">Four quick questions about money and schedule. No account.</p>
          <label htmlFor="partner-name" className="mb-2 mt-10 block font-semibold text-navy">
            Your first name
          </label>
          <input
            id="partner-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            autoComplete="given-name"
            className="min-h-[56px] w-full rounded-card border-2 border-line bg-white px-5 text-lg text-navy focus:border-teal focus:outline-none"
          />
          <div className="mt-8">
            <Button type="submit" disabled={!name.trim()}>
              Start
            </Button>
          </div>
        </form>
      </Page>
    )
  }

  const id = STEPS[step]
  const canNext = isAnswered(id, answers)
  const next = (e: FormEvent) => {
    e.preventDefault()
    if (!canNext) return
    if (step < STEPS.length - 1) return setStep(step + 1)
    save({ ...check, partner: { name: name.trim(), done: true, ...answers } })
    navigate('/compare?from=partner')
  }

  return (
    <Page>
      <TopBar onBack={() => setStep(step - 1)} />
      <Progress current={step + 1} total={STEPS.length} />
      <form onSubmit={next} className="flex flex-1 flex-col">
        <h1 className="text-3xl font-extrabold leading-tight">{SHARED_TITLES[id].title}</h1>
        {SHARED_TITLES[id].help && <p className="mt-2">{SHARED_TITLES[id].help}</p>}
        <div className="mt-8">
          <SharedQuestion
            id={id}
            answers={answers}
            onChange={(p) => setAnswers({ ...answers, ...p })}
          />
        </div>
        <div className="mt-auto pt-10">
          <Button type="submit" disabled={!canNext}>
            {step === STEPS.length - 1 ? 'See what we both said' : 'Next'}
          </Button>
        </div>
      </form>
    </Page>
  )
}
