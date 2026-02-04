"use client";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useStore } from "react-redux";
import axios from "axios";
import { injectStore } from "@/lib/axios";

// ✅ Import actions
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

  if (!initialized.current) {
    injectStore(store);
    initialized.current = true;
  }

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await axios.post("/api/auth/refresh", {}, {
          withCredentials: true 
        });

        if (data?.accessToken) {
          const payload = data.data || data;
          dispatch(setCredentials({ 
             accessToken: payload.accessToken, 
             user: payload.user,
             role: payload.user?.role // ✅ Explicitly passing role
          }));
        } else {
          dispatch(logoutSuccess());
        }

      } catch (error) {
        if (error.response?.status === 401) {
          dispatch(logoutSuccess());
        } 
        else {
          console.error("Session Restore Error:", error.message);
        }
      } finally {
        dispatch(sessionRestorationComplete());
        setLoading(false);
      }
    };

    restoreSession();
  }, [dispatch]);

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