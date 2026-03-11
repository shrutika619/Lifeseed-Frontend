"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
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
import { toast } from 'sonner';
import { 
  Calendar, Clock, MessageSquare, CheckCircle2, 
  XCircle, Save, ChevronDown, RotateCcw,
  Monitor, MapPin, X, ArrowLeft, Loader2
} from 'lucide-react';

/* ─────────────────────────────────────────────
   CITY SELECT MODAL
───────────────────────────────────────────── */
const cities = [
  { name: "NAGPUR",   sub: "Maharashtra, India", slug: "nagpur"   },
  { name: "MUMBAI",   sub: "Maharashtra",        slug: "mumbai"   },
  { name: "PUNE",     sub: "Maharashtra",        slug: "pune"     },
  { name: "NASHIK",   sub: "Maharashtra",        slug: "nashik"   },
  { name: "AMRAVATI", sub: "Maharashtra",        slug: "amravati" },
  { name: "KOLHAPUR", sub: "Maharashtra",        slug: "kolhapur" },
  { name: "DELHI",    sub: "Delhi",              slug: "delhi"    },
];

const CitySelectModal = ({ onClose }) => {
  const handleCitySelect = (slug) => {
    window.location.href = `/clinic/${slug}/`;
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
        <div className="overflow-y-auto max-h-[380px] divide-y divide-slate-100">
          {cities.map((city) => (
            <button
              key={city.slug} type="button" onClick={() => handleCitySelect(city.slug)}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors text-left"
            >
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="font-bold text-slate-800 text-sm">{city.name}</p>
                <p className="text-xs text-slate-500">{city.sub}</p>
              </div>
            </button>
          ))}
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
const BookConsultationModal = ({ onClose }) => {
  const [showCityModal, setShowCityModal] = useState(false);

  if (showCityModal) return <CitySelectModal onClose={onClose} />;

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
            type="button" onClick={() => { window.location.href = '/free-consultation'; }}
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
const CreatableSelect = ({ field, register, setValue, watch }) => {
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
            onBlur={(e) => { setValue(field.name, e.target.value); setIsEditing(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { setValue(field.name, e.target.value); setIsEditing(false); } if (e.key === 'Escape') setIsEditing(false); }}
            className="flex-1 p-2.5 border-2 border-blue-400 rounded-xl text-sm outline-none bg-white"
          />
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              {...register(field.name)}
              disabled={field.disabled}
              className={`w-full appearance-none p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none ${field.disabled ? 'opacity-60 cursor-not-allowed bg-gray-100 text-slate-500 font-bold' : 'focus:border-blue-500'}`}
            >
              <option value="" disabled>Select...</option>
              {field.options.map(o => <option key={o} value={o}>{o}</option>)}
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

  const { register, handleSubmit, watch, setValue, resetField, reset } = useForm({
    defaultValues: {
      activityType: 'Next Medicine Order',
      activityAssignTo: '',
      leadSource: 'Manual',
      pageStatus: 'manual'
    }
  });

  const watchedLeadOwner = watch("leadOwner");

  useEffect(() => {
    if (watchedLeadOwner) {
      setValue("activityAssignTo", watchedLeadOwner);
    }
  }, [watchedLeadOwner, setValue]);

  // 1. Fetch Profile OR Initial Admin Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const safeString = (val) => {
        if (!val) return "";
        if (typeof val === 'object') return val.fullName || val.username || "";
        return String(val);
      };

      if (isNewUser) {
        // 🟢 CREATE MODE (Auto-Assigned Option 1)
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
        // 🔵 EDIT MODE
        const res = await getPatientDetailsById(userId);
        if (res.success && res.data) {
          setCustomerData(res.data);
          setAdminList(res.data.assignToDropdown || []);

          const existingOwner = safeString(res.data.leadOwner);
          const defaultOwnerName = existingOwner || res.data.currentAdmin?.fullName || "";

          reset({
            name: res.data.name || "",
            age: res.data.age || "",
            contact: res.data.mobileNo || "",
            whatsapp: res.data.whatsappNumber || "",
            leadOwner: defaultOwnerName, 
            leadStage: res.data.leadStage || "New",
            city: res.data.city || "",
            email: res.data.mailId || res.data.email || "",
            leadSource: res.data.leadSource || "Website",
            addressLabel: res.data.deliveryAddress?.label || "Home",
            flatNo: res.data.deliveryAddress?.flatNo || "",
            street: res.data.deliveryAddress?.streetArea || "",
            landmark: res.data.deliveryAddress?.landmark || "",
            pincode: res.data.deliveryAddress?.pinCode || "",
            notes: res.data.notes || "",
            sendWhatsApp: res.data.sendWhatsAppNotification || false,
            activityType: "Next Medicine Order",
            activityAssignTo: defaultOwnerName
          });
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [userId, isNewUser, reset]);

  // 2. Fetch Activities (Only if NOT a new user)
  const fetchActivities = useCallback(async () => {
    if (isNewUser || !userId) return;
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

  // 3. ADD NEW ACTIVITY LOG
  const addNewActivity = async () => {
    const type = watch('activityType');
    const notes = watch('activityNotes');
    const date = watch('activityDate');
    const time = watch('activityTime');
    const assignToName = watch('activityAssignTo');

    const category = ACTIVITY_CATEGORIES[type] || "Follow-Up";

    const payload = {
      type: type,
      category: category,
      notes: notes || "",
    };

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
      // 🟢 CREATE MODE: Queue activity locally
      const localActivity = {
        activityId: `temp_${Date.now()}`,
        type: payload.type,
        category: payload.category,
        notes: payload.notes,
        scheduledDate: payload.scheduledDate || null,
        scheduledTime: payload.scheduledTime || "",
        assignedToId: payload.assignedTo || null,
        assignedTo: assignToName,
        status: "Pending",
        createdBy: customerData?.currentAdmin?.fullName || 'You',
        showActions: false 
      };

      setActivities([localActivity, ...activities]);
      toast.success("Activity queued! Save profile to submit.");
      
      resetField('activityNotes');
      resetField('activityDate');
      resetField('activityTime');

    } else {
      // 🔵 EDIT MODE: Send to backend
      setIsAddingActivity(true);
      const res = await addCustomerActivity(userId, payload);
      
      if (res.success) {
        toast.success("Activity added successfully!");
        resetField('activityNotes');
        resetField('activityDate');
        resetField('activityTime');
        fetchActivities(); 
      } else {
        toast.error(res.message || "Failed to add activity");
      }
      setIsAddingActivity(false);
    }
  };

  // 4. UPDATE ACTIVITY STATUS HANDLER
  const handleActivityStatusChange = async (activityId, newStatus) => {
    if (isNewUser) return; 

    const payload = { status: newStatus };

    if (newStatus === "Not Interested") {
      const userNotes = window.prompt("Add notes for marking as 'Not Interested' (Optional):");
      if (userNotes === null) return; 
      if (userNotes.trim() !== "") {
        payload.notes = userNotes;
      }
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

  // 5. FINAL PROFILE SUBMIT HANDLER
  const onFinalSubmit = async (data) => {
    setIsSaving(true);

    const selectedAdmin = adminList.find(a => a.fullName === data.leadOwner);
    let leadOwnerId = selectedAdmin ? selectedAdmin._id : data.leadOwner; 
    
    if (!selectedAdmin && data.leadOwner === customerData?.currentAdmin?.fullName) {
      leadOwnerId = customerData.currentAdmin._id; 
    }

    const payload = {
      name: data.name,
      age: data.age ? Number(data.age) : null,
      contactNumber: data.contact,
      whatsappNumber: data.whatsapp,
      email: data.email,
      mailId: data.email,
      city: data.city,
      leadSource: data.leadSource,
      leadStage: data.leadStage,
      notes: data.notes,
      sendWhatsAppNotification: !!data.sendWhatsApp,
      deliveryAddress: {
        label: data.addressLabel || "Home",
        flatNo: data.flatNo,
        streetArea: data.street,
        landmark: data.landmark,
        pinCode: data.pincode,
        contactNumber: data.contact 
      }
    };

    // ✅ If Editing an existing user, send the leadOwner field
    if (!isNewUser) {
        payload.leadOwner = leadOwnerId;
    }

    if (isNewUser) {
      // 🟢 CREATE NEW USER
      if (activities.length > 0) {
        payload.activity = activities.map(act => ({
          type: act.type,
          category: act.category,
          notes: act.notes,
          scheduledDate: act.scheduledDate,
          scheduledTime: act.scheduledTime,
          assignedTo: act.assignedToId
        }));
      }

      const res = await createCustomerProfile(payload);
      if (res.success) {
        toast.success("User created successfully!", { duration: 5000 }); 
        const basePath = pathname.split('/newuser')[0];
        // Ensure it directs to the generated ID!
        const generatedUserId = res.data.userId || res.data._id || res.data.leadId;
        router.push(`${basePath}/log-in-user/customerprofile?userId=${generatedUserId}`);
      } else {
        toast.error(res.message || "Failed to create user.", { duration: 5000 }); 
      }
    } else {
      // 🔵 UPDATE EXISTING USER
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

      {showBookModal && <BookConsultationModal onClose={() => setShowBookModal(false)} />}

      <form onSubmit={handleSubmit(onFinalSubmit)} className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER AREA */}
        <div className="flex flex-wrap justify-between items-end bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              <ArrowLeft size={16} />
              Back
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
              <select {...register("leadSource")} className="w-full appearance-none p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500">
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
              label: "Lead Owner", 
              name: "leadOwner", 
              type: "creatable", 
              options: adminList.map(a => a.fullName),
              disabled: isNewUser || !isSuperAdminRoute // ✅ Locked during creation & for regular admins
            }, 
            { 
                label: "Lead Stage", 
                name: "leadStage", 
                type: "select", 
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
                    <select {...register(f.name, { required: f.required })} className="w-full appearance-none p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500">
                      <option value="">Select...</option>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 text-slate-400" size={16} />
                </div>
              ) : f.type === "creatable" ? (
                <CreatableSelect field={f} register={register} setValue={setValue} watch={watch} />
              ) : (
                <input {...register(f.name, { required: f.required })} placeholder="Enter" className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
              )}
            </div>
          ))}
        </div>

        {/* DELIVERY ADDRESS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h3 className="font-bold text-slate-700">Delivery Address</h3>
          </div>
          <div className="flex gap-3">
            {['Home', 'Office', 'Other'].map(l => (
              <button key={l} type="button" onClick={() => setValue('addressLabel', l)} className={`px-6 py-2 text-xs font-bold border rounded-xl transition-all ${watch('addressLabel') === l ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}>{l}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register("flatNo")} placeholder="Flat No / House No" className="p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
            <input {...register("street")} placeholder="Street / Area" className="p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
            <input {...register("landmark")} placeholder="Landmark" className="p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
            <input {...register("pincode")} placeholder="Pin Code" className="p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
          </div>
        </div>

        {/* NOTES SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">General Notes</label>
           <textarea {...register("notes")} className="w-full p-3 border border-slate-200 rounded-xl text-sm h-24 mb-4 outline-none focus:border-blue-400 resize-none" placeholder="Enter patient summary or general observations..."></textarea>
           
           <div className="flex justify-end gap-3">
             <button
               type="button"
               onClick={() => setShowBookModal(true)}
               className="px-6 py-2.5 bg-[#0097A7] text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-100 flex items-center gap-2 hover:bg-[#00838F] transition-colors"
             >
               <Calendar size={16}/> Book Consultation
             </button>
           </div>
        </div>

        {/* ACTIVITY LOG & REMINDERS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">Activity Log & Reminders</h3>
            {isNewUser && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Queued Mode</span>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Add New (Categorized)</label>
              <div className="relative">
                <select {...register("activityType")} className="w-full appearance-none p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 font-medium">
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
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Assign to (User)</label>
              <div className="relative">
                <select 
                  {...register("activityAssignTo")} 
                  disabled={!isSuperAdmin}
                  className={`w-full appearance-none p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none ${!isSuperAdmin ? 'opacity-60 cursor-not-allowed text-slate-500 bg-gray-100' : 'focus:border-blue-500'}`}
                >
                  <option value="" disabled>Unassigned</option>
                  {adminList.map(admin => (
                    <option key={admin._id} value={admin.fullName}>{admin.fullName}</option>
                  ))}
                </select>
                <ChevronDown className={`absolute right-3 top-3 ${!isSuperAdmin ? 'text-gray-300' : 'text-slate-400'} pointer-events-none`} size={16} />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Activity Specific Notes</label>
            <textarea {...register("activityNotes")} className="w-full p-2.5 border border-slate-200 rounded-xl text-sm h-20 outline-none focus:border-blue-400 resize-none" placeholder="Enter notes for this specific task..."></textarea>
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

          {/* ACTIVITY LIST */}
          <div className="space-y-4 min-h-[150px]">
            {loadingActivities ? (
               <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
            ) : activities.length > 0 ? (
              activities.map(act => (
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
                        <button 
                          type="button" 
                          onClick={() => handleActivityStatusChange(act.activityId, 'Complete')}
                          className="flex items-center gap-1.5 text-[11px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] px-4 py-1.5 rounded-full hover:bg-[#C8E6C9] transition-all"
                        >
                          <CheckCircle2 size={13}/> Complete
                        </button>
                        
                        <button 
                          type="button" 
                          onClick={() => handleActivityStatusChange(act.activityId, 'Not Interested')}
                          className="flex items-center gap-1.5 text-[11px] font-bold bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2] px-4 py-1.5 rounded-full hover:bg-[#FFCDD2] transition-all"
                        >
                          <XCircle size={13}/> Not Interested
                        </button>
                        
                        <button 
                          type="button" 
                          onClick={() => handleActivityStatusChange(act.activityId, 'Postpone')}
                          className="flex items-center gap-1.5 text-[11px] font-bold bg-[#E3F2FD] text-[#1565C0] border border-[#BBDEFB] px-4 py-1.5 rounded-full hover:bg-[#BBDEFB] transition-all"
                        >
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
            ))) : (
              <div className="text-center py-10 text-slate-400 text-sm">No {activeTab.toLowerCase()} activities found.</div>
            )}
          </div>
        </div>

        {/* BOTTOM GLOBAL ACTIONS */}
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
    </div>
  );
};

export default CustomerProfilePage;