import React, { useState } from 'react';
import BookingForm from '../components/BookingForm';
import SearchResults from '../components/SearchResults';
import PackageCatalog from '../components/PackageCatalog';
import BookingConfirmation from '../components/BookingConfirmation';

const Home = ({ user, onShowLogin }) => {
  const [searchResults, setSearchResults] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const handleSearchResults = (data) => {
    // Check if user is logged in before allowing search
    if (!user) {
      alert('Please login to search for vehicles and make bookings.');
      onShowLogin();
      return;
    }

    setSearchResults(data.vehicles);
    setSearchCriteria(data.search_criteria);
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleBookNow = (vehicle) => {
    // Check if user is logged in before booking
    if (!user) {
      alert('Please login to make a booking.');
      onShowLogin();
      return;
    }

    // Prepare booking data
    const bookingData = {
      customerName: user.first_name ? `${user.first_name} ${user.last_name}` : user.username,
      customerEmail: user.email,
      customerPhone: user.phone || '+91 98765 43210',
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
        </div>
      </div>

      {/* Booking Form - At the Top */}
      <div className="mt-8">
        <BookingForm onSearchResults={handleSearchResults} user={user} onShowLogin={onShowLogin} />
      </div>

      {/* Search Results - If Available */}
      {searchResults && (
        <div className="mt-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Available Vehicles
            </h3>
            <p className="text-gray-600">
              Select a vehicle to proceed with booking
            </p>
          </div>
          <SearchResults vehicles={searchResults} onBookNow={handleBookNow} />
        </div>
      )}

      {/* Package Catalog - Below Booking Form */}
      <div className="mt-12">
        <PackageCatalog onSelectPackage={handleSelectPackage} />
      </div>

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