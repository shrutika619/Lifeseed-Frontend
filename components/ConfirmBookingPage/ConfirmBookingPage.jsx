"use client";
import React, { useRef, useState } from 'react';
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
  Leaf
} from 'lucide-react';

const ConfirmBookingPage = () => {
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Function to handle PDF Download using print
  const handleDownloadReceipt = () => {
    const element = receiptRef.current;
    if (!element) return;

    setIsDownloading(true);

    // Create a new window with only the receipt content
    const printWindow = window.open('', '', 'width=800,height=600');
    const receiptHTML = element.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Appointment Receipt - M10-250916</title>
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
              Thank you for trusting us with your health. Your appointment has been successfully booked and payment is complete.
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
              <div className="text-gray-900 font-bold text-sm">M10-250916-BESA-8421</div>
            </div>

            {/* Specialist */}
            <div className="flex flex-col sm:flex-row sm:items-start mb-5 pb-5 border-b border-gray-200">
              <div className="flex items-center w-36 shrink-0 text-gray-500 text-sm font-semibold mb-2 sm:mb-0">
                <User className="w-4 h-4 mr-2 text-indigo-500" />
                Specialist:
              </div>
              <div className="text-gray-900 font-bold text-sm">Dr. Priya Sharma</div>
            </div>

            {/* Clinic */}
            <div className="flex flex-col sm:flex-row sm:items-start mb-5 pb-5 border-b border-gray-200">
              <div className="flex items-center w-36 shrink-0 text-gray-500 text-sm font-semibold mb-2 sm:mb-0">
                <Building2 className="w-4 h-4 mr-2 text-indigo-500" />
                Clinic:
              </div>
              <div className="text-sm">
                <div className="font-bold text-gray-900">MEN 10 Clinic - Besa, Nagpur</div>
                <div className="text-gray-500 mt-1 text-xs leading-relaxed">
                  Plot 45, Manish Nagar Road, Besa, Nagpur, 440034
                </div>
                <div className="text-indigo-600 font-medium text-xs mt-2">
                  (Partnered with Meditrina Hospital, Nagpur)
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex flex-col sm:flex-row sm:items-start mb-5 pb-5 border-b border-gray-200">
              <div className="flex items-center w-36 shrink-0 text-gray-500 text-sm font-semibold mb-2 sm:mb-0">
                <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                Date & Time:
              </div>
              <div className="text-gray-900 font-bold text-sm">
                Tuesday, September 16, 2025 at 11:30 AM
              </div>
            </div>

            {/* Payment */}
            <div className="flex flex-col sm:flex-row sm:items-start">
              <div className="flex items-center w-36 shrink-0 text-gray-500 text-sm font-semibold mb-2 sm:mb-0">
                <CreditCard className="w-4 h-4 mr-2 text-indigo-500" />
                Payment:
              </div>
              <div className="text-gray-900 font-bold text-sm">
                ₹600 <span className="text-gray-400 font-normal ml-1">(Paid Online)</span>
              </div>
            </div>

          </div>
        </div>
        {/* --- CONTENT TO CAPTURE ENDS HERE --- */}

        {/* Action Buttons */}
        <div className="px-6 md:px-8 pb-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-8 pb-8 border-b border-gray-100">
            <button 
              onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Plot+45%2C+Manish+Nagar+Road%2C+Besa%2C+Nagpur%2C+440034', '_blank')}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-indigo-400 transition-all"
            >
              <MapPin className="w-4 h-4" />
              Get Directions
            </button>
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
                  Please <span className="font-semibold text-gray-800">arrive 10-15 minutes early</span> to complete any necessary paperwork.
                </p>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed pt-1">
                  If you need to reschedule or cancel, please contact us at least <span className="font-semibold text-gray-800">24 hours in advance.</span>
                </p>
              </li>
            </ul>
          </div>

          {/* Ayurveda Footer */}
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
}

export default ConfirmBookingPage;