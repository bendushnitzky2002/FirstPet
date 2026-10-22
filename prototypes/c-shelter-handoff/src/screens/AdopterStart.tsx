import { useState } from 'react'
import { PetCard, StepRail } from '../components/shelter'
import { BackLink, Button, CheckIcon, Page } from '../components/ui'
import { getPet, pets, shelter } from '../data/shelter'
import { day, time } from '../lib/format'
import { navigate } from '../lib/router'
import { setState, useStore } from '../lib/storage'

// What the adopter sees when the shelter sends them the link (or hands them a
// tablet at the counter). The shelter is the one asking, not FirstPet.
export function AdopterStart({ petId, requestId }: { petId?: string; requestId?: string }) {
  const { draft, requests } = useStore()
  const request = requests.find((r) => r.id === requestId)
  const available = pets.filter((p) => p.available)
  const [chosen, setChosen] = useState(petId ?? draft?.petId ?? available[0].id)
  const pet = getPet(chosen)
  const canResume = draft && draft.step > 0 && draft.requestId === request?.id

  const start = () => {
    setState((s) => ({
      ...s,
      draft: {
        petId: chosen,
        requestId: request?.id,
        step: 0,
        answers: request ? { name: request.name } : {},
      },
    }))
    navigate('/check')
  }

  return (
    <Page
      aside={
        <section className="fp-guide">
          <span className="fp-eyebrow text-[#90D2D0]">{shelter.name}</span>
          <h2 className="text-lg leading-snug">
            About 5 minutes. Your counselor goes over it with you.
          </h2>
          <div className="my-4 h-px bg-white/10" />
          <ul className="space-y-3 text-sm">
            {[
              'Free. No account. Your answers go only to ' + shelter.short + '.',
              `We'll give you a first-year cost for ${pet.name}.`,
              "The answer can be not yet. If it is, we'll say what would change it.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="fp-guide-num">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2">
            <Button onClick={start}>Start the check</Button>
            {canResume && (
              <button
                type="button"
                onClick={() => navigate('/check')}
                className="fp-btn min-h-[44px] w-full border-white/20 text-sm text-white hover:bg-white/10"
              >
                Pick up where you left off
              </button>
            )}
          </div>
        </section>
      }
    >
      <BackLink onClick={() => navigate('/')}>Home</BackLink>
      <div className="pb-6 pt-2">
        <span className="fp-eyebrow">{shelter.name} with FirstPet</span>
        <h1 className="text-[28px] leading-tight sm:text-[34px]">
          Before you visit, we ask every adopter to take a readiness check.
        </h1>
        {request && (
          <p className="mt-4 rounded-[11px] bg-[#E3F0EE] px-4 py-3 font-semibold text-navy">
            Hi {request.name.split(' ')[0]}. Your visit is {day(new Date(request.visitAt))} at{' '}
            {time(new Date(request.visitAt))}.
          </p>
        )}
      </div>

      <section className="fp-card p-6">
        <StepRail current={1} />
      </section>

      <h2 className="mt-7 text-lg">Who are you hoping to meet?</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2" role="radiogroup">
        {available.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={p.id === chosen}
            onClick={() => setChosen(p.id)}
            className={`block w-full rounded-card text-left ring-offset-2 ${p.id === chosen ? 'ring-2 ring-teal' : ''}`}
          >
            <PetCard pet={p} />
          </button>
        ))}
      </div>
    </Page>
  )
}
