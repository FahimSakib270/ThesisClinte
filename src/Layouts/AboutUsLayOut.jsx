// src/Layouts/AboutUsLayout/AboutUsLayout.jsx
import React from "react";
import { Outlet } from "react-router";
import AboutUsNav from "../Pages/AboutUs/AboutUsNav/AboutUsNav";

const AboutUsLayout = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              About Us
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Enjoy fast, reliable parcel delivery with real-time tracking and
              zero hassle. From personal packages to business shipments — we
              deliver on time, every time.
            </p>
          </div>

          {/* Navigation */}
          <AboutUsNav />

          {/* Content Outlet */}
          <div className="mt-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsLayout;
