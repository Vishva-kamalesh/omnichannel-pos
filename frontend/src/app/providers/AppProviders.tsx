import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      {children}
      <Toaster
        position="top-center"
        gap={10}
        toastOptions={{
          // Matches the login palette: warm paper, charcoal ink, Plex Sans.
          style: {
            background: '#fbf8f2',
            border: '1px solid #cfc6b6',
            color: '#211e1a',
            borderRadius: '8px',
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            fontSize: '0.8125rem',
            boxShadow: '0 6px 24px rgba(33, 30, 26, 0.12)',
          },
        }}
      />
    </BrowserRouter>
  )
}
