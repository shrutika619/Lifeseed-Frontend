'use client';

import { useState } from 'react';
import {
  FileText,
  MessageSquare,
  Building2,
  Video,
  Filter,
  X,
  Plus,
  Search,
  Calendar,
  User,
  Phone,
  Mail,
  ArrowLeft,
  ChevronDown
} from "lucide-react";

const initialStatsData = [
  {
    id: 'inquiry-direct',
    title: "First Time User",
    icon: FileText,
    items: [
      { label: "New", value: 3, status: "new" },
      { label: "Not Interested", value: 0, status: "not-interested" },
      { label: "50:50", value: 1, bg: "bg-yellow-50", status: "maybe" },
      { label: "Closed", value: 1, bg: "bg-pink-50", status: "closed" },
      { label: "Offline", value: 12, bg: "bg-purple-50", status: "offline" },
      { label: "Complete", value: 3, bg: "bg-green-50", status: "complete" },
    ],
  },
  {
    id: 'Log In User',
    title: "Log In User",
    icon: MessageSquare,
    items: [
      { label: "New", value: 3, status: "new" },
      { label: "Not Interested", value: 0, status: "not-interested" },
      { label: "50:50", value: 1, bg: "bg-yellow-50", status: "maybe" },
      { label: "Closed", value: 1, bg: "bg-pink-50", status: "closed" },
      { label: "Offline", value: 12, bg: "bg-purple-50", status: "offline" },
      { label: "Complete", value: 3, bg: "bg-green-50", status: "complete" },
    ],
  },
  {
    id: 'in-clinic',
    title: "In Clinic Consultation",
    icon: Building2,
    items: [
      { label: "New", value: 3, status: "new" },
      { label: "Not Interested", value: 0, status: "not-interested" },
      { label: "50:50", value: 1, bg: "bg-yellow-50", status: "maybe" },
      { label: "Closed", value: 1, bg: "bg-pink-50", status: "closed" },
      { label: "Online", value: 12, bg: "bg-purple-50", status: "online" },
      { label: "Complete", value: 3, bg: "bg-green-50", status: "complete" },
    ],
  },
  {
    id: 'teleconsultation',
    title: "Teleconsultation",
    icon: Video,
    items: [
      { label: "New", value: 3, status: "new" },
      { label: "Done", value: 3, bg: "bg-green-50", status: "done" },
      { label: "Pending", value: 0, bg: "bg-orange-50", status: "pending" },
      { label: "Canceled", value: 1, bg: "bg-pink-50", status: "canceled" },
      { label: "Sell Done", value: 1, bg: "bg-yellow-50", status: "sell-done" },
      { label: "Sell Done", value: 12, bg: "bg-green-50", status: "sell-done-2" },
    ],
  },
];

// Mock patient data
const mockPatients = {
  'inquiry-direct': [
    { id: 1, name: 'John Doe', phone: '+91-9876543210', email: 'john@example.com', status: 'new', date: '2024-12-27' },
    { id: 2, name: 'Jane Smith', phone: '+91-9876543211', email: 'jane@example.com', status: 'new', date: '2024-12-27' },
    { id: 3, name: 'Bob Wilson', phone: '+91-9876543212', email: 'bob@example.com', status: 'new', date: '2024-12-26' },
    { id: 4, name: 'Alice Brown', phone: '+91-9876543213', email: 'alice@example.com', status: 'maybe', date: '2024-12-25' },
    { id: 5, name: 'Charlie Davis', phone: '+91-9876543214', email: 'charlie@example.com', status: 'closed', date: '2024-12-24' },
  ],
  'assessment-inquiry': [
    { id: 6, name: 'David Miller', phone: '+91-9876543215', email: 'david@example.com', status: 'new', date: '2024-12-27' },
    { id: 7, name: 'Emma Wilson', phone: '+91-9876543216', email: 'emma@example.com', status: 'new', date: '2024-12-26' },
    { id: 8, name: 'Frank Thomas', phone: '+91-9876543217', email: 'frank@example.com', status: 'new', date: '2024-12-25' },
  ],
  'in-clinic': [
    { id: 9, name: 'Grace Lee', phone: '+91-9876543218', email: 'grace@example.com', status: 'new', date: '2024-12-27' },
    { id: 10, name: 'Henry Clark', phone: '+91-9876543219', email: 'henry@example.com', status: 'new', date: '2024-12-26' },
  ],
  'teleconsultation': [
    { id: 11, name: 'Isabel Martinez', phone: '+91-9876543220', email: 'isabel@example.com', status: 'new', date: '2024-12-27' },
    { id: 12, name: 'Jack Anderson', phone: '+91-9876543221', email: 'jack@example.com', status: 'pending', date: '2024-12-26' },
  ],
};

// ── Filter options ──
const DATE_OPTIONS = [
  { label: "All Time", value: "" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];

const SECTION_OPTIONS = [
  { label: "All", value: "" },
  { label: "First Time User", value: "inquiry-direct" },
  { label: "Log In User", value: "Log In User" },
  { label: "In Clinic", value: "in-clinic" },
  { label: "Teleconsultation", value: "teleconsultation" },
];

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "New", value: "new" },
  { label: "Complete / Done", value: "complete" },
  { label: "Closed / Canceled", value: "closed" },
  { label: "Pending", value: "pending" },
  { label: "Offline", value: "offline" },
  { label: "Online", value: "online" },
  { label: "50:50", value: "maybe" },
  { label: "Sell Done", value: "sell-done" },
  { label: "Not Interested", value: "not-interested" },
];

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState(initialStatsData);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // ── Filter state ──
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const activeFilterCount = [filterDate, filterSection, filterStatus].filter(Boolean).length;

  const clearFilters = () => {
    setFilterDate(""); setFilterSection(""); setFilterStatus("");
  };

  // ── Apply filters to cards ──
  const visibleStats = statsData
    .filter(s => !filterSection || s.id === filterSection)
    .map(s => ({
      ...s,
      items: s.items.map(item => ({
        ...item,
        _dimmed: filterStatus ? item.status !== filterStatus : false,
      })),
    }));

  // Open list modal
  const handleStatClick = (section, status, label) => {
    if (status === 'not-interested') return;
    setSelectedSection(section);
    setSelectedStatus({ status, label });
    setModalType('list');
    setShowModal(true);
  };

  // Get filtered patients
  const getFilteredPatients = () => {
    if (!selectedSection || !selectedStatus) return [];
    const patients = mockPatients[selectedSection.id] || [];
    return patients.filter(p => {
      const matchesStatus = p.status === selectedStatus.status;
      const matchesSearch = searchTerm === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  };

  // Handle status change
  const handleStatusChange = (patientId, newStatus) => {
    const oldStatus = selectedStatus.status;
    setStatsData(prev => prev.map(section => {
      if (section.id === selectedSection.id) {
        return {
          ...section,
          items: section.items.map(item => {
            if (item.status === oldStatus) return { ...item, value: Math.max(0, item.value - 1) };
            if (item.status === newStatus) return { ...item, value: item.value + 1 };
            return item;
          })
        };
      }
      return section;
    }));
    const sectionPatients = mockPatients[selectedSection.id];
    const patient = sectionPatients.find(p => p.id === patientId);
    if (patient) patient.status = newStatus;
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>

          {/* ✅ Filter Button */}
          <button
            onClick={() => setShowFilterPanel(p => !p)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              showFilterPanel || activeFilterCount > 0
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* ✅ Filter Panel */}
        {showFilterPanel && (
          <div className="border border-gray-200 rounded-xl bg-gray-50 p-4 space-y-4">

            {/* Date */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Date Range</p>
              <div className="flex flex-wrap gap-2">
                {DATE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFilterDate(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      filterDate === opt.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Section */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Section</p>
              <div className="flex flex-wrap gap-2">
                {SECTION_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFilterSection(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      filterSection === opt.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFilterStatus(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      filterStatus === opt.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear */}
            {activeFilterCount > 0 && (
              <div className="pt-1">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active filter chips */}
        {activeFilterCount > 0 && !showFilterPanel && (
          <div className="flex flex-wrap gap-2">
            {filterDate && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                {DATE_OPTIONS.find(o => o.value === filterDate)?.label}
                <button onClick={() => setFilterDate("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterSection && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                {SECTION_OPTIONS.find(o => o.value === filterSection)?.label}
                <button onClick={() => setFilterSection("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterStatus && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                {STATUS_OPTIONS.find(o => o.value === filterStatus)?.label}
                <button onClick={() => setFilterStatus("")}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Cards */}
        <div className="space-y-4">
          {visibleStats.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-4 flex flex-col xl:flex-row gap-4 hover:shadow-md transition-shadow border border-gray-100"
              >
                {/* Left Section */}
                <div className="flex items-center gap-3 xl:min-w-[220px]">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm md:text-base">
                    {section.title}
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-3 flex-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => !item._dimmed && item.value > 0 && handleStatClick(section, item.status, item.label)}
                      className={`
                        rounded-lg p-3 text-center transition-all
                        ${item.bg || "bg-gray-50"}
                        ${item._dimmed ? "opacity-25 cursor-default" : ""}
                        ${!item._dimmed && item.value > 0 ? "cursor-pointer hover:shadow-md hover:scale-105" : item._dimmed ? "" : "cursor-default opacity-60"}
                      `}
                    >
                      <div className="text-2xl font-bold text-gray-900">
                        {String(item.value).padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Patient List Modal */}
      {showModal && modalType === 'list' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 md:p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">{selectedSection?.title}</h2>
                <p className="text-sm text-gray-600 mt-1">Status: {selectedStatus?.label}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Patient List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {getFilteredPatients().length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No patients found</p>
                  </div>
                ) : (
                  getFilteredPatients().map(patient => (
                    <div key={patient.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4 shrink-0" />
                              <span>{patient.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4 shrink-0" />
                              <span className="truncate">{patient.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4 shrink-0" />
                              <span>{patient.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Menu */}
                        <div className="ml-0 sm:ml-4 w-full sm:w-auto">
                          <select
                            onChange={(e) => handleStatusChange(patient.id, e.target.value)}
                            defaultValue=""
                            className="w-full sm:w-auto px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="" disabled>Change Status</option>
                            <option value="new">New</option>
                            <option value="maybe">50:50</option>
                            <option value="closed">Closed</option>
                            <option value="complete">Complete</option>
                            <option value="offline">Offline</option>
                            <option value="online">Online</option>
                            <option value="not-interested">Not Interested</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}