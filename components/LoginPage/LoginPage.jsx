"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

// ✅ Import Services
import { sendLoginOtp, verifyLoginOtp } from "@/app/services/auth.service";
import { getPatientProfile, savePatientProfile } from "@/app/services/patient.service";

// ✅ Import Redux Actions
import { setCredentials } from "@/redux/slices/authSlice";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // State
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(6).fill("")); 
  const [step, setStep] = useState("send"); 
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

    const response = await sendLoginOtp(phone);

    if (response?.success === false) {
        setMessage(response.message || "Failed to send OTP");
    } else {
        setMessage("");
        setStep("verify");
        toast.success("OTP Sent!");
    }
    setLoading(false);
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
      // ✅ 1. Verify OTP and get tokens (calls /api/login proxy)
      const data = await verifyLoginOtp(phone, finalOtp);
      
      const { accessToken, user, isNewUser } = data;
      
      if (!accessToken) {
        throw new Error("Login failed - no access token");
      }

      // ✅ 2. Store credentials in Redux (HTTP-Only cookie already set by /api/login)
      dispatch(setCredentials({
        accessToken: data.accessToken,
        user: data.user
      }));

      toast.success("Login Successful");

      // ✅ 3. Check if user is new or needs profile setup
      if (isNewUser) {
        console.log("New user - showing profile setup");
        setStep("success"); 
        return;
      }

      // ✅ 4. For existing users, verify profile exists
      try {
        // Backend should extract userId from JWT token, so no userId needed
        const profileCheck = await getPatientProfile();
        
        if (profileCheck.success && profileCheck.data) {
          // Profile exists -> Redirect to home
          console.log("Profile exists - redirecting to home");
          router.push("/");
        } else {
          // Profile doesn't exist -> Setup profile
          console.log("Profile not found - showing profile setup");
          setStep("success");
        }
      } catch (profileError) {
        // If profile check fails (404 or error), show profile setup
        console.log("Profile check error - showing profile setup:", profileError.message);
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

    const response = await savePatientProfile(payload);

    if (response.success) {
        toast.success("Profile Saved!");
        router.push("/");
    } else {
        setMessage(response.message || "Failed to save profile");
    }
    setLoading(false);
  };

  /* ================= OTP INPUT HELPER ================= */
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // ================= JSX UI (Unchanged) =================
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1e1e1e] p-4 font-sans">
      
      <div className="bg-white w-full max-w-[340px] p-6 rounded-[24px] shadow-lg">
        
        {/* STEP 1: SEND OTP */}
        {step === "send" && (
          <div className="text-center">
            <h2 className="text-[#2D3748] text-xl font-bold mb-6">Login</h2>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full p-4 border border-[#EDF2F7] rounded-xl mb-2 focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-[#A0AEC0]"
              maxLength={10}
            />
            <p className="text-xs text-[#718096] mb-8 text-left px-1">OTP will be shared for Verification</p>
            <button
              onClick={sendOtp}
              disabled={loading}
              className="bg-[#4285F4] hover:bg-blue-600 text-white w-full py-3.5 rounded-xl font-semibold transition-all mb-4"
            >
              {loading ? "Sending..." : "Login"}
            </button>
            <p className="text-[11px] text-[#A0AEC0]">
              By signing in you agree to our <span className="text-[#4285F4] underline cursor-pointer">Terms and Conditions</span>
            </p>
          </div>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === "verify" && (
          <div className="text-center">
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
                  className="w-10 h-12 border border-[#EDF2F7] text-center rounded-xl bg-[#F7FAFC] text-lg font-bold focus:border-blue-400 focus:outline-none"
                />
              ))}
            </div>
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="bg-[#4285F4] text-white w-full py-3.5 rounded-xl font-semibold mb-3 shadow-md"
            >
              {loading ? "Verifying..." : "Submit"}
            </button>
            <button 
              onClick={sendOtp}
              className="text-[#4285F4] text-sm font-semibold border border-[#E2E8F0] w-full py-3 rounded-xl hover:bg-gray-50 transition-all"
            >
              Resend OTP
            </button>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === "success" && (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 border-2 border-[#4FD1C5] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#4FD1C5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-[#4A5568] mb-10">Registered Successfully</h3>
            <button
              onClick={() => setStep("profile")}
              className="bg-[#4285F4] text-white w-full py-3.5 rounded-xl font-semibold mb-3 hover:bg-blue-600 transition-colors"
            >
              Set Profile
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-[#4285F4] text-sm font-semibold border border-[#E2E8F0] w-full py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Skip
            </button>
          </div>
        )}

        {/* STEP 4: PROFILE SETUP */}
        {step === "profile" && (
          <div className="text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-[#2D3748] text-lg font-bold mb-4">Profile</h2>
            <div className="flex bg-[#F7FAFC] rounded-xl mb-6 overflow-hidden border border-[#EDF2F7] p-1">
              <button 
                onClick={() => setProfileData({...profileData, gender: 'Male'})}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${profileData.gender === 'Male' ? 'bg-[#4285F4] text-white shadow-sm' : 'text-[#A0AEC0]'}`}
              >
                Male
              </button>
              <button 
                onClick={() => setProfileData({...profileData, gender: 'Female'})}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${profileData.gender === 'Female' ? 'bg-[#4285F4] text-white shadow-sm' : 'text-[#A0AEC0]'}`}
              >
                Female
              </button>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Full Name"
                className="w-full p-3.5 border border-[#EDF2F7] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              />
              <input
                placeholder="Enter Age"
                type="number"
                className="w-full p-3.5 border border-[#EDF2F7] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={profileData.age}
                onChange={(e) => setProfileData({...profileData, age: e.target.value})}
              />
              <input
                placeholder="Email Address"
                type="email"
                className="w-full p-3.5 border border-[#EDF2F7] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              />
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="bg-[#4285F4] text-white w-full py-4 rounded-xl font-bold mt-8 shadow-md hover:bg-blue-600 transition-all"
            >
              {loading ? "Saving..." : "Save & Finish"}
            </button>
          </div>
        )}

        {/* Error Messages */}
        {message && (
          <p className="text-[12px] mt-4 text-red-500 text-center font-medium bg-red-50 p-2 rounded-lg border border-red-100">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;