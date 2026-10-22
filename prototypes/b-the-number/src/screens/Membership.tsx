import { useState } from 'react'
import type { State, Tier } from '../types'
import { PLANS, TIER_LABEL } from '../data/membership'
import { navigate } from '../lib/router'
import { Button, CheckIcon, ScaleIcon } from '../components/ui'

type Props = { state: State; save: (s: State) => void }

// The main test: two annual tiers and a "Join the network" button. A click is
// recorded (there is no payment) and we ask one question.
export function Membership({ state, save }: Props) {
  // Index of the join click this visit is answering, if any.
  const [joined, setJoined] = useState<number | null>(null)
  const [answer, setAnswer] = useState('')
  const [sent, setSent] = useState(false)

  const join = (tier: Tier) => {
    const joins = [...state.joins, { tier, at: new Date().toISOString() }]
    save({ ...state, joins })
    setJoined(joins.length - 1)
    setAnswer('')
    setSent(false)
  }

  const submit = () => {
    if (joined === null) return
    const joins = state.joins.map((j, i) => (i === joined ? { ...j, answer: answer.trim() } : j))
    save({ ...state, joins })
    setSent(true)
  }

  if (joined !== null) {
    const tier = state.joins[joined].tier
    return (
      <div className="mx-auto max-w-xl">
        <span className="fp-icon-teal h-12 w-12" aria-hidden="true">
          <CheckIcon className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-3xl font-extrabold">
          {tier === 'per-intro' ? 'Thanks, we noted that.' : 'Thanks for raising your hand.'}
        </h1>
        <p className="mt-2 text-lg">
          {tier === 'per-intro'
            ? 'We are not charging per introduction in this preview, and we wrote down that you would prefer it.'
            : `We recorded your interest in the ${PLANS.find((p) => p.tier === tier)!.name} membership. Nothing is charged in this preview.`}
        </p>

        {!sent ? (
          <form
            className="fp-card mt-6 p-5"
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
          >
            <label htmlFor="worth" className="font-heading text-lg font-extrabold text-navy">
              What would make our service worth it?
            </label>
            <textarea
              id="worth"
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="mt-3 w-full rounded-card border-2 border-line px-3 py-2 focus:border-teal focus:outline-none"
            />
            <div className="mt-4">
              <Button type="submit" disabled={!answer.trim()}>
                Send
              </Button>
            </div>
          </form>
        ) : (
          <p className="mt-6 rounded-card bg-teal-light px-4 py-3 font-semibold text-navy">
            Got it. We read every answer.
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => navigate('/intros')}>
            Back to introductions
          </Button>
          <Button variant="secondary" onClick={() => setJoined(null)}>
            Back to membership
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <p className="font-heading text-sm font-bold uppercase tracking-wide text-teal">Membership</p>
      <h1 className="mt-1 text-3xl font-extrabold">One yearly membership. No fee per lead.</h1>
      <p className="mt-2 max-w-2xl">
        Members get every introduction in their area for the year. We never charge per household, so
        you can say yes to the ones that fit without counting.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {PLANS.map((plan) => (
          <section key={plan.tier} className="fp-card flex flex-col p-5">
            <h2 className="text-2xl font-extrabold">{plan.name}</h2>
            <p className="mt-1 text-sm">{plan.forWho}</p>
            <p className="mt-4 font-heading text-3xl font-extrabold text-navy">{plan.price}</p>
            <p className="text-sm">{plan.perMonth}</p>
            <ul className="mt-4 flex-1 space-y-2">
              {plan.includes.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <Button onClick={() => join(plan.tier)}>Join the network</Button>
            </div>
          </section>
        ))}
      </div>
      <p className="mt-3 text-xs text-body/80">
        Placeholder prices for this prototype. We have not set real prices.
      </p>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => join('per-intro')}
          className="text-sm font-semibold text-teal underline-offset-4 hover:underline"
        >
          Would you rather pay per introduction? Tell us.
        </button>
      </div>

      <section className="mt-8 flex gap-4 rounded-card border-2 border-navy p-5">
        <span className="fp-icon-orange shrink-0" aria-hidden="true">
          <ScaleIcon />
        </span>
        <p>
          <strong className="text-navy">What membership never buys:</strong> a higher spot in any
          list, a better verdict for anyone, or a recommendation. Owners never pay, and the verdict
          is never for sale.
        </p>
      </section>

      {state.joins.length > 0 && (
        <p className="mt-6 text-sm">
          Recorded this session: {state.joins.map((j) => TIER_LABEL[j.tier]).join(', ')}.
        </p>
      )}
    </>
  )
}
