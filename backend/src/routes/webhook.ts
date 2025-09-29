
import express from "express";
import Stripe from "stripe";  
import stripe from "../lib/stripe"; 
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Tu clave de endpoint webhook de Stripe
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    // Construye el evento con la librería Stripe
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.log("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar evento de pago exitoso
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    await prisma.payment.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: "succeeded" },
    });
  }

  // Manejar pago fallido
  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    await prisma.payment.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: "failed" },
    });
  }

  res.json({ received: true });
});

export default router;
