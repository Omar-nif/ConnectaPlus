import express, { Router } from "express"; // ← Agregar express aquí
import { stripeController } from "../controllers/stripe.controller";
import { requireAuth } from "../middlewares/auth";
import { webhookController } from "../controllers/webhook.controller";

const router = Router();

//Checkout para unirse a grupos
router.post("/checkout/group", requireAuth, stripeController.createGroupCheckout);

//Onboarding para dueños de grupos
router.post("/connect/onboarding", requireAuth, stripeController.createOnboarding);
router.get("/connect/status", requireAuth, stripeController.getOnboardingStatus); // ← Corregí "satus" a "status"

// Verificación de pagos
router.get("/payment/verify/:sessionId", stripeController.verifyPayment);

export default router;