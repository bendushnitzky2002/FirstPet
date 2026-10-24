import { useEffect } from 'react'
import type { Check } from '../types'
import { getVerdict, type Verdict as VerdictData } from '../data/verdict'
import { firstYear, money } from '../data/costs'
import { AlertIcon, Button, CheckIcon, Page, TopBar } from '../components/ui'
import { PremiumSurvey } from '../components/PremiumSurvey'
import { navigate } from '../lib/router'
import { recordCompleted } from '../lib/survey'

type Props = {
  check: Check
  save: (check: Check) => void
  onReset: () => void
}

export const VERDICT_TONE: Record<
  VerdictData['kind'],
  { text: string; bg: string; label: string }
> = {
  ready: { text: 'text-teal', bg: 'bg-teal-light', label: 'Our verdict' },
  'ready-once': { text: 'text-navy', bg: 'bg-peach', label: 'Our verdict' },
  'not-yet': { text: 'text-navy', bg: 'bg-line/60', label: 'Our verdict' },
}

export function Verdict({ check, save, onReset }: Props) {
  const v = getVerdict(check)
  const tone = VERDICT_TONE[v.kind]
  const cost = firstYear(check)

  // Reaching the verdict counts as a completed check for the premium survey.
  useEffect(() => recordCompleted(check.code), [check.code])

  const toggle = (id: string) =>
    save({
      ...check,
      checked: check.checked.includes(id)
        ? check.checked.filter((x) => x !== id)
        : [...check.checked, id],
    })

  return (
    <Page
      stage="verdict"
      aside={
        <div className="fp-card space-y-2 p-4">
          <Button onClick={() => navigate('/summary')}>Save this as a one-page summary</Button>
          <Button variant="secondary" onClick={onReset}>
            Start over
          </Button>
        </div>
      }
    >
      <TopBar onBack={() => navigate('/compare')} />

      {v.basedOnOne && (
        <div className="mb-5 rounded-[11px] border border-[#F0B99C] bg-[#FFF6F0] p-4">
          <div className="flex gap-3">
            <span className="fp-icon-orange shrink-0 bg-[#FFDDCB]">
              <AlertIcon />
            </span>
            <p className="font-semibold text-navy">
              This is based on one person's answers. Invite your partner for the full picture.
            </p>
          </div>
          <div className="mt-3">
            <Button variant="secondary" full={false} onClick={() => navigate('/invite')}>
              Invite your partner
            </Button>
          </div>
        </div>
      )}

      <section
        className={`fp-reveal rounded-[14px] border-t-4 p-6 sm:p-8 ${tone.bg} ${v.kind === 'ready' ? 'border-teal' : 'border-orange'}`}
      >
        <p className="fp-eyebrow text-muted">{tone.label}</p>
        <h1 className={`text-4xl leading-none sm:text-5xl ${tone.text}`}>{v.title}</h1>
        <p className="mt-4 text-lg text-navy">{v.summary}</p>
        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-navy/10 pt-4">
          <span className="font-heading text-2xl font-extrabold text-navy">
            {money(cost.total)}
          </span>
          <span className="text-navy">
            to plan for in year one, including the {money(cost.cushion)} required cushion.
          </span>
          <button
            type="button"
            onClick={() => navigate('/compare')}
            className="text-sm font-bold text-teal underline-offset-4 hover:underline"
          >
            See the breakdown
          </button>
        </div>
      </section>

      <div className="fp-stagger mt-5 grid gap-5 xl:grid-cols-2">
        <section className="fp-card p-5">
          <h2 className="text-lg">Why</h2>
          <ul className="mt-3 space-y-2">
            {v.reasons.map((r) => (
              <li key={r} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange" aria-hidden="true" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>

        {v.todo.length > 0 && (
          <section className="fp-card p-5">
            <h2 className="text-lg">{v.todoTitle}</h2>
            <ul className="mt-3 space-y-2">
              {v.todo.map((t) => {
                const done = check.checked.includes(t.id)
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={done}
                      onClick={() => toggle(t.id)}
                      className="flex min-h-[48px] w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-canvas"
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                          done ? 'border-teal bg-teal text-white' : 'border-line bg-white'
                        }`}
                      >
                        {done && <CheckIcon className="fp-pop h-4 w-4" />}
                      </span>
                      <span
                        className={done ? 'text-body/70 line-through' : 'font-semibold text-navy'}
                      >
                        {t.text}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </div>

      {/* Premium comes after the verdict and the plan, as the next step of the
          same story, in the same place on desktop and mobile. */}
      <div className="mt-5">
        <PremiumSurvey check={check} save={save} from="verdict" />
      </div>
    </Page>
  )
}
