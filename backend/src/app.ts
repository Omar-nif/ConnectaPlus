import express, { Request, Response } from "express";
import cors from "cors";
import pino from "pino-http";
import authRoutes from "./modules/auth/auth.routes";
import groupRoutes from "./modules/groups/groups.routes"; // 👈

const app = express();

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

export default app;
