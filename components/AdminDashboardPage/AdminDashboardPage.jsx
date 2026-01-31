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
  Mail
} from "lucide-react";

const initialStatsData = [
  {
    id: 'inquiry-direct',
    title: "Inquiry Direct",
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
    id: 'assessment-inquiry',
    title: "Assessment Inquiry",
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

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState(initialStatsData);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    patientName: '',
    phone: '',
    email: '',
    service: '',
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Open list modal
  const handleStatClick = (section, status, label) => {
    if (status === 'not-interested') return;
    setSelectedSection(section);
    setSelectedStatus({ status, label });
    setModalType('list');
    setShowModal(true);
  };

  // Open order form
  const handlePlaceOrder = (section) => {
    setSelectedSection(section);
    setShowOrderForm(true);
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
            if (item.status === oldStatus) {
              return { ...item, value: Math.max(0, item.value - 1) };
            }
            if (item.status === newStatus) {
              return { ...item, value: item.value + 1 };
            }
            return item;
          })
        };
      }
      return section;
    }));

    // Update mock data
    const sectionPatients = mockPatients[selectedSection.id];
    const patient = sectionPatients.find(p => p.id === patientId);
    if (patient) {
      patient.status = newStatus;
    }
    
    setShowModal(false);
  };

  // Submit order form
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    const newPatient = {
      id: Date.now(),
      name: orderFormData.patientName,
      phone: orderFormData.phone,
      email: orderFormData.email,
      status: 'new',
      date: new Date().toISOString().split('T')[0],
      notes: orderFormData.notes
    };

    // Add to mock patients
    if (!mockPatients[selectedSection.id]) {
      mockPatients[selectedSection.id] = [];
    }
    mockPatients[selectedSection.id].unshift(newPatient);

    // Update stats
    setStatsData(prev => prev.map(section => {
      if (section.id === selectedSection.id) {
        return {
          ...section,
          items: section.items.map(item => {
            if (item.status === 'new') {
              return { ...item, value: item.value + 1 };
            }
            return item;
          })
        };
      }
      return section;
    }));

    // Reset form
    setOrderFormData({
      patientName: '',
      phone: '',
      email: '',
      service: '',
      notes: ''
    });
    setShowOrderForm(false);
    
    alert('Order placed successfully!');
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filters</span>
          </button>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {statsData.map((section, index) => {
            const Icon = section.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-4 flex flex-col xl:flex-row gap-4 hover:shadow-md transition-shadow"
              >
                {/* Left Section */}
                <div className="flex items-center gap-3 xl:min-w-[220px]">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    {section.title}
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-3 flex-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => item.value > 0 && handleStatClick(section, item.status, item.label)}
                      className={`
                        rounded-lg p-3 text-center transition-all
                        ${item.bg || "bg-gray-50"}
                        ${item.value > 0 ? "cursor-pointer hover:shadow-md hover:scale-105" : "cursor-default opacity-60"}
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

                {/* Action */}
                <div className="flex justify-end xl:items-center">
                  <button 
                    onClick={() => handlePlaceOrder(section)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2.5 rounded-lg w-full sm:w-auto flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Place Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Patient List Modal */}
      {showModal && modalType === 'list' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedSection?.title}</h2>
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
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{patient.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{patient.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{patient.date}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Menu */}
                        <div className="ml-4">
                          <select
                            onChange={(e) => handleStatusChange(patient.id, e.target.value)}
                            defaultValue=""
                            className="px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Place New Order</h2>
              <button 
                onClick={() => setShowOrderForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name *
                </label>
                <input
                  type="text"
                  required
                  value={orderFormData.patientName}
                  onChange={(e) => setOrderFormData({...orderFormData, patientName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={orderFormData.phone}
                  onChange={(e) => setOrderFormData({...orderFormData, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={orderFormData.email}
                  onChange={(e) => setOrderFormData({...orderFormData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="patient@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <input
                  type="text"
                  value={selectedSection?.title}
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={orderFormData.notes}
                  onChange={(e) => setOrderFormData({...orderFormData, notes: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowOrderForm(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}