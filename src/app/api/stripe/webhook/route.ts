import { stripe } from "@/lib/stripe-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;
        if (!userId) break;
        await getSupabaseAdmin().from("user_profiles").update({
          subscription_status: "pro",
          stripe_customer_id: customerId,
          credits: 999999,
        }).eq("id", userId);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        await getSupabaseAdmin().from("user_profiles").update({ subscription_status: "free" }).eq("stripe_customer_id", customerId);
        break;
      }
      default:
        console.log("Unhandled event type", event.type);
    }
  } catch (err: any) {
    console.error("Error handling webhook event:", err.message);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}