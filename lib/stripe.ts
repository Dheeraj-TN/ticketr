import Stripe from "stripe";
if (!process.env.STRIPE_SECRET_KEY)
  throw new Error("Missing STRIPE_SECRET in env");
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});
