import express, { Request, Response } from "express";
import cors from "cors";
import pino from "pino-http";
import groupRoutes from "./modules/groups/groups.routes"; // 👈
import webhookRouter from "./routes/webhook";
import authRoutes from './modules/auth/auth.routes'
import paymentRouter from "./routes/payment";

const app = express()

// Rutas de módulos
import authRoutes from './modules/auth/auth.routes'
import servicesRoutes from './modules/services/services.routes'
app.use(cors({
  origin: ["http://localhost:5173"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use("/webhook", webhookRouter);

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
// pino-http: log compacto, útil para debug y monitoreo
app.use(pino())

// ====== Health check ======
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Connecta+ Backend funcionando' })
})

// ====== Rutas API v1 ======
app.use('/api/services', servicesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes); 

// Export para usar en server.ts
export default app


app.use("/api/payment", paymentRouter) 

// Export para usar en server.ts
export default app
