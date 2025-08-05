import React, { useState } from 'react';
import BookingForm from '../components/BookingForm';
import PackageCatalog from '../components/PackageCatalog';

const Home = ({ user, onShowLogin }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
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
        <BookingForm user={user} onShowLogin={onShowLogin} />
      </div>

      {/* Package Catalog - Below Booking Form */}
      <div className="mt-12">
        <PackageCatalog onSelectPackage={handleSelectPackage} />
      </div>
    </div>
  );
};

export default Home;