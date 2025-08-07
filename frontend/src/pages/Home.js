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
      <div className="relative bg-cover bg-center h-[500px] flex items-center justify-center text-white" style={{ backgroundImage: "url('https://source.unsplash.com/random/1600x900/?travel,car')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-down">
            Book Your Perfect Trip
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up">
            Choose from our premium vehicles and travel packages
          </p>
          <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105 animate-bounce-in">
            Explore Packages
          </button>
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
