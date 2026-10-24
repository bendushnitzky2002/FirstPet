import { useEffect, useRef, useState } from 'react'
import type { Check, PremiumAnswer } from '../types'
import { getVerdict } from '../data/verdict'
import { recordPremium, recordSeen, recordWorthIt, type PremiumEntry } from '../lib/survey'
import { CheckIcon } from './ui'

// Fake door for our hypothesis: after the verdict, does this household pick a
// premium post-adoption plan? Premium does not exist. Per the fake door rules
// we show a test price labeled as one, say plainly that it is not available
// yet, never ask for payment, and keep the click and the one answer in
// localStorage only. Nothing here changes the verdict.

// TEST PRICE. Chosen for the prototype so a "yes" costs something to say; it
// is not based on pricing research. Labeled as a test price in the UI.
const TEST_PRICE = '$9 a month'

// What we are considering for Premium. Proposed features, not a product.
const PREMIUM_IDEAS = [
  'A week-by-week plan for your first 90 days together',
  'Check-ins at week two and month three to catch problems early',
  'Help finding vetted local pet care when your plan has a gap',
]

// One line tying Premium to this household's own plan. Same three features for
// everyone so answers compare; only this line changes.
function planHook(check: Check): string | null {
  const people = [check.starter, ...(check.partner?.done ? [check.partner] : [])]
  const longDays = people.some((p) => (p.hoursAlone ?? 0) >= 8)
  const tightVet = people.some((p) => p.vetCost && p.vetCost !== 'fine')
  if (longDays && tightVet)
    return 'You listed long weekdays and a tight vet budget. Premium would check in early and help you find care for the long days.'
  if (longDays)
    return 'You listed long weekdays. Premium would help you find care for those days and check in on how the plan holds up.'
  if (tightVet)
    return 'You listed a tight vet budget. Premium would check in at week two and month three, before small problems get expensive.'
  return null
}

type Props = { check: Check; save: (c: Check) => void; from: PremiumEntry }

export function PremiumSurvey({ check, save, from }: Props) {
  const [draft, setDraft] = useState(check.worthIt ?? '')
  const kind = getVerdict(check).kind
  const hook = planHook(check)
  const ref = useRef<HTMLElement>(null)

  // Count the card as seen once it is actually on screen, so the share who
  // said yes can be measured against people who saw the offer.
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      recordSeen(check.code, from)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        recordSeen(check.code, from)
        io.disconnect()
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [check.code, from])

  const answer = (premium: PremiumAnswer) => {
    recordPremium(check.code, premium, { verdict: kind, from })
    save({ ...check, premium })
  }
  const saveWorthIt = () => {
    const text = draft.trim()
    if (!text) return
    recordWorthIt(check.code, text)
    save({ ...check, worthIt: text })
  }

  return (
    <section ref={ref} className="fp-card border-t-4 border-t-teal p-6">
      <p className="fp-eyebrow">
        {kind === 'not-yet' ? "When you're ready" : 'After adoption day'}
      </p>
      <h2 className="text-xl">FirstPet Premium</h2>
      <p className="mt-2 text-sm">
        {kind === 'not-yet'
          ? "Your plan gets you to ready. Once you adopt, we're considering a premium plan with post-adoption pet care help. Here's what we have in mind:"
          : "Your plan gets you to adoption day. We're considering a premium plan that picks up from there. Here's what we have in mind:"}
      </p>
      <ul className="mt-3 space-y-2">
        {PREMIUM_IDEAS.map((idea) => (
          <li key={idea} className="flex gap-2 text-sm text-navy">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
            {idea}
          </li>
        ))}
      </ul>
      {hook && <p className="fp-note mt-4 px-4 py-3 text-sm text-navy">{hook}</p>}
      <p className="mt-4 flex items-baseline justify-between gap-3 border-t border-line pt-3 text-sm">
        <span className="text-muted">Price</span>
        <span className="font-bold text-navy">
          {TEST_PRICE} <span className="font-normal text-muted">(test price)</span>
        </span>
      </p>

      {!check.premium ? (
        <>
          <p className="mt-5 font-semibold text-navy">Would you sign up for Premium?</p>
          {/* Equal weight on purpose: a styled "yes" would inflate the rate. */}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => answer('yes')}
              className="fp-btn fp-btn-secondary min-h-[46px] px-5"
            >
              I'd sign up for Premium
            </button>
            <button
              type="button"
              onClick={() => answer('no')}
              className="fp-btn fp-btn-secondary min-h-[46px] px-5"
            >
              Not for me
            </button>
          </div>
          <p className="mt-3 text-xs text-muted">
            The readiness check and your verdict stay free either way.
          </p>
        </>
      ) : (
        <div className="fp-reveal mt-5 rounded-lg bg-canvas p-4 text-body">
          <p className="font-heading font-extrabold text-navy">
            {check.premium === 'yes' ? 'Premium is not available yet.' : 'Got it, thanks.'}
          </p>
          <p className="mt-1 text-sm">
            {check.premium === 'yes'
              ? "We're measuring interest before we build it. We did not sign you up, and we will never ask for payment here."
              : "We're measuring interest before we build anything. Your verdict stays the same either way."}
          </p>

          {check.worthIt ? (
            <div className="fp-enter mt-3 flex items-start gap-2 rounded-lg bg-teal-light px-3 py-2 text-sm text-navy">
              <CheckIcon className="fp-pop mt-0.5 h-4 w-4 shrink-0 text-teal" />
              <span>Thanks. We saved your answer.</span>
            </div>
          ) : (
            <div className="mt-3">
              <label htmlFor="worth-it" className="text-sm font-bold text-navy">
                One question: what would make Premium worth it to you?
              </label>
              <textarea
                id="worth-it"
                rows={3}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Optional"
                className="fp-input mt-2 w-full px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={saveWorthIt}
                disabled={!draft.trim()}
                className="fp-btn fp-btn-navy mt-2 min-h-[40px] w-full px-4 text-sm"
              >
                Save my answer
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => answer(check.premium === 'yes' ? 'no' : 'yes')}
            className="mt-3 text-xs font-semibold text-teal underline-offset-4 hover:underline"
          >
            {check.premium === 'yes' ? 'Change to not for me' : "Change to I'd sign up"}
          </button>
        </div>
      )}
    </section>
  )
}
