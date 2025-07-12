import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { subscriptionActive: true, subscriptionTier: true }
    });

    return NextResponse.json({
      subscriptionActive: profile?.subscriptionActive,
      subscriptionTier: profile?.subscriptionTier
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json({ error: "Failed to check subscription" }, { status: 500 });
  }
}