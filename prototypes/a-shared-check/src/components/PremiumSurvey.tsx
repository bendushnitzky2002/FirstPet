import type { Check, PremiumAnswer } from '../types'
import { recordPremium } from '../lib/survey'
import { CheckIcon } from './ui'

// The test for our hypothesis: after the verdict, would this household sign
// up for a premium plan with post-adoption care help? The check stays free.
export function PremiumSurvey({ check, save }: { check: Check; save: (c: Check) => void }) {
  const answer = (premium: PremiumAnswer) => {
    recordPremium(check.code, premium)
    save({ ...check, premium })
  }

  return (
    <section className="mt-6 rounded-card border-2 border-teal bg-white p-5">
      <p className="text-sm font-bold uppercase tracking-wide text-teal">One question for us</p>
      <h2 className="mt-1 text-xl font-extrabold">Want help after adoption day?</h2>
      <p className="mt-2">
        We're considering a premium plan with post-adoption pet care help for the first months with
        your pet. This readiness check stays free either way.
      </p>

      {check.premium ? (
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-teal-light px-4 py-3">
          <span className="fp-icon-teal shrink-0 bg-white">
            <CheckIcon />
          </span>
          <p className="flex-1 font-semibold text-navy">
            {check.premium === 'yes'
              ? "Thanks. We noted you'd consider signing up."
              : 'Thanks. We noted that this is not for you.'}
          </p>
          <button
            type="button"
            onClick={() => answer(check.premium === 'yes' ? 'no' : 'yes')}
            className="text-sm font-semibold text-teal underline-offset-4 hover:underline"
          >
            Change
          </button>
        </div>
      ) : (
        <>
          <p className="mt-4 font-semibold text-navy">Would you consider signing up?</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => answer('yes')}
              className="min-h-[52px] rounded-full bg-teal px-6 py-3 font-heading text-lg font-bold text-white hover:bg-[#1a8790]"
            >
              Yes, I would
            </button>
            <button
              type="button"
              onClick={() => answer('no')}
              className="min-h-[52px] rounded-full border-2 border-teal bg-white px-6 py-3 font-heading text-lg font-bold text-teal hover:bg-teal-light"
            >
              No thanks
            </button>
          </div>
        </>
      )}
    </section>
  )
}
