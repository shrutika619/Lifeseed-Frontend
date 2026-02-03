"use client";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useStore } from "react-redux";
import axios from "axios";
import { injectStore } from "@/lib/axios";

// ✅ Import actions from your provided slice
import { 
  setCredentials, 
  logoutSuccess, 
  sessionRestorationComplete 
} from "@/redux/slices/authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const store = useStore();
  const initialized = useRef(false);
  const [loading, setLoading] = useState(true);

  // 1. Inject Redux Store into Axios (Singleton Pattern)
  if (!initialized.current) {
    injectStore(store);
    initialized.current = true;
  }

  useEffect(() => {
    const restoreSession = async () => {
      try {
        // 2. Attempt to refresh token (HttpOnly Cookie -> Access Token)
        const { data } = await axios.post("/api/auth/refresh", {}, {
          withCredentials: true 
        });

        // 3. Success: User is logged in
        if (data?.accessToken || data?.data?.accessToken) {
          const payload = data.data || data;
          dispatch(setCredentials({ 
             accessToken: payload.accessToken, 
             user: payload.user 
          }));
        } else {
          // Edge case: 200 OK but empty data
          dispatch(logoutSuccess());
        }

      } catch (error) {
        // 4. ✅ ELEGANT HANDLING: 401 means "Guest User"
        if (error.response?.status === 401) {
          // Fail silently. Do not show error toast.
          // Just ensure Redux knows we are not logged in.
          dispatch(logoutSuccess());
        } 
        // 5. Handle Real Errors (Server Down, 500s)
        else {
          console.error("Session Restore Error:", error.message);
        }
      } finally {
        // 6. ✅ CRITICAL: Open the gates. 
        // This sets sessionRestored = true in your slice, allowing the UI to render.
        dispatch(sessionRestorationComplete());
        setLoading(false);
      }
    };

    restoreSession();
  }, [dispatch]);

  // Loading Screen (Only shows for ~300ms on first load)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
         <p className="text-gray-500 text-sm font-medium">Restoring Session...</p>
      </div>
    );
  }

  return children;
}