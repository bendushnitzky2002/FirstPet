import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Check } from '../types'
import { Button, LogoMark, Page } from '../components/ui'
import { navigate } from '../lib/router'
import { normalizeCode } from '../lib/storage'

type Props = {
  check: Check | null
  onStart: () => void
  onSeed: () => void
  onReset: () => void
}

export function Landing({ check, onStart, onSeed, onReset }: Props) {
  const [showCode, setShowCode] = useState(false)
  const [code, setCode] = useState('')

  // Hidden demo seed: press "d" three times within two seconds.
  const presses = useRef<number[]>([])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      if (e.key.toLowerCase() !== 'd') return
      const now = Date.now()
      presses.current = [...presses.current.filter((t) => now - t < 2000), now]
      if (presses.current.length >= 3) {
        presses.current = []
        onSeed()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onSeed])

  const submitCode = (e: FormEvent) => {
    e.preventDefault()
    const c = normalizeCode(code)
    if (c.length === 6) navigate(`/join?code=${c}`)
  }

  return (
    <Page>
      <div className="flex flex-1 flex-col justify-center py-10">
        <LogoMark size="lg" />
        <h1 className="mt-8 text-4xl font-extrabold leading-tight sm:text-5xl">
          Are you ready for a pet?
        </h1>
        <p className="mt-4 text-lg">
          A 10-minute check for your household. No account. The answer can be not yet.
        </p>

        {check && <ResumeCard check={check} onReset={onReset} />}

        <div className="mt-10">
          <Button onClick={onStart}>{check ? 'Start a new check' : 'Start the check'}</Button>
        </div>

        <div className="mt-6 text-center">
          {!showCode ? (
            <button
              type="button"
              onClick={() => setShowCode(true)}
              className="text-sm font-semibold text-teal underline-offset-4 hover:underline"
            >
              Have an invite code? Enter it here.
            </button>
          ) : (
            <form onSubmit={submitCode} className="mx-auto flex max-w-sm gap-2">
              <label htmlFor="invite-code" className="sr-only">
                Invite code
              </label>
              <input
                id="invite-code"
                autoFocus
                value={code}
                onChange={(e) => setCode(normalizeCode(e.target.value))}
                placeholder="6-character code"
                autoComplete="off"
                className="min-h-[48px] w-full rounded-full border-2 border-line bg-white px-5 text-center font-heading text-lg font-bold uppercase tracking-[0.3em] text-navy placeholder:text-sm placeholder:font-normal placeholder:tracking-normal focus:border-teal focus:outline-none"
              />
              <button
                type="submit"
                disabled={code.length !== 6}
                className="min-h-[48px] rounded-full bg-teal px-5 font-heading font-bold text-white disabled:bg-line disabled:text-body/60"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </div>
    </Page>
  )
}

function ResumeCard({ check, onReset }: { check: Check; onReset: () => void }) {
  const solo = check.deciding === 'solo'
  const partnerDone = !!check.partner?.done

  let title = 'You have a check in progress.'
  let actions = (
    <Button variant="secondary" onClick={() => navigate('/check')}>
      Pick up where you left off
    </Button>
  )

  if (check.starter.done && (solo || partnerDone)) {
    title = partnerDone
      ? `${check.partner!.name} answered. Your side by side is ready.`
      : 'Your check is done.'
    actions = (
      <Button variant="secondary" onClick={() => navigate('/compare')}>
        {partnerDone ? 'See it side by side' : 'See your answers'}
      </Button>
    )
  } else if (check.starter.done) {
    title = "We're waiting on your partner."
    actions = (
      <div className="grid gap-2 sm:grid-cols-2">
        <Button variant="secondary" onClick={() => navigate('/invite')}>
          See the invite
        </Button>
        <Button variant="secondary" onClick={() => navigate('/compare')}>
          Preview without them
        </Button>
      </div>
    )
  }

  return (
    <section className="fp-card mt-8 p-5">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal">
        Welcome back{check.starter.name ? `, ${check.starter.name}` : ''}
      </p>
      <p className="mb-4 mt-1 font-heading text-xl font-bold text-navy">{title}</p>
      {actions}
      <button
        type="button"
        onClick={onReset}
        className="mt-3 w-full text-center text-sm text-body underline-offset-4 hover:underline"
      >
        Start over and clear this check
      </button>
    </section>
  )
}
