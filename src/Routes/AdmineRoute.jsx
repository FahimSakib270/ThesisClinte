// src/Routes/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: isAdmin = false,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["isAdmin", user?.email],
    queryFn: async () => {
      if (!user?.email) {
        return false;
      }

      const response = await axiosSecure.get(`/api/admin/check/${user.email}`);
      return response.data.isAdmin;
    },
    enabled: !!user?.email && !loading,
  });

  // Show loading state while checking auth and admin status
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-[#CAEB66]"></span>
      </div>
    );
  }

  // If not authenticated or not admin, redirect to forbidden
  if (!user || !isAdmin || isError) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default AdminRoute;
