"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

import { sendLoginOtp, verifyLoginOtp } from "@/app/services/auth/auth.service";
import { getPatientProfile, savePatientProfile } from "@/app/services/patient/patient.service";
import { setCredentials } from "@/redux/slices/authSlice";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const searchParams = useSearchParams();

  // ✅ ROBUST REDIRECT LOGIC: Capture "from" AND any other dangling parameters (like clinicId)
  const [redirectPath, setRedirectPath] = useState("/");

  useEffect(() => {
    let basePath = searchParams.get("from") || "/";
    const additionalParams = new URLSearchParams();
    
    // Loop through all parameters in the URL
    searchParams.forEach((value, key) => {
      // If it's not the "from" parameter, it belongs to the destination URL
      if (key !== "from") {
        additionalParams.append(key, value);
      }
    });
    
    const queryString = additionalParams.toString();
    if (queryString) {
      // Safely append to the path, checking if a '?' already exists
      basePath += (basePath.includes("?") ? "&" : "?") + queryString;
    }
    
    setRedirectPath(basePath);
  }, [searchParams]);

  // State
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(6).fill("")); 
  const [step, setStep] = useState("send"); // 'send' | 'verify' | 'success' | 'profile'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [profileData, setProfileData] = useState({
    gender: "Male",
    name: "",
    age: "",
    email: ""
  });

  const isValidPhone = (num) => /^[6-9]\d{9}$/.test(num);

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    if (!isValidPhone(phone)) {
      setMessage("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);

    try {
      const response = await sendLoginOtp(phone);

      if (response?.success === false) {
          setMessage(response.message || "Failed to send OTP");
      } else {
          setMessage("");
          setStep("verify");
          toast.success("OTP Sent!");
      }
    } catch (err) {
      setMessage("An error occurred while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      setMessage("Enter valid 6-digit OTP");
      return;
    }
    setLoading(true);
    
    try {
      const data = await verifyLoginOtp(phone, finalOtp);
      // Extract User & Role
      const { accessToken, user, isNewUser } = data;
      
      if (!accessToken) throw new Error("Login failed - no access token");

      dispatch(setCredentials({
        accessToken: data.accessToken,
        user: data.user
      }));

      toast.success("Login Successful");

      // 🛑 ROLE CHECK: If Admin or Doctor, SKIP profile check & Redirect
      const userRole = user?.role || "patient";
      const exemptedRoles = ["clinic_admin", "doctor", "super_admin", "admin"];

      if (exemptedRoles.includes(userRole)) {
        router.push(redirectPath);
        return; 
      }

      // 🟢 PATIENT LOGIC BELOW
      
      // 1. If backend says new user -> Profile Setup
      if (isNewUser) {
        console.log("New Patient detected -> Profile Setup");
        setStep("success"); 
        setLoading(false);
        return;
      }

      // 2. If existing user, verify if profile data actually exists
      try {
        const profileCheck = await getPatientProfile();
        
        // ✅ BUG FIX: Explicitly check if the user has a name saved, not just if the profile object exists.
        const pData = profileCheck?.data || {};
        const isProfileComplete = !!(pData.fullName || pData.name || pData.age);

        if (profileCheck.success && isProfileComplete) {
          // Profile Found AND Complete -> Redirect
          console.log(`Patient Profile complete -> Redirecting to ${redirectPath}`);
          router.push(redirectPath);
        } else {
          // Profile Found BUT Incomplete (missing name/age) -> Setup
          console.log("Patient Profile incomplete -> Profile Setup");
          setStep("success");
        }
      } catch (profileError) {
        // Fallback -> Setup
        console.log("Profile check failed -> Profile Setup");
        setStep("success");
      }

    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.message || err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAVE PROFILE ================= */
  const handleSaveProfile = async () => {
    if (!profileData.name) {
      setMessage("Full Name is required");
      return;
    }
    
    setLoading(true);
    setMessage("");

    const payload = {
        fullName: profileData.name,
        email: profileData.email,
        age: profileData.age ? parseInt(profileData.age) : null,
        gender: profileData.gender.toLowerCase()
    };

    try {
      const response = await savePatientProfile(payload);

      if (response.success) {
          toast.success("Profile Saved!");
          router.push(redirectPath);
      } else {
          setMessage(response.message || "Failed to save profile");
      }
    } catch (err) {
      setMessage("An error occurred while saving the profile.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP INPUT HELPER ================= */
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Allow backspace to focus previous input
  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1e1e1e] p-4 font-sans">
      <div className="bg-white w-full max-w-[340px] p-6 rounded-[24px] shadow-lg relative">
        
        {/* STEP 1: SEND OTP */}
        {step === "send" && (
          <div className="text-center animate-in fade-in duration-300">
            <h2 className="text-[#2D3748] text-xl font-bold mb-6">Login</h2>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full p-4 border border-[#EDF2F7] rounded-xl mb-2 focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-[#A0AEC0]"
              maxLength={10}
            />
            <p className="text-xs text-[#718096] mb-8 text-left px-1">OTP will be shared for Verification</p>
            <button onClick={sendOtp} disabled={loading} className="bg-[#4285F4] hover:bg-blue-600 text-white w-full py-3.5 rounded-xl font-semibold transition-all mb-4 disabled:opacity-70">
              {loading ? "Sending..." : "Login"}
            </button>
            <p className="text-[11px] text-[#A0AEC0]">By signing in you agree to our <span className="text-[#4285F4] underline cursor-pointer">Terms and Conditions</span></p>
          </div>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === "verify" && (
          <div className="text-center animate-in fade-in duration-300">
            <h2 className="text-[#2D3748] text-xl font-bold mb-2">Login</h2>
            <p className="text-sm text-[#4A5568] mb-6 text-left">Enter OTP received on xxxxx{phone.slice(-4)}</p>
            <div className="flex justify-between gap-2 mb-8">
              {otp.map((digit, i) => (
                <input 
                  key={i} 
                  id={`otp-${i}`} 
                  value={digit} 
                  maxLength={1} 
                  onChange={(e) => handleOtpChange(e.target.value, i)} 
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  className="w-10 h-12 border border-[#EDF2F7] text-center rounded-xl bg-[#F7FAFC] text-lg font-bold focus:border-blue-400 focus:outline-none" 
                />
              ))}
            </div>
            <button onClick={verifyOtp} disabled={loading} className="bg-[#4285F4] hover:bg-blue-600 text-white w-full py-3.5 rounded-xl font-semibold mb-3 shadow-md transition-all disabled:opacity-70">
              {loading ? "Verifying..." : "Submit"}
            </button>
            <button onClick={sendOtp} disabled={loading} className="text-[#4285F4] text-sm font-semibold border border-[#E2E8F0] w-full py-3 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-70">
              Resend OTP
            </button>
          </div>
        )}

        {/* STEP 3: SUCCESS / REGISTER */}
        {step === "success" && (
          <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 border-2 border-[#4FD1C5] rounded-full flex items-center justify-center bg-teal-50">
                <svg className="w-8 h-8 text-[#4FD1C5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
            </div>
            <h3 className="text-base font-bold text-[#2D3748] mb-2">Registered Successfully!</h3>
            <p className="text-xs text-[#718096] mb-8">Let's set up your profile to continue.</p>
            
            <button 
              onClick={() => {
                setMessage(""); 
                setStep("profile"); 
              }} 
              className="bg-[#4285F4] text-white w-full py-3.5 rounded-xl font-semibold mb-3 hover:bg-blue-600 transition-all shadow-md"
            >
              Set Profile Now
            </button>
            
            {/* ✅ "SKIP" redirects reliably to where they came from */}
            <button 
              onClick={() => router.push(redirectPath)} 
              className="text-[#4A5568] text-sm font-semibold border border-[#E2E8F0] w-full py-3 rounded-xl hover:bg-gray-50 transition-all"
            >
              Skip for later
            </button>
          </div>
        )}

        {/* STEP 4: PROFILE SETUP */}
        {step === "profile" && (
          <div className="text-left animate-in fade-in slide-in-from-right-8 duration-300">
            <h2 className="text-[#2D3748] text-xl font-bold mb-6 text-center">Complete Profile</h2>
            
            <div className="flex bg-[#F7FAFC] rounded-xl mb-6 overflow-hidden border border-[#EDF2F7] p-1 shadow-sm">
              <button 
                onClick={() => setProfileData({...profileData, gender: 'Male'})} 
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${profileData.gender === 'Male' ? 'bg-[#4285F4] text-white shadow-sm' : 'text-[#A0AEC0] hover:text-[#4A5568]'}`}
              >
                Male
              </button>
              <button 
                onClick={() => setProfileData({...profileData, gender: 'Female'})} 
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${profileData.gender === 'Female' ? 'bg-[#4285F4] text-white shadow-sm' : 'text-[#A0AEC0] hover:text-[#4A5568]'}`}
              >
                Female
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1 ml-1">Full Name <span className="text-red-500">*</span></label>
                <input 
                  placeholder="Enter your full name" 
                  className="w-full p-3.5 border border-[#EDF2F7] rounded-xl text-sm focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-all bg-[#F7FAFC] focus:bg-white" 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1 ml-1">Age</label>
                <input 
                  placeholder="Enter your age" 
                  type="number" 
                  className="w-full p-3.5 border border-[#EDF2F7] rounded-xl text-sm focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-all bg-[#F7FAFC] focus:bg-white" 
                  value={profileData.age} 
                  onChange={(e) => setProfileData({...profileData, age: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1 ml-1">Email Address</label>
                <input 
                  placeholder="Enter your email (optional)" 
                  type="email" 
                  className="w-full p-3.5 border border-[#EDF2F7] rounded-xl text-sm focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-all bg-[#F7FAFC] focus:bg-white" 
                  value={profileData.email} 
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
                />
              </div>
            </div>
            
            <button 
              onClick={handleSaveProfile} 
              disabled={loading} 
              className="bg-[#4285F4] text-white w-full py-4 rounded-xl font-bold mt-8 shadow-md hover:bg-blue-600 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? "Saving..." : "Save & Finish"}
            </button>
          </div>
        )}

        {/* Global Error Message Display */}
        {message && (
          <div className="absolute -bottom-16 left-0 right-0 mx-auto w-full">
            <p className="text-[12px] text-red-500 text-center font-medium bg-red-50 p-2 rounded-lg border border-red-100 shadow-sm animate-in slide-in-from-top-2">
              {message}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginPage;