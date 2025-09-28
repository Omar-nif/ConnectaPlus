// backend/src/modules/stripe/stripe.service.ts
import Stripe from 'stripe';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    });
  }

  // Crear checkout session CON Connect
  async createConnectCheckoutSession(
    amount: number, 
    metadata: any, 
    successUrl: string, 
    cancelUrl: string,
    destinationAccountId?: string  // ✅ ID de la cuenta del dueño
  ) {
    try {
      const sessionConfig: any = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'mxn',
              product_data: {
                name: metadata.productName,
                description: metadata.description,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: metadata,
        customer_email: metadata.customerEmail,
      };

      // ✅ MAGIA DE CONNECT: Si hay cuenta de dueño, usar Connect
      if (destinationAccountId) {
        sessionConfig.payment_intent_data = {
          application_fee_amount: Math.round(amount * 0.10), // 10% comisión
          transfer_data: {
            destination: destinationAccountId, // ⬅️ Dinero al dueño
          },
        };
        console.log("💰 Usando Connect para cuenta:", destinationAccountId);
      } else {
        console.log("⚠️ Sin cuenta de dueño - pago normal a plataforma");
      }

      const session = await this.stripe.checkout.sessions.create(sessionConfig);
      return session;

    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();