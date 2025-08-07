// src/BookingConfirmation.jsx

import React, { useState } from "react";

const API_URL = "http://localhost:8000/api/direct-booking/"; // Change for deployment!

export default function BookingConfirmation({ bookingData, onClose }) {
  const [isSending, setIsSending] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const sendToEmail = async () => {
    setIsSending(true);
    setResultMessage("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const result = await response.json();
      if (response.ok) {
        setResultMessage("Booking submitted and email sent successfully!");
      } else {
        setResultMessage(result.error || "Error sending booking request.");
      }
    } catch (err) {
      setResultMessage("Network error, please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#d9480f]">Booking Confirmation</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Success Message */}
          <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg">
            <div className="flex items-center">
              <span className="text-green-600 text-2xl mr-3">✅</span>
              <div>
                <h3 className="text-green-800 font-semibold">Booking Request Ready!</h3>
                <p className="text-green-700 text-sm">Your booking details will be emailed to our team.</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-600">Customer:</span>
                  <span className="ml-2 text-gray-800">{bookingData.customerName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-800">{bookingData.customerEmail}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Phone:</span>
                  <span className="ml-2 text-gray-800">{bookingData.customerPhone}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-600">From:</span>
                  <span className="ml-2 text-gray-800">{bookingData.fromLocation}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">To:</span>
                  <span className="ml-2 text-gray-800">{bookingData.toLocation}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Dates:</span>
                  <span className="ml-2 text-gray-800">
                    {bookingData.startDate} - {bookingData.endDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle & Package Details */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Vehicle & Package Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium text-gray-600">Vehicle:</div>
                <div className="text-gray-800">
                  {bookingData.vehicleName} ({bookingData.vehicleType})
                </div>
                <div className="text-sm text-gray-500">
                  Capacity: {bookingData.capacity}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Package:</div>
                <div className="text-gray-800">{bookingData.packageName}</div>
                <div className="text-sm text-gray-500">₹{bookingData.packagePrice}</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">
                  Total Estimated Cost:
                </span>
                <span className="text-2xl font-bold text-[#d9480f]">
                  ₹{bookingData.totalCost}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={sendToEmail}
              disabled={isSending}
              className="w-full bg-[#d9480f] hover:bg-[#b93707] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <span className="mr-2">📧</span>
              {isSending ? "Sending..." : "Send Details to Email"}
            </button>
          </div>

          {/* Status Message */}
          {resultMessage && (
            <div className="mt-4 p-3 bg-blue-100 border border-blue-400 rounded-lg">
              <p className="text-blue-800 text-sm">{resultMessage}</p>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <span className="text-yellow-600 text-xl mr-3">ℹ️</span>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Our team will review your booking request</li>
                  <li>We'll contact you within 2 hours to confirm</li>
                  <li>Driver details will be shared 1 hour before pickup</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
