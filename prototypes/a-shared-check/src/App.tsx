import { useCallback, useEffect, useState } from 'react'
import type { Check } from './types'
import { demoCheck } from './data/demo'
import { clearCheck, emptyCheck, loadCheck, loadCurrent, newCode, saveCheck } from './lib/storage'
import { navigate, useHashRoute } from './lib/router'
import { Landing } from './screens/Landing'
import { Questions } from './screens/Questions'
import { Invite } from './screens/Invite'
import { Join } from './screens/Join'
import { Compare } from './screens/Compare'
import { Verdict } from './screens/Verdict'
import { Summary } from './screens/Summary'
import { Results } from './screens/Results'

export default function App() {
  const { path, params } = useHashRoute()
  const [check, setCheck] = useState<Check | null>(loadCurrent)

  // Another tab (the partner answering on the same computer) can update the
  // check. Pick that up so the starter's screen changes without a refresh.
  useEffect(() => {
    const onStorage = () => setCheck(loadCurrent())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const save = useCallback((next: Check) => {
    saveCheck(next)
    setCheck(next)
  }, [])

  const reset = useCallback(() => {
    clearCheck(check?.code)
    setCheck(null)
    navigate('/')
  }, [check?.code])

  const start = () => {
    if (check) clearCheck(check.code)
    save(emptyCheck())
    navigate('/check')
  }

  const seed = useCallback(() => {
    save(demoCheck(newCode()))
    navigate('/compare')
  }, [save])

  if (path === '/join') {
    const code = params.get('code') ?? ''
    return <Join key={code} code={code} check={loadCheck(code)} save={save} />
  }

  if (path === '/results') return <Results />

  if (!check || path === '/') {
    return <Landing check={check} onStart={start} onSeed={seed} onReset={reset} />
  }

  // Screens past the questions need the starter to have finished.
  if (path === '/check' || !check.starter.done) return <Questions check={check} save={save} />

  switch (path) {
    case '/invite':
      return check.deciding === 'solo' ? (
        <Compare check={check} fromPartner={false} />
      ) : (
        <Invite check={check} />
      )
    case '/compare':
      return <Compare check={check} fromPartner={params.get('from') === 'partner'} />
    case '/verdict':
      return <Verdict check={check} save={save} onReset={reset} />
    case '/summary':
      return <Summary check={check} save={save} />
    default:
      return <Landing check={check} onStart={start} onSeed={seed} onReset={reset} />
  }
}
