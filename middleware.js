import { NextResponse } from 'next/server';

export function middleware(request) {
  // 1. Read the HTTP-Only cookie
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // 2. Define your protected paths
  const pathname = request.nextUrl.pathname;
  
  // Public pages (Auth pages)
  const isAuthPage = pathname.startsWith('/login') || 
                     pathname.startsWith('/register') || 
                     pathname.startsWith('/verify-otp');

  // Protected pages (Admin, Clinic, Patient Dashboards, Assessment)
  const isProtectedPath = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/admin') || 
                          pathname.startsWith('/clinic') ||
                          pathname.startsWith('/assessment');

  // CASE A: User is NOT logged in but tries to access protected routes
  if (isProtectedPath && !refreshToken) {
    const loginUrl = new URL('/login', request.url);
    // Optional: Remember where they wanted to go
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // CASE B: User IS logged in but tries to access Login/Register
  if (isAuthPage && refreshToken) {
    // Redirect to a generic dashboard. 
    // Your AuthProvider will handle role-based redirect properly.
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// 3. Configure which routes trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api/ (API routes must always be accessible)
     * 2. /_next/ (Next.js system files)
     * 3. /static (Images, fonts, etc.)
     * 4. .*\\..* (Files with extensions like .jpg, .png, .css)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};