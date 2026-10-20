import type { Check } from '../types'
import { compareRows } from '../data/verdict'
import { CompareTable } from '../components/CompareTable'
import { CostBlock } from '../components/CostBlock'
import { AlertIcon, Button, Page, TopBar } from '../components/ui'
import { navigate } from '../lib/router'

export function Compare({ check, fromPartner }: { check: Check; fromPartner: boolean }) {
  const solo = check.deciding === 'solo'
  const partnerDone = !!check.partner?.done
  const rows = compareRows(check)
  const matches = rows.filter((r) => r.status === 'match').length
  const talks = rows.filter((r) => r.status === 'differ').length

  let title = "Here's what you both said."
  if (fromPartner) title = "Thanks. Here's what you both said."
  if (solo) title = "Here's what you told us."
  if (!solo && !partnerDone) title = "Here's your side so far."

  return (
    <Page wide>
      <TopBar onBack={() => navigate(solo ? '/' : partnerDone ? '/' : '/invite')} />
      <p className="text-sm font-bold uppercase tracking-wide text-teal">
        {solo ? 'Your answers' : 'Side by side'}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h1>

      {partnerDone && (
        <p className="mt-3 text-lg">
          {matches === 0
            ? 'None of your answers match yet'
            : `${matches} ${matches === 1 ? 'answer matches' : 'answers match'}`}
          .{' '}
          {talks
            ? `${talks} ${talks === 1 ? 'is' : 'are'} worth a talk before the verdict.`
            : 'Nothing to argue about.'}
        </p>
      )}

      {!solo && !partnerDone && (
        <div className="mt-5 flex gap-3 rounded-card border border-orange bg-peach p-4">
          <span className="fp-icon-orange shrink-0 bg-white">
            <AlertIcon />
          </span>
          <div>
            <p className="font-semibold text-navy">Your partner hasn't answered yet.</p>
            <p className="text-sm">This preview uses only your answers.</p>
            <button
              type="button"
              onClick={() => navigate('/invite')}
              className="mt-1 text-sm font-bold text-teal underline-offset-4 hover:underline"
            >
              Back to the invite
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <CompareTable check={check} />
      </div>

      <div className="mt-6">
        <CostBlock check={check} />
      </div>

      <div className="mt-8">
        <Button onClick={() => navigate('/verdict')}>
          {solo ? 'See my verdict' : 'See our verdict'}
        </Button>
      </div>
    </Page>
  )
}
