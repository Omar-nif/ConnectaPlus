import express, { Request, Response } from "express";
import cors from "cors";
import pino from "pino-http";

//========== Rutas ==================
import servicesRoutes from './modules/services/services.routes'
import groupRoutes from "./modules/groups/groups.routes"; 
import authRoutes from './modules/auth/auth.routes'
import webhookRouter from "./routes/webhook";
import paymentRouter from "./routes/payment";
import stripeRoutes from './routes/stripe.routes';

const app = express()

// ====== CORS, Body parsers y Logger ======
app.use(cors({
  origin: ["http://localhost:5173"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
//app.use("/webhook", webhookRouter); // por si falla descomentar
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(pino())

// ====== RUTAS ESPECIALES ======
app.use("/webhook", webhookRouter); //stripe consultara directamente (sin /api/)

// ====== Rutas API ======
app.use('/api/services', servicesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes); 
app.use("/api/payment", paymentRouter) 
app.use('/api/stripe', stripeRoutes);

// ====== Health check ======
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Connecta+ Backend funcionando' })
})

export default app
