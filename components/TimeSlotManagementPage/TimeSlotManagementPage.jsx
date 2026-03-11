"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import toast from "react-hot-toast";
import { AdminTeleconsultationSlotsService } from "@/app/services/admin/adminTeleconsultationSlots.service"; // ✅ IMPORT NEW SERVICE

// Original mock doctors (unchanged)
const initialDoctors = [
  {
    id: 1,
    name: "Dr. Aditya Sharma",
    specialty: "Orthopaedics, Joints & Spine",
    phone: "+919876543211",
    email: "aditya.sharma@example.com",
    todaySlots: 0,
    status: "online",
    selected: true,
  },
  {
    id: 2,
    name: "Dr. Priya Singh",
    specialty: "Dermatologist",
    phone: "+919876543212",
    email: "priya.singh@example.com",
    todaySlots: 4,
    status: "offline",
    selected: false,
  },
  {
    id: 3,
    name: "Dr. Vikram Nathsen",
    specialty: "Urologist",
    phone: "+919876543213",
    email: "vikram.nathsen@example.com",
    todaySlots: 2,
    status: "offline",
    selected: false,
  },
  {
    id: 4,
    name: "Dr. Sunita Dasari",
    specialty: "Gynaecologist",
    phone: "+919876543214",
    email: "sunita.dasari@example.com",
    todaySlots: 8,
    status: "offline",
    selected: false,
  },
  {
    id: 5,
    name: "Dr. Rahul Verma",
    specialty: "Cardiologist",
    phone: "+919876543215",
    email: "rahul.verma@example.com",
    todaySlots: 1,
    status: "online",
    selected: false,
  },
  {
    id: 6,
    name: "Dr. Neha Gupta",
    specialty: "Paediatrician",
    phone: "+919876543216",
    email: "neha.gupta@example.com",
    todaySlots: 0,
    status: "offline",
    selected: false,
  },
];

export default function TimeSlotManagement() {
  const router = useRouter(); 

  const [loading, setLoading] = useState(true);
  const [maxBookings, setMaxBookings] = useState(1);
  const [timeDuration, setTimeDuration] = useState(30);
  
  const [durationOptions, setDurationOptions] = useState([]);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [selectedDay, setSelectedDay] = useState("monday");
  
  // Modal States for Slot Disabling
  const [warningModal, setWarningModal] = useState(null);
  const [isForceDisabling, setIsForceDisabling] = useState(false);
  
  // Custom Alert State for Save Responses
  const [customAlert, setCustomAlert] = useState(null);

  const [doctors, setDoctors] = useState(initialDoctors);
  const [saved, setSaved] = useState(false);

  const buildDefaultGrid = async (duration) => {
    try {
      const res = await AdminTeleconsultationSlotsService.getTimeSlotsByDuration(duration);
      const sessions = res.data.sessions;

      const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
      const newAvail = {};

      days.forEach(day => {
        newAvail[day] = {};
        ["morning", "afternoon", "evening", "night"].forEach(period => {
          const isWeekend = day === "saturday" || day === "sunday";
          const sessionData = sessions[period];
          
          newAvail[day][period] = {
            enabled: !isWeekend, 
            times: sessionData ? sessionData.slots.map(s => ({
              start: s.start,
              end: s.end,
              enabled: !isWeekend 
            })) : []
          };
        });
      });

      setAvailabilityData(newAvail);
    } catch (error) {
      console.error("Error generating default slots:", error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [availRes, durationRes] = await Promise.all([
          AdminTeleconsultationSlotsService.getAvailability(),
          AdminTeleconsultationSlotsService.getDurationOptions()
        ]);
        
        let initialDuration = 30;

        if (durationRes.success && durationRes.data) {
          setDurationOptions(durationRes.data.options);
          initialDuration = durationRes.data.currentDuration;
        }

        if (availRes.success && availRes.data) {
          const apiData = availRes.data;
          initialDuration = apiData.slotDuration || initialDuration;
          setMaxBookings(apiData.patientLimit || 1);
          setTimeDuration(initialDuration);
          
          if (apiData.availability) {
            setAvailabilityData(apiData.availability);
          } else {
            await buildDefaultGrid(initialDuration);
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const handleDurationChange = async (e) => {
    const newDuration = Number(e.target.value);
    setTimeDuration(newDuration);
    setLoading(true);
    await buildDefaultGrid(newDuration);
    setLoading(false);
  };

  const toggleSlot = async (period, index) => {
    const currentSlot = availabilityData[selectedDay][period].times[index];
    const isTurningOff = currentSlot.enabled === true;
    const slotTimeStr = `${currentSlot.start} - ${currentSlot.end}`;

    if (!isTurningOff) {
      setAvailabilityData((prev) => {
        const newData = JSON.parse(JSON.stringify(prev));
        newData[selectedDay][period].times[index].enabled = true;
        return newData;
      });
      return;
    }

    try {
      const payload = {
        slotDisable: {
          dayName: selectedDay,
          period: period,
          slotTime: slotTimeStr,
          force: false 
        }
      };

      const res = await AdminTeleconsultationSlotsService.disableSpecificSlot(payload);

      if (res.hasBookings) {
        setWarningModal({
          dayName: selectedDay,
          period,
          index,
          slotTime: slotTimeStr,
          warnings: res.patientWarnings
        });
      } else {
        setAvailabilityData((prev) => {
          const newData = JSON.parse(JSON.stringify(prev));
          newData[selectedDay][period].times[index].enabled = false;
          return newData;
        });
      }
    } catch (error) {
      console.error("Error disabling slot:", error);
      setCustomAlert({
        type: 'error',
        title: 'Action Failed',
        message: error.message || "Failed to disable slot. Please try again."
      });
    }
  };

  const forceDisableSlot = async () => {
    if (!warningModal) return;
    setIsForceDisabling(true);

    try {
      const payload = {
        slotDisable: {
          dayName: warningModal.dayName,
          period: warningModal.period,
          slotTime: warningModal.slotTime,
          force: true 
        }
      };

      const res = await AdminTeleconsultationSlotsService.disableSpecificSlot(payload);

      if (res.success) {
        setAvailabilityData((prev) => {
          const newData = JSON.parse(JSON.stringify(prev));
          newData[warningModal.dayName][warningModal.period].times[warningModal.index].enabled = false;
          return newData;
        });
        setWarningModal(null);
      }
    } catch (error) {
      console.error("Error force disabling slot:", error);
      setCustomAlert({
        type: 'error',
        title: 'Action Failed',
        message: error.message || "An error occurred while force disabling the slot."
      });
    } finally {
      setIsForceDisabling(false);
    }
  };

  const togglePeriod = (periodKey) => {
    setAvailabilityData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const times = newData[selectedDay][periodKey]?.times || [];
      if (times.length === 0) return prev;

      const allEnabled = times.every(t => t.enabled);
      
      times.forEach(t => { t.enabled = !allEnabled; });
      newData[selectedDay][periodKey].enabled = !allEnabled;

      return newData;
    });
  };

  const toggleAllForDay = () => {
    setAvailabilityData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const dayData = newData[selectedDay];

      let allEnabled = true;
      let hasSlots = false;

      ["morning", "afternoon", "evening", "night"].forEach(period => {
        if (dayData[period]?.times?.length > 0) {
          hasSlots = true;
          dayData[period].times.forEach(t => { if (!t.enabled) allEnabled = false; });
        }
      });

      if (!hasSlots) return prev;

      ["morning", "afternoon", "evening", "night"].forEach(period => {
        if (dayData[period]?.times) {
          dayData[period].enabled = !allEnabled;
          dayData[period].times.forEach(t => { t.enabled = !allEnabled; });
        }
      });

      return newData;
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        patientLimit: maxBookings,
        slotDuration: timeDuration,
        availability: availabilityData
      };

      const res = await AdminTeleconsultationSlotsService.saveAvailability(payload);
      
      if (res.success) {
        setSaved(true);
        toast.success("Teleconsultation slots saved successfully!"); 
        
        setTimeout(() => {
          router.push("/super-admin/teleconsultation");
        }, 1000);
      }
    } catch (error) {
      console.error("Error saving availability:", error);
      setCustomAlert({
        type: 'error',
        title: 'Save Failed',
        message: error.message || "Failed to save changes. Please try again."
      });
    }
  };

  const toggleDoctor = (id) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, selected: !d.selected } : d))
    );
  };

  const toggleDoctorStatus = (id) => {
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === "online" ? "offline" : "online" } : d
      )
    );
  };

  const orderedPeriods = [
    { key: "night", label: "Night" },
    { key: "morning", label: "Morning" },
    { key: "afternoon", label: "Afternoon" },
    { key: "evening", label: "Evening" }
  ];

  let isAllDayEnabled = true;
  let hasAnySlots = false;
  if (availabilityData && availabilityData[selectedDay]) {
    ["morning", "afternoon", "evening", "night"].forEach(period => {
      const periodData = availabilityData[selectedDay][period];
      if (periodData?.times?.length > 0) {
        hasAnySlots = true;
        periodData.times.forEach(t => { if (!t.enabled) isAllDayEnabled = false; });
      }
    });
  }
  if (!hasAnySlots) isAllDayEnabled = false;

  if (loading && !availabilityData) {
    return <div style={{ ...styles.page, textAlign: 'center', padding: '100px 16px 24px' }}>Loading Settings...</div>;
  }

  return (
    <div style={styles.page}>
      {/* TIME SLOT MANAGEMENT */}
      <section style={styles.card}>
        <h1 style={styles.title}>Time Slot Management</h1>
        <p style={styles.subtitle}>
          Turn consultation time slots on or off. Changes are saved automatically.
        </p>

        <div style={styles.maxBookingsRow}>
          <div style={styles.maxBookingsSection}>
            <label style={styles.label}>Max Bookings</label>
            <input
              type="number"
              min={1}
              max={20}
              value={maxBookings}
              onChange={(e) => setMaxBookings(Number(e.target.value))}
              style={styles.numberInput}
            />
          </div>
          
          <div style={styles.dividerV} />
          
          <div style={styles.maxBookingsSection}>
            <label style={styles.label}>Duration</label>
            <select
              value={timeDuration}
              onChange={handleDurationChange}
              style={styles.selectInput}
            >
              {durationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div style={styles.dividerV} />
          
          <div style={styles.maxBookingsSection}>
            <label style={styles.label}>Select Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              style={{...styles.selectInput, textTransform: 'capitalize'}}
            >
              {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>

        <p style={{...styles.hint, marginTop: '12px'}}>
          A time slot will automatically turn off when it reaches max bookings.
        </p>

        <div style={styles.divider} />

        {loading ? (
          <div style={{textAlign: "center", color: "#6b7280", padding: "20px 0"}}>Updating grid...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {hasAnySlots && (
              <div style={styles.dayHeaderRow}>
                <h2 style={styles.dayHeaderTitle}>{selectedDay} Schedule</h2>
                <button onClick={toggleAllForDay} style={styles.selectAllBtn}>
                  {isAllDayEnabled ? "Deselect Entire Day" : "Select Entire Day"}
                </button>
              </div>
            )}

            {orderedPeriods.map(({ key, label }) => {
              const periodData = availabilityData[selectedDay]?.[key];
              if (!periodData || !periodData.times || periodData.times.length === 0) return null;

              const isPeriodFullyEnabled = periodData.times.every(t => t.enabled);

              return (
                <div key={key}>
                  <div style={styles.periodHeader}>
                    <div style={styles.periodHeaderLeft}>
                      <span style={styles.periodDot(key)}></span>
                      <h3 style={styles.periodLabel}>{label}</h3>
                    </div>
                    <span 
                      onClick={() => togglePeriod(key)} 
                      style={styles.toggleLink}
                    >
                      {isPeriodFullyEnabled ? "Deselect All" : "Select All"}
                    </span>
                  </div>

                  <div style={styles.grid}>
                    {periodData.times.map((t, index) => (
                      <SlotChip
                        key={`${key}-${index}`}
                        slot={{
                          id: `${key}-${index}`,
                          time: `${t.start} - ${t.end}`,
                          enabled: t.enabled,
                          bookings: 0 
                        }}
                        maxBookings={maxBookings}
                        onToggle={() => toggleSlot(key, index)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* DOCTOR MANAGER */}
      <section style={{ ...styles.card, marginTop: 24 }}>
        <h1 style={styles.title}>Doctor Manager</h1>
        <p style={styles.subtitle}>Select doctors to manage their status.</p>
        <label style={styles.label}>Select Doctors</label>

        <div style={styles.doctorList}>
          {doctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doc={doc}
              onToggleSelect={() => toggleDoctor(doc.id)}
              onToggleStatus={() => toggleDoctorStatus(doc.id)}
            />
          ))}
        </div>

        <button
          onClick={handleSave}
          style={{
            ...styles.saveBtn,
            background: saved ? "#22c55e" : "#2563eb",
          }}
        >
          {saved ? "Saved!" : "Save"}
        </button>
      </section>

      {/* WARNING MODAL FOR BOOKED PATIENTS */}
      {warningModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(17, 24, 39, 0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px"
        }}>
          <div style={{
            background: "#fff", padding: "24px", borderRadius: "16px",
            maxWidth: "400px", width: "100%", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
          }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "18px", color: "#b91c1c", fontWeight: "700" }}>
              Patients Already Booked
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: "14px", color: "#4b5563", lineHeight: "1.5" }}>
              There are active bookings for <b>{warningModal.slotTime}</b> on upcoming days. Turning this slot off will prevent new bookings, but you must manually contact existing patients if you are cancelling.
            </p>
            
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px", marginBottom: "20px" }}>
              {warningModal.warnings.map((w, i) => (
                <div key={i} style={{ fontSize: "13px", color: "#991b1b", marginBottom: i !== warningModal.warnings.length - 1 ? '8px' : '0' }}>
                  • <b>{w.date}</b>: {w.bookedCount} patient(s)
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={() => setWarningModal(null)}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fff", color: "#374151", fontWeight: "600", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button 
                onClick={forceDisableSlot}
                disabled={isForceDisabling}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: "#dc2626", color: "#fff", fontWeight: "600", cursor: "pointer", opacity: isForceDisabling ? 0.7 : 1 }}
              >
                {isForceDisabling ? "Disabling..." : "Force Turn Off"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM ALERT MODAL */}
      {customAlert && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(17, 24, 39, 0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px"
        }}>
          <div style={{
            background: "#fff", padding: "24px", borderRadius: "16px",
            maxWidth: "400px", width: "100%", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
          }}>
            <h3 style={{ 
              margin: "0 0 12px", 
              fontSize: "18px", 
              fontWeight: "700",
              color: customAlert.type === 'error' ? "#b91c1c" : (customAlert.type === 'warning' ? "#d97706" : "#16a34a") 
            }}>
              {customAlert.title}
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: "14px", color: "#4b5563", lineHeight: "1.5" }}>
              {customAlert.message}
            </p>

            {customAlert.warnings && customAlert.warnings.length > 0 && (
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "12px", marginBottom: "20px" }}>
                {customAlert.warnings.map((w, i) => (
                  <div key={i} style={{ fontSize: "13px", color: "#92400e", marginBottom: i !== customAlert.warnings.length - 1 ? '8px' : '0' }}>
                    • {w}
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={() => setCustomAlert(null)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#fff", fontWeight: "600", cursor: "pointer" }}
            >
              Okay
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

function SlotChip({ slot, maxBookings, onToggle }) {
  const autoOff = slot.bookings >= maxBookings;
  const active = slot.enabled && !autoOff;

  return (
    <div
      onClick={onToggle}
      style={{
        ...styles.chip,
        background: active ? "#dbeafe" : "#f3f4f6",
        borderColor: active ? "#3b82f6" : "#d1d5db",
        opacity: autoOff ? 0.5 : 1,
        cursor: autoOff ? "not-allowed" : "pointer",
      }}
    >
      <div
        style={{
          ...styles.chipDot,
          background: active ? "#3b82f6" : "#9ca3af",
        }}
      />
      <span style={{ ...styles.chipText, color: active ? "#1d4ed8" : "#6b7280", whiteSpace: "nowrap" }}>
        {slot.time}
      </span>
    </div>
  );
}

function DoctorCard({ doc, onToggleSelect, onToggleStatus }) {
  return (
    <div
      style={{
        ...styles.doctorCard,
        borderLeft: doc.selected ? "3px solid #3b82f6" : "3px solid transparent",
        background: doc.selected ? "#eff6ff" : "#fff",
      }}
    >
      <div style={styles.doctorRow}>
        <input
          type="checkbox"
          checked={doc.selected}
          onChange={onToggleSelect}
          style={styles.checkbox}
        />
        <div style={styles.doctorInfo}>
          <div style={styles.doctorName}>{doc.name}</div>
          <div style={styles.doctorSpecialty}>{doc.specialty}</div>
          <div style={styles.doctorContact}>
            {doc.phone} &bull; {doc.email}
          </div>
        </div>
        <div style={styles.doctorMeta}>
          <div style={styles.todaySlots}>
            <span style={styles.metaLabel}>0 Today</span>
          </div>
          <div style={styles.statusToggle} onClick={onToggleStatus}>
            <div
              style={{
                ...styles.statusDot,
                background: doc.status === "online" ? "#22c55e" : "#9ca3af",
              }}
            />
            <span
              style={{
                ...styles.statusText,
                color: doc.status === "online" ? "#16a34a" : "#6b7280",
              }}
            >
              {doc.status === "online" ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    maxWidth: 520,
    margin: "0 auto",
    padding: "24px 16px",
    background: "#f8fafc",
    minHeight: "100vh",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "24px 20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
    textAlign: "center",
    margin: "0 0 4px",
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    margin: "0 0 16px",
  },
  maxBookingsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "14px 16px",
    background: "#f9fafb",
  },
  maxBookingsSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  dividerV: {
    width: 1,
    height: 50,
    background: "#e5e7eb",
    margin: "0 16px",
  },
  selectInput: {
    border: "1px solid #d1d5db",
    borderRadius: 6,
    padding: "4px 8px",
    fontSize: 13,
    outline: "none",
    background: "#fff",
    cursor: "pointer",
    color: "#374151",
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
  },
  numberInput: {
    width: 50,
    textAlign: "center",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    padding: "4px 8px",
    fontSize: 14,
    outline: "none",
  },
  hint: {
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "center",
    margin: 0,
  },
  divider: {
    height: 1,
    background: "#e5e7eb",
    margin: "16px 0",
  },
  dayHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottom: "1px dashed #e5e7eb",
  },
  dayHeaderTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
    textTransform: "capitalize",
    margin: 0,
  },
  selectAllBtn: {
    fontSize: 11,
    fontWeight: 600,
    color: "#4b5563",
    background: "#f3f4f6",
    border: "1px solid #d1d5db",
    padding: "4px 10px",
    borderRadius: 6,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  periodHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  periodHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  periodLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: "#1f2937",
    margin: 0,
  },
  toggleLink: {
    fontSize: 11,
    fontWeight: 600,
    color: "#3b82f6",
    cursor: "pointer",
    userSelect: "none",
  },
  periodDot: (key) => ({
    width: 6,
    height: 6,
    borderRadius: "50%",
    backgroundColor: 
      key === 'morning' ? '#eab308' : 
      key === 'afternoon' ? '#f97316' : 
      key === 'evening' ? '#818cf8' : 
      '#475569',
  }),
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", 
    gap: 8,
  },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 8px",
    borderRadius: 6,
    border: "1px solid",
    cursor: "pointer",
    transition: "all 0.15s",
    userSelect: "none",
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    flexShrink: 0,
  },
  chipText: {
    fontSize: 11,
    fontWeight: 600,
    flex: 1,
    textAlign: "center",
  },
  doctorList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 8,
  },
  doctorCard: {
    borderRadius: 8,
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    transition: "all 0.15s",
  },
  doctorRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  },
  checkbox: {
    marginTop: 3,
    width: 15,
    height: 15,
    cursor: "pointer",
    accentColor: "#3b82f6",
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 13,
    fontWeight: 700,
    color: "#111827",
  },
  doctorSpecialty: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 1,
  },
  doctorContact: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 2,
  },
  doctorMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
    flexShrink: 0,
  },
  todaySlots: {
    fontSize: 11,
    color: "#6b7280",
  },
  metaLabel: {
    fontSize: 11,
    color: "#6b7280",
  },
  statusToggle: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    cursor: "pointer",
    padding: "2px 6px",
    borderRadius: 20,
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
  },
  statusText: {
    fontSize: 11,
    fontWeight: 500,
  },
  saveBtn: {
    display: "block",
    margin: "20px auto 0",
    padding: "10px 40px",
    borderRadius: 8,
    border: "none",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};