// app/layout.js
"use client";
import { usePathname } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

// ✅ Import Redux Components
import StoreProvider from "@/components/StoreProvider"; 
import AuthInitializer from "@/components/AuthInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Define pages that should NOT have the standard Navbar/Footer
  const noLayoutPages = [
    '/startingadmin','/admin','/teamrole','/addteam','/team','/clinics','/joinnow',
    '/partnershipprogram','/reviewform','/hospitaldashboard','/add-doctor','/doctors',
    '/timetable','/login-admin','/super-admin', 
    '/admin/dashboard',"/admin/inquirydirect","/admin/in-clinic-consultation",
    "/admin/teleconsultation","/admin/clinic","/admin/setup","/admin/auditlogs",
    "/admin/team","/super-admin/super-admindashboard","/super-admin/inquirydirect",
    "/super-admin/in-clinic-consultation","/super-admin/teleconsultation",
    "/super-admin/clinic","/super-admin/setup","/super-admin/auditlogs",
    "/super-admin/team","/admin/first-time-user","/super-admin/first-time-user",
    "/super-admin/dashboard","/super-admin/log-in-user","/admin/log-in-user",
    "/super-admin/in-clinic-consultation","/admin/in-clinic-consultation",
    "/admin/clinics","/super-admin/clinics", "/login", "/register", "/verify-otp"
  ];

  // Logic to handle exact matches or sub-paths if necessary
  const showLayout = !noLayoutPages.includes(pathname);

  return (
    <html lang="en">
      <head>
        <title>men10</title>
        <meta name="description" content="Men's Health Platform" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        {/* ✅ 1. Wrap with Redux Store Provider first */}
       <StoreProvider>
          
          {/* 2. AuthInitializer Second (Must be inside Provider) */}
          <AuthInitializer>
            
            {/* 3. Now the Navbar and Children render AFTER session is checked */}
            {showLayout && <Navbar />}
            
            <main>
              {children}
            </main>
            
            {showLayout && <Footer />}
            <Toaster richColors position="top-center" />
            
          </AuthInitializer>
        </StoreProvider>
      </body>
    </html>
  );
}