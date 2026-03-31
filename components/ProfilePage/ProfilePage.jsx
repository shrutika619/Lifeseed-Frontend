"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Settings, ShoppingBag, HelpCircle, ShieldCheck, 
  FileText, LogOut, Pencil, MapPin, X, Menu, Save, CheckCircle, Mail, Plus, Trash2 
} from "lucide-react";
import { toast } from "sonner";

// ✅ REDUX & SERVICES
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectIsAuthenticated, logoutSuccess } from "@/redux/slices/authSlice";
import { getPatientProfile, savePatientProfile } from "@/app/services/patient/patient.service"; 
import { addressService } from "@/app/services/patient/address.service";
import api from "@/lib/axios";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const authUser = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    age: "",
    email: "",
    phone: "",
    profileImageUrl: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    flatNo: "",
    streetArea: "",
    landmark: "",
    pinCode: "",
    contactNumber: ""
  });

  useEffect(() => {
    if (!isAuthenticated) return; 

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [profileRes, addressRes] = await Promise.all([
          getPatientProfile().catch(err => err),
          addressService.getAllAddresses().catch(err => err)
        ]);
        
        if (profileRes?.success && profileRes?.data) {
          const data = profileRes.data;
          setFormData({
            name: data.fullName || "",
            gender: data.gender ? (data.gender.charAt(0).toUpperCase() + data.gender.slice(1)) : "Male",
            age: data.age || "",
            email: data.email || "",
            phone: data.user_id?.mobileNo || authUser?.mobileNo || "Not Provided",
            profileImageUrl: data.profileImageUrl || "",
          });
          setIsEditing(false); 
          setIsNewProfile(false);
        } else if (profileRes?.response?.status === 404 || !profileRes?.success) {
          handleMissingProfile();
        }

        if (addressRes?.success && addressRes?.data?.addresses) {
          setAddresses(addressRes.data.addresses);
        }

      } catch (err) {
        console.error("Data fetch error:", err);
        toast.error("Failed to load some profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [isAuthenticated, authUser]);

  const handleMissingProfile = () => {
    toast.info("Please complete your profile setup.", { duration: 4000 });
    setIsNewProfile(true); 
    setFormData(prev => ({ ...prev, phone: authUser?.mobileNo || "Not Provided" }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (genderValue) => {
    setFormData(prev => ({ ...prev, gender: genderValue }));
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) return toast.error("Full Name is required");

    setIsSaving(true);
    const payload = {
      fullName: formData.name,
      email: formData.email,
      age: formData.age ? parseInt(formData.age) : 0,
      gender: formData.gender.toLowerCase(),
    };

    try {
      const res = await savePatientProfile(payload);
      if (res.success) {
        toast.success(isNewProfile ? "Profile Created Successfully!" : "Profile Updated!");
        setSaveStatus(true);
        setIsEditing(false);
        setIsNewProfile(false);
        setTimeout(() => setSaveStatus(false), 3000);
      } else {
        toast.error(res.message || "Failed to save profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
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

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const openAddAddressModal = () => {
    setAddressForm({ label: "Home", flatNo: "", streetArea: "", landmark: "", pinCode: "", contactNumber: "" });
    setEditAddressId(null);
    setShowAddressModal(true);
  };

  const openEditAddressModal = (address) => {
    setAddressForm({
      label: address.label || "Other",
      flatNo: address.flatNo || "",
      streetArea: address.streetArea || "",
      landmark: address.landmark || "",
      pinCode: address.pinCode || "",
      contactNumber: address.contactNumber || ""
    });
    setEditAddressId(address._id);
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.flatNo || !addressForm.streetArea || !addressForm.pinCode) {
      return toast.error("Flat No, Street, and PIN Code are required.");
    }

    setIsSavingAddress(true);
    try {
      if (editAddressId) {
        const res = await addressService.updateAddress(editAddressId, addressForm);
        if (res.success) {
          toast.success("Address updated!");
          setAddresses(prev => prev.map(addr => addr._id === editAddressId ? { ...addr, ...addressForm } : addr));
        }
      } else {
        const res = await addressService.createAddress(addressForm);
        if (res.success) {
          toast.success("Address added!");
          setAddresses(prev => [...prev, res.data]); 
        }
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
      const res = await addressService.deleteAddress(addressId);
      if (res.success) {
        toast.success("Address deleted");
        setAddresses(prev => prev.filter(addr => addr._id !== addressId));
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete address");
    }
  };

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

  if (isNewProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1e1e1e] p-4 font-sans">
        <div className="bg-white w-full max-w-[340px] p-6 rounded-[24px] shadow-lg">
          <div className="text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-[#2D3748] text-lg font-bold mb-4">Profile</h2>
            
            <div className="flex bg-[#F7FAFC] rounded-xl mb-6 overflow-hidden border border-[#EDF2F7] p-1">
              <button 
                type="button"
                onClick={() => handleGenderChange('Male')} 
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${formData.gender === 'Male' ? 'bg-[#4285F4] text-white shadow-sm' : 'text-[#A0AEC0]'}`}
              >
                Male
              </button>
              <button 
                type="button"
                onClick={() => handleGenderChange('Female')} 
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${formData.gender === 'Female' ? 'bg-[#4285F4] text-white shadow-sm' : 'text-[#A0AEC0]'}`}
              >
                Female
              </button>
            </div>
            
            <div className="space-y-4">
              <input name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="w-full p-3.5 border border-[#EDF2F7] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
              <input name="age" placeholder="Enter Age" type="number" value={formData.age} onChange={handleInputChange} className="w-full p-3.5 border border-[#EDF2F7] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
              <input name="email" placeholder="Email Address" type="email" value={formData.email} onChange={handleInputChange} className="w-full p-3.5 border border-[#EDF2F7] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            
            <button onClick={handleSaveProfile} disabled={isSaving} className="bg-[#4285F4] text-white w-full py-4 rounded-xl font-bold mt-8 shadow-md hover:bg-blue-600 transition-all">
              {isSaving ? "Saving..." : "Save & Finish"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans p-4 md:p-8">
      
      <div className="lg:hidden mb-4 flex justify-end">
        <button onClick={() => setMenuOpen(true)} className="p-2 bg-white rounded-xl shadow-sm text-gray-600">
          <Menu size={24} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── SIDEBAR ── */}
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
                <p className="text-gray-400 text-xs truncate">{formData.email || formData.phone}</p>
              </div>
            </div>

            <div className="space-y-1">
              <SidebarItem icon={<Settings size={16}/>} label="Settings" active />
              {/* ✅ My Orders — redirects to /profile/myorders */}
              <SidebarItem
                icon={<ShoppingBag size={16}/>}
                label="My Orders"
                onClick={() => router.push("/profile/myorders")}
              />
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

        {/* ── MAIN CONTENT ── */}
        <main className="lg:col-span-9 space-y-6">
          
          {saveStatus && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-5 py-3 rounded-xl border-white border text-sm shadow-sm animate-in fade-in slide-in-from-top-2">
              <CheckCircle size={18} /> <span>Changes saved successfully!</span>
            </div>
          )}

          {/* USER INFO CARD */}
          <section className="bg-white border-white border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm gap-6">
            <div className="flex items-center gap-6 w-full">
              <div className="hidden sm:flex w-16 h-16 bg-blue-50 rounded-full items-center justify-center text-blue-600 border border-blue-50 overflow-hidden shrink-0">
                {formData.profileImageUrl ? (
                  <img src={formData.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={32} />
                )}
              </div>
              
              <div className="flex-1 w-full">
                {isEditing ? (
                  <div className="max-w-lg space-y-5 animate-in fade-in duration-300">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1 mb-1 block">Full Name *</label>
                      <input name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3.5 border border-[#EDF2F7] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-[#F7FAFC]" placeholder="Enter Full Name" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1 mb-1 block">Age</label>
                        <input name="age" type="number" value={formData.age} onChange={handleInputChange} className="w-full p-3.5 border border-[#EDF2F7] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-[#F7FAFC]" placeholder="Enter Age" />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1 mb-1 block">Gender</label>
                        <div className="flex bg-[#F7FAFC] rounded-xl overflow-hidden border border-[#EDF2F7] p-1 h-[48px]">
                          <button type="button" onClick={() => handleGenderChange('Male')} className={`flex-1 text-sm font-semibold rounded-lg transition-all ${formData.gender === 'Male' ? 'bg-[#4285F4] text-white shadow-sm' : 'text-[#A0AEC0] hover:text-gray-700'}`}>Male</button>
                          <button type="button" onClick={() => handleGenderChange('Female')} className={`flex-1 text-sm font-semibold rounded-lg transition-all ${formData.gender === 'Female' ? 'bg-[#4285F4] text-white shadow-sm' : 'text-[#A0AEC0] hover:text-gray-700'}`}>Female</button>
                        </div>
                      </div>
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
            
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0 mt-4 md:mt-0">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-gray-50 hover:bg-blue-50 rounded-full" title="Edit Profile">
                  <Pencil size={18} />
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl text-sm font-medium transition-all border border-gray-200 w-full sm:w-auto">Cancel</button>
                  <button onClick={handleSaveProfile} disabled={isSaving} className="flex items-center justify-center gap-2 bg-[#4285F4] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-md w-full sm:w-auto">
                    <Save size={16} /> {isSaving ? "Saving..." : "Save Changes"}
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1 mb-1 block">Email Address</label>
                {isEditing ? (
                  <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="name@example.com" className="w-full p-3.5 border border-[#EDF2F7] bg-[#F7FAFC] rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-400 transition-all" />
                ) : (
                  <p className="text-sm text-gray-700 font-medium px-1">{formData.email || "No email provided"}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1 mb-1 block">Phone Number <span className="text-[9px] normal-case text-gray-400 font-medium">(Read-only)</span></label>
                <div className="w-full p-3.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed">
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
              <button 
                onClick={openAddAddressModal} 
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
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
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${addr.label === 'Home' ? 'bg-blue-500' : addr.label === 'Work' ? 'bg-orange-400' : 'bg-purple-500'}`} />
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{addr.label}</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditAddressModal(addr)} className="text-gray-400 hover:text-blue-600 p-1"><Pencil size={14}/></button>
                        <button onClick={() => handleDeleteAddress(addr._id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={14}/></button>
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
        </main>
      </div>

      {/* ── ADDRESS MODAL ── */}
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
                <select name="label" value={addressForm.label} onChange={handleAddressInputChange} className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50">
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1 mb-1 block">Flat / House No. *</label>
                  <input required name="flatNo" value={addressForm.flatNo} onChange={handleAddressInputChange} placeholder="e.g. B-202" className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1 mb-1 block">Street / Area *</label>
                  <input required name="streetArea" value={addressForm.streetArea} onChange={handleAddressInputChange} placeholder="e.g. Koregaon Park" className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1 mb-1 block">Landmark</label>
                  <input name="landmark" value={addressForm.landmark} onChange={handleAddressInputChange} placeholder="Optional" className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1 mb-1 block">PIN Code *</label>
                  <input required name="pinCode" value={addressForm.pinCode} onChange={handleAddressInputChange} placeholder="e.g. 411001" className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1 mb-1 block">Contact Number</label>
                  <input name="contactNumber" value={addressForm.contactNumber} onChange={handleAddressInputChange} placeholder="Optional" className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50" />
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

      {/* ── MOBILE DRAWER ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex items-end lg:hidden">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="relative bg-white w-full rounded-t-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Menu</h3>
              <button onClick={() => setMenuOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600"><X size={20}/></button>
            </div>
            <div className="space-y-3">
              <MobileLink icon={<Settings size={18}/>} label="Account Settings" />
              {/* ✅ My Orders mobile — redirects to /profile/myorders */}
              <MobileLink
                icon={<ShoppingBag size={18}/>}
                label="Order History"
                onClick={() => { setMenuOpen(false); router.push("/profile/myorders"); }}
              />
              <MobileLink icon={<HelpCircle size={18}/>} label="Help & Support" />
              <div className="h-px bg-gray-100 my-5" />
              <button onClick={handleLogout} className="w-full py-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                <LogOut size={18} /> Logout Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── HELPER COMPONENTS ──

// ✅ onClick prop added
const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
  >
    <div className="flex items-center gap-3">
      <span className={active ? "text-blue-600" : "text-gray-400"}>{icon}</span>
      <span>{label}</span>
    </div>
  </button>
);

// ✅ onClick prop added
const MobileLink = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full p-4 bg-gray-50 rounded-xl flex items-center gap-4 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
  >
    <span className="text-blue-600">{icon}</span>
    <span>{label}</span>
  </button>
);

export default ProfilePage;