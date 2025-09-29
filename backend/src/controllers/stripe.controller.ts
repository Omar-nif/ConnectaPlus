import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { stripeService } from "../services/stripe.services";
import { ok, fail } from "../utils/http";
import { AuthedRequest } from "../middlewares/auth";

export class StripeController {
  
    /**
     * Crear checkout para unirse a un grupo
     */
    async createGroupCheckout(req: AuthedRequest, res: Response) {
      try {
        const { groupId } = req.body;
        // Validar que groupId existe y es válido
      if (!groupId) {
        return fail(res, "groupId es requerido", 400);
      }

      const groupIdNumber = parseInt(groupId);
      if (isNaN(groupIdNumber)) {
        return fail(res, "groupId debe ser un número válido", 400);
      }
        const userId = req.user!.id;
  
        console.log("Creando checkout para grupo:", groupIdNumber);
  
        // 1. Buscar información del grupo
        const group = await prisma.group.findUnique({
          where: { id: groupIdNumber },
          include: { 
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                stripeAccountId: true
              }
            },
            service: true 
          }
        });
  
        if (!group || group.status !== 'active') {
          return fail(res, "Grupo no disponible", 404);
        }
  
        const amount = group.pricePerMember * 100;
        const productName = `${group.service?.name || group.platformName} - Grupo`;
        const description = `Acceso mensual al grupo de ${group.owner.name}`;
  
        const metadata = {
          groupId: groupIdNumber.toString(),
          userId: userId.toString(),
          ownerId: group.ownerId.toString(),
          type: 'group_join',
          customerEmail: req.user!.email
        };
  
        // 2. Crear sesión de checkout
        const session = await stripeService.createGroupCheckoutSession(
          amount,
          productName,
          description,
          metadata,
          `http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}&group_id=${groupIdNumber}`,
          `http://localhost:5173/groups/${groupIdNumber}`,
          group.owner.stripeAccountId || undefined // Connect si está disponible
        );
  // *******
  
  //***** */
        // 3. Guardar en base de datos
        await prisma.payment.create({
          data: {
            user: {
              connect: { id: parseInt(userId) }
            },
            group: {
              connect: { id: groupIdNumber }
            },  
            amount: amount,
            currency: 'mxn',
            stripePaymentIntentId: session.id, //payment_intent as string,
            status: 'pending',
            metadata: {
              usesConnect: !!group.owner.stripeAccountId,
              destinationAccount: group.owner.stripeAccountId,
              checkoutSessionId: session.id
            }
          },
        });
  
        console.log("Checkout creado - Connect:", !!group.owner.stripeAccountId);
        return ok(res, { 
          sessionId: session.id, 
          amount: amount / 100,
          usesConnect: !!group.owner.stripeAccountId
        });
  
      } catch (error: any) {
        console.error('Error en checkout:', error);
        return fail(res, error.message, 500);
      }
    }
  
    /**
     * Crear onboarding para dueño de grupo
     */
    async createOnboarding(req: AuthedRequest, res: Response) {
      try {
        const userId = req.user!.id;
        
        console.log("Iniciando onboarding para usuario:", userId);
  
        // 1. Verificar si ya tiene cuenta
        const user = await prisma.user.findUnique({
          where: { id: parseInt(userId) },
          select: { id: true, email: true, name: true, stripeAccountId: true }
        });
  
        if (!user) {
          return fail(res, "Usuario no encontrado", 404);
        }
  
        if (user.stripeAccountId) {
          return fail(res, "Ya tienes una cuenta de pago configurada", 400);
        }
  
        // 2. Crear cuenta Connect
        const account = await stripeService.createConnectedAccount(
          user.email,
          user.name || 'Usuario'
        );
  
        // 3. Guardar en base de datos
        await prisma.user.update({
          where: { id: parseInt(userId) },
          data: { stripeAccountId: account.id }
        });
  
        // 4. Crear link de onboarding
        const accountLink = await stripeService.createOnboardingLink(
          account.id,
          'http://localhost:5173/onboarding/retry',
          'http://localhost:5173/onboarding/success'
        );
  
        console.log("Onboarding creado para cuenta:", account.id);
        return ok(res, { 
          url: accountLink.url,
          accountId: account.id
        });
  
      } catch (error: any) {
        console.error('Error en onboarding:', error);
        return fail(res, error.message, 500);
      }
    }
  
    /**
     * Verificar estado del onboarding
     */
    async getOnboardingStatus(req: AuthedRequest, res: Response) {
      try {
        const userId = req.user!.id;
        
        const user = await prisma.user.findUnique({
          where: { id: parseInt(userId) },
          select: { stripeAccountId: true }
        });
  
        if (!user?.stripeAccountId) {
          return ok(res, { hasAccount: false });
        }
  
        const account = await stripeService.getAccountStatus(user.stripeAccountId);
        
        return ok(res, {
          hasAccount: true,
          accountStatus: account.charges_enabled ? 'active' : 'pending',
          detailsSubmitted: account.details_submitted,
          chargesEnabled: account.charges_enabled,
        });
  
      } catch (error: any) {
        console.error('Error verificando estado:', error);
        return fail(res, error.message, 500);
      }
    }
  
    /**
     * Verificar estado de un pago
     */
    async verifyPayment(req: Request, res: Response) {
      try {
        const { sessionId } = req.params;
  
        if (!sessionId) {
          return fail(res, "Session ID es requerido", 400);
        }

        const session = await stripeService.verifyPayment(sessionId);
        
        return ok(res, {
          status: session.status,
          paymentStatus: session.payment_status,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          customerEmail: session.customer_details?.email,
          metadata: session.metadata
        });
  
      } catch (error: any) {
        console.error('Error verificando pago:', error);
        return fail(res, error.message, 500);
      }
    }
  }
  
  // Exportar instancia del controller
  export const stripeController = new StripeController();