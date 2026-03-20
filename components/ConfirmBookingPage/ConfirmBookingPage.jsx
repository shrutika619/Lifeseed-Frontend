"use client";

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { 
  Check, 
  MapPin, 
  Download, 
  Mail, 
  Clock, 
  Bell, 
  Ticket, 
  User, 
  Building2, 
  Calendar, 
  CreditCard,
  Leaf,
  Loader2,
  AlertCircle,
  Phone
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { getMyBookingDetails } from "@/app/services/patient/order.service"; // Ensure path is correct

const ConfirmBookingContent = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const type = 'inclinic' // 'tele' or 'inclinic'

  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Booking Details
  useEffect(() => {
    const fetchDetails = async () => {
      if (!bookingId || !type) {
        setError("Invalid booking parameters.");
        setLoading(false);
        return;
      }

      try {
        const res = await getMyBookingDetails(bookingId, type);
        if (res.success && res.data) {
          setBookingData(res.data);
        } else {
          setError(res.message || "Failed to load booking details.");
        }
      } catch (err) {
        setError("Error communicating with server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [bookingId, type]);

  // Function to handle PDF Download using print
  const handleDownloadReceipt = () => {
    const element = receiptRef.current;
    if (!element) return;

    setIsDownloading(true);

    const printWindow = window.open('', '', 'width=800,height=600');
    const receiptHTML = element.innerHTML;
    const displayId = bookingData?.appointmentId || bookingData?.requestId || bookingId;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Appointment Receipt - ${displayId}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              margin: 20px;
              background: white;
            }
            * {
              box-sizing: border-box;
            }
          </style>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body>
          ${receiptHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      setIsDownloading(false);
    }, 500);
  };

  // ─── LOADING STATE ───
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-indigo-900 font-semibold">Preparing your receipt...</p>
      </div>
    );
  }

  // ─── ERROR STATE ───
  if (error || !bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-4 border-rose-500">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || "Could not retrieve booking details."}</p>
          <button 
            onClick={() => window.history.back()}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ─── DATA EXTRACTION ───
  const displayId = bookingData.appointmentId || bookingData.requestId || bookingId;
  const doctorName = bookingData.doctor?.name || "Specialist";
  const fees = bookingData.fees || 0;
  const paymentMode = bookingData.paymentMode?.toLowerCase() === 'cash' ? 'To be paid at clinic' : 'Prepaid / Online';
  
  // Format Date
  const dateStr = bookingData.appointmentDate || bookingData.bookingDate;
  let formattedDate = "Date not available";
  if (dateStr) {
    const dateObj = new Date(dateStr);
    formattedDate = dateObj.toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* --- CONTENT TO CAPTURE FOR RECEIPT STARTS HERE --- */}
        <div ref={receiptRef} className="p-6 md:p-8 bg-white">
          
          {/* Success Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-md">
              <Check className="w-10 h-10 text-green-500" strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h1>
            <p className="text-gray-500 text-sm md:text-base max-w-md leading-relaxed">
              Thank you for trusting us with your health. Your appointment has been successfully booked.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6 shadow-sm">
            
            {/* Booking ID */}
            <div className="flex flex-col sm:flex-row sm:items-start mb-5 pb-5 border-b border-gray-200">
              <div className="flex items-center w-36 shrink-0 text-gray-500 text-sm font-semibold mb-2 sm:mb-0">
                <Ticket className="w-4 h-4 mr-2 text-indigo-500" />
                Booking ID:
              </div>
              <div className="text-gray-900 font-bold text-sm font-mono tracking-wide">{displayId}</div>
            </div>

            {/* Specialist */}
            <div className="flex flex-col sm:flex-row sm:items-start mb-5 pb-5 border-b border-gray-200">
              <div className="flex items-center w-36 shrink-0 text-gray-500 text-sm font-semibold mb-2 sm:mb-0">
                <User className="w-4 h-4 mr-2 text-indigo-500" />
                Specialist:
              </div>
              <div className="text-gray-900 font-bold text-sm">{doctorName}</div>
            </div>

            {/* Clinic OR Teleconsultation Info */}
            <div className="flex flex-col sm:flex-row sm:items-start mb-5 pb-5 border-b border-gray-200">
              <div className="flex items-center w-36 shrink-0 text-gray-500 text-sm font-semibold mb-2 sm:mb-0">
                {type === 'inclinic' ? <Building2 className="w-4 h-4 mr-2 text-indigo-500" /> : <Phone className="w-4 h-4 mr-2 text-indigo-500" />}
                {type === 'inclinic' ? 'Clinic:' : 'Consultation:'}
              </div>
              <div className="text-sm">
                {type === 'inclinic' ? (
                  <>
                    <div className="font-bold text-gray-900">{bookingData.clinic?.name || "Clinic"}</div>
                    <div className="text-gray-500 mt-1 text-xs leading-relaxed">
                      {bookingData.clinic?.address || "Address available in app"}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-gray-900">Online Teleconsultation</div>
                    <div className="text-gray-500 mt-1 text-xs leading-relaxed">
                      Registered Phone: <span className="font-semibold text-gray-700">{bookingData.bookingContactNumber || "Not Provided"}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex flex-col sm:flex-row sm:items-start mb-5 pb-5 border-b border-gray-200">
              <div className="flex items-center w-36 shrink-0 text-gray-500 text-sm font-semibold mb-2 sm:mb-0">
                <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                Date & Time:
              </div>
              <div className="text-gray-900 font-bold text-sm">
                {formattedDate} at {bookingData.timeSlot || '--'}
              </div>
            </div>

            {/* Payment */}
            <div className="flex flex-col sm:flex-row sm:items-start">
              <div className="flex items-center w-36 shrink-0 text-gray-500 text-sm font-semibold mb-2 sm:mb-0">
                <CreditCard className="w-4 h-4 mr-2 text-indigo-500" />
                Payment:
              </div>
              <div className="text-gray-900 font-bold text-sm">
                {type === 'tele' ? 'Prepaid / Included' : `₹${fees}`} 
                {type === 'inclinic' && (
                  <span className="text-gray-400 font-normal ml-1">({paymentMode})</span>
                )}
              </div>
            </div>

          </div>
        </div>
        {/* --- CONTENT TO CAPTURE ENDS HERE --- */}

        {/* Action Buttons */}
        <div className="px-6 md:px-8 pb-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-8 pb-8 border-b border-gray-100">
            {type === 'inclinic' && (
              <button 
                onClick={() => window.open('https://maps.google.com', '_blank')}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-indigo-400 transition-all"
              >
                <MapPin className="w-4 h-4" />
                Get Directions
              </button>
            )}
            <button 
              onClick={handleDownloadReceipt}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Preparing...' : 'Download Receipt'}
            </button>
          </div>

          {/* What to Expect Next */}
          <div className="mb-8">
            <h3 className="text-gray-900 font-bold text-lg mb-5">What to Expect Next</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed pt-1">
                  You will receive an <span className="font-semibold text-gray-800">email and SMS confirmation</span> shortly with your appointment details.
                </p>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed pt-1">
                  {type === 'inclinic' 
                    ? <><span className="font-semibold text-gray-800">Arrive 10-15 minutes early</span> to complete any necessary paperwork.</>
                    : <><span className="font-semibold text-gray-800">Be ready 5 minutes early</span> and ensure you have a stable internet connection.</>
                  }
                </p>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed pt-1">
                  If you need to reschedule or cancel, please do so from your <span className="font-semibold text-gray-800">Orders Dashboard</span>.
                </p>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center border-2 border-green-200 shadow-sm">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h4 className="text-green-800 font-bold text-lg mb-2">Why Ayurveda is Best for You</h4>
            <p className="text-green-700 text-sm md:text-base leading-relaxed mb-3">
              Embrace a holistic path to wellness. Ayurveda focuses on natural, root-cause treatments for long-lasting health, making it the preferred choice for sustainable well-being.
            </p>
            <p className="text-indigo-600 font-bold text-base">Happy Healing! 🌿</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

// Next.js 13+ requires components using useSearchParams to be wrapped in Suspense
export default function ConfirmBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    }>
      <ConfirmBookingContent />
    </Suspense>
  );
}