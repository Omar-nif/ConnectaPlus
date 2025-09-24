import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import {
  listMyGroups,
  createGroup,
  getGroup,
  updateGroup,
  deleteGroup,
  getPublicGroup,
} from "./groups.controller";

const router = Router();

// Ruta pública
router.get("/public/:id", getPublicGroup);

// Rutas privadas (requieren token)
router.use(requireAuth);

router.get("/", listMyGroups);
router.post("/", createGroup);
router.get("/:id", getGroup);
router.patch("/:id", updateGroup);
router.delete("/:id", deleteGroup);

export default router;
