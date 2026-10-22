import type { ReactNode } from 'react'
import { navigate } from '../lib/router'

const TABS = [
  { path: '/', label: 'Profile' },
  { path: '/intros', label: 'Introductions' },
  { path: '/membership', label: 'Membership' },
]

// The pro side is a small dashboard: a header with three tabs.
export function Shell({
  path,
  pending,
  children,
}: {
  path: string
  pending: number
  children: ReactNode
}) {
  return (
    <div className="min-h-screen">
      <header className="fp-topbar">
        <div className="fp-topbar-inner max-w-3xl">
          <button type="button" onClick={() => navigate('/')} className="fp-brand">
            <span className="fp-brand-mark" aria-hidden="true" />
            <span>
              <span className="fp-brand-name">
                First<span className="text-orange">Pet</span>
              </span>
              <span className="fp-brand-sub">For professionals</span>
            </span>
          </button>
        </div>
        <nav className="mx-auto flex max-w-3xl gap-1 px-2 sm:px-3" aria-label="Main">
          {TABS.map((t) => {
            const active = path === t.path
            return (
              <button
                key={t.path}
                type="button"
                onClick={() => navigate(t.path)}
                aria-current={active ? 'page' : undefined}
                className="fp-nav-tab"
              >
                {t.label}
                {t.path === '/intros' && pending > 0 && (
                  <span className="rounded-full bg-orange px-2 text-xs text-navy">{pending}</span>
                )}
              </button>
            )
          })}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-5 sm:pt-8">{children}</main>
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
      className={`min-h-[48px] px-6 py-2.5 text-base ${full ? 'w-full' : ''} ${styles}`}
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
