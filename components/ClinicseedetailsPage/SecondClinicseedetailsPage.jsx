"use client";

import React, { useState } from "react";
import {
  Star,
  MapPin,
  Clock,
  ChevronRight,
  Check,
  Heart,
  Shield,
  Package,
  Syringe,
  MessageSquare,
  CalendarCheck,
  Phone,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useRouter } from "next/navigation";

// ---------- Helper components ----------

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating || 0);
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < fullStars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const ConditionTag = ({ icon: Icon, label, onToggle, active }) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(label)}
      className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-colors text-sm w-full
        ${
          active
            ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm"
            : "bg-white border-gray-200 hover:border-indigo-200"
        }`}
    >
      <div className="flex items-center space-x-3">
        <Icon
          className={`w-5 h-5 ${
            active ? "text-indigo-600" : "text-gray-400"
          }`}
        />
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight
        className={`w-4 h-4 ${
          active ? "rotate-90 text-indigo-600" : "text-gray-300"
        }`}
      />
    </button>
  );
};

// TIMINGS TABLE
const TimingsTable = ({ timings }) => {
  const getSlotColor = (index) => {
    if (index === 0) return "bg-blue-100 text-blue-700";
    if (index === 1) return "bg-orange-100 text-orange-700";
    if (index === 2) return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-3">
      {timings.map((d, idx) => (
        <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
          
          <div className="w-24 font-semibold text-sm text-gray-800">
            {d.day}
          </div>

          <div className="flex-1 flex flex-wrap gap-2 justify-start">
            {d.closed ? (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded">
                Closed
              </span>
            ) : (
              d.slots.map((s, i) => (
                <span
                  key={i}
                  className={`text-xs font-semibold px-2 py-1.5 rounded-md whitespace-nowrap ${getSlotColor(i)}`}
                >
                  {s}
                </span>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const EDChart = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const MapEmbed = ({ address }) => {
  const query = encodeURIComponent(address || "Nagpur, India");
  
  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 h-56">
      <iframe
        title="clinic-map"
        src={`https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        className="w-full h-full border-0"
        loading="lazy"
      />
    </div>
  );
};

// ---------- Page-specific components ----------

const DoctorCard = ({ doctor, onBook }) => {
  // Extract specialty name securely whether it's populated or just a string
  const specialtyName = doctor.primarySpecialty?.name || doctor.primarySpecialty || "General Specialist";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <img
          src={doctor.profileImage || "https://placehold.co/100x120/8b5cf6/ffffff?text=Doctor"}
          alt={doctor.name}
          className="w-24 h-28 object-cover rounded-lg shadow"
        />
        <div className="flex-1 w-full">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-indigo-700 flex items-center">
                {doctor.name}
                <Check className="w-4 h-4 ml-2 text-green-500" />
              </h3>
              
              {/* ✅ FIX IS HERE: Render the safely extracted string instead of an object */}
              <div className="text-sm text-gray-600">{specialtyName}</div>
              
              <div className="text-sm text-gray-500 mt-1">
                Experience: {doctor.experience ? `${doctor.experience} Years` : "N/A"}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <StarRating rating={4.8} />
                <div className="text-sm font-semibold">4.8/5</div>
                <div className="text-sm text-gray-500">
                  Languages:{" "}
                  <span className="font-medium text-gray-700">
                    {Array.isArray(doctor.languages) ? doctor.languages.join(", ") : "English"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-row lg:flex-col items-start gap-3 lg:text-right">
              <div className="bg-indigo-50 text-indigo-700 font-semibold px-3 py-1 rounded-md whitespace-nowrap">
                ₹{doctor.consultationFee || 0}
              </div>
              <button
                onClick={onBook}
                className="bg-white border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 whitespace-nowrap"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarCard = ({ clinic, timings, onBookNow, onCall }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start space-x-3">
        <MapPin className="w-5 h-5 text-indigo-500 mt-1" />
        <div>
          <div className="text-xs font-medium">Address</div>
          <div className="text-xs text-gray-600 leading-relaxed">{clinic.address}</div>
        </div>
      </div>

      <div className="mt-4">
        <TimingsTable timings={timings} />
      </div>

      <div className="mt-4 space-y-3">
        <button
          onClick={onBookNow}
          className="w-full flex items-center justify-center py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          <CalendarCheck className="w-4 h-4 mr-2" /> Book Appointment
        </button>

        <button
          onClick={onCall}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-50 text-gray-700 font-medium shadow-sm hover:bg-gray-100 transition"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </button>

        <button
          onClick={() => window.open(clinic.googleMapsLink, '_blank')}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-50 text-gray-700 font-medium shadow-sm hover:bg-gray-100 transition"
        >
          <MapPin className="w-4 h-4" />
          Get Directions
        </button>
      </div>
    </div>
  );
};

// ---------- Main Page Component ----------

export default function SecondClinicseedetailsPage({ clinic, doctors }) {
  const router = useRouter();

  // Static Data
  const conditionsList = [
    "Sexual Dysfunction", "Erectile Dysfunction", "Low Sex Desire", 
    "Premature Ejaculation", "Couple Sex Problem", "Delayed Ejaculation"
  ];

  const [activeConditions, setActiveConditions] = useState([]);
  const toggleCondition = (label) => {
    setActiveConditions((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]
    );
  };

  const chartData = [
    { label: "Start", value: 10 }, { label: "2 Weeks", value: 30 }, 
    { label: "4 Weeks", value: 55 }, { label: "8 Weeks", value: 82 }, 
    { label: "12 Weeks", value: 95 }
  ];

  // --------- DYNAMIC URL ROUTING WITH ID ---------
  const openBooking = () => {
    router.push(clinic?._id ? `/bookappointment?clinicId=${clinic._id}` : "/bookappointment");
  };

  // Format Timings for UI
  const formattedTimings = clinic?.timings?.map((t) => {
    let slots = [];
    if (!t.isClosed && t.sections) {
      if (t.sections.morning?.enabled) slots.push(`${t.sections.morning.start}-${t.sections.morning.end}`);
      if (t.sections.afternoon?.enabled) slots.push(`${t.sections.afternoon.start}-${t.sections.afternoon.end}`);
      if (t.sections.evening?.enabled) slots.push(`${t.sections.evening.start}-${t.sections.evening.end}`);
    }
    return {
      day: t.day.charAt(0).toUpperCase() + t.day.slice(1),
      closed: t.isClosed,
      slots: slots,
    };
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-lg font-semibold mb-2">Meet Our Specialists</h2>

          {doctors && doctors.length > 0 ? (
            doctors.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} onBook={openBooking} />
            ))
          ) : (
            <div className="p-6 bg-white border rounded-2xl text-center text-gray-500">
              No doctors currently listed for this clinic.
            </div>
          )}

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-md font-semibold mb-4">Conditions We Treat</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {conditionsList.map((c) => {
                const iconMap = {
                  "Sexual Dysfunction": Heart, "Erectile Dysfunction": Shield,
                  "Low Sex Desire": MessageSquare, "Premature Ejaculation": Clock,
                  "Couple Sex Problem": Package, "Delayed Ejaculation": Syringe,
                };
                const Icon = iconMap[c] || Heart;
                return (
                  <ConditionTag
                    key={c} icon={Icon} label={c}
                    onToggle={toggleCondition} active={activeConditions.includes(c)}
                  />
                );
              })}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Proven Results: A Patient's Journey</h3>
              <p className="text-sm text-gray-500">We believe in data-driven results. Typical improvement timeline shown below.</p>
            </div>
            <EDChart data={chartData} />
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <MapEmbed address={clinic?.fulladdress || "Nagpur, India"} />
          <SidebarCard
            clinic={{
              name: clinic?.clinicName || "MEN10 Clinic",
              address: clinic?.fulladdress || "Address Unavailable",
              googleMapsLink: clinic?.googleMapsLink,
            }}
            timings={formattedTimings}
            onBookNow={openBooking}
            onCall={() => window.location.href = `tel:${clinic?.officeCallingNo}`}
          />
        </div>
      </div>
    </div>
  );
}