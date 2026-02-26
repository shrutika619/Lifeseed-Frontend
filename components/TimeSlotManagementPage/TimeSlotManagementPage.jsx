"use client";
import { useState } from "react";

const generateTimeSlots = () => {
  const slots = [];
  const times = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
    "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM",
    "12:00 AM", "12:30 AM", "1:00 AM", "1:30 AM",
  ];
  times.forEach((time, i) => {
    slots.push({ id: i, time, enabled: Math.random() > 0.3, bookings: Math.floor(Math.random() * 3) });
  });
  return slots;
};

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
  const [maxBookings, setMaxBookings] = useState(1);
  const [timeDuration, setTimeDuration] = useState(30);
  const [slots, setSlots] = useState(generateTimeSlots());
  const [doctors, setDoctors] = useState(initialDoctors);
  const [saved, setSaved] = useState(false);

  const toggleSlot = (id) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const toggleDoctor = (id) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, selected: !d.selected } : d))
    );
  };

  const toggleDoctorStatus = (id) => {
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === "online" ? "offline" : "online" }
          : d
      )
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const cols = 6;
  const rows = Math.ceil(slots.length / cols);
  const grid = [];
  for (let r = 0; r < rows; r++) {
    grid.push(slots.slice(r * cols, r * cols + cols));
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
            <label style={styles.label}>Max Bookings Per Slot</label>
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
            <label style={styles.label}>Time Duration</label>
            <select
              value={timeDuration}
              onChange={(e) => setTimeDuration(Number(e.target.value))}
              style={styles.selectInput}
            >
              {[10, 15, 20, 30, 45, 60, 90, 120].map((v) => (
                <option key={v} value={v}>{v} min</option>
              ))}
            </select>
          </div>
        </div>
        <p style={styles.hint}>
          A time slot will automatically turn off when it reaches max bookings.
        </p>

        <div style={styles.divider} />

        <div style={styles.grid}>
          {slots.map((slot) => (
            <SlotChip
              key={slot.id}
              slot={slot}
              maxBookings={maxBookings}
              onToggle={() => toggleSlot(slot.id)}
            />
          ))}
        </div>
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
      <span style={{ ...styles.chipText, color: active ? "#1d4ed8" : "#6b7280" }}>
        {slot.time}
      </span>
      <span style={styles.chipCount}>{slot.bookings}</span>
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
    padding: "14px 24px",
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
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
  },
  numberInput: {
    width: 60,
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 6,
  },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "5px 7px",
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
    fontWeight: 500,
    flex: 1,
  },
  chipCount: {
    fontSize: 10,
    color: "#9ca3af",
    fontWeight: 600,
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