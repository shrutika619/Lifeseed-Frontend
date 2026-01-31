"use client";
import React, { useState, useEffect } from "react";
// ❌ Removed useRouter from LoginModal to prevent redirects
import { useRouter } from "next/navigation"; 
import { toast } from "sonner";

// ✅ Services
import { sendLoginOtp, verifyLoginOtp } from "@/app/services/auth.service"; 
import { getConcerns, getQuestions, submitAssessment, getMyAssessment } from "@/app/services/assesment.service";

// ✅ Redux
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated, setCredentials } from "@/redux/slices/authSlice"; 
import { useAssessment } from "@/app/hooks/useAssessment"; 

// =================== Login Modal (Pure Logic, No Redirects) ===================
const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("send");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const dispatch = useDispatch(); 

  const isValidPhone = (num) => /^[6-9]\d{9}$/.test(num);

  const sendOtp = async () => {
    if (!isValidPhone(phone)) {
      setMessage("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      const res = await sendLoginOtp(phone);
      if (res.success === false) {
          setMessage(res.message);
      } else {
          setMessage("");
          toast.success("OTP sent!");
          setStep("verify");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setMessage("Enter valid 6-digit OTP");
      return;
    }
    setLoading(true);
    setMessage(""); 

    try {
      // 1. Call Service (Proxy sets HTTP-Only Cookie)
      const data = await verifyLoginOtp(phone, otp);
      const { accessToken, user } = data;
      
      if (!accessToken) throw new Error("Access Token missing");

      // 2. Update Redux (So api.js can see the token immediately)
      dispatch(setCredentials({ accessToken, user }));
      toast.success("Login successful!");

      // 3. Trigger Success Callback (This submits the form)
      // 🛑 NO REDIRECTS HERE
      onLoginSuccess(); 

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md mx-4 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">×</button>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Login Required 🔒</h3>
        <p className="text-gray-600 mb-6">Please login to calculate and view your assessment results.</p>

        {step === "send" ? (
          <>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Mobile Number" className="border-2 border-gray-300 p-3 w-full mb-3 rounded-lg" maxLength={10} />
            <button onClick={sendOtp} disabled={loading} className="bg-blue-600 text-white px-4 py-3 w-full rounded-lg font-semibold">{loading ? "Sending..." : "Send OTP"}</button>
          </>
        ) : (
          <>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" className="border-2 border-gray-300 p-3 w-full mb-3 rounded-lg" maxLength={6} />
            <button onClick={verifyOtp} disabled={loading} className="bg-green-600 text-white px-4 py-3 w-full rounded-lg font-semibold">{loading ? "Verifying..." : "Verify OTP"}</button>
            <p onClick={() => setStep("send")} className="mt-3 text-blue-600 cursor-pointer text-center text-sm">Resend OTP</p>
          </>
        )}
        {message && <p className="mt-3 text-center text-sm text-gray-700 bg-gray-100 p-2 rounded">{message}</p>}
      </div>
    </div>
  );
};

// =================== Assessment Component ===================
const Assessment = () => {
  const router = useRouter(); 
  const isLoggedIn = useSelector(selectIsAuthenticated); 

  const { 
    gender, selectedConditions, answers, 
    results, showResults, showQuestions,
    setGender, toggleCondition, setAnswer, 
    setShowQuestions, setResults, 
    hydrateFromBackend, resetAssessment 
  } = useAssessment();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [availableConcerns, setAvailableConcerns] = useState([]);
  const [questionsDb, setQuestionsDb] = useState({}); 
  const [loading, setLoading] = useState(false);

  // Sync State Logic
  useEffect(() => {
    const handleAuthStateChange = async () => {
      // 1. Logged Out -> Reset Form
      if (!isLoggedIn) {
        resetAssessment(); 
        return;
      }

      // 2. Logged In
      if (isLoggedIn) {
        // 🛑 CRITICAL: If user already has selected conditions (local state), 
        // DO NOT fetch from backend. Keep local answers so we can submit them.
        if (selectedConditions.length > 0) {
            return; 
        }

        // Only fetch history if the form is empty (fresh login from dashboard)
        try {
          const res = await getMyAssessment(); 
          if (res.success && res.data) {
             const { gender, selectedConcerns, scores } = res.data;
             const formattedResults = Object.keys(scores || {}).map(condition => {
                const score = scores[condition];
                let severity = "Low";
                let color = "bg-green-100 text-green-800";
                if (score > 6) { severity = "High"; color = "bg-red-100 text-red-800"; }
                else if (score > 3) { severity = "Medium"; color = "bg-yellow-100 text-yellow-800"; }
                return { condition, score, severity, color };
             });

             hydrateFromBackend({
                gender,
                selectedConcerns,
                uiResults: formattedResults
             });
          }
        } catch (error) {
          console.error("Error syncing state:", error);
        }
      }
    };

    handleAuthStateChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]); 


  // Fetch Concerns
  useEffect(() => {
    const fetchConcerns = async () => {
        if(gender) {
            const result = await getConcerns(gender);
            if (result.success) setAvailableConcerns(result.data.concerns);
        }
    };
    fetchConcerns();
  }, [gender]);

  const handleConditionToggle = (cond) => toggleCondition(cond);
  const handleAnswer = (condition, index, value) => setAnswer(condition, index, value);

  const handleGenderSelect = async (selectedGender) => {
    setLoading(true);
    const result = await getConcerns(selectedGender);
    if (result.success) {
      setAvailableConcerns(result.data.concerns);
      setGender(selectedGender); 
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleFetchQuestions = async () => {
    if (selectedConditions.length === 0) {
      alert("Please select at least one concern"); 
      return;
    }
    setLoading(true);
    const result = await getQuestions(gender, selectedConditions);
    if (result.success) {
      setQuestionsDb(result.data); 
      setShowQuestions(true); 
    }
    setLoading(false);
  };
  
  const handleCalculateClick = async () => {
    if (isLoggedIn) {
      await handleSubmitAssessment(); 
    } else {
      setShowLoginModal(true);
    }
  };

  const handleSubmitAssessment = async () => { 
    setLoading(true);
  
    const formattedAnswers = {};
    selectedConditions.forEach(concern => {
      const conditionAnswers = answers[concern] || {};
      Object.keys(conditionAnswers).forEach(idx => {
        const val = conditionAnswers[idx] === 2 ? "Yes" : "No";
        formattedAnswers[`${concern}_${idx}`] = val;
      });
    }); 

    // API Call (Interceptor attaches token from Redux)
    const result = await submitAssessment(gender, selectedConditions, formattedAnswers);

    if (result.success) {
        const backendScores = result.data.assessment.scores;
        const newResults = Object.keys(backendScores).map(condition => {
            const score = backendScores[condition];
            let severity = "Low";
            let color = "bg-green-100 text-green-800";
            if (score > 6) { severity = "High"; color = "bg-red-100 text-red-800"; }
            else if (score > 3) { severity = "Medium"; color = "bg-yellow-100 text-yellow-800"; }
            return { condition, score, severity, color };
        });
        setResults(newResults); 
    } else {
        if (result.requireLogin) {
            setShowLoginModal(true); 
        } else {
            toast.error(result.message || "Calculation failed");
        }
    }
    setLoading(false);
  };

  // ✅ HANDLER: Closes modal and submits immediately
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    handleSubmitAssessment(); 
  };
  
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10 max-w-3xl mx-auto">
      
      {/* 1. GENDER SELECTION */}
      {!gender && (
         <div className="text-center">
           <h2 className="text-2xl font-bold">First, what is your gender?</h2>
           <div className="mt-6 space-y-3 max-w-xs mx-auto">
             {["male", "female"].map((g) => (
               <button key={g} onClick={() => handleGenderSelect(g)} className="w-full border-2 border-gray-200 p-3 rounded-lg hover:border-blue-500 transition">
                 {g.charAt(0).toUpperCase() + g.slice(1)}
               </button>
             ))}
           </div>
         </div>
      )}

      {/* 2. CONDITIONS SELECTION */}
      {gender && !showQuestions && (
        <div className="mt-8">
           <h2 className="text-xl font-bold text-center">What are your primary concerns?</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
             {availableConcerns.map((cond) => (
               <button 
                 key={cond} 
                 onClick={() => handleConditionToggle(cond)} 
                 className={`border-2 p-4 rounded-lg text-center transition 
                   ${selectedConditions.includes(cond) ? "border-blue-600 bg-blue-50 font-semibold" : "border-gray-200 hover:border-blue-400"}
                 `}
               >
                 {cond}
               </button>
             ))}
           </div>
           
           {!showResults && (
             <div className="text-center mt-8">
               <button onClick={handleFetchQuestions} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
                 Next →
               </button>
             </div>
           )}
        </div>
      )}

      {/* 3. QUESTIONS VIEW */}
      {showQuestions && selectedConditions.length > 0 && (
        <QuestionsView 
           selectedConditions={selectedConditions} 
           questionsDb={questionsDb} 
           answers={answers}
           onAnswer={handleAnswer}
           onBack={() => setShowQuestions(false)} 
           onSubmit={handleCalculateClick}
           loading={loading}
           onRefreshNeeded={handleFetchQuestions}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />
      )}

      {/* 4. RESULTS VIEW */}
      {showResults && (
        <div className="mt-10 space-y-6">
          <h2 className="text-2xl font-bold text-center">Your Assessment Results</h2>
          {results.map((r) => (
            <div key={r.condition} className="border p-5 rounded-xl bg-white shadow text-left">
              <div className="flex justify-between">
                <h4 className="font-bold text-gray-800">{r.condition}</h4>
                <span className="text-blue-600 font-bold">{r.score}/10</span>
              </div>
              <p className="mt-2">
                Concern Level: <span className={`${r.color} px-2 py-1 rounded-full text-sm`}>{r.severity}</span>
              </p>
            </div>
          ))}
          <div className="text-center mt-6">
            <button 
                onClick={() => setShowQuestions(true)} 
                className="bg-gray-200 text-gray-800 py-2 px-5 rounded-lg font-medium"
            >
                ← Back to Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for Questions
const QuestionsView = ({ selectedConditions, questionsDb, answers, onAnswer, onBack, onSubmit, loading, onRefreshNeeded }) => {
    useEffect(() => {
        const hasQuestions = selectedConditions.every(c => questionsDb[c]);
        if (!hasQuestions && selectedConditions.length > 0) {
            onRefreshNeeded();
        }
    }, []);

    return (
        <div className="mt-10 space-y-6">
          {selectedConditions.map((cond) => (
            <div key={cond}>
              <h3 className="text-lg font-bold text-blue-700">{cond}</h3>
              {questionsDb[cond]?.map((q, i) => (
                <div key={i} className="mt-3 p-4 border rounded-lg bg-gray-50 space-y-2">
                  <p className="font-medium">{q}</p>
                  <div className="flex space-x-4">
                    <button onClick={() => onAnswer(cond, i, 2)} className={`flex-1 border-2 p-2 rounded-lg transition ${answers[cond]?.[i] === 2 ? "bg-blue-100 border-blue-600" : "border-gray-200 hover:border-blue-400"}`}>Yes</button>
                    <button onClick={() => onAnswer(cond, i, 0)} className={`flex-1 border-2 p-2 rounded-lg transition ${answers[cond]?.[i] === 0 ? "bg-blue-100 border-blue-600" : "border-gray-200 hover:border-blue-400"}`}>No</button>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <button onClick={onBack} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium">← Back</button>
            <button
              onClick={onSubmit}
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {loading ? "Calculating..." : "Calculate My Score"}
            </button>
          </div>
        </div>
    );
}

const SecondHomePage = () => {
  const { isStarted, startAssessment } = useAssessment();

  return (
    <div className="flex items-center justify-center py-14 w-full bg-gray-50">
      {!isStarted ? (
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">Confidential Wellness Assessment 🔒</h2>
          <p className="text-sm text-gray-600 mb-6">This 2-minute assessment will help you understand your sexual health better. Your responses are 100% private.</p>
          <button onClick={startAssessment} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-5 rounded-md transition duration-200">Let's Begin</button>
        </div>
      ) : (
        <Assessment />
      )}
    </div>
  );
};

export default SecondHomePage;