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
      <div className="flex flex-1 flex-col justify-center py-6 sm:py-10">
        <section className="fp-hero p-6 sm:p-8">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/10"
          />
          <LogoMark size="lg" />
          <span className="fp-eyebrow mt-6 text-[#90D2D0]">Free readiness check</span>
          <h1 className="text-4xl leading-tight text-white sm:text-5xl">
            Are you ready for a pet?
          </h1>
          <p className="mt-4 text-lg text-[#B9CAD3]">
            A 10-minute check for your household. No account. The answer can be not yet.
          </p>
          <div className="mt-8">
            <Button onClick={onStart}>{check ? 'Start a new check' : 'Start the check'}</Button>
          </div>
        </section>

        {check && <ResumeCard check={check} onReset={onReset} />}

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
                className="fp-input min-h-[48px] w-full px-5 text-center font-heading text-lg font-bold uppercase tracking-[0.3em] text-navy placeholder:text-sm placeholder:font-normal placeholder:tracking-normal"
              />
              <button
                type="submit"
                disabled={code.length !== 6}
                className="fp-btn fp-btn-primary min-h-[48px] px-5"
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
      <p className="fp-eyebrow">
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
