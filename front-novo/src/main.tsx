import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SorobanProvider from './components/SorobanProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SorobanProvider>
      <App />
    </SorobanProvider>
  </StrictMode>,
)
