// src/hooks/useUserRole.js
import { useEffect, useState } from "react";

import useAxiosSecure from "./useAxiosSecure"; // Adjust the relative path if needed
import useAuth from "./useAuth";

/**
 * Custom hook to fetch the role of the currently authenticated user.
 *
 * @returns {{
 *   role: string | null, // The user's role ('user', 'admin', 'rider', etc.) or null if unknown/error
 *   isAdmin: boolean,     // True if the user's role is 'admin', false otherwise
 *   isRoleLoading: boolean, // True while the role is being fetched
 *   isRoleError: boolean,   // True if there was an error fetching the role
 *   refetchRole: () => void // Function to manually trigger a refetch
 * }}
 */
const useUserRole = () => {
  const { user } = useAuth(); // Get the current user object (should contain email)
  const axiosSecure = useAxiosSecure(); // Get the secure axios instance
  const [role, setRole] = useState(null); // State to store the fetched role
  const [isAdmin, setIsAdmin] = useState(false); // State to store if the user is admin
  const [isRoleLoading, setIsRoleLoading] = useState(true); // Loading state
  const [isRoleError, setIsRoleError] = useState(false); // Error state

  /**
   * Function to fetch the user's role from the backend.
   */
  const fetchUserRole = async () => {
    // Reset states before fetching
    setIsRoleLoading(true);
    setIsRoleError(false);

    // Check if user object and email are available
    if (!user || !user.email) {
      console.warn("No user or email found in useAuth context.");
      setRole(null);
      setIsAdmin(false);
      setIsRoleLoading(false);
      return;
    }

    try {
      console.log(`Fetching role for user: ${user.email}`);
      // Make the API request to check the user's role
      // Replace with your actual API endpoint
      const response = await axiosSecure.get(`/api/admin/check/${user.email}`);

      // Assuming the API returns { isAdmin: boolean, role: string, ... }
      const { isAdmin: apiIsAdmin, role: apiRole } = response.data;

      setRole(apiRole || "user"); // Default to 'user' if role is missing in response
      setIsAdmin(apiIsAdmin === true); // Explicitly check for boolean true
    } catch (error) {
      console.error("Error fetching user role:", error);
      // Set states appropriately on error
      setRole(null);
      setIsAdmin(false);
      setIsRoleError(true);
    } finally {
      // Always stop loading when the request finishes (success or error)
      setIsRoleLoading(false);
    }
  };

  /**
   * Effect to fetch the user role when the component mounts or the user changes.
   * It also sets up a cleanup function to reset states if needed.
   */
  useEffect(() => {
    fetchUserRole();

    // Optional: Cleanup function (mostly for resetting states if the hook unmounts quickly)
    // This is often not strictly necessary for simple state setters, but good practice.
    return () => {
      // Note: Setting state on unmounted components is usually harmless in modern React,
      // but you can reset flags here if needed for complex logic.
      // setIsRoleLoading(false);
      // setIsRoleError(false);
    };
  }, [user?.email, axiosSecure]); // Re-fetch if user email or axios instance changes

  return {
    role,
    isAdmin,
    isRoleLoading,
    isRoleError,
    refetchRole: fetchUserRole, // Expose the fetch function for manual refetching
  };
};

export default useUserRole;
