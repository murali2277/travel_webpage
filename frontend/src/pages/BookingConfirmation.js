import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../services/api';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [criteria, setCriteria] = useState(null);
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const selectedVehicle = sessionStorage.getItem('selectedVehicle');
    const searchCriteria = sessionStorage.getItem('searchCriteria');
    if (selectedVehicle && searchCriteria) {
      setVehicle(JSON.parse(selectedVehicle));
      setCriteria(JSON.parse(searchCriteria));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const bookingData = {
        ...form,
        from_location: criteria.from_location,
        to_location: criteria.to_location,
        start_date: criteria.from_date,
        end_date: criteria.to_date,
        vehicle: vehicle.id,
      };
      const data = await createBooking(bookingData);
      setSuccess(true);
      setBookingDetails(data);
      sessionStorage.removeItem('selectedVehicle');
      sessionStorage.removeItem('searchCriteria');
    } catch (err) {
      setError(err?.detail || 'Failed to create booking.');
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle || !criteria) return null;

  if (success && bookingDetails) {
    return (
      <div className="card max-w-xl mx-auto mt-10 text-center">
        <h2 className="text-2xl font-bold text-primary-700 mb-4">Booking Confirmed!</h2>
        <p className="mb-4">Thank you for booking with MSK Travels. Your booking details:</p>
        <div className="mb-4">
          <div className="font-semibold">Vehicle:</div>
          <div>{bookingDetails.vehicle_details.name} ({bookingDetails.vehicle_details.vehicle_type_display})</div>
          <div>From: {bookingDetails.from_location}</div>
          <div>To: {bookingDetails.to_location}</div>
          <div>Dates: {bookingDetails.start_date} to {bookingDetails.end_date}</div>
          <div>Total Price: <span className="font-bold text-primary-700">${bookingDetails.total_price}</span></div>
        </div>
        <div className="mb-2">A confirmation email will be sent to <span className="font-semibold">{bookingDetails.customer_email}</span>.</div>
        <button className="btn-primary mt-4" onClick={() => navigate('/')}>Book Another Trip</button>
      </div>
    );
  }

  return (
    <div className="card max-w-xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4 text-primary-700">Confirm Your Booking</h2>
      <div className="mb-4">
        <div className="font-semibold">Vehicle:</div>
        <div>{vehicle.name} ({vehicle.vehicle_type_display})</div>
        <div>From: {criteria.from_location}</div>
        <div>To: {criteria.to_location}</div>
        <div>Dates: {criteria.from_date} to {criteria.to_date}</div>
        <div>Price per day: <span className="font-bold text-primary-700">${vehicle.price_per_day}</span></div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Your Name</label>
          <input
            type="text"
            name="customer_name"
            className="input-field"
            value={form.customer_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="customer_email"
            className="input-field"
            value={form.customer_email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="tel"
            name="customer_phone"
            className="input-field"
            value={form.customer_phone}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingConfirmation;