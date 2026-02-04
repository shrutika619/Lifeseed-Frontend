import { NextResponse } from 'next/server';
import { decodeJwt } from 'jose';

// 1. Define SPECIFIC protected routes for clinics
const CLINIC_PRIVATE_ROUTES = [
  '/clinic/dashboard',
  '/clinic/appointments',
  '/clinic/patients',
  '/clinic/doctors',
  '/clinic/settings',
  '/clinic/profile'
];

// 2. Define ALL protected prefixes
const PROTECTED_PREFIXES = [
  '/dashboard',     
  '/admin',         
  '/super-admin',   
  '/doctor',        
  '/profile',       
  '/assessment',    
  '/joinnow',       
  '/bookappointment',
  ...CLINIC_PRIVATE_ROUTES
];

const ROLES = {
  CLINIC: ['clinic_admin', 'doctor'],
  ADMIN: ['admin'], 
  SUPER_ADMIN: ['super_admin'], 
  PATIENT: ['patient']
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  // ✅ FIX: Read the Role from the "user_role" cookie
  // (We set this cookie in the Login Proxy specifically for the middleware)
  const roleCookie = request.cookies.get('user_role')?.value;

  // --- HELPER: Determine User Role ---
  // Prioritize the cookie, fall back to token if cookie is missing
  const getUserRole = (token) => {
    if (roleCookie) return roleCookie;
    if (token) {
       try { return decodeJwt(token).role || 'patient'; } catch(e) {}
    }
    return 'patient';
  };

  // =========================================================
  // 🟢 STEP 1: PUBLIC ROUTE CHECK (Prevent Login Loop)
  // =========================================================
  const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));

  if (!isProtected) {
    // Edge Case: Logged-in user visiting Login/Partnership/AdminLogin page
    const isAuthPage = ['/login', '/partnership', '/login-admin'].includes(pathname);

    if (refreshToken && isAuthPage) {
       try {
         const payload = decodeJwt(refreshToken); 
         
         // If token is expired, allow access to login page
         if (payload.exp && Date.now() >= payload.exp * 1000) {
            return NextResponse.next(); 
         }

         // ✅ USE THE FIXED ROLE HELPER
         const role = getUserRole(refreshToken);

         if (ROLES.SUPER_ADMIN.includes(role)) return NextResponse.redirect(new URL('/super-admin/dashboard', request.url));
         if (ROLES.ADMIN.includes(role)) return NextResponse.redirect(new URL('/admin/dashboard', request.url));
         if (ROLES.CLINIC.includes(role)) return NextResponse.redirect(new URL('/clinic/dashboard', request.url));
         
         return NextResponse.redirect(new URL('/dashboard', request.url));
       } catch (e) {
         return NextResponse.next();
       }
    }
    return NextResponse.next();
  }

  // =========================================================
  // 🔴 STEP 2: PROTECTED ROUTE CHECK
  // =========================================================
  
  if (!refreshToken) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/super-admin')) {
        return NextResponse.redirect(new URL('/login-admin', request.url));
    }
    return NextResponse.redirect(new URL(`/login?from=${pathname}`, request.url));
  }

  try {
    const payload = decodeJwt(refreshToken);
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      throw new Error("Token Expired");
    }

    // ✅ USE THE FIXED ROLE HELPER
    const userRole = getUserRole(refreshToken);

    // 🛡️ ROLE GUARDS

    // 1. Super Admin
    if (pathname.startsWith('/super-admin') && !ROLES.SUPER_ADMIN.includes(userRole)) {
        // Redirect unauthorized users to Home instead of Dashboard to be safe
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. Admin (Co-admin)
    if (pathname.startsWith('/admin') && !ROLES.ADMIN.concat(ROLES.SUPER_ADMIN).includes(userRole)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. Clinic
    const isClinicPrivateRoute = CLINIC_PRIVATE_ROUTES.some(route => pathname.startsWith(route));
    if (isClinicPrivateRoute && !ROLES.CLINIC.includes(userRole)) {
       return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 4. Patient Dashboard Protection
    // If a non-patient tries to access patient dashboard, send them to their own dashboard
    if (pathname.startsWith('/dashboard') && !ROLES.PATIENT.includes(userRole)) {
       if (ROLES.SUPER_ADMIN.includes(userRole)) return NextResponse.redirect(new URL('/super-admin/dashboard', request.url));
       if (ROLES.ADMIN.includes(userRole)) return NextResponse.redirect(new URL('/admin/dashboard', request.url));
       return NextResponse.redirect(new URL('/clinic/dashboard', request.url));
    }

  } catch (error) {
    // Token is expired or invalid
    const targetLogin = (pathname.startsWith('/admin') || pathname.startsWith('/super-admin')) 
      ? '/login-admin' 
      : '/login';

    const loginUrl = new URL(targetLogin, request.url);
    loginUrl.searchParams.set('session_expired', 'true');
    
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('refreshToken');
    response.cookies.delete('user_role'); // ✅ Clear role cookie too
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};