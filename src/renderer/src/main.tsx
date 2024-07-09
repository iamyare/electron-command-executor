import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

// Importar BrowserRouter de react-router-dom
import App from './App'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from '@renderer/components/theme-provider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
)
