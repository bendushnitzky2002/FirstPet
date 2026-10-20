import { useRef, useState } from 'react'
import type { Check } from '../types'
import { Button, CheckIcon, Page, TopBar } from '../components/ui'
import { appUrl, navigate } from '../lib/router'

export function Invite({ check }: { check: Check }) {
  const link = `${appUrl()}?code=${check.code}`
  const [copied, setCopied] = useState(false)
  const field = useRef<HTMLInputElement>(null)
  const partnerDone = !!check.partner?.done

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      // Clipboard blocked: select the text so a manual copy is one keystroke away.
      field.current?.select()
      document.execCommand('copy')
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2500)
  }

  return (
    <Page>
      <TopBar />
      <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
        Your partner should answer too.
      </h1>
      <p className="mt-3 text-lg">
        We saved your answers, {check.starter.name}. Send this so we can put you side by side.
      </p>

      {partnerDone && (
        <div className="mt-6 flex items-center gap-3 rounded-card border border-teal bg-teal-light p-4">
          <span className="fp-icon-teal bg-white">
            <CheckIcon />
          </span>
          <p className="flex-1 font-semibold text-navy">{check.partner!.name} answered.</p>
          <button
            type="button"
            onClick={() => navigate('/compare')}
            className="font-heading font-bold text-teal"
          >
            See it side by side
          </button>
        </div>
      )}

      <section className="fp-card mt-8 p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-body">Invite code</p>
        <p className="mt-2 font-heading text-5xl font-extrabold tracking-[0.2em] text-navy sm:text-6xl">
          {check.code}
        </p>

        <label htmlFor="invite-link" className="sr-only">
          Invite link
        </label>
        <input
          id="invite-link"
          ref={field}
          readOnly
          value={link}
          onFocus={(e) => e.target.select()}
          className="mt-6 w-full truncate rounded-full border border-line bg-canvas px-4 py-3 text-center text-sm text-body"
        />
        <div className="mt-3">
          <Button variant="secondary" onClick={copy}>
            {copied ? 'Copied' : 'Copy link'}
          </Button>
        </div>
        <p className="mt-4 text-sm">
          They only see the money and schedule questions. It takes about 3 minutes.
        </p>
      </section>

      <div className="mt-8 space-y-3">
        <Button onClick={() => navigate('/')}>I'll wait for them</Button>
        <Button variant="secondary" onClick={() => navigate('/compare')}>
          Preview the result without them
        </Button>
      </div>

      <p className="mt-8 text-center text-sm">
        Trying this on one computer?{' '}
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-teal underline-offset-4 hover:underline"
        >
          Open the link in a new tab
        </a>{' '}
        to answer as your partner.
      </p>
    </Page>
  )
}
