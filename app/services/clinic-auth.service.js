import api from "@/lib/axios"; // ✅ Use the new engine
import { Constants } from "@/app/utils/constants";

export const sendClinicOtp = async (mobileNo) => {
    const response = await api.post(
        Constants.urlEndPoints.CLINIC_SEND_OTP,
        { mobileNo }
    );
    return response.data;
};

export const verifyClinicOtp = async (mobileNo, otp) => {
    const response = await api.post(
        Constants.urlEndPoints.CLINIC_VERIFY_OTP,
        { mobileNo, otp }
    );
    return response.data;
};

export const submitClinicForm = async (formData) => {
    const res = await api.post(
        Constants.urlEndPoints.SUBMIT_CLINIC_FORM,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return res.data;
};