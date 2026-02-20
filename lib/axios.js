import axios from "axios";
import { setCredentials, logoutSuccess } from "@/redux/slices/authSlice";
import { Constants } from "@/app/utils/constants";

// ✅ Store Injection (Singleton Pattern)
let store;
export const injectStore = (_store) => { store = _store; };

// ✅ Queue for failed requests during refreshing
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ✅ Create Instance
const api = axios.create({
  baseURL: Constants.API_BASE_URL, 
  headers: { "Content-Type": "application/json" },
  withCredentials: true // IMPORTANT: Sends HTTP-Only cookies
});

// 1️⃣ REQUEST INTERCEPTOR: Attach Token
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

// 2️⃣ RESPONSE INTERCEPTOR: Handle 401 & Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🛑 Prevent infinite loops: Don't refresh if the error came from Auth endpoints
    // ✅ FIX: Added optional chaining (?.) to url to prevent "undefined.includes" crashes
    if (
      !originalRequest || 
      originalRequest.url?.includes("/auth/") || 
      originalRequest.url?.includes("/admin/login") || 
      originalRequest.url?.includes("/clinic/send-otp") || 
      originalRequest.url?.includes("/clinic/verify-otp") ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // 🔄 Handle 401 Unauthorized
    if (error.response?.status === 401) {
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
        
        // Call Next.js Proxy (which holds the HttpOnly Cookie)
        const { data } = await axios.post("/api/auth/refresh", {}, {
          withCredentials: true
        });

        const newAccessToken = data?.accessToken || data?.data?.accessToken;
        
        if (!newAccessToken) {
          throw new Error("Refresh failed: No access token returned");
        }

        // Update Redux
        if (store) {
          store.dispatch(setCredentials({ 
            accessToken: newAccessToken, 
            user: data.user // Proxy logic decodes this from token
          }));
        }

        // Retry queued requests
        processQueue(null, newAccessToken);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // 🚪 Logout if refresh fails
        if (store) {
          store.dispatch(logoutSuccess());
          // Optional: Redirect to login
          if (typeof window !== "undefined") window.location.href = "/login";
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