import { NextResponse } from "next/server";

// Define restricted paths for each role
const rolePaths = {
  admin: ["/admin"],          
  clinic: ["/clinic"],       
  patient: ["/assessment", "/profile"], 
};

// ⚠️ FIXED: Removed "/" from here so it doesn't match every route
const publicPaths = [
  "/login", 
  "/register", 
  "/unauthorized", 
  "/login-admin", 
  "/joinnow"
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // 1. Get tokens and role
  const accessToken = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  // -------------------------------------------------------------
  // A. PUBLIC PATHS CHECK
  // -------------------------------------------------------------
  if (pathname === "/" || publicPaths.some(path => pathname.startsWith(path))) {
    
    // REDIRECT LOGIC: If already logged in, send them to the right place
    if (accessToken && (pathname === "/login" || pathname === "/login-admin")) {
      if (userRole === "admin") return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      if (userRole === "clinic") return NextResponse.redirect(new URL("/clinic/dashboard", request.url));
      
      // ✅ CHANGE: If role is patient (or unknown), send them to Home
      return NextResponse.redirect(new URL("/", request.url)); 
    }
    return NextResponse.next();
  }

  // -------------------------------------------------------------
  // B. AUTHENTICATION CHECK
  // -------------------------------------------------------------
  if (!accessToken) {
    let loginPath = "/login"; 

    // Intelligent Redirect: If trying to access Admin, send to Admin Login
    if (pathname.startsWith("/admin")) {
      loginPath = "/login-admin";
    }

    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("redirect", pathname); 
    return NextResponse.redirect(loginUrl);
  }

  // -------------------------------------------------------------
  // C. ROLE-BASED PROTECTION
  // -------------------------------------------------------------
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/clinic") && userRole !== "clinic") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Optional: Strict check for patient routes
  if (rolePaths.patient.some(path => pathname.startsWith(path))) {
    // If you want to allow Admins to view patient profiles, remove the '&& userRole !== "admin"' part
    if (userRole !== "patient" && userRole !== "admin") { 
       return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};