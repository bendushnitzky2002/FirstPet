import { useCallback, useState } from 'react'
import type { State } from './types'
import { INTRODUCTIONS } from './data/introductions'
import { demoState } from './data/demo'
import { emptyState, loadState, saveState } from './lib/storage'
import { navigate, useHashRoute } from './lib/router'
import { Shell } from './components/ui'
import { Profile } from './screens/Profile'
import { Introductions } from './screens/Introductions'
import { Membership } from './screens/Membership'
import { Log } from './screens/Log'

export default function App() {
  const path = useHashRoute()
  const [state, setState] = useState<State>(loadState)

  const save = useCallback((next: State) => {
    saveState(next)
    setState(next)
  }, [])

  const seed = useCallback(() => {
    save(demoState())
    navigate('/intros')
  }, [save])

  const reset = useCallback(() => {
    save(emptyState())
    navigate('/')
  }, [save])

  const pending = INTRODUCTIONS.filter((i) => !state.decisions[i.id]).length

  let screen
  switch (path) {
    case '/intros':
      screen = <Introductions state={state} save={save} />
      break
    case '/membership':
      screen = <Membership state={state} save={save} />
      break
    case '/log':
      screen = <Log state={state} onReset={reset} />
      break
    default:
      screen = <Profile pending={pending} onSeed={seed} />
  }

  return (
    <Shell path={path === '/log' ? '' : path} pending={pending}>
      {screen}
    </Shell>
  )
}
