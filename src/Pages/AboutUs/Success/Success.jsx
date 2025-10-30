// src/Pages/AboutUs/Success/Success.jsx
import React from "react";

const Success = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Success Stories</h2>
      <p className="text-gray-700">
        Over the years, we've helped countless individuals and businesses send
        their parcels with confidence. Here are some of our proudest moments:
      </p>

      <div className="mt-6 space-y-6">
        <div className="border-l-4 border-[#CAEB66] pl-4 py-2">
          <h3 className="text-lg font-semibold">10,000+ Parcels Delivered</h3>
          <p className="text-gray-600">
            We've successfully delivered over 10,000 parcels across Bangladesh
            with a 98% on-time delivery rate.
          </p>
        </div>

        <div className="border-l-4 border-[#CAEB66] pl-4 py-2">
          <h3 className="text-lg font-semibold">500+ Happy Riders</h3>
          <p className="text-gray-600">
            Our network of over 500 dedicated riders ensures fast and reliable
            delivery to every corner of the country.
          </p>
        </div>

        <div className="border-l-4 border-[#CAEB66] pl-4 py-2">
          <h3 className="text-lg font-semibold">
            Expansion Across 64 Districts
          </h3>
          <p className="text-gray-600">
            We've expanded our service to cover all 64 districts of Bangladesh,
            making nationwide delivery accessible to everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
