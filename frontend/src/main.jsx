// Main.jsx
// ===============================
// Punto de entrada de la aplicación React
// ===============================

import React from 'react'
import { createRoot } from 'react-dom/client'

// ====== Estilos y librerías externas ======
import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Bootstrap JS

// ====== Estilos locales de la app ======
import './styles/global.css'
import './styles/auth.css'
import './styles/home.css'

// ====== Enrutador ======
import { BrowserRouter } from 'react-router-dom'

// ====== Componente principal ======
import App from './App.jsx'

// ====== Renderizado ======
const container = document.getElementById('root')
createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
