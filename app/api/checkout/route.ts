import { getPlanIDFromType } from "@/lib/plans";
import { NextRequest, NextResponse } from "next/server";
import {stripe} from "@/lib/stripe"; // Ensure you have a Stripe instance set up

export async function POST(request: NextRequest) {
  try {
    const { planName, userId, email } = await request.json();
    
    // Validate planId
    if (!planName || !userId || !email) {
      return new Response(JSON.stringify({ error: "Plan ID, email and userID is required" }), {
        status: 400,
      });
    }

    const allowedPlanTypes = ["Basic Plan", "Pro Plan", "Family Plan"];
    if (!allowedPlanTypes.includes(planName)) {
      return new Response(JSON.stringify({ error: "Invalid plan type" }), { status: 400 });
    }
    

    const planId = getPlanIDFromType(planName);
    // Validate planId
    if(!planName) {
      return new Response(JSON.stringify({ error: "Plan ID not found for the selected plan" }), {
        status: 400,
      });
    }

    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: planId, // Use the plan ID from the request
          quantity: 1,
        },
      ],
      customer_email: email, // Use the email from the request
      metadata: {
        clerkUserId: userId, planName// Store the user ID in metadata
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the checkout session." }, {status: 500},  
    );
  }
}