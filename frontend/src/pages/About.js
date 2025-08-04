import React from 'react';

const About = () => {
  return (
    <div className="max-w-3xl mx-auto card mt-10">
      <h2 className="text-2xl font-bold text-primary-700 mb-4">About MSK Travels</h2>
      <p className="mb-4">
        MSK Travels is your trusted partner for unforgettable travel experiences. We offer a wide range of vehicles and travel packages to suit every need, whether you're planning a family vacation, a business trip, or a weekend getaway.
      </p>
      <p className="mb-4">
        Our mission is to make travel easy, comfortable, and affordable. With a fleet of well-maintained vehicles, experienced drivers, and a commitment to customer satisfaction, we ensure that your journey is safe and enjoyable.
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Wide selection of cars, SUVs, vans, and luxury vehicles</li>
        <li>Transparent pricing with no hidden fees</li>
        <li>24/7 customer support</li>
        <li>Easy online booking and secure payments</li>
      </ul>
      <p>
        Thank you for choosing MSK Travels. We look forward to serving you!
      </p>
    </div>
  );
};

export default About;