import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(){
  try{
    const clerkUser = await currentUser()
    if (!clerkUser?.id){
      return NextResponse.json({error: "Unauthorized"}, {status: 404})
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: clerkUser.id
      },
      select: {subscriptionTier: true}
    })

      if (!profile){
        return NextResponse.json({error: "No profile Found"})
      }

      return NextResponse.json(profile)
  } catch(error){
    return NextResponse.json({error: "Internal Server error"}, {status: 500})
  }
}