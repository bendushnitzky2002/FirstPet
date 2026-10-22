import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Check } from '../types'
import { Button, CheckIcon, Guide, Page } from '../components/ui'
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
    <Page
      aside={
        <>
          {check && <ResumeCard check={check} onReset={onReset} />}
          <Guide
            eyebrow="How it works"
            title="Start alone, invite your partner, decide together."
            steps={[
              'Answer seven questions',
              'Invite your partner to answer four',
              'See your answers side by side',
              'Get a first-year cost and a verdict',
            ]}
          >
            The check and the verdict are free. The verdict can be ready, ready once a few things
            change, or not yet.
          </Guide>
        </>
      }
    >
      <section className="fp-hero flex min-h-[300px] flex-col justify-center p-6 sm:p-10">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10"
        />
        <span className="fp-eyebrow text-[#90D2D0]">Free readiness check</span>
        <h1 className="max-w-[620px] text-4xl leading-tight text-white sm:text-5xl">
          Are you ready for a pet?
        </h1>
        <p className="mt-4 max-w-[560px] text-lg text-[#B9CAD3]">
          A 10-minute check for your household. No account. The answer can be not yet.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button full={false} onClick={onStart}>
            {check ? 'Start a new check' : 'Start the check'}
          </Button>
          {!showCode && (
            <button
              type="button"
              onClick={() => setShowCode(true)}
              className="text-sm font-bold text-[#90D2D0] underline-offset-4 hover:underline"
            >
              Have an invite code? Enter it here.
            </button>
          )}
        </div>
        {showCode && (
          <form onSubmit={submitCode} className="mt-5 flex max-w-sm gap-2">
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
              className="fp-input min-h-[46px] w-full px-4 text-center font-heading text-lg font-bold uppercase tracking-[0.3em] text-navy placeholder:text-sm placeholder:font-normal placeholder:tracking-normal"
            />
            <button
              type="submit"
              disabled={code.length !== 6}
              className="fp-btn fp-btn-primary min-h-[46px] px-5"
            >
              Join
            </button>
          </form>
        )}
      </section>

      <div className="fp-stagger mt-5 grid gap-4 sm:grid-cols-3">
        {[
          [
            'Local cost',
            'A first-year cost for your ZIP code, with an emergency cushion built in.',
          ],
          [
            'Side by side',
            'Your partner answers four questions, and we show where you agree before the verdict.',
          ],
          ['Honest verdict', 'Ready, ready once a few things change, or not yet.'],
        ].map(([title, text]) => (
          <section key={title} className="fp-card p-5">
            <span className="fp-icon-teal">
              <CheckIcon className="h-4 w-4" />
            </span>
            <h2 className="mt-3 text-[15px]">{title}</h2>
            <p className="mt-1 text-sm text-muted">{text}</p>
          </section>
        ))}
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
      <div className="grid gap-2">
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
    <section className="fp-card p-5">
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
