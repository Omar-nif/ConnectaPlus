import { application } from "express";
import {stripe, connectClientId} from "../lib/stripe";
import { destination } from "pino";

export class StripeService {

    /* Sesion de checkout */

    async createGroupCheckoutSession(
        amount: number,
        productName: string,
        description: string,
        metadata: any,
        successURL: string,
        cancelURL: string,
        destinationAccountID?: string //para connect
    ) {
        try {
            const sessionConfig: any = {
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'mxn',
                            product_data: {
                                name: productName,
                                description: description,
                            },
                            unit_amount: amount, //en centavos
                        },
                        quantity: 1,
                    }
                ],
                mode: 'payment',
                success_url: successURL,
                cancel_url: cancelURL,
                metadata: metadata,
                customer_email: metadata.customer_email,
            };

            // Si hay cuenta de destino usar connect
            if (destinationAccountID) {
                sessionConfig.payment_intent_data = {
                    application_free_amount: Math.round(amount * 0.10), // 10% de comision
                    transfer_data: {
                        destination: destinationAccountID,
                    },
                };
                console.log("Checkout con connect para cuenta: ", destinationAccountID);
            }

            const session = await stripe.checkout.sessions.create(sessionConfig);
            return session;

        } catch (error) {
            console.error('Error Creating checkout session:', error);
            throw new Error('No se pudo crear la session de pago');
        }
    }

    // Crear cuenta connect para un usuario (dueño de grupo)

    async createConnectedAccount(userEmail: string, userName: string) {
        try {
          const account = await stripe.accounts.create({
            type: 'express',
            country: 'MX',
            email: userEmail,
            capabilities: {
              card_payments: { requested: true },
              transfers: { requested: true },
            },
            business_type: 'individual',
            individual: {
              email: userEmail,
              first_name: userName?.split(' ')[0] || 'Usuario',
              last_name: userName?.split(' ')[1] || 'Connecta',
            },
          });

            return account;
        }catch (error) {
            console.error(' Error creating connected account:', error);
            throw new Error('No se pudo crear la cuenta de pago');
        }
    }

    // Crear link de onboarding para cuenta connect

    async createOnboardingLink(accountId: string, refreshUrl: string, returnUrl:string) {
        try {
            const accountLink = await stripe.accountLinks.create({
                account: accountId,
                refresh_url: refreshUrl,
                return_url: returnUrl,
                type: 'account_onboarding',
            });
            
            return accountLink;
            
        } catch (error) {
            console.error('Error creating onboarding link:',error);
            throw new Error('No se pudo crear el link de onboarding');
        }
    }

    //verificar estado de un pago

    async verifyPayment(sessionId: string) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            return session;
        } catch (error) {
            console.error('Error verifying paymen:',error);
            throw new Error('No se pudo verificar el pago');
        }
    }

    // Obtener informacion de cuenta Connect

    async getAccountStatus(accountId: string) {
        try {
            const account = await stripe.accounts.retrieve(accountId);
            return account;
        } catch (error) {
            console.error('Error getting acconunt status:', error);
            throw new Error('No se puede obtener el estado de la cuenta');
        }
    }
}

export const stripeService = new StripeService();