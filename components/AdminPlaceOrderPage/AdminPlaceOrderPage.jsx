"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Inject responsive CSS once
const RESPONSIVE_CSS = `
  .apo-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
  @media (max-width: 480px) {
    .apo-row2 { grid-template-columns: 1fr !important; }
    .apo-payment-modes { flex-direction: column; gap: 10px !important; }
    .apo-addr-header { flex-direction: column; align-items: flex-start !important; }
    .apo-container { max-width: 100% !important; }
    .apo-section { padding: 12px 14px !important; }
    .apo-header { padding: 12px 14px 10px !important; }
    .apo-price-row { padding: 10px 14px !important; }
    .apo-place-btn-wrapper { padding: 12px 14px 20px !important; }
    .apo-place-btn { width: 100% !important; max-width: 100% !important; }
  }
  @media (max-width: 360px) {
    .apo-addr-actions { flex-direction: column; gap: 6px; width: 100%; }
    .apo-addr-actions button { width: 100%; text-align: center; }
  }
`;

const s = {
  wrapper: {
    minHeight: "100vh",
    background: "#f5f6fa",
    display: "flex",
    justifyContent: "center",
    padding: "0",
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: 520,
    background: "#fff",
    minHeight: "100vh",
    paddingBottom: 0,
    position: "relative",
  },
  header: {
    padding: "16px 20px 12px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 10,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
    color: "#555",
    gap: 4,
    fontSize: 13,
    fontWeight: 500,
    transition: "all 0.15s",
  },
  headerTitle: { fontSize: 18, fontWeight: 600, color: "#1a1a2e", margin: 0 },
  headerSub: { fontSize: 13, color: "#888", marginTop: 2 },
  historyBtn: {
    fontSize: 13, color: "#4a6cf7", background: "none",
    border: "none", cursor: "pointer", display: "flex",
    alignItems: "center", gap: 4, whiteSpace: "nowrap", padding: 0,
  },
  section: { padding: "16px 20px" },
  sectionTitle: { fontSize: 15, fontWeight: 600, color: "#1a1a2e", marginBottom: 14 },
  field: { marginBottom: 14 },
  label: { display: "block", fontSize: 12, color: "#666", marginBottom: 5, fontWeight: 500 },
  input: {
    width: "100%", border: "1px solid #e0e0e0", borderRadius: 8,
    padding: "9px 12px", fontSize: 14, color: "#333",
    background: "#fff", outline: "none", boxSizing: "border-box",
    fontFamily: "inherit",
  },
  divider: { height: 1, background: "#f0f0f0", margin: "4px 0 14px" },
  addrLabel: { fontSize: 11, color: "#999", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" },
  enterNewBtn: {
    fontSize: 12, color: "#4a6cf7", background: "none",
    border: "1px solid #4a6cf7", borderRadius: 6, padding: "4px 10px", cursor: "pointer",
  },
  saveAddrBtn: {
    fontSize: 12, color: "#fff", background: "#4a6cf7",
    border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer",
  },
  tagGroup: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  tag: (active) => ({
    padding: "5px 16px", borderRadius: 20,
    border: `1px solid ${active ? "#4a6cf7" : "#e0e0e0"}`,
    background: active ? "#4a6cf7" : "#fff",
    color: active ? "#fff" : "#555",
    cursor: "pointer", fontSize: 13, transition: "all 0.15s",
  }),
  priceInputRow: {
    display: "flex", alignItems: "center",
    border: "1px solid #e0e0e0", borderRadius: 8, padding: "9px 12px",
  },
  priceInputRowReadonly: {
    display: "flex", alignItems: "center",
    border: "1px solid #e0e0e0", borderRadius: 8,
    padding: "9px 12px", background: "#f9f9f9",
  },
  rupee: { color: "#888", fontSize: 13, marginRight: 4 },
  innerInput: {
    border: "none", outline: "none", width: "100%",
    fontSize: 14, background: "transparent", fontFamily: "inherit",
  },
  payLabel: { display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#444", cursor: "pointer" },
  priceRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 20px", borderTop: "1px solid #eee", background: "#fafafa",
  },
  priceRowText: { fontSize: 14, color: "#555" },
  priceRowAmount: { fontSize: 16, fontWeight: 600, color: "#1a1a2e" },
  placeBtnWrapper: {
    display: "flex", justifyContent: "center",
    padding: "16px 20px 28px", background: "#fff",
  },
  placeBtn: {
    background: "#4a6cf7", color: "#fff",
    border: "none", padding: "10px 40px",
    fontSize: 14, fontWeight: 600,
    cursor: "pointer", letterSpacing: 0.3,
    borderRadius: 8, minWidth: 160,
  },
  suggBox: {
    position: "absolute", top: "100%", left: 0, right: 0,
    background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)", zIndex: 50,
    maxHeight: 160, overflowY: "auto", marginTop: 2,
  },
  suggItem: (hovered) => ({
    padding: "9px 12px", fontSize: 13, cursor: "pointer",
    color: "#333", background: hovered ? "#f0f4ff" : "#fff",
    borderBottom: "1px solid #f5f5f5",
  }),
  modalOverlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)", zIndex: 100,
    display: "flex", alignItems: "flex-end", justifyContent: "center",
  },
  modalInner: {
    background: "#fff", width: "100%", maxWidth: 520,
    borderRadius: "16px 16px 0 0", padding: 20,
    maxHeight: "60vh", overflowY: "auto",
  },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  modalTitle: { fontSize: 16, fontWeight: 600, color: "#1a1a2e" },
  closeBtn: { background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888" },
  historyItem: { padding: "10px 0", borderBottom: "1px solid #f0f0f0" },
  historyName: { fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 2 },
  historyMeta: { fontSize: 12, color: "#888" },
  emptyText: { fontSize: 13, color: "#aaa", textAlign: "center", padding: "20px 0" },
};

const AGENTS = ["Agent Ravi", "Agent Priya", "Agent Suresh", "Agent Kiran", "Agent Neha"];
const DOCTORS = ["Dr. Sharma", "Dr. Mehta", "Dr. Kapoor", "Dr. Iyer", "Dr. Reddy"];
const PRODUCTS = [
  { label: "Paracetamol 500mg", value: "2998" },
  { label: "Azithromycin 250mg", value: "1500" },
  { label: "Vitamin D3 60K", value: "3500" },
  { label: "Amoxicillin 500mg", value: "2200" },
  { label: "Metformin 500mg", value: "1800" },
];
const CONTACTS = [
  { number: "7020229934", name: "Rahul Sharma" },
  { number: "9876543210", name: "Priya Iyer" },
  { number: "8765432109", name: "Suresh Nair" },
];

function ContactTypeahead({ value, onChange, onSelect }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  const filtered = value
    ? CONTACTS.filter(
        (c) =>
          c.number.includes(value) ||
          c.name.toLowerCase().includes(value.toLowerCase())
      )
    : CONTACTS;

  return (
    <div style={{ position: "relative" }}>
      <input
        style={s.input}
        type="tel"
        maxLength={10}
        value={value}
        placeholder="Type or select number..."
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && filtered.length > 0 && (
        <div style={s.suggBox}>
          {filtered.map((c) => (
            <div
              key={c.number}
              style={s.suggItem(hovered === c.number)}
              onMouseEnter={() => setHovered(c.number)}
              onMouseLeave={() => setHovered(null)}
              onMouseDown={() => { onSelect(c); setOpen(false); }}
            >
              <span style={{ fontWeight: 600 }}>{c.number}</span>
              <span style={{ color: "#888", marginLeft: 8, fontSize: 12 }}>{c.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPlaceOrderPage() {
  const router = useRouter();

  const [patientName, setPatientName] = useState("");
  const [agentName, setAgentName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [addressTag, setAddressTag] = useState("Home");
  const [flatNo, setFlatNo] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [contactAddr, setContactAddr] = useState("");
  const [altContact, setAltContact] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [productName, setProductName] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [payMode, setPayMode] = useState("partial");
  const [amountPaid, setAmountPaid] = useState("");
  const [orderHistory, setOrderHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [patientId] = useState(13255);

  useEffect(() => {
    const id = "apo-responsive-style";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = RESPONSIVE_CSS;
      document.head.appendChild(el);
    }
  }, []);

  const finalPrice = sellingPrice
    ? (parseFloat(sellingPrice) - (parseFloat(sellingPrice) * (parseFloat(discount) || 0)) / 100).toFixed(2)
    : "0.00";

  const balanceDue =
    payMode === "cod"
      ? parseFloat(finalPrice || 0).toFixed(2)
      : payMode === "partial"
      ? Math.max(0, parseFloat(finalPrice || 0) - (parseFloat(amountPaid) || 0)).toFixed(2)
      : "0.00";

  const handleContactSelect = (c) => {
    setContactNo(c.number);
    setPatientName(c.name);
  };

  const handleProductChange = (val) => {
    setProductName(val);
    const found = PRODUCTS.find((p) => p.label === val);
    setSellingPrice(found ? found.value : "");
  };

  const clearAddress = () => {
    setFlatNo(""); setStreet(""); setLandmark("");
    setPinCode(""); setContactAddr(""); setAltContact("");
  };

  const saveAddress = () => {
    if (pinCode.length !== 6) return alert("Please enter a valid 6-digit pin code.");
    alert("Address saved successfully!");
  };

  const placeOrder = () => {
    if (!patientName.trim()) return alert("Please enter patient name.");
    if (!productName) return alert("Please select a product.");
    if (!sellingPrice) return alert("Please enter selling price.");
    const order = {
      id: `ORD-${Date.now()}`,
      patient: patientName, product: productName,
      amount: `₹${finalPrice}`, balance: `₹${balanceDue}`,
      mode: payMode, time: new Date().toLocaleString(),
    };
    setOrderHistory((prev) => [order, ...prev]);
    alert(`✅ Order placed!\nOrder ID: ${order.id}`);
    setPatientName(""); setAgentName(""); setDoctorName("");
    setProductName(""); setSellingPrice(""); setDiscount("");
    setAmountPaid(""); setContactNo(""); clearAddress();
  };

  return (
    <div style={s.wrapper}>
      <div style={s.container} className="apo-container">

        {/* Header */}
        <div style={s.header} className="apo-header">
          <div style={s.headerLeft}>
            {/* ✅ Back Button */}
            <button
              style={s.backBtn}
              onClick={() => router.back()}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f0f4ff";
                e.currentTarget.style.borderColor = "#4a6cf7";
                e.currentTarget.style.color = "#4a6cf7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.borderColor = "#e0e0e0";
                e.currentTarget.style.color = "#555";
              }}
            >
              <ArrowLeft size={15} />
              Back
            </button>
            <div>
              <h2 style={s.headerTitle}>Medicine Order</h2>
              <p style={s.headerSub}>Patient ID: {patientName ? patientId : "—"}</p>
            </div>
          </div>
          <button style={s.historyBtn} onClick={() => setShowHistory(true)}>
            🕐 Show History
          </button>
        </div>

        {/* Patient Details */}
        <div style={s.section} className="apo-section">
          <div style={s.sectionTitle}>Patient Details</div>

          <div style={s.field}>
            <label style={s.label}>Patient Name</label>
            <input style={s.input} value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="e.g., John Doe" />
          </div>

          <div className="apo-row2">
            <div style={s.field}>
              <label style={s.label}>Agent Name</label>
              <input list="agentList" style={s.input} value={agentName} onChange={(e) => setAgentName(e.target.value)} placeholder="Select or type agent..." />
              <datalist id="agentList">{AGENTS.map((a) => <option key={a} value={a} />)}</datalist>
            </div>
            <div style={s.field}>
              <label style={s.label}>Doctor Name</label>
              <input list="doctorList" style={s.input} value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="Select or type doctor..." />
              <datalist id="doctorList">{DOCTORS.map((d) => <option key={d} value={d} />)}</datalist>
            </div>
          </div>

          <div style={s.divider} />

          {/* Address */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }} className="apo-addr-header">
            <span style={s.addrLabel}>Delivery Address</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="apo-addr-actions">
              <button style={s.enterNewBtn} onClick={clearAddress}>↩ Enter New Address</button>
              <button style={s.saveAddrBtn} onClick={saveAddress}>Save Address</button>
            </div>
          </div>

          <div style={s.tagGroup}>
            {["Home", "Office", "Other"].map((tag) => (
              <button key={tag} style={s.tag(addressTag === tag)} onClick={() => setAddressTag(tag)}>{tag}</button>
            ))}
          </div>

          <div className="apo-row2">
            <div style={s.field}>
              <label style={s.label}>Flat No / House No</label>
              <input style={s.input} value={flatNo} onChange={(e) => setFlatNo(e.target.value)} placeholder="Enter" />
            </div>
            <div style={s.field}>
              <label style={s.label}>Street / Area</label>
              <input style={s.input} value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Enter" />
            </div>
          </div>

          <div className="apo-row2">
            <div style={s.field}>
              <label style={s.label}>Landmark</label>
              <input style={s.input} value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Enter" />
            </div>
            <div style={s.field}>
              <label style={s.label}>Pin Code</label>
              <input style={s.input} value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="Enter" maxLength={6} />
            </div>
          </div>

          <div className="apo-row2" style={{ marginBottom: 0 }}>
            <div style={s.field}>
              <label style={s.label}>Contact Number</label>
              <input style={s.input} value={contactAddr} onChange={(e) => setContactAddr(e.target.value)} placeholder="Enter contact" maxLength={10} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Alternate Contact</label>
              <input style={s.input} value={altContact} onChange={(e) => setAltContact(e.target.value)} placeholder="Enter alternate" maxLength={10} />
            </div>
          </div>
        </div>

        <div style={s.divider} />

        {/* Order & Payment */}
        <div style={s.section} className="apo-section">
          <div style={s.sectionTitle}>Order & Payment</div>

          <div style={s.field}>
            <label style={s.label}>Contact No</label>
            <ContactTypeahead
              value={contactNo}
              onChange={(val) => setContactNo(val)}
              onSelect={handleContactSelect}
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Product Name</label>
            <input
              list="productList" style={s.input} value={productName}
              onChange={(e) => handleProductChange(e.target.value)}
              placeholder="Select a product..."
            />
            <datalist id="productList">{PRODUCTS.map((p) => <option key={p.label} value={p.label} />)}</datalist>
          </div>

          <div style={s.field}>
            <label style={s.label}>Medication Selling Price</label>
            <div style={s.priceInputRow}>
              <span style={s.rupee}>₹</span>
              <input type="number" style={s.innerInput} value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="e.g., 2998" />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Discount</label>
            <div style={s.priceInputRow}>
              <input type="number" style={s.innerInput} value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="e.g., 10" />
              <span style={s.rupee}>%</span>
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Final Price</label>
            <div style={s.priceInputRowReadonly}>
              <span style={s.rupee}>₹</span>
              <input type="number" style={{ ...s.innerInput, background: "#f9f9f9" }} value={finalPrice} readOnly />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Payment Mode</label>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }} className="apo-payment-modes">
              {[{ val: "prepaid", label: "Pre-paid" }, { val: "cod", label: "COD" }, { val: "partial", label: "Partial Payment" }].map(({ val, label }) => (
                <label key={val} style={s.payLabel}>
                  <input type="radio" name="payMode" value={val} checked={payMode === val} onChange={() => setPayMode(val)} style={{ accentColor: "#4a6cf7" }} />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {payMode !== "cod" && (
            <div style={s.field}>
              <label style={s.label}>Amount Paid (Pre-paid)</label>
              <div style={s.priceInputRow}>
                <span style={s.rupee}>₹</span>
                <input type="number" style={s.innerInput} value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} placeholder="0" />
              </div>
            </div>
          )}
        </div>

        {/* Balance Row */}
        <div style={s.priceRow} className="apo-price-row">
          <span style={s.priceRowText}>Balance Due (COD):</span>
          <strong style={s.priceRowAmount}>₹ {balanceDue}</strong>
        </div>

        {/* Place Order Button */}
        <div style={s.placeBtnWrapper} className="apo-place-btn-wrapper">
          <button style={s.placeBtn} className="apo-place-btn" onClick={placeOrder}>
            Place Order
          </button>
        </div>

        {/* History Modal */}
        {showHistory && (
          <div style={s.modalOverlay} onClick={() => setShowHistory(false)}>
            <div style={s.modalInner} onClick={(e) => e.stopPropagation()}>
              <div style={s.modalHeader}>
                <span style={s.modalTitle}>Order History</span>
                <button style={s.closeBtn} onClick={() => setShowHistory(false)}>✕</button>
              </div>
              {orderHistory.length === 0 ? (
                <p style={s.emptyText}>No orders placed yet.</p>
              ) : (
                orderHistory.map((o) => (
                  <div key={o.id} style={s.historyItem}>
                    <div style={s.historyName}>{o.patient} — {o.product}</div>
                    <div style={s.historyMeta}>{o.amount} · Balance: {o.balance} · {o.mode.toUpperCase()} · {o.time}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}