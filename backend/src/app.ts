import express, { Request, Response } from "express";
import cors from "cors";
import pino from "pino-http";

//========== Rutas ==================
import servicesRoutes from './modules/services/services.routes'
import groupRoutes from "./modules/groups/groups.routes"; 
import authRoutes from './modules/auth/auth.routes'
import paymentRouter from "./routes/payment";
import stripeRoutes from './routes/stripe.routes';
import { webhookController } from "./controllers/webhook.controller";

const app = express()

// ====== MIDDLEWARES CRÍTICOS PARA WEBHOOKS ======
//  WEBHOOK PRIMERO - con raw body ANTES de express.json()
app.post('/webhook/stripe', 
  express.raw({type: 'application/json'}), // ← RAW body para webhook
  webhookController.handleStripeWebhook.bind(webhookController)
);

// ====== CORS ======
app.use(cors({
  origin: ["http://localhost:5173"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ====== MIDDLEWARES BÁSICOS ======
app.use(express.urlencoded({ extended: true }))
app.use(pino())

// ====== RUTAS NORMALES (con express.json) ======
app.use(express.json()) // ← JSON para rutas normales

app.use('/api/services', servicesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes); 
app.use("/api/payment", paymentRouter) 
app.use('/api/stripe', stripeRoutes); // ← Rutas normales de Stripe

// ====== Health check ======
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Connecta+ Backend funcionando' })
})

export default app