import { NextRequest, NextResponse } from 'next/server';
import prisma  from '@/lib/prisma'; // Adjust the import path as necessary

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email } = body;

    // Validate the input data
    if (!userId || !email) {
      return NextResponse.json({ error: 'User ID and email are required' }, { status: 400 });
    }

    // Create a new profile in the database using Prisma
    const profile = await prisma.profile.create({
      data: {
        userId,
        email,
      },
    });

    // Return the created profile as a JSON response
    return NextResponse.json(profile, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}