"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// ✅ IMPORT YOUR API SERVICES
import { getMeClinicProfile, updateClinicProfile } from "@/app/services/hospitalProfile.service";

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

export default function ClinicProfileDesktop() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [data, setData] = useState({
    name: "MEN10 SEXUAL HEALTH CLINIC",
    branch: "",
    role: "Administrator",
    email: "",
    phone: "",
    location: "",
    workingHours: "Mon - Fri: 9:00 AM - 6:00 PM",
    doctors: "8 Specialist Doctors",
    appointments: "1,234",
    patients: "892",
    rating: "4.8",
  });
  
  const [temp, setTemp] = useState(data);

  // ✅ FETCH CLINIC DATA ON MOUNT
  useEffect(() => {
    const fetchClinicData = async () => {
      setIsLoading(true);
      try {
        const response = await getMeClinicProfile();
        
        if (response.success && response.data) {
          const clinic = response.data;
          
          setData(prev => ({
            ...prev,
            name: clinic.clinicName || "MEN10 CLINIC",
            branch: clinic.areaName || "",
            email: clinic.clinicEmail || "",
            phone: clinic.officeCallingNo || "",
            location: clinic.fulladdress || "",
            // Mock data overrides:
            appointments: clinic.appointmentsCount || prev.appointments,
            patients: clinic.patientsCount || prev.patients,
          }));
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
  
  const onEdit = () => { 
    setTemp(data); 
    setIsEditing(true); 
  };
  
  const onCancel = () => setIsEditing(false);
  
  // ✅ SAVE DATA API CALL
  const onSave = async () => {
    setIsSaving(true);
    
    // Create FormData since your backend router uses multer upload.fields
    const formData = new FormData();
    formData.append("clinicName", temp.name);
    formData.append("areaName", temp.branch);
    formData.append("clinicEmail", temp.email);
    formData.append("officeCallingNo", temp.phone);
    formData.append("fulladdress", temp.location);

    try {
      const response = await updateClinicProfile(formData);
      
      if (response.success) {
        setData(temp); // Update local state with new changes
        setIsEditing(false);
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
  
  // Actionable Back Function
  const onBack = () => {
    if (isEditing) {
        if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
            window.history.back();
        }
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
        .cpd-content {
          padding: 28px 32px 48px;
        }
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
        }
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
        .ic-v { background: #ede9fe; }
        .ic-g { background: #dcfce7; }
        .ic-y { background: #fef3c7; }
        .ic-r { background: #fee2e2; }
        .ic-p { background: #f3e8ff; }

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

        /* ── STATS ── */
        .cpd-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
        }
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

              {/* Profile */}
              <div className="cpd-card">
                <div className="cpd-profile">
                  <div className="cpd-avatar">
                    {cur.name.substring(0, 2).toUpperCase()}
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
                      ? <input type="tel" className="cpd-input" name="phone" value={cur.phone} onChange={onChange} />
                      : <div className="cpd-val">{data.phone || "Not Provided"}</div>}
                  </div>
                </div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-y"><LocIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Location</div>
                    {isEditing
                      ? <textarea className="cpd-textarea" name="location" value={cur.location} onChange={onChange} />
                      : <div className="cpd-val">{data.location || "Not Provided"}</div>}
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

              {/* Professional Details */}
              <div className="cpd-card">
                <div className="cpd-sec-title">Professional Details</div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-r"><ClockIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Working Hours</div>
                    {isEditing
                      ? <input className="cpd-input" name="workingHours" value={cur.workingHours} onChange={onChange} readOnly title="Working hours managed via Timings Module" />
                      : <div className="cpd-val">{data.workingHours}</div>}
                  </div>
                </div>
                <div className="cpd-row">
                  <div className="cpd-icon ic-p"><DocIcon /></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="cpd-lbl">Doctors</div>
                    {isEditing
                      ? <input className="cpd-input" name="doctors" value={cur.doctors} onChange={onChange} readOnly title="Doctors managed via Team Module" />
                      : <div className="cpd-val">{data.doctors}</div>}
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