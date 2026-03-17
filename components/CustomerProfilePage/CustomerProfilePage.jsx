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
  getAdminDropdownData   
} from '@/app/services/admin/leads.service'; 
import { adminAddressService } from '@/app/services/admin/adminAddress.service'; 
import { getAllCities } from "@/app/services/patient/clinic.service";
import { toast } from 'sonner';
import { 
  Calendar, Clock, MessageSquare, CheckCircle2, 
  XCircle, Save, ChevronDown, RotateCcw,
  Monitor, MapPin, X, ArrowLeft, Loader2, Plus, Trash2, Pencil
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
   ORDER HISTORY — SAMPLE DATA
───────────────────────────────────────────── */
const SAMPLE_ORDER_HISTORY = [
  {
    id: 'order-1',
    type: 'Teleconsultation',
    icon: '🔮',
    iconBg: '#f3e8ff',
    doctor: 'Dr. Aisha Sharma',
    specialization: 'Cardiologist',
    location: null,
    date: 'Nov 25, 2024',
    timeSlot: '11:30 AM - 12:00 PM',
    status: 'Upcoming',
    statusColor: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    details: [
      { label: 'Order ID',      value: '#TC-98765' },
      { label: 'Booking ID',    value: '#BK-54321' },
      { label: 'Booking Time', value: 'Nov 20, 2024, 8:15 PM' },
      { label: 'Amount Paid',  value: '$50.00' },
      { label: 'Agent',        value: 'Pranjal' },
    ],
    actions: ['View Details', 'Edit', 'Cancel'],
  },
  {
    id: 'order-2',
    type: 'In-Clinic Consultation',
    icon: '📋',
    iconBg: '#fef9c3',
    doctor: 'Dr. Rohan Gupta',
    specialization: 'General Physician',
    location: 'Apollo Clinic, Koregaon Park',
    date: 'Nov 28, 2024',
    timeSlot: '5:00 PM - 5:30 PM',
    status: 'Upcoming',
    statusColor: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    details: [
      { label: 'Order ID',      value: '#IC-67890' },
      { label: 'Patient Age',  value: '34' },
      { label: 'Booking Time', value: 'Nov 21, 2024, 10:05 AM' },
      { label: 'Amount Paid',  value: '$80.00' },
      { label: 'Agent',        value: 'Pranjal' },
    ],
    actions: ['View Details', 'Get Directions', 'Edit', 'Cancel'],
  },
  {
    id: 'order-3',
    type: 'Medicine Order',
    icon: '🧴',
    iconBg: '#e0f2fe',
    doctor: null,
    specialization: null,
    location: null,
    date: 'Nov 1, 2024',
    timeSlot: null,
    status: 'Delivered',
    statusColor: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    orderId: '#MED-12908',
    items: 'Paracetamol (1 strip), Atorvastatin (1 strip), Vitamin D Sachet...',
    actions: ['View Order', 'Reorder'],
  },
]

/* ─────────────────────────────────────────────
   TICKET — SAMPLE DATA
───────────────────────────────────────────── */
const SAMPLE_TICKETS = [
  {
    id: 'ticket-1',
    category: 'Tc Related',
    title: 'Users are reporting that the login page is not loading properly on mobile devices.',
    meta: 'Wed, Mar 11, 2026, 09:30 AM • Agent: Pranjal',
    statuses: ['Open', 'Unresolved', 'Resolved', 'Closed'],
    activeStatus: 'Open',
    comments: [
      { author: 'Sarah Johnson', time: 'Wed, Mar 11, 2026, 09:35 AM', text: 'Checked the server logs, no errors found.' },
    ],
  },
  {
    id: 'ticket-2',
    category: null,
    title: 'Login page not loading',
    body: 'Users are reporting that the login page is not loading properly on mobile devices.',
    meta: 'Technical • Wed, Mar 11, 2026, 09:30 AM • Agent: Sarah Johnson',
    statuses: ['Open', 'Unresolved', 'Resolved', 'Fake'],
    activeStatus: 'Open',
    comments: [
      { author: 'Sarah Johnson', time: 'Wed, Mar 11, 2026, 09:35 AM', text: 'Checked the server logs, no errors found.' },
    ],
  },
]

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
const OrderHistoryTab = () => (
  <div className="space-y-4">
    {SAMPLE_ORDER_HISTORY.map((order) => (
      <div key={order.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
              style={{ background: order.iconBg }}
            >
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
              {order.location && (
                <p className="text-xs text-slate-400 mt-0.5">{order.location}</p>
              )}
              {order.date && (
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  {order.timeSlot
                    ? <>Time Slot: <span className="text-slate-800">{order.date}</span>&nbsp;•&nbsp;{order.timeSlot}</>
                    : order.date
                  }
                </p>
              )}
            </div>
          </div>
          <span
            className="text-[11px] font-bold px-3 py-1 rounded-full border ml-2 shrink-0"
            style={{ background: order.statusColor.bg, color: order.statusColor.text, borderColor: order.statusColor.border }}
          >
            {order.status}
          </span>
        </div>

        {order.orderId && (
          <div className="text-xs text-slate-600 mt-2 mb-1">
            <span className="font-medium">Order ID: </span>{order.orderId}
          </div>
        )}
        {order.items && (
          <div className="text-xs text-slate-500 mb-1">
            <span className="font-medium">Items: </span>{order.items}
          </div>
        )}

        {order.details && (
          <div className="mt-3 border-t border-slate-50 pt-3 space-y-1.5">
            {order.details.map((d) => (
              <div key={d.label} className="flex justify-between text-xs">
                <span className="text-slate-400">{d.label}:</span>
                <span className="font-semibold text-slate-700">{d.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-50">
          {order.actions.map((action) => {
            const isDanger  = action === 'Cancel'
            const isPrimary = action === 'Reorder'
            const isLink    = ['View Details', 'View Order', 'Get Directions', 'Edit'].includes(action)
            return (
              <button
                key={action}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all
                  ${isDanger  ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : ''}
                  ${isPrimary ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' : ''}
                  ${isLink    ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' : ''}
                `}
              >
                {action}
              </button>
            )
          })}
        </div>
      </div>
    ))}
  </div>
)

/* ─────────────────────────────────────────────
   TICKET TAB COMPONENT
───────────────────────────────────────────── */
const TicketCard = ({ ticket }) => {
  const [activeStatus, setActiveStatus] = useState(ticket.activeStatus)
  const [comments, setComments]         = useState(ticket.comments)
  const [commentInput, setCommentInput] = useState('')

  const handleAddComment = () => {
    if (!commentInput.trim()) return
    setComments([...comments, { author: 'You', time: 'Just now', text: commentInput.trim() }])
    setCommentInput('')
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-slate-400 text-sm font-bold">D</span>
        </div>
        <div className="flex-1">
          {ticket.category && (
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{ticket.category}</p>
          )}
          <p className="text-sm font-bold text-slate-800">{ticket.title}</p>
          {ticket.body && <p className="text-sm text-slate-600 mt-1">{ticket.body}</p>}
          <p className="text-xs text-slate-400 mt-1">{ticket.meta}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {ticket.statuses.map((s) => (
          <button
            key={s}
            onClick={() => setActiveStatus(s)}
            className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full transition-all
              ${activeStatus === s
                ? ticketStatusStyle(s) + ' shadow-sm'
                : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'
              }`}
          >
            <span>{ticketStatusIcon(s)}</span> {s}
          </button>
        ))}
      </div>

      <div>
        <p className="text-xs font-bold text-slate-500 mb-2">Comments ({comments.length})</p>
        <div className="space-y-2 mb-3">
          {comments.map((c, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-3">
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
            placeholder="Add a comment..."
            className="flex-1 text-xs p-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-400 bg-slate-50"
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  )
}

const TicketTab = () => (
  <div className="space-y-4">
    {SAMPLE_TICKETS.map((ticket) => (
      <TicketCard key={ticket.id} ticket={ticket} />
    ))}
  </div>
)

/* ─────────────────────────────────────────────
   CITY SELECT MODAL
───────────────────────────────────────────── */
const CitySelectModal = ({ onClose }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await getAllCities();
        const data = response?.data || response; 
        if (Array.isArray(data)) {
          setCities(data);
        }
      } catch (error) {
        console.error("Failed to fetch cities", error);
        toast.error("Failed to load cities");
      } finally {
        setLoading(false);
      }
    };
    fetchCityData();
  }, []);

  const handleCitySelect = (slug) => {
    const finalSlug = slug || "nagpur"; 
    window.location.href = `/clinic/${finalSlug}/`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 bg-blue-600">
          <h3 className="font-bold text-white text-lg">Select Clinic City</h3>
          <button onClick={onClose} className="p-1 hover:bg-blue-500 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[380px] divide-y divide-slate-100 min-h-[200px] relative">
          {loading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
               <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
               <p className="text-sm font-medium">Loading cities...</p>
             </div>
          ) : cities.length > 0 ? (
            cities.map((city, idx) => (
              <button
                key={city._id || idx} type="button" onClick={() => handleCitySelect(city.name?.toLowerCase())}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors text-left"
              >
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800 text-sm uppercase">{city.name}</p>
                  <p className="text-xs text-slate-500">{city.state || "India"}</p>
                </div>
              </button>
            ))
          ) : (
             <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <p className="text-sm">No clinics found.</p>
             </div>
          )}
        </div>
        
        <div className="px-6 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">Can't find your city? Contact Customer Support</p>
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
  const [showCityModal, setShowCityModal] = useState(false);

  if (showCityModal) return <CitySelectModal onClose={onClose} />;

  const handleTeleconsultationClick = () => {
    if (userId) {
      router.push(`/free-consultation?admin_booking=true&userId=${userId}`);
    } else {
      router.push('/free-consultation');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 text-lg">Book Consultation</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <button
            type="button" onClick={() => setShowCityModal(true)}
            className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-[#0097A7] hover:bg-[#E0F7FA] transition-all group"
          >
            <div className="w-11 h-11 rounded-full bg-[#E0F7FA] flex items-center justify-center group-hover:bg-[#0097A7] transition-all">
              <MapPin className="w-5 h-5 text-[#0097A7] group-hover:text-white transition-all" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 text-sm">In Clinic</p>
              <p className="text-xs text-slate-500">Physical visit at clinic</p>
            </div>
          </button>
          
          <button
            type="button" onClick={handleTeleconsultationClick}
            className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-all">
              <Monitor className="w-5 h-5 text-blue-600 group-hover:text-white transition-all" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800 text-sm">TeleConsultation</p>
              <p className="text-xs text-slate-500">Online video/call consultation</p>
            </div>
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
            onKeyDown={(e) => { if (e.key === 'Enter') { setValue(field.name, e.target.value, { shouldValidate: true }); setIsEditing(false); } if (e.key === 'Escape') setIsEditing(false); }}
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
  
  const userId = searchParams.get('userId'); 
  const isNewUser = !userId; 

  const isSuperAdminRoute = pathname.startsWith('/super-admin');
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  
  const [adminList, setAdminList] = useState([]);
  const [showBookModal, setShowBookModal] = useState(false);

  const [activeTab, setActiveTab] = useState('Upcoming');
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // ADDRESS STATE
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: "Home", flatNo: "", streetArea: "", landmark: "", pinCode: "", contactNumber: ""
  });
  // ── Address form validation errors ──
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

  // ── Separate activity form state for validation ──
  const [activityErrors, setActivityErrors] = useState({});

  const watchedLeadOwner = watch("leadOwner");

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
    if (activeTab === 'Order History' || activeTab === 'Ticket') return;
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

  // 3. ADD NEW ACTIVITY LOG — with yup validation
  const addNewActivity = async () => {
    const type       = watch('activityType');
    const notes      = watch('activityNotes');
    const assignToName = watch('activityAssignTo');
    const date       = watch('activityDate');
    const time       = watch('activityTime');

    // ── Validate activity fields via yup ──
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
      return; // stop — don't proceed
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
    // Clear error for this field on change
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

    // ── Validate address form via yup ──
    try {
      await addressFormSchema.validate(addressForm, { abortEarly: false });
      setAddressErrors({});
    } catch (validationError) {
      const errs = {};
      validationError.inner.forEach(err => { errs[err.path] = err.message; });
      setAddressErrors(errs);
      return; // stop — don't call API
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

    if (isNewUser) {
      payload.deliveryAddress = {
        label: data.addressLabel || "Home",
        flatNo: data.flatNo || "",
        streetArea: data.street || "",
        landmark: data.landmark || "",
        pinCode: data.pincode || "",
        contactNumber: data.contact || "" 
      };
    }

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
      const res = await createCustomerProfile(payload);
      if (res.success) {
        toast.success("User created successfully!", { duration: 5000 }); 
        const basePath = pathname.split('/newuser')[0];
        const generatedUserId = res.data.userId || res.data._id || res.data.leadId;
        router.push(`${basePath}/log-in-user/customerprofile?userId=${generatedUserId}`);
      } else {
        toast.error(res.message || "Failed to create user.", { duration: 5000 }); 
      }
    } else {
      const res = await submitCustomerProfile(userId, payload);
      if (res.success) {
        toast.success("Profile saved successfully!", { duration: 5000 }); 
      } else {
        toast.error(res.message || "Failed to update profile.", { duration: 5000 }); 
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
        <div className="flex flex-wrap justify-between items-end bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
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
          {[
            { label: "Name", name: "name", required: true }, 
            { label: "Age", name: "age" },
            { label: "Contact Number", name: "contact", required: true }, 
            { label: "WhatsApp Number", name: "whatsapp" },
            { 
              label: "Lead Owner", name: "leadOwner", type: "creatable", 
              options: adminList.map(a => a.fullName), disabled: isNewUser || !isSuperAdminRoute 
            }, 
            { 
              label: "Lead Stage", name: "leadStage", type: "select", 
              options: ["New", "Interested", "Follow-Up", "Future", "N-Interested", "Cancel", "Regular"] 
            },
            { label: "City", name: "city" },
            { label: "Mail Id", name: "email" }
          ].map((f) => (
            <div key={f.name}>
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">
                {f.label} {f.required && <span className="text-red-500">*</span>}
              </label>
              {f.type === "select" ? (
                <div className="relative">
                  <select {...register(f.name)} className={`w-full appearance-none p-2.5 bg-slate-50 border ${errors[f.name] ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm outline-none focus:border-blue-500`}>
                    <option value="">Select...</option>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-slate-400" size={16} />
                </div>
              ) : f.type === "creatable" ? (
                <CreatableSelect field={f} register={register} setValue={setValue} watch={watch} error={errors[f.name]} />
              ) : (
                <input {...register(f.name)} placeholder="Enter" className={`w-full p-2.5 border ${errors[f.name] ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm outline-none focus:border-blue-400`} />
              )}
              {errors[f.name] && <p className="text-red-500 text-[10px] mt-1">{errors[f.name]?.message}</p>}
            </div>
          ))}
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
              <OrderHistoryTab />
            ) : activeTab === 'Ticket' ? (
              <TicketTab />
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