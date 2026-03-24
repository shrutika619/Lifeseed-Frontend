"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSearchParams, usePathname, useRouter } from 'next/navigation'; 
import { 
  getPatientDetailsById, 
  submitCustomerProfile, 
  getCustomerActivities, 
  addCustomerActivity, 
  updateCustomerActivity,
  createCustomerProfile, 
  getAdminDropdownData,
  getCustomerOrderHistory,
  searchPatients 
} from '@/app/services/admin/leads.service'; 
import { adminAddressService } from '@/app/services/admin/adminAddress.service'; 
import { adminTicketService } from '@/app/services/admin/adminTicket.service'; 
import { getAllCities, getAllClinics } from "@/app/services/patient/clinic.service";
import { toast } from 'sonner';
import { 
  Calendar, Clock, MessageSquare, CheckCircle2, 
  XCircle, Save, ChevronDown, RotateCcw,
  Monitor, MapPin, X, ArrowLeft, Loader2, Plus, Trash2, Pencil, Search, UserCheck
} from 'lucide-react';
import { customerProfileSchema } from '@/app/utils/validation/customerProfileSchema';

/* ─────────────────────────────────────────────
   ADDRESS FORM VALIDATION SCHEMA
───────────────────────────────────────────── */
const addressFormSchema = yup.object({
  label:         yup.string().required("Label is required"),
  flatNo:        yup.string().trim().required("Flat / House No. is required"),
  streetArea:    yup.string().trim().required("Street / Area is required"),
  landmark:      yup.string().trim(),
  pinCode:       yup.string().trim().required("PIN Code is required").matches(/^\d{6}$/, "PIN Code must be 6 digits"),
  contactNumber: yup.string().trim().matches(/^(\d{10})?$/, "Contact must be 10 digits").optional(),
});

/* ─────────────────────────────────────────────
   ACTIVITY FORM VALIDATION SCHEMA
───────────────────────────────────────────── */
const activitySchema = yup.object({
  activityType:     yup.string().required("Activity type is required"),
  activityAssignTo: yup.string().required("Please assign this activity to a user"),
  activityNotes:    yup.string().trim().required("Activity note is required"),
  activityDate:     yup.string().optional(),
  activityTime:     yup.string().optional(),
});

/* ─────────────────────────────────────────────
   TICKET STATUS HELPERS
───────────────────────────────────────────── */
const ticketStatusStyle = (s) => {
  switch (s) {
    case 'Open':       return 'bg-blue-50 text-blue-600 border border-blue-200'
    case 'Unresolved': return 'bg-orange-50 text-orange-600 border border-orange-200'
    case 'Resolved':   return 'bg-green-50 text-green-600 border border-green-200'
    case 'Closed':     return 'bg-red-50 text-red-500 border border-red-200'
    case 'Fake':       return 'bg-red-50 text-red-500 border border-red-200'
    default:           return 'bg-slate-50 text-slate-500 border border-slate-200'
  }
}
const ticketStatusIcon = (s) => {
  switch (s) {
    case 'Open':       return '🕐'
    case 'Unresolved': return '📅'
    case 'Resolved':   return '✔'
    case 'Closed':     return '✕'
    case 'Fake':       return '✕'
    default:           return '•'
  }
}

/* ─────────────────────────────────────────────
   ORDER HISTORY TAB COMPONENT
───────────────────────────────────────────── */
const OrderHistoryTab = ({ userId }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); 
  
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname.startsWith('/super-admin') ? '/super-admin' : '/admin';

  const fetchAllHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCustomerOrderHistory(userId);
      if (res.success && res.data) {
        const combined = [];

        // 1. Map Teleconsultations
        if (res.data.teleBookings && Array.isArray(res.data.teleBookings)) {
          res.data.teleBookings.forEach(booking => {
            const isCancellable = booking.consultationStatus !== 'Cancelled' && booking.consultationStatus !== 'Complete';
            const isReschedulable = booking.consultationStatus !== 'Cancelled' && booking.consultationStatus !== 'Complete';

            combined.push({
              id: booking.requestId || booking.recordId,
              type: 'Teleconsultation',
              categoryName: 'Teleconsultation',
              icon: '🔮',
              iconBg: '#f3e8ff',
              doctor: booking.doctorName || 'Not Assigned',
              date: booking.appointmentDate ? new Date(booking.appointmentDate).toLocaleDateString() : '--',
              timeSlot: booking.timeSlot,
              status: booking.consultationStatus || 'New',
              statusColor: booking.consultationStatus === 'Complete'
                ? { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' }
                : booking.consultationStatus === 'Cancelled'
                ? { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' }
                : { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
              orderId: booking.requestId,
              details: [
                { label: 'Agent', value: booking.agentName || '--' },
                ...(booking.cancelledBy ? [{ label: 'Cancelled By', value: booking.cancelledBy }] : [])
              ],
              actions: [
                'View Details', 
                'Place Order',
                ...(isCancellable ? ['Cancel'] : []),
                ...(isReschedulable ? ['Reschedule'] : [])
              ],
              recordId: booking.recordId,
              rawCreatedAt: booking.bookingDate
            });
          });
        }

        // 2. Map Medicine Orders
        if (res.data.medicineOrders && Array.isArray(res.data.medicineOrders)) {
          res.data.medicineOrders.forEach(order => {
            const balanceDue = order.finalPrice - order.amountPaid;
            
            combined.push({
              id: order.orderId,
              type: 'Medicine Order',
              categoryName: 'Medicine Order', 
              icon: '🧴',
              iconBg: '#e0f2fe',
              doctor: null,
              date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '--',
              timeSlot: null,
              status: order.deliveryStatus || 'Pending',
              statusColor: order.deliveryStatus === 'Delivered' 
                ? { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' }
                : { bg: '#fff7ed', text: '#c2410c', border: '#ffedd5' },
              orderId: order.orderNumber,
              items: order.productName,
              details: [
                { label: 'Amount Paid', value: `₹${order.amountPaid}` },
                { label: 'Balance Due', value: `₹${balanceDue}` },
                { label: 'Payment Status', value: order.paymentStatus },
              ],
              actions: ['View Order', 'Reorder'],
              rawCreatedAt: order.createdAt
            });
          });
        }

        // 3. Map Real In-Clinic Bookings
        if (res.data.inClinicBookings && Array.isArray(res.data.inClinicBookings)) {
          res.data.inClinicBookings.forEach(booking => {
            const status = booking.inClinicStatus || 'New';
            
            let statusColor = { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' }; 
            if (status === 'Accept') statusColor = { bg: '#ecfeff', text: '#0e7490', border: '#a5f3fc' }; 
            if (status === 'Complete') statusColor = { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' }; 
            if (status === 'Cancelled') statusColor = { bg: '#fef2f2', text: '#be123c', border: '#fecaca' }; 
            if (status === 'Patient Absent') statusColor = { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' }; 

            const fees = booking.fees || 0;
            const paid = booking.paidAmount || 0;
            const balanceDue = fees - paid;

            combined.push({
              id: booking.bookingId,
              type: 'In-Clinic Consultation',
              categoryName: 'In-Clinic Consultation', 
              icon: '🏥',
              iconBg: '#fef9c3',
              doctor: booking.doctor?.name || 'Not Assigned',
              location: booking.clinic?.name || '--',
              date: booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : '--',
              timeSlot: booking.timeSlot || '--',
              status: status,
              statusColor: statusColor,
              orderId: booking.appointmentId,
              details: [
                { label: 'Fees', value: `₹${fees}` },
                { label: 'Amount Paid', value: `₹${paid}` },
                { label: 'Balance Due', value: `₹${balanceDue}` },
                { label: 'Payment Mode', value: booking.paymentMode || '--' },
                ...(booking.cancelledBy ? [{ label: 'Cancelled By', value: booking.cancelledBy }] : [])
              ],
              actions: ['View Details', 'Get Directions'],
              rawCreatedAt: booking.bookingDate
            });
          });
        }

        combined.sort((a, b) => new Date(b.rawCreatedAt) - new Date(a.rawCreatedAt));
        setHistoryData(combined);
      } else {
        toast.error(res.message || "Failed to load history");
      }
    } catch (error) {
      toast.error("Error fetching order history.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchAllHistory();
  }, [userId, fetchAllHistory]);

  const handleCancelTeleconsultation = async (recordId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    const toastId = toast.loading("Cancelling booking...");
    try {
      // Assuming you have this service imported
      const res = await adminTeleconsultationService.cancelBooking(recordId);
      if (res.success) {
        toast.success("Booking Cancelled Successfully", { id: toastId });
        fetchAllHistory(); 
      } else {
        toast.error(res.message || "Failed to cancel booking", { id: toastId });
      }
    } catch (error) {
      toast.error("Error cancelling booking", { id: toastId });
    }
  };

  const getVisibleData = () => {
    if (showAll) return historyData;
    const categoryCounts = {};
    return historyData.filter((item) => {
      const cat = item.categoryName;
      if (!categoryCounts[cat]) categoryCounts[cat] = 0;
      if (categoryCounts[cat] < 2) {
        categoryCounts[cat]++;
        return true;
      }
      return false;
    });
  };

  if (loading) {
    return <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;
  }

  if (historyData.length === 0) {
    return <div className="text-center py-10 text-slate-500 text-sm border border-dashed border-slate-200 rounded-2xl bg-slate-50">No history found for this patient.</div>;
  }

  const visibleData = getVisibleData();

  return (
    <div className="space-y-4">
      {visibleData.map((order) => (
        <div key={order.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0" style={{ background: order.iconBg }}>
                {order.icon}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{order.type}</p>
                {order.doctor && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    with <span className="font-semibold text-slate-700">{order.doctor}</span>
                    {order.specialization && <span className="text-slate-400"> ({order.specialization})</span>}
                  </p>
                )}
                {order.location && order.location !== '--' && <p className="text-xs text-slate-400 mt-0.5">{order.location}</p>}
                {order.date && (
                  <p className="text-xs font-semibold text-slate-600 mt-1">
                    {order.timeSlot ? <>Time Slot: <span className="text-slate-800">{order.date}</span>&nbsp;•&nbsp;{order.timeSlot}</> : order.date}
                  </p>
                )}
              </div>
            </div>
            <span
              className="text-[11px] font-bold px-3 py-1 rounded-full border ml-2 shrink-0"
              style={{ background: order.statusColor?.bg, color: order.statusColor?.text, borderColor: order.statusColor?.border }}
            >
              {order.status}
            </span>
          </div>

          {order.orderId && <div className="text-xs text-slate-600 mt-2 mb-1"><span className="font-medium">ID: </span>{order.orderId}</div>}
          {order.items && <div className="text-xs text-slate-500 mb-1"><span className="font-medium">Items: </span>{order.items}</div>}

          {order.details && order.details.length > 0 && (
            <div className="mt-3 border-t border-slate-50 pt-3 space-y-1.5">
              {order.details.map((d) => (
                <div key={d.label} className="flex justify-between text-xs">
                  <span className="text-slate-400">{d.label}:</span>
                  <span className="font-semibold text-slate-700 capitalize">{d.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-50">
            {order.actions.map((action) => {
              const isDanger  = action === 'Cancel';
              const isPrimary = action === 'Reorder' || action === 'Place Order';
              const isLink    = ['View Details', 'View Order', 'Get Directions', 'Edit', 'Reschedule'].includes(action);
              
              if (action === 'Place Order' && order.status === 'Cancelled') return null;

              return (
                <button
                  key={action}
                  type="button"
                  onClick={() => {
                    if (action === 'Place Order' && order.recordId) {
                      router.push(`${basePath}/teleconsultation/placeorder?recordId=${order.recordId}`);
                    }
                    if (action === 'View Details' && order.recordId) {
                      router.push(`${basePath}/teleconsultation/doctorpanel?recordId=${order.recordId}`);
                    }
                    if (action === 'Cancel' && order.recordId) {
                      handleCancelTeleconsultation(order.recordId);
                    }
                    if (action === 'Reschedule' && order.recordId) {
                      router.push(`/free-consultation?admin_booking=true&rescheduleRecordId=${order.recordId}&userId=${userId}`);
                    }
                  }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all
                    ${isDanger  ? 'text-red-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200' : ''}
                    ${isPrimary ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' : ''}
                    ${isLink    ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-200' : ''}
                  `}
                >
                  {action}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {historyData.length > visibleData.length || showAll ? (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="w-full py-3 mt-2 rounded-xl border border-slate-200 border-dashed text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          {showAll ? "Show Less" : `View All History (${historyData.length})`}
        </button>
      ) : null}
    </div>
  );
};

/* ─────────────────────────────────────────────
   TICKET TAB COMPONENT
───────────────────────────────────────────── */
const TicketCard = ({ ticket, userId }) => {
  const [activeStatus, setActiveStatus] = useState(ticket.ticketStatus || ticket.status || 'Open');
  const [comments, setComments] = useState([]); 
  const [commentInput, setCommentInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isFetchingComments, setIsFetchingComments] = useState(false);

  const statuses = ['Open', 'Unresolved', 'Resolved', 'Closed', 'Fake'];

  const createdDate = new Date(ticket.createdAt || new Date()).toLocaleDateString("en-IN", { 
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
  });
  const metaString = `${createdDate} • Assigned to: ${ticket.assignedName || ticket.assignedTo || 'Unassigned'}`;

  const handleStatusChange = async (newStatus) => {
    if (newStatus === activeStatus) return;
    setIsUpdating(true);
    try {
      const payload = { status: newStatus, ticketStatus: newStatus };
      const res = await adminTicketService.updateTicketStatus(userId, ticket.activityId, payload);
      if (res.success) {
        setActiveStatus(newStatus);
        toast.success(`Ticket marked as ${newStatus}`);
      } else {
        toast.error(res.message || "Failed to update ticket");
      }
    } catch (error) {
      toast.error(error.message || "Error communicating with server");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;
    const payload = { text: commentInput.trim() };
    try {
      const res = await adminTicketService.addTicketComment(userId, ticket.activityId, payload);
      if (res.success) {
        toast.success("Comment added");
        const newCommentObj = { id: Date.now(), author: 'You', time: 'Just now', text: payload.text };
        setComments(prev => [newCommentObj, ...prev]); 
        setCommentInput(''); 
      } else {
        toast.error(res.message || "Failed to add comment");
      }
    } catch (error) {
      toast.error(error.message || "Failed to post comment");
    }
  };

  const loadComments = async () => {
    if (!showComments) {
      setIsFetchingComments(true);
      setShowComments(true); 
      try {
        const res = await adminTicketService.getTicketDetail(userId, ticket.activityId);
        if (res.success && res.data) {
          const mappedComments = (res.data.comments || []).map(c => ({
            id: c.commentId,
            author: c.agentName || 'Admin',
            time: new Date(c.createdAt).toLocaleDateString("en-IN", { 
              month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
            }),
            text: c.text
          }));
          setComments(mappedComments);
        } else {
          toast.error("Failed to load comments");
        }
      } catch (error) {
        toast.error("Error fetching comments");
      } finally {
        setIsFetchingComments(false);
      }
    } else {
      setShowComments(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-slate-400 text-sm font-bold">
            {(ticket.assignedName || ticket.createdBy || 'T').charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
             <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 bg-blue-50 inline-block px-2 py-0.5 rounded">
               {ticket.type}
             </p>
             <span className="text-[10px] text-slate-400">ID: {ticket.activityId ? ticket.activityId.slice(-6).toUpperCase() : ''}</span>
          </div>
          <p className="text-sm font-bold text-slate-800 leading-relaxed">{ticket.notes}</p>
          <p className="text-xs text-slate-400 mt-2">{metaString}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleStatusChange(s)}
            disabled={isUpdating}
            className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full transition-all
              ${activeStatus === s
                ? ticketStatusStyle(s) + ' shadow-sm'
                : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span>{ticketStatusIcon(s)}</span> {s}
          </button>
        ))}
      </div>

      <div className="pt-2">
        <button 
          type="button" 
          onClick={loadComments}
          disabled={isFetchingComments && !showComments}
          className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 mb-2 disabled:opacity-50"
        >
          <MessageSquare size={14} />
          {showComments ? 'Hide Comments' : `Comments (${ticket.commentCount || 0})`}
        </button>

        {showComments && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                {isFetchingComments ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 mb-3 max-h-[200px] overflow-y-auto pr-2">
                      {comments.length === 0 && <p className="text-[11px] text-slate-400 italic">No comments yet.</p>}
                      {comments.map((c, i) => (
                        <div key={c.id || i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-blue-600">{c.author}</span>
                            <span className="text-[10px] text-slate-400">{c.time}</span>
                          </div>
                          <p className="text-xs text-slate-600">{c.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        placeholder="Type an internal note or update..."
                        className="flex-1 text-xs p-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-400 bg-slate-50"
                      />
                      <button
                        type="button" 
                        onClick={handleAddComment}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                      >
                        Post
                      </button>
                    </div>
                  </>
                )}
            </div>
        )}
      </div>
    </div>
  )
}

const TicketTab = ({ activities, userId }) => {
  const tickets = activities.filter(a => a.category === 'Ticket');

  if (tickets.length === 0) {
      return (
        <div className="text-center py-10 text-slate-400 text-sm border border-dashed border-slate-200 rounded-2xl bg-slate-50">
          No tickets found for this patient.
        </div>
      );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.activityId} ticket={ticket} userId={userId} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ADMIN CLINIC/HOSPITAL SELECT MODAL
───────────────────────────────────────────── */
const AdminClinicSelectModal = ({ onClose, userId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname.startsWith('/super-admin') ? '/super-admin' : '/admin';

  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await getAllCities();
        const data = response?.data || response; 
        if (Array.isArray(data)) setCities(data);
      } catch (error) {
        toast.error("Failed to load cities");
      } finally {
        setLoading(false);
      }
    };
    fetchCityData();
  }, []);

  const handleCitySelect = async (city) => {
    setSelectedCity(city);
    setStep(2);
    setLoading(true);
    try {
      const response = await getAllClinics(city._id); 
      if (response.success && Array.isArray(response.clinics)) {
        setClinics(response.clinics);
      } else {
        toast.error(response.message || "No hospitals found for this city");
        setStep(1); 
      }
    } catch (error) {
      toast.error("Failed to load hospitals for this city");
      setStep(1); 
    } finally {
      setLoading(false);
    }
  };

  const handleClinicSelect = (clinicId) => {
    router.push(`/bookappointment?clinicId=${clinicId}&patientId=${userId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 bg-blue-600 shrink-0">
          <div className="flex items-center gap-3 text-white">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="hover:bg-blue-500 p-1 rounded-full transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h3 className="font-bold text-lg">{step === 1 ? "Select City" : `Hospitals in ${selectedCity.name}`}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-500 rounded-full transition-colors"><X className="w-5 h-5 text-white" /></button>
        </div>
        
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100 relative min-h-[250px]">
          {loading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3 bg-white/80 z-10">
               <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
               <p className="text-sm font-medium">{step === 1 ? "Loading cities..." : "Loading hospitals..."}</p>
             </div>
          ) : step === 1 ? (
             cities.length > 0 ? cities.map((city, idx) => (
              <button key={city._id || idx} type="button" onClick={() => handleCitySelect(city)} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors text-left">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <div><p className="font-bold text-slate-800 text-sm uppercase">{city.name}</p><p className="text-xs text-slate-500">{city.state || "India"}</p></div>
              </button>
            )) : <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 h-full"><p className="text-sm">No cities found.</p></div>
          ) : (
            clinics.length > 0 ? clinics.map((clinic, idx) => (
              <button key={clinic._id || idx} type="button" onClick={() => handleClinicSelect(clinic._id)} className="w-full flex flex-col px-6 py-4 hover:bg-blue-50 transition-colors text-left border-l-4 border-transparent hover:border-blue-500">
                <p className="font-bold text-slate-800 text-sm">{clinic.clinicName || clinic.name}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{clinic.fulladdress || clinic.address}</p>
              </button>
            )) : <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 h-full"><p className="text-sm">No hospitals found in this city.</p></div>
          )}
        </div>
      </div>
    </div>
  );
};


/* ─────────────────────────────────────────────
   BOOK CONSULTATION MODAL
───────────────────────────────────────────── */
const BookConsultationModal = ({ onClose, userId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname.startsWith('/super-admin') ? '/super-admin' : '/admin';
  const [showClinicModal, setShowClinicModal] = useState(false);

  if (showClinicModal) return <AdminClinicSelectModal onClose={onClose} userId={userId} />;

  const handleTeleconsultationClick = () => {
    if (userId) router.push(`/free-consultation?admin_booking=true&userId=${userId}`);
    else router.push(`/free-consultation`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 text-lg">Book Consultation</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="flex flex-col gap-4">
          <button type="button" onClick={() => setShowClinicModal(true)} className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-[#0097A7] hover:bg-[#E0F7FA] transition-all group">
            <div className="w-11 h-11 rounded-full bg-[#E0F7FA] flex items-center justify-center group-hover:bg-[#0097A7] transition-all"><MapPin className="w-5 h-5 text-[#0097A7] group-hover:text-white transition-all" /></div>
            <div className="text-left"><p className="font-bold text-slate-800 text-sm">In Clinic</p><p className="text-xs text-slate-500">Physical visit at clinic</p></div>
          </button>
          <button type="button" onClick={handleTeleconsultationClick} className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-all"><Monitor className="w-5 h-5 text-blue-600 group-hover:text-white transition-all" /></div>
            <div className="text-left"><p className="font-bold text-slate-800 text-sm">TeleConsultation</p><p className="text-xs text-slate-500">Online video/call consultation</p></div>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   CREATABLE SELECT
───────────────────────────────────────────── */
const CreatableSelect = ({ field, register, setValue, watch, error }) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentValue = watch(field.name);
  return (
    <div className="relative">
      {isEditing && !field.disabled ? (
        <div className="flex gap-2">
          <input
            autoFocus
            defaultValue={currentValue}
            placeholder="Type new name..."
            onBlur={(e) => { setValue(field.name, e.target.value, { shouldValidate: true }); setIsEditing(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setValue(field.name, e.target.value, { shouldValidate: true }); setIsEditing(false); } if (e.key === 'Escape') setIsEditing(false); }}
            className="flex-1 p-2.5 border-2 border-blue-400 rounded-xl text-sm outline-none bg-white"
          />
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              {...register(field.name)}
              disabled={field.disabled}
              className={`w-full appearance-none p-2.5 bg-slate-50 border ${error ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm outline-none ${field.disabled ? 'opacity-60 cursor-not-allowed bg-gray-100 text-slate-500 font-bold' : 'focus:border-blue-500'}`}
            >
              <option value="" disabled>Select...</option>
              {[...new Set(field.options)].map((o, index) => (
                <option key={`${o}-${index}`} value={o}>{o}</option>
              ))}
              {!field.options.includes(currentValue) && currentValue && (
                <option value={currentValue}>{currentValue}</option>
              )}
            </select>
            <ChevronDown className={`absolute right-3 top-3 pointer-events-none ${field.disabled ? 'text-gray-300' : 'text-slate-400'}`} size={16} />
          </div>
          {!field.disabled && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              title="Enter custom name"
              className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-600 hover:bg-blue-100 transition-all text-xs font-bold"
            >
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const ACTIVITY_CATEGORIES = {
  "Next Medicine Order": "Follow-Up",
  "Follow-Up": "Follow-Up",
  "Dr Consultation TC": "Follow-Up",
  "Dr Follow Up In Clinic": "Follow-Up",
  "Just Contact": "History",
  "Miss Contact": "History",
  "TC Related": "Ticket",
  "In-Clinic Related": "Ticket",
  "Medicine Related": "Ticket",
  "Refund Related": "Ticket",
  "Side Effect": "Ticket",
  "Other": "Ticket"
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const CustomerProfilePage = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  const userId = searchParams.get('patientId'); 
  const isNewUser = !userId; 

  const isSuperAdminRoute = pathname.startsWith('/super-admin');
  const basePath = pathname.startsWith('/super-admin') ? '/super-admin' : '/admin';
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  
  const [adminList, setAdminList] = useState([]);
  const [showBookModal, setShowBookModal] = useState(false);

  const [activeTab, setActiveTab] = useState('Upcoming');
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // ✅ DEBOUNCED SEARCH STATE
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // ADDRESS STATE
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: "Home", flatNo: "", streetArea: "", landmark: "", pinCode: "", contactNumber: ""
  });
  const [addressErrors, setAddressErrors] = useState({});

  const { register, handleSubmit, watch, setValue, resetField, reset, formState: { errors } } = useForm({
    resolver: yupResolver(customerProfileSchema),
    defaultValues: {
      activityType: 'Next Medicine Order',
      activityAssignTo: '',
      leadSource: 'Manual',
      pageStatus: 'manual'
    }
  });

  const [activityErrors, setActivityErrors] = useState({});
  const watchedLeadOwner = watch("leadOwner");
  const watchedContact = watch("contact");

  useEffect(() => {
    if (watchedLeadOwner) {
      setValue("activityAssignTo", watchedLeadOwner);
    }
  }, [watchedLeadOwner, setValue]);

  // 1. Fetch Profile, Admins & Addresses
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const safeString = (val) => {
        if (!val) return "";
        if (typeof val === 'object') return val.fullName || val.username || "";
        return String(val);
      };

      if (isNewUser) {
        const res = await getAdminDropdownData();
        if (res.success && res.data) {
           setCustomerData({ currentAdmin: res.data.currentAdmin });
           setAdminList(res.data.assignToDropdown || []);
           const defaultOwnerName = res.data.currentAdmin?.fullName || "";
           reset({
             leadOwner: defaultOwnerName, 
             leadStage: "New",
             leadSource: "Manual",
             pageStatus: "manual",
             activityAssignTo: defaultOwnerName
           });
        }
      } else {
        const [profileRes, addressRes] = await Promise.all([
          getPatientDetailsById(userId).catch(e => e),
          adminAddressService.getAllUserAddresses(userId).catch(e => e)
        ]);

        if (profileRes?.success && profileRes?.data) {
          setCustomerData(profileRes.data);
          setAdminList(profileRes.data.assignToDropdown || []);
          const existingOwner = safeString(profileRes.data.leadOwner);
          const defaultOwnerName = existingOwner || profileRes.data.currentAdmin?.fullName || "";
          reset({
            name: profileRes.data.name || "",
            age: profileRes.data.age || "",
            contact: profileRes.data.mobileNo || "",
            whatsapp: profileRes.data.whatsappNumber || "",
            leadOwner: defaultOwnerName, 
            leadStage: profileRes.data.leadStage || "New",
            city: profileRes.data.city || "",
            email: profileRes.data.mailId || profileRes.data.email || "",
            leadSource: profileRes.data.leadSource || "Website",
            notes: profileRes.data.notes || "",
            sendWhatsApp: profileRes.data.sendWhatsAppNotification || false,
            activityType: "Next Medicine Order",
            activityAssignTo: defaultOwnerName
          });
        }

        if (addressRes?.success && addressRes?.data?.addresses) {
          setAddresses(addressRes.data.addresses);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [userId, isNewUser, reset]);

  // 2. Fetch Activities
  const fetchActivities = useCallback(async () => {
    if (isNewUser || !userId) return;
    if (activeTab === 'Order History') return; 
    setLoadingActivities(true);
    const res = await getCustomerActivities(userId, activeTab);
    if (res.success && res.data) {
      setActivities(res.data.logs || []);
    } else {
      setActivities([]);
    }
    setLoadingActivities(false);
  }, [userId, activeTab, isNewUser]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);


  // ✅ DEBOUNCED SEARCH EFFECT
  useEffect(() => {
    if (!isNewUser) return;

    const handler = setTimeout(async () => {
      const query = watchedContact?.trim() || "";
      
      if (query.length >= 4) {
        setIsSearching(true);
        setShowDropdown(true);
        try {
          const res = await searchPatients(query);
          if (res.success && res.data?.patients?.length > 0) {
            setSearchResults(res.data.patients);
          } else {
            setSearchResults([]); 
          }
        } catch (error) {
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults(null);
        setShowDropdown(false);
      }
    }, 500); 

    return () => clearTimeout(handler);
  }, [watchedContact, isNewUser]);


  // 3. ADD NEW ACTIVITY LOG 
  const addNewActivity = async () => {
    const type       = watch('activityType');
    const notes      = watch('activityNotes');
    const assignToName = watch('activityAssignTo');
    const date       = watch('activityDate');
    const time       = watch('activityTime');

    try {
      await activitySchema.validate(
        { activityType: type, activityAssignTo: assignToName, activityNotes: notes, activityDate: date, activityTime: time },
        { abortEarly: false }
      );
      setActivityErrors({});
    } catch (validationError) {
      const errs = {};
      validationError.inner.forEach(e => { errs[e.path] = e.message; });
      setActivityErrors(errs);
      return; 
    }

    const category = ACTIVITY_CATEGORIES[type] || "Follow-Up";
    const payload = { type, category, notes: notes.trim() };
    if (date) payload.scheduledDate = date;
    if (time) payload.scheduledTime = time;

    if (assignToName) {
      const selectedAdmin = adminList.find(a => a.fullName === assignToName);
      if (selectedAdmin) {
        payload.assignedTo = selectedAdmin._id;
      } else if (assignToName === customerData?.currentAdmin?.fullName) {
        payload.assignedTo = customerData.currentAdmin._id;
      }
    }

    if (isNewUser) {
      const localActivity = {
        activityId: `temp_${Date.now()}`, type: payload.type, category: payload.category,
        notes: payload.notes, scheduledDate: payload.scheduledDate || null,
        scheduledTime: payload.scheduledTime || "", assignedToId: payload.assignedTo || null,
        assignedTo: assignToName, status: "Pending", createdBy: customerData?.currentAdmin?.fullName || 'You',
        showActions: false 
      };
      setActivities([localActivity, ...activities]);
      toast.success("Activity queued! Save profile to submit.");
      resetField('activityNotes'); resetField('activityDate'); resetField('activityTime');
    } else {
      setIsAddingActivity(true);
      const res = await addCustomerActivity(userId, payload);
      if (res.success) {
        toast.success("Activity added successfully!");
        resetField('activityNotes'); resetField('activityDate'); resetField('activityTime');
        fetchActivities(); 
      } else {
        toast.error(res.message || "Failed to add activity");
      }
      setIsAddingActivity(false);
    }
  };

  // 4. UPDATE ACTIVITY STATUS
  const handleActivityStatusChange = async (activityId, newStatus) => {
    if (isNewUser) return; 
    const payload = { status: newStatus };
    if (newStatus === "Not Interested") {
      const userNotes = window.prompt("Add notes for marking as 'Not Interested' (Optional):");
      if (userNotes === null) return; 
      if (userNotes.trim() !== "") payload.notes = userNotes;
    }
    const toastId = toast.loading(`Marking as ${newStatus}...`);
    const res = await updateCustomerActivity(userId, activityId, payload);
    if (res.success) {
      toast.success(`Activity marked as ${newStatus}`, { id: toastId });
      fetchActivities(); 
    } else {
      toast.error(res.message || "Failed to update activity", { id: toastId });
    }
  };

  /* ─────────────────────────────────────────────
     ADDRESS CRUD HANDLERS
  ───────────────────────────────────────────── */
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
    if (addressErrors[name]) {
      setAddressErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const openAddAddressModal = () => {
    setAddressForm({ label: "Home", flatNo: "", streetArea: "", landmark: "", pinCode: "", contactNumber: "" });
    setAddressErrors({});
    setEditAddressId(null);
    setShowAddressModal(true);
  };

  const openEditAddressModal = (address) => {
    setAddressForm({
      label: address.label || "Other", flatNo: address.flatNo || "",
      streetArea: address.streetArea || "", landmark: address.landmark || "",
      pinCode: address.pinCode || "", contactNumber: address.contactNumber || ""
    });
    setAddressErrors({});
    setEditAddressId(address._id);
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      await addressFormSchema.validate(addressForm, { abortEarly: false });
      setAddressErrors({});
    } catch (validationError) {
      const errs = {};
      validationError.inner.forEach(err => { errs[err.path] = err.message; });
      setAddressErrors(errs);
      return; 
    }

    const safeAddressForm = {
        label: addressForm.label || "Home",
        flatNo: addressForm.flatNo || "",
        streetArea: addressForm.streetArea || "",
        landmark: addressForm.landmark || "",
        pinCode: addressForm.pinCode || "",
        contactNumber: addressForm.contactNumber || ""
    };

    setIsSavingAddress(true);
    try {
      if (editAddressId) {
        const res = await adminAddressService.updateUserAddress(userId, editAddressId, safeAddressForm);
        if (res.success) {
          toast.success("Address updated!");
          setAddresses(prev => prev.map(addr => addr._id === editAddressId ? { ...addr, ...safeAddressForm } : addr));
        } else toast.error(res.message);
      } else {
        const res = await adminAddressService.createUserAddress(userId, safeAddressForm);
        if (res.success) {
          toast.success("Address added!");
          setAddresses(prev => [...prev, res.data]); 
        } else toast.error(res.message);
      }
      setShowAddressModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to save address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await adminAddressService.deleteUserAddress(userId, addressId);
      if (res.success) {
        toast.success("Address deleted");
        setAddresses(prev => prev.filter(addr => addr._id !== addressId));
      } else toast.error(res.message);
    } catch (error) {
      toast.error(error.message || "Failed to delete address");
    }
  };

  // 5. FINAL SUBMIT
  const onFinalSubmit = async (data) => {
    if (isNewUser) {
      if (!data.flatNo || !data.street || !data.pincode) {
        return toast.error("Flat No, Street Area, and Pin Code are required for the initial address.");
      }
    }
    
    setIsSaving(true);
    
    const selectedAdmin = adminList.find(a => a.fullName === data.leadOwner);
    let leadOwnerId = selectedAdmin ? selectedAdmin._id : data.leadOwner; 
    if (!selectedAdmin && data.leadOwner === customerData?.currentAdmin?.fullName) {
      leadOwnerId = customerData.currentAdmin._id; 
    }

    const payload = {
      name: data.name || "",
      age: data.age ? Number(data.age) : null,
      contactNumber: data.contact || "",
      whatsappNumber: data.whatsapp || "",
      email: data.email || "",
      mailId: data.email || "",
      city: data.city || "",
      leadSource: data.leadSource || "",
      leadStage: data.leadStage || "",
      notes: data.notes || "",
      sendWhatsAppNotification: !!data.sendWhatsApp,
    };

    if (!isNewUser) {
      payload.leadOwner = leadOwnerId;
    }

    if (isNewUser) {
      if (activities.length > 0) {
        payload.activity = activities.map(act => ({
          type: act.type, category: act.category, notes: act.notes,
          scheduledDate: act.scheduledDate, scheduledTime: act.scheduledTime, assignedTo: act.assignedToId
        }));
      }
      
      try {
        // 1. Create the user profile first
        const res = await createCustomerProfile(payload);
        
        if (res.success) {
          const generatedUserId = res.data.userId || res.data._id || res.data.leadId;
          
          // 2. ✅ Check if address fields are filled, then call createUserAddress
          const hasAddress = data.flatNo || data.street || data.pincode;
          if (hasAddress) {
            const addressPayload = {
              label: data.addressLabel || "Home",
              flatNo: data.flatNo || "",
              streetArea: data.street || "",
              landmark: data.landmark || "",
              pinCode: data.pincode || "",
              contactNumber: data.contact || "" 
            };
            
            try {
              await adminAddressService.createUserAddress(generatedUserId, addressPayload);
            } catch (addrError) {
              console.error("Failed to save address:", addrError);
              toast.error("User created, but failed to save initial address.");
            }
          }

          toast.success("User created successfully!", { duration: 5000 }); 
          router.push(`${basePath}/log-in-user/customerprofile?userId=${generatedUserId}`);
        } else {
          toast.error(res.message || "Failed to create user.", { duration: 5000 }); 
        }
      } catch (error) {
        console.error("Error creating user:", error);
        toast.error("An error occurred while creating the user.");
      }
      
    } else {
      try {
        const res = await submitCustomerProfile(userId, payload);
        if (res.success) {
          toast.success("Profile saved successfully!", { duration: 5000 }); 
        } else {
          toast.error(res.message || "Failed to update profile.", { duration: 5000 }); 
        }
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("An error occurred while updating the profile.");
      }
    }
    
    setIsSaving(false);
  };

  const formatActivityDate = (isoString) => {
    if (!isoString) return "--";
    return new Date(isoString).toLocaleDateString("en-IN", { 
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium">Loading form...</p>
      </div>
    );
  }

  if (!isNewUser && !customerData) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen flex flex-col items-center justify-center">
        <p className="text-slate-500 font-medium">Customer profile not found or invalid user ID.</p>
        <button 
          onClick={() => window.history.back()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isSuperAdmin = customerData?.currentAdmin?.role === 'super_admin';

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 md:px-8 font-sans">

      {showBookModal && <BookConsultationModal onClose={() => setShowBookModal(false)} userId={userId} />}

      <form onSubmit={handleSubmit(onFinalSubmit)} className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-end bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => window.history.back()} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
              <ArrowLeft size={16} /> Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {isNewUser ? "Create New Customer" : `Customer ID - ${customerData?.customerId || 'N/A'}`}
              </h1>
              {!isNewUser && <p className="text-sm font-medium text-slate-400 mt-1">Status: {customerData?.pageStatus?.replace("_", " ").toUpperCase()}</p>}
            </div>
          </div>
          <div className="w-full md:w-64">
            <label className="text-[11px] font-bold text-slate-400 uppercase mb-1 block">Lead Source</label>
            <div className="relative">
              <select {...register("leadSource")} className={`w-full appearance-none p-2.5 bg-slate-50 border ${errors.leadSource ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm outline-none focus:border-blue-500`}>
                <option value="Website">Website</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Manual">Manual</option>
                <option value="Self">Self</option>
                <option value="Agent">Agent</option>
                <option value="Doctor">Doctor</option>
                <option value="Other">Other</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-slate-400" size={16} />
            </div>
            {errors.leadSource && <p className="text-red-500 text-[10px] mt-1">{errors.leadSource.message}</p>}
          </div>
        </div>

        {/* BASIC INFORMATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          
          {/* Name */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Name <span className="text-red-500">*</span></label>
            <input {...register("name")} placeholder="Enter" className={`w-full p-2.5 border ${errors.name ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm outline-none focus:border-blue-400`} />
            {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Age</label>
            <input {...register("age")} placeholder="Enter" className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
          </div>

          {/* ✅ CONTACT NUMBER WITH ELEVATED Z-INDEX FOR DROPDOWN */}
          <div className="relative z-30">
            <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                {...register("contact")} 
                type="tel"
                maxLength={10}
                autoComplete="off"
                disabled={!isNewUser} // ✅ Conditionally disabled
                placeholder="Enter 10-digit number"
                className={`w-full p-2.5 border ${
                  errors.contact ? 'border-red-400' : 'border-slate-200'
                } rounded-xl text-sm outline-none pr-10 transition-colors ${
                  !isNewUser 
                    ? 'bg-slate-100 text-slate-500 cursor-not-allowed font-semibold' 
                    : 'bg-white focus:border-blue-400'
                }`} 
              />
              {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-500" size={16} />}
            </div>
            {errors.contact && <p className="text-red-500 text-[10px] mt-1">{errors.contact.message}</p>}

            {/* THE FLOATING DROPDOWN */}
            {showDropdown && isNewUser && watchedContact?.length >= 4 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-[300px] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {searchResults && searchResults.length > 0 ? (
                  <div className="p-2">
                    <div className="flex items-center gap-2 px-2 py-1.5 mb-1 bg-blue-50/50 rounded-lg">
                      <UserCheck className="text-blue-500" size={14} />
                      <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Existing Patients Found</p>
                    </div>
                    {searchResults.map(patient => (
                      <button 
                        key={patient.userId}
                        type="button"
                        onClick={() => router.push(`${basePath}/log-in-user/customerprofile?userId=${patient.userId}`)}
                        className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0 text-left group"
                      >
                        <div>
                          <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                            {patient.displayName?.split('—')[0]?.trim() || 'Unknown Name'}
                          </p>
                          <p className="text-xs text-slate-500 font-medium tracking-wide mt-1">
                            ID: {patient.customerId || 'N/A'} • 📞 {patient.mobileNo}
                          </p>
                        </div>
                        <span className="text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          Open Profile
                        </span>
                      </button>
                    ))}
                    <div className="mt-2 pt-2 border-t border-slate-100 px-2 text-center pb-1">
                       <button 
                         type="button"
                         onClick={() => setShowDropdown(false)}
                         className="text-[11px] font-bold text-slate-400 hover:text-slate-600 underline underline-offset-2"
                       >
                         Dismiss & Continue Creating New
                       </button>
                    </div>
                  </div>
                ) : !isSearching ? (
                  <div className="p-5 text-center">
                    <p className="text-sm font-bold text-slate-700">No matches found.</p>
                    <p className="text-[11px] text-slate-500 mt-1 mb-3">You can proceed with creating a new profile.</p>
                    <button 
                       type="button"
                       onClick={() => setShowDropdown(false)}
                       className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-bold text-xs transition-colors"
                     >
                       Continue Typing
                     </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* WhatsApp */}
          <div className="relative z-20">
            <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">WhatsApp Number</label>
            <input {...register("whatsapp")} placeholder="Enter" className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
          </div>

          {/* Lead Owner */}
          <div className="relative z-10">
            <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Lead Owner</label>
            <CreatableSelect 
              field={{ name: "leadOwner", options: adminList.map(a => a.fullName), disabled: isNewUser || !isSuperAdminRoute }} 
              register={register} setValue={setValue} watch={watch} error={errors.leadOwner} 
            />
            {errors.leadOwner && <p className="text-red-500 text-[10px] mt-1">{errors.leadOwner.message}</p>}
          </div>

          {/* Lead Stage */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Lead Stage</label>
            <div className="relative">
              <select {...register("leadStage")} className="w-full appearance-none p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500">
                <option value="">Select...</option>
                {["New", "Interested", "Follow-Up", "Future", "N-Interested", "Cancel", "Regular"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3 text-slate-400" size={16} />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">City</label>
            <input {...register("city")} placeholder="Enter" className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
          </div>

          {/* Email */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Mail Id</label>
            <input {...register("email")} placeholder="Enter" className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
          </div>

        </div>

        {/* DELIVERY ADDRESS */}
        {isNewUser ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <h3 className="font-bold text-slate-700">Initial Delivery Address <span className="text-red-500">*</span></h3>
            </div>
            <div className="flex gap-3">
              {['Home', 'Office', 'Other'].map(l => (
                <button key={l} type="button" onClick={() => setValue('addressLabel', l)}
                  className={`px-6 py-2 text-xs font-bold border rounded-xl transition-all ${watch('addressLabel') === l ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}>
                  {l}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  {...register("flatNo")}
                  placeholder="Flat No / House No *"
                  className={`w-full p-2.5 border ${errors.flatNo ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm outline-none focus:border-blue-400`}
                />
                {errors.flatNo && <p className="text-red-500 text-[10px] mt-1">{errors.flatNo.message}</p>}
              </div>
              <div>
                <input
                  {...register("street")}
                  placeholder="Street / Area *"
                  className={`w-full p-2.5 border ${errors.street ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm outline-none focus:border-blue-400`}
                />
                {errors.street && <p className="text-red-500 text-[10px] mt-1">{errors.street.message}</p>}
              </div>
              <div>
                <input
                  {...register("landmark")}
                  placeholder="Landmark"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <input
                  {...register("pincode")}
                  placeholder="Pin Code *"
                  className={`w-full p-2.5 border ${errors.pincode ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm outline-none focus:border-blue-400`}
                />
                {errors.pincode && <p className="text-red-500 text-[10px] mt-1">{errors.pincode.message}</p>}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 italic">Flat No, Street, and Pin Code are required for new profiles.</p>
          </div>
        ) : (
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-600" size={20} />
                <h3 className="font-bold text-slate-700">Address Book</h3>
              </div>
              <button type="button" onClick={openAddAddressModal}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                <Plus size={16} /> Add Address
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {addresses.length === 0 ? (
                <div className="col-span-full p-6 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No addresses saved yet. Click "Add Address" to create one.
                </div>
              ) : (
                addresses.map((addr) => (
                  <div key={addr._id} className="border border-gray-100 rounded-xl p-5 bg-[#FAFBFC] hover:shadow-sm transition-all relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${addr.label === 'Home' ? 'bg-blue-500' : addr.label === 'Work' || addr.label === 'Office' ? 'bg-orange-400' : 'bg-purple-500'}`} />
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{addr.label}</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => openEditAddressModal(addr)} className="text-gray-400 hover:text-blue-600 p-1"><Pencil size={14}/></button>
                        <button type="button" onClick={() => handleDeleteAddress(addr._id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={14}/></button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed font-medium">
                      <p>{addr.flatNo}, {addr.streetArea}</p>
                      {addr.landmark && <p className="text-gray-500 font-normal">Landmark: {addr.landmark}</p>}
                      <p className="text-gray-500 font-normal">PIN: {addr.pinCode}</p>
                      {addr.contactNumber && <p className="text-gray-500 font-normal mt-1">📞 {addr.contactNumber}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* NOTES */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">General Notes</label>
           <textarea {...register("notes")} className="w-full p-3 border border-slate-200 rounded-xl text-sm h-24 mb-4 outline-none focus:border-blue-400 resize-none" placeholder="Enter patient summary or general observations..."></textarea>
           {!isNewUser && (
             <div className="flex justify-end gap-3">
               <button type="button" onClick={() => setShowBookModal(true)}
                 className="px-6 py-2.5 bg-[#0097A7] text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-100 flex items-center gap-2 hover:bg-[#00838F] transition-colors">
                 <Calendar size={16}/> Book Consultation
               </button>
             </div>
           )}
           {isNewUser && (
             <div className="flex justify-end gap-3">
               <p className="text-[11px] text-slate-400 italic">Save profile to unlock consultation booking.</p>
             </div>
           )}
        </div>

        {/* ACTIVITY LOG & REMINDERS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">Activity Log & Reminders</h3>
            {isNewUser && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Queued Mode</span>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Activity Type */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">
                Activity Reason / Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("activityType")}
                  className={`w-full appearance-none p-2.5 bg-slate-50 border ${activityErrors.activityType ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm outline-none focus:border-blue-500 font-medium`}
                >
                  <optgroup label="Follow-Up">
                    <option value="Next Medicine Order">💊 Next Medicine Order</option>
                    <option value="Follow-Up">📞 Follow-Up</option>
                    <option value="Dr Consultation TC">💻 Dr Consultation TC</option>
                    <option value="Dr Follow Up In Clinic">🏥 Dr Follow Up In Clinic</option>
                  </optgroup>
                  <optgroup label="History">
                    <option value="Just Contact">✅ Just Contact</option>
                    <option value="Miss Contact">❌ Miss Contact</option>
                  </optgroup>
                  <optgroup label="Ticket">
                    <option value="TC Related">🎟️ TC Related</option>
                    <option value="In-Clinic Related">🎟️ In-Clinic Related</option>
                    <option value="Medicine Related">🎟️ Medicine Related</option>
                    <option value="Refund Related">🎟️ Refund Related</option>
                    <option value="Side Effect">🎟️ Side Effect</option>
                    <option value="Other">🎟️ Other</option>
                  </optgroup>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-slate-400" size={16} />
              </div>
              {activityErrors.activityType && (
                <p className="text-red-500 text-[10px] mt-1">{activityErrors.activityType}</p>
              )}
            </div>

            {/* Assign To */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">
                Assign to (User) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  {...register("activityAssignTo")} 
                  disabled={!isSuperAdmin}
                  className={`w-full appearance-none p-2.5 bg-slate-50 border ${activityErrors.activityAssignTo ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm outline-none ${!isSuperAdmin ? 'opacity-60 cursor-not-allowed text-slate-500 bg-gray-100' : 'focus:border-blue-500'}`}
                >
                  <option value="" disabled>Unassigned</option>
                  {adminList.map(admin => (
                    <option key={admin._id} value={admin.fullName}>{admin.fullName}</option>
                  ))}
                </select>
                <ChevronDown className={`absolute right-3 top-3 ${!isSuperAdmin ? 'text-gray-300' : 'text-slate-400'} pointer-events-none`} size={16} />
              </div>
              {activityErrors.activityAssignTo && (
                <p className="text-red-500 text-[10px] mt-1">{activityErrors.activityAssignTo}</p>
              )}
            </div>
          </div>

          {/* Activity Notes */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">
              Activity Note <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("activityNotes")}
              className={`w-full p-2.5 border ${activityErrors.activityNotes ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm h-20 outline-none focus:border-blue-400 resize-none`}
              placeholder="Enter reason or notes for this specific task (Required)"
            />
            {activityErrors.activityNotes && (
              <p className="text-red-500 text-[10px] mt-1">{activityErrors.activityNotes}</p>
            )}
          </div>
          
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[140px]">
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Due Date</label>
              <input type="date" {...register("activityDate")} className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Due Time</label>
              <input type="time" {...register("activityTime")} className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" />
            </div>
            <button 
              type="button" 
              disabled={isAddingActivity}
              onClick={addNewActivity}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAddingActivity && <Loader2 size={16} className="animate-spin"/>}
              {isNewUser ? "Queue Activity" : "Add Activity"}
            </button>
          </div>

          {/* ACTIVITY TABS */}
          <div className="flex gap-8 border-b border-slate-100 text-sm font-bold text-slate-400 pt-4 overflow-x-auto whitespace-nowrap">
            {['Upcoming', 'History', 'Order History', 'Ticket'].map(tab => (
              <button 
                key={tab} 
                type="button" 
                onClick={() => setActiveTab(tab)}
                className={`pb-3 transition-all ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="min-h-[150px]">
            {activeTab === 'Order History' ? (
              <OrderHistoryTab userId={userId} />
            ) : activeTab === 'Ticket' ? (
              <TicketTab activities={activities} userId={userId} />
            ) : loadingActivities ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map(act => (
                  <div key={act.activityId} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative hover:border-blue-200 transition-all animate-in fade-in slide-in-from-bottom-2">
                    <div className="absolute top-5 right-5 flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-slate-50 px-2 py-1 rounded-lg text-slate-400 uppercase tracking-widest">{act.status}</span>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-50 p-3 rounded-full text-blue-500">
                        <RotateCcw size={18} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="text-sm font-bold text-slate-800">{act.type}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{act.notes}</p>
                        {(act.scheduledDate || act.scheduledTime) && (
                          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase mt-2">
                            {act.scheduledDate && <span className="flex items-center gap-1"><Calendar size={12}/> {formatActivityDate(act.scheduledDate)}</span>}
                            {act.scheduledTime && <span className="flex items-center gap-1"><Clock size={12}/> {act.scheduledTime}</span>}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 font-medium">
                          <span>Created By: {act.createdBy || 'Unknown'}</span>
                          {act.assignedTo && <span className="before:content-['•'] before:mr-2 before:text-slate-300">Assigned To: {act.assignedTo}</span>}
                        </div>
                        {act.showActions && !isNewUser && (
                          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50 mt-4">
                            <button type="button" onClick={() => handleActivityStatusChange(act.activityId, 'Complete')}
                              className="flex items-center gap-1.5 text-[11px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] px-4 py-1.5 rounded-full hover:bg-[#C8E6C9] transition-all">
                              <CheckCircle2 size={13}/> Complete
                            </button>
                            <button type="button" onClick={() => handleActivityStatusChange(act.activityId, 'Not Interested')}
                              className="flex items-center gap-1.5 text-[11px] font-bold bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2] px-4 py-1.5 rounded-full hover:bg-[#FFCDD2] transition-all">
                              <XCircle size={13}/> Not Interested
                            </button>
                            <button type="button" onClick={() => handleActivityStatusChange(act.activityId, 'Postpone')}
                              className="flex items-center gap-1.5 text-[11px] font-bold bg-[#E3F2FD] text-[#1565C0] border border-[#BBDEFB] px-4 py-1.5 rounded-full hover:bg-[#BBDEFB] transition-all">
                              <Clock size={13}/> Postpone
                            </button>
                            <button type="button" className="ml-2 p-2 text-slate-300 hover:text-blue-500 transition-colors">
                              <MessageSquare size={18}/>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-sm">
                No {activeTab.toLowerCase()} activities found.
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="flex flex-wrap justify-between items-center py-8 border-t border-slate-200">
          <label className="flex items-center gap-3 text-sm font-medium text-slate-600 cursor-pointer group">
            <input type="checkbox" {...register("sendWhatsApp")} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
            <span className="group-hover:text-blue-600 transition-colors">Send WhatsApp Notification</span>
          </label>
          <div className="flex gap-4">
            <button type="button" onClick={() => window.history.back()} className="px-10 py-2.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">Cancel</button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-12 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
              {isSaving ? "Saving..." : (isNewUser ? "Create Customer" : "Save Profile")}
            </button>
          </div>
        </div>
      </form>

      {/* ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-900">{editAddressId ? "Edit Address" : "Add New Address"}</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1 mb-1 block">Label</label>
                <select
                  name="label"
                  value={addressForm.label}
                  onChange={handleAddressInputChange}
                  className={`w-full p-3 border ${addressErrors.label ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50`}
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
                {addressErrors.label && <p className="text-red-500 text-[10px] mt-1">{addressErrors.label}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1 mb-1 block">Flat / House No. *</label>
                  <input
                    name="flatNo"
                    value={addressForm.flatNo}
                    onChange={handleAddressInputChange}
                    placeholder="e.g. B-202"
                    className={`w-full p-3 border ${addressErrors.flatNo ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50`}
                  />
                  {addressErrors.flatNo && <p className="text-red-500 text-[10px] mt-1">{addressErrors.flatNo}</p>}
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1 mb-1 block">Street / Area *</label>
                  <input
                    name="streetArea"
                    value={addressForm.streetArea}
                    onChange={handleAddressInputChange}
                    placeholder="e.g. Koregaon Park"
                    className={`w-full p-3 border ${addressErrors.streetArea ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50`}
                  />
                  {addressErrors.streetArea && <p className="text-red-500 text-[10px] mt-1">{addressErrors.streetArea}</p>}
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1 mb-1 block">Landmark</label>
                  <input
                    name="landmark"
                    value={addressForm.landmark}
                    onChange={handleAddressInputChange}
                    placeholder="Optional"
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1 mb-1 block">PIN Code *</label>
                  <input
                    name="pinCode"
                    value={addressForm.pinCode}
                    onChange={handleAddressInputChange}
                    placeholder="e.g. 411001"
                    className={`w-full p-3 border ${addressErrors.pinCode ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50`}
                  />
                  {addressErrors.pinCode && <p className="text-red-500 text-[10px] mt-1">{addressErrors.pinCode}</p>}
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1 mb-1 block">Contact Number</label>
                  <input
                    name="contactNumber"
                    value={addressForm.contactNumber}
                    onChange={handleAddressInputChange}
                    placeholder="Optional"
                    className={`w-full p-3 border ${addressErrors.contactNumber ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50`}
                  />
                  {addressErrors.contactNumber && <p className="text-red-500 text-[10px] mt-1">{addressErrors.contactNumber}</p>}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowAddressModal(false)} className="flex-1 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold transition-colors">Cancel</button>
                <button type="submit" disabled={isSavingAddress} className="flex-1 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition-colors">
                  {isSavingAddress ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfilePage;