import { getPlanIDFromType } from "@/lib/plans";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest){
  const {newplan} = await request.json()

  if(!newplan) {
    return NextResponse.json({error: "New plan required"})
  }

  try{
    const clerkUser = await currentUser()
    if (!clerkUser?.id){
      return NextResponse.json({error: "Unauthorized"}, {status: 404})
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: clerkUser.id
      },
    })

      if (!profile){
        return NextResponse.json({error: "No profile Found"})
      }

      if (!profile.stripeSubscriptionId){
        return NextResponse.json({error: "No Active Subscription Found"})
      }

      const subscriptionId = profile.stripeSubscriptionId

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const subscriptionItemId = subscription.items.data[0]?.id

      if (!subscriptionItemId){
        return NextResponse.json({error: "No Active subscription found"})
      }

      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
        items: [
          {
            id: subscriptionItemId,
            price: getPlanIDFromType(newplan)
          }
        ],
        proration_behavior: "create_prorations"
      })

      await prisma.profile.update({
        where: {userId: clerkUser.id},
        data: {
          subscriptionTier: newplan,
          stripeSubscriptionId: updatedSubscription.id,
          subscriptionActive: true
        }
      })

      return NextResponse.json({subscription: updatedSubscription})

      return NextResponse.json(profile)
  } catch(error){
    return NextResponse.json({error: "Internal Server error"}, {status: 500})
  }
}