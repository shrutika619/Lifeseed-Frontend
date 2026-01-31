"use client";
import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import {toast} from "sonner";
import {sendClinicOtp, submitClinicForm} from "@/app/services/clinic-auth.service"; // ADDED: useRouter for navigation

const JoinNowPage = () => {
  const router = useRouter(); // ADDED: Initialize router
  const [formData, setFormData] = useState({
    hospitalName: "",
    officialCallingNumber: "",
    hospitalEmailID: "",
    areaNameOnly: "",
    hospitalInfo: "",
    cityNameOnly: "",
    hospitalDescription: "",
    fullAddress: "",
    googleMapsLink: "",
    ownerName: "",
    ownerContactNumber: "",
    contactPersonName: "",
    contactPersonEmail: "",
    attendantName: "",
    attendantNumber: "",
    finalOtpMobile: "",
  });

  const [ownerProfilePhoto, setOwnerProfilePhoto] = useState(null);
  const [hospitalInteriorPhoto, setHospitalInteriorPhoto] = useState(null);
  const [hospitalFrontPhoto, setHospitalFrontPhoto] = useState(null);
  const [doctorClaimPhoto, setDoctorClaimPhoto] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [finalOtpSent, setFinalOtpSent] = useState(false);
  const [finalOtp, setFinalOtp] = useState("");
  const [showReviewPage, setShowReviewPage] = useState(false);

  /* ---------------- PREFILL MOBILE FROM LOCAL STORAGE ---------------- */
  useEffect(() => {
    const savedMobile = localStorage.getItem("clinic_mobile");
    if (savedMobile) {
      setFormData((prev) => ({
        ...prev,
        finalOtpMobile: savedMobile,
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) setter(file);
  };

  /* ---------------- SEND FINAL OTP ---------------- */
  const handleGetFinalOTP = async () => {
    const mobile = formData.finalOtpMobile;

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    // setLoading(true);
    try {
      await sendClinicOtp(mobile);
      toast.success(`OTP sent successfully to +91${mobile}`);
      setFinalOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      // setLoading(false);
    }
  };

  /* ---------------- SUBMIT FORM ---------------- */
  const handleFormSubmit = async () => {
    if (!acceptedTerms) {
      toast.error("Please accept Terms & Conditions");
      return;
    }

    if (!finalOtpSent || finalOtp.length !== 6) {
      toast.error("Please verify OTP");
      return;
    }

    const fd = new FormData();

    fd.append("mobileNo", formData.finalOtpMobile);
    fd.append("otp", finalOtp);
    fd.append("clinicName", formData.hospitalName);
    fd.append("city", formData.cityNameOnly);
    fd.append("clinicDescription", formData.hospitalDescription);

    fd.append("officeCallingNo", formData.officialCallingNumber);
    fd.append("clinicEmail", formData.hospitalEmailID);
    fd.append("areaName", formData.areaNameOnly);
    fd.append("clinicInfo", formData.hospitalInfo);
    fd.append("fulladdress", formData.fullAddress);
    fd.append("googleMapsLink", formData.googleMapsLink);

    fd.append("ownerName", formData.ownerName);
    fd.append("ownerContactNo", formData.ownerContactNumber);
    fd.append("contactPersonName", formData.contactPersonName);
    fd.append("contactPersonEmail", formData.contactPersonEmail);
    fd.append("attendantName", formData.attendantName);
    fd.append("attendantNumber", formData.attendantNumber);

    fd.append("termsAndConditions", acceptedTerms);

    if (ownerProfilePhoto)
      fd.append("ownerProfilePhoto", ownerProfilePhoto);

    if (hospitalFrontPhoto)
      fd.append("clinicfrontPhoto", hospitalFrontPhoto);

    if (hospitalInteriorPhoto)
      fd.append("clinicinteriorPhoto", hospitalInteriorPhoto);

    if (doctorClaimPhoto)
      fd.append("doctorCabinPhoto", doctorClaimPhoto);


    // setLoading(true);
    try {
      const res = await submitClinicForm(fd);
      toast.success(res.message);
      router.push("/reviewform");
    } catch (err) {
      toast.error(err.response?.data?.message || "Form submission failed");
    } finally {
      // setLoading(false);
    }
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  // If review page should be shown, render it
  if (showReviewPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-blue-600">MEN10</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Registration Under Review
            </h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Thank you for submitting your details. Our team is now manually reviewing your application.
            </p>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-blue-700 font-medium">
                This process usually takes about 1-5 working days.
              </p>
            </div>

            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              You will receive an email and SMS notification on your registered contact details once the review is complete. Please check your inbox (and spam folder).
            </p>

            <button 
              onClick={handleBackToHome}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Join Now – Hospital Registration
      </h1>

      {/* ---------- Hospital Details ---------- */}
      <div>
        <h3 className="text-xl font-bold mb-6 text-gray-800">
          Hospital Details
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Hospital Name"
            name="hospitalName"
            placeholder="Meditrina Hospital"
            value={formData.hospitalName}
            onChange={handleInputChange}
          />
          <InputField
            label="Official Calling Number"
            name="officialCallingNumber"
            placeholder="+91 XXXX-XXX-XXX"
            value={formData.officialCallingNumber}
            onChange={handleInputChange}
          />
          <InputField
            label="Hospital Email ID"
            type="email"
            name="hospitalEmailID"
            placeholder="hospital@email.com"
            value={formData.hospitalEmailID}
            onChange={handleInputChange}
          />
          <InputField
            label="Area Name Only"
            name="areaNameOnly"
            placeholder="Kothrud"
            value={formData.areaNameOnly}
            onChange={handleInputChange}
          />
          <InputField
            label="Hospital Info"
            name="hospitalInfo"
            placeholder="e.g., Multi-specialty hospital"
            value={formData.hospitalInfo}
            onChange={handleInputChange}
          />
          <InputField
            label="City Name Only"
            name="cityNameOnly"
            placeholder="Pune"
            value={formData.cityNameOnly}
            onChange={handleInputChange}
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hospital Description
          </label>
          <textarea
            name="hospitalDescription"
            placeholder="Enter complete hospital description"
            value={formData.hospitalDescription}
            onChange={handleInputChange}
            rows={4}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full resize-none focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Address
          </label>
          <textarea
            name="fullAddress"
            placeholder="Enter complete hospital address"
            value={formData.fullAddress}
            onChange={handleInputChange}
            rows={3}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full resize-none focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Maps Link
          </label>
          <input
            type="url"
            name="googleMapsLink"
            placeholder="https://maps.app.goo.gl/..."
            value={formData.googleMapsLink}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* ---------- Media & Verification ---------- */}
      <div>
        <h3 className="text-xl font-bold mb-6 text-gray-800">
          Media & Verification
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <FileInput label="Owner's Profile Photo" setter={setOwnerProfilePhoto} />
          <FileInput label="Hospital Front Photo" setter={setHospitalFrontPhoto} />
          <FileInput label="Hospital Interior Photo" setter={setHospitalInteriorPhoto} />
          <FileInput label="Doctor's Cabin Photo" setter={setDoctorClaimPhoto} />
        </div>

        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms(!acceptedTerms)}
            className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
          />
          <label className="ml-2 text-sm text-gray-600">
            I accept the{" "}
            <a href="#" className="text-blue-500 underline">
              Terms and Conditions
            </a>{" "}
            for partnering with MEN10.
          </label>
        </div>
      </div>

      {/* ---------- Final OTP Verification ---------- */}
      <div>
        <h3 className="text-xl font-bold mb-6 text-gray-800">
          Final Step: Verification
        </h3>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Person Number (for OTP)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Please provide the mobile number to receive a verification OTP.
          </p>

          <div className="flex gap-3 mb-4">
            <input
              type="tel"
              name="finalOtpMobile"
              placeholder="10-digit number"
              value={formData.finalOtpMobile}
              onChange={handleInputChange}
              maxLength={10}
              disabled={finalOtpSent}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={handleGetFinalOTP}
              disabled={finalOtpSent}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium text-white ${
                finalOtpSent
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Get OTP
            </button>
          </div>

          {finalOtpSent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Enter the 6-digit code sent to your mobile number.
              </p>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={finalOtp[index] || ""}
                    onChange={(e) => {
                      const newOtp = finalOtp.split("");
                      newOtp[index] = e.target.value;
                      setFinalOtp(newOtp.join(""));
                      if (e.target.value && index < 5) {
                        const nextInput = e.target.nextElementSibling;
                        if (nextInput) nextInput.focus();
                      }
                    }}
                    className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleFormSubmit}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Register Hospital
      </button>
    </div>
  );
};

/* ---------- Helper Components ---------- */
const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      {...props}
      className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
    />
  </div>
);

const FileInput = ({ label, setter }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) setter(file);
      }}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
    />
  </div>
);

export default JoinNowPage;