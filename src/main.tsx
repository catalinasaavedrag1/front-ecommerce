import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { AppProvider } from './context/AppContext'
import { CartProvider } from './context/CartContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <AppProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AppProvider>
    </HashRouter>
  </React.StrictMode>,
)
