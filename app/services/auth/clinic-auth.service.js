import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

/**
 * Send OTP (Clinic Lead Gen)
 */
export const sendClinicOtp = async (mobileNo) => {
    const response = await api.post(
        Constants.urlEndPoints.CLINIC_SEND_OTP,
        { mobileNo }
    );
    return response.data;
};

/**
 * Verify OTP (Clinic Registration)
 * Note: This returns status flags like 'shouldRedirectToLogin'
 */
export const verifyClinicOtp = async (mobileNo, otp) => {
    const response = await api.post(
        Constants.urlEndPoints.CLINIC_VERIFY_OTP,
        { mobileNo, otp }
    );
    // Backend Doc: { status: 200, data: { status: 'approved', shouldRedirectToLogin: true, ... } }
    return response.data; 
};

/**
 * Submit Registration Form
 * Note: Handles Multipart Form Data
 */
export const submitClinicForm = async (formData) => {
    const res = await api.post(
        Constants.urlEndPoints.SUBMIT_CLINIC_FORM,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
    return res.data;
};