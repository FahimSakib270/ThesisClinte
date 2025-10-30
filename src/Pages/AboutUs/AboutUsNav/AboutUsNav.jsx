// src/Pages/AboutUs/AboutUsNav/AboutUsNav.jsx
import React from "react";
import { Link, useLocation } from "react-router";

const AboutUsNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/about/story", label: "Our Story" },
    { path: "/about/mission", label: "Our Mission" },
    { path: "/about/success", label: "Success Stories" },
    { path: "/about/team", label: "Team & Others" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`btn btn-sm ${
            location.pathname === item.path
              ? "bg-[#CAEB66] text-gray-900 border-[#CAEB66]"
              : "btn-outline border-[#CAEB66] text-[#CAEB66] hover:bg-[#CAEB66] hover:text-gray-900"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default AboutUsNav;
