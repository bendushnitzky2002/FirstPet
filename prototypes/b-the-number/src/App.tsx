import { useCallback, useState } from 'react'
import type { Check, Pet } from './types'
import { demoCheck } from './data/demo'
import { clearCheck, loadCheck, newCheck, saveCheck } from './lib/storage'
import { navigate, useHashRoute } from './lib/router'
import { Landing } from './screens/Landing'
import { TheNumber } from './screens/TheNumber'
import { Tune } from './screens/Tune'
import { Verdict } from './screens/Verdict'
import { Summary } from './screens/Summary'

export default function App() {
  const path = useHashRoute()
  const [check, setCheck] = useState<Check | null>(loadCheck)

  const save = useCallback((next: Check) => {
    saveCheck(next)
    setCheck(next)
  }, [])

  const reset = useCallback(() => {
    clearCheck()
    setCheck(null)
    navigate('/')
  }, [])

  const start = (zip: string, pet: Pet) => {
    save(newCheck(zip, pet))
    navigate('/number')
  }

  const seed = useCallback(() => {
    save(demoCheck())
    navigate('/number')
  }, [save])

  if (!check || path === '/') {
    return <Landing check={check} onStart={start} onSeed={seed} onReset={reset} />
  }

  switch (path) {
    case '/number':
      return <TheNumber check={check} save={save} />
    case '/tune':
      return <Tune check={check} save={save} />
    case '/verdict':
      return <Verdict check={check} save={save} onReset={reset} />
    case '/summary':
      return <Summary check={check} />
    default:
      return <Landing check={check} onStart={start} onSeed={seed} onReset={reset} />
  }
}
