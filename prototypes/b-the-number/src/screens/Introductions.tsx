import { useState } from 'react'
import type { Introduction, PassReason, SharedItem, State } from '../types'
import { INTRODUCTIONS, PASS_REASONS, VERDICT_LABEL } from '../data/introductions'
import { navigate } from '../lib/router'
import { Button, CheckIcon, LockIcon, PageHead } from '../components/ui'

type Props = { state: State; save: (s: State) => void }

export function Introductions({ state, save }: Props) {
  const pending = INTRODUCTIONS.filter((i) => !state.decisions[i.id])
  const decided = INTRODUCTIONS.filter((i) => state.decisions[i.id])
  const accepted = decided.filter((i) => state.decisions[i.id].kind === 'accepted').length

  // The last decision, so the card that just left the list is confirmed and
  // can be undone in place.
  const [last, setLast] = useState<string | null>(null)

  const decide = (id: string, decision: State['decisions'][string]) => {
    save({ ...state, decisions: { ...state.decisions, [id]: decision } })
    setLast(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const undo = (id: string) => {
    const decisions = { ...state.decisions }
    delete decisions[id]
    save({ ...state, decisions })
    if (last === id) setLast(null)
  }
  const request = (id: string, key: SharedItem['key']) => {
    const asked = state.requests[id] ?? []
    if (asked.includes(key)) return
    save({ ...state, requests: { ...state.requests, [id]: [...asked, key] } })
  }

  const lastIntro = last ? INTRODUCTIONS.find((i) => i.id === last) : undefined
  const lastDecision = last ? state.decisions[last] : undefined

  return (
    <>
      <PageHead
        eyebrow="Pending introductions"
        title={
          pending.length > 0
            ? `${pending.length} ${pending.length === 1 ? 'household wants' : 'households want'} to meet you`
            : 'You are all caught up'
        }
      >
        Each one finished a readiness check and chose what to share with you. Accept and we
        introduce you. Pass and they never see it. Contact details come after they say hello back.
      </PageHead>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-5">
          {lastIntro && lastDecision && (
            <div
              role="status"
              className="flex flex-wrap items-center justify-between gap-3 rounded-[11px] border border-line bg-white px-5 py-3 shadow-card"
            >
              <p className="flex items-center gap-2 text-sm">
                <span className="fp-icon-teal h-7 w-7 shrink-0" aria-hidden="true">
                  <CheckIcon className="h-4 w-4" />
                </span>
                {lastDecision.kind === 'accepted' ? (
                  <span>
                    <strong className="text-navy">Introduced to {lastIntro.household}.</strong> We
                    sent them your profile and a hello.
                  </span>
                ) : (
                  <span>
                    <strong className="text-navy">Passed on {lastIntro.household}.</strong> They
                    will not see it.
                  </span>
                )}
              </p>
              <button
                type="button"
                onClick={() => undo(lastIntro.id)}
                className="text-sm font-bold text-teal underline-offset-4 hover:underline"
              >
                Undo
              </button>
            </div>
          )}
          {accepted > 0 && pending.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[11px] bg-navy px-5 py-3 text-white lg:hidden">
              <p className="text-sm font-semibold">Want introductions like this all year?</p>
              <Button full={false} onClick={() => navigate('/membership')}>
                See membership
              </Button>
            </div>
          )}
          {pending.map((intro) => (
            <IntroCard
              key={intro.id}
              intro={intro}
              requested={state.requests[intro.id] ?? []}
              onRequest={(key) => request(intro.id, key)}
              onAccept={() => decide(intro.id, { kind: 'accepted', at: new Date().toISOString() })}
              onPass={(reason, detail) =>
                decide(intro.id, { kind: 'passed', at: new Date().toISOString(), reason, detail })
              }
            />
          ))}
          {pending.length === 0 && (
            <section className="fp-card p-8 text-center">
              <h2 className="text-xl">
                You said yes to {accepted} of {INTRODUCTIONS.length} households.
              </h2>
              <p className="mx-auto mt-2 max-w-md text-muted">
                No introductions waiting. Next, see what it would take to keep getting them.
              </p>
              <div className="mt-5 flex justify-center">
                <Button full={false} onClick={() => navigate('/membership')}>
                  See membership
                </Button>
              </div>
            </section>
          )}
          <p className="text-xs text-muted">
            Sample households for this prototype. We only introduce households whose verdict is
            ready or ready once a few things change.
          </p>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          {accepted > 0 && (
            <section className="fp-hero p-6">
              <span className="fp-eyebrow text-[#90D2D0]">Membership</span>
              <h2 className="text-lg leading-snug text-white">
                Want introductions like {accepted === 1 ? 'this' : 'these'} all year?
              </h2>
              <div className="mt-4">
                <Button onClick={() => navigate('/membership')}>See membership</Button>
              </div>
            </section>
          )}

          <section className="fp-guide">
            <span className="fp-eyebrow text-[#90D2D0]">How introductions work</span>
            <h2 className="text-lg leading-snug">The household decides what you see.</h2>
            <div className="my-4 h-px bg-white/10" />
            <ol className="space-y-3 text-sm">
              {[
                'They finish a readiness check and a care plan',
                'They choose what to share with you',
                'You accept or pass. They never see a pass',
                'Contact details come after they say hello back',
              ].map((t, i) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="fp-guide-num">{i + 1}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </section>

          {decided.length > 0 && (
            <section className="fp-card overflow-hidden">
              <div className="fp-panel-head">
                <h2>Decided</h2>
              </div>
              <ul>
                {decided.map((intro) => {
                  const d = state.decisions[intro.id]
                  return (
                    <li
                      key={intro.id}
                      className="flex items-start justify-between gap-3 border-b border-[#EDF0F3] px-5 py-3 last:border-b-0"
                    >
                      <span className="min-w-0">
                        <span className="block font-semibold text-navy">{intro.household}</span>
                        {d.kind === 'accepted' ? (
                          <span className="block text-sm text-teal">
                            Introduced. We sent them your profile and a hello.
                          </span>
                        ) : (
                          <span className="block text-sm text-muted">
                            Passed:{' '}
                            {PASS_REASONS.find((r) => r.value === d.reason)!.label.toLowerCase()}
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => undo(intro.id)}
                        className="shrink-0 text-sm font-bold text-teal underline-offset-4 hover:underline"
                      >
                        Undo
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </>
  )
}

function IntroCard({
  intro,
  requested,
  onRequest,
  onAccept,
  onPass,
}: {
  intro: Introduction
  requested: SharedItem['key'][]
  onRequest: (key: SharedItem['key']) => void
  onAccept: () => void
  onPass: (reason: PassReason, detail?: string) => void
}) {
  const [passing, setPassing] = useState(false)
  const [reason, setReason] = useState<PassReason | null>(null)
  const [detail, setDetail] = useState('')
  const sharedCount = intro.items.filter((i) => i.shared).length

  return (
    <article className="fp-card overflow-hidden">
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-xl">{intro.household}</h2>
            <p className="text-sm text-muted">{intro.area}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-extrabold ${
              intro.verdict === 'ready'
                ? 'bg-teal-light text-teal-dark'
                : 'bg-peach text-orange-ink'
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

      <div className="border-t border-[#EDF0F3] bg-[#F3F8F8] px-6 py-5">
        <p className="text-sm font-semibold text-navy">
          Shared with you by consent on {intro.consentedOn} ({sharedCount} of {intro.items.length})
        </p>
        <dl className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {intro.items.map((item) =>
            item.shared ? (
              <div key={item.key}>
                <dt className="fp-eyebrow">{item.label}</dt>
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
                <dd className="mt-1 text-sm">
                  {requested.includes(item.key) ? (
                    <span className="font-semibold text-teal">Request noted</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRequest(item.key)}
                      className="font-semibold text-teal underline-offset-4 hover:underline"
                    >
                      Not shared. Ask to see this
                    </button>
                  )}
                </dd>
              </div>
            ),
          )}
        </dl>
        <p className="mt-3 text-xs">
          They can take back what they shared at any time.
          {requested.length > 0 &&
            ' In this preview we note what you asked for and do not send it.'}
        </p>
      </div>

      <div className="border-t border-[#EDF0F3] px-6 py-4">
        {!passing ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button full={false} variant="secondary" onClick={() => setPassing(true)}>
              Pass
            </Button>
            <Button full={false} onClick={onAccept}>
              <span className="inline-flex items-center gap-2">
                <CheckIcon /> Accept introduction
              </span>
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
                  className={`min-h-[44px] rounded-[10px] border px-3 py-2 text-left text-sm font-semibold ${
                    reason === r.value
                      ? 'border-teal bg-teal-light text-navy shadow-[inset_3px_0_#168c91]'
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
                  className="fp-input mt-1 w-full"
                />
              </label>
            )}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" full={false} onClick={() => setPassing(false)}>
                Cancel
              </Button>
              <Button
                full={false}
                disabled={!reason}
                onClick={() => reason && onPass(reason, detail.trim() || undefined)}
              >
                Pass on this one
              </Button>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
