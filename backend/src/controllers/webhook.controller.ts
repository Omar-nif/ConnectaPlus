import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { stripe } from "../lib/stripe";
import { ok, fail } from "../utils/http";

export class WebhookController {
  
  async handleStripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log(`Webhook recibido: ${event.type}`);
    } catch (err: any) {
      console.error(`Error de verificación webhook: ${err.message}`);
      return fail(res, `Error de verificación: ${err.message}`, 400);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'checkout.session.expired':
        await this.handleCheckoutSessionExpired(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    return ok(res, { received: true });
  }

  private async handleCheckoutSessionCompleted(session: any) {
    try {
      console.log('Checkout completado para sesión:', session.id);
      
      // 1. Buscar el pago por checkoutSessionId en metadata
      const payments = await prisma.payment.findMany({
        where: {
          metadata: {
            path: ['checkoutSessionId'],
            equals: session.id
          }
        },
        include: {
          user: true,
          group: true
        }
      });

      if (payments.length === 0) {
        console.error('No se encontró pago para la sesión:', session.id);
        return;
      }

      const payment = payments[0];

      // ✅ VERIFICACIÓN EXPLÍCITA para TypeScript
      if (!payment) {
        console.error('Payment es undefined después de findMany');
        return;
      }

      // Verificar que tenemos groupId
      if (!payment.groupId) {
        console.error('Pago no tiene groupId:', payment.id);
        return;
      }

      // 2. Actualizar el pago a "completed"
      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'completed',
          stripePaymentIntentId: session.payment_intent || session.id,
          updatedAt: new Date()
        }
      });

      console.log('Pago actualizado:', updatedPayment.id);

      // 3. Crear o actualizar la membresía con fecha de expiración
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 días desde hoy

      const membership = await prisma.groupMembership.upsert({
        where: {
          userId_groupId: {
            userId: payment.userId,
            groupId: payment.groupId
          }
        },
        create: {
          userId: payment.userId,
          groupId: payment.groupId,
          status: 'active',
          joinedAt: new Date(),
          expiresAt: expiresAt,
          paymentId: payment.id
        },
        update: {
          status: 'active',
          expiresAt: expiresAt,
          paymentId: payment.id
        }
      });

      console.log('Membresía creada/actualizada:', membership.id);

      // 4. Actualizar contador de miembros en el grupo
      const activeMembersCount = await prisma.groupMembership.count({
        where: { 
          groupId: payment.groupId,
          status: 'active',
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        }
      });

      await prisma.group.update({
        where: { id: payment.groupId },
        data: { 
          currentMembers: activeMembersCount,
          updatedAt: new Date()
        }
      });

      console.log(`Contador de miembros actualizado: ${activeMembersCount}`);

      console.log('Flujo completado: Pago exitoso, membresía creada y usuario agregado al grupo');

    } catch (error) {
      console.error('Error manejando checkout completado:', error);
    }
  }

  private async handleCheckoutSessionExpired(session: any) {
    try {
      console.log('Checkout expirado para sesión:', session.id);
      
      const payments = await prisma.payment.findMany({
        where: {
          metadata: {
            path: ['checkoutSessionId'],
            equals: session.id
          }
        }
      });

      if (payments.length === 0) {
        console.error('No se encontró pago para la sesión expirada:', session.id);
        return;
      }

      const payment = payments[0];

      //  VERIFICACIÓN EXPLÍCITA
      if (!payment) {
        console.error('Payment es undefined en checkout expirado');
        return;
      }

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'expired',
          updatedAt: new Date()
        }
      });

      console.log('Pago marcado como expirado:', payment.id);

    } catch (error) {
      console.error('Error manejando checkout expirado:', error);
    }
  }

  private async handlePaymentFailed(paymentIntent: any) {
    try {
      console.log('Pago fallido para payment intent:', paymentIntent.id);
      
      // Buscar el pago por stripePaymentIntentId
      const payment = await prisma.payment.update({
        where: {
          stripePaymentIntentId: paymentIntent.id
        },
        data: {
          status: 'failed',
          updatedAt: new Date()
        }
      });

      console.log('Pago marcado como fallido:', payment.id);

    } catch (error) {
      console.error('Error manejando pago fallido:', error);
      
      // Si no encuentra por stripePaymentIntentId, buscar por metadata (session id)
      try {
        const payments = await prisma.payment.findMany({
          where: {
            metadata: {
              path: ['checkoutSessionId'],
              equals: paymentIntent.id
            }
          }
        });

        if (payments.length > 0) {
          const payment = payments[0];
          
          //  VERIFICACIÓN EXPLÍCITA
          if (!payment) {
            console.error('Payment es undefined en fallback de pago fallido');
            return;
          }

          await prisma.payment.update({
            where: {
              id: payment.id
            },
            data: {
              status: 'failed',
              updatedAt: new Date()
            }
          });
          console.log('Pago marcado como fallido (por metadata):', payment.id);
        }
      } catch (secondError) {
        console.error('Error en segundo intento de marcar como fallido:', secondError);
      }
    }
  }
}

export const webhookController = new WebhookController();