"use client";
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Filter, Menu, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// ✅ Import Services
import { 
  getAllAdmins, 
  registerTeamMember, 
  deleteAdmin, 
  updateAdminProfile, 
  updateAdminPermissions, 
  getModulePermissions 
} from '@/app/services/admin/adminUsers.service';

export const AdminTeamPage = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('list'); 
  
  const [teamMembers, setTeamMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [allModules, setAllModules] = useState([]); 

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNo: '',
    password: '',
    confirmPassword: '',
    address: '',
    teamRole: 'admin' 
  });

  const [permissions, setPermissions] = useState({});

  // ✅ Fetch Initial Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [adminsRes, modulesRes] = await Promise.all([
        getAllAdmins({ limit: 100 }), 
        getModulePermissions()
      ]);

      if (adminsRes.success) {
        setTeamMembers(adminsRes.data.admins || []);
      } else {
        toast.error("Failed to load team members");
      }

      if (modulesRes.success) {
        setAllModules(modulesRes.data || []);
        const initPerms = {};
        (modulesRes.data || []).forEach(m => initPerms[m.key] = false);
        setPermissions(initPerms);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    // Basic real-time sanitize (e.g., prevent non-numbers in mobile field)
    let value = e.target.value;
    if (e.target.name === 'mobileNo') {
      value = value.replace(/\D/g, ''); // Remove non-digits
      if (value.length > 10) value = value.slice(0, 10);
    }

    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handlePermissionToggle = (key) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // ✅ Open Edit Form
  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      fullName: member.profile?.fullName || '',
      email: member.profile?.email || '',
      mobileNo: member.mobileNo || '',
      password: '', 
      confirmPassword: '',
      address: member.profile?.address || '',
      teamRole: member.role || 'admin'
    });

    const currentPerms = {};
    allModules.forEach(m => {
      currentPerms[m.key] = member.modulePermissions?.includes(m.key) || false;
    });
    setPermissions(currentPerms);
    
    setCurrentView('form');
  };

  // ✅ Strict Form Validation
  const validateForm = () => {
    const { fullName, email, mobileNo, password, confirmPassword } = formData;
    
    if (!fullName.trim() || fullName.length < 3) {
      toast.error("Please enter a valid full name (min 3 characters).");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (mobileNo.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits.");
      return false;
    }

    // Only validate passwords if creating a new user OR if they are trying to update the password
    if (!editingMember) {
      if (!password || password.length < 6) {
        toast.error("Password is required and must be at least 6 characters.");
        return false;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return false;
      }
    }

    return true;
  };

  // ✅ Handle Submit
  const handleFormSubmit = async () => {
    if (!validateForm()) return; // Stop if validation fails

    setIsSubmitting(true);

    try {
      if (editingMember) {
        // UPDATE EXISTING
        const res = await updateAdminProfile(editingMember._id, {
          fullName: formData.fullName,
          email: formData.email,
          mobileNo: formData.mobileNo,
          address: formData.address
        });

        // ✅ Properly handle success/failure from the service
        if (res.success) {
          toast.success("Profile updated successfully!");
          loadData();
          setCurrentView('list');
          setEditingMember(null);
        } else {
          // Explicitly catch 409 or duplicate errors for updates
          if (res.status === 409 || res.message?.toLowerCase().includes("use") || res.message?.toLowerCase().includes("exist")) {
            toast.error("Team member with same mobile no/email already exists");
          } else {
            toast.error(res.message || "Failed to update profile");
          }
        }

      } else {
        // CREATE NEW
        const activePermissionsArray = Object.keys(permissions).filter(k => permissions[k]);

        const res = await registerTeamMember({
          fullName: formData.fullName,
          email: formData.email,
          mobileNo: formData.mobileNo,
          password: formData.password,
          address: formData.address,
          modulePermissions: activePermissionsArray,
          role: formData.teamRole
        });

        // ✅ Properly handle success/failure from the service
        if (res.success) {
          toast.success("Team member created successfully!");
          loadData();
          setCurrentView('list');
          
          setFormData({ fullName: '', email: '', mobileNo: '', password: '', confirmPassword: '', address: '', teamRole: 'admin' });
        } else {
          // Explicitly catch 409 or duplicate errors for new registrations
          if (res.status === 409 || res.message?.toLowerCase().includes("exist")) {
            toast.error("Team member with same mobile no/email already exists");
          } else {
            toast.error(res.message || "Failed to create team member");
          }
        }
      }
    } catch (error) {
      toast.error("Something went wrong processing your request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle Permissions Submit
  const handlePermissionsSubmit = async () => {
    if (!editingMember) {
      setCurrentView('form');
      return;
    }

    setIsSubmitting(true);
    try {
      const activePermissionsArray = Object.keys(permissions).filter(k => permissions[k]);
      const res = await updateAdminPermissions(editingMember._id, activePermissionsArray);

      if (res.success) {
        toast.success("Permissions updated successfully!");
        loadData();
        setCurrentView('list');
        setEditingMember(null);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to update permissions");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      const res = await deleteAdmin(id);
      if (res.success) {
        toast.success("Member deleted successfully");
        setTeamMembers(teamMembers.filter(member => member._id !== id));
      } else {
        toast.error(res.message || "Failed to delete");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (loading && currentView === 'list') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // ==============================
  // 1. LIST VIEW
  // ==============================
  if (currentView === 'list') {
    return (
      <div className="min-h-screen bg-white">
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <Menu className="text-gray-500 cursor-pointer" size={20} />
            <h1 className="text-gray-600 font-medium text-sm sm:text-base">Team Management</h1>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto">
              <Filter size={20} className="text-gray-500 mx-auto sm:mx-0" />
            </button>
            
            <div className="relative flex-1 max-w-full sm:max-w-sm">
              <input
                type="text"
                placeholder="Search by name, email, or username"
                className="w-full pl-4 pr-10 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>

            <button 
              onClick={() => {
                setEditingMember(null);
                setFormData({ fullName: '', email: '', mobileNo: '', password: '', confirmPassword: '', address: '', teamRole: 'admin' });
                const resetPerms = {};
                allModules.forEach(m => resetPerms[m.key] = false);
                setPermissions(resetPerms);
                setCurrentView('form');
              }}
              className="flex items-center justify-center gap-2 px-5 py-2 bg-white border border-blue-50 text-blue-600 rounded-lg font-semibold shadow-sm hover:bg-blue-50 transition-all w-full sm:w-auto ml-auto"
            >
              <Plus size={18} className="bg-blue-600 text-white rounded-full p-0.5" />
              Create New
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm -mx-4 sm:mx-0">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-gray-500 text-xs sm:text-sm font-medium">
                  <th className="px-4 py-4 w-12">#</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">User ID</th>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Username</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4 text-center">Action</th>
                  <th className="px-4 py-4">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {teamMembers
                  .filter(member => {
                    const name = member.profile?.fullName || '';
                    const email = member.profile?.email || '';
                    const username = member.username || '';
                    
                    return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           username.toLowerCase().includes(searchTerm.toLowerCase());
                  })
                  .map((member, index) => (
                  <tr key={member._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4 text-sm font-semibold text-gray-700">{index + 1}</td>
                    <td className="px-4 py-4">
                      <div className={`w-9 h-5 flex items-center rounded-full p-1 cursor-not-allowed transition-colors bg-blue-100`}>
                        <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform translate-x-3.5`}></div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-gray-600">
                      #{member._id.slice(-5).toUpperCase()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-bold text-gray-700 leading-tight">
                        {member.profile?.fullName || "No Name"}
                      </div>
                      <div className="text-xs text-gray-500 font-medium mt-0.5">
                        {member.mobileNo}
                      </div>
                    </td>
                    
                    <td className="px-4 py-4 text-sm font-medium text-blue-600 bg-blue-50/30">
                      {member.username}
                    </td>

                    <td className="px-4 py-4 text-sm font-semibold text-gray-500">
                      {member.profile?.email || "N/A"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2 bg-slate-100 rounded-md p-1.5 w-fit mx-auto">
                        <Edit2 
                          size={14} 
                          className="text-gray-600 cursor-pointer hover:text-blue-600"
                          onClick={() => handleEdit(member)}
                        />
                        <div className="w-px h-3 bg-gray-300"></div>
                        <Trash2 
                          size={14} 
                          className="text-gray-600 cursor-pointer hover:text-red-600" 
                          onClick={() => handleDelete(member._id)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-600">
                      {formatDate(member.createdAt)}
                    </td>
                  </tr>
                ))}
                {teamMembers.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-500 text-sm">
                      No team members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    );
  }

  // ==============================
  // 2. CREATE / EDIT FORM VIEW
  // ==============================
  if (currentView === 'form') {
    return (
      <div className="min-h-screen bg-white">
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <ArrowLeft 
              className="text-gray-500 cursor-pointer hover:text-gray-800" 
              size={20}
              onClick={() => setCurrentView('list')}
            />
            <h1 className="text-gray-600 font-medium text-sm sm:text-base">
              {editingMember ? 'Update Team Member' : 'Create Team Member'}
            </h1>
          </div>
        </header>

        <main className="p-4 sm:p-8 max-w-3xl mx-auto">
          <div className="space-y-4 sm:space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Mobile <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="10-digit number"
                />
              </div>
            </div>

            {/* Passwords only required for new members */}
            {!editingMember && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Password <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    placeholder="Min. 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Confirm Password <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    placeholder="Must match password"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Team Role</label>
              <input
                type="text"
                name="teamRole"
                value={formData.teamRole}
                onChange={handleChange}
                disabled
                className="w-full px-3 py-2.5 border border-gray-200 bg-gray-50 text-gray-500 rounded text-sm cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleFormSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Edit2 size={16} />}
                {editingMember ? 'Update Profile' : 'Create Member'}
              </button>
              
              <button
                onClick={() => setCurrentView('permissions')}
                className="w-full sm:w-auto px-6 py-2.5 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                Manage Permissions
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==============================
  // 3. PERMISSIONS VIEW
  // ==============================
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3 sm:gap-4">
          <ArrowLeft 
            className="text-gray-500 cursor-pointer hover:text-gray-800" 
            size={20}
            onClick={() => setCurrentView('form')}
          />
          <h1 className="text-gray-600 font-medium text-sm sm:text-base">
            {editingMember ? 'Update Permissions' : 'Assign Permissions'}
          </h1>
        </div>
      </header>

      <main className="p-4 sm:p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg">
          <div className="mb-4 sm:mb-6 pb-4 border-b border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Team Member</p>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              {formData.fullName || 'New User'}
            </h2>
            {!editingMember && (
              <p className="text-xs text-orange-500 mt-2">
                Note: These permissions will be applied when you click "Create Member" on the previous page.
              </p>
            )}
          </div>

          <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
            {allModules.map((module) => (
              <div key={module.key} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
                <span className="text-sm sm:text-base text-gray-700 font-medium">{module.label}</span>
                <div 
                  onClick={() => handlePermissionToggle(module.key)}
                  className={`w-11 sm:w-12 h-5 sm:h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${permissions[module.key] ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full shadow-md transform transition-transform ${permissions[module.key] ? 'translate-x-5 sm:translate-x-6' : ''}`}></div>
                </div>
              </div>
            ))}
            {allModules.length === 0 && (
              <p className="text-sm text-gray-500 italic">No modules configured on server.</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            {editingMember ? (
              <button
                onClick={handlePermissionsSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                Save Permissions
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('form')}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Done (Back to Form)
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminTeamPage;