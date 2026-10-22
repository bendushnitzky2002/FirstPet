import type { Check } from '../types'
import { compareRows } from '../data/verdict'
import { CompareTable } from '../components/CompareTable'
import { CostBlock } from '../components/CostBlock'
import { AlertIcon, Button, Page, PageHead, TopBar } from '../components/ui'
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

  const cta = (
    <Button full={false} onClick={() => navigate('/verdict')}>
      {solo ? 'See my verdict' : 'See our verdict'}
    </Button>
  )

  return (
    <Page
      stage="compare"
      aside={
        <>
          <CostBlock check={check} />
          <div className="lg:hidden">{cta}</div>
        </>
      }
    >
      <TopBar onBack={() => navigate(solo ? '/' : partnerDone ? '/' : '/invite')} />
      <PageHead
        eyebrow={solo ? 'Your answers' : 'Side by side'}
        title={title}
        action={<div className="hidden lg:block">{cta}</div>}
      >
        {partnerDone
          ? `${
              matches === 0
                ? 'None of your answers match yet'
                : `${matches} ${matches === 1 ? 'answer matches' : 'answers match'}`
            }. ${
              talks
                ? `${talks} ${talks === 1 ? 'is' : 'are'} worth a talk before the verdict.`
                : 'Nothing to argue about.'
            }`
          : undefined}
      </PageHead>

      {!solo && !partnerDone && (
        <div className="mb-5 flex gap-3 rounded-[11px] border border-[#F0B99C] bg-[#FFF6F0] p-4">
          <span className="fp-icon-orange shrink-0 bg-[#FFDDCB]">
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

      <CompareTable check={check} />
    </Page>
  )
}
