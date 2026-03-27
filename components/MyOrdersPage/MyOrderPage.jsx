"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Navigation,
  Loader2,
  Package,
  Activity,
  UserRound,
  X,
  AlertCircle,
  FileText,
  Clock,
  User,
  CreditCard,
  ArrowLeft,
  Download
} from "lucide-react";
import { getMyBookingsHistory, getMyOrdersHistory, cancelMyBooking, getMyBookingDetails, getBookingReceiptHTML } from "@/app/services/patient/order.service"; 
import { toast } from 'sonner';

// ─── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() || '';
  
  let styles = "bg-slate-50 text-slate-600 border border-slate-200"; 

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
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const [activeFilter, setActiveFilter] = useState("booking");
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  const [cancelData, setCancelData] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const [detailsData, setDetailsData] = useState(null);
  const [detailsType, setDetailsType] = useState(null); 
  const [isFetchingDetails, setIsFetchingDetails] = useState(null);
  const [isDownloading, setIsDownloading] = useState(null); // Track which ID is downloading

  const showToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  useEffect(() => {
    const fetchAllHistory = async () => {
      setLoading(true);
      try {
        const [bookingsRes, ordersRes] = await Promise.all([
          getMyBookingsHistory().catch(() => ({ success: false })),
          getMyOrdersHistory().catch(() => ({ success: false }))
        ]);

        const combined = [];

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
                actions: isCancellable ? ["cancel", "details"] : ["details"] 
              });
            });
          }

          // B. In-Clinic Consultations
          if (bookingsRes.data.inClinicBookings && Array.isArray(bookingsRes.data.inClinicBookings.bookings)) {
            bookingsRes.data.inClinicBookings.bookings.forEach(b => {
              const isCancellable = b.inClinicStatus !== 'Cancelled' && b.inClinicStatus !== 'Complete';
              const isComplete = b.inClinicStatus === 'Complete' || b.inClinicStatus === 'Complete';
              const dName = b.doctor?.name ?? b.doctor ?? b.doctorName?.name ?? b.doctorName ?? "Not Assigned";
              const cName = b.clinic?.name ?? b.clinic ?? "--";

              const actionsList = ["details"];
              if (isCancellable) {
                actionsList.unshift("cancel", "directions");
              }
              // ✅ ALWAY ALLOW DOWNLOADING RECEIPT FOR IN-CLINIC
              actionsList.unshift("downloadReceipt");

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
                clinicAddress: b.clinic?.address || "--", 
                bookedOn: b.bookingDate ? `Booked on ${new Date(b.bookingDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}` : '--',
                amountPaid: b.fees > 0 ? `₹${b.fees}` : "Free",
                rawCreatedAt: b.bookingDate || new Date().toISOString(), 
                actions: actionsList
              });
            });
          }
        }

        if (ordersRes.success && ordersRes.data) {
           const rawOrders = ordersRes.data.orders || ordersRes.data.medicineOrders?.orders || ordersRes.data.medicineOrders;
           if (rawOrders && Array.isArray(rawOrders)) {
              rawOrders.forEach(b => {
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
                  actions: ["reorder", "details"]
                });
              });
           }
        }

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

  const confirmCancelBooking = async () => {
    if (!cancelData) return;

    setIsCancelling(true);
    try {
      const res = await cancelMyBooking(cancelData.id, cancelData.type);
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
      setCancelData(null); 
    }
  };

  const handleViewDetails = async (order) => {
    const type = order.type === "Teleconsultation" ? "tele" : "inclinic";
    
    setIsFetchingDetails(order.recordId);
    try {
      const res = await getMyBookingDetails(order.recordId, type);
      if (res.success && res.data) {
        setDetailsData(res.data);
        setDetailsType(type);
      } else {
        showToast(res.message || "Failed to load details.");
      }
    } catch (err) {
      showToast("Error fetching details.");
    } finally {
      setIsFetchingDetails(null);
    }
  };

  // ✅ Download Receipt Handler ported from ConfirmBookingPage
  const handleDownloadReceipt = async (bookingId) => {
    if (!bookingId) {
      toast.error("Invalid booking ID");
      return;
    }

    setIsDownloading(bookingId);
    const toastId = toast.loading("Generating receipt...");

    try {
      const res = await getBookingReceiptHTML(bookingId);
      
      if (res.success && res.html) {
        toast.success("Receipt generated successfully", { id: toastId });
        
        // Open a new window
        const printWindow = window.open('', '', 'width=800,height=600');
        
        // Inject the raw HTML received from the server
        printWindow.document.open();
        printWindow.document.write(res.html);
        printWindow.document.close();
        
        // Wait for content/images to load then print
        setTimeout(() => {
          printWindow.print();
          // Optional: close window after print dialog is closed
          // printWindow.close(); 
        }, 500);

      } else {
        toast.error(res.message || "Could not generate receipt.", { id: toastId });
      }
    } catch (err) {
      toast.error("Error communicating with server for receipt.", { id: toastId });
    } finally {
      setIsDownloading(null);
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
        
        <div className="flex items-center gap-3 mb-6">
           <button 
             onClick={() => router.back()}
             className="flex items-center justify-center p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
             aria-label="Go back"
           >
             <ArrowLeft size={20} className="text-slate-600" />
           </button>
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
                        
                        {order.actions?.includes("cancel") && (
                          <button
                            onClick={() => setCancelData({
                              id: order.recordId,
                              type: order.type === "Teleconsultation" ? "tele" : "inclinic"
                            })}
                            className="flex-1 sm:flex-none text-sm font-bold px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <X className="w-4 h-4" /> Cancel
                          </button>
                        )}

                        {order.actions?.includes("reorder") && (
                          <button
                            onClick={() => showToast("Reorder placed!")}
                            className="flex-1 sm:flex-none text-sm font-bold px-5 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            Reorder
                          </button>
                        )}

                        {order.actions?.includes("directions") && (
                          <button
                            onClick={() => {
                              const clinicName = order.clinicName !== '--' ? order.clinicName : '';
                              const clinicAddress = order.clinicAddress !== '--' ? order.clinicAddress : '';
                              const query = `${clinicName} ${clinicAddress}`.trim();
                              
                              if (query) {
                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
                              } else {
                                showToast("Clinic location details are missing.");
                              }
                            }}
                            className="flex-1 sm:flex-none text-sm font-bold px-5 py-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-900 shadow-md flex items-center justify-center gap-2 transition-colors"
                          >
                            <Navigation className="w-4 h-4" /> Directions
                          </button>
                        )}

                        {/* ✅ ADDED: DOWNLOAD RECEIPT BUTTON */}
                        {order.actions?.includes("downloadReceipt") && (
                          <button
                            onClick={() => handleDownloadReceipt(order.recordId)}
                            disabled={isDownloading === order.recordId}
                            className="flex-1 sm:flex-none text-sm font-bold px-5 py-2.5 rounded-xl border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                          >
                            {isDownloading === order.recordId ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                            Receipt
                          </button>
                        )}

                        {order.actions?.includes("details") && (
                          <button
                            onClick={() => handleViewDetails(order)}
                            disabled={isFetchingDetails === order.recordId}
                            className="flex-1 sm:flex-none text-sm font-bold px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                          >
                            {isFetchingDetails === order.recordId ? <Loader2 size={16} className="animate-spin"/> : "View Details"}
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

      {/* ✅ CANCEL CONFIRMATION MODAL */}
      {cancelData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertCircle size={20} />
                <h2 className="text-lg font-bold">Cancel Booking</h2>
              </div>
              <button 
                onClick={() => !isCancelling && setCancelData(null)} 
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
                  onClick={() => setCancelData(null)}
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

      {/* ✅ DETAILS MODAL */}
      {detailsData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2 text-slate-800">
                <FileText size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold">Booking Details</h2>
              </div>
              <button 
                onClick={() => setDetailsData(null)} 
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Common Header Info */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Booking ID</p>
                    <p className="font-mono text-sm font-bold text-slate-800">{detailsData.appointmentId || detailsData.requestId}</p>
                  </div>
                  <StatusBadge status={detailsData.inClinicStatus || detailsData.consultationStatus} />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200/60">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={10} /> Time Slot</p>
                    <p className="text-xs font-semibold text-slate-700">{detailsData.timeSlot}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar size={10} /> Booked On</p>
                    <p className="text-xs font-semibold text-slate-700">{new Date(detailsData.bookingDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Dynamic rendering based on type */}
              {detailsType === 'inclinic' ? (
                <>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Clinic Information</h3>
                    <div className="flex flex-col gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mt-0.5">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">{detailsData.clinic?.name}</p>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{detailsData.clinic?.address}</p>
                        </div>
                      </div>
                      
                      {/* ✅ MODAL DIRECTIONS */}
                      <button
                        onClick={() => {
                          if (detailsData.clinic?.googleMapsLink) {
                            window.open(detailsData.clinic.googleMapsLink, '_blank');
                          } else {
                            const query = `${detailsData.clinic?.name || ''} ${detailsData.clinic?.address || ''}`.trim();
                            if (query) {
                              window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
                            } else {
                              showToast("Directions link not provided by clinic.");
                            }
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 text-white hover:bg-slate-900 rounded-xl text-sm font-bold shadow-md transition-colors"
                      >
                        <Navigation size={16} /> Get Directions
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Payment Summary</h3>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Consultation Fee</span>
                        <span className="font-semibold text-slate-800">₹{detailsData.fees}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Amount Paid</span>
                        <span className="font-semibold text-emerald-600">₹{detailsData.paidAmount}</span>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex justify-between">
                        <span className="text-sm font-bold text-slate-800">Balance Due</span>
                        <span className="font-bold text-rose-600 text-base">₹{detailsData.balanceDue}</span>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-500">
                        <CreditCard size={14} /> Payment Mode: <span className="uppercase font-bold text-slate-700">{detailsData.paymentMode}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Contact Information</h3>
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Phone</p>
                        <p className="font-bold text-sm text-slate-800 mt-0.5">{detailsData.bookingContactNumber || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  {detailsData.concernedAbout && detailsData.concernedAbout.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Concerned About</h3>
                      <div className="flex flex-wrap gap-2">
                        {detailsData.concernedAbout.map((concern, idx) => (
                          <span key={idx} className="bg-rose-50 text-rose-700 border border-rose-100 text-xs font-bold px-3 py-1.5 rounded-lg">
                            {concern}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Cancellation Note if applicable */}
              {detailsData.cancelledBy && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-rose-800 mb-1 flex items-center gap-1.5"><AlertCircle size={14} /> Cancellation Details</p>
                  <p className="text-xs text-rose-600">Cancelled by: <span className="font-bold capitalize">{detailsData.cancelledBy}</span></p>
                  {detailsData.rejectedNote && (
                    <p className="text-xs text-rose-600 mt-1 italic">"{detailsData.rejectedNote}"</p>
                  )}
                </div>
              )}

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
        {toastMsg}
      </div>
    </div>
  );
};

export default MyOrderPage;