import type { ReactNode } from 'react'
import logo from '@firstpet/theme/logo.png'

export function Page({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-4 pb-16 pt-6 sm:px-5 sm:pt-10">
      {children}
    </main>
  )
}

export function LogoMark({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const box = size === 'lg' ? 'h-16 w-16 p-1.5' : 'h-10 w-10 p-1'
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
      {right}
    </div>
  )
}

type ButtonProps = {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit'
}

export function Button({
  children,
  onClick,
  disabled,
  variant = 'primary',
  type = 'button',
}: ButtonProps) {
  const styles = {
    primary: 'bg-teal text-white hover:bg-[#1a8790] disabled:bg-line disabled:text-body/60',
    secondary: 'border-2 border-teal bg-white text-teal hover:bg-teal-light',
  }[variant]
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-[52px] w-full rounded-full px-6 py-3 font-heading text-lg font-bold transition-colors disabled:cursor-not-allowed ${styles}`}
    >
      {children}
    </button>
  )
}

export function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`min-h-[48px] flex-1 rounded-full border-2 px-3 py-2 text-base font-semibold transition-colors ${
        selected
          ? 'border-teal bg-teal text-white'
          : 'border-line bg-white text-body hover:border-teal/50'
      }`}
    >
      {children}
    </button>
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

export function ShieldIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3Z" strokeLinejoin="round" />
      <path d="M12 9v4M12 16h.01" strokeLinecap="round" />
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
