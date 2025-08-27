import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import {
  listMyGroups,
  createGroup,
  getGroup,
  updateGroup,
  deleteGroup,
} from "./groups.controller";

const router = Router();

// Todas requieren auth: son datos por usuario
router.use(requireAuth);

router.get("/", listMyGroups);
router.post("/", createGroup);
router.get("/:id", getGroup);
router.patch("/:id", updateGroup);
router.delete("/:id", deleteGroup);

export default router;
