import type { ReactNode } from 'react'
import { PROFILE } from '../data/profile'
import { navigate } from '../lib/router'

const TABS = [
  { path: '/', label: 'Profile' },
  { path: '/intros', label: 'Introductions' },
  { path: '/membership', label: 'Membership' },
]

// The pro side is a small dashboard: a navy bar with the tabs inside it, as in
// Sala's Customer Persona app, and the 1180px page frame.
export function Shell({
  path,
  pending,
  children,
}: {
  path: string
  pending: number
  children: ReactNode
}) {
  const nav = (
    <nav className="fp-nav-inline" aria-label="Main">
      {TABS.map((t) => (
        <button
          key={t.path}
          type="button"
          onClick={() => navigate(t.path)}
          aria-current={path === t.path ? 'page' : undefined}
          className="fp-nav-tab"
        >
          {t.label}
          {t.path === '/intros' && pending > 0 && (
            <span className="rounded-full bg-orange px-2 text-xs text-navy">{pending}</span>
          )}
        </button>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen">
      <header className="fp-topbar">
        <div className="fp-topbar-inner">
          <button type="button" onClick={() => navigate('/')} className="fp-brand">
            <span className="fp-brand-mark" aria-hidden="true" />
            <span>
              <span className="fp-brand-name">
                First<span className="text-orange">Pet</span>
              </span>
              <span className="fp-brand-sub">For professionals</span>
            </span>
          </button>
          <div className="ml-auto hidden h-full md:block">{nav}</div>
          <span
            className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#D4E5E2] text-[11px] font-extrabold text-navy md:ml-4"
            title={PROFILE.name}
          >
            {PROFILE.name
              .split(' ')
              .slice(0, 2)
              .map((w) => w[0])
              .join('')}
          </span>
        </div>
        <div className="overflow-x-auto px-2 md:hidden">{nav}</div>
      </header>
      <main className="fp-page">{children}</main>
    </div>
  )
}

type ButtonProps = {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
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
  }[variant]
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-[44px] px-5 py-2 text-[15px] ${full ? 'w-full' : ''} ${styles}`}
    >
      {children}
    </button>
  )
}

export function VettedBadge({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-teal-light font-bold text-teal ${
        size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'
      }`}
    >
      <ShieldCheckIcon className={size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
      FirstPet vetted
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

export function ShieldCheckIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3Z" strokeLinejoin="round" />
      <path d="m8.5 12 2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function LockIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  )
}

export function ScaleIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path d="M12 4v16M7 20h10M5 8h14" strokeLinecap="round" />
      <path d="M5 8 2.5 14h5L5 8ZM19 8l-2.5 6h5L19 8Z" strokeLinejoin="round" />
    </svg>
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
