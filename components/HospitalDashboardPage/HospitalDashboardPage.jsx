"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Uncommented & Working
import {
  Menu,
  X,
  Plus,
  Filter,
  Clock,
  Settings,
  Users,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Star,
  Tag,
  Calendar,
} from "lucide-react";

// Helper component for the Sidebar Item 
const SidebarItem = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-3 rounded-lg mb-1 text-gray-700 hover:bg-gray-100 transition"
  >
    <div className="flex items-center gap-3">
      <Icon size={20} className="text-gray-600" />
      <span className="font-medium">{label}</span>
    </div>
    <ChevronRight size={16} className="text-gray-400" />
  </button>
);

// Helper function for patient initials
const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.split(" ");
  return parts.map(p => p[0]).join('').toUpperCase();
};

// Helper component for the Booking Card 
const BookingCard = ({ booking, handleAccept, handleReject }) => {
  const patientInitials = getInitials(booking.patientName);
  const isPending = booking.bookingStatus === "pending";

  return (
    <div
      className="bg-white rounded-xl shadow-md p-4 border border-gray-100"
      key={booking.id}
    >
      {/* Order Info */}
      <div className="text-xs text-gray-500 mb-3 flex items-center justify-between flex-wrap gap-2">
        <span className="font-semibold text-sm text-gray-600">
          • Order ID#{booking.orderId}
        </span>
        <span className="text-xs">
          Today {booking.time} • Collet {booking.calledBy}
        </span>
      </div>

      {/* Issue (If present) */}
      {booking.issue && (
        <div className="text-sm font-semibold text-gray-800 mb-2">
          {booking.issue}
        </div>
      )}

      {/* Patient Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-semibold">
            {patientInitials}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-sm text-gray-900">{booking.patientName}</h4>
          <p className="text-xs text-gray-500">
            {booking.gender} • {booking.age} years
            {booking.bloodGroup && ` • Blood group ${booking.bloodGroup}`}
          </p>
        </div>
      </div>

      {/* Slot */}
      <div className="text-sm text-gray-600 mb-4 pb-3 border-t border-b border-gray-100">
        <span className="font-semibold text-gray-700">Slot:</span> Today {booking.slot}
      </div>

      {/* Doctor Info */}
      <div className="text-xs text-gray-500 mb-2 font-medium">Booking for</div>
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `ur[](https://placehold.co/120x120/007bff/ffffff/png?text=Dr)` }}
            >
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-semibold">
                Dr
              </div>
            </div>
          </div>
          <div>
            <h5 className="font-bold text-base text-gray-900 leading-tight">{booking.doctorName}</h5>
            <p className="text-xs text-gray-600 leading-tight">{booking.doctorQualification}</p>
            <p className="text-xs text-gray-500 leading-tight">
              {booking.doctorSpecialty} • Exp - {booking.doctorExp}
            </p>
            <div className="flex gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="#ffc107" stroke="#ffc107" />
              ))}
            </div>
          </div>
        </div>
        <span
          className="text-xs px-3 py-1 rounded-full font-medium self-start mt-1"
          style={{
            backgroundColor: booking.status === 'Available' ? '#e6fffb' : '#f0f0f0',
            color: booking.status === 'Available' ? '#00bfa5' : '#666',
            border: '1px solid',
            borderColor: booking.status === 'Available' ? '#00bfa5' : '#ccc'
          }}
        >
          {booking.status}
        </span>
      </div>

      {/* Action Buttons */}
      {isPending && (
        <div className="flex gap-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => handleAccept(booking.id)}
            className="flex-1 bg-white text-teal-600 border border-teal-600 py-2 rounded-lg font-semibold hover:bg-teal-50 transition text-sm shadow-sm"
          >
            Accept
          </button>
          <button
            onClick={() => handleReject(booking.id)}
            className="flex-1 bg-white text-red-600 border border-red-600 py-2 rounded-lg font-semibold hover:bg-red-50 transition text-sm shadow-sm"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default function HospitalDashboardPage() {
  const router = useRouter(); // Real router

  const [filterStatus, setFilterStatus] = useState("all");
  const [dropdownFilter, setDropdownFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Real navigation
  const handleNavigation = (route) => {
    router.push(route);
  };

  const hospitalData = {
    name: "Care Hospital Nagpur",
    address: "Wardha Rd, Jhansi Rani Sq, Nagpur",
    location: "Sitaburdi, Nagpur",
  };

  const sampleBookings = [
    { id: 1, orderId: "0298848", time: "10:30 AM", calledBy: "CASH ED", patientName: "Pavan Karchal", gender: "Male", age: "38", slot: "11 AM - 12 PM", doctorName: "Dr. Ram Sharma", doctorQualification: "MBBS, M.D Medicine", doctorSpecialty: "General Physician", doctorExp: "3 years", status: "Available", bookingStatus: "pending" },
    { id: 2, orderId: "0298098", time: "10:30 AM", calledBy: "CASH", issue: "Low Sperm", patientName: "Pavan Karchal", gender: "Male", age: "38", bloodGroup: "O+", slot: "11 AM - 12 PM", doctorName: "Dr. Shankar Dayal", doctorQualification: "MBBS, M.D Medicine", doctorSpecialty: "General Physician", doctorExp: "3 years", status: "Available", bookingStatus: "pending" },
    { id: 3, orderId: "0298850", time: "11:30 AM", calledBy: "ONLINE", patientName: "Amit Sharma", gender: "Male", age: "42", slot: "2 PM - 3 PM", doctorName: "Dr. Priya Singh", doctorQualification: "MBBS, MS", doctorSpecialty: "Cardiologist", doctorExp: "5 years", status: "Available", bookingStatus: "booked" },
    { id: 4, orderId: "0298851", time: "12:30 PM", calledBy: "CASH", patientName: "Ritu Verma", gender: "Female", age: "29", slot: "4 PM - 5 PM", doctorName: "Dr. Neha Kulkarni", doctorQualification: "BDS, MDS", doctorSpecialty: "Dentist", doctorExp: "7 years", status: "Unavailable", bookingStatus: "cancelled" },
    { id: 5, orderId: "0298852", time: "01:00 PM", calledBy: "CASH", patientName: "Rajesh Kumar", gender: "Male", age: "50", slot: "5 PM - 6 PM", doctorName: "Dr. Anand Gupta", doctorQualification: "MBBS, MS Ortho", doctorSpecialty: "Orthopedic", doctorExp: "10 years", status: "Available", bookingStatus: "completed" },
    { id: 6, orderId: "0298853", time: "02:00 PM", calledBy: "ONLINE", patientName: "Pooja Mehta", gender: "Female", age: "30", slot: "6 PM - 7 PM", doctorName: "Dr. Seema Varma", doctorQualification: "MBBS, DGO", doctorSpecialty: "Gynecologist", doctorExp: "8 years", status: "Unavailable", bookingStatus: "pending" },
    { id: 7, orderId: "0298854", time: "03:00 PM", calledBy: "CASH", patientName: "Vikram Saini", gender: "Male", age: "25", slot: "7 PM - 8 PM", doctorName: "Dr. Ram Sharma", doctorQualification: "MBBS, M.D Medicine", doctorSpecialty: "General Physician", doctorExp: "3 years", status: "Available", bookingStatus: "booked" },
    { id: 8, orderId: "0298855", time: "04:00 PM", calledBy: "ONLINE", patientName: "Karan Singh", gender: "Male", age: "35", slot: "8 PM - 9 PM", doctorName: "Dr. A. B. Roy", doctorQualification: "MBBS", doctorSpecialty: "General Physician", doctorExp: "5 years", status: "Unavailable", bookingStatus: "ptAbsent" },
    { id: 9, orderId: "0298856", time: "05:00 PM", calledBy: "CASH", patientName: "Sneha Das", gender: "Female", age: "22", slot: "9 PM - 10 PM", doctorName: "Dr. R. K. Jain", doctorQualification: "MBBS, MS", doctorSpecialty: "Surgeon", doctorExp: "12 years", status: "Available", bookingStatus: "followUp" },
    { id: 10, orderId: "0298857", time: "06:00 PM", calledBy: "ONLINE", patientName: "Zoya Khan", gender: "Female", age: "40", slot: "10 PM - 11 PM", doctorName: "Dr. R. K. Jain", doctorQualification: "MBBS, MS", doctorSpecialty: "Surgeon", doctorExp: "12 years", status: "Available", bookingStatus: "sellD" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setBookings(sampleBookings);
      setLoading(false);
    }, 500);
  }, []);

  const stats = {
    allFilterCount: 15,
    bookedFilterCount: sampleBookings.filter(b => b.bookingStatus === 'booked').length,
    cancelledFilterCount: sampleBookings.filter(b => b.bookingStatus === 'cancelled').length,
    completedFilterCount: sampleBookings.filter(b => b.bookingStatus === 'completed').length,
    ptAbsentCount: sampleBookings.filter(b => b.bookingStatus === 'ptAbsent').length,
    followUpCount: sampleBookings.filter(b => b.bookingStatus === 'followUp').length,
    sellDCount: sampleBookings.filter(b => b.bookingStatus === 'sellD').length * 2,
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "all") return true;
    return booking.bookingStatus === filterStatus;
  });

  const handleAcceptBooking = (bookingId) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, bookingStatus: "booked" } : b));
  };

  const handleRejectBooking = (bookingId) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, bookingStatus: "cancelled" } : b));
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hospitalToken");
      localStorage.removeItem("hospitalId");
    }
    router.push("/"); // Real redirect
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const customFilters = [
    { label: "By Doctor", icon: Users, options: ["Dr. Ram Sharma", "Dr. Shankar Dayal"] },
    { label: "By Service", icon: Tag, options: ["General Checkup", "Low Sperm Treatment"] },
    { label: "By Date", icon: Calendar, options: ["Today", "Next 7 Days"] },
  ];

  const getStatusStyle = (status) =>
    filterStatus === status
      ? "bg-blue-600 text-white shadow-md"
      : "bg-white text-gray-700 border border-gray-300 shadow-sm";

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'all': return 'text-gray-900 bg-white border border-gray-300';
      case 'booked': case 'followUp': return 'text-blue-600 bg-blue-50 border border-blue-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border border-red-200';
      case 'completed': case 'ptAbsent': case 'sellD': return 'text-green-600 bg-green-50 border border-green-200';
      default: return 'text-gray-700 bg-gray-200';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 bg-white shadow-xl flex-col flex-shrink-0 fixed h-full z-30 border-r border-gray-100">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `ur[](https://placehold.co/120x120/007bff/ffffff/png?text=U)` }}>
                  <div className="w-full h-full bg-blue-300 flex items-center justify-center text-white text-xl font-semibold"></div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Care Hospital</h3>
                <p className="text-xs text-gray-500">{hospitalData.location}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <SidebarItem icon={Clock} label="Time Table" onClick={() => handleNavigation("/timetable")} />
          <SidebarItem icon={Settings} label="Settings" onClick={() => handleNavigation("/settings")} />
          <SidebarItem icon={Users} label="Doctors" onClick={() => handleNavigation("/doctors")} />
          <SidebarItem icon={HelpCircle} label="Help" onClick={() => handleNavigation("/help")} />
          <SidebarItem icon={FileText} label="Terms & Conditions" onClick={() => handleNavigation("/terms")} />
        </nav>

        <div className="p-4 border-t-2 border-gray-100 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg text-gray-600">
          <X size={24} />
        </button>
        <div className="p-6 pt-12 border-b">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-blue-300 flex items-center justify-center text-white text-xl font-semibold"></div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Care Hospital</h3>
                <p className="text-xs text-gray-500">{hospitalData.location}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </div>
        <nav className="p-4 flex-1 overflow-y-auto">
          {[
            { icon: Clock, label: "Time Table", route: "/timetable" },
            { icon: Settings, label: "Settings", route: "/settings" },
            { icon: Users, label: "Doctors", route: "/doctors" },
            { icon: HelpCircle, label: "Help", route: "/help" },
            { icon: FileText, label: "Terms & Conditions", route: "/terms" },
          ].map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              onClick={() => {
                setSidebarOpen(false);
                handleNavigation(item.route);
              }}
            />
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-gray-100 bg-white">
          <button onClick={handleLogout} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md">
            Logout
          </button>
        </div>
      </div>

      {/* Filter Menu */}
      {isFilterMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsFilterMenuOpen(false)} />
      )}
      <div className={`fixed right-0 top-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform ${isFilterMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Filter size={24} className="text-blue-600" /> Advanced Filter
            </h3>
            <button onClick={() => setIsFilterMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-6">
            {customFilters.map((filter) => (
              <div key={filter.label}>
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <filter.icon size={16} className="text-gray-500" />
                  {filter.label}
                </h4>
                <div className="space-y-2">
                  {filter.options.map((option) => (
                    <label key={option} className="flex items-center text-sm text-gray-600 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 mr-3 focus:ring-blue-500" />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t mt-4 flex gap-3">
            <button onClick={() => setIsFilterMenuOpen(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-xl font-medium hover:bg-gray-300 transition">
              Clear
            </button>
            <button onClick={() => setIsFilterMenuOpen(false)} className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition">
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <div className="bg-white border-b p-4 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-700">
                <Menu size={24} />
              </button>
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-white rounded-full"></div>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-sm lg:text-base">Care Hospital Nagpur</h2>
                <p className="text-xs text-gray-500">{hospitalData.address}</p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-700">
              <Menu size={24} />
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <select
              value={dropdownFilter}
              onChange={(e) => setDropdownFilter(e.target.value)}
              className="flex-1 min-w-[150px] border border-gray-300 px-4 py-2.5 rounded-lg bg-white appearance-none pr-8 text-sm font-medium focus:ring-blue-500"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.7rem center',
                backgroundSize: '1.2rem'
              }}
            >
              <option value="all">All requests</option>
              <option value="pending">Pending</option>
              <option value="booked">Booked</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
              <option value="ptAbsent">Pt Absent</option>
              <option value="followUp">Follow-up</option>
              <option value="sellD">Sell D</option>
            </select>

            <button onClick={() => handleNavigation("/plus")} className="bg-white border border-gray-300 text-gray-700 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition shadow-sm">
              <Plus size={20} />
            </button>

            <button onClick={() => setIsFilterMenuOpen(true)} className="bg-white border border-gray-300 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-50 transition shadow-sm">
              <Filter size={20} className="text-gray-700" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 lg:gap-3 mb-4 lg:mb-6 overflow-x-auto pb-2 border-b border-gray-200">
            {[
              { status: "all", label: "All", count: stats.allFilterCount },
              { status: "booked", label: "Booked", count: stats.bookedFilterCount },
              { status: "cancelled", label: "Cancelled", count: stats.cancelledFilterCount },
              { status: "completed", label: "Completed", count: stats.completedFilterCount },
              { status: "ptAbsent", label: "Pt Absent", count: stats.ptAbsentCount },
              { status: "followUp", label: "Follow-up", count: stats.followUpCount },
              { status: "sellD", label: "Sell D", count: stats.sellDCount / 2 },
              { status: "sellD", label: "Sell D", count: stats.sellDCount / 2 },
            ].map((tab, i) => (
              <button
                key={i}
                onClick={() => setFilterStatus(tab.status)}
                className={`px-4 lg:px-6 py-2 rounded-xl font-bold whitespace-nowrap text-sm flex items-center gap-1 ${getStatusStyle(tab.status)}`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getBadgeStyle(tab.status)}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
                <p className="text-gray-500 font-medium">No {filterStatus} bookings found.</p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  handleAccept={handleAcceptBooking}
                  handleReject={handleRejectBooking}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}