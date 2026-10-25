import type { ReactNode } from 'react'
import logo from '@firstpet/theme/logo.png'
import type { CheckInStatus } from '../data/checkin'
import { statusLabel } from '../data/checkin'
import type { VerdictKind } from '../data/verdict'
import { verdictLabel } from '../data/verdict'
import { initials } from '../lib/format'

// The 1180px page frame from Sala's apps. With an aside, the page is a main
// column plus a 340px side column on wide screens.
export function Page({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppBar />
      <main className="fp-page">
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

// Navy top bar with the brand mark, shared look with the other apps.
function AppBar() {
  return (
    <header className="fp-topbar">
      <div className="fp-topbar-inner">
        <a href="#/" className="fp-brand">
          <span className="fp-brand-mark" aria-hidden="true" />
          <span>
            <span className="fp-brand-name">
              First<span className="text-orange">Pet</span>
            </span>
            <span className="fp-brand-sub">Shelter hand-off</span>
          </span>
        </a>
      </div>
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
    <div className="fp-page-head">
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

export function BackLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-ml-2 inline-flex h-10 items-center gap-1 rounded-lg px-2 text-sm font-bold text-muted hover:text-teal print:hidden"
    >
      <ArrowLeft /> {children}
    </button>
  )
}

type ButtonProps = {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'quiet'
  size?: 'lg' | 'sm'
  full?: boolean
  // Extra classes, such as fp-shimmer on a paid option.
  className?: string
}

export function Button({
  children,
  onClick,
  disabled,
  variant = 'primary',
  size = 'lg',
  full = true,
  className = '',
}: ButtonProps) {
  const styles = {
    primary: 'fp-btn fp-btn-primary',
    secondary: 'fp-btn fp-btn-secondary',
    quiet: 'fp-btn text-teal underline-offset-4 hover:underline',
  }[variant]
  const sizing =
    size === 'lg' ? 'min-h-[46px] px-5 py-2.5 text-[15px]' : 'min-h-[40px] px-4 py-2 text-sm'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`print:hidden ${sizing} ${full ? 'w-full' : ''} ${styles} ${className}`}
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
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E9EFED]">
        <div
          className="fp-bar h-full rounded-full bg-orange"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  )
}

const verdictStyle: Record<VerdictKind, string> = {
  ready: 'bg-teal-light text-teal-dark',
  'ready-once': 'bg-peach text-orange-ink',
  'not-yet': 'bg-navy text-white',
}

export function VerdictChip({ kind }: { kind: VerdictKind }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${verdictStyle[kind]}`}
    >
      {kind === 'ready-once' ? 'Ready once' : verdictLabel[kind]}
    </span>
  )
}

const statusStyle: Record<CheckInStatus, string> = {
  call: 'bg-orange text-navy',
  message: 'bg-peach text-orange-ink',
  followed: 'border border-teal bg-white text-teal-dark',
  well: 'bg-teal-light text-teal-dark',
  due: 'border border-line bg-white text-body',
  upcoming: 'border border-line bg-white text-body',
  'not-adopted': 'border border-line bg-white text-body',
}

export function StatusChip({ status, label }: { status: CheckInStatus; label?: string }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${statusStyle[status]}`}
    >
      {label ?? statusLabel[status]}
    </span>
  )
}

export function Avatar({ name, tone = 'teal' }: { name: string; tone?: 'teal' | 'orange' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] font-heading text-sm font-extrabold ${
        tone === 'teal' ? 'bg-teal-light text-teal' : 'bg-peach text-orange-ink'
      }`}
    >
      {initials(name)}
    </span>
  )
}

export function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="fp-metric">
      <p className="text-[13px] font-semibold text-muted">{label}</p>
      <p className="fp-metric-value">{value}</p>
    </div>
  )
}

export function SampleNote({ children }: { children: ReactNode }) {
  return <p className="text-xs text-body/70">{children}</p>
}

/* Icons: small inline SVGs, sized by the caller. */

type IconProps = { className?: string }

export function CheckIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ArrowLeft({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ChevronRight({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function HomeIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 11l8-7 8 7v9H4z" strokeLinejoin="round" />
      <path d="M10 20v-5h4v5" />
    </svg>
  )
}

export function ClipboardIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4h6v3H9zM8.5 12l2 2 4-4M8.5 17h7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CalendarIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M9 3v4M15 3v4" strokeLinecap="round" />
    </svg>
  )
}

export function ChatIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 5h14v10H10l-4 4v-4H5z" strokeLinejoin="round" />
    </svg>
  )
}

export function PawIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <circle cx="6.5" cy="10" r="2" />
      <circle cx="10" cy="6" r="2" />
      <circle cx="14" cy="6" r="2" />
      <circle cx="17.5" cy="10" r="2" />
      <path d="M12 11c-3 0-5.5 3.5-5.5 6 0 1.6 1.2 2.5 2.7 2.5 1.2 0 1.8-.6 2.8-.6s1.6.6 2.8.6c1.5 0 2.7-.9 2.7-2.5 0-2.5-2.5-6-5.5-6z" />
    </svg>
  )
}

export function AlertIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5v.5" strokeLinecap="round" />
    </svg>
  )
}

export function PrintIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M7 9V4h10v5M7 17H5v-6h14v6h-2M7 14h10v6H7z" strokeLinejoin="round" />
    </svg>
  )
}

// Four-point sparkle for paid options. Pair with fp-sparkle to twinkle.
export function SparkleIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2c.4 3.9 2.1 6.6 6.4 7.6.5.1.5.7 0 .8-4.3 1-6 3.7-6.4 7.6-.4-3.9-2.1-6.6-6.4-7.6-.5-.1-.5-.7 0-.8C9.9 8.6 11.6 5.9 12 2Z" />
      <path d="M19 15c.2 1.6.9 2.6 2.6 3-1.7.4-2.4 1.4-2.6 3-.2-1.6-.9-2.6-2.6-3 1.7-.4 2.4-1.4 2.6-3Z" />
    </svg>
  )
}
