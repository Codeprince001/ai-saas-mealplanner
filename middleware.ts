import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(["/","/sign-up(.*)","/subscribe(.*)","/sign-in(.*)","/sign-out(.*)","/verify-email(.*)","/reset-password(.*)","/update-password(.*)","/update-profile(.*)","/terms-of-use(.*)","/privacy-policy(.*)"]);

const isSignUpRoute = createRouteMatcher(["/sign-up(.*)"])

console.log("isSignUpRoute", isSignUpRoute);

export default clerkMiddleware(async (auth, req) => {
  // You can add custom logic here if needed ;
  const userAuth = await auth()

  const {userId} = userAuth || {};

  // If the user is not authenticated and the route is not public, redirect to sign-in
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(
      new URL('/sign-up', req.url)
    );
  }

  // Prevent logged‑in users from hitting auth pages
  if (userId && isPublicRoute(req) && req.nextUrl.pathname.startsWith('/sign-')) {
    const url = req.nextUrl.clone();
    url.pathname = '/mealplan';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
})


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};