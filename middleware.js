import { NextResponse } from 'next/server';
import { decodeJwt } from 'jose';

// ==========================================
// 🛡️ 1. CENTRALIZED ROUTE CONFIGURATION
// ==========================================
// Define which roles are allowed for which path prefixes.
const ROUTE_PERMISSIONS = {
  '/super-admin': ['super_admin'],
  '/admin':       ['admin', 'super_admin'],
  // '/clinic':      ['clinic_admin', 'doctor'],
  '/hospitaldashboard': ['clinic_admin', 'doctor'],
  '/profile':     ['patient', 'clinic_admin', 'doctor', 'admin', 'super_admin'], 
  '/bookappointment': ['patient', 'clinic_admin', 'doctor', 'admin', 'super_admin'], 
};

// Define Auth Pages (to redirect logged-in users AWAY from)
const AUTH_PAGES = ['/login', '/partnership', '/login-admin'];

// Define Public Pages (Accessible by everyone)
const PUBLIC_PAGES = ['/', '/about', '/contact']; 

// Role Definitions (for cleaner checks)
const ROLES = {
  CLINIC: ['clinic_admin', 'doctor'],
  ADMIN: ['admin', 'super_admin'],
  PATIENT: ['patient']
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // 1. Get Tokens
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const roleCookie = request.cookies.get('user_role')?.value;

  // --- HELPER: Get User Role Safely ---
  const getUserRole = () => {
    if (roleCookie) return roleCookie;
    if (refreshToken) {
       try { return decodeJwt(refreshToken).role || 'patient'; } catch(e) {}
    }
    return null; // No role found
  };

  const userRole = getUserRole();
  const isLoggedIn = !!refreshToken;

  // ==========================================
  // 🟢 STEP 1: PUBLIC / AUTH PAGE HANDLING
  // ==========================================
  
  // A. Logged-in users visiting Login pages should be redirected to their dashboard
  if (isLoggedIn && AUTH_PAGES.includes(pathname)) {
      if (ROLES.CLINIC.includes(userRole)) return NextResponse.redirect(new URL('/hospitaldashboard', request.url));
      if (userRole === 'super_admin') return NextResponse.redirect(new URL('/super-admin/dashboard', request.url));
      if (userRole === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      return NextResponse.redirect(new URL('/', request.url));
  }

  // B. Allow access to completely public pages (like Home) without checks
  // NOTE: Clinic Admins usually shouldn't see the landing page after login, forcing them to dashboard
  if (pathname === '/' && isLoggedIn && ROLES.CLINIC.includes(userRole)) {
      return NextResponse.redirect(new URL('/hospitaldashboard', request.url));
  }
  
  // If it's a public page and not a special redirect case above, let them pass
  if (PUBLIC_PAGES.includes(pathname) || AUTH_PAGES.includes(pathname)) {
      return NextResponse.next();
  }

  // ==========================================
  // 🔴 STEP 2: PROTECTED ROUTE ENFORCEMENT
  // ==========================================

  // Check if the current path matches any protected route prefix
  const protectedPrefix = Object.keys(ROUTE_PERMISSIONS).find(prefix => pathname.startsWith(prefix));

  if (protectedPrefix) {
    
    // ✅ Identify correct login page based on URL
    const targetLoginPage = (pathname.startsWith('/admin') || pathname.startsWith('/super-admin')) 
      ? '/login-admin' 
      : '/login';

    // 1. Check if User is Logged In
    if (!isLoggedIn) {
       const loginUrl = new URL(targetLoginPage, request.url);
       loginUrl.searchParams.set('from', pathname);
       return NextResponse.redirect(loginUrl);
    }

    // 2. Validate Token Expiry
    try {
      const payload = decodeJwt(refreshToken);
      if (payload.exp && Date.now() >= payload.exp * 1000) throw new Error("Expired");
    } catch (e) {
       // Token invalid/expired -> Logout & Redirect to the CORRECT login page
       const response = NextResponse.redirect(new URL(`${targetLoginPage}?session_expired=true`, request.url));
       response.cookies.delete('refreshToken');
       response.cookies.delete('user_role');
       return response;
    }

    // 3. Check Role Access
    const allowedRoles = ROUTE_PERMISSIONS[protectedPrefix];
    if (!allowedRoles.includes(userRole)) {
       // ⛔ UNAUTHORIZED ACCESS ATTEMPT
       // Redirect them to their appropriate home to stop them
       if (ROLES.CLINIC.includes(userRole)) return NextResponse.redirect(new URL('/hospitaldashboard', request.url));
       if (userRole === 'patient') return NextResponse.redirect(new URL('/', request.url));
       
       return NextResponse.redirect(new URL('/', request.url)); // Fallback
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Matches everything EXCEPT api routes, static files, images, etc.
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};