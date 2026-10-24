import type { State } from '../types'
import { INTRODUCTIONS, PASS_REASONS } from '../data/introductions'
import { TIER_LABEL } from '../data/membership'
import { Button, PageHead } from '../components/ui'

const time = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

const ENTRY_LABEL: Record<string, string> = {
  nav: 'top tab',
  'side-card': 'side card after an accept',
  banner: 'small-screen banner',
  'all-decided': 'note after the last decision',
}

// Hidden screen for our team at #/log: what this browser recorded in a test
// session. Not linked from the app.
export function Log({ state, onReset }: { state: State; onReset: () => void }) {
  const membership = state.joins.filter((j) => j.tier !== 'per-intro').length
  const perIntro = state.joins.length - membership
  // One choice per tester: the first option clicked is the one that counts.
  const first = state.joins[0]
  const fromCounts = state.views.reduce<Record<string, number>>((acc, v) => {
    acc[v.from] = (acc[v.from] ?? 0) + 1
    return acc
  }, {})
  const decisions = Object.values(state.decisions)
  const accepted = decisions.filter((d) => d.kind === 'accepted').length
  // Which locked items pros asked to see, most asked first.
  const asked = new Map<string, number>()
  for (const [id, keys] of Object.entries(state.requests)) {
    const intro = INTRODUCTIONS.find((i) => i.id === id)
    for (const key of keys) {
      const label = intro?.items.find((i) => i.key === key)?.label ?? key
      asked.set(label, (asked.get(label) ?? 0) + 1)
    }
  }
  const askedList = [...asked.entries()].sort((a, b) => b[1] - a[1])

  return (
    <>
      <PageHead eyebrow="Team view" title="Session log">
        What this browser recorded. For our team, after a test session.
      </PageHead>

      <div className="fp-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Metric label="Membership page views" value={state.views.length} />
        <Metric label="First choice" value={first ? TIER_LABEL[first.tier] : 'None yet'} />
        <Metric label="Membership clicks" value={membership} />
        <Metric label="Per-introduction clicks" value={perIntro} />
        <Metric label="Introductions accepted" value={`${accepted} of ${INTRODUCTIONS.length}`} />
        <Metric label="Locked items asked for" value={askedList.reduce((n, [, c]) => n + c, 0)} />
      </div>

      <p className="mt-4 text-sm">
        Count the first choice for each tester; later clicks are exploring.{' '}
        {state.perIntroFirst === undefined
          ? ''
          : `Pay per introduction was shown ${state.perIntroFirst ? 'first' : 'last'}. `}
        {state.views.length > 0 &&
          `Reached the page from: ${Object.entries(fromCounts)
            .map(([k, n]) => `${ENTRY_LABEL[k] ?? k} (${n})`)
            .join(', ')}.`}
      </p>

      {askedList.length > 0 && (
        <p className="mt-4 text-sm">
          Asked to see: {askedList.map(([label, n]) => `${label} (${n})`).join(', ')}.
        </p>
      )}

      <h2 className="mt-8 text-lg font-extrabold">Join clicks and answers</h2>
      {state.joins.length === 0 ? (
        <p className="mt-2 text-sm">No clicks yet.</p>
      ) : (
        <ul className="fp-card mt-3 divide-y divide-line">
          {state.joins.map((j, i) => (
            <li key={i} className="px-5 py-3">
              <p className="font-semibold text-navy">
                {TIER_LABEL[j.tier]} <span className="text-sm font-normal">{time(j.at)}</span>
              </p>
              <p className="text-sm">{j.answer ? `"${j.answer}"` : 'No answer given'}</p>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-8 text-lg font-extrabold">Introductions</h2>
      <ul className="fp-card mt-3 divide-y divide-line">
        {INTRODUCTIONS.map((intro) => {
          const d = state.decisions[intro.id]
          const shared = intro.items.filter((i) => i.shared).length
          return (
            <li key={intro.id} className="px-5 py-3">
              <p className="font-semibold text-navy">
                {intro.household}{' '}
                <span className="text-sm font-normal">
                  (shared {shared} of {intro.items.length})
                </span>
              </p>
              <p className="text-sm">
                {!d
                  ? 'Not decided'
                  : d.kind === 'accepted'
                    ? `Accepted, ${time(d.at)}`
                    : `Passed, ${time(d.at)}: ${PASS_REASONS.find((r) => r.value === d.reason)!.label}${d.detail ? `. "${d.detail}"` : ''}`}
              </p>
              {(state.requests[intro.id] ?? []).length > 0 && (
                <p className="text-sm text-muted">
                  Asked to see:{' '}
                  {state.requests[intro.id]
                    .map((k) => intro.items.find((i) => i.key === k)!.label)
                    .join(', ')}
                </p>
              )}
            </li>
          )
        })}
      </ul>

      <div className="mt-8 max-w-sm">
        <Button variant="secondary" onClick={onReset}>
          Reset the demo
        </Button>
      </div>
    </>
  )
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="fp-metric">
      <span className="text-[11px] font-bold uppercase tracking-[0.07em] text-muted">{label}</span>
      <span className="fp-metric-value">{value}</span>
    </div>
  )
}
