import React from "react";
import { Link, NavLink, useLocation } from "react-router";
import ProfastLogo from "../ProFastLogo/ProfastLogo";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user, Logout } = useAuth();
  const location = useLocation();

  const handleLogOut = () => {
    Logout();
  };

  const navItems = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-[#CAEB66] text-gray-900 rounded-lg px-3 py-2"
              : "rounded-lg px-3 py-2 hover:bg-[#CAEB66] hover:text-gray-900"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/services"
          className={({ isActive }) =>
            isActive
              ? "bg-[#CAEB66] text-gray-900 rounded-lg px-3 py-2"
              : "rounded-lg px-3 py-2 hover:bg-[#CAEB66] hover:text-gray-900"
          }
        >
          Services
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/sendParcel"
          className={({ isActive }) =>
            isActive
              ? "bg-[#CAEB66] text-gray-900 rounded-lg px-3 py-2"
              : "rounded-lg px-3 py-2 hover:bg-[#CAEB66] hover:text-gray-900"
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
              ? "bg-[#CAEB66] text-gray-900 rounded-lg px-3 py-2"
              : "rounded-lg px-3 py-2 hover:bg-[#CAEB66] hover:text-gray-900"
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
                  ? "bg-[#CAEB66] text-gray-900 rounded-lg px-3 py-2"
                  : "rounded-lg px-3 py-2 hover:bg-[#CAEB66] hover:text-gray-900"
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
              ? "bg-[#CAEB66] text-gray-900 rounded-lg px-3 py-2"
              : "rounded-lg px-3 py-2 hover:bg-[#CAEB66] hover:text-gray-900"
          }
        >
          About Us
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/pricing"
          className={({ isActive }) =>
            isActive
              ? "bg-[#CAEB66] text-gray-900 rounded-lg px-3 py-2"
              : "rounded-lg px-3 py-2 hover:bg-[#CAEB66] hover:text-gray-900"
          }
        >
          Pricing
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/be_a_rider"
          className={({ isActive }) =>
            isActive
              ? "bg-[#CAEB66] text-gray-900 rounded-lg px-3 py-2"
              : "rounded-lg px-3 py-2 hover:bg-[#CAEB66] hover:text-gray-900"
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
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navItems}
          </ul>
        </div>
        <button className="btn btn-ghost text-xl">
          <ProfastLogo></ProfastLogo>
        </button>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>
      {user ? (
        <>
          <div className="navbar-end">
            <a onClick={handleLogOut} className="btn bg-[#CAEB66]">
              Logout
            </a>
          </div>
        </>
      ) : (
        <>
          <div className="navbar-end">
            <Link className="bg-[#CAEB66] btn" to="/login">
              Login
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
