import logo from '@firstpet/theme/logo.png'
import type { PrototypeInfo } from '../data/prototype'

type Props = {
  info: PrototypeInfo
}

// Placeholder screen so the app builds, deploys, and renders before any
// prototype features exist. Replace when prototype work starts.
export function PlaceholderHome({ info }: Props) {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <div className="mb-8 flex items-center gap-4">
        <img src={logo} alt="FirstPet logo" className="h-14 w-14 rounded-2xl" />
        <div>
          <p className="font-heading text-sm font-bold uppercase tracking-wide text-teal">
            FirstPet prototype {info.letter}
          </p>
          <h1 className="text-3xl font-extrabold">{info.name}</h1>
        </div>
      </div>

      <section className="fp-card space-y-6 p-6">
        <div className="flex gap-4">
          <span className="fp-icon-teal shrink-0" aria-hidden="true">
            <PersonIcon />
          </span>
          <div>
            <h2 className="text-lg font-bold">Persona</h2>
            <p>{info.persona}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="fp-icon-orange shrink-0" aria-hidden="true">
            <BulbIcon />
          </span>
          <div>
            <h2 className="text-lg font-bold">Hypothesis</h2>
            <p>{info.hypothesis}</p>
          </div>
        </div>
      </section>

      <p className="mt-6 rounded-card bg-peach px-4 py-3 text-sm">
        We are still building this prototype. The hypothesis above is a draft the team is editing.
      </p>
    </main>
  )
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
    </svg>
  )
}

function BulbIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18h6M10 21h4" strokeLinecap="round" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3Z" />
    </svg>
  )
}
