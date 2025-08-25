// app.ts
// ===============================
// Configuración principal de la app Express
// - Middlewares globales (CORS, body parsers, logger)
// - Rutas base (salud y módulos)
// ===============================

import express, { Request, Response } from 'express'
import cors from 'cors'
import pino from 'pino-http'

// Rutas de módulos
import authRoutes from './modules/auth/auth.routes'

const app = express()

// ====== CORS ======
// Permite que el frontend (ej: Vite en :5173) hable con el backend.
// ⚠️ En producción, cambia origin a tu dominio real.
app.use(
  cors({
    origin: ['http://localhost:5173'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ====== Body parsers ======
// Soporte JSON y x-www-form-urlencoded
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ====== Logger ======
// pino-http: log compacto, útil para debug y monitoreo
app.use(pino())

// ====== Health check ======
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: '✅ Connecta+ Backend funcionando 🚀' })
})

// ====== Rutas API v1 ======
app.use('/api/auth', authRoutes)

// Export para usar en server.ts
export default app

// ===============================
// Notas / Mejores prácticas
// ===============================
// - Puedes añadir rate limiter (ej: express-rate-limit) en /api/*
// - Usa Helmet para seguridad (headers).
// - Monta tus módulos versionados: /api/v1/auth, /api/v1/users, etc.
// - Considera un middleware global de manejo de errores.
