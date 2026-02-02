import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BlinkProvider, BlinkAuthProvider } from '@blinkdotnew/react'
import { Toaster } from 'sonner'
import App from './App'
import './index.css'

function getProjectId(): string {
  const envId = import.meta.env.VITE_BLINK_PROJECT_ID
  if (envId) return envId
  const hostname = window.location.hostname
  const match = hostname.match(/^([^.]+)\.sites\.blink\.new$/)
  if (match) return match[1]
  return 'roadeye-civic-platform-2ar2gfeo'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BlinkProvider 
      projectId={getProjectId()}
      publishableKey={import.meta.env.VITE_BLINK_PUBLISHABLE_KEY}
    >
      <BlinkAuthProvider>
        <App />
        <Toaster position="top-center" richColors />
      </BlinkAuthProvider>
    </BlinkProvider>
  </StrictMode>
)
