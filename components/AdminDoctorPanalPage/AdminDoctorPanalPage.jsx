"use client"
import React, { useState } from 'react'

const CONSULTATION_STATUS_OPTIONS = [
  { label: 'Reschedule', count: 6, color: '#f0f4ff', border: '#c5d0f5', text: '#3b5bdb' },
  { label: 'Complete',   count: 3, color: '#e8f5e9', border: '#a5d6a7', text: '#2e7d32' },
  { label: 'Canceled',   count: 0, color: '#fce4ec', border: '#f48fb1', text: '#c62828' },
  { label: 'Follow UP',  count: 6, color: '#f0f4ff', border: '#c5d0f5', text: '#3b5bdb' },
  { label: 'Time out',   count: 0, color: '#fff8e1', border: '#ffe082', text: '#f57f17' },
  { label: 'other',      count: 0, color: '#fff8e1', border: '#ffe082', text: '#f57f17' },
]

const CUSTOMER_SELL_OPTIONS = [
  { label: 'May be',        count: 6, color: '#f0f4ff', border: '#c5d0f5', text: '#3b5bdb' },
  { label: 'Placed',        count: 3, color: '#e8f5e9', border: '#a5d6a7', text: '#2e7d32' },
  { label: 'Interested',    count: 3, color: '#e8f5e9', border: '#a5d6a7', text: '#2e7d32' },
  { label: 'Not-Interested',count: 0, color: '#fce4ec', border: '#f48fb1', text: '#c62828' },
  { label: 'Future',        count: 0, color: '#fff8e1', border: '#ffe082', text: '#f57f17' },
  { label: '50-50',         count: 0, color: '#fff8e1', border: '#ffe082', text: '#f57f17' },
  { label: 'Time pass',     count: 6, color: '#f0f4ff', border: '#c5d0f5', text: '#3b5bdb' },
]

const ChipSelector = ({ options, selected, onSelect }) => (
  <div style={chipStyles.wrapper}>
    {options.map((opt) => {
      const isSelected = selected === opt.label
      return (
        <button
          key={opt.label}
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
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '12.5px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  },
  count: {
    fontSize: '11px',
    fontWeight: '700',
    minWidth: '18px',
  },
}

const AdminDoctorPanalPage = () => {
  const [consultedBy, setConsultedBy] = useState('Dr. Aditya Aswar')
  const [consultationStatus, setConsultationStatus] = useState('Complete')
  const [customerSellResponse, setCustomerSellResponse] = useState('Interested')
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpTime, setFollowUpTime] = useState('')
  const [consultationNotes, setConsultationNotes] = useState('')
  const [testsAdvised, setTestsAdvised] = useState('')
  const [prescriptionFile, setPrescriptionFile] = useState(null)

  const patientDetails = {
    patientId: '#13255',
    name: 'Sheetal Dayal',
    age: 50,
    contact: '9973827100, sheetal@xyz.com',
    location: 'Nagpur',
  }

  const bookingDetails = {
    requestId: '#AMB2914',
    bookingDate: 'Nov 14, 2025, 10:30 AM',
    appointment: 'Nov 14, 2025, 11:00 AM',
    agent: 'Shruti Tiwari',
    status: 'New',
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPrescriptionFile(e.target.files[0])
    }
  }

  const handleSave = () => {
    const data = {
      consultedBy,
      consultationStatus,
      customerSellResponse,
      followUpDate,
      followUpTime,
      consultationNotes,
      testsAdvised,
      prescriptionFile: prescriptionFile?.name || null,
    }
    alert('Saved successfully!\n' + JSON.stringify(data, null, 2))
  }

  const handlePlaceOrder = () => {
    alert('Order placed for patient: ' + patientDetails.name)
  }

  const handleReschedule = () => {
    alert('Reschedule booking for Request ID: ' + bookingDetails.requestId)
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel?')) {
      setConsultationNotes('')
      setTestsAdvised('')
      setFollowUpDate('')
      setFollowUpTime('')
      setPrescriptionFile(null)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Back Button */}
        <div style={styles.backRow}>
          <button style={styles.backBtn} onClick={() => window.history.back()}>
            ← Back
          </button>
        </div>

        {/* Patient Details */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Patient Details <span style={styles.titleNote}>(For Doctor)</span></h2>
          <div style={styles.divider} />
          <div style={styles.grid}>
            <InfoRow label="Patient ID:" value={patientDetails.patientId} />
            <InfoRow label="Name:" value={patientDetails.name} />
            <InfoRow label="Age:" value={patientDetails.age} />
            <InfoRow label="Contact:" value={patientDetails.contact} />
            <InfoRow label="Location:" value={patientDetails.location} />
          </div>
        </section>

        {/* Booking Details */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Booking Details</h2>
          <div style={styles.divider} />
          <div style={styles.grid}>
            <InfoRow label="Request ID:" value={bookingDetails.requestId} />
            <InfoRow label="Booking Date:" value={bookingDetails.bookingDate} />
            <InfoRow label="Appointment:" value={bookingDetails.appointment} />
            <InfoRow label="Agent:" value={bookingDetails.agent} />
            <div style={styles.infoRow}>
              <span style={styles.label}>Status:</span>
              <span style={styles.badge}>{bookingDetails.status}</span>
            </div>
          </div>
        </section>

        {/* Consultation Panel */}
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
              <input
                type="date"
                style={{ ...styles.input, flex: 1 }}
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
              <input
                type="time"
                style={{ ...styles.input, flex: 1 }}
                value={followUpTime}
                onChange={(e) => setFollowUpTime(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Consultation Notes</label>
            <textarea
              style={styles.textarea}
              value={consultationNotes}
              onChange={(e) => setConsultationNotes(e.target.value)}
              placeholder="TYPE OF MEDICATION AND PRICE WITH DISCOUNT ANY OTHER NOTES"
              rows={4}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Tests Advised</label>
            <textarea
              style={styles.textarea}
              value={testsAdvised}
              onChange={(e) => setTestsAdvised(e.target.value)}
              placeholder="e.g., CBC, Lipid Profile, HbA1c"
              rows={3}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Upload Prescription</label>
            <div style={styles.uploadRow}>
              <label style={styles.uploadBtn}>
                <span>⬆ Upload File</span>
                <input type="file" style={{ display: 'none' }} onChange={handleFileChange} />
              </label>
              <span style={styles.fileName}>
                {prescriptionFile ? prescriptionFile.name : 'No file selected'}
              </span>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div style={styles.actionRow}>
          <button style={styles.btnCancel} onClick={handleCancel}>Cancel</button>
          <button style={styles.btnReschedule} onClick={handleReschedule}>Reschedule Booking</button>
          <button style={styles.btnPlaceOrder} onClick={handlePlaceOrder}>Place Order</button>
          <button style={styles.btnSave} onClick={handleSave}>Save</button>
        </div>

      </div>
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
  backRow: {
    marginBottom: '16px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#3b5bdb',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '4px 0',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  page: {
    minHeight: '100vh',
    background: '#f4f6f9',
    display: 'flex',
    justifyContent: 'center',
    padding: '24px 16px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
    width: '100%',
    maxWidth: '520px',
    padding: '24px 20px',
  },
  section: {
    marginBottom: '28px',
  },
  sectionTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '6px',
  },
  titleNote: {
    fontWeight: '400',
    color: '#555',
    fontSize: '14px',
  },
  divider: {
    height: '1px',
    background: '#e8eaf0',
    marginBottom: '14px',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '13.5px',
  },
  label: {
    color: '#777',
    minWidth: '100px',
    fontWeight: '500',
  },
  value: {
    color: '#1a1a2e',
    textAlign: 'right',
    flex: 1,
  },
  badge: {
    background: '#e8f5e9',
    color: '#388e3c',
    borderRadius: '20px',
    padding: '2px 14px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid #a5d6a7',
  },
  formGroup: {
    marginBottom: '16px',
  },
  formLabel: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#444',
    marginBottom: '6px',
  },
  optional: {
    fontWeight: '400',
    color: '#999',
    fontSize: '12px',
  },
  input: {
    width: '100%',
    border: '1px solid #dde1ea',
    borderRadius: '7px',
    padding: '9px 12px',
    fontSize: '13.5px',
    color: '#1a1a2e',
    background: '#fafbfc',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.2s',
  },
  textarea: {
    width: '100%',
    border: '1px solid #dde1ea',
    borderRadius: '7px',
    padding: '9px 12px',
    fontSize: '13px',
    color: '#1a1a2e',
    background: '#fafbfc',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  dateTimeRow: {
    display: 'flex',
    gap: '10px',
  },
  uploadRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  uploadBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: '#f0f4ff',
    color: '#3b5bdb',
    border: '1px solid #c5d0f5',
    borderRadius: '7px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  fileName: {
    fontSize: '12.5px',
    color: '#888',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  actionRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    paddingTop: '8px',
    borderTop: '1px solid #eef0f5',
  },
  btnCancel: {
    background: '#fff',
    color: '#555',
    border: '1px solid #d0d5dd',
    borderRadius: '8px',
    padding: '9px 18px',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnReschedule: {
    background: '#fff',
    color: '#3b5bdb',
    border: '1.5px solid #3b5bdb',
    borderRadius: '8px',
    padding: '9px 18px',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnPlaceOrder: {
    background: '#3b5bdb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '9px 18px',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnSave: {
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '9px 24px',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer',
  },
}

export default AdminDoctorPanalPage