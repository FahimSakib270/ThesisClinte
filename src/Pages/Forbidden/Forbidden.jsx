// src/Pages/Forbidden/Forbidden.jsx
import React from "react";
import { useNavigate } from "react-router";
import { FiShield, FiHome, FiArrowLeft } from "react-icons/fi";

const Forbidden = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleGoHome = () => {
    navigate("/"); // Go to homepage
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Shield Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-5 rounded-full">
            <FiShield className="w-16 h-16 text-red-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Access Denied
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-8">
          Sorry, you don't have permission to view this page. Please contact
          your administrator if you believe this is an error.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleGoBack}
            className="btn btn-outline btn-primary flex items-center justify-center gap-2"
          >
            <FiArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="btn btn-primary flex items-center justify-center gap-2"
          >
            <FiHome className="w-5 h-5" />
            Return Home
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-10 text-sm text-gray-500">
          <p>Error Code: 403 Forbidden</p>
          <p className="mt-2">Need help? Contact support@profast.com</p>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
