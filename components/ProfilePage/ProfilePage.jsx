"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Settings, ShoppingBag, HelpCircle, ShieldCheck, 
  FileText, LogOut, Pencil, MapPin, X, Menu, Save, CheckCircle, Mail, Phone 
} from "lucide-react";
import { toast } from "sonner";

// ✅ REDUX & SERVICES
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectIsAuthenticated, logoutSuccess } from "@/redux/slices/authSlice";
import { getPatientProfile, savePatientProfile } from "@/app/services/patient.service"; 
import api from "@/lib/axios";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Redux State
  const authUser = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // UI State
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    email: "",
    phone: "",
    profileImageUrl: "",
    homeAddress: "",
    workAddress: ""
  });

  /* =========================================================
      1. ✅ FIXED: AUTH & DATA FETCHING (Logic Unchanged)
     ========================================================= */
  useEffect(() => {
    if (!isAuthenticated) {
        return; 
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getPatientProfile();
        
        if (res.success && res.data) {
          const data = res.data;
          setFormData({
              name: data.fullName || "",
              gender: data.gender || "male",
              age: data.age || "",
              email: data.email || "",
              phone: data.user_id?.mobileNo || authUser?.mobileNo || "Not Provided",
              profileImageUrl: data.profileImageUrl || "",
              homeAddress: data.homeAddress || "",
              workAddress: data.workAddress || ""
          });
        } else {
          console.log("No profile found for user");
          toast.info("Please complete your profile");
        }
      } catch (err) {
          console.error("Profile fetch error:", err);
          if (err.response?.status === 404) {
            toast.info("Profile not found. Please create your profile.");
          } else {
            toast.error("Failed to load profile data");
          }
      } finally {
          setLoading(false);
      }
    };

    fetchDetails();
  }, [isAuthenticated, authUser]);

  /* =========================================================
      2. HANDLERS (Logic Unchanged)
     ========================================================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Construct Payload for Backend
    const payload = {
      fullName: formData.name,
      email: formData.email,
      age: formData.age ? parseInt(formData.age) : 0,
      gender: formData.gender,
      homeAddress: formData.homeAddress,
      workAddress: formData.workAddress
    };

    try {
      const res = await savePatientProfile(payload);
      if (res.success) {
        toast.success("Profile Updated!");
        setSaveStatus(true);
        setIsEditing(false);
        setTimeout(() => setSaveStatus(false), 3000);
      } else {
        toast.error(res.message || "Failed to update");
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(logoutSuccess());
      router.push("/");
      router.refresh();
    }
  };

  /* =========================================================
      3. UI RENDERING (Styled with File 1 Design)
     ========================================================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm font-medium">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans p-4 md:p-8">
      
      {/* MOBILE MENU TRIGGER */}
      <div className="lg:hidden mb-4 flex justify-end">
        <button onClick={() => setMenuOpen(true)} className="p-2 bg-white rounded-xl shadow-sm text-gray-600">
          <Menu size={24} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ---------------- SIDEBAR ---------------- */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="bg-white border-white border rounded-2xl p-6 shadow-sm sticky top-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md overflow-hidden bg-blue-600">
                {formData.profileImageUrl ? (
                   <img src={formData.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                   <User size={24} />
                )}
              </div>
              <div className="overflow-hidden">
                <h2 className="font-semibold text-base truncate">{formData.name || "User"}</h2>
                <p className="text-gray-400 text-xs truncate">{formData.email}</p>
              </div>
            </div>

            <div className="space-y-1">
              <SidebarItem icon={<Settings size={16}/>} label="Settings" active />
              <SidebarItem icon={<ShoppingBag size={16}/>} label="My Orders" />
              <SidebarItem icon={<HelpCircle size={16}/>} label="Help" />
              <SidebarItem icon={<ShieldCheck size={16}/>} label="Privacy Policy" />
              <SidebarItem icon={<FileText size={16}/>} label="Terms & Conditions" />
            </div>

            <button 
              onClick={handleLogout}
              className="w-full mt-8 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {/* ---------------- MAIN CONTENT ---------------- */}
        <main className="lg:col-span-9 space-y-6">
          
          {saveStatus && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-5 py-3 rounded-xl border-white border text-sm shadow-sm animate-in fade-in slide-in-from-top-2">
              <CheckCircle size={18} /> <span>Changes saved successfully!</span>
            </div>
          )}

          {/* USER INFO CARD */}
          <section className="bg-white border-white border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm gap-6">
            <div className="flex items-center gap-6 w-full">
              <div className="hidden sm:flex w-16 h-16 bg-blue-50 rounded-full items-center justify-center text-blue-600 border border-blue-50 overflow-hidden">
                {formData.profileImageUrl ? (
                   <img src={formData.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                   <User size={32} />
                )}
              </div>
              <div className="flex-1 w-full">
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase font-medium tracking-wider">Full Name</label>
                      <input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        className="w-full border-b border-blue-200 outline-none text-lg bg-transparent py-1 focus:border-blue-500 transition-colors" 
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase font-medium tracking-wider">Age</label>
                      <input 
                        name="age" 
                        type="number" 
                        value={formData.age} 
                        onChange={handleInputChange} 
                        className="w-full border-b border-blue-200 outline-none text-lg bg-transparent py-1 focus:border-blue-500 transition-colors" 
                        placeholder="Age"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                         <label className="text-[10px] text-gray-400 uppercase font-medium tracking-wider">Gender</label>
                         <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full border-b border-blue-200 outline-none text-base bg-transparent py-1 focus:border-blue-500 transition-colors"
                         >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                         </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{formData.name || "User Name"}</h2>
                    <p className="text-gray-500 text-sm mt-1 uppercase tracking-tight font-medium">
                      {formData.gender} • {formData.age ? `${formData.age} years old` : "Age not set"}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 self-end md:self-auto">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Edit Profile">
                  <Pencil size={18} />
                </button>
              ) : (
                <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium transition-all">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-md">
                        <Save size={16} /> Save
                    </button>
                </div>
              )}
            </div>
          </section>

          {/* CONTACT SECTION */}
          <section className="bg-white border-white border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Mail className="text-blue-600" size={20} />
                <h3 className="font-semibold text-base text-gray-900">Contact Information</h3>
              </div>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-600">
                  <Pencil size={16} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase font-medium tracking-wider">Email Address</label>
                {isEditing ? (
                  <input name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 bg-[#F9FAFB] border border-gray-100 rounded-lg text-sm outline-none focus:border-blue-300 transition-all" />
                ) : (
                  <p className="text-sm text-gray-700 font-medium">{formData.email || "No email provided"}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase font-medium tracking-wider">Phone Number <span className="text-[9px] normal-case text-gray-300">(Read-only)</span></label>
                <div className="w-full p-2 bg-gray-50 border border-transparent rounded-lg text-sm text-gray-500 cursor-not-allowed">
                    {formData.phone}
                </div>
              </div>
            </div>
          </section>

          {/* ADDRESS SECTION */}
          <section className="bg-white border-white border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-600" size={20} />
                <h3 className="font-semibold text-base text-gray-900">Address Book</h3>
              </div>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-600">
                  <Pencil size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableAddress 
                label="HOME ADDRESS" 
                name="homeAddress" 
                value={formData.homeAddress} 
                isEditing={isEditing} 
                onChange={handleInputChange} 
                accentColor="bg-blue-600" 
              />
              <EditableAddress 
                label="WORK ADDRESS" 
                name="workAddress" 
                value={formData.workAddress} 
                isEditing={isEditing} 
                onChange={handleInputChange} 
                accentColor="bg-orange-500" 
              />
            </div>
          </section>
        </main>
      </div>

      {/* ---------------- MOBILE DRAWER ---------------- */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex items-end">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="relative bg-white w-full rounded-t-3xl p-8 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Menu</h3>
              <button onClick={() => setMenuOpen(false)} className="p-2 bg-gray-50 rounded-full"><X size={20}/></button>
            </div>
            <div className="space-y-3">
              <MobileLink icon={<Settings size={18}/>} label="Account Settings" />
              <MobileLink icon={<ShoppingBag size={18}/>} label="Order History" />
              <MobileLink icon={<MapPin size={18}/>} label="Addresses" />
              <div className="h-px bg-gray-100 my-4" />
              <button 
                onClick={handleLogout}
                className="w-full py-4 rounded-xl bg-red-50 text-red-600 font-medium text-sm flex items-center justify-center gap-2"
              >
                <LogOut size={18} /> Logout Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- HELPER COMPONENTS (From File 1) ---

const SidebarItem = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all ${
    active ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"
  }`}>
    <div className="flex items-center gap-3">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  </button>
);

const MobileLink = ({ icon, label }) => (
  <button className="w-full p-4 bg-gray-50 rounded-xl flex items-center gap-4 text-sm font-medium text-gray-700 hover:bg-gray-100">
    <span className="text-blue-600">{icon}</span>
    <span>{label}</span>
  </button>
);

const EditableAddress = ({ label, name, value, isEditing, onChange, accentColor }) => (
  <div className="border border-white rounded-xl p-5 bg-[#FAFBFC] hover:shadow-inner transition-all relative">
    <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${accentColor}`} />
    <span className="text-[9px] font-semibold tracking-widest text-gray-400 uppercase block mb-2">{label}</span>
    {isEditing ? (
      <textarea 
        name={name}
        value={value}
        onChange={onChange}
        rows={2}
        className="w-full p-2 bg-white border border-blue-100 rounded-lg text-sm outline-none focus:border-blue-400 resize-none transition-shadow"
      />
    ) : (
      <p className="text-xs text-gray-600 leading-relaxed font-medium min-h-[40px] whitespace-pre-wrap">
          {value || "No address added yet."}
      </p>
    )}
  </div>
);

export default ProfilePage;