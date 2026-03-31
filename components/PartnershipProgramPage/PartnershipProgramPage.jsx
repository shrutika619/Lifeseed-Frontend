"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ✅ Import Redux
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated, selectUserRole, selectUser, logoutSuccess } from "@/redux/slices/authSlice";

// ✅ Import Services
import { sendClinicOtp, verifyClinicOtp } from "@/app/services/auth/clinic-auth.service";
import api from "@/lib/axios"; // Needed for logout

export default function ClinicAuth() {
  const router = useRouter(); 
  const dispatch = useDispatch();
  
  // ✅ Redux State
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const user = useSelector(selectUser);

  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout'); // Clear Server Cookie
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      dispatch(logoutSuccess()); // Clear Client State
      toast.success("Logged out successfully");
      router.refresh(); // Refresh to clear any cached data
    }
  };

  /* -------------------------------------------------------------
     🛑 BLOCKER UI: If User is Already Logged In
     ------------------------------------------------------------- */
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
            !
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            You are already logged in
          </h2>
          
          <p className="text-gray-600 mb-6">
            You are currently logged in as <strong>{user?.fullName || 'User'}</strong> ({userRole}). 
            To register a new clinic or access the partnership portal, you must log out first.
          </p>

          <div className="space-y-3">
             {/* Option 1: Go to Dashboard */}
             <button
              onClick={() => {
                if (userRole === 'clinic_admin') router.push('/clinic/dashboard');
                else if (userRole === 'admin') router.push('/admin/dashboard');
                else router.push('/');
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </button>

            {/* Option 2: Logout */}
            <button
              onClick={handleLogout}
              className="w-full border border-red-200 text-red-600 bg-red-50 py-3 rounded-xl font-medium hover:bg-red-100 transition"
            >
              Logout to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     ✅ STANDARD FLOW (For Guests / Pending Clinics)
     ------------------------------------------------------------- */
  
  const isValidPhone = (num) => /^[6-9]\d{9}$/.test(num);

  // ... (Keep handleSendOTP, handleOtpChange, handleVerifyOTP logic EXACTLY as before) ...
  const handleSendOTP = async () => {
    if (!isValidPhone(phone)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      const res = await sendClinicOtp(phone);
      // console.log("OTP Sent:", res); 
      toast.success(res.message || "OTP sent successfully");
      setStep(2);
    } catch (err) {
      const message = err.response?.data?.message || "";
      if (message.includes("Please login") || message.includes("already exists") || message.includes("already approved")) {
        toast.error(message);
        cookieStore.delete("refreshToken");
        cookieStore.delete("user_role");
  
          // If you also store the accessToken in cookies, delete it here:
        cookieStore.delete("accessToken"); 
        // console.log("cookies cleared");
        setTimeout(() => router.push("/login"), 1500);
        return;
      }
      toast.error(message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) document.getElementById(`otp-${index + 1}`)?.focus();
    if (!value && index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Enter full 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyClinicOtp(phone, otpCode);
      const resultData = res.data; 

      if(resultData?.mobileNo) localStorage.setItem("clinic_mobile", resultData.mobileNo);

      if (resultData?.shouldRedirectToLogin) {
        toast.info(resultData.message || "Clinic has beeb approved. Please login.");
        setTimeout(() => router.push("/login"), 1500); 
        return;
      }

      if (resultData?.status === "rejected") {
        toast.error(resultData.rejectionReason || "Application rejected contact admin.");
        return;
      }

      if (resultData?.hasSubmittedForm && resultData?.status === "pending") {
         toast.info("Your application is pending approval. Redirecting to status...");
         setTimeout(() => router.push("/reviewform"), 1500);
         return;
      }

      toast.success("OTP Verified. Please complete registration.");
      setTimeout(() => router.push("/joinnow"), 1000);
      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    router.push("/joinnow"); 
  };

  const data = [
    { name: "Start", value: 1000 },
    { name: "3 Mo", value: 2500 },
    { name: "6 Mo", value: 4000 },
    { name: "9 Mo", value: 5200 },
    { name: "1 Year", value: 6000 },
  ];

  return (
    <div className="min-h-screen bg-[#0c1220] flex items-center justify-center text-gray-900">
      
      {/* STEP 0 - Welcome */}
      {step === 0 && (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-[360px] text-center">
          <h2 className="text-xl font-semibold mb-6">
            Welcome to Clinic Portal
          </h2>
          <button
            onClick={() => {
              setMode("login");
              setStep(1);
            }}
            className="w-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white py-2 rounded-lg font-medium hover:opacity-90 transition mb-3"
          >
            Existing User? Log In
          </button>
          <button
            onClick={() => {
              setMode("signup");
              setStep(1);
            }}
            className="w-full border border-[#2563EB] text-[#2563EB] py-2 rounded-lg font-medium hover:bg-blue-50 transition"
          >
            New User? Sign Up
          </button>
        </div>
      )}

      {/* STEP 1 - Phone */}
      {step === 1 && (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-[360px]">
          <h2 className="text-2xl font-semibold text-center mb-4">
            {mode === "login" ? "Log In" : "Sign Up"}
          </h2>
          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <p className="text-sm text-gray-500 mb-4">
            OTP will be shared for verification
          </p>
          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      )}

      {/* STEP 2 - OTP */}
      {step === 2 && (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-[360px]">
          <h2 className="text-2xl font-semibold text-center mb-4">
            {mode === "login" ? "Log In" : "Sign Up"}
          </h2>
          <p className="text-center text-gray-500 mb-4">
            Enter 6-digit OTP sent to xxxxxx{phone.slice(-4)}
          </p>

          <div className="flex justify-between mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                className="w-10 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg transition-colors"
              />
            ))}
          </div>

          <button
            onClick={handleVerifyOTP}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          
          <button 
             onClick={() => setStep(1)}
             className="w-full mt-3 text-sm text-blue-600 hover:underline"
          >
             Change Phone Number
          </button>
        </div>
      )}

      {/* STEP 3 - Partner Section (Info Page) */}
      {step === 3 && (
        <div className="w-full bg-white text-gray-800 overflow-y-auto py-10 px-4 h-screen">
          
          {/* Header */}
          <section className="text-center mb-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Elevate Your Practice.{" "}
              <span className="text-indigo-600">Join the MEN10 Network.</span>
            </h1>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Partner with India’s leading sexual wellness clinic network. We
              provide technology, expertise, and patient flow to help you build
              a successful and reputable sexual health practice.
            </p>
            <button
              onClick={handleRedirect} 
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:opacity-90 transition"
            >
              Join Now
            </button>
          </section>

          {/* Features */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Features & Benefits
            </h2>
            <div className="space-y-3 max-w-xs mx-auto">
              {[
                "Increased Patient Flow – Access a growing base of targeted marketing and loyal patient referrals.",
                "Advanced Technology Platform – Integrated lead, patient, analytics, and telemedicine solutions.",
                "Proven Clinical Protocols – Follow evidence-based treatment practices and deliver proven results.",
              ].map((text, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl shadow-sm p-3 text-sm text-gray-700"
                >
                  {text}
                </div>
              ))}
            </div>
          </section>

          {/* Roadmap */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
              Your Roadmap to Success
            </h2>
            <div className="max-w-xs mx-auto space-y-3">
              {[
                "Become a MEN10 Partner – Join our elite network of clinics.",
                "Daily New Customers – Receive steady flow of new patients.",
                "Continuous Growth & Training – Get ongoing learning support.",
                "93% Result & Satisfaction – Proven, effective protocols.",
                "Without Side Effects – Safe, natural Ayurvedic treatments.",
                "Achieve Lasting Success – Build a trusted practice for years.",
              ].map((text, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl p-3 shadow-sm text-sm text-gray-700"
                >
                  {text}
                </div>
              ))}
            </div>
          </section>

          {/* Chart Section */}
          <section className="text-center mb-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to Elevate Your Practice?
            </h2>
            <p className="text-sm text-gray-500">
              Click the button below to begin the partnership process.
            </p>

            <div className="mx-auto mt-6 bg-white shadow-sm rounded-xl p-4 border border-gray-100 w-full max-w-xs">
              <p className="text-[12px] font-semibold text-gray-700 mb-2">
                Proven Growth Trajectory
              </p>
              
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#6C63FF"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#6C63FF" }}
                    />
                    </LineChart>
                </ResponsiveContainer>
              </div>

              <p className="text-[10px] text-green-600 font-semibold mt-1">
                +300% Year 1 Average
              </p>
            </div>

            <button
              onClick={handleRedirect}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold py-2 px-6 rounded-lg mt-5 shadow-md hover:opacity-90 transition"
            >
              Get Started Now
            </button>
          </section>

          {/* Contact Footer */}
          <section className="text-center pb-8">
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              Contact Us
            </h3>
            <div className="bg-gray-50 rounded-xl p-5 shadow-sm max-w-xs mx-auto text-sm text-gray-600 leading-relaxed">
              <p className="font-medium text-gray-800">MEN10 Pvt. Limited</p>
              <p>
                Plot No. [Number], Geeta Nagar,
                <br />
                Manewada, Nagpur, Maharashtra
              </p>
              <p className="text-indigo-500 font-semibold mt-2">7800-102-108</p>
              <a
                href="mailto:partners@men10.com"
                className="text-indigo-500 hover:underline"
              >
                partners@men10.com
              </a>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}