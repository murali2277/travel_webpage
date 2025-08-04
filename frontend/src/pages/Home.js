import React, { useState } from 'react';
import BookingForm from '../components/BookingForm';
import SearchResults from '../components/SearchResults';
import PackageCatalog from '../components/PackageCatalog';
import BookingConfirmation from '../components/BookingConfirmation';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPackageCatalog, setShowPackageCatalog] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const navigate = useNavigate();

  const handleSearchResults = (data) => {
    setSearchResults(data.vehicles);
    setSearchCriteria(data.search_criteria);
    setShowPackageCatalog(true);
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowPackageCatalog(false);
  };

  const handleBookNow = (vehicle) => {
    // Prepare booking data
    const bookingData = {
      customerName: 'Guest User', // You can get this from user context
      customerEmail: 'guest@example.com',
      customerPhone: '+91 98765 43210',
      fromLocation: searchCriteria.from_location,
      toLocation: searchCriteria.to_location,
      startDate: searchCriteria.from_date,
      endDate: searchCriteria.to_date,
      passengers: searchCriteria.passengers || 1,
      vehicleName: vehicle.name,
      vehicleType: vehicle.vehicle_type_display,
      capacity: vehicle.capacity_display,
      pricePerDay: vehicle.price_per_day,
      packageName: selectedPackage ? selectedPackage.name : 'Custom Trip',
      packagePrice: selectedPackage ? selectedPackage.price : 0,
      totalCost: selectedPackage ? selectedPackage.price : vehicle.price_per_day
    };

    setBookingData(bookingData);
    setShowBookingConfirmation(true);
  };

  const handleCloseBookingConfirmation = () => {
    setShowBookingConfirmation(false);
    setBookingData(null);
    setSelectedPackage(null);
    setSearchResults(null);
    setSearchCriteria(null);
  };

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Book Your Perfect Trip
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Choose from our premium vehicles and travel packages
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowPackageCatalog(true)}
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Packages
            </button>
            <button
              onClick={() => document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div id="booking-form">
        <BookingForm onSearchResults={handleSearchResults} />
      </div>

      {/* Package Catalog */}
      {showPackageCatalog && !selectedPackage && (
        <div className="mt-8">
          <PackageCatalog onSelectPackage={handleSelectPackage} />
        </div>
      )}

      {/* Search Results */}
      {searchResults && selectedPackage && (
        <div className="mt-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Available Vehicles for {selectedPackage.name}
            </h3>
            <p className="text-gray-600">
              Package Price: ₹{selectedPackage.price.toLocaleString()} | Max Distance: {selectedPackage.maxDistance}
            </p>
          </div>
          <SearchResults vehicles={searchResults} onBookNow={handleBookNow} />
        </div>
      )}

      {/* Booking Confirmation Modal */}
      {showBookingConfirmation && bookingData && (
        <BookingConfirmation 
          bookingData={bookingData}
          onClose={handleCloseBookingConfirmation}
        />
      )}
    </div>
  );
};

export default Home;