"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminOrderService } from "@/app/services/admin/adminOrder.service";
import { adminAddressService } from '@/app/services/admin/adminAddress.service'; 
import { getCustomerOrderHistory, getCustomerActivities } from '@/app/services/admin/leads.service'; // ✅ IMPORTED HISTORY APIs

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
    minHeight: "100vh", background: "#f5f6fa", display: "flex", justifyContent: "center",
    padding: "0", fontFamily: "'Segoe UI', sans-serif",
  },
  container: {
    width: "100%", maxWidth: 520, background: "#fff", minHeight: "100vh",
    paddingBottom: 0, position: "relative",
  },
  header: {
    padding: "16px 20px 12px", borderBottom: "1px solid #eee", display: "flex",
    justifyContent: "space-between", alignItems: "flex-start", position: "sticky",
    top: 0, background: "#fff", zIndex: 10,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 10 },
  backBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", background: "none",
    border: "1px solid #e0e0e0", borderRadius: 8, padding: "6px 10px", cursor: "pointer",
    color: "#555", gap: 4, fontSize: 13, fontWeight: 500, transition: "all 0.15s",
  },
  headerTitle: { fontSize: 18, fontWeight: 600, color: "#1a1a2e", margin: 0 },
  headerSub: { fontSize: 13, color: "#888", marginTop: 2 },
  historyBtn: {
    fontSize: 13, color: "#4a6cf7", background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", padding: 0,
  },
  section: { padding: "16px 20px" },
  sectionTitle: { fontSize: 15, fontWeight: 600, color: "#1a1a2e", marginBottom: 14 },
  field: { marginBottom: 14 },
  label: { display: "block", fontSize: 12, color: "#666", marginBottom: 5, fontWeight: 500 },
  input: {
    width: "100%", border: "1px solid #e0e0e0", borderRadius: 8, padding: "9px 12px",
    fontSize: 14, color: "#333", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  },
  divider: { height: 1, background: "#f0f0f0", margin: "4px 0 14px" },
  addrLabel: { fontSize: 11, color: "#999", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" },
  enterNewBtn: {
    fontSize: 12, color: "#4a6cf7", background: "none", border: "1px solid #4a6cf7",
    borderRadius: 6, padding: "4px 10px", cursor: "pointer",
  },
  saveAddrBtn: {
    fontSize: 12, color: "#fff", background: "#4a6cf7", border: "none",
    borderRadius: 6, padding: "6px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
  },
  tagGroup: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", flexDirection: "column" },
  tag: (active) => ({
    padding: "10px 16px", borderRadius: 12,
    border: `1px solid ${active ? "#4a6cf7" : "#e0e0e0"}`,
    background: active ? "#f0f4ff" : "#fff",
    color: active ? "#4a6cf7" : "#555",
    cursor: "pointer", fontSize: 13, transition: "all 0.15s", textAlign: "left", display: "flex", flexDirection: "column", gap: 4
  }),
  addrTagGroup: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  addrTypeTag: (active) => ({
    padding: "5px 16px", borderRadius: 20,
    border: `1px solid ${active ? "#4a6cf7" : "#e0e0e0"}`,
    background: active ? "#4a6cf7" : "#fff",
    color: active ? "#fff" : "#555",
    cursor: "pointer", fontSize: 13, transition: "all 0.15s",
  }),
  priceInputRow: {
    display: "flex", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: 8, padding: "9px 12px",
  },
  priceInputRowReadonly: {
    display: "flex", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: 8, padding: "9px 12px", background: "#f9f9f9",
  },
  rupee: { color: "#888", fontSize: 13, marginRight: 4 },
  innerInput: {
    border: "none", outline: "none", width: "100%", fontSize: 14, background: "transparent", fontFamily: "inherit",
  },
  payLabel: { display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#444", cursor: "pointer" },
  priceRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderTop: "1px solid #eee", background: "#fafafa",
  },
  priceRowText: { fontSize: 14, color: "#555" },
  priceRowAmount: { fontSize: 16, fontWeight: 600, color: "#1a1a2e" },
  placeBtnWrapper: {
    display: "flex", justifyContent: "center", padding: "16px 20px 28px", background: "#fff",
  },
  placeBtn: {
    background: "#4a6cf7", color: "#fff", border: "none", padding: "10px 40px",
    fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: 0.3, borderRadius: 8, minWidth: 160,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8
  },
  modalOverlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)",
    zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
  },
  modalInner: {
    background: "#fff", width: "100%", maxWidth: 500, borderRadius: "16px",
    padding: "20px 24px", maxHeight: "80vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
  },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  modalTitle: { fontSize: 16, fontWeight: 600, color: "#1a1a2e" },
  closeBtn: { background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888" },
  emptyText: { fontSize: 13, color: "#aaa", textAlign: "center", padding: "20px 0" },
};

const AGENTS = ["Admin", "Agent Ravi", "Agent Priya", "Self"];
const DOCTORS = ["Dr. Sharma", "Dr. Aditya Aswar", "Dr. Kapoor"];
const PRODUCTS = [
  { label: "Paracetamol 500mg", value: "299" },
  { label: "Azithromycin 250mg", value: "1500" },
  { label: "Vitamin D3 60K", value: "3500" },
  { label: "Metformin 500mg", value: "3000" },
];

/* ─────────────────────────────────────────────
   HISTORY COMPONENTS
───────────────────────────────────────────── */

function OrderHistoryCard({ order, onCancel, onReorder }) {
  const [cancelled, setCancelled] = useState(false);
  const [reordered, setReordered] = useState(false);

  const handleCancel = () => {
    if (window.confirm(`Cancel ${order.title}?`)) {
      setCancelled(true);
      if (onCancel) onCancel(order.id);
    }
  };

  const handleReorder = () => {
    setReordered(true);
    if (onReorder) onReorder(order);
    toast.success(`Reorder placed for: ${order.title}`);
  };

  return (
    <div style={{
      border: "1px solid #eee", borderRadius: 12, padding: "14px 16px",
      marginBottom: 14, background: cancelled ? "#fafafa" : "#fff",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      opacity: cancelled ? 0.6 : 1,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: order.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
            {order.icon}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{order.title}</div>
            {order.doctor && (
              <div style={{ fontSize: 12, color: "#555", marginTop: 1 }}>
                with <span style={{ fontWeight: 600, color: "#333" }}>{order.doctor}</span>
                {order.specialty && <span style={{ color: "#888" }}> ({order.specialty})</span>}
              </div>
            )}
            {order.timeSlot && <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{order.timeSlot}</div>}
            {order.type === "medicine" && (
              <>
                <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Order ID: {order.orderId}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>Items: {order.items}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>{order.date}</div>
              </>
            )}
          </div>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
          background: cancelled ? "#f5f5f5" : order.badgeBg,
          color: cancelled ? "#aaa" : order.badgeColor,
          whiteSpace: "nowrap", marginLeft: 8,
        }}>
          {cancelled ? "Cancelled" : order.badge}
        </span>
      </div>

      {order.details && order.details.length > 0 && (
        <div style={{ margin: "10px 0 8px", borderTop: "1px solid #f5f5f5", paddingTop: 10 }}>
          {order.details.map((d, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "#888" }}>{d.label}</span>
              <span style={{ fontSize: 12, color: "#333", fontWeight: 500 }}>{d.value}</span>
            </div>
          ))}
        </div>
      )}

      {!cancelled && (
        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
          {order.cancelable && (
            <button onClick={handleCancel} type="button" style={{ fontSize: 12, fontWeight: 500, cursor: "pointer", padding: "5px 12px", borderRadius: 6, border: "1px solid #e53935", color: "#e53935", background: "none" }}>
              Cancel
            </button>
          )}
          {order.type === "medicine" && (
            <button onClick={handleReorder} disabled={reordered} type="button" style={{ fontSize: 12, fontWeight: 600, cursor: reordered ? "default" : "pointer", padding: "5px 14px", borderRadius: 6, border: "none", color: "#fff", background: reordered ? "#aaa" : "#4a6cf7" }}>
              {reordered ? "Reordered ✓" : "Reorder"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function HistoryModal({ userId, onClose }) {
  const [activeTab, setActiveTab] = useState("orderHistory");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        if (activeTab === "orderHistory") {
          const res = await getCustomerOrderHistory(userId);
          if (res.success && res.data) {
            const combined = [];
            
            if (res.data.teleBookings) {
              res.data.teleBookings.forEach(booking => {
                combined.push({
                  id: booking.recordId || booking.requestId,
                  type: "teleconsultation",
                  iconBg: "#f3e8ff", icon: "📞",
                  title: "Teleconsultation",
                  badge: booking.consultationStatus || "Upcoming",
                  badgeBg: booking.consultationStatus === "Cancelled" ? "#ffebee" : "#e8f0fe",
                  badgeColor: booking.consultationStatus === "Cancelled" ? "#c62828" : "#4a6cf7",
                  doctor: booking.doctorName || "Not Assigned",
                  timeSlot: booking.appointmentDate ? `${new Date(booking.appointmentDate).toLocaleDateString()} • ${booking.timeSlot}` : booking.timeSlot,
                  details: [
                    { label: "Booking ID:", value: booking.requestId },
                    { label: "Agent:", value: booking.agentName || "--" }
                  ],
                  cancelable: booking.consultationStatus !== "Cancelled" && booking.consultationStatus !== "Complete",
                  rawCreatedAt: booking.bookingDate
                });
              });
            }

            if (res.data.medicineOrders) {
              res.data.medicineOrders.forEach(order => {
                combined.push({
                  id: order.orderId,
                  type: "medicine",
                  iconBg: "#e3f2fd", icon: "💊",
                  title: "Medicine Order",
                  badge: order.deliveryStatus || "Placed",
                  badgeBg: "#e8f5e9", badgeColor: "#2e7d32",
                  date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '--',
                  orderId: order.orderNumber,
                  items: order.productName,
                  details: [
                    { label: "Final Price:", value: `₹${order.finalPrice}` },
                    { label: "Amount Paid:", value: `₹${order.amountPaid}` },
                  ],
                  cancelable: false,
                  rawCreatedAt: order.createdAt
                });
              });
            }
            
            combined.sort((a, b) => new Date(b.rawCreatedAt) - new Date(a.rawCreatedAt));
            setOrders(combined);
          }
        } else if (activeTab === "history") {
          const res = await getCustomerActivities(userId, "History");
          if (res.success && res.data && res.data.logs) {
            const mapped = res.data.logs.map(log => ({
              id: log.activityId,
              icon: "🔄", iconBg: "#f0f4ff",
              title: log.type,
              desc: log.notes,
              agent: log.createdBy || log.assignedName || "System",
              time: log.createdAt ? new Date(log.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit"}) : '--',
              date: log.scheduledDate ? new Date(log.scheduledDate).toLocaleDateString() : null,
              tag: log.status,
              tagColor: log.status === "Closed" ? "#ffebee" : "#e8f5e9",
              tagText: log.status === "Closed" ? "#c62828" : "#2e7d32",
            }));
            setActivities(mapped);
          }
        }
      } catch (error) {
        toast.error("Failed to load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId, activeTab]);

  const tabStyle = (active) => ({
    padding: "8px 16px", fontSize: 13, fontWeight: active ? 600 : 400,
    color: active ? "#4a6cf7" : "#888", background: "none", border: "none",
    borderBottom: active ? "2px solid #4a6cf7" : "2px solid transparent", cursor: "pointer",
  });

  return (
    <div style={s.modalOverlay} onClick={onClose}>
      <div style={s.modalInner} onClick={(e) => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <span style={s.modalTitle}>History</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid #eee", marginBottom: 16 }}>
          <button style={tabStyle(activeTab === "orderHistory")} onClick={() => setActiveTab("orderHistory")}>Order History</button>
          <button style={tabStyle(activeTab === "history")} onClick={() => setActiveTab("history")}>Activity Logs</button>
        </div>

        <div style={{ minHeight: "200px" }}>
          {loading ? (
             <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                <Loader2 className="animate-spin text-blue-500" size={30} />
             </div>
          ) : activeTab === "orderHistory" ? (
             orders.length > 0 ? (
                orders.map((order) => <OrderHistoryCard key={order.id} order={order} />)
             ) : (
                <p style={s.emptyText}>No order history found.</p>
             )
          ) : (
             activities.length > 0 ? (
                activities.map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: item.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{item.title}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: item.tagColor, color: item.tagText, whiteSpace: "nowrap" }}>
                          {item.tag}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: "#555", margin: "3px 0 4px" }}>{item.desc}</p>
                      <div style={{ fontSize: 11, color: "#aaa" }}>
                        {item.agent} • {item.time}
                        {item.date && <span style={{ marginLeft: 6, color: "#bbb" }}>Due: {item.date}</span>}
                      </div>
                    </div>
                  </div>
                ))
             ) : (
                <p style={s.emptyText}>No activity logs found.</p>
             )
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */

export default function AdminPlaceOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recordId = searchParams.get("recordId"); 

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  
  const [userId, setUserId] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);

  const [patientName, setPatientName] = useState("");
  const [agentName, setAgentName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [altContact, setAltContact] = useState("");
  
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  
  const [addressTag, setAddressTag] = useState("Home");
  const [flatNo, setFlatNo] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [contactAddr, setContactAddr] = useState("");
  
  const [productName, setProductName] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [payMode, setPayMode] = useState("Partial");
  const [amountPaid, setAmountPaid] = useState("");
  const [notes, setNotes] = useState("");

  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const id = "apo-responsive-style";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id; el.textContent = RESPONSIVE_CSS;
      document.head.appendChild(el);
    }
  }, []);

  useEffect(() => {
    if (!recordId) {
      toast.error("No valid record ID found.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await adminOrderService.prefetchOrderDetails(recordId);
        if (res.success && res.data) {
          const d = res.data;
          setUserId(d.userId);
          setPatientId(d.customerId);
          setPatientName(d.patientName);
          setContactNo(d.contact);
          setAgentName(d.agentName);
          setDoctorName(d.doctorName);
          
          if (d.userId) {
            try {
              const addressRes = await adminAddressService.getAllUserAddresses(d.userId);
              if (addressRes.success && addressRes.data) {
                const addrs = Array.isArray(addressRes.data) ? addressRes.data : (addressRes.data.addresses || []);
                setSavedAddresses(addrs);
                if (addrs.length > 0) setSelectedAddressId(addrs[0]._id);
              }
            } catch (addrErr) {
              console.error("Failed to load addresses:", addrErr);
            }
          }
        }
      } catch (err) {
        toast.error("Failed to load customer details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [recordId]);

  const finalPrice = sellingPrice
    ? (parseFloat(sellingPrice) - (parseFloat(sellingPrice) * (parseFloat(discount) || 0)) / 100).toFixed(2)
    : "0.00";

  const balanceDue =
    payMode === "COD" ? parseFloat(finalPrice || 0).toFixed(2)
    : payMode === "Partial" ? Math.max(0, parseFloat(finalPrice || 0) - (parseFloat(amountPaid) || 0)).toFixed(2)
    : "0.00"; 

  const handleProductChange = (val) => {
    setProductName(val);
    const found = PRODUCTS.find((p) => p.label === val);
    setSellingPrice(found ? found.value : "");
  };

  const saveAddress = async () => {
    if (!userId) return toast.error("User ID missing.");
    if (!flatNo.trim() || !street.trim() || !pinCode.trim()) {
      return toast.error("Please fill Flat No, Street, and Pincode.");
    }
    if (pinCode.length !== 6) return toast.error("Valid 6-digit pin code required.");

    setIsSavingAddress(true);
    try {
      const payload = { userId, label: addressTag, flatNo, streetArea: street, landmark, pinCode, contactNumber: contactAddr };
      const res = await adminAddressService.addAddress(payload);
      if (res.success) {
        toast.success("Address saved!");
        const newAddr = res.data?.address || { ...payload, _id: Date.now().toString() };
        setSavedAddresses((prev) => [...prev, newAddr]);
        setSelectedAddressId(newAddr._id);
        clearAddress();
      } else {
        toast.error(res.message || "Failed to save address");
      }
    } catch (error) {
      toast.error(error?.message || "Error saving address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const clearAddress = () => {
    setFlatNo(""); setStreet(""); setLandmark(""); setPinCode(""); setContactAddr(""); setAddressTag("Home");
  };

  const placeOrder = async () => {
    if (!patientName.trim()) return toast.error("Patient name missing.");
    if (!productName) return toast.error("Select a product.");
    if (!sellingPrice) return toast.error("Enter selling price.");
    if (!selectedAddressId) return toast.error("Select a delivery address.");

    setIsSubmitting(true);
    try {
      const payload = {
        patientName, doctorName: doctorName || "", altContact: altContact || "", addressId: selectedAddressId,
        productName, medicationSellingPrice: Number(sellingPrice), discountPercent: Number(discount) || 0,
        finalPrice: Number(finalPrice), paymentMode: payMode, amountPaid: Number(amountPaid) || 0, notes: notes || ""
      };
      const res = await adminOrderService.placeOrder(recordId, payload);
      if (res.success) {
        toast.success(`✅ Order Placed! ID: ${res.data.orderId}`);
        router.back(); 
      } else {
        toast.error(res.message || "Failed to place order");
      }
    } catch (error) {
      toast.error(error.message || "Server Error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ ...s.wrapper, alignItems: "center" }}><Loader2 className="animate-spin text-blue-500" size={40} /></div>;
  }

  return (
    <div style={s.wrapper}>
      <div style={s.container} className="apo-container">
        
        {/* HEADER */}
        <div style={s.header} className="apo-header">
          <div style={s.headerLeft}>
            <button style={s.backBtn} onClick={() => router.back()} type="button">
              <ArrowLeft size={15} /> Back
            </button>
            <div>
              <h2 style={s.headerTitle}>Medicine Order</h2>
              <p style={s.headerSub}>Customer ID: {patientId || "—"}</p>
            </div>
          </div>
          {/* ✅ OPENS OUR NEW HISTORY MODAL */}
          <button style={s.historyBtn} type="button" onClick={() => setShowHistory(true)}>
            🕐 Show History
          </button>
        </div>

        {/* PATIENT DETAILS */}
        <div style={s.section} className="apo-section">
          <div style={s.sectionTitle}>Patient Details</div>
          <div style={s.field}>
            <label style={s.label}>Patient Name</label>
            <input style={s.input} value={patientName} onChange={(e) => setPatientName(e.target.value)} />
          </div>
          <div className="apo-row2">
            <div style={s.field}>
              <label style={s.label}>Agent Name</label>
              <input list="agentList" style={s.input} value={agentName} onChange={(e) => setAgentName(e.target.value)} />
              <datalist id="agentList">{AGENTS.map((a) => <option key={a} value={a} />)}</datalist>
            </div>
            <div style={s.field}>
              <label style={s.label}>Doctor Name</label>
              <input list="doctorList" style={s.input} value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="Not Assigned" />
              <datalist id="doctorList">{DOCTORS.map((d) => <option key={d} value={d} />)}</datalist>
            </div>
          </div>
          <div className="apo-row2" style={{ marginBottom: 0 }}>
            <div style={s.field}>
              <label style={s.label}>Primary Contact</label>
              <input style={s.input} value={contactNo} onChange={(e) => setContactNo(e.target.value)} disabled />
            </div>
            <div style={s.field}>
              <label style={s.label}>Alternate Contact (Optional)</label>
              <input style={s.input} value={altContact} onChange={(e) => setAltContact(e.target.value)} placeholder="Enter alternate" maxLength={10} />
            </div>
          </div>
        </div>

        <div style={s.divider} />

        {/* DELIVERY ADDRESS */}
        <div style={s.section} className="apo-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={s.addrLabel}>Select Delivery Address</span>
          </div>
          {savedAddresses.length === 0 ? (
            <p style={{ fontSize: 13, color: "#888", fontStyle: "italic", marginBottom: 16 }}>No saved addresses found. Please add a new one below.</p>
          ) : (
            <div style={s.tagGroup}>
              {savedAddresses.map((addr) => (
                <button 
                  key={addr._id} type="button"
                  style={s.tag(selectedAddressId === addr._id)} 
                  onClick={() => setSelectedAddressId(addr._id)}
                >
                  <strong>{addr.label || "Address"}</strong>
                  <span style={{ fontSize: 12 }}>{addr.flatNo}, {addr.streetArea}</span>
                  <span style={{ fontSize: 12 }}>PIN: {addr.pinCode} | Ph: {addr.contactNumber || contactNo}</span>
                </button>
              ))}
            </div>
          )}

          <div style={s.divider} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }} className="apo-addr-header">
            <span style={s.addrLabel}>+ Add New Address</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="apo-addr-actions">
              <button style={s.enterNewBtn} onClick={clearAddress} type="button">Clear Inputs</button>
              <button style={s.saveAddrBtn} onClick={saveAddress} disabled={isSavingAddress} type="button">
                {isSavingAddress ? <Loader2 size={14} className="animate-spin" /> : "Save Address"}
              </button>
            </div>
          </div>
          <div style={s.addrTagGroup}>
            {["Home", "Work", "Other"].map((tag) => (
              <button key={tag} type="button" style={s.addrTypeTag(addressTag === tag)} onClick={() => setAddressTag(tag)}>{tag}</button>
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
              <input style={s.input} value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Optional" />
            </div>
            <div style={s.field}>
              <label style={s.label}>Pin Code</label>
              <input style={s.input} value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="Enter" maxLength={6} />
            </div>
          </div>
          <div style={s.field}>
            <label style={s.label}>Address Contact Number</label>
            <input style={s.input} value={contactAddr} onChange={(e) => setContactAddr(e.target.value)} placeholder="Optional" maxLength={10} />
          </div>
        </div>

        <div style={s.divider} />

        {/* ORDER & PAYMENT */}
        <div style={s.section} className="apo-section">
          <div style={s.sectionTitle}>Order & Payment</div>
          <div style={s.field}>
            <label style={s.label}>Product Name</label>
            <input list="productList" style={s.input} value={productName} onChange={(e) => handleProductChange(e.target.value)} placeholder="Select a product..." />
            <datalist id="productList">{PRODUCTS.map((p) => <option key={p.label} value={p.label} />)}</datalist>
          </div>
          <div className="apo-row2">
            <div style={s.field}>
              <label style={s.label}>Selling Price</label>
              <div style={s.priceInputRow}>
                <span style={s.rupee}>₹</span>
                <input type="number" style={s.innerInput} value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="0" />
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Discount</label>
              <div style={s.priceInputRow}>
                <input type="number" style={s.innerInput} value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0" />
                <span style={s.rupee}>%</span>
              </div>
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
              {[{ val: "Pre-paid", label: "Pre-paid" }, { val: "COD", label: "COD" }, { val: "Partial", label: "Partial Payment" }].map(({ val, label }) => (
                <label key={val} style={s.payLabel}>
                  <input type="radio" name="payMode" value={val} checked={payMode === val} onChange={() => setPayMode(val)} style={{ accentColor: "#4a6cf7" }} />
                  {label}
                </label>
              ))}
            </div>
          </div>
          {payMode !== "COD" && (
            <div style={s.field}>
              <label style={s.label}>Amount Paid Already</label>
              <div style={s.priceInputRow}>
                <span style={s.rupee}>₹</span>
                <input type="number" style={s.innerInput} value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} placeholder="0" />
              </div>
            </div>
          )}
          <div style={s.field}>
            <label style={s.label}>Admin Notes (Optional)</label>
            <input style={s.input} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Handle with care" />
          </div>
        </div>

        <div style={s.priceRow} className="apo-price-row">
          <span style={s.priceRowText}>Balance to Collect:</span>
          <strong style={{...s.priceRowAmount, color: balanceDue > 0 ? "#d32f2f" : "#1a1a2e"}}>₹ {balanceDue}</strong>
        </div>

        <div style={s.placeBtnWrapper} className="apo-place-btn-wrapper">
          <button type="button" style={s.placeBtn} className="apo-place-btn" onClick={placeOrder} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Place Order"}
          </button>
        </div>

        {/* ✅ THE NEW MODAL WITH LIVE API INTEGRATION */}
        {showHistory && (
          <HistoryModal userId={userId} onClose={() => setShowHistory(false)} />
        )}

      </div>
    </div>
  );
}