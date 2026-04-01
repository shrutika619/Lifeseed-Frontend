"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { toast } from "sonner";

import { sendLoginOtp, verifyLoginOtp } from "@/app/services/auth/auth.service"; 
import { getConcerns, getQuestions, submitAssessment, getMyAssessment } from "@/app/services/patient/assesment.service";

import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated, setCredentials } from "@/redux/slices/authSlice"; 
import { useAssessment } from "@/app/hooks/useAssessment"; 

// =================== Login Modal ===================
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
      const data = await verifyLoginOtp(phone, otp);
      const { accessToken, user } = data;
      
      if (!accessToken) throw new Error("Access Token missing");

      dispatch(setCredentials({ accessToken, user }));
      toast.success("Login successful!");
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

// =================== Lifeseed Fertility Assessment Questions ===================
const lifeseedQuestions = {
  // ---------- MALE ----------
  "Erectile Dysfunction": [
    "Do you have difficulty achieving or maintaining an erection during sexual activity?",
    "Has this problem been present for more than 3 months?",
    "Do you experience early morning or nocturnal erections?",
    "Do you have conditions like diabetes, hypertension, or heart disease?",
    "Do you feel anxious or stressed during sexual activity?",
  ],
  "Premature Ejaculation": [
    "Do you ejaculate within 1–2 minutes of penetration?",
    "Do you feel you have little or no control over when you ejaculate?",
    "Does this cause distress or affect your relationship?",
    "Has this been a consistent issue for the past 6 months?",
    "Do you experience performance anxiety before intercourse?",
  ],
  "Delayed Ejaculation": [
    "Do you take more than 30 minutes to ejaculate during intercourse?",
    "Are you sometimes unable to ejaculate at all during sex?",
    "Does this issue cause frustration or distress to you or your partner?",
    "Do you have no trouble ejaculating during masturbation but struggle during sex?",
    "Are you on any medications like antidepressants or blood pressure drugs?",
  ],
  "Low Sperm Count": [
    "Have you been trying to conceive for more than 12 months without success?",
    "Have you had a semen analysis done? If yes, was the count below normal?",
    "Do you have a history of mumps, testicular infection, or injury?",
    "Do you experience pain or swelling around the testicles?",
    "Are you exposed to high heat, radiation, or chemicals regularly?",
  ],
  "Couple Sex Problems": [
    "Do you and your partner frequently experience conflict around sexual intimacy?",
    "Has your sexual frequency significantly decreased in the past 6 months?",
    "Do either of you avoid sexual activity due to fear, pain, or past trauma?",
    "Do you feel emotionally disconnected from your partner during sex?",
    "Have you both discussed your sexual concerns with each other openly?",
  ],
  "Sexual Dysfunction": [
    "Do you experience a persistent lack of interest in sexual activity?",
    "Do you have pain during or after sexual intercourse?",
    "Do you feel your sexual health has impacted your relationship or mental health?",
    "Have you noticed changes in your libido in the past 3–6 months?",
    "Have you previously sought treatment for any sexual health concern?",
  ],

  // ---------- FEMALE ----------
  "Hormonal Imbalance": [
    "Do you experience irregular or missed menstrual cycles?",
    "Do you have symptoms like acne, excess facial/body hair, or hair thinning?",
    "Have you been diagnosed with PCOS or thyroid disorder?",
    "Do you experience mood swings, fatigue, or unexplained weight changes?",
    "Have you had difficulty conceiving despite regular unprotected intercourse?",
  ],
  "Fertility Issues": [
    "Have you been trying to conceive for over 12 months without success?",
    "Do you have a history of miscarriage or failed IVF cycles?",
    "Have you ever been diagnosed with endometriosis or blocked fallopian tubes?",
    "Do you experience irregular ovulation or were told you have low AMH levels?",
    "Are you over 35 years of age and trying to conceive?",
  ],
  "Menstrual Disorders": [
    "Do you experience very heavy or prolonged bleeding during periods?",
    "Do you have severe pain (dysmenorrhea) during your menstrual cycle?",
    "Are your periods irregular, absent, or very infrequent?",
    "Do you experience spotting between periods or after intercourse?",
    "Has your menstrual pattern changed significantly in the past 6 months?",
  ],
  "Sexual Pain (Dyspareunia)": [
    "Do you experience pain during or after sexual intercourse?",
    "Is the pain located at the entry point, deep inside, or both?",
    "Do you experience vaginal dryness or insufficient lubrication?",
    "Has the pain been present for more than 3 months?",
    "Does the pain affect your desire or ability to have sex?",
  ],

  // ---------- SHARED (Male & Female) ----------
  "Couples Counseling": [
    "Are you and your partner struggling to communicate about fertility treatment?",
    "Do you feel emotionally unsupported during your fertility journey?",
    "Has infertility caused significant stress or conflict in your relationship?",
    "Do either of you feel guilty or blamed for the fertility challenges?",
    "Would you consider counseling to better cope with the emotional impact of IVF?",
  ],
  "Fertility Counseling": [
    "Do you feel overwhelmed or anxious about starting fertility treatment?",
    "Have you had a previous failed fertility treatment or miscarriage?",
    "Do you need guidance on IVF, IUI, or other assisted reproductive techniques?",
    "Are you unsure about the emotional and physical demands of fertility treatment?",
    "Would you like support in making informed decisions about your fertility options?",
  ],
  "Lifestyle Advice": [
    "Do you smoke, consume alcohol, or use recreational drugs?",
    "Is your BMI outside the healthy range (18.5–24.9)?",
    "Do you follow a balanced diet and exercise regularly?",
    "Are you under high levels of stress in your personal or professional life?",
    "Have you been advised by a doctor to make lifestyle changes to improve fertility?",
  ],
  "Oocyte Donation": [
    "Have you been told your egg quality or reserve is too low to conceive naturally?",
    "Are you above 40 years of age and considering egg donation?",
    "Have you had multiple failed IVF cycles using your own eggs?",
    "Do you carry a genetic condition you do not want to pass on?",
    "Have you discussed oocyte donation as an option with your fertility specialist?",
  ],
  "Semen Banking and Supply": [
    "Are you planning to undergo chemotherapy, radiation, or surgery that may affect fertility?",
    "Do you wish to preserve your sperm before a vasectomy?",
    "Have you been advised to bank sperm due to low count or quality?",
    "Are you considering donor sperm for assisted reproduction?",
    "Do you have a condition that may cause future fertility decline?",
  ],
  "Medico Legal Support": [
    "Do you need legal documentation for a surrogacy or donor arrangement?",
    "Are you seeking clarity on consent forms or patient rights in fertility treatment?",
    "Have you faced any dispute or complication related to your IVF procedure?",
    "Do you require legal guidance on egg/sperm donor agreements?",
    "Are you aware of the legal requirements for fertility treatments in India?",
  ],
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

  useEffect(() => {
    const handleAuthStateChange = async () => {
      if (!isLoggedIn) {
        resetAssessment(); 
        return;
      }

      if (isLoggedIn) {
        if (selectedConditions.length > 0) {
            return; 
        }

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
    if (result.success && result.data && Object.keys(result.data).length > 0) {
      setQuestionsDb(result.data); 
    } else {
      // ✅ Fallback to Lifeseed hardcoded questions if backend returns empty
      const fallback = {};
      selectedConditions.forEach((cond) => {
        if (lifeseedQuestions[cond]) {
          fallback[cond] = lifeseedQuestions[cond];
        }
      });
      setQuestionsDb(fallback);
    }
    setShowQuestions(true); 
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
};

const SecondHomePage = () => {
  const { isStarted, startAssessment } = useAssessment();

  useEffect(() => {
    if (window.location.hash === "#assessment") {
      const el = document.getElementById("assessment");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 200);
      }
    }
  }, []);

  return (
    <div
      id="assessment"
      className="flex items-center justify-center py-14 w-full bg-gray-50">
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