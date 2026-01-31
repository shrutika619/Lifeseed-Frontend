"use client";
import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Filter, Bell, Menu, X, ArrowLeft } from 'lucide-react';

export const AdminTeamPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', or 'permissions'
  const [editingMember, setEditingMember] = useState(null);
  const [teamMembers, setTeamMembers] = useState([
    { id: '12345', name: 'Pranjal Tidke', email: 'PranjalTidke@gmail.com', createdAt: '12/04/2025', lastIp: '111.22.1.2.554', lastLogin: '17th Mar 2025 17.24', active: true },
    { id: '12346', name: 'Pranjal Tidke', email: 'PranjalTidke@gmail.com', createdAt: '12/04/2025', lastIp: '111.22.1.2.554', lastLogin: '17th Mar 2025 17.24', active: false },
    { id: '12347', name: 'Pranjal Tidke', email: 'PranjalTidke@gmail.com', createdAt: '12/04/2025', lastIp: '111.22.1.2.554', lastLogin: '17th Mar 2025 17.24', active: true },
    { id: '12348', name: 'Pranjal Tidke', email: 'PranjalTidke@gmail.com', createdAt: '12/04/2025', lastIp: '111.22.1.2.554', lastLogin: '17th Mar 2025 17.24', active: true },
  ]);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    address: '',
    teamRole: ''
  });

  const [permissions, setPermissions] = useState({
    dashboard: true,
    inquiryDirect: true,
    inClinicConsultation: true,
    teleconsultation: true,
    emergency: true,
    auditLogs: true,
    team: false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePermissionToggle = (key) => {
    setPermissions({
      ...permissions,
      [key]: !permissions[key]
    });
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      fullName: member.name,
      email: member.email,
      mobile: '',
      password: '',
      confirmPassword: '',
      address: '',
      teamRole: ''
    });
    setCurrentView('permissions');
  };

  const handleUpdate = () => {
    if (!formData.fullName || !formData.email) {
      alert('Please fill required fields');
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (editingMember) {
      setTeamMembers(teamMembers.map(member => 
        member.id === editingMember.id 
          ? { ...member, name: formData.fullName, email: formData.email }
          : member
      ));
    } else {
      const newId = String(Number(teamMembers[teamMembers.length - 1].id) + 1);
      const currentDate = new Date().toLocaleDateString('en-GB');
      
      const newMember = {
        id: newId,
        name: formData.fullName,
        email: formData.email,
        createdAt: currentDate,
        lastIp: '0.0.0.0',
        lastLogin: 'Never',
        active: true
      };

      setTeamMembers([...teamMembers, newMember]);
    }
    
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      address: '',
      teamRole: ''
    });
    setEditingMember(null);
    setCurrentView('list');
  };

  const toggleActive = (id) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, active: !member.active } : member
    ));
  };

  const deleteMember = (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      setTeamMembers(teamMembers.filter(member => member.id !== id));
    }
  };

  // List View
  if (currentView === 'list') {
    return (
      <div className="min-h-screen bg-white">
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <Menu className="text-gray-500 cursor-pointer" size={20} />
            <h1 className="text-gray-600 font-medium text-sm sm:text-base">Team</h1>
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
                placeholder="Search"
                className="w-full pl-4 pr-10 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>

            <button 
              onClick={() => {
                setEditingMember(null);
                setFormData({
                  fullName: '',
                  email: '',
                  mobile: '',
                  password: '',
                  confirmPassword: '',
                  address: '',
                  teamRole: ''
                });
                setCurrentView('form');
              }}
              className="flex items-center justify-center gap-2 px-5 py-2 bg-white border border-blue-50 text-blue-600 rounded-lg font-semibold shadow-sm hover:bg-blue-50 transition-all w-full sm:w-auto"
            >
              <Plus size={18} className="bg-black text-white rounded-full p-0.5" />
              Create
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm -mx-4 sm:mx-0">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-gray-500 text-xs sm:text-sm font-medium">
                  <th className="px-2 sm:px-4 py-3 sm:py-4 w-8 sm:w-12">#</th>
                  <th className="px-2 sm:px-4 py-3 sm:py-4 w-12 sm:w-16">
                    <div className="w-6 sm:w-8 h-3 sm:h-4 bg-gray-200 rounded-full"></div>
                  </th>
                  <th className="px-2 sm:px-4 py-3 sm:py-4">Id</th>
                  <th className="px-2 sm:px-4 py-3 sm:py-4">Name</th>
                  <th className="px-2 sm:px-4 py-3 sm:py-4">Email</th>
                  <th className="px-2 sm:px-4 py-3 sm:py-4 text-center">Action</th>
                  <th className="px-2 sm:px-4 py-3 sm:py-4">Created AT</th>
                  <th className="px-2 sm:px-4 py-3 sm:py-4">last IP</th>
                  <th className="px-2 sm:px-4 py-3 sm:py-4">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {teamMembers.filter(member => 
                  member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  member.email.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((member, index) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-700">{index + 1}</td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4">
                      <div 
                        onClick={() => toggleActive(member.id)}
                        className={`w-8 sm:w-9 h-4 sm:h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${member.active ? 'bg-blue-100' : 'bg-gray-300'}`}
                      >
                        <div className={`bg-white w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full shadow-md transform transition-transform ${member.active ? 'translate-x-3 sm:translate-x-3.5' : ''}`}></div>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-bold text-gray-600">{member.id}</td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4">
                      <div className="text-xs sm:text-sm font-bold text-gray-700 leading-tight">
                        {member.name.split(' ')[0]}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-gray-700">
                        {member.name.split(' ')[1] || ''}
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-500">{member.email}</td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4">
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
                          onClick={() => deleteMember(member.id)}
                        />
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-600">{member.createdAt}</td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-600 leading-relaxed">{member.lastIp}</td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4">
                      <div className="text-[10px] sm:text-[11px] font-bold text-gray-600 uppercase leading-tight">
                        {member.lastLogin}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    );
  }

  // Create/Add Form View
  if (currentView === 'form') {
    return (
      <div className="min-h-screen bg-white">
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <ArrowLeft 
              className="text-gray-500 cursor-pointer" 
              size={20}
              onClick={() => setCurrentView('list')}
            />
            <h1 className="text-gray-600 font-medium text-sm sm:text-base">Update Team</h1>
          </div>
        </header>

        <main className="p-4 sm:p-8 max-w-3xl mx-auto">
          <div className="space-y-4 sm:space-y-6">
            {/* Row 1: Full Name, Email, Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">
                  FULL NAME
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">
                  EMAIL
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">
                  MOBILE
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Row 2: Password, Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">
                  PASSWORD
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Row 3: Address */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">
                ADDRESS
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm resize-none"
              ></textarea>
            </div>

            {/* Row 4: Team Role */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">
                TEAM ROLE
              </label>
              <input
                type="text"
                name="teamRole"
                value={formData.teamRole}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleUpdate}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <Edit2 size={16} />
                Update
              </button>
              <button
                onClick={() => setCurrentView('permissions')}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Team Role
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Permissions View
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3 sm:gap-4">
          <ArrowLeft 
            className="text-gray-500 cursor-pointer" 
            size={20}
            onClick={() => setCurrentView('form')}
          />
          <h1 className="text-gray-600 font-medium text-sm sm:text-base">Update Team</h1>
        </div>
      </header>

      <main className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg">
          <div className="mb-4 sm:mb-6 pb-4 border-b border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Team Member</p>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              {formData.fullName || 'Pranjal Tidke'}
            </h2>
          </div>

          <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
            {Object.entries({
              dashboard: 'Dashboard',
              inquiryDirect: 'Inquiry Direct',
              inClinicConsultation: 'In-clinic Consultation',
              teleconsultation: 'Teleconsultation',
              emergency: 'Emergency',
              auditLogs: 'Audit logs',
              team: 'Team'
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
                <span className="text-sm sm:text-base text-gray-700 font-medium">{label}</span>
                <div 
                  onClick={() => handlePermissionToggle(key)}
                  className={`w-11 sm:w-12 h-5 sm:h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${permissions[key] ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full shadow-md transform transition-transform ${permissions[key] ? 'translate-x-5 sm:translate-x-6' : ''}`}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleUpdate}
              className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminTeamPage;