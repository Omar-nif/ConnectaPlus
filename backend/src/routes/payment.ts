// backend/src/routes/payment.ts
import express, { Request, Response } from "express";
import stripe from "../lib/stripe";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/create-payment-intent", async (req: Request, res: Response) => {
  try {
    const { userId, groupId, amount } = req.body; // datos que envía el front

    // Crear el paymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "mxn",
    });

    // Guardar en base de datos
    const payment = await prisma.payment.create({
      data: {
        userId,
        groupId,
        amount,
        currency: "mxn",
        stripePaymentIntentId: paymentIntent.id,
        status: "pending",
      },
    });

    // Devolver al front el client_secret
    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
