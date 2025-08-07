import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">About MSK Travels</h2>
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          MSK Travels is your trusted partner for unforgettable travel experiences. We offer a wide range of vehicles and travel packages to suit every need, whether you're planning a family vacation, a business trip, or a weekend getaway.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Our mission is to make travel easy, comfortable, and affordable. With a fleet of well-maintained vehicles, experienced drivers, and a commitment to customer satisfaction, we ensure that your journey is safe and enjoyable.
        </p>
        <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 mb-6">
          <li>Wide selection of cars, SUVs, vans, and luxury vehicles</li>
          <li>Transparent pricing with no hidden fees</li>
          <li>24/7 customer support</li>
          <li>Easy online booking and secure payments</li>
        </ul>
        <p className="text-lg text-gray-700 leading-relaxed">
          Thank you for choosing MSK Travels. We look forward to serving you!
        </p>
      </div>
    </div>
  );
};

export default About;
