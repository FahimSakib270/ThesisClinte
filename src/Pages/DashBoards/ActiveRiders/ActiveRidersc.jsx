import React, { useState, useEffect, useMemo } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // Adjust path as needed
import Swal from "sweetalert2";

const ActiveRider = () => {
  const [activeRiders, setActiveRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const axiosSecure = useAxiosSecure();

  // Fetch active riders
  useEffect(() => {
    const fetchActiveRiders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosSecure.get("/api/riders/active");
        setActiveRiders(response.data);
      } catch (err) {
        console.error("Error fetching active riders:", err);
        setError("Failed to load active riders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveRiders();
  }, [axiosSecure]);

  // Filter riders based on search term (case-insensitive search on name)
  const filteredRiders = useMemo(() => {
    if (!searchTerm) {
      return activeRiders; // Return all riders if no search term
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return activeRiders.filter(
      (rider) =>
        rider.name?.toLowerCase().includes(lowercasedSearchTerm) ||
        rider.email?.toLowerCase().includes(lowercasedSearchTerm) // Search by email too
    );
  }, [activeRiders, searchTerm]);

  // Open modal with selected rider details
  const openModal = (rider) => {
    setSelectedRider(rider);
    setIsModalOpen(true);
  };

  // Close modal and clear selected rider
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRider(null);
  };

  // Function to deactivate a rider
  const handleDeactivate = async (rider) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to deactivate ${rider.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Red for deactivate
      cancelButtonColor: "#3085d6", // Blue for cancel
      confirmButtonText: "Yes, Deactivate!",
    });

    if (result.isConfirmed) {
      try {
        // Make API call to update rider status to 'inactive'
        await axiosSecure.patch(`/api/riders/${rider._id}/status`, {
          status: "inactive", // Or whatever status represents deactivated
        });

        // Update local state to remove the rider from the list
        setActiveRiders((prevRiders) =>
          prevRiders.filter((r) => r._id !== rider._id)
        );

        Swal.fire(
          "Deactivated!",
          `${rider.name} has been deactivated.`,
          "success"
        );

        // Close modal if the deactivated rider was the one being viewed
        if (selectedRider && selectedRider._id === rider._id) {
          closeModal();
        }
      } catch (error) {
        console.error("Error deactivating rider:", error);
        Swal.fire("Error!", "Failed to deactivate rider.", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-[#CAEB66]"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
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
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Active Riders
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your active delivery personnel
            </p>
          </div>
          <div className="badge badge-success badge-lg">
            Total: {filteredRiders.length}{" "}
            {searchTerm && `(Filtered from ${activeRiders.length})`}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
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

        {filteredRiders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4"></div>{" "}
            {/* Placeholder icon */}
            <p className="text-gray-500 text-lg">
              {searchTerm
                ? `No active riders found matching "${searchTerm}".`
                : "No active riders found."}
            </p>
            {!searchTerm && (
              <p className="text-gray-400 mt-2">
                When riders are approved, they will appear here.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="table table-zebra w-full">
              {/* Table Header */}
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Warehouse
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approved On
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRiders.map((rider) => (
                  <tr
                    key={rider._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {rider.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {rider.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {rider.contact}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {rider.district}, {rider.region}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {rider.warehouse}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {rider.application_date
                        ? new Date(rider.application_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        <button
                          onClick={() => openModal(rider)}
                          className="btn btn-xs btn-ghost btn-circle text-blue-500 hover:text-blue-700 hover:bg-blue-50 tooltip"
                          data-tip="View Details"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeactivate(rider)}
                          className="btn btn-xs btn-ghost btn-circle text-orange-500 hover:text-orange-700 hover:bg-orange-50 tooltip"
                          data-tip="Deactivate"
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
                              d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rider Detail Modal */}
      {isModalOpen && selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Rider Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body - Scrollable Content */}
            <div className="overflow-y-auto flex-grow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{selectedRider.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-medium">{selectedRider.age} Years</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{selectedRider.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{selectedRider.contact}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">National ID (NID)</p>
                      <p className="font-medium">{selectedRider.nid}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Operational Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Assigned Region</p>
                      <p className="font-medium">{selectedRider.region}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Assigned District</p>
                      <p className="font-medium">{selectedRider.district}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Preferred Warehouse
                      </p>
                      <p className="font-medium">{selectedRider.warehouse}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Application Date</p>
                      <p className="font-medium">
                        {selectedRider.application_date
                          ? new Date(
                              selectedRider.application_date
                            ).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Status</p>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {selectedRider.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button onClick={closeModal} className="btn btn-ghost">
                Close
              </button>
              <button
                onClick={() => handleDeactivate(selectedRider)}
                className="btn btn-warning"
              >
                Deactivate Rider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRider;
