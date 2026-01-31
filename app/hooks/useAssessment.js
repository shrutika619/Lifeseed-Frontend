// client/app/hooks/useAssessment.js
import { useState, useEffect } from "react";
import { storage } from "@/app/utils/storage";

const STORAGE_KEY = "men10_assessment_progress";

const initialState = {
  isStarted: false,
  gender: null,
  selectedConditions: [],
  answers: {},
  results: [],
  showResults: false,
  showQuestions: false,
};

export const useAssessment = () => {
  const [state, setState] = useState(() => storage.get(STORAGE_KEY, initialState));

  useEffect(() => {
    storage.set(STORAGE_KEY, state);
  }, [state]);

  const startAssessment = () => setState(prev => ({ ...prev, isStarted: true }));
  const setGender = (gender) => setState(prev => ({ ...prev, gender }));

  const toggleCondition = (condition) => {
    setState(prev => {
      const isSelected = prev.selectedConditions.includes(condition);
      const newConditions = isSelected
        ? prev.selectedConditions.filter(c => c !== condition)
        : [...prev.selectedConditions, condition];
      return { ...prev, selectedConditions: newConditions, showQuestions: false, showResults: false, answers: {} };
    });
  };

  const setAnswer = (condition, index, value) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [condition]: { ...(prev.answers[condition] || {}), [index]: value } }
    }));
  };

  const setShowQuestions = (show) => setState(prev => ({ ...prev, showQuestions: show }));
  const setResults = (results) => setState(prev => ({ ...prev, results, showResults: true, showQuestions: false }));

  const resetAssessment = () => {
    setState(initialState); // Resets local state to "Nothing started"
    storage.remove(STORAGE_KEY); // Clears persisted progress
  };

  // ✅ NEW: Helper to sync backend data to local state
  const hydrateFromBackend = (backendData) => {
     setState(prev => ({
        ...prev,
        isStarted: true, // If they have data, the assessment is "started"
        gender: backendData.gender,
        selectedConditions: backendData.selectedConcerns || [],
        // We calculate the UI results format here or pass it in
        results: backendData.uiResults || [], 
        showResults: true,
        showQuestions: false
     }));
  };

  return { 
    ...state, 
    startAssessment, setGender, toggleCondition, setAnswer, 
    setShowQuestions, setResults, resetAssessment, hydrateFromBackend 
  };
};