import React from "react";
import { Link, Outlet } from "react-router";
import ProfastLogo from "../Pages/Shared/ProFastLogo/ProfastLogo";

import { FiPackage, FiMenu } from "react-icons/fi";

const DashBoardLayout = () => {
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
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
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
            <Link
              to="/dashboard/myParcels"
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-emerald-600 hover:text-white"
            >
              <FiPackage className="w-5 h-5 text-emerald-400" />
              My Parcels
            </Link>
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default DashBoardLayout;
