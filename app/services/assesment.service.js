import api from "@/lib/axios"; // ✅ Correct
import { Constants } from "@/app/utils/constants";

// 1. Get Concerns
export const getConcerns = async (gender) => {
  try {
    const formattedGender = gender.charAt(0).toUpperCase() + gender.slice(1);
    const response = await api.get(`${Constants.urlEndPoints.GET_CONCERNS}/${formattedGender}`);

    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error("Error fetching concerns:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch concerns" };
  }
};

// 2. Get Questions
export const getQuestions = async (gender, concerns) => {
  try {
    const payload = {
      gender: gender.charAt(0).toUpperCase() + gender.slice(1),
      concerns: concerns,
    };

    const response = await api.post(Constants.urlEndPoints.GET_QUESTIONS, payload);

    if (response.data.success) {
      return { success: true, data: response.data.data.questions };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error("Error fetching questions:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch questions" };
  }
};

// 3. Submit Assessment
export const submitAssessment = async (gender, selectedConcerns, formattedAnswers) => {
  try {
    const payload = {
      gender: gender.charAt(0).toUpperCase() + gender.slice(1),
      selectedConcerns,
      answers: formattedAnswers,
    };

    // Note: We don't need to pass token manually anymore, 'api' grabs it from Redux
    const response = await api.post(Constants.urlEndPoints.SUBMIT_ASSESSMENT, payload);

    if (response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, message: response.data.message };

  } catch (error) {
    console.error("Error submitting assessment:", error);

    if (error.response?.status === 401) {
      return {
        success: false,
        message: "Please login to submit assessment",
        requireLogin: true, 
      };
    }

    return {
      success: false,
      message: error.response?.data?.message || "Failed to submit assessment",
    };
  }
};

// 4. Get My Assessment
export const getMyAssessment = async () => {
  try {
    const response = await api.get(Constants.urlEndPoints.GET_MY_ASSESSMENT);

    if (response.data.success) {
      return { success: true, data: response.data.data }; 
    }
    return { success: false, message: response.data.message };

  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 404) {
        return { success: false };
    }
    console.error("Error fetching history:", error);
    return { 
        success: false, 
        message: error.response?.data?.message || "Failed to fetch assessment" 
    };
  }
};

export const resetAssessmentData = async () => {
  try {
    // Assuming you add RESET_ASSESSMENT to your Constants eventually
    const endpoint = "/assessment/reset"; 
    const response = await api.delete(endpoint);

    if (response.data.success) {
      return { success: true, message: response.data.message };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to reset" };
  }
};