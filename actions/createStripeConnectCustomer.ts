// since this is a nextjs server action we use "use server"
"use server";

import { api } from "@/convex/_generated/api";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in env");
}
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
export async function createStripeConnectCustomer() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  // check if the user already has a stripe connect account
  const exsistingStripeConnectId = await convex.query(
    api.users.getUsersStripeConnectId,
    { userId }
  );
  if (exsistingStripeConnectId) {
    return { account: exsistingStripeConnectId };
  }
  // if the user doesnt exists, create a new stripe connect account
  const account = await stripe.accounts.create({
    type: "express",
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
  // update the user with the stripe connect id
  await convex.mutation(api.users.updateOrCreateUserStripeConnectId, {
    userId,
    stripeConnectId: account.id,
  });
  return { account: account.id };
}
