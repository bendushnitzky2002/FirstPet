import type { Check } from '../types'
import { getVerdict, type Verdict as VerdictData } from '../data/verdict'
import { AlertIcon, Button, CheckIcon, Page, TopBar } from '../components/ui'
import { navigate } from '../lib/router'

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

  const toggle = (id: string) =>
    save({
      ...check,
      checked: check.checked.includes(id)
        ? check.checked.filter((x) => x !== id)
        : [...check.checked, id],
    })

  return (
    <Page>
      <TopBar onBack={() => navigate('/compare')} />

      {v.basedOnOne && (
        <div className="mb-6 rounded-card border border-orange bg-peach p-4">
          <div className="flex gap-3">
            <span className="fp-icon-orange shrink-0 bg-white">
              <AlertIcon />
            </span>
            <p className="font-semibold text-navy">
              This is based on one person's answers. Invite your partner for the full picture.
            </p>
          </div>
          <div className="mt-3">
            <Button variant="secondary" onClick={() => navigate('/invite')}>
              Invite your partner
            </Button>
          </div>
        </div>
      )}

      <section className={`rounded-card p-6 sm:p-8 ${tone.bg}`}>
        <p className="text-sm font-bold uppercase tracking-wide text-body">{tone.label}</p>
        <h1 className={`mt-2 text-5xl font-extrabold leading-none sm:text-6xl ${tone.text}`}>
          {v.title}
        </h1>
        <p className="mt-4 text-lg text-navy">{v.summary}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-extrabold">Why</h2>
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
        <section className="fp-card mt-6 p-5">
          <h2 className="text-xl font-extrabold">{v.todoTitle}</h2>
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
                    className="flex min-h-[48px] w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-canvas"
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                        done ? 'border-teal bg-teal text-white' : 'border-line bg-white'
                      }`}
                    >
                      {done && <CheckIcon className="h-4 w-4" />}
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

      <div className="mt-10 space-y-3">
        <Button onClick={() => navigate('/summary')}>Save this as a one-page summary</Button>
        <Button variant="secondary" onClick={onReset}>
          Start over
        </Button>
      </div>
    </Page>
  )
}
