import React from "react";
import { Outlet } from "react-router";
import authImage from "../assets/AuthImage/authImage.png";
import ProFastLogo from "../Pages/shared/proFastLogo/proFastLogo";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header Logo */}
        <div className="p-6  border-gray-200">
          <ProFastLogo />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row-reverse">
          {/* Image Section - Hidden on small screens */}
          <div className=" lg:w-1/2 items-center justify-center bg-[#FAFDF0] p-8">
            <img
              src={authImage}
              alt="Authentication Illustration"
              className="max-w-xs sm:max-w-sm md:max-w-md object-contain"
            />
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10">
            <div className="max-w-md mx-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
