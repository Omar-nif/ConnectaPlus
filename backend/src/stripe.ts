// backend/src/stripe.ts - VERSIÓN COMPLETA
import Stripe from 'stripe';

// Configuración principal
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

// Client ID para Connect
export const connectClientId = process.env.STRIPE_CONNECT_CLIENT_ID!;

export default stripe;