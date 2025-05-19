import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/MoviePage.css'
import App from './App.js'

// Імпортуємо наш файл i18n для ініціалізації перекладів
import './i18n/i18n'

createRoot(document.getElementById('root')as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
