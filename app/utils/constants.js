export class Constants {
  static API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
  
  static urlEndPoints = {
    // --- PATIENT AUTH ---
    SEND_OTP: `${this.API_BASE_URL}/auth/send-otp`,
    RESEND_OTP: `${this.API_BASE_URL}/auth/resend-otp`,
    VERIFY_OTP: `${this.API_BASE_URL}/auth/verify-otp`,
    REFRESH_ACCESS_TOKEN: `${this.API_BASE_URL}/auth/refresh-access-token`,
    LOGOUT: `${this.API_BASE_URL}/auth/logout`,

    //--- PATIENT PROFILE ---
    SAVE_PATIENT_PROFILE: `${this.API_BASE_URL}/patient-profile/save`,
    GET_PATIENT_PROFILE: `${this.API_BASE_URL}/patient-profile`,

    // --- ADMIN / AUTH (Added these for Redux) ---
    ADMIN_LOGIN: `${this.API_BASE_URL}/adminlogin`,
    EMPLOYEE_LOGIN: `${this.API_BASE_URL}/employee/login`,
    SUPER_ADMIN_LOGIN: `${this.API_BASE_URL}/super-admin/login`,
    ADMIN_REGISTER: `${this.API_BASE_URL}/adminregister`,
    ADMIN_DASHBOARD: `${this.API_BASE_URL}/admindashboard`,
    // If Admin uses a different refresh endpoint than patients:
    ADMIN_REFRESH_TOKEN: `${this.API_BASE_URL}/refresh-token`, 

    // --- CLINIC ---
    CLINIC_SEND_OTP: `${this.API_BASE_URL}/clinic/send-otp`,
    CLINIC_VERIFY_OTP: `${this.API_BASE_URL}/clinic/verify-otp`,
    SUBMIT_CLINIC_FORM: `${this.API_BASE_URL}/clinic/submit-form`,
    GET_CLINICS: `${this.API_BASE_URL}/public/clinics`,
    GET_CLINICS_city: `${this.API_BASE_URL}/cities`,

    // --- ASSESSMENT ---
    GET_CONCERNS: `${this.API_BASE_URL}/assessment/concerns`,
    GET_QUESTIONS: `${this.API_BASE_URL}/assessment/questions`,
    SUBMIT_ASSESSMENT: `${this.API_BASE_URL}/assessment/submit`,
    GET_MY_ASSESSMENT: `${this.API_BASE_URL}/assessment/my-assessment`,
  };
}