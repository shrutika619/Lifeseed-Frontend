"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Phone,
  MapPin,
  Navigation,
  Loader2,
  Package,
  Activity,
  UserRound,
  X,
  AlertCircle
} from "lucide-react";
// ✅ IMPORT BOTH API CALLS
import { getMyBookingsHistory, getMyOrdersHistory, cancelMyBooking } from "@/app/services/patient/order.service"; 

// ─── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() || '';
  
  let styles = "bg-slate-50 text-slate-600 border border-slate-200"; // Default

  if (['upcoming', 'new', 'pending', 'order placed', 'accept'].includes(normalizedStatus)) {
    styles = "bg-blue-50 text-blue-600 border border-blue-100";
  } else if (['delivered', 'complete', 'completed', 'resolved'].includes(normalizedStatus)) {
    styles = "bg-emerald-50 text-emerald-700 border border-emerald-100";
  } else if (['cancelled', 'rejected', 'patient absent'].includes(normalizedStatus)) {
    styles = "bg-rose-50 text-rose-600 border border-rose-100";
  }

  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize tracking-wide w-fit ${styles}`}>
      {status}
    </span>
  );
};

// ─── Time Slot ─────────────────────────────────────────────────────────────────
const TimeSlot = ({ slot }) => (
  <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-3 w-fit">
    <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
    <span className="text-sm font-semibold text-blue-700">{slot}</span>
  </div>
);

// ─── My Orders Page ────────────────────────────────────────────────────────────
const MyOrderPage = () => {
  const router = useRouter();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const [activeFilter, setActiveFilter] = useState("booking");
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  const [cancelModalId, setCancelModalId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  useEffect(() => {
    const fetchAllHistory = async () => {
      setLoading(true);
      try {
        // ✅ Fetch from both APIs simultaneously
        const [bookingsRes, ordersRes] = await Promise.all([
          getMyBookingsHistory().catch(() => ({ success: false })),
          getMyOrdersHistory().catch(() => ({ success: false }))
        ]);

        const combined = [];

        // ==========================================
        // 1. MAP API 1: BOOKINGS (/patient-profile/bookings)
        // ==========================================
        if (bookingsRes.success && bookingsRes.data) {
          
          // A. Teleconsultations
          if (bookingsRes.data.teleBookings && Array.isArray(bookingsRes.data.teleBookings.bookings)) {
            bookingsRes.data.teleBookings.bookings.forEach(b => {
              const isCancellable = b.consultationStatus !== 'Cancelled' && b.consultationStatus !== 'Complete';
              const dName = b.doctorName?.name ?? b.doctorName ?? b.doctor?.name ?? b.doctor ?? "Not Assigned";

              combined.push({
                id: b.requestId || b.recordId,
                recordId: b.recordId, 
                type: "Teleconsultation",
                category: "booking", 
                icon: Activity,
                status: b.consultationStatus || "New",
                doctorName: typeof dName === 'string' ? dName : "Not Assigned",
                specialization: "Tele-Consult",
                timeSlot: b.appointmentDate ? `${new Date(b.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${b.timeSlot || '--'}` : b.timeSlot || '--',
                bookedOn: b.bookingDate ? `Booked on ${new Date(b.bookingDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}` : '--',
                amountPaid: "Prepaid", 
                rawCreatedAt: b.bookingDate || new Date().toISOString(), 
                actions: isCancellable ? ["cancel", "callNow"] : ["details"]
              });
            });
          }

          // B. In-Clinic Consultations
          if (bookingsRes.data.inClinicBookings && Array.isArray(bookingsRes.data.inClinicBookings.bookings)) {
            bookingsRes.data.inClinicBookings.bookings.forEach(b => {
              const isCancellable = b.inClinicStatus !== 'Cancelled' && b.inClinicStatus !== 'Complete';
              const dName = b.doctor?.name ?? b.doctor ?? b.doctorName?.name ?? b.doctorName ?? "Not Assigned";
              const cName = b.clinic?.name ?? b.clinic ?? "--";

              combined.push({
                id: b.appointmentId || b.bookingId,
                recordId: b.bookingId, 
                type: "In-Clinic Consultation",
                category: "booking", 
                icon: UserRound,
                status: b.inClinicStatus || "New",
                doctorName: typeof dName === 'string' ? dName : "Not Assigned",
                specialization: "General Physician",
                timeSlot: b.bookingDate ? `${new Date(b.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${b.timeSlot || '--'}` : b.timeSlot || '--',
                clinicName: typeof cName === 'string' ? cName : "--",
                clinicAddress: "--", 
                bookedOn: b.bookingDate ? `Booked on ${new Date(b.bookingDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}` : '--',
                amountPaid: b.fees > 0 ? `₹${b.fees}` : "Free",
                rawCreatedAt: b.bookingDate || new Date().toISOString(), 
                actions: isCancellable ? ["cancel", "directions"] : ["details"]
              });
            });
          }
        }

        // ==========================================
        // 2. MAP API 2: ORDERS (/patient-profile/orders)
        // ==========================================
        if (ordersRes.success && ordersRes.data && Array.isArray(ordersRes.data.orders)) {
          ordersRes.data.orders.forEach(b => {
            combined.push({
              id: b.orderId || b.orderNumber,
              recordId: b.orderId,
              type: "Medicine Order",
              category: "order", 
              icon: Package,
              status: b.deliveryStatus || "Pending",
              medicineName: b.productName || "Medicines",
              moreItems: "", 
              orderedOn: b.createdAt ? `Ordered on ${new Date(b.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}` : '--',
              amountPaid: `₹${b.amountPaid || 0}`,
              rawCreatedAt: b.createdAt || new Date().toISOString(), 
            });
          });
        }

        // Sort descending by date
        combined.sort((a, b) => new Date(b.rawCreatedAt) - new Date(a.rawCreatedAt));
        setOrders(combined);

      } catch (error) {
        showToast("Error processing data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllHistory();
  }, [refreshTrigger]);

  // ✅ CANCEL HANDLER
  const confirmCancelBooking = async () => {
    if (!cancelModalId) return;

    setIsCancelling(true);
    try {
      const res = await cancelMyBooking(cancelModalId);
      if (res.success) {
        showToast("Booking cancelled successfully.");
        setRefreshTrigger(prev => prev + 1); 
      } else {
        showToast(res.message || "Failed to cancel booking.");
      }
    } catch (err) {
      showToast(err.message || "Error cancelling booking.");
    } finally {
      setIsCancelling(false);
      setCancelModalId(null); 
    }
  };

  const filteredOrders = orders.filter(order => order.category === activeFilter);

  const counts = {
    bookings: orders.filter(o => o.category === "booking").length,
    orders: orders.filter(o => o.category === "order").length
  };

  const tabs = [
    { id: 'booking', label: 'Bookings', count: counts.bookings },
    { id: 'order', label: 'Orders', count: counts.orders }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans relative">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        <div className="flex items-center justify-between mb-6">
           <h1 className="text-2xl font-bold text-slate-800">My Orders & Bookings</h1>
        </div>

        {!loading && (
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 border-b-2 -mb-px ${
                  activeFilter === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeFilter === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-500 font-medium">Fetching your history...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeFilter === 'booking' ? <Activity className="w-8 h-8 text-slate-400" /> : <Package className="w-8 h-8 text-slate-400" />}
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">No {activeFilter === 'booking' ? 'Bookings' : 'Orders'} Found</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              You don't have any history in the '{tabs.find(t=>t.id===activeFilter).label}' category yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">
            {filteredOrders.map((order) => {
              const Icon = order.icon;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-lg font-bold text-slate-800 block mb-1">
                          {order.type}
                        </span>
                        <p className="text-xs font-mono font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded w-fit">ID: {order.id}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                       <StatusBadge status={order.status} />
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 bg-slate-50/50">
                    {order.doctorName && order.doctorName !== "Not Assigned" && (
                      <div className="mb-4">
                        <p className="text-sm font-bold text-slate-800">{order.doctorName}</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{order.specialization}</p>
                      </div>
                    )}

                    {order.medicineName && (
                      <div className="mb-4">
                        <p className="text-sm font-bold text-slate-800">{order.medicineName}</p>
                        {order.moreItems && <p className="text-xs font-medium text-slate-500 mt-0.5">{order.moreItems}</p>}
                      </div>
                    )}

                    {order.timeSlot && order.timeSlot !== '--' && <TimeSlot slot={order.timeSlot} />}

                    {order.clinicName && order.clinicName !== '--' && (
                      <div className="flex items-start gap-2 mb-4 bg-white p-3 rounded-xl border border-slate-100">
                        <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{order.clinicName}</p>
                          <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
                            {order.clinicAddress !== '--' ? order.clinicAddress : 'Address available in app'}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-6 pt-4 border-t border-slate-200">
                      <div>
                        {order.orderedOn ? (
                           <p className="text-xs font-medium text-slate-400 mb-2">{order.orderedOn}</p>
                        ) : (
                           <p className="text-xs font-medium text-slate-400 mb-2">{order.bookedOn}</p>
                        )}
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Amount Paid</p>
                        <p className="text-xl font-black text-slate-800">{order.amountPaid}</p>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex flex-wrap gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        
                        {order.actions.includes("cancel") && (
                          <button
                            onClick={() => setCancelModalId(order.recordId)}
                            className="flex-1 sm:flex-none text-sm font-bold px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            Cancel Booking
                          </button>
                        )}


                        {order.actions.includes("callNow") && (
                          <button
                            onClick={() => showToast("Calling now...")}
                            className="flex-1 sm:flex-none text-sm font-bold px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 flex items-center justify-center gap-2 transition-colors"
                          >
                            <Phone className="w-4 h-4" /> Call Doctor
                          </button>
                        )}

                        {order.actions.includes("directions") && (
                          <button
                            onClick={() => showToast("Opening directions...")}
                            className="flex-1 sm:flex-none text-sm font-bold px-5 py-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-900 shadow-md flex items-center justify-center gap-2 transition-colors"
                          >
                            <Navigation className="w-4 h-4" /> Directions
                          </button>
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {cancelModalId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertCircle size={20} />
                <h2 className="text-lg font-bold">Cancel Booking</h2>
              </div>
              <button 
                onClick={() => !isCancelling && setCancelModalId(null)} 
                disabled={isCancelling}
                className="p-1 hover:bg-rose-100 rounded-full transition-colors disabled:opacity-50"
              >
                <X size={20} className="text-rose-600" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Are you sure you want to cancel this appointment? <br/>
                <span className="font-semibold text-slate-800">This action cannot be undone.</span>
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setCancelModalId(null)}
                  disabled={isCancelling}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                >
                  Keep It
                </button>
                <button 
                  onClick={confirmCancelBooking}
                  disabled={isCancelling}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition-colors shadow-md shadow-rose-200 disabled:opacity-70"
                >
                  {isCancelling ? <Loader2 size={16} className="animate-spin" /> : "Yes, Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-2xl transition-all duration-300 z-50 flex items-center gap-2 ${
          toastVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none"
        }`}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        {toast}
      </div>
    </div>
  );
};

export default MyOrderPage;