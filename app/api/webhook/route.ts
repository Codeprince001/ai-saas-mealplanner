import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
// Import the Prisma client
import prisma from "@/lib/prisma"

let subscriptionObject: Stripe.Subscription | null = null;


export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature || "",
      webhookSecret
    );
  }

  catch (err) {
    return NextResponse.json(
      { error: "Webhook Error: " + (err as Error).message },  
      { status: 400 }
    );
  }

  try {
  switch(event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;
      if (!metadata || !metadata.clerkUserId) {
        console.log("No metadata or clerkUserId found in session");
        return NextResponse.json(
          { error: "Invalid session data" },
          { status: 400 }
        );
      }

      await handleCheckoutSessionCompleted(session, metadata);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;

      // const customerId = invoice.customer as string;
      await handleInvoicePaymentFailed(invoice, subscriptionObject as Stripe.Subscription);

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      // const customerId = subscription.customer as string;

      await handleCustomerSubscriptionDeleted(subscription)

      break;
    }
    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      subscriptionObject = subscription;
      break;
    }
    default: 
      console.log(`Unhandled event type  ${event.type}`)
  }
} catch (err){
  return NextResponse.json(
    { error: "Webhook handler failed." + (err as Error).message }, {status: 500 }
  );
}

return NextResponse.json(
  { received: true },
  { status: 200 }
)

}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, metadata: {clerkUserId?: string, planName?: string}){
  const userId = metadata.clerkUserId
  if(!userId){
    console.log("No user ID")
    return
  }
  const subscriptionId = session.subscription as string
  if(!subscriptionId){
    console.log("<issing subscription Id")
    return;
  }

  try {
    await prisma.profile.update({
      where: {userId},
      data: {
        stripeSubscriptionId: subscriptionId,
        subscriptionActive: true,
        subscriptionTier: session.metadata?.planName || null
      }
    })
  }
  catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, message: "Profile updated successfully" },
    { status: 200 }
  );
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id as string;
  if (!subscriptionId) {
    console.log("No subscription ID found in invoice");
    return;
  }

  let userId: string | null = null;
  try {
    const profile = await prisma.profile.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
      select: { userId: true }
    });

    if (profile) {
      userId = profile.userId;
      console.log("User ID found:", userId);
    }
    else {
      console.log("No profile found for subscription ID:", subscriptionId);
      return;
    }
  } catch (error) {
    console.error("Failed to retrieve subscription:", error);
    return;
  }

  try {
    await prisma.profile.update({
      where: { userId },
      data: {
        subscriptionActive: false,
        stripeSubscriptionId: null,
        subscriptionTier: null
      }
    });
    console.log("Profile updated to inactive for user:", userId);
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

async function handleCustomerSubscriptionDeleted(subscription: Stripe.Subscription){
  const subscriptionId = subscription.id;
  if (!subscriptionId) {
    console.log("No subscription ID found in subscription");
    return;
  }
  let userId: string | null = null;
  try {
    const profile = await prisma.profile.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
      select: { userId: true }
    });

    if (profile) {
      userId = profile.userId;
    } else {
      console.log("No profile found for subscription ID:", subscriptionId);
      return;
    }
  } catch (error) {
    console.error("Failed to retrieve subscription:", error);
    return;
  }

  try {
    await prisma.profile.update({
      where: { userId },
      data: {
        subscriptionActive: false,
        stripeSubscriptionId: null,
        subscriptionTier: null
      }
    });

  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { error: error },
      { status: 500 }
    );
  }
}
