import { useState } from 'react'
import { Button, Page, PageHead, TopBar } from '../components/ui'
import { PREMIUM_THRESHOLD, clearSurvey, loadSurvey } from '../lib/survey'
import { navigate } from '../lib/router'

// Team view, not linked from the owner flow: open #/results after test sessions.
export function Results() {
  const [entries, setEntries] = useState(loadSurvey)
  const completed = entries.length
  const yes = entries.filter((e) => e.premium === 'yes').length
  const no = entries.filter((e) => e.premium === 'no').length
  const share = completed ? yes / completed : 0
  const pct = Math.round(share * 100)
  const answers = entries.filter((e) => e.worthIt)

  return (
    <Page>
      <TopBar onBack={() => navigate('/')} />
      <PageHead
        eyebrow="Team view"
        title="Premium fake door results"
        action={
          <Button
            variant="secondary"
            full={false}
            onClick={() => {
              clearSurvey()
              setEntries([])
            }}
          >
            Clear results
          </Button>
        }
      >
        Every check that reached a verdict in this browser counts as completed. Our hypothesis holds
        if at least {PREMIUM_THRESHOLD * 100}% of completed checks pick Premium.
      </PageHead>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Completed" value={completed} />
        <Stat label="Picked Premium" value={yes} />
        <Stat label="Said no" value={no} />
      </section>

      <section
        className={`mt-4 rounded-card p-5 ${completed && share >= PREMIUM_THRESHOLD ? 'bg-teal-light' : 'bg-peach'}`}
      >
        <p className="font-heading text-4xl font-extrabold text-navy">
          {completed ? `${pct}%` : 'No data yet'}
        </p>
        <p className="mt-1 text-navy">
          {completed
            ? share >= PREMIUM_THRESHOLD
              ? 'At or above the 10% threshold.'
              : 'Below the 10% threshold.'
            : 'Run a check to the verdict to see results here.'}
          {completed > yes + no ? ` ${completed - yes - no} did not answer.` : ''}
        </p>
      </section>

      <section className="fp-card mt-4 p-5">
        <h2 className="text-lg">What would make Premium worth it</h2>
        {answers.length ? (
          <ul className="mt-3 divide-y divide-line">
            {answers.map((e) => (
              <li key={e.code} className="flex gap-3 py-2 text-sm">
                <span
                  className={`fp-pill ${e.premium === 'yes' ? 'bg-teal-light text-teal' : 'bg-canvas text-muted'}`}
                >
                  {e.premium === 'yes' ? 'Yes' : 'No'}
                </span>
                <span className="text-navy">{e.worthIt}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted">No written answers yet.</p>
        )}
      </section>
    </Page>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="fp-metric">
      <p className="text-[13px] font-semibold text-muted">{label}</p>
      <p className="fp-metric-value">{value}</p>
    </div>
  )
}
