import { useState } from 'react'
import { PetCard, StepRail } from '../components/shelter'
import { Button, CheckIcon, Guide, OptionButton, Page, Progress } from '../components/ui'
import { reviewCheckIn } from '../data/checkin'
import { getPet, shelter } from '../data/shelter'
import { navigate } from '../lib/router'
import { newId, updateApplicant, useStore } from '../lib/storage'
import type {
  CareHolding,
  CheckIn as CheckInAnswers,
  Going,
  Help,
  ReturnThought,
  SurpriseCost,
} from '../types'
import { HoursSlider } from './Check'
import { NotFound } from './NotFound'

const going: Going[] = ['Settling in well', 'Some bumps', 'Harder than we expected']
const surprise: SurpriseCost[] = ['None', 'Under $200', '$200 or more']
const holding: CareHolding[] = ['Yes, as planned', 'Mostly', "No, it's falling on one person"]
const returning: ReturnThought[] = ['No', "It's crossed my mind", "Yes, we're thinking about it"]
const help: Help[] = ['Training or behavior', 'A vet question', 'Finding a sitter or walker']

// The adopter's week-two check-in, opened from a link the shelter sends.
export function CheckIn({ id }: { id: string }) {
  const { applicants } = useStore()
  const a = applicants.find((x) => x.id === id)
  const [step, setStep] = useState(-1)
  const [c, setC] = useState<Partial<CheckInAnswers>>({ helpWith: [] })
  if (!a) return <NotFound />

  const pet = getPet(a.petId)
  const firstName = a.answers.name.split(' ')[0]

  if (a.checkIn) return <Thanks id={id} />

  const set = (patch: Partial<CheckInAnswers>) => setC((x) => ({ ...x, ...patch }))

  const steps = [
    { title: `How is it going with ${pet.name}?`, ok: !!c.going },
    {
      title: `On a normal weekday, how many hours is ${pet.name} alone?`,
      hint: `You planned about ${a.answers.hoursAlone}.`,
      ok: true,
    },
    { title: `Any costs for ${pet.name} you didn't expect?`, ok: !!c.surpriseCost },
    {
      title: `Is the daily care plan holding?`,
      hint: `You planned: ${a.answers.dailyCare}.`,
      ok: !!c.careHolding,
    },
    {
      title: `Has returning ${pet.name} crossed your mind?`,
      hint: `An honest answer helps ${shelter.short} help you. It won't count against you.`,
      ok: !!c.returnThought,
    },
    { title: 'Would help with any of these be useful?', hint: 'Pick any, or none.', ok: true },
  ]

  if (step === -1) {
    return (
      <Page aside={<PetCard pet={pet} compact />}>
        <span className="fp-eyebrow">{shelter.name}</span>
        <h1 className="text-[28px] leading-tight sm:text-[34px]">
          Hi {firstName}. It's been two weeks with {pet.name}.
        </h1>
        <p className="mt-2 text-lg">
          Six quick questions so {shelter.short} can help early if something is hard. About 2
          minutes.
        </p>
        <section className="fp-card mt-6 p-6">
          <StepRail current={4} />
        </section>
        <div className="mt-6">
          <Button full={false} onClick={() => setStep(0)}>
            Start the check-in
          </Button>
        </div>
      </Page>
    )
  }

  const s = steps[step]
  const last = step === steps.length - 1

  const submit = () => {
    const now = new Date().toISOString()
    const answers: CheckInAnswers = {
      submittedAt: now,
      going: c.going!,
      hoursAlone: c.hoursAlone ?? a.answers.hoursAlone,
      surpriseCost: c.surpriseCost!,
      careHolding: c.careHolding!,
      returnThought: c.returnThought!,
      helpWith: c.helpWith ?? [],
    }
    updateApplicant(a.id, (x) => {
      const next = { ...x, checkIn: answers }
      const status = reviewCheckIn(next).status
      const flag =
        status === 'call'
          ? 'Flagged: call this week.'
          : status === 'message'
            ? 'Flagged: send a note.'
            : 'Doing well.'
      return {
        ...next,
        activity: [
          ...x.activity,
          { id: newId(), at: now, title: 'Week-two check-in received', detail: flag },
        ],
      }
    })
  }

  return (
    <Page
      aside={
        <Guide
          eyebrow={`Week two with ${pet.name}`}
          title="Six quick questions, about 2 minutes."
          steps={[
            'How it is going',
            'Hours alone',
            'Surprise costs',
            'Daily care',
            'Returning',
            'Help',
          ]}
          current={step}
        >
          Your answers go to {shelter.short} so they can help early.
        </Guide>
      }
    >
      <button
        type="button"
        onClick={() => setStep(step - 1)}
        className="-ml-2 inline-flex h-10 w-fit items-center rounded-lg px-2 text-sm font-bold text-muted hover:text-teal"
      >
        Back
      </button>
      <section className="fp-card mt-2 flex flex-col p-6 sm:p-8">
        <Progress current={step + 1} total={steps.length} />
        <h1 className="text-[28px] leading-tight">{s.title}</h1>
        {s.hint && <p className="mt-2 text-muted">{s.hint}</p>}

        <div className="mt-6 max-w-[640px] space-y-3">
          {step === 0 &&
            going.map((o) => (
              <OptionButton key={o} selected={c.going === o} onClick={() => set({ going: o })}>
                {o}
              </OptionButton>
            ))}
          {step === 1 && (
            <HoursSlider
              value={c.hoursAlone ?? a.answers.hoursAlone}
              onChange={(v) => set({ hoursAlone: v })}
            />
          )}
          {step === 2 &&
            surprise.map((o) => (
              <OptionButton
                key={o}
                selected={c.surpriseCost === o}
                onClick={() => set({ surpriseCost: o })}
              >
                {o}
              </OptionButton>
            ))}
          {step === 3 &&
            holding.map((o) => (
              <OptionButton
                key={o}
                selected={c.careHolding === o}
                onClick={() => set({ careHolding: o })}
              >
                {o}
              </OptionButton>
            ))}
          {step === 4 &&
            returning.map((o) => (
              <OptionButton
                key={o}
                selected={c.returnThought === o}
                onClick={() => set({ returnThought: o })}
              >
                {o}
              </OptionButton>
            ))}
          {step === 5 &&
            help.map((o) => {
              const picked = c.helpWith ?? []
              const on = picked.includes(o)
              return (
                <OptionButton
                  key={o}
                  multi
                  selected={on}
                  onClick={() =>
                    set({ helpWith: on ? picked.filter((x) => x !== o) : [...picked, o] })
                  }
                >
                  {o}
                </OptionButton>
              )
            })}
        </div>

        <div className="mt-8 flex justify-end border-t border-[#EDF0F3] pt-6">
          <Button
            full={false}
            disabled={!s.ok}
            onClick={() => (last ? submit() : setStep(step + 1))}
          >
            {last ? `Send to ${shelter.short}` : 'Next'}
          </Button>
        </div>
      </section>
    </Page>
  )
}

function Thanks({ id }: { id: string }) {
  const { applicants } = useStore()
  const a = applicants.find((x) => x.id === id)!
  const pet = getPet(a.petId)
  const status = reviewCheckIn(a).status
  return (
    <Page>
      <div className="flex flex-1 flex-col justify-center">
        <span className="fp-icon-teal h-14 w-14">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h1 className="mt-6 text-[28px] leading-tight sm:text-[34px]">
          Thanks. {shelter.short} will see this today.
        </h1>
        <p className="mt-2 text-lg">
          {status === 'call'
            ? `It sounds like the first two weeks have been hard. Someone from ${shelter.short} will reach out this week to help with ${pet.name}.`
            : status === 'message'
              ? `${shelter.short} will send you a note about what you asked.`
              : `It sounds like ${pet.name} is settling in. Give them a scratch from us.`}
        </p>
        <div className="mt-8">
          <Button full={false} onClick={() => navigate(`/counselor/a/${id}`)}>
            See what the counselor sees
          </Button>
        </div>
      </div>
    </Page>
  )
}
