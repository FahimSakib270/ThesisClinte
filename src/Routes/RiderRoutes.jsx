import React from "react";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import { useLocation } from "react-router";

const RiderRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isRoleLoading } = useUserRole();
  const location = useLocation();
  if (loading || isRoleLoading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }
  if (!user || role !== "rider") {
    return (
      <Navigate to="/forbidden" state={{ from: location.pathname }} replace />
    );
  }
  return children;
};

export default RiderRoutes;
