import type { SharedAnswers, Worry } from '../types'
import {
  HOURS_MAX,
  OVERNIGHT_OPTIONS,
  VET_OPTIONS,
  WORRY_OPTIONS,
  hoursLabel,
} from '../data/questions'
import { OptionButton } from './ui'

export type SharedId = 'hours' | 'overnights' | 'vet' | 'worries'

export const SHARED_TITLES: Record<SharedId, { title: string; help?: string }> = {
  hours: { title: 'On a normal weekday, how many hours is nobody home?' },
  overnights: { title: 'How many nights a month is nobody home overnight?' },
  vet: { title: 'If a vet visit cost $1,500 tomorrow, how would that feel?' },
  worries: { title: 'What worries you most?', help: 'Pick any that fit.' },
}

export function isAnswered(id: SharedId, a: SharedAnswers): boolean {
  if (id === 'hours') return a.hoursAlone !== undefined
  if (id === 'overnights') return a.overnights !== undefined
  if (id === 'vet') return a.vetCost !== undefined
  return true // worries can be left empty
}

type Props = {
  id: SharedId
  answers: SharedAnswers
  onChange: (patch: SharedAnswers) => void
  hidePartnerWorry?: boolean
}

export function SharedQuestion({ id, answers, onChange, hidePartnerWorry }: Props) {
  if (id === 'hours') {
    const touched = answers.hoursAlone !== undefined
    const value = answers.hoursAlone ?? 6
    return (
      <div className="fp-card p-6">
        <p
          className={`mb-6 text-center font-heading text-4xl font-extrabold ${touched ? 'text-navy' : 'text-line'}`}
        >
          {touched ? hoursLabel(value) : 'Slide to answer'}
        </p>
        <input
          type="range"
          min={0}
          max={HOURS_MAX}
          step={1}
          value={value}
          aria-label="Hours nobody is home on a weekday"
          onChange={(e) => onChange({ hoursAlone: Number(e.target.value) })}
          onClick={(e) => onChange({ hoursAlone: Number((e.target as HTMLInputElement).value) })}
          className="h-10 w-full cursor-pointer accent-teal"
        />
        <div className="mt-1 flex justify-between text-sm">
          <span>0</span>
          <span>6</span>
          <span>12+</span>
        </div>
      </div>
    )
  }

  if (id === 'overnights') {
    return (
      <div className="space-y-3" role="radiogroup">
        {OVERNIGHT_OPTIONS.map((o) => (
          <OptionButton
            key={o.value}
            selected={answers.overnights === o.value}
            onClick={() => onChange({ overnights: o.value })}
          >
            {o.label}
          </OptionButton>
        ))}
      </div>
    )
  }

  if (id === 'vet') {
    return (
      <div className="space-y-3" role="radiogroup">
        {VET_OPTIONS.map((o) => (
          <OptionButton
            key={o.value}
            selected={answers.vetCost === o.value}
            onClick={() => onChange({ vetCost: o.value })}
          >
            {o.label}
          </OptionButton>
        ))}
      </div>
    )
  }

  const worries = answers.worries ?? []
  const toggle = (w: Worry) =>
    onChange({ worries: worries.includes(w) ? worries.filter((x) => x !== w) : [...worries, w] })
  return (
    <div className="space-y-3">
      {WORRY_OPTIONS.filter((o) => !(hidePartnerWorry && o.value === 'partner')).map((o) => (
        <OptionButton
          key={o.value}
          multi
          selected={worries.includes(o.value)}
          onClick={() => toggle(o.value)}
        >
          {o.label}
        </OptionButton>
      ))}
    </div>
  )
}
