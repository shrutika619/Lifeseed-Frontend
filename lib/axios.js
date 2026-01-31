import axios from "axios";
import { setCredentials, logoutSuccess } from "@/redux/slices/authSlice";
import { Constants } from "@/app/utils/constants";

// ✅ Use the same env variable as Constants class
const BACKEND_URL = Constants.API_BASE_URL || "http://localhost:5000/api/v1"; 

let store;
export const injectStore = (_store) => { store = _store; };

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: BACKEND_URL, 
  headers: { "Content-Type": "application/json" },
  withCredentials: true // Required for HTTP-Only cookies
});

// REQUEST INTERCEPTOR: Attach access token to every request
api.interceptors.request.use(
  (config) => {
    if (!store) {
      console.warn("⚠️ Store not injected into axios. Call injectStore(store) in your app initialization.");
      return config;
    }
    
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Handle 401 errors and refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip interception for auth endpoints and retry requests
    if (
      originalRequest.url?.includes("/auth/login") || 
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/send-otp") ||
      originalRequest.url?.includes("/auth/verify-otp") ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("refresh-access-token") ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      if (isRefreshing) {
        // Queue this request while refresh is in progress
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
        console.log("🔄 Axios: 401 detected. Refreshing session...");
        
        // ✅ Call Next.js API proxy (which has the HTTP-Only cookie)
        const response = await axios.post("/api/auth/refresh", {}, {
          withCredentials: true
        });
        
        // Handle different response structures
        const data = response.data?.success ? response.data : response.data?.data;
        const newAccessToken = data?.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token in refresh response");
        }

        // Update Redux store with new token
        if (store) {
          store.dispatch(setCredentials({ 
            accessToken: newAccessToken, 
            user: data.user 
          }));
        }
        
        // Process all queued requests with new token
        processQueue(null, newAccessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError.message);
        
        // Clear queue
        processQueue(refreshError, null);
        
        // Only logout if NOT on auth pages
        const isAuthPage = typeof window !== 'undefined' && (
          window.location.pathname === '/login' ||
          window.location.pathname === '/register' ||
          window.location.pathname === '/verify-otp'
        );
        
        if (!isAuthPage && store) {
          console.log("🚪 Logging out due to failed refresh...");
          store.dispatch(logoutSuccess());
          
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
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