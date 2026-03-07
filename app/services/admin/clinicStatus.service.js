import api from "@/lib/axios";
import { Constants } from "@/app/utils/constants";

export const ClinicStatusService = {
  /**
   * Base function to handle the PATCH request for status updates
   * Endpoint: PATCH /api/v1/admin/clinics/:clinicId/status
   */
  updateStatus: async (clinicId, payload) => {
    try {
      const response = await api.patch(
        `${Constants.urlEndPoints.GET_ALL_CLINICS}/${clinicId}/status`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating clinic ${clinicId} status:`, error);
      throw error?.response?.data || error;
    }
  },

  /**
   * Approves a pending clinic OR unblocks a blocked clinic
   */
  approveClinic: async (clinicId) => {
    return await ClinicStatusService.updateStatus(clinicId, { 
      action: "approved" 
    });
  },

  /**
   * Rejects a pending clinic (Requires a reason)
   */
  rejectClinic: async (clinicId, reason) => {
    if (!reason) throw new Error("Rejection reason is required");
    
    return await ClinicStatusService.updateStatus(clinicId, {
      action: "rejected",
      rejectionReason: reason
    });
  },

  /**
   * Blocks an active/approved clinic
   */
  blockClinic: async (clinicId) => {
    return await ClinicStatusService.updateStatus(clinicId, { 
      action: "blocked" 
    });
  }
};