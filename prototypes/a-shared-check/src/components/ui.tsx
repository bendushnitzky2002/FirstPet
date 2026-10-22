import type { ReactNode } from 'react'
import logo from '@firstpet/theme/logo.png'

export function Page({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <main
      className={`mx-auto flex min-h-screen w-full flex-col px-5 pb-16 pt-6 sm:pt-10 ${wide ? 'max-w-3xl' : 'max-w-xl'}`}
    >
      {children}
    </main>
  )
}

export function LogoMark({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const box = size === 'lg' ? 'h-20 w-20 p-2' : 'h-10 w-10 p-1'
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl border border-line bg-white ${box}`}
    >
      <img src={logo} alt="FirstPet" className="h-full w-full rounded-xl" />
    </span>
  )
}

export function TopBar({ onBack, right }: { onBack?: () => void; right?: ReactNode }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3 print:hidden">
      <div className="flex items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="-ml-2 inline-flex h-10 items-center gap-1 rounded-full px-2 text-sm font-semibold text-teal hover:bg-teal-light"
          >
            <ArrowLeft /> Back
          </button>
        ) : (
          <LogoMark />
        )}
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
    primary: 'bg-teal text-white hover:bg-[#1a8790] disabled:bg-line disabled:text-body/60',
    secondary: 'border-2 border-teal bg-white text-teal hover:bg-teal-light',
    quiet: 'text-teal underline-offset-4 hover:underline',
  }[variant]
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-[52px] rounded-full px-6 py-3 font-heading text-lg font-bold transition-colors disabled:cursor-not-allowed ${full ? 'w-full' : ''} ${styles}`}
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
      className={`flex min-h-[60px] w-full items-center gap-3 rounded-card border-2 bg-white px-5 py-4 text-left text-lg font-semibold transition-colors ${
        selected
          ? 'border-teal bg-teal-light text-navy'
          : 'border-line text-body hover:border-teal/50'
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 ${multi ? 'rounded-md' : 'rounded-full'} ${
          selected ? 'border-teal bg-teal text-white' : 'border-line bg-white'
        }`}
      >
        {selected && <CheckIcon className="h-4 w-4" />}
      </span>
      {children}
    </button>
  )
}

export function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <p className="mb-2 text-sm font-semibold text-body">
        Question {current} of {total}
      </p>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <div
          className="h-full rounded-full bg-teal transition-all"
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
