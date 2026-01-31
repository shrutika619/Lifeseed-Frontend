"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
// ✅ Import Service
import { sendClinicOtp, verifyClinicOtp } from "@/app/services/clinic-auth.service";

export default function ClinicAuth() {
  const router = useRouter(); 
  
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Manage loading state

  const isValidPhone = (num) => /^[6-9]\d{9}$/.test(num);

  /* ---------------- SEND OTP ---------------- */
  const handleSendOTP = async () => {
    if (!isValidPhone(phone)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true); // ✅ Start Loading
    try {
      const res = await sendClinicOtp(phone);

      toast.success(res.message || "OTP sent successfully");
      setStep(2);
    } catch (err) {
      const message = err.response?.data?.message;

      if (message === "Please login") {
        toast.info("Clinic already exists. Please login.");
        router.push("/login"); // Redirect to main login
        return;
      }

      toast.error(message || "Failed to send OTP");
    } finally {
      setLoading(false); // ✅ Stop Loading
    }
  };

  /* ---------------- OTP INPUT HANDLER ---------------- */
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Enter full 6-digit OTP");
      return;
    }

    setLoading(true); // ✅ Start Loading
    try {
      const res = await verifyClinicOtp(phone, otpCode);
      const data = res.data || res; // Handle different response structures

      // ✅ 1. Store Mobile for Registration Form (As per docs)
      if(data.mobileNo){
        localStorage.setItem("clinic_mobile", data.mobileNo);
      }

      // 🔁 2. Clinic already approved → redirect to login
      if (data.shouldRedirectToLogin) {
        toast.success(
            data.message || "Clinic already approved. Please login."
        );
        router.push("/login"); 
        return;
      }

      // ❌ 3. Clinic rejected
      if (data.status === "rejected") {
        toast.error(data.rejectionReason || "Clinic application rejected");
        return;
      }

      // ✅ 4. OTP verified, New/Pending Clinic -> Show Info Page
      toast.success("OTP verified successfully");
      setStep(3);
      
    } catch (err) {
      toast.error(
          err.response?.data?.message || "Invalid or expired OTP"
      );
    } finally {
      setLoading(false); // ✅ Stop Loading
    }
  };

  const handleRedirect = () => {
    router.push("/joinnow"); // ✅ redirect to Registration Form
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

            <p className="text-[11px] text-gray-400 mt-2 max-w-xs mx-auto">
              By getting started, you agree to our{" "}
              <a href="#" className="text-indigo-500 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-500 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </section>

          {/* Clinics Grid */}
          <section className="text-center mb-12">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              Our Modern & Discreet Clinics
            </h3>
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              {["Reception", "Consultation", "Waiting Area", "Exterior"].map(
                (text) => (
                  <div
                    key={text}
                    className="bg-gray-100 rounded-xl shadow-sm py-6 flex items-center justify-center text-gray-700 font-medium hover:bg-gray-200 transition"
                  >
                    {text}
                  </div>
                )
              )}
            </div>
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