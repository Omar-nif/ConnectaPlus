import { Router } from "express";
import { stripeController } from "../controllers/stripe.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

//Checkout para unirse a grupos
router.post("/checkout/group", requireAuth, stripeController.createGroupCheckout);

//Onbording para dueños de grupos
router.post("/connect/onboarding", requireAuth, stripeController.createOnboarding);
router.get("/connect/satus", requireAuth, stripeController.getOnboardingStatus);

// Verificacion de pagos
router.get("/payment/verify/:sessionId", stripeController.verifyPayment);

export default router;