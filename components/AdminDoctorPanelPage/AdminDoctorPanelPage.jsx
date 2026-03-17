"use client"
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { adminTeleconsultationService } from '@/app/services/admin/adminTeleconsultation.service'
import { toast } from 'sonner'
import { Loader2, X } from 'lucide-react'

const CONSULTATION_STATUS_OPTIONS = [
  { label: 'Reschedule', count: 6, color: '#f0f4ff', border: '#c5d0f5', text: '#3b5bdb' },
  { label: 'Complete',   count: 3, color: '#e8f5e9', border: '#a5d6a7', text: '#2e7d32' },
  { label: 'Cancelled',  count: 0, color: '#fce4ec', border: '#f48fb1', text: '#c62828' },
  { label: 'Follow UP',  count: 6, color: '#f0f4ff', border: '#c5d0f5', text: '#3b5bdb' },
  { label: 'Time out',   count: 0, color: '#fff8e1', border: '#ffe082', text: '#f57f17' },
  { label: 'other',      count: 0, color: '#fff8e1', border: '#ffe082', text: '#f57f17' },
]

const CUSTOMER_SELL_OPTIONS = [
  { label: 'May be',         count: 6, color: '#f0f4ff', border: '#c5d0f5', text: '#3b5bdb' },
  { label: 'Placed',         count: 3, color: '#e8f5e9', border: '#a5d6a7', text: '#2e7d32' },
  { label: 'Interested',     count: 3, color: '#e8f5e9', border: '#a5d6a7', text: '#2e7d32' },
  { label: 'Not-Interested', count: 0, color: '#fce4ec', border: '#f48fb1', text: '#c62828' },
  { label: 'Future',         count: 0, color: '#fff8e1', border: '#ffe082', text: '#f57f17' },
  { label: '50-50',          count: 0, color: '#fff8e1', border: '#ffe082', text: '#f57f17' },
  { label: 'Time pass',      count: 6, color: '#f0f4ff', border: '#c5d0f5', text: '#3b5bdb' },
]

const ChipSelector = ({ options, selected, onSelect }) => (
  <div style={chipStyles.wrapper}>
    {options.map((opt) => {
      const isSelected = selected === opt.label
      return (
        <button
          key={opt.label}
          type="button"
          onClick={() => onSelect(opt.label)}
          style={{
            ...chipStyles.chip,
            background: isSelected ? opt.color : '#fff',
            border: `1.5px solid ${isSelected ? opt.border : '#d0d5dd'}`,
            color: isSelected ? opt.text : '#444',
            boxShadow: isSelected ? `0 0 0 2px ${opt.border}55` : 'none',
            fontWeight: isSelected ? '700' : '500',
          }}
        >
          <span style={{ ...chipStyles.count, color: isSelected ? opt.text : '#999' }}>
            {String(opt.count).padStart(2, '0')}
          </span>
          {opt.label}
        </button>
      )
    })}
  </div>
)

const chipStyles = {
  wrapper: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  chip: {
    display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '8px',
    padding: '6px 12px', fontSize: '12.5px', cursor: 'pointer', transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  },
  count: { fontSize: '11px', fontWeight: '700', minWidth: '18px' },
}

const AdminDoctorPanalPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const recordId = searchParams.get('recordId')

  // To dynamically handle `/admin` vs `/super-admin`
  const basePath = pathname.startsWith('/super-admin') ? '/super-admin' : '/admin';

  // --- Data States ---
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [patientDetails, setPatientDetails] = useState(null)
  const [bookingDetails, setBookingDetails] = useState(null)

  // --- Form States ---
  const [consultedBy, setConsultedBy] = useState('')
  const [consultationStatus, setConsultationStatus] = useState('')
  const [customerSellResponse, setCustomerSellResponse] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpTime, setFollowUpTime] = useState('')
  const [consultationNotes, setConsultationNotes] = useState('')
  const [testsAdvised, setTestsAdvised] = useState('')
  
  // File States
  const [prescriptionFile, setPrescriptionFile] = useState(null)
  const [existingPrescription, setExistingPrescription] = useState(null) 
  
  // Modal State
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Computed Logic for Blocked Status
  const isRescheduleBlocked = consultationStatus === 'Cancelled' || consultationStatus === 'Complete';

  // Fetch Data on Load
  useEffect(() => {
    if (!recordId) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await adminTeleconsultationService.getBookingDetails(recordId);
        if (res.success && res.data) {
          const { patientDetails: pd, bookingDetails: bd, consultationPanel: cp } = res.data;
          setPatientDetails(pd);
          setBookingDetails(bd);

          if (cp.consultedByDoctor) setConsultedBy(cp.consultedByDoctor);
          if (cp.consultationStatus && cp.consultationStatus !== 'New') setConsultationStatus(cp.consultationStatus);
          if (cp.sellResponse && cp.sellResponse !== '--') setCustomerSellResponse(cp.sellResponse);
          if (cp.followUpDate) setFollowUpDate(cp.followUpDate.split('T')[0]); 
          if (cp.followUpTime) setFollowUpTime(cp.followUpTime);
          if (cp.consultationNotes) setConsultationNotes(cp.consultationNotes);
          if (cp.testsAdvised) setTestsAdvised(cp.testsAdvised);
          if (cp.prescription) setExistingPrescription(cp.prescription);

        } else {
          toast.error(res.message || "Failed to load data");
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred while fetching booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [recordId]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPrescriptionFile(e.target.files[0])
    }
  }

  const handlePreviewFile = () => {
    if (!existingPrescription) return;
    setShowPreviewModal(true);
  }

  const handleDownloadFile = async () => {
    if (!existingPrescription) return;
    setIsDownloading(true);

    try {
      const response = await fetch(existingPrescription);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      const fileName = existingPrescription.split('/').pop().split('?')[0] || `prescription_${patientDetails?.name || 'patient'}`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      window.open(existingPrescription, '_blank');
    } finally {
      setIsDownloading(false);
    }
  }

  const handleSave = async () => {
    if (!recordId) {
      toast.error("Invalid Record ID");
      return;
    }
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("consultedByDoctor", consultedBy || "");
      formData.append("consultationStatus", consultationStatus || "");
      formData.append("sellResponse", customerSellResponse || "");
      formData.append("followUpDate", followUpDate || "");
      formData.append("followUpTime", followUpTime || "");
      formData.append("consultationNotes", consultationNotes || "");
      formData.append("testsAdvised", testsAdvised || "");

      if (prescriptionFile) {
        formData.append("prescription", prescriptionFile);
      }

      const res = await adminTeleconsultationService.updateDoctorPanelDetails(recordId, formData);
      if (res.success) {
        toast.success("Consultation Details Saved Successfully!");
        if (prescriptionFile) {
           setExistingPrescription(URL.createObjectURL(prescriptionFile));
           setPrescriptionFile(null); 
        }
      } else {
        toast.error(res.message || "Failed to save details");
      }
    } catch (error) {
      toast.error("Failed to communicate with the server");
    } finally {
      setIsSaving(false);
    }
  }

  // ✅ UPDATED TO REDIRECT TO PLACE ORDER PAGE
  const handlePlaceOrder = () => {
    if (!recordId) {
      toast.error("No record found to place order");
      return;
    }
    router.push(`${basePath}/teleconsultation/placeorder?recordId=${recordId}`);
  }

  const handleReschedule = () => {
    if (isRescheduleBlocked) {
      toast.error(`${consultationStatus} appointments cannot be rescheduled.`);
      return;
    }

    if (!recordId) {
      toast.error("No record found to reschedule");
      return;
    }

    const patientUserId = patientDetails?.userId || patientDetails?.id;
    if (!patientUserId) {
      toast.error("Could not find Patient User ID");
      return;
    }

    router.push(
      `/free-consultation?rescheduleRecordId=${recordId}&userId=${patientUserId}&admin_booking=true`
    );
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to clear the form?')) {
      setConsultationNotes('')
      setTestsAdvised('')
      setFollowUpDate('')
      setFollowUpTime('')
      setPrescriptionFile(null)
    }
  }

  const formatDateTime = (isoString) => {
    if (!isoString) return '--'
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }
  
  const formatDateOnly = (isoString) => {
    if (!isoString) return '--'
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const renderPreviewContent = () => {
    if (!existingPrescription) return null;
    const ext = existingPrescription.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
    const isPdf = ext === 'pdf';

    if (isImage) {
      return <img src={existingPrescription} alt="Prescription" style={styles.previewImage} />;
    } else if (isPdf) {
      return <iframe src={existingPrescription} style={styles.previewIframe} title="PDF Preview" />;
    } else {
      const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(existingPrescription)}&embedded=true`;
      return <iframe src={googleViewerUrl} style={styles.previewIframe} title="Document Preview" />;
    }
  };

  if (loading) {
    return (
      <div style={{...styles.page, alignItems: 'center', justifyContent: 'center'}}>
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p style={{marginTop: '10px', color: '#555', fontWeight: '500'}}>Loading patient data...</p>
      </div>
    )
  }

  if (!patientDetails || !bookingDetails) {
    return (
      <div style={{...styles.page, alignItems: 'center', justifyContent: 'center'}}>
        <p style={{color: '#555', fontWeight: '500'}}>Booking details not found.</p>
        <button style={{...styles.btnCancel, marginTop: '10px'}} onClick={() => router.back()}>Go Back</button>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.backRow}>
          <button style={styles.backBtn} onClick={() => router.back()}>
            ← Back
          </button>
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Patient Details <span style={styles.titleNote}>(For Doctor)</span></h2>
          <div style={styles.divider} />
          <div style={styles.grid}>
            <InfoRow label="Patient ID:" value={patientDetails.customerId} />
            <InfoRow label="Name:" value={patientDetails.name} />
            <InfoRow label="Age:" value={patientDetails.age} />
            <InfoRow label="Contact:" value={`${patientDetails.contact}${patientDetails.email !== '--' ? `, ${patientDetails.email}` : ''}`} />
            <InfoRow label="Location:" value={patientDetails.city} />
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Booking Details</h2>
          <div style={styles.divider} />
          <div style={styles.grid}>
            <InfoRow label="Request ID:" value={bookingDetails.requestId} />
            <InfoRow label="Booking Date:" value={formatDateTime(bookingDetails.bookingDate)} />
            <InfoRow label="Appointment:" value={`${formatDateOnly(bookingDetails.appointmentDate)}, ${bookingDetails.timeSlot}`} />
            <InfoRow label="Agent:" value={bookingDetails.agentName} />
            <div style={styles.infoRow}>
              <span style={styles.label}>Status:</span>
              <span style={styles.badge}>{bookingDetails.consultationStatus || 'New'}</span>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Consultation Panel</h2>
          <div style={styles.divider} />

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Consulted by (Doctor)</label>
            <input
              style={styles.input}
              value={consultedBy}
              onChange={(e) => setConsultedBy(e.target.value)}
              placeholder="Doctor name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Consultation Status</label>
            <ChipSelector
              options={CONSULTATION_STATUS_OPTIONS}
              selected={consultationStatus}
              onSelect={setConsultationStatus}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Customer Sell Response</label>
            <ChipSelector
              options={CUSTOMER_SELL_OPTIONS}
              selected={customerSellResponse}
              onSelect={setCustomerSellResponse}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Follow-up Date & Time <span style={styles.optional}>(Optional)</span></label>
            <div style={styles.dateTimeRow}>
              <input type="date" style={{ ...styles.input, flex: 1 }} value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
              <input type="time" style={{ ...styles.input, flex: 1 }} value={followUpTime} onChange={(e) => setFollowUpTime(e.target.value)} />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Consultation Notes</label>
            <textarea style={styles.textarea} value={consultationNotes} onChange={(e) => setConsultationNotes(e.target.value)} placeholder="TYPE OF MEDICATION AND PRICE WITH DISCOUNT ANY OTHER NOTES" rows={4} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Tests Advised</label>
            <textarea style={styles.textarea} value={testsAdvised} onChange={(e) => setTestsAdvised(e.target.value)} placeholder="e.g., CBC, Lipid Profile, HbA1c" rows={3} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Upload Prescription</label>
            <div style={styles.uploadRow}>
              <label style={styles.uploadBtn}>
                <span>⬆ Upload File</span>
                <input type="file" style={{ display: 'none' }} onChange={handleFileChange} />
              </label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={styles.fileName}>
                  {prescriptionFile ? prescriptionFile.name : (existingPrescription ? 'File Uploaded' : 'No file selected')}
                </span>

                {existingPrescription && !prescriptionFile && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" onClick={handlePreviewFile} style={styles.previewBtn} title="View Uploaded File">👁️ Preview</button>
                    <button type="button" onClick={handleDownloadFile} style={{...styles.previewBtn, background: '#f8fafc'}} title="Download File" disabled={isDownloading}>
                      {isDownloading ? '⏳...' : '⬇️ Download'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div style={styles.actionRow}>
          <button style={styles.btnCancel} onClick={handleCancel}>Cancel</button>
          
          <button 
            style={{
              ...styles.btnReschedule,
              ...(isRescheduleBlocked ? styles.btnDisabled : {})
            }} 
            onClick={handleReschedule}
            title={isRescheduleBlocked ? `${consultationStatus} bookings cannot be rescheduled` : ""}
          >
            Reschedule Booking
          </button>

          <button style={styles.btnPlaceOrder} onClick={handlePlaceOrder}>Place Order</button>
          <button 
            style={{...styles.btnSave, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer'}} 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {showPreviewModal && (
        <div style={styles.modalOverlay} onClick={() => setShowPreviewModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1a1a2e' }}>Document Preview</h3>
              <button style={styles.modalCloseBtn} onClick={() => setShowPreviewModal(false)}><X size={22} /></button>
            </div>
            <div style={styles.modalBody}>{renderPreviewContent()}</div>
          </div>
        </div>
      )}
    </div>
  )
}

const InfoRow = ({ label, value }) => (
  <div style={styles.infoRow}>
    <span style={styles.label}>{label}</span>
    <span style={styles.value}>{value}</span>
  </div>
)

const styles = {
  backRow: { marginBottom: '16px' },
  backBtn: { background: 'none', border: 'none', color: '#3b5bdb', fontSize: '14px', fontWeight: '600', cursor: 'pointer', padding: '4px 0', display: 'inline-flex', alignItems: 'center', gap: '4px' },
  page: { minHeight: '100vh', background: '#f4f6f9', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  card: { background: '#fff', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.10)', width: '100%', maxWidth: '520px', padding: '24px 20px' },
  section: { marginBottom: '28px' },
  sectionTitle: { fontSize: '17px', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px' },
  titleNote: { fontWeight: '400', color: '#555', fontSize: '14px' },
  divider: { height: '1px', background: '#e8eaf0', marginBottom: '14px' },
  grid: { display: 'flex', flexDirection: 'column', gap: '8px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', fontSize: '13.5px' },
  label: { color: '#777', minWidth: '100px', fontWeight: '500' },
  value: { color: '#1a1a2e', textAlign: 'right', flex: 1 },
  badge: { background: '#e8f5e9', color: '#388e3c', borderRadius: '20px', padding: '2px 14px', fontSize: '12px', fontWeight: '600', border: '1px solid #a5d6a7' },
  formGroup: { marginBottom: '16px' },
  formLabel: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '6px' },
  optional: { fontWeight: '400', color: '#999', fontSize: '12px' },
  input: { width: '100%', border: '1px solid #dde1ea', borderRadius: '7px', padding: '9px 12px', fontSize: '13.5px', color: '#1a1a2e', background: '#fafbfc', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', border: '1px solid #dde1ea', borderRadius: '7px', padding: '9px 12px', fontSize: '13px', color: '#1a1a2e', background: '#fafbfc', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' },
  dateTimeRow: { display: 'flex', gap: '10px' },
  uploadRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  uploadBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0f4ff', color: '#3b5bdb', border: '1px solid #c5d0f5', borderRadius: '7px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' },
  fileName: { fontSize: '12.5px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  previewBtn: { background: '#fff', color: '#3b5bdb', border: '1px solid #c5d0f5', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' },
  actionRow: { display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid #eef0f5' },
  btnCancel: { background: '#fff', color: '#555', border: '1px solid #d0d5dd', borderRadius: '8px', padding: '9px 18px', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' },
  
  btnReschedule: { background: '#fff', color: '#3b5bdb', border: '1.5px solid #3b5bdb', borderRadius: '8px', padding: '9px 18px', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer', transition: '0.2s' },
  btnDisabled: { background: '#f5f5f5', color: '#999', border: '1.5px solid #d0d5dd', cursor: 'not-allowed', opacity: 0.6 },
  
  btnPlaceOrder: { background: '#3b5bdb', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' },
  btnSave: { background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 24px', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  modalContent: { background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '850px', height: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #eee', background: '#f8fafc' },
  modalCloseBtn: { background: '#fee2e2', border: 'none', color: '#ef4444', borderRadius: '50%', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalBody: { flex: 1, padding: '20px', background: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  previewImage: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  previewIframe: { width: '100%', height: '100%', border: 'none', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
}

export default AdminDoctorPanalPage