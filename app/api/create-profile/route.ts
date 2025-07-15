import { NextResponse } from 'next/server';
import prisma  from '@/lib/prisma'; // Adjust the import path as necessary
import { currentUser } from '@clerk/nextjs/server';

export async function POST() {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'Unauthorized User' },
        { status: 401 }
      );
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 400 }
      );
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { userId: clerkUser.id },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists' },
        { status: 400 }
      );
    }

    const newProfile = await prisma.profile.create({
      data: {
        userId: clerkUser.id,
        email: email,
        subscriptionActive: false, // Default value
        subscriptionTier: null, // Default value
        stripeSubscriptionId: null, // Default value
      },
    });

    return NextResponse.json(newProfile, { status: 201 });


  } catch (err) {
    return NextResponse.json(
      { error:err },
      { status: 500 }
    );
  }
}