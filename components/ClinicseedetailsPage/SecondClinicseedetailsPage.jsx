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
  const fullStars = Math.floor(rating);
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < fullStars ? "text-yellow-400" : "text-gray-300"
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

const TimingsTable = ({ timings }) => {
  const getSlotColor = (index) => {
    if (index === 0) return "bg-blue-100 text-blue-700";
    if (index === 1) return "bg-orange-100 text-orange-700";
    if (index === 2) return "bg-indigo-100 text-indigo-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-3">
      {timings.map((d) => (
        <div key={d.day} className="flex items-center gap-3">
          <div
            className={`font-semibold text-base w-24 ${
              d.closed ? "text-gray-500" : "text-gray-900"
            }`}
          >
            {d.day}
          </div>
          {d.closed ? (
            <div className="bg-gray-100 text-gray-500 text-sm px-4 py-2 rounded-lg font-medium">
              Closed
            </div>
          ) : (
            <div className="flex gap-2 flex-1">
              {d.slots.map((s, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex-1 text-center ${getSlotColor(
                    i
                  )}`}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
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
  const query = encodeURIComponent(address);
  const [zoom, setZoom] = React.useState(15);

  const updateZoom = (change) => {
    let newZoom = zoom + change;
    if (newZoom < 1) newZoom = 1;
    if (newZoom > 20) newZoom = 20;
    setZoom(newZoom);
  };

  const dynamicSrc = `https://maps.google.com/maps?q=${query}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
      <div className="h-44 md:h-56 relative">
        <iframe
          title="clinic-map"
          src={dynamicSrc}
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>

      <div className="absolute bottom-3 right-3 flex flex-col bg-white shadow-lg rounded-lg overflow-hidden border">
        <button onClick={() => updateZoom(1)} className="p-2 border-b hover:bg-gray-100">
          +
        </button>
        <button onClick={() => updateZoom(-1)} className="p-2 hover:bg-gray-100">
          –
        </button>
      </div>
    </div>
  );
};

// ---------- Page-specific components ----------

const DoctorCard = ({ doctor, onBook }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <img
          src={doctor.imageUrl}
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
              <div className="text-sm text-gray-600">{doctor.qualification}</div>
              <div className="text-sm text-gray-500 mt-1">
                Experience: {doctor.experience}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <StarRating rating={doctor.rating} />
                <div className="text-sm font-semibold">{doctor.rating}/5</div>
                <div className="text-sm text-gray-500">
                  Languages:{" "}
                  <span className="font-medium text-gray-700">
                    {doctor.languages}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-row lg:flex-col items-start gap-3 lg:text-right">
              <div className="bg-indigo-50 text-indigo-700 font-semibold px-3 py-1 rounded-md whitespace-nowrap">
                {doctor.fee}
              </div>
              <button
                onClick={onBook}
                className="bg-white border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 whitespace-nowrap"
              >
                Book an Appointment
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
          <div className="text-xs text-gray-600">{clinic.address}</div>
        </div>
      </div>

      <div className="mt-4">
        <TimingsTable timings={timings} />
      </div>

      <div className="mt-4 space-y-3">
        <button
          onClick={onBookNow}
          className="w-full flex items-center justify-center py-3 rounded-lg bg-indigo-600 text-white font-medium"
        >
          <CalendarCheck className="w-4 h-4 mr-2" /> Book Appointment
        </button>

        <button
          onClick={onCall}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-50 text-gray-700 font-medium shadow-sm"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </button>

        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-50 text-gray-700 font-medium shadow-sm">
          <MapPin className="w-4 h-4" />
          Get Directions
        </button>
      </div>
    </div>
  );
};

// ---------- Main Page ----------

export default function ClinicDetailsPage() {
  const router = useRouter();

  const doctor = {
    name: "Dr. Priya Sharma",
    qualification: "MBBS, MD (General Medicine)",
    experience: "12+ Yrs",
    rating: 4.8,
    languages: "English, Hindi",
    fee: "₹600",
    imageUrl: "https://placehold.co/100x120/8b5cf6/ffffff?text=Dr+Priya",
  };

  const conditionsList = [
    "Sexual Dysfunction",
    "Erectile Dysfunction",
    "Low Sex Desire",
    "Premature Ejaculation",
    "Couple Sex Problem",
    "Delayed Ejaculation",
  ];

  const [activeConditions, setActiveConditions] = useState([]);
  const toggleCondition = (label) => {
    setActiveConditions((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]
    );
  };

  const clinicTimings = [
    { day: "Sunday", closed: true, slots: [] },
    { day: "Monday", closed: false, slots: ["11am - 1pm", "2pm - 5pm", "6pm - 8pm"] },
    { day: "Tuesday", closed: false, slots: ["11am - 1pm", "2pm - 5pm", "6pm - 8pm"] },
    { day: "Wednesday", closed: false, slots: ["11am - 1pm", "2pm - 5pm", "6pm - 8pm"] },
    { day: "Thursday", closed: false, slots: ["11am - 1pm", "2pm - 5pm", "6pm - 8pm"] },
    { day: "Friday", closed: false, slots: ["11am - 1pm", "2pm - 5pm", "6pm - 8pm"] },
    { day: "Saturday", closed: false, slots: ["11am - 1pm", "2pm - 5pm", "6pm - 8pm"] },
  ];

  const chartData = [
    { label: "Start", value: 10 },
    { label: "2 Weeks", value: 30 },
    { label: "4 Weeks", value: 55 },
    { label: "8 Weeks", value: 82 },
    { label: "12 Weeks", value: 95 },
  ];

  const openBooking = () => router.push("/bookappointment");

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-lg font-semibold mb-2">Meet Our Specialists</h2>

          <DoctorCard doctor={doctor} onBook={openBooking} />

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-md font-semibold mb-4">Conditions We Treat</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {conditionsList.map((c) => {
                const iconMap = {
                  "Sexual Dysfunction": Heart,
                  "Erectile Dysfunction": Shield,
                  "Low Sex Desire": MessageSquare,
                  "Premature Ejaculation": Clock,
                  "Couple Sex Problem": Package,
                  "Delayed Ejaculation": Syringe,
                };
                const Icon = iconMap[c] || Heart;
                return (
                  <ConditionTag
                    key={c}
                    icon={Icon}
                    label={c}
                    onToggle={toggleCondition}
                    active={activeConditions.includes(c)}
                  />
                );
              })}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">
                Proven Results: A Patient's Journey
              </h3>
              <p className="text-sm text-gray-500">
                We believe in data-driven results. Typical improvement timeline
                shown below.
              </p>
            </div>

            <EDChart data={chartData} />
          </section>
        </div>

        <div className="space-y-6">
          <MapEmbed
            address={
              "Plot 50, Manish Nagar Road, Besa, Nagpur, Maharashtra 440024"
            }
          />

          <SidebarCard
            clinic={{
              name: "MEN10 Clinic - Besa",
              address:
                "Plot 50, Manish Nagar Road, Besa, Nagpur, Maharashtra 440024",
            }}
            timings={clinicTimings}
            onBookNow={openBooking}
            onCall={() => alert("Calling clinic...")}
          />
        </div>
      </div>
    </div>
  );
}