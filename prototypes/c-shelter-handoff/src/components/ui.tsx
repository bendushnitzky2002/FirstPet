import type { ReactNode } from 'react'
import logo from '@firstpet/theme/logo.png'
import type { CheckInStatus } from '../data/checkin'
import { statusLabel } from '../data/checkin'
import type { VerdictKind } from '../data/verdict'
import { verdictLabel } from '../data/verdict'
import { initials } from '../lib/format'

export function Page({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <main
      className={`mx-auto flex min-h-screen w-full flex-col px-4 pb-16 pt-6 sm:px-6 sm:pt-10 ${wide ? 'max-w-5xl' : 'max-w-xl'}`}
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

export function BackLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-ml-2 inline-flex h-10 items-center gap-1 rounded-full px-2 text-sm font-semibold text-teal hover:bg-teal-light print:hidden"
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
}

export function Button({
  children,
  onClick,
  disabled,
  variant = 'primary',
  size = 'lg',
  full = true,
}: ButtonProps) {
  const styles = {
    primary: 'bg-teal text-white hover:bg-[#1a8790] disabled:bg-line disabled:text-body/60',
    secondary: 'border-2 border-teal bg-white text-teal hover:bg-teal-light',
    quiet: 'text-teal underline-offset-4 hover:underline',
  }[variant]
  const sizing = size === 'lg' ? 'min-h-[52px] px-6 py-3 text-lg' : 'min-h-[40px] px-4 py-2 text-sm'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full font-heading font-bold transition-colors disabled:cursor-not-allowed print:hidden ${sizing} ${full ? 'w-full' : ''} ${styles}`}
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
      <p className="mb-2 text-sm font-semibold">
        Question {current} of {total}
      </p>
      <div className="h-2 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-teal transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  )
}

const verdictStyle: Record<VerdictKind, string> = {
  ready: 'bg-teal-light text-[#13707a]',
  'ready-once': 'bg-peach text-[#9a5b06]',
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
  message: 'bg-peach text-[#9a5b06]',
  well: 'bg-teal-light text-[#13707a]',
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
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-heading text-sm font-extrabold ${
        tone === 'teal' ? 'bg-teal-light text-teal' : 'bg-peach text-[#9a5b06]'
      }`}
    >
      {initials(name)}
    </span>
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
