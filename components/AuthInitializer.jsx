"use client";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useStore } from "react-redux";
import { setCredentials, sessionRestorationComplete } from "@/redux/slices/authSlice";
import { injectStore } from "@/lib/axios";
import axios from "axios";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const store = useStore();
  const initialized = useRef(false);
  const [loading, setLoading] = useState(true);

  // ✅ Inject store into axios ONCE
  if (!initialized.current) {
    injectStore(store);
    initialized.current = true;
  }

  useEffect(() => {
    const restoreSession = async () => {
      try {
        console.log("🔵 AuthInit: Attempting session restoration...");
        
        // ✅ Call Next.js API Route Proxy (which reads HTTP-Only cookie)
        const { data } = await axios.post("/api/auth/refresh", {}, {
          withCredentials: true // Ensure cookies are sent
        });

        // ✅ Handle different response structures
        const responseData = data?.success ? data : data?.data;
        
        if (responseData?.accessToken) {
          console.log("🟢 AuthInit: Session Restored Successfully!");
          dispatch(setCredentials({ 
             accessToken: responseData.accessToken, 
             user: responseData.user 
          }));
        } else {
          console.log("⚠️ AuthInit: No access token in response");
          dispatch(sessionRestorationComplete());
        }
      } catch (error) {
        console.error("🔴 AuthInit: Session restoration failed");
        
        // ✅ Detailed error logging
        if (error.response) {
          console.error("   Status:", error.response.status);
          console.error("   Message:", error.response.data?.message || error.response.statusText);
          
          if (error.response.status === 401) {
            console.log("   → No valid session found (user needs to login)");
          } else if (error.response.status === 500) {
            console.error("   → Server error - check backend logs");
          }
        } else if (error.code === 'ECONNREFUSED') {
          console.error("   → Backend connection refused - is server running?");
        } else {
          console.error("   →", error.message);
        }
        
        // ✅ Mark restoration as complete even on failure
        dispatch(sessionRestorationComplete());
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [dispatch]);

  // ✅ Show loading state while restoring session
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
         <p className="text-lg font-semibold text-blue-600">Restoring Session...</p>
         <p className="text-sm text-gray-500 mt-2">Please wait</p>
      </div>
    );
  }

  return children;
}