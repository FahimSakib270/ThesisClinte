// PrivateRoute.jsx
import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router"; // Correct for react-router

const PrivateRoute = ({ children }) => {
  const { loading, user } = useAuth();
  console.log(user);

  const location = useLocation();

  if (loading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  if (user) {
    return children;
  }

  console.log(
    "PrivateRoute - No user found after loading finished, redirecting to login. Intended destination:",
    location.pathname
  );
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default PrivateRoute;
