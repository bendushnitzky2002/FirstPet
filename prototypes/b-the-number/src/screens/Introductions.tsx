import { useState } from 'react'
import type { Introduction, PassReason, State } from '../types'
import { INTRODUCTIONS, PASS_REASONS, VERDICT_LABEL } from '../data/introductions'
import { navigate } from '../lib/router'
import { Button, CheckIcon, LockIcon } from '../components/ui'

type Props = { state: State; save: (s: State) => void }

export function Introductions({ state, save }: Props) {
  const pending = INTRODUCTIONS.filter((i) => !state.decisions[i.id])
  const decided = INTRODUCTIONS.filter((i) => state.decisions[i.id])
  const accepted = decided.filter((i) => state.decisions[i.id].kind === 'accepted').length

  const decide = (id: string, decision: State['decisions'][string]) =>
    save({ ...state, decisions: { ...state.decisions, [id]: decision } })
  const undo = (id: string) => {
    const decisions = { ...state.decisions }
    delete decisions[id]
    save({ ...state, decisions })
  }

  return (
    <>
      <p className="font-heading text-sm font-bold uppercase tracking-wide text-teal">
        Pending introductions
      </p>
      <h1 className="mt-1 text-3xl font-extrabold">
        {pending.length > 0
          ? `${pending.length} ${pending.length === 1 ? 'household wants' : 'households want'} to meet you`
          : 'You are all caught up'}
      </h1>
      <p className="mt-2 max-w-2xl">
        Each one finished a readiness check and chose what to share with you. Accept and we
        introduce you. Pass and they never see it. Contact details come after they say hello back.
      </p>

      {accepted > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-card bg-teal-light px-4 py-3">
          <p className="font-semibold text-navy">
            Want introductions like {accepted === 1 ? 'this' : 'these'} all year?
          </p>
          <Button full={false} onClick={() => navigate('/membership')}>
            See membership
          </Button>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {pending.map((intro) => (
          <IntroCard
            key={intro.id}
            intro={intro}
            onAccept={() => decide(intro.id, { kind: 'accepted', at: new Date().toISOString() })}
            onPass={(reason, detail) =>
              decide(intro.id, { kind: 'passed', at: new Date().toISOString(), reason, detail })
            }
          />
        ))}
      </div>

      {decided.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-extrabold">Decided</h2>
          <ul className="fp-card mt-3 divide-y divide-line">
            {decided.map((intro) => {
              const d = state.decisions[intro.id]
              return (
                <li
                  key={intro.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-5 py-3"
                >
                  <span>
                    <span className="font-semibold text-navy">{intro.household}</span>{' '}
                    {d.kind === 'accepted' ? (
                      <span className="text-sm text-teal">
                        Introduced. We sent them your profile and a hello.
                      </span>
                    ) : (
                      <span className="text-sm">
                        Passed:{' '}
                        {PASS_REASONS.find((r) => r.value === d.reason)!.label.toLowerCase()}
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => undo(intro.id)}
                    className="text-sm font-semibold text-teal underline-offset-4 hover:underline"
                  >
                    Undo
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <p className="mt-6 text-xs text-body/80">
        Sample households for this prototype. We only introduce households whose verdict is ready or
        ready once a few things change.
      </p>
    </>
  )
}

function IntroCard({
  intro,
  onAccept,
  onPass,
}: {
  intro: Introduction
  onAccept: () => void
  onPass: (reason: PassReason, detail?: string) => void
}) {
  const [passing, setPassing] = useState(false)
  const [reason, setReason] = useState<PassReason | null>(null)
  const [detail, setDetail] = useState('')
  const sharedCount = intro.items.filter((i) => i.shared).length

  return (
    <article className="fp-card overflow-hidden">
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold">{intro.household}</h2>
            <p className="text-sm">{intro.area}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${
              intro.verdict === 'ready' ? 'bg-teal text-white' : 'bg-peach text-navy'
            }`}
          >
            {VERDICT_LABEL[intro.verdict]}
          </span>
        </div>
        <p className="mt-3 text-sm">
          {intro.pet}. {intro.timing}.
        </p>
        <blockquote className="mt-3 border-l-4 border-orange pl-3 font-semibold text-navy">
          {intro.need}
        </blockquote>
      </div>

      <div className="border-t border-line bg-canvas px-5 py-4">
        <p className="text-sm font-semibold text-navy">
          Shared with you by consent on {intro.consentedOn} ({sharedCount} of {intro.items.length})
        </p>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          {intro.items.map((item) =>
            item.shared ? (
              <div key={item.key}>
                <dt className="text-xs font-bold uppercase tracking-wide text-teal">
                  {item.label}
                </dt>
                <dd>
                  <ul className="mt-1 space-y-0.5 text-sm">
                    {item.value!.map((v) => (
                      <li key={v}>{v}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : (
              <div key={item.key} className="text-body/60">
                <dt className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide">
                  <LockIcon className="h-3.5 w-3.5" /> {item.label}
                </dt>
                <dd className="mt-1 text-sm">Not shared</dd>
              </div>
            ),
          )}
        </dl>
        <p className="mt-3 text-xs">They can take back what they shared at any time.</p>
      </div>

      <div className="border-t border-line p-5">
        {!passing ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={onAccept}>
              <span className="inline-flex items-center gap-2">
                <CheckIcon /> Accept introduction
              </span>
            </Button>
            <Button variant="secondary" onClick={() => setPassing(true)}>
              Pass
            </Button>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-navy">Why pass? They will not see this.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {PASS_REASONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  role="radio"
                  aria-checked={reason === r.value}
                  onClick={() => setReason(r.value)}
                  className={`min-h-[44px] rounded-card border-2 px-3 py-2 text-left text-sm font-semibold ${
                    reason === r.value
                      ? 'border-teal bg-teal-light text-navy'
                      : 'border-line bg-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            {reason === 'need-more' && (
              <label className="mt-3 block text-sm">
                <span className="font-semibold text-navy">What would you need to see?</span>
                <input
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="For example: their budget"
                  className="mt-1 w-full rounded-card border-2 border-line px-3 py-2 focus:border-teal focus:outline-none"
                />
              </label>
            )}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button
                disabled={!reason}
                onClick={() => reason && onPass(reason, detail.trim() || undefined)}
              >
                Pass on this one
              </Button>
              <Button variant="secondary" onClick={() => setPassing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
