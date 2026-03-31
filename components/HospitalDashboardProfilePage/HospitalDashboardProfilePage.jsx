"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// ✅ IMPORT YOUR API SERVICES
import { getMeClinicProfile, updateClinicProfile } from "@/app/services/clinic/hospitalProfile.service";
import { getAllCities } from "@/app/services/patient/clinic.service";

/* ── ICONS ── */
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const BackIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);
const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.97-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const LocIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const DocIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const CalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const PeopleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const LinkIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const InfoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const CityIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const ImageIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

export default function ClinicProfileDesktop() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cities, setCities] = useState([]);

  const [data, setData] = useState({
    // Basic
    name: "MEN10 SEXUAL HEALTH CLINIC",
    branch: "",
    role: "Administrator",
    // Contact
    email: "",
    phone: "",
    location: "",
    googleMapsLink: "",
    // Info
    hospitalInfo: "",
    hospitalDescription: "",
    city: "",
    // Owner Details
    ownerName: "",
    ownerContactNumber: "",
    // Contact Person
    contactPersonName: "",
    contactPersonEmail: "",
    // Attendant
    attendantName: "",
    attendantNumber: "",
    // Stats (read-only)
    workingHours: "Mon - Fri: 9:00 AM - 6:00 PM",
    doctors: "8 Specialist Doctors",
    appointments: "1,234",
    patients: "892",
    rating: "4.8",
  });

  const [temp, setTemp] = useState(data);

  // Photo files (only for editing)
  const [ownerProfilePhoto, setOwnerProfilePhoto] = useState(null);
  const [hospitalInteriorPhoto, setHospitalInteriorPhoto] = useState(null);
  const [hospitalFrontPhoto, setHospitalFrontPhoto] = useState(null);
  const [doctorClaimPhoto, setDoctorClaimPhoto] = useState(null);

  // Existing photo URLs (from API)
  const [photoUrls, setPhotoUrls] = useState({
    ownerProfilePhoto: "",
    hospitalFrontPhoto: "",
    hospitalInteriorPhoto: "",
    doctorClaimPhoto: "",
  });

  /* ── FETCH CITIES ── */
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getAllCities();
        if (res.success && res.data) setCities(res.data);
      } catch (e) {
        console.error("Failed to fetch cities", e);
      }
    };
    fetchCities();
  }, []);

  /* ── FETCH CLINIC DATA ON MOUNT ── */
  useEffect(() => {
    const fetchClinicData = async () => {
      setIsLoading(true);
      try {
        const response = await getMeClinicProfile();
        if (response.success && response.data) {
          const clinic = response.data.clinic;
          const updated = {
            ...data,
            name: clinic.clinicName || "MEN10 CLINIC",
            branch: clinic.areaName || "",
            email: clinic.clinicEmail || "",
            phone: clinic.officeCallingNo || "",
            location: clinic.fulladdress || "",
            googleMapsLink: clinic.googleMapsLink || "",
            hospitalInfo: clinic.clinicInfo || "",
            hospitalDescription: clinic.clinicDescription || "",
            city: clinic.city?._id || clinic.city || "",
            ownerName: clinic.ownerName || "",
            ownerContactNumber: clinic.ownerContactNo || "",
            contactPersonName: clinic.contactPersonName || "",
            contactPersonEmail: clinic.contactPersonEmail || "",
            attendantName: clinic.attendantName || "",
            attendantNumber: clinic.attendantNumber || "",
            doctors: response.data.totalDoctors ?? data.doctors,
            appointments: clinic.appointmentsCount || data.appointments,
            patients: clinic.patientsCount || data.patients,
          };
          setData(updated);
          setTemp(updated);
          setPhotoUrls({
            ownerProfilePhoto: clinic.ownerProfilePhoto || "",
            hospitalFrontPhoto: clinic.clinicfrontPhoto || "",
            hospitalInteriorPhoto: clinic.clinicinteriorPhoto || "",
            doctorClaimPhoto: clinic.doctorCabinPhoto || "",
          });
        } else {
          toast.error(response.message || "Failed to load clinic details");
        }
      } catch (error) {
        toast.error("Error connecting to server");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClinicData();
  }, []);

  const onChange = (e) => setTemp(p => ({ ...p, [e.target.name]: e.target.value }));

  const handlePhoneInput = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setTemp(p => ({ ...p, [e.target.name]: digitsOnly }));
  };

  const onEdit = () => { setTemp(data); setIsEditing(true); };
  const onCancel = () => setIsEditing(false);

  /* ── SAVE ── */
  const onSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("clinicName", temp.name);
    formData.append("areaName", temp.branch);
    formData.append("clinicEmail", temp.email);
    formData.append("officeCallingNo", temp.phone);
    formData.append("fulladdress", temp.location);
    formData.append("googleMapsLink", temp.googleMapsLink);
    formData.append("clinicInfo", temp.hospitalInfo);
    formData.append("clinicDescription", temp.hospitalDescription);
    formData.append("city", temp.city);
    formData.append("ownerName", temp.ownerName);
    formData.append("ownerContactNo", temp.ownerContactNumber);
    formData.append("contactPersonName", temp.contactPersonName);
    formData.append("contactPersonEmail", temp.contactPersonEmail);
    formData.append("attendantName", temp.attendantName);
    formData.append("attendantNumber", temp.attendantNumber);

    if (ownerProfilePhoto) formData.append("ownerProfilePhoto", ownerProfilePhoto);
    if (hospitalFrontPhoto) formData.append("clinicfrontPhoto", hospitalFrontPhoto);
    if (hospitalInteriorPhoto) formData.append("clinicinteriorPhoto", hospitalInteriorPhoto);
    if (doctorClaimPhoto) formData.append("doctorCabinPhoto", doctorClaimPhoto);

    try {
      const response = await updateClinicProfile(formData);
      if (response.success) {
        setData(temp);
        setIsEditing(false);
        // Reset file inputs
        setOwnerProfilePhoto(null);
        setHospitalFrontPhoto(null);
        setHospitalInteriorPhoto(null);
        setDoctorClaimPhoto(null);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const onBack = () => {
    if (isEditing) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) window.history.back();
    } else {
      window.history.back();
    }
  };

  const cur = isEditing ? temp : data;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  /* ── CITY NAME HELPER ── */
  const getCityName = (cityId) => {
    const found = cities.find(c => c._id === cityId);
    return found ? found.name : cityId || "Not Provided";
  };

  return (
    <>
      <style>{`
        .cpd-wrap {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f3f4f6;
          min-height: 100vh;
          padding: 0;
        }

        /* ── TOP BAR ── */
        .cpd-topbar {
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 32px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .cpd-topbar-left { display: flex; align-items: center; gap: 10px; }
        .cpd-back {
          background: #f3f4f6; border: none; cursor: pointer;
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .cpd-back:hover { background: #e5e7eb; }
        .cpd-topbar-title { font-size: 0.9rem; font-weight: 600; color: #111827; }

        /* ── BUTTONS ── */
        .cpd-btn-edit {
          display: inline-flex; align-items: center; gap: 7px;
          background: #fefce8; border: 1.5px solid #e5e7eb;
          border-radius: 9px; padding: 7px 18px;
          font-size: 0.8rem; font-weight: 600; color: #374151;
          cursor: pointer; font-family: inherit; transition: all 0.15s;
        }
        .cpd-btn-edit:hover { background: #fef9c3; border-color: #d1d5db; }

        .cpd-btn-save {
          display: inline-flex; align-items: center; gap: 7px;
          background: #2563eb; border: none;
          border-radius: 9px; padding: 7px 18px;
          font-size: 0.8rem; font-weight: 600; color: #fff;
          cursor: pointer; font-family: inherit; transition: background 0.15s;
        }
        .cpd-btn-save:hover { background: #1d4ed8; }
        .cpd-btn-save:disabled { background: #93c5fd; cursor: not-allowed; }

        .cpd-btn-cancel {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fff; border: 1.5px solid #d1d5db;
          border-radius: 9px; padding: 7px 14px;
          font-size: 0.8rem; font-weight: 600; color: #6b7280;
          cursor: pointer; font-family: inherit; transition: background 0.15s;
        }
        .cpd-btn-cancel:hover { background: #f9fafb; }
        .cpd-btn-group { display: flex; gap: 8px; }

        /* ── PAGE CONTENT ── */
        .cpd-content { padding: 28px 32px 48px; }
        .cpd-page-title { font-size: 1.2rem; font-weight: 700; color: #111827; margin-bottom: 2px; }
        .cpd-page-sub { font-size: 0.8rem; color: #9ca3af; margin-bottom: 24px; }

        /* ── GRID ── */
        .cpd-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 20px;
          align-items: start;
        }

        /* ── CARD ── */
        .cpd-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          overflow: hidden;
          margin-bottom: 16px;
        }
        .cpd-card:last-child { margin-bottom: 0; }

        /* ── PROFILE CARD ── */
        .cpd-profile {
          padding: 28px 20px 24px;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
        }
        .cpd-avatar {
          width: 88px; height: 88px; border-radius: 50%;
          background: linear-gradient(135deg, #c7cdd6, #94a3b8);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem; font-weight: 700; color: #fff;
          border: 3px solid #e5e7eb; margin-bottom: 14px;
          overflow: hidden;
        }
        .cpd-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .cpd-name { font-size: 0.9rem; font-weight: 700; color: #111827; line-height: 1.35; }
        .cpd-branch { font-size: 0.9rem; font-weight: 700; color: #111827; margin-bottom: 3px; }
        .cpd-role { font-size: 0.76rem; color: #9ca3af; margin-bottom: 10px; }
        .cpd-status {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.75rem; font-weight: 600; color: #16a34a; margin-bottom: 14px;
        }
        .cpd-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; animation: cpd-blink 2s infinite; }
        @keyframes cpd-blink { 0%,100%{opacity:1}50%{opacity:0.5} }

        .cpd-name-input {
          width: 100%; text-align: center;
          font-size: 0.88rem; font-weight: 700; color: #111827;
          border: 1.5px solid #6366f1; border-radius: 8px;
          padding: 5px 10px; outline: none; margin-bottom: 5px;
          font-family: inherit; background: #f9fafb;
        }

        /* ── SECTION TITLE ── */
        .cpd-sec-title {
          font-size: 0.82rem; font-weight: 700; color: #374151;
          padding: 14px 18px 12px;
          border-bottom: 1px solid #f3f4f6;
          background: #fafafa;
        }

        /* ── INFO ROWS ── */
        .cpd-row {
          display: flex; align-items: flex-start; gap: 11px;
          padding: 12px 18px;
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.1s;
        }
        .cpd-row:last-child { border-bottom: none; }
        .cpd-row:hover { background: #fafafa; }
        .cpd-icon {
          width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
        }
        .ic-v  { background: #ede9fe; }
        .ic-g  { background: #dcfce7; }
        .ic-y  { background: #fef3c7; }
        .ic-r  { background: #fee2e2; }
        .ic-p  { background: #f3e8ff; }
        .ic-b  { background: #e0f2fe; }
        .ic-em { background: #d1fae5; }
        .ic-pi { background: #ffe4e6; }
        .ic-pu { background: #ede9fe; }

        .cpd-lbl { font-size: 0.68rem; color: #9ca3af; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
        .cpd-val { font-size: 0.83rem; color: #111827; font-weight: 500; line-height: 1.5; word-break: break-word; }

        /* ── INPUTS ── */
        .cpd-input {
          width: 100%; font-size: 0.83rem; color: #111827;
          border: 1.5px solid #6366f1; border-radius: 7px;
          padding: 5px 9px; outline: none; font-family: inherit; background: #fafafa;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .cpd-input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
        .cpd-textarea {
          width: 100%; font-size: 0.83rem; color: #111827;
          border: 1.5px solid #6366f1; border-radius: 7px;
          padding: 5px 9px; outline: none; font-family: inherit;
          resize: none; min-height: 50px; background: #fafafa;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .cpd-textarea:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
        .cpd-select {
          width: 100%; font-size: 0.83rem; color: #111827;
          border: 1.5px solid #6366f1; border-radius: 7px;
          padding: 5px 9px; outline: none; font-family: inherit; background: #fafafa;
          transition: border-color 0.15s, box-shadow 0.15s;
          cursor: pointer;
        }
        .cpd-select:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }

        /* ── FILE INPUT ── */
        .cpd-file-wrap { width: 100%; }
        .cpd-file-label {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 10px; border-radius: 7px;
          border: 1.5px dashed #a5b4fc; background: #f5f3ff;
          cursor: pointer; transition: all 0.15s;
        }
        .cpd-file-label:hover { background: #ede9fe; border-color: #818cf8; }
        .cpd-file-label span { font-size: 0.78rem; color: #6366f1; font-weight: 500; }
        .cpd-file-input { display: none; }
        .cpd-file-name { font-size: 0.74rem; color: #16a34a; margin-top: 4px; font-weight: 500; }
        .cpd-photo-thumb {
          width: 40px; height: 40px; border-radius: 6px;
          object-fit: cover; border: 1px solid #e5e7eb; margin-top: 4px;
        }

        /* ── STATS ── */
        .cpd-stats { display: grid; grid-template-columns: repeat(3, 1fr); }
        .cpd-stat {
          padding: 20px 16px;
          border-right: 1px solid #f3f4f6;
        }
        .cpd-stat:last-child { border-right: none; }
        .cpd-stat-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 10px;
        }
        .si-g { background: #dcfce7; }
        .si-b { background: #dbeafe; }
        .si-a { background: #fef3c7; }
        .cpd-stat-num { font-size: 1.45rem; font-weight: 700; line-height: 1; margin-bottom: 4px; font-family: inherit; }
        .sn-g { color: #16a34a; }
        .sn-b { color: #2563eb; }
        .sn-a { color: #d97706; }
        .cpd-stat-lbl { font-size: 0.74rem; color: #6b7280; font-weight: 500; }

        /* ── RESPONSIVE ── */
        @media (max-width: 860px) {
          .cpd-grid { grid-template-columns: 1fr; }
          .cpd-content { padding: 20px 16px 40px; }
          .cpd-topbar { padding: 0 16px; }
          .cpd-stats { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div className="cpd-wrap">

        {/* STICKY TOP BAR */}
        <div className="cpd-topbar">
          <div className="cpd-topbar-left">
            <button className="cpd-back" onClick={onBack} title="Go Back"><BackIcon /></button>
            <span className="cpd-topbar-title">Clinic Profile</span>
          </div>
          <div className="cpd-btn-group">
            {isEditing ? (
              <>
                <button className="cpd-btn-cancel" onClick={onCancel} disabled={isSaving}><XIcon /> Cancel</button>
                <button className="cpd-btn-save" onClick={onSave} disabled={isSaving}>
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <SaveIcon />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button className="cpd-btn-edit" onClick={onEdit}><EditIcon /> Edit Profile</button>
            )}
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="cpd-content">
          <div className="cpd-page-title">Hospital Profile</div>
          <div className="cpd-page-sub">Manage your facility's public information and settings</div>

          <div className="cpd-grid">

            {/* ── LEFT COLUMN ── */}
            <div>

              {/* Profile Card */}
              <div className="cpd-card">
                <div className="cpd-profile">
                  <div className="cpd-avatar">
                    {photoUrls.ownerProfilePhoto
                      ? <img src={photoUrls.ownerProfilePhoto} alt="owner" />
                      : cur.name.substring(0, 2).toUpperCase()}
                  </div>
                  {isEditing ? (
                    <>
                      <input className="cpd-name-input" name="name" value={cur.name} onChange={onChange} placeholder="Clinic Name" />
                      <input className="cpd-name-input" name="branch" value={cur.branch} onChange={onChange} placeholder="Branch / Area Name" />
                    </>
                  ) : (
                    <>
                      <div className="cpd-name">{data.name}</div>
                      <div className="cpd-branch">{data.branch}</div>
                    </>
                  )}
                  <div className="cpd-role">{data.role}</div>
                  <div className="cpd-status"><span className="cpd-dot" /> Active</div>
                  {!isEditing && (
                    <button className="cpd-btn-edit" onClick={onEdit}><EditIcon /> Edit Profile</button>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="cpd-card">
                <div className="cpd-sec-title">Contact Information</div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-v"><MailIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Email</div>
                    {isEditing
                      ? <input type="email" className="cpd-input" name="email" value={cur.email} onChange={onChange} />
                      : <div className="cpd-val">{data.email || "Not Provided"}</div>}
                  </div>
                </div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-g"><PhoneIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Phone</div>
                    {isEditing
                      ? <input type="tel" className="cpd-input" name="phone" value={cur.phone} onChange={handlePhoneInput} maxLength={10} inputMode="numeric" />
                      : <div className="cpd-val">{data.phone || "Not Provided"}</div>}
                  </div>
                </div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-y"><LocIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Full Address</div>
                    {isEditing
                      ? <textarea className="cpd-textarea" name="location" value={cur.location} onChange={onChange} />
                      : <div className="cpd-val">{data.location || "Not Provided"}</div>}
                  </div>
                </div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-b"><LinkIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Google Maps Link</div>
                    {isEditing
                      ? <input type="url" className="cpd-input" name="googleMapsLink" value={cur.googleMapsLink} onChange={onChange} placeholder="https://maps.google.com/..." />
                      : <div className="cpd-val">
                          {data.googleMapsLink
                            ? <a href={data.googleMapsLink} target="_blank" rel="noreferrer" style={{color:"#2563eb",textDecoration:"underline"}}>View on Map</a>
                            : "Not Provided"}
                        </div>}
                  </div>
                </div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-pu"><CityIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">City</div>
                    {isEditing
                      ? (
                        <select className="cpd-select" name="city" value={cur.city} onChange={onChange}>
                          <option value="">Select a City</option>
                          {cities.map(city => (
                            <option key={city._id} value={city._id}>{city.name}</option>
                          ))}
                        </select>
                      )
                      : <div className="cpd-val">{getCityName(data.city) || "Not Provided"}</div>}
                  </div>
                </div>
              </div>

              {/* Owner Details */}
              <div className="cpd-card">
                <div className="cpd-sec-title">Owner Details</div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-pi"><UserIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Owner Name</div>
                    {isEditing
                      ? <input className="cpd-input" name="ownerName" value={cur.ownerName} onChange={onChange} placeholder="Owner full name" />
                      : <div className="cpd-val">{data.ownerName || "Not Provided"}</div>}
                  </div>
                </div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-g"><PhoneIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Owner Contact Number</div>
                    {isEditing
                      ? <input type="tel" className="cpd-input" name="ownerContactNumber" value={cur.ownerContactNumber} onChange={handlePhoneInput} maxLength={10} inputMode="numeric" />
                      : <div className="cpd-val">{data.ownerContactNumber || "Not Provided"}</div>}
                  </div>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN ── */}
            <div>

              {/* Clinic Statistics */}
              <div className="cpd-card">
                <div className="cpd-sec-title">Clinic Statistics</div>
                <div className="cpd-stats">
                  <div className="cpd-stat">
                    <div className="cpd-stat-icon si-g"><CalIcon /></div>
                    <div className="cpd-stat-num sn-g">{data.appointments}</div>
                    <div className="cpd-stat-lbl">Appointments</div>
                  </div>
                  <div className="cpd-stat">
                    <div className="cpd-stat-icon si-b"><PeopleIcon /></div>
                    <div className="cpd-stat-num sn-b">{data.patients}</div>
                    <div className="cpd-stat-lbl">Patients</div>
                  </div>
                  <div className="cpd-stat">
                    <div className="cpd-stat-icon si-a"><StarIcon /></div>
                    <div className="cpd-stat-num sn-a">{data.rating}</div>
                    <div className="cpd-stat-lbl">Rating</div>
                  </div>
                </div>
              </div>

              {/* Hospital Info */}
              <div className="cpd-card">
                <div className="cpd-sec-title">Hospital Information</div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-em"><InfoIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Hospital Info</div>
                    {isEditing
                      ? <input className="cpd-input" name="hospitalInfo" value={cur.hospitalInfo} onChange={onChange} placeholder="e.g., Multi-specialty hospital" />
                      : <div className="cpd-val">{data.hospitalInfo || "Not Provided"}</div>}
                  </div>
                </div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-b"><InfoIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Hospital Description</div>
                    {isEditing
                      ? <textarea className="cpd-textarea" name="hospitalDescription" value={cur.hospitalDescription} onChange={onChange} rows={3} style={{minHeight:"70px"}} />
                      : <div className="cpd-val">{data.hospitalDescription || "Not Provided"}</div>}
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="cpd-card">
                <div className="cpd-sec-title">Professional Details</div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-r"><ClockIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Working Hours</div>
                    <div className="cpd-val">{data.workingHours}</div>
                  </div>
                </div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-p"><DocIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Doctors</div>
                    <div className="cpd-val">{data.doctors} Doctor</div>
                  </div>
                </div>
              </div>

              {/* Contact Person & Attendant */}
              <div className="cpd-card">
                <div className="cpd-sec-title">Contact Person & Attendant</div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-pi"><UserIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Contact Person Name</div>
                    {isEditing
                      ? <input className="cpd-input" name="contactPersonName" value={cur.contactPersonName} onChange={onChange} placeholder="Contact person name" />
                      : <div className="cpd-val">{data.contactPersonName || "Not Provided"}</div>}
                  </div>
                </div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-v"><MailIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Contact Person Email</div>
                    {isEditing
                      ? <input type="email" className="cpd-input" name="contactPersonEmail" value={cur.contactPersonEmail} onChange={onChange} placeholder="person@hospital.com" />
                      : <div className="cpd-val">{data.contactPersonEmail || "Not Provided"}</div>}
                  </div>
                </div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-em"><UserIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Attendant Name</div>
                    {isEditing
                      ? <input className="cpd-input" name="attendantName" value={cur.attendantName} onChange={onChange} placeholder="Attendant name" />
                      : <div className="cpd-val">{data.attendantName || "Not Provided"}</div>}
                  </div>
                </div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-g"><PhoneIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Attendant Number</div>
                    {isEditing
                      ? <input type="tel" className="cpd-input" name="attendantNumber" value={cur.attendantNumber} onChange={handlePhoneInput} maxLength={10} inputMode="numeric" />
                      : <div className="cpd-val">{data.attendantNumber || "Not Provided"}</div>}
                  </div>
                </div>
              </div>

              {/* Photos */}
              <div className="cpd-card">
                <div className="cpd-sec-title">Photos & Media</div>

                {/* Owner Profile Photo */}
                <div className="cpd-row">
                  <div className="cpd-icon ic-pu"><ImageIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Owner Profile Photo</div>
                    {isEditing ? (
                      <div className="cpd-file-wrap">
                        <label className="cpd-file-label">
                          <ImageIcon />
                          <span>{ownerProfilePhoto ? ownerProfilePhoto.name : "Choose photo..."}</span>
                          <input type="file" accept="image/*" className="cpd-file-input"
                            onChange={e => { if(e.target.files[0]) setOwnerProfilePhoto(e.target.files[0]); }} />
                        </label>
                        {ownerProfilePhoto && <div className="cpd-file-name">✓ {ownerProfilePhoto.name}</div>}
                        {!ownerProfilePhoto && photoUrls.ownerProfilePhoto &&
                          <img src={photoUrls.ownerProfilePhoto} alt="owner" className="cpd-photo-thumb" />}
                      </div>
                    ) : (
                      <div className="cpd-val">
                        {photoUrls.ownerProfilePhoto
                          ? <img src={photoUrls.ownerProfilePhoto} alt="owner" className="cpd-photo-thumb" />
                          : "Not Uploaded"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hospital Front Photo */}
                <div className="cpd-row">
                  <div className="cpd-icon ic-y"><ImageIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Hospital Front Photo</div>
                    {isEditing ? (
                      <div className="cpd-file-wrap">
                        <label className="cpd-file-label">
                          <ImageIcon />
                          <span>{hospitalFrontPhoto ? hospitalFrontPhoto.name : "Choose photo..."}</span>
                          <input type="file" accept="image/*" className="cpd-file-input"
                            onChange={e => { if(e.target.files[0]) setHospitalFrontPhoto(e.target.files[0]); }} />
                        </label>
                        {hospitalFrontPhoto && <div className="cpd-file-name">✓ {hospitalFrontPhoto.name}</div>}
                        {!hospitalFrontPhoto && photoUrls.hospitalFrontPhoto &&
                          <img src={photoUrls.hospitalFrontPhoto} alt="front" className="cpd-photo-thumb" />}
                      </div>
                    ) : (
                      <div className="cpd-val">
                        {photoUrls.hospitalFrontPhoto
                          ? <img src={photoUrls.hospitalFrontPhoto} alt="front" className="cpd-photo-thumb" />
                          : "Not Uploaded"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hospital Interior Photo */}
                <div className="cpd-row">
                  <div className="cpd-icon ic-g"><ImageIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Hospital Interior Photo</div>
                    {isEditing ? (
                      <div className="cpd-file-wrap">
                        <label className="cpd-file-label">
                          <ImageIcon />
                          <span>{hospitalInteriorPhoto ? hospitalInteriorPhoto.name : "Choose photo..."}</span>
                          <input type="file" accept="image/*" className="cpd-file-input"
                            onChange={e => { if(e.target.files[0]) setHospitalInteriorPhoto(e.target.files[0]); }} />
                        </label>
                        {hospitalInteriorPhoto && <div className="cpd-file-name">✓ {hospitalInteriorPhoto.name}</div>}
                        {!hospitalInteriorPhoto && photoUrls.hospitalInteriorPhoto &&
                          <img src={photoUrls.hospitalInteriorPhoto} alt="interior" className="cpd-photo-thumb" />}
                      </div>
                    ) : (
                      <div className="cpd-val">
                        {photoUrls.hospitalInteriorPhoto
                          ? <img src={photoUrls.hospitalInteriorPhoto} alt="interior" className="cpd-photo-thumb" />
                          : "Not Uploaded"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Doctor Cabin Photo */}
                <div className="cpd-row">
                  <div className="cpd-icon ic-p"><ImageIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Doctor's Cabin Photo</div>
                    {isEditing ? (
                      <div className="cpd-file-wrap">
                        <label className="cpd-file-label">
                          <ImageIcon />
                          <span>{doctorClaimPhoto ? doctorClaimPhoto.name : "Choose photo..."}</span>
                          <input type="file" accept="image/*" className="cpd-file-input"
                            onChange={e => { if(e.target.files[0]) setDoctorClaimPhoto(e.target.files[0]); }} />
                        </label>
                        {doctorClaimPhoto && <div className="cpd-file-name">✓ {doctorClaimPhoto.name}</div>}
                        {!doctorClaimPhoto && photoUrls.doctorClaimPhoto &&
                          <img src={photoUrls.doctorClaimPhoto} alt="cabin" className="cpd-photo-thumb" />}
                      </div>
                    ) : (
                      <div className="cpd-val">
                        {photoUrls.doctorClaimPhoto
                          ? <img src={photoUrls.doctorClaimPhoto} alt="cabin" className="cpd-photo-thumb" />
                          : "Not Uploaded"}
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}