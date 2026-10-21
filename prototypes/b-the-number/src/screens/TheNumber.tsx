import type { Check, FirstTake } from '../types'
import { firstYear, money } from '../data/costs'
import { FIRST_TAKE_LABEL } from '../data/takes'
import { navigate } from '../lib/router'
import { Page, TopBar } from '../components/ui'
import { Receipt, SampleNote } from '../components/Receipt'

const TAKES = (['yes', 'unsure', 'no'] as FirstTake[]).map((value) => ({
  value,
  label: FIRST_TAKE_LABEL[value],
}))

// The screen the hypothesis lives on: the number comes first, before any
// household question. The only question here is the gut check.
export function TheNumber({ check, save }: { check: Check; save: (c: Check) => void }) {
  const number = firstYear(check.zip, check.pet)
  const ongoing = number.total - number.cushion - number.lines[0].amount

  const choose = (firstTake: FirstTake) => {
    save({ ...check, firstTake })
    navigate('/tune')
  }

  return (
    <Page>
      <TopBar
        onBack={() => navigate('/')}
        right={
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm font-semibold text-teal underline-offset-4 hover:underline"
          >
            Change ZIP
          </button>
        }
      />

      <p className="font-heading text-sm font-bold uppercase tracking-wide text-teal">
        First year with a {check.pet} in {number.place}
      </p>
      <p className="mt-2 font-heading text-7xl font-extrabold leading-none text-navy sm:text-8xl">
        {money(number.total)}
      </p>
      <p className="mt-4 text-lg">
        That is {money(ongoing)} of care, {money(number.lines[0].amount)} to get started, and a{' '}
        <strong className="text-navy">{money(number.cushion)} emergency cushion</strong> you set
        aside before day one.
      </p>

      <div className="mt-6">
        <Receipt number={number} />
      </div>
      <p className="mt-3 text-sm">
        Not counted yet:{' '}
        {check.pet === 'dog' ? 'a midday walker or an overnight sitter' : 'an overnight sitter'}.
        That depends on your schedule, and we add it next.
      </p>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-semibold text-teal">
          Where do these numbers come from?
        </summary>
        <p className="mt-2">
          In this prototype, they are sample numbers we wrote. In FirstPet, they would come from
          local vets and sitters in our vetted network. Membership never changes a number or a
          verdict.
        </p>
      </details>
      <div className="mt-2">
        <SampleNote number={number} />
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold">Where does this leave you?</h2>
        <p className="mt-1">Your first reaction. There is no wrong answer.</p>
        <div className="mt-4 space-y-3">
          {TAKES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => choose(t.value)}
              className={`flex min-h-[60px] w-full items-center justify-between rounded-card border-2 bg-white px-5 py-4 text-left text-lg font-semibold transition-colors hover:border-teal ${
                check.firstTake === t.value ? 'border-teal bg-teal-light text-navy' : 'border-line'
              }`}
            >
              {t.label}
              <span aria-hidden="true" className="text-teal">
                →
              </span>
            </button>
          ))}
        </div>
      </section>
    </Page>
  )
}
