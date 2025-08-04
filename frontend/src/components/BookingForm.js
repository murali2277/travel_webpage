import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { searchVehicles } from '../services/api';

const BookingForm = ({ onSearchResults }) => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [vehicleType, setVehicleType] = useState('');
  const [passengers, setPassengers] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const searchData = {
        from_location: fromLocation,
        to_location: toLocation,
        from_date: fromDate.toISOString().split('T')[0],
        to_date: toDate.toISOString().split('T')[0],
      };

      // Add optional filters
      if (vehicleType) searchData.vehicle_type = vehicleType;
      if (passengers) searchData.passengers = parseInt(passengers);

      const data = await searchVehicles(searchData);
      onSearchResults(data);
    } catch (err) {
      setError(err?.detail || 'Failed to fetch vehicles.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card max-w-4xl mx-auto mt-8" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-6 text-primary-700">Book Your Trip</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">{error}</div>}
      
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
            onChange={setFromDate}
            selectsStart
            startDate={fromDate}
            endDate={toDate}
            minDate={new Date()}
            className="input-field"
            placeholderText="Select start date"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">To Date *</label>
          <DatePicker
            selected={toDate}
            onChange={setToDate}
            selectsEnd
            startDate={fromDate}
            endDate={toDate}
            minDate={fromDate || new Date()}
            className="input-field"
            placeholderText="Select end date"
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
            {vehicleTypes.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Number of Passengers</label>
          <input
            type="number"
            className="input-field"
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            placeholder="Enter number of passengers"
            min="1"
            max="20"
          />
        </div>
      </div>
      
      <button
        type="submit"
        className="btn-primary w-full"
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Book Vehicle'}
      </button>
    </form>
  );
};

export default BookingForm; 