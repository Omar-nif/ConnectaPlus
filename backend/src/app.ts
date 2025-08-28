import express, { Request, Response } from 'express'
import cors from 'cors'
import pino from 'pino-http'

// Rutas de módulos
import authRoutes from './modules/auth/auth.routes'
import paymentRouter from "./routes/payment";

// Primero declaramos app
const app = express()

// ====== CORS ======
app.use(
  cors({
    origin: ['http://localhost:5173'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ====== Body parsers ======
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ====== Logger ======
app.use(pino())

// ====== Health check ======
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Connecta+ Backend funcionando' })
})

// ====== Rutas API v1 ======
app.use('/api/auth', authRoutes)
app.use("/api/payment", paymentRouter) 

// Export para usar en server.ts
export default app
