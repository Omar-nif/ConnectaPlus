import express, { Request, Response } from "express";
import cors from "cors";
import pino from "pino-http";
import groupRoutes from "./modules/groups/groups.routes"; // 👈

const app = express();

// Rutas de módulos
import authRoutes from './modules/auth/auth.routes'
import servicesRoutes from './services/services.routes'
app.use(cors({
  origin: ["http://localhost:5173"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(pino());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Connecta+ Backend funcionando 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes); // 👈 monta grupos

// ====== Logger ======
// pino-http: log compacto, útil para debug y monitoreo
app.use(pino())

// ====== Health check ======
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Connecta+ Backend funcionando' })
})

// ====== Rutas API v1 ======
app.use('/api/auth', authRoutes)
app.use('/api/services', servicesRoutes)

// Export para usar en server.ts
export default app


