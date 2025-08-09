import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { sendBookingConfirmationEmail } from '../services/emailService';
import ConfirmationModal from './ConfirmationModal';

const BookingForm = ({ user, onShowLogin }) => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [vehicleType, setVehicleType] = useState('');
  const [passengers, setPassengers] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const vehicleTypes = [
    { value: '', label: 'All Vehicle Types' },
    { value: 'car', label: 'Car' },
    { value: 'suv', label: 'SUV' },
    { value: 'van', label: 'Van' },
    { value: 'bus', label: 'Bus' },
    { value: 'luxury', label: 'Luxury Vehicle' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if user is logged in
    if (!user) {
      setError('Please login to make bookings.');
      onShowLogin();
      return;
    }

    if (!fromLocation || !toLocation || !fromDate || !toDate) {
      setError('Please fill in all required fields.');
      return;
    }

    if (fromDate >= toDate) {
      setError('To Date must be after From Date.');
      return;
    }

    if (passengers && (passengers < 1 || passengers > 20)) {
      setError('Number of passengers must be between 1 and 20.');
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        customer_name: user.first_name ? `${user.first_name} ${user.last_name}` : user.username,
        customer_email: user.email,
        customer_phone: user.phone || '+91 98765 43210',
        from_location: fromLocation,
        to_location: toLocation,
        start_date: fromDate.toISOString().split('T')[0],
        end_date: toDate.toISOString().split('T')[0],
        vehicle_type: vehicleType || '',
        passengers: passengers ? parseInt(passengers) : null,
        additional_notes: ''
      };

      const response = await sendBookingConfirmationEmail(bookingData);
      
      // Show success message
      if (response.success) {
        setModalMessage(response.message || 'Booking request submitted successfully! We will contact you soon.');
        setShowModal(true);
        // Reset form
        setFromLocation('');
        setToLocation('');
        setFromDate(null);
        setToDate(null);
        setVehicleType('');
        setPassengers('');
      } else {
        setError(response.message || 'Failed to submit booking request. Please try again.');
      }
      
    } catch (err) {
      setError(err?.detail || 'Failed to submit booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  return (
    <div className="card max-w-4xl mx-auto mt-8 relative">
      <h2 className="text-xl font-semibold mb-6 text-primary-700">Book Your Trip</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">{error}</div>}

      {/* Login Overlay - Only show if user is not logged in */}
      {!user && (
        <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded-lg z-10">
          <div className="text-center p-8">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Login Required</h3>
            <p className="text-gray-600 mb-6">Please login to make booking requests.</p>
            <button
              onClick={onShowLogin}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Login to Continue
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`${!user ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-1 font-medium">From Location *</label>
            <input
              type="text"
              className="input-field"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              placeholder="Enter starting location"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">To Location *</label>
            <input
              type="text"
              className="input-field"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              placeholder="Enter destination"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">From Date *</label>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              className="input-field"
              placeholderText="Select start date"
              minDate={new Date()}
              dateFormat="MM/dd/yyyy"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">To Date *</label>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              className="input-field"
              placeholderText="Select end date"
              minDate={fromDate || new Date()}
              dateFormat="MM/dd/yyyy"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Vehicle Type</label>
            <select
              className="input-field"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              {vehicleTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Passengers</label>
            <input
              type="number"
              className="input-field"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              placeholder="Number of passengers"
              min="1"
              max="20"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading || !user}
            className="btn-primary text-lg px-8 py-3"
          >
            {loading ? 'Submitting...' : 'Book Vehicle'}
          </button>
        </div>
      </form>

      {showModal && (
        <ConfirmationModal
          message={modalMessage}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default BookingForm;
