import { useState } from 'react'
import type { State, Tier } from '../types'
import { PLANS } from '../data/membership'
import { INTRODUCTIONS } from '../data/introductions'
import { navigate } from '../lib/router'
import { Button, CheckIcon, PageHead, ScaleIcon } from '../components/ui'

type Props = { state: State; save: (s: State) => void }

// The main test, an honest fake door: two annual tiers and, with equal
// weight, the option the hypothesis bets against (paying per introduction).
// A click is recorded in localStorage, the next screen says plainly that the
// option is not available yet, and we ask one question. No payment details.
export function Membership({ state, save }: Props) {
  // Index of the join click this visit is answering, if any.
  const [joined, setJoined] = useState<number | null>(null)
  const [answer, setAnswer] = useState('')
  const [sent, setSent] = useState(false)

  const accepted = Object.values(state.decisions).filter((d) => d.kind === 'accepted').length

  const join = (tier: Tier) => {
    const joins = [...state.joins, { tier, at: new Date().toISOString() }]
    save({ ...state, joins })
    setJoined(joins.length - 1)
    setAnswer('')
    setSent(false)
    window.scrollTo(0, 0)
  }

  const submit = () => {
    if (joined === null) return
    const joins = state.joins.map((j, i) => (i === joined ? { ...j, answer: answer.trim() } : j))
    save({ ...state, joins })
    setSent(true)
  }

  if (joined !== null) {
    const tier = state.joins[joined].tier
    const plan = PLANS.find((p) => p.tier === tier)
    return (
      <div className="fp-stagger max-w-2xl pt-10">
        <span className="fp-icon-teal h-12 w-12" aria-hidden="true">
          <CheckIcon className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-3xl font-extrabold">Thanks. We noted your choice.</h1>
        <div className="fp-warning mt-4 px-5 py-4">
          <p className="font-bold text-navy">
            {plan
              ? `The ${plan.name} membership is not available yet.`
              : 'Paying per introduction is not available yet.'}
          </p>
          <p className="mt-1 text-sm">
            We are measuring interest before we build it. Nothing was charged, and we will never ask
            for payment details here.
          </p>
        </div>

        {!sent ? (
          <form
            className="fp-card mt-6 p-6"
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
          <p className="fp-note mt-6 px-5 py-4 font-semibold">Got it. We read every answer.</p>
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
      <PageHead eyebrow="Membership" title="Keep getting introductions like these.">
        {accepted > 0
          ? `Today you said yes to ${accepted} of ${INTRODUCTIONS.length} households. `
          : ''}
        Members get every introduction in their area for one yearly fee. Tell us which way you would
        rather pay.
      </PageHead>

      <div className="fp-enter grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <div className="fp-stagger grid items-stretch gap-5 md:grid-cols-2">
            {PLANS.map((plan) => (
              <section
                key={plan.tier}
                className="flex flex-col rounded-[13px] border border-line bg-white p-7 shadow-card"
              >
                <span className="fp-pill">Yearly membership</span>
                <h2 className="mt-3 text-[22px]">{plan.name}</h2>
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
          </div>

          <section className="mt-5 flex flex-col gap-4 rounded-[13px] border border-line bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="fp-pill bg-peach text-orange-ink">The other way to pay</span>
              <h2 className="mt-3 text-lg">Pay per introduction</h2>
              <p className="mt-1 text-sm text-muted">
                No yearly fee. You pay for each household you accept.
              </p>
            </div>
            <Button variant="secondary" full={false} onClick={() => join('per-intro')}>
              I would rather pay per introduction
            </Button>
          </section>

          <p className="mt-3 text-xs text-muted">
            Placeholder prices for this prototype. We have not set real prices, including a price
            per introduction.
          </p>
        </div>

        <section className="fp-guide">
          <span className="fp-guide-icon" aria-hidden="true">
            <ScaleIcon />
          </span>
          <span className="fp-eyebrow text-[#90D2D0]">What membership never buys</span>
          <h2 className="text-lg leading-snug">The verdict is never for sale.</h2>
          <p className="mt-2 text-sm">
            Not a higher spot in any list, a better verdict for anyone, or a recommendation. Owners
            never pay, whichever way you choose.
          </p>
        </section>
      </div>
    </>
  )
}
