// src/Pages/Dashboard/Admin/ManageAdmins.jsx
import React, { useState, useEffect, useCallback } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // Adjust path as needed
import Swal from "sweetalert2";

const ManageAdmins = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [operationLoading, setOperationLoading] = useState({}); // Tracks loading per user
  const axiosSecure = useAxiosSecure();

  // Debounce function to limit API calls while typing
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Fetch users based on search term (debounced)
  const fetchUsers = useCallback(
    debounce(async (term) => {
      if (!term) {
        setSearchResults([]);
        return;
      }
      try {
        setLoading(true);
        setSearchError(null);
        const response = await axiosSecure.get(
          `/api/admin/users/search?q=${encodeURIComponent(term)}`
        );
        setSearchResults(response.data);
      } catch (err) {
        console.error("Error searching users:", err);
        setSearchError("Failed to search users. Please try again.");
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms delay
    [axiosSecure]
  );

  useEffect(() => {
    fetchUsers(searchTerm);
  }, [searchTerm, fetchUsers]);

  const handleMakeAdmin = async (userEmail) => {
    const result = await Swal.fire({
      title: "Make Admin?",
      text: `Are you sure you want to grant admin privileges to ${userEmail}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981", // Green
      cancelButtonColor: "#6B7280", // Gray
      confirmButtonText: "Yes, Make Admin!",
    });

    if (result.isConfirmed) {
      setOperationLoading((prev) => ({ ...prev, [userEmail]: true }));
      try {
        await axiosSecure.patch(`/api/admin/users/${userEmail}/role`, {
          role: "admin",
        });
        // Update local state optimistically
        setSearchResults((prevResults) =>
          prevResults.map((u) =>
            u.email === userEmail ? { ...u, role: "admin" } : u
          )
        );
        Swal.fire("Success!", `${userEmail} is now an admin.`, "success");
      } catch (error) {
        console.error("Error making admin:", error);
        Swal.fire("Error!", `Failed to make ${userEmail} an admin.`, "error");
      } finally {
        setOperationLoading((prev) => ({ ...prev, [userEmail]: false }));
      }
    }
  };

  const handleRemoveAdmin = async (userEmail) => {
    const result = await Swal.fire({
      title: "Remove Admin?",
      text: `Are you sure you want to revoke admin privileges from ${userEmail}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444", // Red
      cancelButtonColor: "#6B7280", // Gray
      confirmButtonText: "Yes, Remove Admin!",
    });

    if (result.isConfirmed) {
      setOperationLoading((prev) => ({ ...prev, [userEmail]: true }));
      try {
        await axiosSecure.patch(`/api/admin/users/${userEmail}/role`, {
          role: "user",
        });
        // Update local state optimistically
        setSearchResults((prevResults) =>
          prevResults.map((u) =>
            u.email === userEmail ? { ...u, role: "user" } : u
          )
        );
        Swal.fire("Revoked!", `${userEmail} is no longer an admin.`, "success");
      } catch (error) {
        console.error("Error removing admin:", error);
        Swal.fire(
          "Error!",
          `Failed to remove admin privileges from ${userEmail}.`,
          "error"
        );
      } finally {
        setOperationLoading((prev) => ({ ...prev, [userEmail]: false }));
      }
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Manage Administrators
          </h1>
          <p className="text-gray-600 mt-1">
            Search for users and grant or revoke admin privileges.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users by email or name..."
              className="input input-bordered w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Results Area */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <span className="loading loading-spinner loading-lg text-[#CAEB66]"></span>
            </div>
          ) : searchError ? (
            <div className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{searchError}</span>
            </div>
          ) : searchTerm && searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No users found matching "{searchTerm}".
              </p>
            </div>
          ) : searchTerm && searchResults.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Search Results
              </h2>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="table table-zebra w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {searchResults.map((user) => (
                      <tr
                        key={user.email}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {user.name || "N/A"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "rider"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role || "user"}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          {user.role === "admin" ? (
                            <button
                              onClick={() => handleRemoveAdmin(user.email)}
                              disabled={operationLoading[user.email]}
                              className={`btn btn-xs ${
                                operationLoading[user.email]
                                  ? "btn-disabled"
                                  : "btn-outline btn-warning"
                              }`}
                            >
                              {operationLoading[user.email] ? (
                                <>
                                  <span className="loading loading-spinner loading-xs"></span>
                                  Removing...
                                </>
                              ) : (
                                "Remove Admin"
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMakeAdmin(user.email)}
                              disabled={operationLoading[user.email]}
                              className={`btn btn-xs ${
                                operationLoading[user.email]
                                  ? "btn-disabled"
                                  : "btn-outline btn-success"
                              }`}
                            >
                              {operationLoading[user.email] ? (
                                <>
                                  <span className="loading loading-spinner loading-xs"></span>
                                  Making Admin...
                                </>
                              ) : (
                                "Make Admin"
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">
                Start typing to search for users.
              </p>
              <p className="text-gray-400 mt-2">
                Find users by email or name to manage their admin status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAdmins;
