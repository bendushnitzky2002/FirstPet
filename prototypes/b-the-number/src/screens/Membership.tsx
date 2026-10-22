import { useState } from 'react'
import type { State, Tier } from '../types'
import { PLANS, TIER_LABEL } from '../data/membership'
import { navigate } from '../lib/router'
import { Button, CheckIcon, PageHead, ScaleIcon } from '../components/ui'

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
      <div className="max-w-2xl pt-10">
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
              className="fp-input mt-3 w-full py-2"
            />
            <div className="mt-4 flex justify-end">
              <Button type="submit" full={false} disabled={!answer.trim()}>
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
          <Button variant="secondary" full={false} onClick={() => navigate('/intros')}>
            Back to introductions
          </Button>
          <Button variant="secondary" full={false} onClick={() => setJoined(null)}>
            Back to membership
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHead eyebrow="Membership" title="One yearly membership. No fee per lead.">
        Members get every introduction in their area for the year. We never charge per household, so
        you can say yes to the ones that fit without counting.
      </PageHead>

      <div className="grid items-stretch gap-5 lg:grid-cols-[1fr_1fr_340px]">
        {PLANS.map((plan) => (
          <section
            key={plan.tier}
            className="flex flex-col rounded-[13px] border border-line bg-white p-7 shadow-card"
          >
            <h2 className="text-[22px]">{plan.name}</h2>
            <p className="mt-1 text-sm text-muted">{plan.forWho}</p>
            <p className="mt-5 font-heading text-[34px] font-extrabold leading-none text-navy">
              {plan.price}
            </p>
            <p className="mt-1 text-sm text-muted">{plan.perMonth}</p>
            <ul className="mt-5 flex-1 space-y-2 border-t border-line pt-4">
              {plan.includes.map((item) => (
                <li key={item} className="flex gap-2 text-[15px]">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal text-white">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button onClick={() => join(plan.tier)}>Join the network</Button>
            </div>
          </section>
        ))}

        <section className="fp-guide flex flex-col">
          <span className="fp-guide-icon" aria-hidden="true">
            <ScaleIcon />
          </span>
          <span className="fp-eyebrow text-[#90D2D0]">What membership never buys</span>
          <h2 className="text-lg leading-snug">The verdict is never for sale.</h2>
          <p className="mt-2 text-sm">
            Not a higher spot in any list, a better verdict for anyone, or a recommendation. Owners
            never pay.
          </p>
          <div className="my-5 h-px bg-white/10" />
          <p className="text-sm font-semibold text-white">Prefer to pay per household?</p>
          <button
            type="button"
            onClick={() => join('per-intro')}
            className="fp-btn fp-btn-light mt-3 min-h-[44px] px-4 text-sm"
          >
            Would you rather pay per introduction? Tell us.
          </button>
        </section>
      </div>
      <p className="mt-3 text-xs text-muted">
        Placeholder prices for this prototype. We have not set real prices.
      </p>

      {state.joins.length > 0 && (
        <p className="mt-4 text-sm">
          Recorded this session: {state.joins.map((j) => TIER_LABEL[j.tier]).join(', ')}.
        </p>
      )}
    </>
  )
}
