// src/Pages/Home/OurServices/ServiceCard.jsx
import React from "react";

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition duration-300 border border-gray-200 hover:bg-[#CAEB66]">
      <div className="card-body text-center items-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-black">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
