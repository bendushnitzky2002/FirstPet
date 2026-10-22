import { useEffect, useRef, type ReactNode } from 'react'
import { StepRail } from '../components/shelter'
import { ChevronRight, ClipboardIcon, HomeIcon, Page, SampleNote } from '../components/ui'
import { demoApplicants, sampleApplicants, sampleRequests } from '../data/seed'
import { shelter } from '../data/shelter'
import { navigate } from '../lib/router'
import { resetTo } from '../lib/storage'

// Two doors into one loop: the adopter's side and the counselor's side.
export function Landing() {
  useDemoShortcut()
  return (
    <Page>
      <div className="flex flex-1 flex-col justify-center">
        <section className="fp-hero flex min-h-[280px] flex-col justify-center p-6 sm:p-10">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10"
          />
          <p className="fp-eyebrow text-[#90D2D0]">FirstPet for shelters</p>
          <h1 className="max-w-[680px] text-4xl leading-tight text-white sm:text-5xl">
            The readiness check is step one of adoption.
          </h1>
          <p className="mt-4 max-w-[680px] text-lg text-[#B9CAD3]">
            Shelters send adopters a free 5-minute check before they visit. Counselors see each
            upcoming visit with the result and anything missing, then a check-in two weeks after the
            pet goes home.
          </p>
        </section>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Door
            onClick={() => navigate('/start')}
            icon={<HomeIcon />}
            tone="teal"
            title="I'm adopting"
            text={`${shelter.name} asked me to start here.`}
          />
          <Door
            onClick={() => navigate('/counselor')}
            icon={<ClipboardIcon />}
            tone="orange"
            title="I'm an adoption counselor"
            text="Upcoming visits, week-two check-ins, and plans."
          />
        </div>

        <section className="fp-card mt-5 p-6">
          <span className="fp-eyebrow">How adoption works at {shelter.short}</span>
          <div className="mt-3">
            <StepRail current={0} />
          </div>
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <SampleNote>
            {shelter.name}, its pets, and its adopters are samples. Nothing leaves this browser.
          </SampleNote>
          <button
            type="button"
            onClick={() => resetTo(sampleApplicants(), sampleRequests())}
            className="text-xs font-semibold text-teal underline-offset-4 hover:underline"
          >
            Reset sample data
          </button>
        </div>
      </div>
    </Page>
  )
}

function Door({
  onClick,
  icon,
  tone,
  title,
  text,
}: {
  onClick: () => void
  icon: ReactNode
  tone: 'teal' | 'orange'
  title: string
  text: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fp-card flex w-full items-center gap-4 p-6 text-left transition hover:-translate-y-px hover:border-teal"
    >
      <span className={tone === 'teal' ? 'fp-icon-teal' : 'fp-icon-orange'}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-heading text-xl font-extrabold text-navy">{title}</span>
        <span className="block">{text}</span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-teal" />
    </button>
  )
}

// Press "d" three times on this page to load the rehearsal demo and jump to
// the counselor workspace. See docs/demo-script.md.
function useDemoShortcut() {
  const presses = useRef<number[]>([])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      if (e.key.toLowerCase() !== 'd') {
        presses.current = []
        return
      }
      const now = Date.now()
      presses.current = [...presses.current.filter((t) => now - t < 1500), now]
      if (presses.current.length >= 3) {
        presses.current = []
        resetTo(demoApplicants(), sampleRequests())
        navigate('/counselor')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
