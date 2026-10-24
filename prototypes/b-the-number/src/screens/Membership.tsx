import { useEffect, useState } from 'react'
import type { MembershipEntry, State, Tier } from '../types'
import { BREAK_EVEN, PLANS } from '../data/membership'
import { INTRODUCTIONS } from '../data/introductions'
import { navigate } from '../lib/router'
import { Button, CheckIcon, PageHead, ScaleIcon } from '../components/ui'

type Props = { state: State; save: (s: State) => void }

const ENTRIES: MembershipEntry[] = ['nav', 'side-card', 'banner', 'all-decided']

function entryFromHash(): MembershipEntry {
  const from = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('from')
  return ENTRIES.find((e) => e === from) ?? 'nav'
}

// The main test, an honest fake door: two annual tiers and the option the
// hypothesis bets against (paying per introduction), as three equal cards with
// the same price treatment and the same button. Pay per introduction is shown
// first or last at random per tester. A click is recorded in localStorage, the
// next screen says plainly that the option is not available yet, and we ask
// one question. No payment details.
export function Membership({ state, save }: Props) {
  // Record the view once per visit to this page, with how the pro got here.
  useEffect(() => {
    save({
      ...state,
      views: [...state.views, { at: new Date().toISOString(), from: entryFromHash() }],
      perIntroFirst: state.perIntroFirst ?? Math.random() < 0.5,
    })
    // Only on arrival.
  }, [])

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
            {tier === 'per-intro' || !plan
              ? 'Paying per introduction is not available yet.'
              : `The ${plan.name} membership is not available yet.`}
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

  const perIntro = PLANS.filter((p) => p.tier === 'per-intro')
  const yearly = PLANS.filter((p) => p.tier !== 'per-intro')
  const plans = state.perIntroFirst ? [...perIntro, ...yearly] : [...yearly, ...perIntro]

  return (
    <>
      <PageHead
        eyebrow="Membership"
        title="How would you want to pay for introductions like these?"
      >
        {accepted > 0
          ? `Today you said yes to ${accepted} of ${INTRODUCTIONS.length} households. `
          : ''}
        Every option gets the same introductions in the same order. Pick the one you would choose.
      </PageHead>

      <div className="fp-enter">
        <div className="fp-stagger grid items-stretch gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <section
              key={plan.tier}
              className="flex flex-col rounded-[13px] border border-line bg-white p-7 shadow-card"
            >
              <span className="fp-pill">{plan.kind}</span>
              <h2 className="mt-3 text-[22px]">{plan.name}</h2>
              <p className="mt-1 text-sm text-muted">{plan.forWho}</p>
              <p className="mt-5 font-heading text-[30px] font-extrabold leading-none text-navy">
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

        <p className="mt-4 text-sm text-muted">
          At these prices, {BREAK_EVEN} accepted households a year cost the same as Solo. Prices
          shown are placeholders.
        </p>

        <section className="fp-guide mt-6 flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className="fp-guide-icon shrink-0 sm:mb-0" aria-hidden="true">
            <ScaleIcon />
          </span>
          <div>
            <span className="fp-eyebrow text-[#90D2D0]">What no option buys</span>
            <h2 className="text-lg leading-snug">The verdict is never for sale.</h2>
            <p className="mt-2 text-sm">
              Not a higher spot in any list, a better verdict for anyone, or a recommendation.
              Owners never pay, whichever way you choose.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
