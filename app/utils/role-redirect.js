// utils/role-redirect.js

export const RoleRoutes = {
  SUPER_ADMIN: '/admin',
  ADMIN: '/admin',
  CLINIC_ADMIN: '/clinic/dashboard',
  DOCTOR: '/doctor/dashboard',
  PATIENT: '/', // OR '/' if that is your dashboard
};

/**
 * Returns the dashboard path based on user role
 */
export const getRedirectPath = (role) => {
  if (!role) return '/'; // Default fallback
  
  switch (role) {
    case 'super_admin': return RoleRoutes.SUPER_ADMIN;
    case 'admin': return RoleRoutes.ADMIN;
    case 'clinic_admin': return RoleRoutes.CLINIC_ADMIN;
    case 'doctor': return RoleRoutes.DOCTOR;
    case 'patient': return RoleRoutes.PATIENT;
    default: return '/';
  }
};