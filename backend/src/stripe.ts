import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// Asegurarnos de que la clave exista
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Falta STRIPE_SECRET_KEY en el archivo .env");
}

// Crear la instancia de Stripe con la clave de prueba
const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-07-30.basil",
  });
  

export default stripe;
