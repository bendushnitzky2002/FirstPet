import type { ReactNode } from 'react'
import logo from '@firstpet/theme/logo.png'

export type Stage = 'answers' | 'invite' | 'compare' | 'verdict'

const STAGES: { id: Stage; label: string; href: string }[] = [
  { id: 'answers', label: 'Your answers', href: '#/check' },
  { id: 'invite', label: 'Invite', href: '#/invite' },
  { id: 'compare', label: 'Side by side', href: '#/compare' },
  { id: 'verdict', label: 'Verdict', href: '#/verdict' },
]

// The 1180px page frame from Sala's apps. With an aside, the page is a main
// column plus a 340px side column on wide screens.
export function Page({
  children,
  aside,
  stage,
}: {
  children: ReactNode
  aside?: ReactNode
  stage?: Stage
}) {
  return (
    <div className="min-h-screen">
      <AppBar stage={stage} />
      <main className="fp-page pb-24">
        {aside ? (
          <div className="fp-layout pt-8 sm:pt-10">
            <div className="fp-enter flex min-w-0 flex-col">{children}</div>
            <aside className="fp-enter fp-delay-1 space-y-4 lg:sticky lg:top-24">{aside}</aside>
          </div>
        ) : (
          <div className="fp-enter flex flex-col pt-8 sm:pt-10">{children}</div>
        )}
      </main>
    </div>
  )
}

// Navy top bar with the brand mark and, during a check, the four stages as
// tabs (like the nav in Sala's Customer Persona app).
function AppBar({ stage }: { stage?: Stage }) {
  const nav = stage && (
    <nav aria-label="Check stages" className="fp-nav-inline">
      {STAGES.map((s) => (
        <a
          key={s.id}
          href={s.href}
          aria-current={s.id === stage ? 'page' : undefined}
          className="fp-nav-tab"
        >
          {s.label}
        </a>
      ))}
    </nav>
  )
  return (
    <header className="fp-topbar">
      <div className="fp-topbar-inner">
        <a href="#/" className="fp-brand">
          <span className="fp-brand-mark" aria-hidden="true" />
          <span>
            <span className="fp-brand-name">
              First<span className="text-orange">Pet</span>
            </span>
            <span className="fp-brand-sub">Readiness check</span>
          </span>
        </a>
        {nav && <div className="ml-auto hidden h-full md:block">{nav}</div>}
      </div>
      {nav && <div className="overflow-x-auto px-2 md:hidden">{nav}</div>}
    </header>
  )
}

// Eyebrow, title and copy on the left, an action on the right.
export function PageHead({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow?: string
  title: ReactNode
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="fp-page-head -mt-8 sm:-mt-10">
      <div className="min-w-0">
        {eyebrow && <span className="fp-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {children && <p>{children}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

// Navy guide card for the side column, with numbered steps.
export function Guide({
  eyebrow,
  title,
  steps,
  current,
  children,
}: {
  eyebrow: string
  title: string
  steps: string[]
  current?: number
  children?: ReactNode
}) {
  return (
    <section className="fp-guide">
      <span className="fp-eyebrow text-[#90D2D0]">{eyebrow}</span>
      <h2 className="text-lg leading-snug">{title}</h2>
      <div className="my-4 h-px bg-white/10" />
      <ol className="space-y-3">
        {steps.map((label, i) => {
          const done = current !== undefined && i < current
          const here = i === current
          return (
            <li key={label} className="flex items-center gap-3">
              <span
                className={`fp-guide-num transition-colors duration-300 ${here ? 'bg-orange text-white' : done ? 'bg-teal text-white' : ''}`}
              >
                {done ? <CheckIcon className="fp-pop h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className={`text-sm ${here ? 'font-bold text-white' : ''}`}>{label}</span>
            </li>
          )
        })}
      </ol>
      {children && <div className="mt-5 text-sm">{children}</div>}
    </section>
  )
}

export function LogoMark({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const box = size === 'lg' ? 'h-16 w-16' : 'h-10 w-10'
  return <img src={logo} alt="FirstPet" className={`shrink-0 ${box}`} />
}

export function TopBar({ onBack, right }: { onBack?: () => void; right?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3 print:hidden">
      <div className="flex items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="-ml-2 inline-flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-bold text-muted hover:text-teal"
          >
            <ArrowLeft /> Back
          </button>
        ) : null}
      </div>
      {right}
    </div>
  )
}

type ButtonProps = {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'quiet'
  type?: 'button' | 'submit'
  full?: boolean
}

export function Button({
  children,
  onClick,
  disabled,
  variant = 'primary',
  type = 'button',
  full = true,
}: ButtonProps) {
  const styles = {
    primary: 'fp-btn fp-btn-primary',
    secondary: 'fp-btn fp-btn-secondary',
    quiet: 'fp-btn text-teal underline-offset-4 hover:underline',
  }[variant]
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-[46px] px-5 py-2.5 text-[15px] ${full ? 'w-full' : ''} ${styles}`}
    >
      {children}
    </button>
  )
}

export function OptionButton({
  selected,
  onClick,
  children,
  multi = false,
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
  multi?: boolean
}) {
  return (
    <button
      type="button"
      role={multi ? 'checkbox' : 'radio'}
      aria-checked={selected}
      onClick={onClick}
      className={`flex min-h-[54px] w-full items-center gap-3 rounded-[10px] border bg-white px-4 py-3 text-left text-base font-semibold transition-colors ${
        selected
          ? 'border-teal bg-teal-light text-navy shadow-[inset_3px_0_#168c91]'
          : 'border-line text-body hover:border-teal/50'
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 ${multi ? 'rounded-md' : 'rounded-full'} ${
          selected ? 'border-teal bg-teal text-white' : 'border-line bg-white'
        }`}
      >
        {selected && <CheckIcon className="fp-pop h-4 w-4" />}
      </span>
      {children}
    </button>
  )
}

export function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-6">
      <p className="fp-eyebrow mb-2">
        Question {current} of {total}
      </p>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-[#E9EFED]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <div
          className="fp-bar h-full rounded-full bg-orange"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  )
}

export function Initial({ name, tone }: { name: string; tone: 'teal' | 'orange' }) {
  return (
    <span
      className={`${tone === 'teal' ? 'fp-icon-teal' : 'fp-icon-orange'} font-heading font-extrabold`}
    >
      {(name || '?').charAt(0).toUpperCase()}
    </span>
  )
}

export function CheckIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ChatIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path d="M4 5h16v10H9l-5 4V5Z" strokeLinejoin="round" />
    </svg>
  )
}

export function AlertIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path d="M12 3 2 20h20L12 3Z" strokeLinejoin="round" />
      <path d="M12 10v4M12 17h.01" strokeLinecap="round" />
    </svg>
  )
}

export function ArrowLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
