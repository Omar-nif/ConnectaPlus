import { Router, Request, Response } from "express";
import stripe from "../stripe";

const router = Router();

interface PaymentRequestBody {
  amount: number;
}

router.post("/create-payment-intent", async (req: Request<{}, {}, PaymentRequestBody>, res: Response) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // en centavos
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error: any) { 
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;
