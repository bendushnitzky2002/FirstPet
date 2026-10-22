import { useState } from 'react'
import { Button, Page, TopBar } from '../components/ui'
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

  return (
    <Page>
      <TopBar onBack={() => navigate('/')} />
      <p className="text-sm font-bold uppercase tracking-wide text-teal">Team view</p>
      <h1 className="mt-1 text-3xl font-extrabold">Premium survey results</h1>
      <p className="mt-2">
        Every check that reached a verdict in this browser. Our hypothesis holds if at least{' '}
        {PREMIUM_THRESHOLD * 100}% say yes.
      </p>

      <section className="fp-card mt-6 grid grid-cols-3 divide-x divide-line text-center">
        <Stat label="Completed" value={completed} />
        <Stat label="Said yes" value={yes} />
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

      <div className="mt-10">
        <Button
          variant="secondary"
          onClick={() => {
            clearSurvey()
            setEntries([])
          }}
        >
          Clear results
        </Button>
      </div>
    </Page>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4">
      <p className="font-heading text-3xl font-extrabold text-navy">{value}</p>
      <p className="text-sm">{label}</p>
    </div>
  )
}
