"use client";
import React, { useState, useRef, useEffect } from "react";
import { Bell, UserCircle, ArrowLeft, Menu } from "lucide-react";
import { useRouter } from "next/navigation"; // ✅ Import router

function AddTeamPage() {
  const router = useRouter(); // ✅ Initialize router

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    address: "",
    teamRole: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const confirmPasswordRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  useEffect(() => {
    if (formData.password.length >= 6) {
      confirmPasswordRef.current?.focus();
    }
  }, [formData.password]);

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "fullName",
      "email",
      "mobile",
      "password",
      "confirmPassword",
      "address",
      "teamRole",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field] || !formData[field].trim()) {
        newErrors[field] = "This field is required.";
      }
    });
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    console.log("Submitting Data:", formData);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Team member updated successfully!");
      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        address: "",
        teamRole: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error updating team member:", error);
      alert("Failed to update team member. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  // ✅ Redirect to /teamrole page
  const handleTeamRoleClick = () => {
    router.push("/teamrole");
  };

  const InputField = React.forwardRef(
    (
      {
        label,
        name,
        type = "text",
        fullWidth = true,
        rows = 1,
        onKeyPress,
        onChange: customOnChange,
        ...props
      },
      ref
    ) => (
      <div
        className={`flex flex-col ${
          fullWidth ? "col-span-12" : "col-span-12 sm:col-span-1"
        }`}
      >
        <label
          htmlFor={name}
          className="text-xs font-semibold uppercase text-gray-500 mb-2"
        >
          {label}
        </label>
        {rows > 1 ? (
          <textarea
            id={name}
            name={name}
            rows={rows}
            value={formData[name]}
            onChange={customOnChange || handleChange}
            onKeyPress={onKeyPress}
            ref={ref}
            autoComplete="off"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ${
              errors[name] ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={label}
            {...props}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={formData[name]}
            onChange={customOnChange || handleChange}
            onKeyPress={onKeyPress}
            ref={ref}
            autoComplete="off"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ${
              errors[name] ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={label}
            {...props}
          />
        )}
        {errors[name] && (
          <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
        )}
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-inter">
      {/* Header */}
      <header className="flex justify-between items-center pb-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition duration-150"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Update Team
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 text-xs text-white justify-center items-center">
                <span className="absolute -top-1 right-0 text-[10px] font-bold">
                  10
                </span>
              </span>
            </span>
          </div>
          <UserCircle className="w-8 h-8 text-gray-500 cursor-pointer" />
        </div>
      </header>

      {/* Form */}
      <div className="bg-white mt-6 p-4 sm:p-8 rounded-xl shadow-lg border border-gray-100 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="FULL NAME" name="fullName" fullWidth={false} />
            <InputField label="EMAIL" name="email" type="email" fullWidth={false} />
            <InputField label="MOBILE" name="mobile" type="tel" fullWidth={false} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="PASSWORD"
              name="password"
              type="password"
              fullWidth={false}
              autoComplete="new-password"
              onKeyPress={(e) => {
                if (e.key === "Enter") confirmPasswordRef.current?.focus();
              }}
            />
            <InputField
              label="CONFIRM PASSWORD"
              name="confirmPassword"
              type="password"
              fullWidth={false}
              ref={confirmPasswordRef}
              autoComplete="new-password"
            />
          </div>

          <InputField label="ADDRESS" name="address" rows={4} fullWidth={true} />
          <InputField label="TEAM ROLE" name="teamRole" fullWidth={true} />

          <div className="pt-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 
                      0 0 5.373 0 12h4zm2 
                      5.291A7.962 7.962 0 014 12H0c0 
                      3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <span>Update</span>
              )}
            </button>

            {/* ✅ Team Role Button now redirects */}
            <button
              type="button"
              onClick={handleTeamRoleClick}
              className="flex items-center justify-center space-x-2 px-6 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded-lg shadow-sm hover:bg-indigo-50 transition duration-150"
            >
              <Menu className="w-5 h-5" />
              <span>Team Role</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTeamPage;
