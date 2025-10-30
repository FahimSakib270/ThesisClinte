// DashBoardLayout.jsx
import React from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router";
import ProfastLogo from "../Pages/Shared/ProFastLogo/ProfastLogo";
import useUserRole from "../hooks/useUserRole"; // Adjust path as needed

// Import all necessary icons
import {
  FiPackage,
  FiMenu,
  FiCreditCard,
  FiHome,
  FiTruck,
  FiUsers,
  FiClock,
  FiShield,
  FiUserPlus,
  FiMapPin,
  FiCheckCircle,
  FiTruck as FiRiderTruck,
} from "react-icons/fi";

const DashBoardLayout = () => {
  const location = useLocation();
  const { isAdmin, isRoleLoading, role } = useUserRole(); // Get isAdmin status and general role

  // // If the current path is just /dashboard, redirect to myParcels
  // if (location.pathname === "/dashboard") {
  //   return <Navigate to="/dashboard/myParcels" replace />;
  // }

  // Define base navigation items (always visible to authenticated users)
  const baseNavItems = [
    {
      path: "/",
      label: "Home",
      icon: <FiHome className="w-5 h-5" />,
    },
    {
      path: "/dashboard/myParcels",
      label: "My Parcels",
      icon: <FiPackage className="w-5 h-5" />,
    },
    {
      path: "/dashboard/history",
      label: "Payment History",
      icon: <FiCreditCard className="w-5 h-5" />,
    },
    {
      path: "/dashboard/track",
      label: "Track Parcel",
      icon: <FiTruck className="w-5 h-5" />,
    },
  ];

  // Define admin-specific navigation items
  const adminNavItems = [
    {
      path: "/dashboard/riders/active",
      label: "Active Riders",
      icon: <FiUsers className="w-5 h-5" />,
    },
    {
      path: "/dashboard/riders/pending",
      label: "Pending Riders",
      icon: <FiClock className="w-5 h-5" />,
    },
    {
      path: "/dashboard/assign-rider",
      label: "Assign Rider",
      icon: <FiUserPlus className="w-5 h-5" />,
    },
    {
      path: "/dashboard/manage-admin",
      label: "Manage Admins",
      icon: <FiShield className="w-5 h-5" />,
    },
  ];

  // Define rider-specific navigation items
  const riderNavItems = [
    {
      path: "/dashboard/pending-deliveries",
      label: "Pending Deliveries",
      icon: <FiMapPin className="w-5 h-5" />,
    },
    {
      path: "/dashboard/completed-deliveries",
      label: "Completed Deliveries",
      icon: <FiCheckCircle className="w-5 h-5" />,
    },
    {
      path: "/dashboard/my-earnings",
      label: "My Earnings",
      icon: <FiRiderTruck className="w-5 h-5" />,
    },
  ];

  // Combine navigation items based on user role
  let navItems = [...baseNavItems]; // Start with base items

  if (isAdmin) {
    // If user is admin, add admin items
    navItems = [...navItems, ...adminNavItems];
  } else if (role === "rider") {
    // If user is a rider (but not admin), add rider items
    navItems = [...navItems, ...riderNavItems];
  }
  // If user is a regular user, they only see base items

  // Show loading state while checking role
  if (isRoleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open">
      {/* Drawer Toggle Checkbox */}
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col min-h-screen bg-gray-50">
        {/* Top Navbar */}
        <header className="navbar bg-white border-b border-gray-200 shadow-sm px-4 md:px-6">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost text-gray-700"
            >
              <FiMenu className="h-6 w-6" />
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">
            <h1 className="text-xl font-bold text-gray-800 text-center">
              Dashboard
            </h1>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-full mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar (Drawer Side) */}
      <div className="drawer-side z-10">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay lg:hidden"
        ></label>
        <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
          {/* Logo/Header */}
          <div className="mb-8 flex items-center gap-2">
            <ProfastLogo />
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-[#CAEB66] text-gray-900"
                    : "hover:bg-[#CAEB66] hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default DashBoardLayout;
