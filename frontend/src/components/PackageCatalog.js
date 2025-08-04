import React from 'react';

const PackageCatalog = ({ onSelectPackage }) => {
  const packages = [
    {
      id: '1day',
      name: '1 Day Trip',
      price: 1500,
      description: 'Perfect for quick getaways and day trips. Includes fuel, driver, and basic amenities.',
      features: [
        'Up to 8 hours of travel',
        'Fuel included',
        'Professional driver',
        'Basic amenities',
        'Flexible pickup/drop'
      ],
      duration: '1 Day',
      maxDistance: '200 km',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: '3days',
      name: '3 Days Trip',
      price: 4500,
      description: 'Ideal for weekend trips and short vacations. Extended comfort with premium features.',
      features: [
        '3 days unlimited travel',
        'Fuel included',
        'Professional driver',
        'Premium amenities',
        'Hotel recommendations',
        '24/7 support'
      ],
      duration: '3 Days',
      maxDistance: '600 km',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: '5days',
      name: '5 Days Trip',
      price: 7500,
      description: 'Perfect for extended vacations and business trips. Luxury experience with full support.',
      features: [
        '5 days unlimited travel',
        'Fuel included',
        'Professional driver',
        'Luxury amenities',
        'Hotel bookings',
        '24/7 premium support',
        'Travel insurance'
      ],
      duration: '5 Days',
      maxDistance: '1000 km',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Travel Package</h2>
        <p className="text-gray-600 text-lg">Select the perfect package for your journey</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Package Image */}
            <div className={`relative h-48 bg-gradient-to-br ${pkg.gradient}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🚗</div>
                  <div className="text-lg font-semibold">{pkg.name}</div>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {pkg.duration}
                </span>
              </div>
            </div>
            
            {/* Package Details */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  ₹{pkg.price.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500 ml-1">/ package</span>
                </div>
                <p className="text-gray-600 text-sm">{pkg.description}</p>
              </div>
              
              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Package Includes:</h4>
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Distance Info */}
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Max Distance:</span>
                  <span className="font-semibold text-gray-800">{pkg.maxDistance}</span>
                </div>
              </div>
              
              {/* Select Button */}
              <button
                onClick={() => onSelectPackage(pkg)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <span className="mr-2">📦</span>
                Select {pkg.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageCatalog; 