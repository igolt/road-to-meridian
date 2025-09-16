import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import SorobanProvider from './components/SorobanProvider.tsx'
import { LanguageProvider } from './i18n/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*
      Observação: Bloco original com carteira Freighter/Soroban.
      Deixe-o comentado para poder rodar sem a extensão e reativar depois.

      <SorobanProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </SorobanProvider>
    */}

    {/* Execução atual sem provider de carteira */}
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
