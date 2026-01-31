"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Calendar, Clock, MessageSquare, CheckCircle2, 
  XCircle, History, Save, ChevronDown, RotateCcw,
  Phone, Monitor, MapPin, CheckSquare, AlertCircle,
  Tag, Pill, X
} from 'lucide-react';

const CustomerProfilePage = () => {
  const { register, handleSubmit, watch, setValue, resetField } = useForm({
    defaultValues: {
      leadSource: 'Website',
      leadOwner: 'Pranjal',
      leadStage: 'New',
      city: 'Nagpur',
      addressLabel: 'Home',
      activityType: 'Next Medicine Order'
    }
  });

  const [activeTab, setActiveTab] = useState('Upcoming');
  const [activities, setActivities] = useState([
    {
      id: 1,
      title: "Next Medicine Order",
      desc: "Monthly prescription refill for Metformin and Atorvastatin.",
      date: "Sat Nov 15 2025",
      time: "10:00",
      status: "Admin"
    }
  ]);

  const addNewActivity = () => {
    const type = watch('activityType');
    const notes = watch('activityNotes');
    const date = watch('activityDate');
    const time = watch('activityTime');

    if(!date) return alert("Please select a date");

    const newAct = {
      id: Date.now(),
      title: type,
      desc: notes || "No additional notes provided.",
      date: new Date(date).toDateString(),
      time: time || "--:--",
      status: "Admin"
    };

    setActivities([newAct, ...activities]);
    resetField('activityNotes');
  };

  const onFinalSubmit = (data) => {
    console.log("Final Data:", { ...data, activityHistory: activities });
    alert("Full Customer Profile Saved Successfully!");
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 md:px-8 font-sans">
      <form onSubmit={handleSubmit(onFinalSubmit)} className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER AREA */}
        <div className="flex flex-wrap justify-between items-end bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Customer ID - 1254</h1>
          <div className="w-full md:w-64">
            <label className="text-[11px] font-bold text-slate-400 uppercase mb-1 block">Lead Source</label>
            <div className="relative">
              <select {...register("leadSource")} className="w-full appearance-none p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500">
                <option>Website</option>
                <option>Whats App</option>
                <option>Manual</option>
                <option>Self</option>
                <option>Agent</option>
                <option>Doctor</option>
                <option>Other</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-slate-400" size={16} />
            </div>
          </div>
        </div>

        {/* BASIC INFORMATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          {[
            { label: "Name", name: "name" }, { label: "Age", name: "age" },
            { label: "Contact Number", name: "contact" }, { label: "WhatsApp Number", name: "whatsapp" },
            { label: "Lead Owner", name: "leadOwner", type: "select", options: ["Pranjal", "Ankit"] },
            { 
                label: "Lead Stage", 
                name: "leadStage", 
                type: "select", 
                options: ["New", "Interested", "Future", "N-Interested", "Cancel", "Regular"] 
            },
            { label: "City", name: "city", type: "select", options: ["Nagpur", "Mumbai"] },
            { label: "Mail Id", name: "email" }
          ].map((f) => (
            <div key={f.name}>
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">{f.label}</label>
              {f.type === "select" ? (
                <div className="relative">
                    <select {...register(f.name)} className="w-full appearance-none p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500">
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 text-slate-400" size={16} />
                </div>
              ) : (
                <input {...register(f.name)} placeholder="Enter" className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
              )}
            </div>
          ))}
        </div>

        {/* DELIVERY ADDRESS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h3 className="font-bold text-slate-700">Delivery Address</h3>
            <button type="button" className="text-xs px-4 py-2 text-blue-600 font-bold bg-blue-50 rounded-lg hover:bg-blue-100 transition-all">Save Address</button>
          </div>
          <div className="flex gap-3">
            {['Home', 'Office', 'Other'].map(l => (
              <button key={l} type="button" onClick={() => setValue('addressLabel', l)} className={`px-6 py-2 text-xs font-bold border rounded-xl transition-all ${watch('addressLabel') === l ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}>{l}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register("flatNo")} placeholder="Flat No / House No" className="p-2.5 border border-slate-200 rounded-xl text-sm outline-none" />
            <input {...register("street")} placeholder="Street / Area" className="p-2.5 border border-slate-200 rounded-xl text-sm outline-none" />
            <input {...register("landmark")} placeholder="Landmark" className="p-2.5 border border-slate-200 rounded-xl text-sm outline-none" />
            <input {...register("pincode")} placeholder="Pin Code" className="p-2.5 border border-slate-200 rounded-xl text-sm outline-none" />
          </div>
        </div>

        {/* NOTES SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">General Notes</label>
           <textarea {...register("notes")} className="w-full p-3 border border-slate-200 rounded-xl text-sm h-24 mb-4 outline-none focus:border-blue-400 resize-none" placeholder="Enter patient summary or general observations..."></textarea>
           <div className="flex justify-end gap-3">
             <button type="button" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700">Save Notes</button>
             <button type="button" className="px-6 py-2.5 bg-[#0097A7] text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-100 flex items-center gap-2 hover:bg-[#00838F]">
               <Calendar size={16}/> Book Consultation
             </button>
           </div>
        </div>

        {/* ACTIVITY LOG & REMINDERS (PROFESSIONAL VERSION) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">
            Activity Log & Reminders
          </h3>
          
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
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Assign to (Lead Owner)</label>
              <div className="relative">
                <select {...register("assignTo")} className="w-full appearance-none p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500">
                  <option>Pranjal</option>
                  <option>Ankit</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-slate-400" size={16} />
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
              onClick={addNewActivity}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              Add Activity
            </button>
          </div>

          {/* ACTIVITY TABS */}
          <div className="flex gap-8 border-b border-slate-100 text-sm font-bold text-slate-400 pt-4">
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
          <div className="space-y-4">
            {activities.length > 0 ? activities.map(act => (
              <div key={act.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative hover:border-blue-200 transition-all animate-in fade-in slide-in-from-bottom-2">
                <div className="absolute top-5 right-5 text-[10px] font-bold bg-slate-50 px-2 py-1 rounded-lg text-slate-400 uppercase tracking-widest">{act.status}</div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-full text-blue-500">
                    <RotateCcw size={18} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">{act.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{act.desc}</p>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase mt-2">
                      <span className="flex items-center gap-1"><Calendar size={12}/> {act.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12}/> {act.time}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-4">
                      <button type="button" className="flex items-center gap-1.5 text-[11px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] px-4 py-1.5 rounded-full hover:bg-[#C8E6C9] transition-all"><CheckCircle2 size={13}/> Complete</button>
                      <button type="button" className="flex items-center gap-1.5 text-[11px] font-bold bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2] px-4 py-1.5 rounded-full hover:bg-[#FFCDD2] transition-all"><XCircle size={13}/> Not Interested</button>
                      <button type="button" className="flex items-center gap-1.5 text-[11px] font-bold bg-[#E3F2FD] text-[#1565C0] border border-[#BBDEFB] px-4 py-1.5 rounded-full hover:bg-[#BBDEFB] transition-all"><Clock size={13}/> Postpone</button>
                      <button type="button" className="ml-2 p-2 text-slate-300 hover:text-blue-500 transition-colors"><MessageSquare size={18}/></button>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
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
            <button type="button" className="px-10 py-2.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">Cancel</button>
            <button type="submit" className="px-12 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
              <Save size={18} /> Save Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerProfilePage;