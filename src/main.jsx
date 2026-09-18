import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import NotFound from './NotFound.jsx'

const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isHome ? <App /> : <NotFound />}
  </StrictMode>,
)
