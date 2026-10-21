import { useEffect, useRef, useState } from 'react'
import type { Check, Pet } from '../types'
import { lookup, SAMPLE_ZIPS } from '../data/costs'
import { navigate } from '../lib/router'
import { Button, Chip, LogoMark, Page } from '../components/ui'

type Props = {
  check: Check | null
  onStart: (zip: string, pet: Pet) => void
  onSeed: () => void
  onReset: () => void
}

export function Landing({ check, onStart, onSeed, onReset }: Props) {
  const [zip, setZip] = useState('')
  const [pet, setPet] = useState<Pet>('dog')
  const valid = /^\d{5}$/.test(zip)

  useSeedShortcut(onSeed)

  return (
    <Page>
      <div className="flex flex-1 flex-col justify-center">
        <LogoMark size="lg" />
        <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">
          What does a first pet really cost where you live?
        </h1>
        <p className="mt-4 text-lg">
          Your ZIP code is all we need. We show the first-year number, with an emergency cushion
          built in, before we ask anything else.
        </p>

        <form
          className="fp-card mt-8 space-y-5 p-5"
          onSubmit={(e) => {
            e.preventDefault()
            if (valid) onStart(zip, pet)
          }}
        >
          <div>
            <label htmlFor="zip" className="mb-2 block font-heading font-bold text-navy">
              ZIP code
            </label>
            <input
              id="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="5 digits"
              className="w-full rounded-card border-2 border-line bg-white px-4 py-3 font-heading text-3xl font-extrabold tracking-[0.2em] text-navy placeholder:text-base placeholder:font-semibold placeholder:tracking-normal placeholder:text-body/50 focus:border-teal focus:outline-none"
            />
            <p className="mt-2 text-sm text-body/80">
              Try{' '}
              {SAMPLE_ZIPS.map((z, i) => (
                <span key={z}>
                  <button
                    type="button"
                    onClick={() => setZip(z)}
                    className="font-semibold text-teal underline-offset-4 hover:underline"
                  >
                    {z}
                  </button>{' '}
                  ({lookup(z)?.place}){i < SAMPLE_ZIPS.length - 1 ? ', ' : '.'}
                </span>
              ))}
            </p>
          </div>

          <div>
            <p className="mb-2 font-heading font-bold text-navy">For a</p>
            <div role="radiogroup" aria-label="Pet" className="flex gap-3">
              <Chip selected={pet === 'dog'} onClick={() => setPet('dog')}>
                Dog
              </Chip>
              <Chip selected={pet === 'cat'} onClick={() => setPet('cat')}>
                Cat
              </Chip>
            </div>
          </div>

          <Button type="submit" disabled={!valid}>
            Show me the number
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">No account. No email. The answer can be not yet.</p>

        {check && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-card bg-teal-light px-4 py-3 text-sm">
            <span>
              You have a check in progress for ZIP {check.zip}, {check.pet}.
            </span>
            <span className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(check.firstTake ? '/tune' : '/number')}
                className="font-semibold text-teal underline-offset-4 hover:underline"
              >
                Pick up where you left off
              </button>
              <button
                type="button"
                onClick={onReset}
                className="font-semibold text-body underline-offset-4 hover:underline"
              >
                Start over
              </button>
            </span>
          </div>
        )}
      </div>
    </Page>
  )
}

// Press "d" three times (outside a text box) to load the demo check.
function useSeedShortcut(onSeed: () => void) {
  const presses = useRef<number[]>([])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      if (e.key.toLowerCase() !== 'd') {
        presses.current = []
        return
      }
      const now = Date.now()
      presses.current = [...presses.current.filter((t) => now - t < 1500), now]
      if (presses.current.length >= 3) {
        presses.current = []
        onSeed()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onSeed])
}
