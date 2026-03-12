export class Constants {

   static API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

  static urlEndPoints = {
    // ---  AUTH ---
    SEND_OTP: `${this.API_BASE_URL}/auth/send-otp`,
    RESEND_OTP: `${this.API_BASE_URL}/auth/resend-otp`,
    VERIFY_OTP: `${this.API_BASE_URL}/auth/verify-otp`,
    REFRESH_TOKEN: `${this.API_BASE_URL}/auth/refresh-access-token`,
    LOGOUT: `${this.API_BASE_URL}/auth/logout`,

    
    // --- ADMIN / AUTH (Added these for Redux) ---
    ADMIN_LOGIN: `${this.API_BASE_URL}/admin/login`,
    ADMIN_LOGOUT: `${this.API_BASE_URL}/admin/logout`,
    EMPLOYEE_LOGIN: `${this.API_BASE_URL}/employee/login`,
    SUPER_ADMIN_LOGIN: `${this.API_BASE_URL}/super-admin/login`,
    ADMIN_REGISTER: `${this.API_BASE_URL}/adminregister`,
    ADMIN_DASHBOARD: `${this.API_BASE_URL}/admindashboard`,

    //--- ADMIN TEAM MEMBER ---
    REGISTER_TEAM: "/admin/register/teammember",
    GET_ALL_ADMINS: "/users/admins",
    GET_MODULES: "/users/modules",
    
    // --- TELECONSULTATION ---
    TELECONSULTATION_AVAILABILITY: "/teleconsultation/availability",
    TELECONSULTATION_TIME_SLOTS: "/teleconsultation/time-slots",
    TELECONSULTATION_DURATION_OPTIONS: "/teleconsultation/duration-options",
    
    // --- CLINICS ---
    GET_ALL_CLINICS: `${this.API_BASE_URL}/admin/clinics`,
    
    // --- CUSTUMER LEADS ---
    ADMIN_FIRST_TIME_CUSTUMER: `${this.API_BASE_URL}/customer/first-time`,
    ADMIN_LOGGED_IN_CUSTUMER: `${this.API_BASE_URL}/customer/login-users`,
    GET_PATIENT_DETAILS: `${this.API_BASE_URL}/customer/patient`,
    SUBMIT_CUSTOMER_PROFILE: `${this.API_BASE_URL}/customer/submit`,
    CUSTOMER_ACTIVITY: `${this.API_BASE_URL}/customer/activity`,
    MANUAL_CUSTOMER_CREATE: `${this.API_BASE_URL}/customer/manual`,
    
    // Dynamic endpoints (Functions)
    ADMIN_ACTION: (id) => `/users/admin/${id}`,                  // GET, DELETE
    ADMIN_PERMISSIONS: (id) => `/users/admin/${id}/permissions`, // PUT
    ADMIN_PROFILE: (id) => `/users/admin/${id}/profile`,
    
    
    
    // --- CLINIC ---
    CLINIC_SEND_OTP: `${this.API_BASE_URL}/clinic/send-otp`,
    CLINIC_VERIFY_OTP: `${this.API_BASE_URL}/clinic/verify-otp`,
    SUBMIT_CLINIC_FORM: `${this.API_BASE_URL}/clinic/submit-form`,
    
    //--HOSPITAL--
    HOSPITAL_DOCTORS: `${this.API_BASE_URL}/doctors`,
    GET_CLINIC_SLOTS: "/doctors/clinic-slots",
    
    //--- HOSPITAL PROFILE ---
    GET_ME_CLINIC_PROFILE: "/clinic-profile",
    GET_PUBLIC_CLINICS: "/clinic-profile/clinics",
    UPDATE_CLINIC_PROFILE: "/clinic-profile/update",

    // Master Data Endpoints
    GET_MASTER_TIME_SLOTS: "/master/time-slots",
    GET_UG_DEGREES: `/master/ug-degrees`,
    GET_PG_DEGREES: `/master/pg-degrees`,
    GET_SUPER_SPECIALIZATIONS: `/master/super-specializations`,
    GET_PRIMARY_SPECIALTIES: `/master/primary-specialties`,
    


    //--- PATIENT ---
    SAVE_PATIENT_PROFILE: `${this.API_BASE_URL}/patient-profile/save`,
    GET_PATIENT_PROFILE: `${this.API_BASE_URL}/patient-profile`,
    GET_CLINIC_PROFILE: `${this.API_BASE_URL}/clinic-profile`,
    
    // --- ASSESSMENT ---
    GET_CONCERNS: `${this.API_BASE_URL}/assessment/concerns`,
    GET_QUESTIONS: `${this.API_BASE_URL}/assessment/questions`,
    SUBMIT_ASSESSMENT: `${this.API_BASE_URL}/assessment/submit`,
    GET_MY_ASSESSMENT: `${this.API_BASE_URL}/assessment/my-assessment`,
    
    //--SLOTS & DOCTOR--
    GET_CLINIC_DOCTORS: `${this.API_BASE_URL}/clinicDoctor`,
    GET_DOCTOR_AVAILABILITY: `${this.API_BASE_URL}/appoinntmentslot`, 
    
    GET_PATIENT_TELE_SLOTS: `${this.API_BASE_URL}/teleconsultation/slots`,

    // -- APPOINTMENT BOOKING --
    BOOK_TELECONSULTATION: `${this.API_BASE_URL}/appoinntmentBooking/teleconsultation`,
    
    GET_CLINICS: `${this.API_BASE_URL}/public/clinics`,
    GET_CLINICS_city: `${this.API_BASE_URL}/cities`,

  };
}