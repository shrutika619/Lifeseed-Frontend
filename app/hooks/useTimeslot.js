import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/axios';
import { Constants } from '@/app/utils/constants'; // ✅ IMPORT CONSTANTS

// Helper: Convert "10:30 AM" into total minutes from midnight for easy math
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
};

// Fallback generator in case the API goes down
const generateFallbackSlots = () => {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const period = h < 12 ? "AM" : "PM";
      const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
      slots.push(`${hour}:${m === 0 ? "00" : "30"} ${period}`);
    }
  }
  return slots;
};

/**
 * useTimeSlot Hook
 * Fetches master time slots from API and filters them based on requirements.
 */
export const useTimeSlot = ({ selectedDate, startTime, endTime } = {}) => {
  const [allSlots, setAllSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // 1. Fetch slots from Master Data API
  useEffect(() => {
    const fetchTimeSlots = async () => {
      setIsLoadingSlots(true);
      try {
        // ✅ USE CONSTANT HERE
        const response = await api.get(Constants.urlEndPoints.GET_MASTER_TIME_SLOTS);
        
        // Handle your specific ApiResponse structure
        const fetchedSlots = response.data?.data || response.data?.message || [];
        
        if (fetchedSlots.length > 0) {
          setAllSlots(fetchedSlots);
        } else {
          setAllSlots(generateFallbackSlots());
        }
      } catch (error) {
        console.error("Failed to fetch master time slots, using fallback:", error);
        setAllSlots(generateFallbackSlots()); // Safety fallback
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchTimeSlots();
  }, []);

  // 2. Filter slots dynamically based on props
  const availableSlots = useMemo(() => {
    if (!allSlots.length) return [];

    let slots = [...allSlots];

    // Filter A: Clinic Working Hours Boundary
    if (startTime || endTime) {
      const startMins = startTime ? timeToMinutes(startTime) : 0;
      const endMins = endTime ? timeToMinutes(endTime) : 24 * 60;

      slots = slots.filter((slot) => {
        const slotMins = timeToMinutes(slot);
        return slotMins >= startMins && slotMins <= endMins;
      });
    }

    // Filter B: Remove past time slots if the selected date is "Today"
    if (selectedDate) {
      const now = new Date();
      const isToday =
        selectedDate.getDate() === now.getDate() &&
        selectedDate.getMonth() === now.getMonth() &&
        selectedDate.getFullYear() === now.getFullYear();

      if (isToday) {
        const currentMins = now.getHours() * 60 + now.getMinutes();
        slots = slots.filter((slot) => timeToMinutes(slot) > currentMins);
      }
    }

    return slots;
  }, [allSlots, selectedDate, startTime, endTime]);

  const clearSelection = () => setSelectedSlot(null);

  return {
    allSlots,          
    availableSlots,    
    isLoadingSlots,    
    selectedSlot,
    setSelectedSlot,
    clearSelection,
  };
};