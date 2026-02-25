import axios from "axios";
import { setCredentials, logoutSuccess } from "@/redux/slices/authSlice";
import { Constants } from "@/app/utils/constants";

// ✅ Store Injection (Singleton Pattern)
// This allows us to access Redux outside of React components
let store;
export const injectStore = (_store) => { 
  store = _store; 
};

// ✅ Queue for failed requests while the token is actively refreshing
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ✅ Create Axios Instance
const api = axios.create({
  baseURL: Constants.API_BASE_URL, 
  headers: { "Content-Type": "application/json" },
  withCredentials: true // IMPORTANT: Ensures HTTP-Only cookies (like refreshToken) are sent
});

// 1️⃣ REQUEST INTERCEPTOR: Attach Access Token from Redux
api.interceptors.request.use(
  (config) => {
    if (store) {
      const token = store.getState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2️⃣ RESPONSE INTERCEPTOR: Handle 401 & Silent Refresh
api.interceptors.response.use(
  (response) => response, // Pass successful responses straight through
  async (error) => {
    const originalRequest = error.config;

    // 🛑 Prevent infinite loops: Don't intercept if the error came from Auth endpoints,
    // the logout route, or if we have already tried retrying this specific request once.
    if (
      !originalRequest || 
      originalRequest.url?.includes("/auth/") || 
      originalRequest.url?.includes("/admin/login") || 
      originalRequest.url?.includes("/clinic/send-otp") || 
      originalRequest.url?.includes("/clinic/verify-otp") ||
      originalRequest.url?.includes("/logout") || 
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // 🔄 Handle 401 Unauthorized (Access Token Expired)
    if (error.response?.status === 401) {
      
      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Session Expired. Attempting Refresh...");
        
        // Call Next.js Proxy to refresh the token 
        // Note: We use standard `axios` here, NOT the `api` instance, to avoid interceptor loops
        const { data } = await axios.post("/api/auth/refresh", {}, {
          withCredentials: true 
        });

        const newAccessToken = data?.accessToken || data?.data?.accessToken;
        
        if (!newAccessToken) {
          throw new Error("Refresh failed: No access token returned");
        }

        // Update Redux with the new token
        if (store) {
          store.dispatch(setCredentials({ 
            accessToken: newAccessToken, 
            user: data.user || store.getState().auth.user 
          }));
        }

        // Process any queued requests with the new token
        processQueue(null, newAccessToken);
        
        // Retry the original request that failed
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // 🛑 REFRESH FAILED (e.g., Refresh Token is also expired/invalid)
        processQueue(refreshError, null);
        console.log("🛑 Refresh failed. Forcing complete logout...");
        
        // 1. HIT NEXT.JS LOGOUT PROXY 
        // This will clear the HttpOnly cookies and hit the backend to destroy the DB session
        try {
           const oldToken = store ? store.getState().auth.token : "";
           await axios.post("/api/logout", {}, {
              headers: {
                 Authorization: oldToken ? `Bearer ${oldToken}` : ""
              }
           });
        } catch (logoutErr) {
           console.error("Failed to hit logout proxy during forced logout", logoutErr);
        }

        // 2. WIPE ACCESS TOKEN FROM REDUX
        if (store) {
          store.dispatch(logoutSuccess());
        }

        // 3. REDIRECT TO LOGIN
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
           window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;