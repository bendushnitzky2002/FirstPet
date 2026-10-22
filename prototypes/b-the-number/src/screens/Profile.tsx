import { useEffect, useRef } from 'react'
import { OWNER_VIEW, PROFILE, VETTING_STEPS } from '../data/profile'
import { navigate } from '../lib/router'
import { Button, CheckIcon, ScaleIcon, VettedBadge } from '../components/ui'

// Landing page for a professional: their network profile, exactly as owners
// see it, and the rule that nothing here is for sale.
export function Profile({ pending, onSeed }: { pending: number; onSeed: () => void }) {
  useSeedShortcut(onSeed)

  return (
    <>
      <p className="fp-eyebrow">Your network profile</p>
      <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">
        Meet first-time owners before day one.
      </h1>
      <p className="mt-3 max-w-2xl text-lg">
        Households finish a readiness check, build a care plan, and choose what to share. When their
        plan has a gap you fill, we introduce you.
      </p>

      {pending > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-card bg-peach px-4 py-3">
          <p className="font-semibold text-navy">
            {pending} {pending === 1 ? 'household is' : 'households are'} waiting for an
            introduction.
          </p>
          <Button full={false} onClick={() => navigate('/intros')}>
            See introductions
          </Button>
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section>
          <h2 className="text-lg font-extrabold">What owners see</h2>
          <div className="fp-card mt-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading text-xl font-extrabold text-navy">{PROFILE.name}</p>
                <p className="text-sm">
                  {PROFILE.kind}, {PROFILE.area}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <VettedBadge size="lg" />
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {PROFILE.services.map((s) => (
                <li key={s} className="rounded-full border border-line px-3 py-1 text-sm">
                  {s}
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="font-semibold text-navy">Serves:</dt>
                <dd>{PROFILE.serves}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold text-navy">First visit:</dt>
                <dd>{PROFILE.firstVisit}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-extrabold">What the badge means</h2>
          <ul className="fp-card mt-3 divide-y divide-line">
            {VETTING_STEPS.map((step) => (
              <li key={step.label} className="flex gap-3 px-5 py-3">
                <span className="fp-icon-teal h-7 w-7 shrink-0" aria-hidden="true">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-navy">{step.label}</p>
                  <p className="text-sm">{step.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-extrabold">Where you show up</h2>
        <p className="mt-1 text-sm">
          A household's care plan says "{OWNER_VIEW.gap}." Here is the list they see.
        </p>
        <ol className="fp-card mt-3 divide-y divide-line">
          {OWNER_VIEW.pros.map((p) => (
            <li
              key={p.name}
              className="flex flex-wrap items-center justify-between gap-2 px-5 py-3"
            >
              <span className="flex flex-wrap items-center gap-2">
                <span className={`font-semibold ${p.you ? 'text-navy' : ''}`}>{p.name}</span>
                {p.you && (
                  <span className="rounded-full bg-navy px-2 py-0.5 text-xs font-bold text-white">
                    You
                  </span>
                )}
                <VettedBadge />
              </span>
              <span className="text-sm">{p.distance}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6 flex gap-4 rounded-card border-2 border-navy p-5">
        <span className="fp-icon-orange shrink-0" aria-hidden="true">
          <ScaleIcon />
        </span>
        <div>
          <h2 className="text-lg font-extrabold">No ranking. No paid placement.</h2>
          <p className="mt-1">
            Every vetted pro gets the same badge, and the list is sorted by distance only.
            Membership gets you into the network. It never changes a household's verdict, the order
            of the list, or what we recommend.
          </p>
        </div>
      </section>

      <p className="mt-6 text-xs text-body/80">
        Sample profile for this prototype. The business and the other clinics are made up.
      </p>
    </>
  )
}

// Press "d" three times (outside a text box) to load the demo state.
function useSeedShortcut(onSeed: () => void) {
  const presses = useRef<number[]>([])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      if (e.key.toLowerCase() !== 'd') {
        presses.current = []
        return
      }
      const now = Date.now()
      presses.current = [...presses.current.filter((t) => now - t < 1500), now]
      if (presses.current.length >= 3) {
        presses.current = []
        onSeed()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onSeed])
}
