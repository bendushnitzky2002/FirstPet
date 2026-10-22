import type { Check } from '../types'
import { compareRows } from '../data/verdict'
import { ChatIcon, CheckIcon, Initial } from './ui'

// The two-column comparison. Used on the side by side screen and the printable summary.
export function CompareTable({ check, compact = false }: { check: Check; compact?: boolean }) {
  const rows = compareRows(check)
  const solo = check.deciding === 'solo'
  const partnerName = check.partner?.done ? check.partner.name : 'Your partner'
  const cols = solo ? 'grid-cols-1' : 'grid-cols-2'

  return (
    <div className={compact ? '' : 'fp-card overflow-hidden'}>
      <div
        className={`grid ${cols} gap-3 ${compact ? 'px-1 pb-3' : 'border-b border-[#EDF0F3] bg-[#F7F9FA] px-5 py-3 sm:px-6'}`}
      >
        <NameHead name={check.starter.name} tone="teal" />
        {!solo && <NameHead name={partnerName} tone="orange" muted={!check.partner?.done} />}
      </div>

      <ul
        className={
          compact ? 'divide-y divide-line border-y border-line' : 'divide-y divide-[#EDF0F3]'
        }
      >
        {rows.map((r) => (
          <li key={r.id} className={compact ? 'py-3' : 'px-5 py-4 sm:px-6'}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-muted">
                {r.label}
              </p>
              {r.status === 'match' && (
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-light">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  Match
                </span>
              )}
              {r.status === 'differ' && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-peach px-3 py-1 text-xs font-extrabold text-orange-ink">
                  <ChatIcon /> Talk about this
                </span>
              )}
            </div>
            <div className={`grid ${cols} gap-3`}>
              <Answer text={r.a} highlight={r.status === 'differ'} />
              {!solo &&
                (r.b !== undefined ? (
                  <Answer text={r.b} highlight={r.status === 'differ'} />
                ) : (
                  <p className="rounded-lg border border-dashed border-line px-3 py-2 italic text-body/70">
                    Not answered yet
                  </p>
                ))}
            </div>
            {r.nudge && (
              <p className="mt-3 rounded-lg bg-peach px-3 py-2 text-[15px] text-navy print:mt-2 print:py-1 print:text-xs">
                {r.nudge}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function NameHead({
  name,
  tone,
  muted,
}: {
  name: string
  tone: 'teal' | 'orange'
  muted?: boolean
}) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${muted ? 'opacity-60' : ''}`}>
      <Initial name={name} tone={tone} />
      <span className="truncate font-heading text-lg font-extrabold text-navy">{name}</span>
    </div>
  )
}

function Answer({ text, highlight }: { text: string; highlight: boolean }) {
  return (
    <p
      className={`rounded-lg px-3 py-2 font-semibold text-navy ${highlight ? 'bg-white ring-2 ring-orange/60' : 'bg-canvas'}`}
    >
      {text}
    </p>
  )
}
