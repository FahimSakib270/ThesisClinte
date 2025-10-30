import React from "react";
import { Link, NavLink } from "react-router";
import ProfastLogo from "../ProFastLogo/ProfastLogo";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user, Logout } = useAuth();

  const handleLogOut = async () => {
    try {
      await Logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-[#CAEB66] text-gray-900 rounded-lg px-3 py-2 font-semibold"
              : "rounded-lg px-3 py-2 hover:bg-[#CAEB66] hover:text-gray-900 font-semibold"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/sendParcel"
          className={({ isActive }) =>
            isActive
              ? "bg-[#CAEB66] text-gray-900 rounded-lg px-3 py-2 font-semibold"
              : "rounded-lg px-3 py-2 hover:bg-[#CAEB66] hover:text-gray-900 font-semibold"
          }
        >
          Send parcel
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/coverage"
          className={({ isActive }) =>
            isActive
              ? "bg-[#CAEB66] text-gray-900 rounded-lg px-3 py-2 font-semibold"
              : "rounded-lg px-3 py-2 hover:bg-[#CAEB66] hover:text-gray-900 font-semibold"
          }
        >
          Coverage
        </NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "bg-[#CAEB66] text-gray-900 rounded-lg px-3 py-2 font-semibold"
                  : "rounded-lg px-3 py-2 hover:bg-[#CAEB66] hover:text-gray-900 font-semibold"
              }
            >
              Dashboard
            </NavLink>
          </li>
        </>
      )}
      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "bg-[#CAEB66] text-gray-900 rounded-lg px-3 py-2 font-semibold"
              : "rounded-lg px-3 py-2 hover:bg-[#CAEB66] hover:text-gray-900 font-semibold"
          }
        >
          About Us
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/be_a_rider"
          className={({ isActive }) =>
            isActive
              ? "bg-[#CAEB66] text-gray-900 rounded-lg px-3 py-2 font-semibold"
              : "rounded-lg px-3 py-2 hover:bg-[#CAEB66] hover:text-gray-900 font-semibold"
          }
        >
          Be a Rider
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {navItems}
          </ul>
        </div>
        {/* Logo Container */}
        <div className="flex items-center">
          <ProfastLogo />
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>

      {/* User Profile Dropdown */}
      {user ? (
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User profile"
                  src={
                    user.photoURL ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[10] mt-3 w-64 p-4 shadow"
            >
              {/* User Info Section */}
              <li className="menu-title px-0 py-2">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img
                        src={
                          user.photoURL ||
                          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        }
                        alt="User Avatar"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {user.displayName || user.name || "User"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </li>
              <div className="divider mt-1 mb-2"></div>

              <li>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-gray-600">
                    {user.displayName || user.name || "N/A"}
                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                </div>
              </li>

              <div className="divider mt-1 mb-2"></div>
              <li>
                <a
                  onClick={handleLogOut}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="navbar-end">
          <Link className="bg-[#CAEB66] btn" to="/login">
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
