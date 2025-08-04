import React from 'react';

const SearchResults = ({ vehicles, onBookNow }) => {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="card max-w-2xl mx-auto mt-8 text-center">
        <div className="p-8">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or dates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Available Vehicles</h3>
        <p className="text-gray-600">Found {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} matching your criteria</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Vehicle Image */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={vehicle.image_url || '/default-car.png'}
                alt={vehicle.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/default-car.png';
                }}
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3">
                <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {vehicle.capacity_display}
                </span>
              </div>
              
              <div className="absolute top-3 right-3">
                <span className="bg-secondary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {vehicle.package_type_display}
                </span>
              </div>
              
              {/* Vehicle Type Badge */}
              <div className="absolute bottom-3 left-3">
                <span className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                  {vehicle.vehicle_type_display}
                </span>
              </div>
            </div>
            
            {/* Vehicle Details */}
            <div className="p-6">
              {/* Vehicle Name and Type */}
              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{vehicle.name}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">🚗</span>
                  {vehicle.vehicle_type_display} • {vehicle.capacity_display}
                </div>
              </div>
              
              {/* Package Details */}
              {vehicle.package_details && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">Package Details:</div>
                  <div className="text-sm text-gray-600 line-clamp-3">{vehicle.package_details}</div>
                </div>
              )}
              
              {/* Description */}
              {vehicle.description && (
                <div className="mb-4 text-sm text-gray-600 line-clamp-2">
                  {vehicle.description}
                </div>
              )}
              
              {/* Price */}
              <div className="mb-4">
                <div className="text-2xl font-bold text-primary-600">
                  ${vehicle.price_per_day}
                  <span className="text-sm font-normal text-gray-500 ml-1">/ day</span>
                </div>
                <div className="text-xs text-gray-500">
                  Total for your trip will be calculated based on selected dates
                </div>
              </div>
              
              {/* Features */}
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {vehicle.capacity_display} Capacity
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {vehicle.package_type_display}
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                  Available
                </span>
              </div>
              
              {/* Book Button */}
              <button
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                onClick={() => onBookNow(vehicle)}
              >
                <span className="mr-2">🚀</span>
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;