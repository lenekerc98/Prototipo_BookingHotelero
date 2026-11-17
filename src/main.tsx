import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { applyApprovedLocalResetOnce } from './infrastructure/resetLocalOperations'

const root = ReactDOM.createRoot(document.getElementById('root')!)

try {
  // User-approved cleanup, enabled only by this workspace's ignored .env.local.
  // Production builds and other checkouts never run it automatically.
  if (import.meta.env.DEV && ['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname)) {
    applyApprovedLocalResetOnce(import.meta.env.VITE_LOCAL_OPERATIONS_RESET_ID ?? '')
  }
  root.render(<React.StrictMode><App /></React.StrictMode>)
} catch {
  root.render(<main className="max-w-lg mx-auto p-8 space-y-4">
    <h1>No se pudo preparar el inicio limpio</h1>
    <p>El navegador no permitió guardar la copia o completar la limpieza local. Revisa el almacenamiento antes de continuar.</p>
    <button className="border rounded px-4 py-2" onClick={() => location.reload()}>Reintentar</button>
  </main>)
}
