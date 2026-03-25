"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { sendClinicOtp, submitClinicForm } from "@/app/services/auth/clinic-auth.service";
import { getAllCities } from "@/app/services/patient/clinic.service";

const JoinNowPage = () => {
  const router = useRouter();

  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    hospitalName: "",
    officialCallingNumber: "",
    hospitalEmailID: "",
    areaNameOnly: "",
    hospitalInfo: "",
    city: "",
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

  const [errors, setErrors] = useState({});

  const [ownerProfilePhoto, setOwnerProfilePhoto] = useState(null);
  const [hospitalInteriorPhoto, setHospitalInteriorPhoto] = useState(null);
  const [hospitalFrontPhoto, setHospitalFrontPhoto] = useState(null);
  const [doctorClaimPhoto, setDoctorClaimPhoto] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [finalOtpSent, setFinalOtpSent] = useState(false);
  const [finalOtp, setFinalOtp] = useState("");
  const [showReviewPage, setShowReviewPage] = useState(false);

  /* ---------------- FETCH CITIES ON MOUNT ---------------- */
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getAllCities();
        if (res.success && res.data) {
          setCities(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch cities", error);
      }
    };
    fetchCities();
  }, []);

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

  /* ---------------- FIELD-WISE VALIDATORS ---------------- */
  const validators = {
    hospitalName: (val) =>
      !val.trim() ? "Hospital name is required" : val.trim().length < 3 ? "Hospital name must be at least 3 characters" : "",

    officialCallingNumber: (val) =>
      !val.trim() ? "Official calling number is required" : !/^[6-9]\d{9}$/.test(val.replace(/\s|-|\+91/g, "")) ? "Enter a valid 10-digit calling number" : "",

    hospitalEmailID: (val) =>
      !val.trim() ? "Hospital email is required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "Enter a valid email address" : "",

    areaNameOnly: (val) =>
      !val.trim() ? "Area name is required" : "",

    hospitalInfo: (val) =>
      !val.trim() ? "Hospital info is required" : "",

    city: (val) =>
      !val ? "Please select a city" : "",

    hospitalDescription: (val) =>
      !val.trim() ? "Hospital description is required" : val.trim().length < 10 ? "Description must be at least 10 characters" : "",

    fullAddress: (val) =>
      !val.trim() ? "Full address is required" : val.trim().length < 10 ? "Please enter a complete address" : "",

    googleMapsLink: (val) =>
      val.trim() && !/^https?:\/\/.+/.test(val.trim()) ? "Enter a valid URL starting with http:// or https://" : "",

    ownerName: (val) =>
      !val.trim() ? "Owner name is required" : !/^[a-zA-Z\s]+$/.test(val.trim()) ? "Owner name must contain only letters" : "",

    ownerContactNumber: (val) =>
      !val.trim() ? "Owner contact number is required" : !/^[6-9]\d{9}$/.test(val) ? "Enter a valid 10-digit mobile number" : "",

    contactPersonName: (val) =>
      !val.trim() ? "Contact person name is required" : !/^[a-zA-Z\s]+$/.test(val.trim()) ? "Contact person name must contain only letters" : "",

    contactPersonEmail: (val) =>
      !val.trim() ? "Contact person email is required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "Enter a valid email address" : "",

    attendantName: (val) =>
      !val.trim() ? "Attendant name is required" : !/^[a-zA-Z\s]+$/.test(val.trim()) ? "Attendant name must contain only letters" : "",

    attendantNumber: (val) =>
      !val.trim() ? "Attendant number is required" : !/^[6-9]\d{9}$/.test(val) ? "Enter a valid 10-digit mobile number" : "",

    finalOtpMobile: (val) =>
      !val.trim() ? "Mobile number is required" : !/^[6-9]\d{9}$/.test(val) ? "Enter a valid 10-digit mobile number" : "",
  };

  /* ---------------- VALIDATE SINGLE FIELD ON BLUR ---------------- */
  const validateField = (name, value) => {
    if (validators[name]) {
      const error = validators[name](value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  /* ---------------- VALIDATE ALL FIELDS ---------------- */
  const validateAll = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validators).forEach((field) => {
      const value = formData[field] ?? "";
      const error = validators[field](value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    if (!ownerProfilePhoto) {
      newErrors.ownerProfilePhoto = "Owner's profile photo is required";
      isValid = false;
    }
    if (!hospitalFrontPhoto) {
      newErrors.hospitalFrontPhoto = "Hospital front photo is required";
      isValid = false;
    }
    if (!hospitalInteriorPhoto) {
      newErrors.hospitalInteriorPhoto = "Hospital interior photo is required";
      isValid = false;
    }
    if (!doctorClaimPhoto) {
      newErrors.doctorClaimPhoto = "Doctor's cabin photo is required";
      isValid = false;
    }

    if (!acceptedTerms) {
      newErrors.acceptedTerms = "You must accept the Terms & Conditions";
      isValid = false;
    }

    if (!finalOtpSent) {
      newErrors.finalOtpVerification = "Please send and verify the OTP";
      isValid = false;
    } else if (finalOtp.length !== 6) {
      newErrors.finalOtpVerification = "Please enter the complete 6-digit OTP";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /* ---------------- PHONE NUMBER ONLY DIGITS, MAX 10 ---------------- */
  const handlePhoneInput = (e) => {
    const { name, value } = e.target;
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleFileChange = (e, setter, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  /* ---------------- SEND FINAL OTP ---------------- */
  const handleGetFinalOTP = async () => {
    const mobile = formData.finalOtpMobile;
    const error = validators.finalOtpMobile(mobile);
    if (error) {
      setErrors((prev) => ({ ...prev, finalOtpMobile: error }));
      return;
    }

    try {
      await sendClinicOtp(mobile);
      toast.success(`OTP sent successfully to +91${mobile}`);
      setFinalOtpSent(true);
      setErrors((prev) => ({ ...prev, finalOtpMobile: "", finalOtpVerification: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  /* ---------------- SUBMIT FORM ---------------- */
  const handleFormSubmit = async () => {
    const isValid = validateAll();

    if (!isValid) {
      toast.error("Please fix all errors before submitting");
      const firstErrorEl = document.querySelector(".border-red-400");
      if (firstErrorEl) firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const fd = new FormData();
    fd.append("mobileNo", formData.finalOtpMobile);
    fd.append("otp", finalOtp);
    fd.append("clinicName", formData.hospitalName);
    fd.append("city", formData.city);
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

    if (ownerProfilePhoto) fd.append("ownerProfilePhoto", ownerProfilePhoto);
    if (hospitalFrontPhoto) fd.append("clinicfrontPhoto", hospitalFrontPhoto);
    if (hospitalInteriorPhoto) fd.append("clinicinteriorPhoto", hospitalInteriorPhoto);
    if (doctorClaimPhoto) fd.append("doctorCabinPhoto", doctorClaimPhoto);

    try {
      const res = await submitClinicForm(fd);
      toast.success(res.message);
      localStorage.removeItem("clinic_mobile");
      setShowReviewPage(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Form submission failed");
    }
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Under Review</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Thank you for submitting your details. Our team is now manually reviewing your application.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-blue-700 font-medium">This process usually takes about 1-5 working days.</p>
            </div>
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
        <h3 className="text-xl font-bold mb-6 text-gray-800">Hospital Details</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Hospital Name"
            required
            name="hospitalName"
            placeholder="Meditrina Hospital"
            value={formData.hospitalName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={errors.hospitalName}
          />
          <InputField
            label="Official Calling Number"
            required
            name="officialCallingNumber"
            placeholder="XXXXXXXXXX"
            value={formData.officialCallingNumber}
            onChange={handlePhoneInput}
            onBlur={handleBlur}
            error={errors.officialCallingNumber}
            maxLength={10}
            inputMode="numeric"
          />
          <InputField
            label="Hospital Email ID"
            required
            type="email"
            name="hospitalEmailID"
            placeholder="hospital@email.com"
            value={formData.hospitalEmailID}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={errors.hospitalEmailID}
          />
          <InputField
            label="Area Name Only"
            required
            name="areaNameOnly"
            placeholder="Kothrud"
            value={formData.areaNameOnly}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={errors.areaNameOnly}
          />
          <InputField
            label="Hospital Info"
            required
            name="hospitalInfo"
            placeholder="e.g., Multi-specialty hospital"
            value={formData.hospitalInfo}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={errors.hospitalInfo}
          />

          {/* CITY DROPDOWN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`border rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white ${
                errors.city ? "border-red-400" : "border-gray-300"
              }`}
            >
              <option value="">Select a City</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hospital Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="hospitalDescription"
            placeholder="Enter complete hospital description"
            value={formData.hospitalDescription}
            onChange={handleInputChange}
            onBlur={handleBlur}
            rows={4}
            className={`border rounded-lg px-4 py-2.5 text-sm w-full resize-none focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none ${
              errors.hospitalDescription ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.hospitalDescription && (
            <p className="text-red-500 text-xs mt-1">{errors.hospitalDescription}</p>
          )}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="fullAddress"
            placeholder="Enter complete hospital address"
            value={formData.fullAddress}
            onChange={handleInputChange}
            onBlur={handleBlur}
            rows={3}
            className={`border rounded-lg px-4 py-2.5 text-sm w-full resize-none focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none ${
              errors.fullAddress ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.fullAddress && (
            <p className="text-red-500 text-xs mt-1">{errors.fullAddress}</p>
          )}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Maps Link
          </label>
          <input
            type="url"
            name="googleMapsLink"
            placeholder="http://googleusercontent.com/maps.google.com/..."
            value={formData.googleMapsLink}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`border rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none ${
              errors.googleMapsLink ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.googleMapsLink && (
            <p className="text-red-500 text-xs mt-1">{errors.googleMapsLink}</p>
          )}
        </div>
      </div>

      {/* ---------- Key Personnel Details ---------- */}
      <div>
        <h3 className="text-xl font-bold mb-6 text-gray-800">Key Personnel Details</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            label="Owner Name"
            required
            name="ownerName"
            placeholder="Enter owner name"
            value={formData.ownerName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={errors.ownerName}
          />
          <InputField
            label="Owner Contact Number"
            required
            name="ownerContactNumber"
            placeholder="XXXXXXXXXX"
            value={formData.ownerContactNumber}
            onChange={handlePhoneInput}
            onBlur={handleBlur}
            error={errors.ownerContactNumber}
            maxLength={10}
            inputMode="numeric"
          />
          <InputField
            label="Contact Person Name"
            required
            name="contactPersonName"
            placeholder="Enter contact person name"
            value={formData.contactPersonName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={errors.contactPersonName}
          />
          <InputField
            label="Contact Person Email ID"
            required
            type="email"
            name="contactPersonEmail"
            placeholder="person@hospital.com"
            value={formData.contactPersonEmail}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={errors.contactPersonEmail}
          />
          <InputField
            label="Attendant Name"
            required
            name="attendantName"
            placeholder="Enter attendant name"
            value={formData.attendantName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={errors.attendantName}
          />
          <InputField
            label="Attendant Number"
            required
            name="attendantNumber"
            placeholder="XXXXXXXXXX"
            value={formData.attendantNumber}
            onChange={handlePhoneInput}
            onBlur={handleBlur}
            error={errors.attendantNumber}
            maxLength={10}
            inputMode="numeric"
          />
        </div>
      </div>

      {/* ---------- Media & Verification ---------- */}
      <div>
        <h3 className="text-xl font-bold mb-6 text-gray-800">Media & Verification</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <FileInput
            label="Owner's Profile Photo"
            required
            fieldName="ownerProfilePhoto"
            setter={setOwnerProfilePhoto}
            error={errors.ownerProfilePhoto}
            onChange={handleFileChange}
          />
          <FileInput
            label="Hospital Front Photo"
            required
            fieldName="hospitalFrontPhoto"
            setter={setHospitalFrontPhoto}
            error={errors.hospitalFrontPhoto}
            onChange={handleFileChange}
          />
          <FileInput
            label="Hospital Interior Photo"
            required
            fieldName="hospitalInteriorPhoto"
            setter={setHospitalInteriorPhoto}
            error={errors.hospitalInteriorPhoto}
            onChange={handleFileChange}
          />
          <FileInput
            label="Doctor's Cabin Photo"
            required
            fieldName="doctorClaimPhoto"
            setter={setDoctorClaimPhoto}
            error={errors.doctorClaimPhoto}
            onChange={handleFileChange}
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={() => {
                setAcceptedTerms(!acceptedTerms);
                if (errors.acceptedTerms) {
                  setErrors((prev) => ({ ...prev, acceptedTerms: "" }));
                }
              }}
              className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
            />
            <label className="ml-2 text-sm text-gray-600">
              I accept the{" "}
              <a href="#" className="text-blue-500 underline">
                Terms and Conditions
              </a>{" "}
              for partnering with MEN10. <span className="text-red-500">*</span>
            </label>
          </div>
          {errors.acceptedTerms && (
            <p className="text-red-500 text-xs mt-1">{errors.acceptedTerms}</p>
          )}
        </div>
      </div>

      {/* ---------- Final OTP Verification ---------- */}
      <div>
        <h3 className="text-xl font-bold mb-6 text-gray-800">Final Step: Verification</h3>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Person Number (for OTP) <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Please provide the mobile number to receive a verification OTP.
          </p>

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <input
                type="tel"
                name="finalOtpMobile"
                placeholder="XXXXXXXXXX"
                value={formData.finalOtpMobile}
                onChange={handlePhoneInput}
                onBlur={handleBlur}
                maxLength={10}
                inputMode="numeric"
                disabled={finalOtpSent}
                className={`border rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none disabled:bg-gray-100 ${
                  errors.finalOtpMobile ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.finalOtpMobile && (
                <p className="text-red-500 text-xs mt-1">{errors.finalOtpMobile}</p>
              )}
            </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
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
                      if (errors.finalOtpVerification) {
                        setErrors((prev) => ({ ...prev, finalOtpVerification: "" }));
                      }
                      if (e.target.value && index < 5) {
                        e.target.nextElementSibling?.focus();
                      }
                    }}
                    className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                  />
                ))}
              </div>
              {errors.finalOtpVerification && (
                <p className="text-red-500 text-xs mt-2">{errors.finalOtpVerification}</p>
              )}
            </div>
          )}

          {!finalOtpSent && errors.finalOtpVerification && (
            <p className="text-red-500 text-xs mt-1">{errors.finalOtpVerification}</p>
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
const InputField = ({ label, error, onBlur, required, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      onBlur={onBlur}
      className={`border rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none ${
        error ? "border-red-400" : "border-gray-300"
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const FileInput = ({ label, setter, fieldName, error, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => onChange(e, setter, fieldName)}
      className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer ${
        error ? "border border-red-400 rounded-lg" : ""
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default JoinNowPage;