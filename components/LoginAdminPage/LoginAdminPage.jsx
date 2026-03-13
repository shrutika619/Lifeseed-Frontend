"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Lock, Mail, Eye, EyeOff, Shield, CheckCircle, ArrowRight } from "lucide-react";

import { adminLogin, logoutUser } from "@/app/services/auth/auth.service";
import { setCredentials, logoutSuccess, selectIsAuthenticated, selectUserRole, selectUser } from "@/redux/slices/authSlice";

const LoginAdminPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const currentUser = useSelector(selectUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState("ADMIN"); 
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 1. Auto-Redirect: Append adminId ONLY for regular admin
  useEffect(() => {
    if (isAuthenticated && (userRole === 'admin' || userRole === 'super_admin')) {
      const adminId = currentUser?.id || currentUser?._id || "";
      
      // Super Admin gets a clean URL
      const dest = userRole === 'super_admin' 
        ? '/super-admin/dashboard' 
        : `/admin/dashboard?adminId=${adminId}`;
        
      router.replace(dest);
    }
  }, [isAuthenticated, userRole, currentUser, router]);

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logoutSuccess());
    toast.success("Logged out successfully");
    router.refresh();
  };

  if (isAuthenticated && userRole !== 'admin' && userRole !== 'super_admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            You are currently logged in as <strong>{currentUser?.username || 'User'}</strong> ({userRole}). 
            <br />
            This portal is restricted to Administrators only. To sign in as an Admin, you must log out first.
          </p>
          <div className="space-y-3">
             <button
              onClick={() => {
                const dest = userRole === 'clinic_admin' ? '/clinic/dashboard' : '/dashboard';
                router.push(dest);
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-sm"
            >
              Return to My Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="w-full border border-red-200 text-red-600 bg-red-50 py-3 rounded-xl font-medium hover:bg-red-100 transition"
            >
              Logout to Access Admin Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    const result = await adminLogin(email, password);

    if (result.success) {
      const { accessToken, user } = result.data;
      const adminId = user.id || user._id;

      dispatch(setCredentials({ 
        accessToken, 
        user, 
        role: user.role 
      }));

      toast.success(`Welcome back, ${user.username || 'Admin'}`);

      // ✅ 2. Manual Login Redirect: Clean URL for Super Admin
      if (user.role === 'super_admin') {
        router.push('/super-admin/dashboard');
      } else {
        router.push(`/admin/dashboard?adminId=${adminId}`);
      }
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px]">
        <div className="md:w-5/12 bg-gradient-to-br from-blue-700 to-indigo-800 p-10 flex flex-col justify-between text-white">
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl mb-6">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">MEN10</h1>
            <div className="h-1 w-12 bg-blue-400 rounded-full mb-6"></div>
            <p className="text-blue-100 text-lg font-light leading-relaxed">
              MEN10 • Precision Management Portal <br /> 
              Securely manage your healthcare services with ease.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-blue-100/80">
              <CheckCircle className="w-4 h-4 text-blue-300" />
              <span> Security & Trust </span>
            </div>
            <p className="text-xs text-blue-200/60">
              © 2026 MEN10 Systems. All rights reserved.
            </p>
          </div>
        </div>

        <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
            <p className="text-gray-500 text-sm">Select your access level to continue</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setLoginMode("ADMIN")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                loginMode === "ADMIN"
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
              }`}
            >
              <div className={`p-2 rounded-lg ${loginMode === "ADMIN" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                <Lock className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">Admin</span>
            </button>

            <button
              onClick={() => setLoginMode("SUPER_ADMIN")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                loginMode === "SUPER_ADMIN"
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
              }`}
            >
              <div className={`p-2 rounded-lg ${loginMode === "SUPER_ADMIN" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">Super Admin</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="group">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Email / Username</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-gray-800"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
                />
                <span className="ml-2 text-sm text-gray-500 group-hover:text-gray-700">Stay signed in</span>
              </label>
              <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                Reset Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
              System Status: Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdminPage;