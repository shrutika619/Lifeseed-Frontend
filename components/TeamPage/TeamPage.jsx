"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Filter, Search, Plus, SquarePen, Trash2, Bell, Menu,
  LayoutDashboard, MessageSquare, Building2, Video,
  Stethoscope, Settings, ScrollText, Users
} from 'lucide-react';

// --- Mock Data ---
const initialTeamData = [
  { id: 12345, name: 'Pranjal Tidke', email: 'Pranjal.Tidke@gmail.com', isActive: true, createdAt: '12/04/2025', lastIP: '111.22.1.2', lastLogin: '17 Mar 2025 17:24' },
  { id: 12346, name: 'Aditya Sharma', email: 'aditya.sharma@gmail.com', isActive: true, createdAt: '11/20/2024', lastIP: '192.168.0.1', lastLogin: '1 Nov 2025 09:30' },
  { id: 12347, name: 'Kavita Singh', email: 'kavita.singh@gmail.com', isActive: false, createdAt: '01/01/2025', lastIP: '10.0.0.5', lastLogin: '28 Oct 2025 14:00' },
  { id: 12348, name: 'Rajesh Kumar', email: 'rajesh.kumar@gmail.com', isActive: true, createdAt: '05/15/2025', lastIP: '203.0.113.10', lastLogin: '5 Nov 2025 11:15' },
  { id: 12349, name: 'Priya Verma', email: 'priya.verma@gmail.com', isActive: false, createdAt: '06/20/2025', lastIP: '172.16.0.2', lastLogin: '10 May 2025 08:45' },
];

// --- Status Toggle ---
const StatusToggle = ({ memberId, isActive, onToggle }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={isActive}
      onChange={() => onToggle(memberId)}
      className="sr-only peer"
    />
    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
  </label>
);

const TeamPage = () => {
  const router = useRouter();

  const [teamMembers, setTeamMembers] = useState(initialTeamData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [notifications] = useState(10);

  // Menu with only routes — no active state
  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', route: '/admindashboard' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Inquiry Direct', route: null },
    { icon: <Building2 className="w-5 h-5" />, label: 'In-clinic Consultation', route: null },
    { icon: <Video className="w-5 h-5" />, label: 'Teleconsultation', route: null, badge: 1 },
    { icon: <Stethoscope className="w-5 h-5" />, label: 'Clinic', route: '/clinics' },
    { icon: <Settings className="w-5 h-5" />, label: 'Setup', route: null },
    { icon: <ScrollText className="w-5 h-5" />, label: 'Audit Logs', route: null },
    { icon: <Users className="w-5 h-5" />, label: 'Team', route: '/team' },
  ];

  // Only redirect — no active state change
  const handleMenuClick = (route) => {
    if (route) {
      router.push(route);
    }
  };

  const handleSearchChange = useCallback((e) => setSearchTerm(e.target.value), []);
  const handleStatusToggle = useCallback((id) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m));
  }, []);
  const handleFilterToggle = useCallback(() => setIsFilterOpen(prev => !prev), []);
  const handleStatusFilter = useCallback((status) => {
    setStatusFilter(status);
    setIsFilterOpen(false);
  }, []);

  const handleCreate = () => router.push('/addteam');
  const handleEdit = (id) => alert(`Edit member: ${id}`);
  const handleDelete = (id) => setTeamMembers(prev => prev.filter(m => m.id !== id));

  const filteredMembers = useMemo(() => {
    let result = teamMembers;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(m => Object.values(m).some(v => String(v).toLowerCase().includes(term)));
    }
    if (statusFilter === 'active') result = result.filter(m => m.isActive);
    if (statusFilter === 'inactive') result = result.filter(m => !m.isActive);
    return result;
  }, [teamMembers, searchTerm, statusFilter]);

  const tableHeaders = [
    { key: '#', label: '#' },
    { key: 'status', label: 'Status' },
    { key: 'id', label: 'Id' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'action', label: 'Action' },
    { key: 'createdAt', label: 'Created AT' },
    { key: 'lastIP', label: 'Last IP' },
    { key: 'lastLogin', label: 'Last Login' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-blue-600">MEN10</h1>
        </div>

        <nav className="flex-1 p-5">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleMenuClick(item.route)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 rounded-lg text-base font-medium transition-colors relative text-gray-700 hover:bg-gray-100"
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">Team</h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded transition-colors">
                <Bell className="w-5 h-5 text-gray-700" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-full font-bold">
                    {notifications}
                  </span>
                )}
              </button>
              <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src="https://ui-avatars.com/api/?name=AD&background=3b82f6&color=fff&bold=true"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex w-full sm:w-auto gap-3">
                <div className="relative">
                  <button
                    onClick={handleFilterToggle}
                    className={`p-3 border rounded-lg ${isFilterOpen ? 'ring-2 ring-blue-500 bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <Filter className="w-5 h-5 text-gray-600" />
                  </button>
                  {isFilterOpen && (
                    <div className="absolute top-full mt-2 left-0 w-40 bg-white border rounded-lg shadow-lg z-10">
                      {['all', 'active', 'inactive'].map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusFilter(s)}
                          className={`w-full text-left px-4 py-2 text-sm ${statusFilter === s ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                <Plus className="w-5 h-5" />
                Create
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {tableHeaders.map(h => (
                      <th key={h.key} className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${h.key === 'id' || h.key === 'lastIP' || h.key === 'lastLogin' ? 'hidden md:table-cell' : ''}`}>
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMembers.map((m, i) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{i + 1}</td>
                      <td className="px-6 py-4"><StatusToggle memberId={m.id} isActive={m.isActive} onToggle={handleStatusToggle} /></td>
                      <td className="px-6 py-4 hidden md:table-cell text-sm text-gray-500">{m.id}</td>
                      <td className="px-6 py-4 font-medium">{m.name}</td>
                      <td className="px-6 py-4 hidden md:table-cell text-sm text-gray-500">{m.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(m.id)} className="p-2 hover:bg-blue-50 rounded"><SquarePen className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(m.id)} className="p-2 hover:bg-red-50 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-sm text-gray-500">{m.createdAt}</td>
                      <td className="px-6 py-4 hidden md:table-cell text-sm text-gray-500">{m.lastIP}</td>
                      <td className="px-6 py-4 hidden md:table-cell text-sm text-gray-500">{m.lastLogin}</td>
                    </tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <tr><td colSpan={9} className="text-center py-10 text-gray-500">No members found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamPage;