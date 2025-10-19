import React from "react";

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="card bg-base-100 hover:bg-[#CAEB66]  shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-200">
      <div className="card-body items-center text-center p-6">
        <div className="mb-4 text-primary">{icon}</div>
        <h3 className="card-title text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
