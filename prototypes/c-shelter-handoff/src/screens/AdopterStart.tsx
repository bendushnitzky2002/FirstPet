import { useState } from 'react'
import { PetCard, StepRail } from '../components/shelter'
import { BackLink, Button, CheckIcon, LogoMark, Page } from '../components/ui'
import { getPet, pets, shelter } from '../data/shelter'
import { navigate } from '../lib/router'
import { setState, useStore } from '../lib/storage'

// What the adopter sees when the shelter sends them the link (or hands them a
// tablet at the counter). The shelter is the one asking, not FirstPet.
export function AdopterStart({ petId }: { petId?: string }) {
  const { draft } = useStore()
  const available = pets.filter((p) => p.available)
  const [chosen, setChosen] = useState(petId ?? draft?.petId ?? available[0].id)
  const pet = getPet(chosen)
  const canResume = draft && draft.step > 0

  const start = () => {
    setState((s) => ({ ...s, draft: { petId: chosen, step: 0, answers: {} } }))
    navigate('/check')
  }

  return (
    <Page>
      <BackLink onClick={() => navigate('/')}>Home</BackLink>

      <div className="mt-2 flex items-center gap-3">
        <LogoMark />
        <div>
          <p className="font-heading font-extrabold text-navy">{shelter.name}</p>
          <p className="text-sm">with FirstPet</p>
        </div>
      </div>

      <h1 className="mt-6 text-3xl font-extrabold leading-tight">
        Before you visit, we ask every adopter to take a readiness check.
      </h1>
      <p className="mt-2 text-lg">
        It takes about 5 minutes. Your counselor goes over it with you at the counter.
      </p>

      <div className="mt-6">
        <StepRail current={1} />
      </div>

      <h2 className="mt-8 text-xl font-extrabold">Who are you hoping to meet?</h2>
      <div className="mt-3 space-y-2" role="radiogroup">
        {available.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={p.id === chosen}
            onClick={() => setChosen(p.id)}
            className={`block w-full rounded-card text-left ring-offset-2 ${p.id === chosen ? 'ring-2 ring-teal' : ''}`}
          >
            <PetCard pet={p} compact={p.id !== chosen} />
          </button>
        ))}
      </div>

      <ul className="mt-6 space-y-2">
        {[
          'No account. Your answers go only to ' + shelter.short + '.',
          `We'll give you a first-year cost for ${pet.name}.`,
          "The answer can be not yet. If it is, we'll say what would change it.",
        ].map((t) => (
          <li key={t} className="flex gap-2">
            <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-3">
        <Button onClick={start}>Start the check</Button>
        {canResume && (
          <Button variant="quiet" onClick={() => navigate('/check')}>
            Pick up where you left off
          </Button>
        )}
      </div>
    </Page>
  )
}
