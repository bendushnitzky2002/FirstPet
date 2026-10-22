import { useEffect, useRef } from 'react'
import { OWNER_VIEW, PROFILE, VETTING_STEPS } from '../data/profile'
import { navigate } from '../lib/router'
import { Button, CheckIcon, PageHead, ScaleIcon, VettedBadge } from '../components/ui'

// Landing page for a professional: their network profile, exactly as owners
// see it, and the rule that nothing here is for sale.
export function Profile({ pending, onSeed }: { pending: number; onSeed: () => void }) {
  useSeedShortcut(onSeed)

  return (
    <>
      <PageHead
        eyebrow="Your network profile"
        title="Meet first-time owners before day one."
        action={
          pending > 0 && (
            <Button full={false} onClick={() => navigate('/intros')}>
              See {pending} {pending === 1 ? 'introduction' : 'introductions'}
            </Button>
          )
        }
      >
        Households finish a readiness check, build a care plan, and choose what to share. When their
        plan has a gap you fill, we introduce you.
      </PageHead>

      <section className="flex flex-wrap items-center gap-5 rounded-[12px] border border-t-4 border-line border-t-orange bg-white px-6 py-5 shadow-card">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#97C6BB] to-[#3F7D7D] font-heading text-xl font-extrabold text-white">
          {PROFILE.name.charAt(0)}
        </span>
        <div className="min-w-[220px]">
          <span className="fp-eyebrow mb-1">What owners see</span>
          <h2 className="text-[22px]">{PROFILE.name}</h2>
          <p className="text-sm text-muted">
            {PROFILE.kind}, {PROFILE.area}
          </p>
        </div>
        <VettedBadge size="lg" />
        <dl className="flex flex-wrap gap-x-9 gap-y-2 lg:ml-auto">
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.07em] text-muted">Serves</dt>
            <dd className="text-sm font-bold text-navy">{PROFILE.serves}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.07em] text-muted">
              First visit
            </dt>
            <dd className="text-sm font-bold text-navy">{PROFILE.firstVisit}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <section className="fp-card overflow-hidden">
            <div className="fp-panel-head">
              <div>
                <h2>Where you show up</h2>
                <p>A household's care plan says "{OWNER_VIEW.gap}." Here is the list they see.</p>
              </div>
            </div>
            <ol>
              {OWNER_VIEW.pros.map((p) => (
                <li
                  key={p.name}
                  className={`flex flex-wrap items-center justify-between gap-2 border-b border-[#EDF0F3] px-6 py-3.5 last:border-b-0 ${p.you ? 'shadow-[inset_3px_0_#f47b35]' : ''}`}
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
                  <span className="text-sm text-muted">{p.distance}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="fp-card p-6">
            <span className="fp-eyebrow">Services on your profile</span>
            <ul className="mt-2 flex flex-wrap gap-2">
              {PROFILE.services.map((s) => (
                <li
                  key={s}
                  className="rounded-[7px] border border-line bg-white px-3 py-1.5 text-sm font-semibold text-navy"
                >
                  {s}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-5">
          <section className="fp-guide">
            <span className="fp-guide-icon" aria-hidden="true">
              <ScaleIcon />
            </span>
            <span className="fp-eyebrow text-[#90D2D0]">Our rule</span>
            <h2 className="text-lg leading-snug">No ranking. No paid placement.</h2>
            <p className="mt-2 text-sm">
              Every vetted pro gets the same badge, and the list is sorted by distance only.
              Membership gets you into the network. It never changes a household's verdict, the
              order of the list, or what we recommend.
            </p>
          </section>

          <section className="fp-card overflow-hidden">
            <div className="fp-panel-head">
              <h2>What the badge means</h2>
            </div>
            <ul>
              {VETTING_STEPS.map((step) => (
                <li
                  key={step.label}
                  className="flex gap-3 border-b border-[#EDF0F3] px-6 py-3.5 last:border-b-0"
                >
                  <span className="fp-icon-teal h-7 w-7 shrink-0" aria-hidden="true">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-navy">{step.label}</p>
                    <p className="text-sm text-muted">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {pending > 0 && (
        <section className="fp-hero mt-5 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="fp-eyebrow text-[#90D2D0]">Next step</span>
            <h2 className="text-lg text-white">
              {pending} {pending === 1 ? 'household has' : 'households have'} asked to meet you.
            </h2>
            <p className="mt-1 text-sm text-[#B9C8D8]">
              See what each one shared, then accept or pass.
            </p>
          </div>
          <Button full={false} onClick={() => navigate('/intros')}>
            Review introductions
          </Button>
        </section>
      )}

      <p className="mt-6 text-xs text-muted">
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
