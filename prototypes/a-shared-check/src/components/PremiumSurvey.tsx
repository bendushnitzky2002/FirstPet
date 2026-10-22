import { useState } from 'react'
import type { Check, PremiumAnswer } from '../types'
import { recordPremium, recordWorthIt } from '../lib/survey'
import { CheckIcon } from './ui'

// Fake door for our hypothesis: after the verdict, does this household pick a
// premium post-adoption plan? Premium does not exist. Per the fake door rules
// we show no real price, say plainly that it is not available yet, never ask
// for payment, and keep the click and the one answer in localStorage only.
// Nothing here changes the verdict.

// What we are considering for Premium. Proposed features, not a product.
const PREMIUM_IDEAS = [
  'A week-by-week plan for your first 90 days together',
  'Check-ins at week two and month three to catch problems early',
  'Help finding vetted local pet care when your plan has a gap',
]

export function PremiumSurvey({ check, save }: { check: Check; save: (c: Check) => void }) {
  const [draft, setDraft] = useState(check.worthIt ?? '')

  const answer = (premium: PremiumAnswer) => {
    recordPremium(check.code, premium)
    save({ ...check, premium })
  }
  const saveWorthIt = () => {
    const text = draft.trim()
    if (!text) return
    recordWorthIt(check.code, text)
    save({ ...check, worthIt: text })
  }

  return (
    <section className="fp-hero p-6">
      <p className="fp-eyebrow text-[#90D2D0]">After adoption day</p>
      <h2 className="text-xl text-white">FirstPet Premium</h2>
      <p className="mt-2 text-sm text-[#B9CAD3]">
        We're considering a premium plan with post-adoption pet care help. Here's what we have in
        mind:
      </p>
      <ul className="mt-3 space-y-2">
        {PREMIUM_IDEAS.map((idea) => (
          <li key={idea} className="flex gap-2 text-sm text-white">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#90D2D0]" />
            {idea}
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-baseline justify-between gap-3 border-t border-white/10 pt-3 text-sm">
        <span className="text-[#B9CAD3]">Price</span>
        <span className="font-bold text-white">Not set yet (placeholder)</span>
      </p>

      {!check.premium ? (
        <>
          <p className="mt-5 font-semibold text-white">Would you sign up for Premium?</p>
          <div className="mt-3 grid gap-2">
            <button
              type="button"
              onClick={() => answer('yes')}
              className="fp-btn fp-btn-primary min-h-[46px] px-5"
            >
              Yes, I'd want Premium
            </button>
            <button
              type="button"
              onClick={() => answer('no')}
              className="fp-btn fp-btn-light min-h-[46px] px-5"
            >
              No thanks
            </button>
          </div>
          <p className="mt-3 text-xs text-[#B9CAD3]">
            The readiness check and your verdict stay free either way.
          </p>
        </>
      ) : (
        <div className="mt-5 rounded-lg bg-white p-4 text-body">
          <p className="font-heading font-extrabold text-navy">
            {check.premium === 'yes' ? 'Premium is not available yet.' : 'Got it, thanks.'}
          </p>
          <p className="mt-1 text-sm">
            {check.premium === 'yes'
              ? "We're measuring interest before we build it. We did not sign you up, and we will never ask for payment here."
              : "We're measuring interest before we build anything. Your verdict stays the same either way."}
          </p>

          {check.worthIt ? (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-teal-light px-3 py-2 text-sm text-navy">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
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
            {check.premium === 'yes' ? 'Change to no thanks' : "Change to yes, I'd want Premium"}
          </button>
        </div>
      )}
    </section>
  )
}
