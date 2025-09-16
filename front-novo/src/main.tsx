import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import SorobanProvider from './components/SorobanProvider.tsx'
import { LanguageProvider } from './i18n/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* SorobanProvider desabilitado para acesso sem carteira */}
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
