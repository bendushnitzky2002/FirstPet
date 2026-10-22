import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { consumeInviteCode } from './lib/router'
import './index.css'

consumeInviteCode()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
