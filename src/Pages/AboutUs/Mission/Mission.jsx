// src/Pages/AboutUs/Mission/Mission.jsx
import React from "react";

const Mission = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
      <p className="text-gray-700">
        Our mission is to provide the fastest, most reliable, and transparent
        parcel delivery service in Bangladesh. We strive to connect people and
        businesses seamlessly through our efficient logistics network.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Speed</h3>
          <p className="text-gray-700 mt-2">
            Deliver parcels faster than anyone else in the market.
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Reliability</h3>
          <p className="text-gray-700 mt-2">
            Ensure every parcel reaches its destination safely and on time.
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">
            Transparency
          </h3>
          <p className="text-gray-700 mt-2">
            Provide real-time tracking and clear communication at every step.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mission;
