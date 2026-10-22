import type { ReactNode } from 'react'
import { reviewCheckIn } from '../data/checkin'
import { shelter } from '../data/shelter'
import { navigate } from '../lib/router'
import { useStore } from '../lib/storage'
import { upcoming } from '../screens/Visits'
import { CalendarIcon, ChatIcon, CheckIcon, ClipboardIcon, HomeIcon } from './ui'

// The counselor's workspace shell, rebuilt from Sala's Shelter Workspace
// prototype: a navy sidebar with the sections, a white top bar with the
// shelter, and the 1180px page. On small screens the sidebar becomes tabs.

export type Section = 'visits' | 'checkins' | 'adopters' | 'plans'

export function Workspace({ section, children }: { section: Section; children: ReactNode }) {
  const { applicants, requests } = useStore()
  const attention = applicants.filter((a) => {
    const s = reviewCheckIn(a).status
    return s === 'call' || s === 'message'
  }).length

  const items: { id: Section; label: string; short: string; icon: ReactNode; count?: number }[] = [
    {
      id: 'visits',
      label: 'Upcoming visits',
      short: 'Visits',
      icon: <CalendarIcon />,
      count: upcoming(applicants).length + requests.length,
    },
    {
      id: 'checkins',
      label: 'Week-two check-ins',
      short: 'Check-ins',
      icon: <ChatIcon />,
      count: attention || undefined,
    },
    {
      id: 'adopters',
      label: 'All adopters',
      short: 'Adopters',
      icon: <ClipboardIcon />,
      count: applicants.length,
    },
    { id: 'plans', label: 'Plans', short: 'Plans', icon: <CheckIcon /> },
  ]
  const go = (id: Section) => navigate(id === 'visits' ? '/counselor' : `/counselor/${id}`)

  return (
    <div className="min-h-screen">
      <aside className="fp-sidebar">
        <a href="#/" className="fp-brand px-2">
          <span className="fp-brand-mark" aria-hidden="true" />
          <span>
            <span className="fp-brand-name">
              First<span className="text-orange">Pet</span>
            </span>
            <span className="fp-brand-sub">Adoption counter</span>
          </span>
        </a>
        <p className="mx-1 mb-7 mt-6 flex items-start gap-2 rounded-lg border border-white/10 px-2.5 py-2 text-[11px] leading-snug text-[#C7D2E0]">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4DC4C5] shadow-[0_0_0_3px_rgba(77,196,197,0.13)]" />
          Sample shelter: made-up adopters and pets
        </p>
        <nav aria-label="Workspace">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8598B0]">
            Workspace
          </p>
          {items.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => go(it.id)}
              aria-current={section === it.id ? 'page' : undefined}
              className="fp-side-item"
            >
              <span className="[&>svg]:h-[18px] [&>svg]:w-[18px]">{it.icon}</span>
              <span className="flex-1">{it.label}</span>
              {it.count !== undefined && (
                <b className={`fp-side-count ${it.id === 'checkins' ? 'bg-orange text-navy' : ''}`}>
                  {it.count}
                </b>
              )}
            </button>
          ))}
          <button
            type="button"
            onClick={() => navigate('/start')}
            className="mt-3 flex w-full items-center gap-2.5 rounded-[9px] border border-white/10 bg-white/5 px-3 py-2.5 text-left text-[13px] font-semibold text-[#C7D3DF] hover:bg-white/10 hover:text-white"
          >
            <HomeIcon className="h-4 w-4" /> Open as an adopter
          </button>
        </nav>
        <div className="mt-auto flex items-center gap-2.5 border-t border-white/10 px-2 pt-4">
          <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[#D9EDF0] text-[11px] font-extrabold text-navy">
            C
          </span>
          <span className="flex flex-col">
            <strong className="text-[13px]">Carla</strong>
            <span className="text-[11px] text-[#8FA3BA]">Adoption coordinator</span>
          </span>
        </div>
      </aside>

      <div className="lg:ml-[248px]">
        <header className="fp-workbar">
          <a href="#/" className="fp-brand lg:hidden">
            <span className="fp-brand-mark" aria-hidden="true" />
            <span className="fp-brand-name text-navy">
              First<span className="text-orange">Pet</span>
            </span>
          </a>
          <div className="ml-auto flex flex-col text-right">
            <span className="text-[11px] font-bold uppercase tracking-[0.07em] text-muted">
              Viewing as
            </span>
            <strong className="text-[14px] text-navy">{shelter.name}</strong>
          </div>
          <span className="hidden border-l border-line pl-4 text-xs text-muted sm:block">
            Saved in this browser only
          </span>
        </header>
        <nav
          aria-label="Workspace"
          className="flex gap-1 overflow-x-auto border-b border-line bg-white px-3 lg:hidden print:hidden"
        >
          {items.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => go(it.id)}
              aria-current={section === it.id ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-[3px] px-3 py-3 text-sm font-extrabold ${
                section === it.id ? 'border-orange text-navy' : 'border-transparent text-muted'
              }`}
            >
              {it.short}
              {it.count !== undefined && (
                <span className="rounded-full bg-teal-light px-1.5 text-xs text-teal">
                  {it.count}
                </span>
              )}
            </button>
          ))}
        </nav>
        <main className="fp-page fp-enter">{children}</main>
      </div>
    </div>
  )
}
