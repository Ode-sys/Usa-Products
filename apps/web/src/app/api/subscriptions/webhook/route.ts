import { NextRequest, NextResponse } from "next/server";
import { handleStripeWebhook } from "@ode/billing";
import Stripe from "stripe";

export const POST = async (req: NextRequest) => {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    await handleStripeWebhook(body, sig);
    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
};

export const config = { api: { bodyParser: false } };
