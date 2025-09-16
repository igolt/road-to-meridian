import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import SorobanProvider from './components/SorobanProvider.tsx' // Comentado para acessar sem carteira
import { LanguageProvider } from './i18n/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*
      Bloco original com carteira (Freighter/Soroban). Reative quando quiser exigir login de carteira:
      <SorobanProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </SorobanProvider>
    */}
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
