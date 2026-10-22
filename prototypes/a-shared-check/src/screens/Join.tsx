import { useState, type FormEvent } from 'react'
import type { Check, SharedAnswers } from '../types'
import {
  SHARED_TITLES,
  SharedQuestion,
  isAnswered,
  type SharedId,
} from '../components/SharedQuestion'
import { Button, Guide, LogoMark, Page, Progress, TopBar } from '../components/ui'
import { navigate } from '../lib/router'

const STEPS: SharedId[] = ['hours', 'overnights', 'vet', 'worries']
const STEP_LABELS = ['Hours alone', 'Nights away', 'A surprise vet bill', 'Worries']

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
        <h1 className="text-[28px] leading-tight">We couldn't find check {code || 'that code'}.</h1>
        <p className="mt-3 max-w-2xl text-lg">
          In this prototype a check lives in the browser where it started, with no account and no
          server. Open the link in that same browser, or start a check of your own.
        </p>
        <div className="mt-8">
          <Button full={false} onClick={() => navigate('/')}>
            Go to the start
          </Button>
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
      <Page
        aside={
          <Guide
            eyebrow="Your part"
            title="Four quick questions, about 3 minutes."
            steps={STEP_LABELS}
          >
            Then we put your answers next to {starter}'s.
          </Guide>
        }
      >
        <form onSubmit={start} className="fp-card flex flex-col p-6 sm:p-8">
          <LogoMark />
          <h1 className="mt-5 text-[28px] leading-tight">
            {starter} started a readiness check for your household.
          </h1>
          <p className="mt-2 text-muted">
            Four quick questions about money and schedule. No account.
          </p>
          <label htmlFor="partner-name" className="mb-2 mt-8 block font-semibold text-navy">
            Your first name
          </label>
          <input
            id="partner-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            autoComplete="given-name"
            className="fp-input min-h-[50px] w-full max-w-md px-4"
          />
          <div className="mt-8 flex justify-end border-t border-[#EDF0F3] pt-6">
            <Button type="submit" full={false} disabled={!name.trim()}>
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
    <Page
      aside={
        <Guide
          eyebrow="Your part"
          title="Four quick questions, about 3 minutes."
          steps={STEP_LABELS}
          current={step}
        >
          Then we put your answers next to {starter}'s.
        </Guide>
      }
    >
      <TopBar onBack={() => setStep(step - 1)} />
      <form onSubmit={next} className="fp-card flex flex-col p-6 sm:p-8">
        <Progress current={step + 1} total={STEPS.length} />
        <h1 className="text-[28px] leading-tight">{SHARED_TITLES[id].title}</h1>
        {SHARED_TITLES[id].help && <p className="mt-2 text-muted">{SHARED_TITLES[id].help}</p>}
        <div className="mt-6 max-w-[640px]">
          <SharedQuestion
            id={id}
            answers={answers}
            onChange={(p) => setAnswers({ ...answers, ...p })}
          />
        </div>
        <div className="mt-8 flex justify-end border-t border-[#EDF0F3] pt-6">
          <Button type="submit" full={false} disabled={!canNext}>
            {step === STEPS.length - 1 ? 'See what we both said' : 'Next'}
          </Button>
        </div>
      </form>
    </Page>
  )
}
