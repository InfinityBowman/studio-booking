import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getSession(request, response);

  if (!session) {
    console.log('No session found');
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Extract roles from the custom claim 'https://myapp.com/roles'
  const roles = session.user?.['https://studentmedia.com/roles'] || [];

  if (!roles.includes('admin')) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/protected/:path*', // Protect route /protected and any sub-routes
  ],
};
