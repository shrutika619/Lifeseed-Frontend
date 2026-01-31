"use client";

import React from "react";

export default function BookingCardPage({ booking, onAccept, onReject }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      {/* Order Info */}
      <div className="text-xs text-gray-500 mb-3">
        • Order ID#{booking.orderId} • Today {booking.time} • Called:{" "}
        {booking.calledBy}
      </div>

      {/* Patient Info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div>
          <h4 className="font-semibold text-gray-900">{booking.patientName}</h4>
          <p className="text-sm text-gray-500">
            {booking.gender} • {booking.age} years
            {booking.bloodGroup && ` • Blood group ${booking.bloodGroup}`}
          </p>
        </div>
      </div>

      {/* Slot Time */}
      <div className="text-sm text-gray-600 mb-3">
        Slot: Today {booking.slot}
      </div>

      {/* Issue */}
      {booking.issue && (
        <div className="text-sm text-gray-600 mb-3">
          Order ID#{booking.issueId}
          <br />
          {booking.issue}
        </div>
      )}

      {/* Booking For */}
      <div className="text-sm text-gray-500 mb-3">Booking for</div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div>
            <h5 className="font-semibold text-gray-900">
              {booking.doctorName}
            </h5>
            <p className="text-xs text-gray-500">
              {booking.doctorQualification}
            </p>
            <p className="text-xs text-gray-500">
              {booking.doctorSpecialty} • Exp - {booking.doctorExp}
            </p>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-sm">
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

        <span className="bg-teal-500 text-white text-xs px-3 py-1 rounded-full">
          {booking.status}
        </span>
      </div>

      {/* Action Buttons */}
      {booking.bookingStatus === "pending" && (
        <div className="flex gap-3">
          <button
            onClick={() => onAccept(booking.id)}
            className="flex-1 bg-white text-teal-500 border border-teal-500 py-2 rounded-lg font-medium hover:bg-teal-50 transition"
          >
            Accept
          </button>
          <button
            onClick={() => onReject(booking.id)}
            className="flex-1 bg-white text-red-500 border border-red-500 py-2 rounded-lg font-medium hover:bg-red-50 transition"
          >
            Reject
          </button>
        </div>
      )}

      {booking.bookingStatus === "booked" && (
        <div className="bg-green-50 text-green-700 py-2 rounded-lg text-center font-medium">
          ✓ Accepted
        </div>
      )}

      {booking.bookingStatus === "cancelled" && (
        <div className="bg-red-50 text-red-700 py-2 rounded-lg text-center font-medium">
          ✗ Rejected
        </div>
      )}
    </div>
  );
}