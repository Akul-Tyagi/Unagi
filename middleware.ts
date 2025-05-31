import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Define protected routes
const isProtectedRoute = createRouteMatcher(['/chat(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const {userId} = await auth();
  const path = new URL(req.url).pathname;
  
  // If user is signed in and on home page, redirect to chat
  if (userId && path === '/') {
    return NextResponse.redirect(new URL('/chat', req.url));
  }
  
  // If user is not signed in and tries to access protected routes
  if (!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL('/?mode=sign_in', req.url));
  }
  
  return NextResponse.next();
}, { debug: true });

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};