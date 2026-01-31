"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Settings, ShoppingBag, HelpCircle, ShieldCheck, FileText, LogOut, Pencil, MapPin, X, Menu, Save, CheckCircle, Phone } from "lucide-react";
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

  // Form State (Initialized empty, filled after fetch)
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
      1. ✅ FIXED: AUTH & DATA FETCHING (No userId needed)
     ========================================================= */
  useEffect(() => {
    if (!isAuthenticated) {
        return; // User not logged in, don't fetch
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        
        // ✅ FIXED: Backend extracts userId from JWT token
        // No need to pass userId - it's in the Authorization header
        const res = await getPatientProfile();
        
        if (res.success && res.data) {
          const data = res.data;
          // Sync Backend Data -> Local Form State
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
          // Profile doesn't exist - user might need to create it
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
      2. HANDLERS
     ========================================================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaveStatus(false);
    
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
        
        // Show checkmark briefly
        setTimeout(() => setSaveStatus(false), 2000);
      } else {
        toast.error(res.message || "Failed to update");
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  // ✅ LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(logoutSuccess());
      router.push("/login");
      router.refresh();
    }
  };

  /* =========================================================
      3. UI RENDERING
     ========================================================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-white p-3 rounded-full shadow-lg"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ========== LEFT SIDEBAR ========== */}
          <div className={`
            lg:col-span-3 
            ${menuOpen ? 'block' : 'hidden lg:block'}
            fixed lg:relative inset-0 z-40 lg:z-auto
            bg-white lg:bg-transparent
            p-6 lg:p-0
          `}>
            {/* Overlay for mobile */}
            {menuOpen && (
              <div 
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                onClick={() => setMenuOpen(false)}
              />
            )}

            <div className="bg-white rounded-2xl shadow-xl p-6 relative z-40">
              {/* Profile Header */}
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                  {formData.profileImageUrl ? (
                    <img src={formData.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    formData.name.charAt(0).toUpperCase() || <User size={40} />
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-800">{formData.name || "User"}</h2>
                <div className="flex items-center justify-center gap-1 mt-2 text-gray-500 text-sm">
                  <Phone size={14} />
                  <p>{formData.phone}</p>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-md transition-all hover:shadow-lg">
                  <User size={20} />
                  <span>My Profile</span>
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all">
                  <ShoppingBag size={20} />
                  <span>Orders</span>
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all">
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all">
                  <HelpCircle size={20} />
                  <span>Help & Support</span>
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all">
                  <ShieldCheck size={20} />
                  <span>Privacy Policy</span>
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all">
                  <FileText size={20} />
                  <span>Terms & Conditions</span>
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* ========== MAIN CONTENT ========== */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <User size={24} />
                  Personal Information
                </h3>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-50 transition-all shadow-md"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSave}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-green-600 transition-all shadow-md"
                    >
                      {saveStatus ? <CheckCircle size={16} /> : <Save size={16} />}
                      {saveStatus ? "Saved!" : "Save"}
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      isEditing 
                        ? 'border-blue-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Gender & Age Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                        isEditing 
                          ? 'border-blue-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                        isEditing 
                          ? 'border-blue-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                      placeholder="Enter age"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      isEditing 
                        ? 'border-blue-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone (Read Only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
                </div>
              </div>
            </div>

            {/* Address Information Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MapPin size={24} />
                  Address Information
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {/* Home Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Home Address</label>
                  <textarea
                    name="homeAddress"
                    value={formData.homeAddress}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      isEditing 
                        ? 'border-blue-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="Enter your home address"
                  />
                </div>

                {/* Work Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Work Address</label>
                  <textarea
                    name="workAddress"
                    value={formData.workAddress}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      isEditing 
                        ? 'border-blue-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="Enter your work address"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;