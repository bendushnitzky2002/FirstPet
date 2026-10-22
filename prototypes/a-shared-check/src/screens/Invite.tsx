import { useRef, useState } from 'react'
import type { Check } from '../types'
import { Button, CheckIcon, Guide, Page, PageHead } from '../components/ui'
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
    <Page
      stage="invite"
      aside={
        <>
          <Guide
            eyebrow="What happens next"
            title="Your partner answers four questions."
            steps={[
              'They open the link',
              'They answer about money and schedule',
              'We put you side by side',
              'You get your verdict together',
            ]}
            current={partnerDone ? 2 : 0}
          >
            They only see the money and schedule questions. It takes about 3 minutes.
          </Guide>
          <div className="fp-card space-y-2 p-4">
            <Button onClick={() => navigate('/')}>I'll wait for them</Button>
            <Button variant="secondary" onClick={() => navigate('/compare')}>
              Preview the result without them
            </Button>
          </div>
        </>
      }
    >
      <PageHead eyebrow="Invite" title="Your partner should answer too.">
        We saved your answers, {check.starter.name}. Send this so we can put you side by side.
      </PageHead>

      {partnerDone && (
        <div className="mb-5 flex items-center gap-3 rounded-[11px] border border-[#B9DCDA] bg-[#F2FAFA] p-4">
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

      <section className="fp-card p-6 text-center sm:p-10">
        <p className="fp-eyebrow">Invite code</p>
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
          className="fp-input mx-auto mt-6 block w-full max-w-xl truncate bg-canvas text-center text-sm"
        />
        <div className="mt-3">
          <Button full={false} onClick={copy}>
            {copied ? 'Copied' : 'Copy link'}
          </Button>
        </div>
      </section>

      <p className="mt-5 text-center text-sm">
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
