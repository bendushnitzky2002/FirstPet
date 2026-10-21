import { useState } from 'react'
import { BackLink, Button, OptionButton, Page, Progress } from '../components/ui'
import { getPet, type Pet } from '../data/shelter'
import { navigate } from '../lib/router'
import { newId, setState, useStore } from '../lib/storage'
import type { Answers, Backup, Home, Household, VetBill, Worry } from '../types'

type Step = {
  key: keyof Answers
  title: (pet: Pet) => string
  hint?: (pet: Pet) => string
}

const steps: Step[] = [
  {
    key: 'name',
    title: () => "What's your name?",
    hint: () => 'So your counselor knows who they are talking to.',
  },
  { key: 'household', title: () => 'Who lives in your home?' },
  { key: 'home', title: () => 'Do you own or rent?' },
  {
    key: 'hoursAlone',
    title: (p) => `On a normal weekday, how many hours would ${p.name} be alone?`,
  },
  {
    key: 'dailyCare',
    title: (p) =>
      p.species === 'dog'
        ? `Who will do ${p.name}'s daily walks and meals?`
        : `Who will do ${p.name}'s daily meals and litter?`,
    hint: () => 'Use names. "Everyone" usually means nobody.',
  },
  { key: 'backup', title: (p) => `When you travel, who looks after ${p.name}?` },
  { key: 'vetBill', title: () => 'If a vet visit cost $1,500 tomorrow, how would that feel?' },
  { key: 'worries', title: () => 'What worries you most?', hint: () => 'Pick any, or none.' },
]

const options: Partial<Record<keyof Answers, string[]>> = {
  household: ['Just me', 'Me and a partner', 'Family with kids', 'Roommates'] satisfies Household[],
  home: [
    'We own our home',
    'We rent, and the landlord said yes',
    "We rent, and haven't asked yet",
  ] satisfies Home[],
  backup: ['Family or a friend nearby', "We'd pay a sitter", 'No plan yet'] satisfies Backup[],
  vetBill: ['Fine', 'Tight but doable', 'Not possible right now'] satisfies VetBill[],
  worries: [
    'The cost',
    'Having enough time',
    'How the kids will do',
    "My partner isn't sure",
    "I don't know where to start",
  ] satisfies Worry[],
}

export function Check() {
  const { draft } = useStore()

  if (!draft) {
    return (
      <Page>
        <h1 className="text-3xl font-extrabold">There's no check in progress.</h1>
        <div className="mt-6">
          <Button onClick={() => navigate('/start')}>Start the check</Button>
        </div>
      </Page>
    )
  }

  const pet = getPet(draft.petId)
  const step = steps[draft.step]
  const a = draft.answers

  const set = (patch: Partial<Answers>) =>
    setState((s) =>
      s.draft ? { ...s, draft: { ...s.draft, answers: { ...s.draft.answers, ...patch } } } : s,
    )

  const go = (delta: number) =>
    setState((s) => (s.draft ? { ...s, draft: { ...s.draft, step: s.draft.step + delta } } : s))

  const finish = () => {
    const id = newId()
    const answers: Answers = {
      name: a.name!.trim(),
      household: a.household!,
      home: a.home!,
      hoursAlone: a.hoursAlone ?? 4,
      dailyCare: a.dailyCare!.trim(),
      backup: a.backup!,
      vetBill: a.vetBill!,
      worries: a.worries ?? [],
    }
    const now = new Date().toISOString()
    setState((s) => ({
      applicants: [
        {
          id,
          petId: draft.petId,
          answers,
          submittedAt: now,
          activity: [
            {
              id: 'a1',
              at: now,
              title: 'Readiness check done',
              detail: 'Shared with Maple Street.',
            },
          ],
        },
        ...s.applicants,
      ],
    }))
    navigate(`/done/${id}`)
  }

  const answered = isAnswered(step.key, a)
  const last = draft.step === steps.length - 1

  return (
    <Page>
      <BackLink onClick={() => (draft.step === 0 ? navigate('/start') : go(-1))}>Back</BackLink>
      <div className="mt-2">
        <Progress current={draft.step + 1} total={steps.length} />
      </div>

      <h1 className="text-3xl font-extrabold leading-tight">{step.title(pet)}</h1>
      {step.hint && <p className="mt-2">{step.hint(pet)}</p>}

      <div className="mt-6 flex-1 space-y-3">
        <Field step={step} answers={a} set={set} />
      </div>

      <div className="mt-8">
        <Button disabled={!answered} onClick={() => (last ? finish() : go(1))}>
          {last ? 'See my result' : 'Next'}
        </Button>
      </div>
    </Page>
  )
}

function isAnswered(key: keyof Answers, a: Partial<Answers>): boolean {
  if (key === 'name') return !!a.name?.trim()
  if (key === 'dailyCare') return !!a.dailyCare?.trim()
  if (key === 'hoursAlone' || key === 'worries') return true
  return a[key] !== undefined
}

function Field({
  step,
  answers: a,
  set,
}: {
  step: Step
  answers: Partial<Answers>
  set: (patch: Partial<Answers>) => void
}) {
  const key = step.key

  if (key === 'name' || key === 'dailyCare') {
    return (
      <TextField
        key={key}
        value={a[key] ?? ''}
        placeholder={
          key === 'name' ? 'First and last name' : 'For example: me mornings, Sam evenings'
        }
        onChange={(v) => set({ [key]: v })}
      />
    )
  }

  if (key === 'hoursAlone') {
    const h = a.hoursAlone ?? 4
    return <HoursSlider value={h} onChange={(v) => set({ hoursAlone: v })} />
  }

  if (key === 'worries') {
    const picked = a.worries ?? []
    return (
      <>
        {options.worries!.map((o) => {
          const w = o as Worry
          const on = picked.includes(w)
          return (
            <OptionButton
              key={o}
              multi
              selected={on}
              onClick={() => set({ worries: on ? picked.filter((x) => x !== w) : [...picked, w] })}
            >
              {o}
            </OptionButton>
          )
        })}
      </>
    )
  }

  return (
    <>
      {options[key]!.map((o) => (
        <OptionButton key={o} selected={a[key] === o} onClick={() => set({ [key]: o })}>
          {o}
        </OptionButton>
      ))}
    </>
  )
}

function TextField({
  value,
  placeholder,
  onChange,
}: {
  value: string
  placeholder: string
  onChange: (v: string) => void
}) {
  const [v, setV] = useState(value)
  return (
    <input
      autoFocus
      value={v}
      placeholder={placeholder}
      onChange={(e) => {
        setV(e.target.value)
        onChange(e.target.value)
      }}
      className="w-full rounded-card border-2 border-line bg-white px-5 py-4 text-lg font-semibold text-navy outline-none placeholder:font-normal placeholder:text-body/50 focus:border-teal"
    />
  )
}

export function HoursSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="fp-card p-6">
      <p className="text-center font-heading text-5xl font-extrabold text-navy">
        {value}
        {value === 12 ? '+' : ''}
        <span className="ml-2 text-xl font-bold text-body">{value === 1 ? 'hour' : 'hours'}</span>
      </p>
      <input
        type="range"
        min={0}
        max={12}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Hours alone on a normal weekday"
        className="mt-6 h-3 w-full cursor-pointer accent-teal"
      />
      <div className="mt-1 flex justify-between text-sm">
        <span>0</span>
        <span>6</span>
        <span>12+</span>
      </div>
    </div>
  )
}
