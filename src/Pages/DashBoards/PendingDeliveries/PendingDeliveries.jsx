// src/Pages/DashBoards/RiderDeliveries/RiderDeliveries.jsx (Renamed from PendingDeliveries)
import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // Adjust path as needed
import useAuth from "../../../hooks/useAuth"; // Adjust path as needed
import Swal from "sweetalert2";
import { FiTruck, FiCheckCircle } from "react-icons/fi"; // Import icons for actions

const RiderDeliveries = () => {
  // Renamed component
  const [deliveries, setDeliveries] = useState([]); // Renamed state variable
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth(); // Get current user (rider)

  // Fetch deliveries assigned to the current rider (both 'assigned' and 'in_transit')
  useEffect(() => {
    const fetchDeliveries = async () => {
      // Renamed function
      if (!user?.email) {
        console.warn("Rider email not available in useAuth context");
        setError("Rider email not available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log(
          `Fetching assigned/in-transit deliveries for rider email: ${user.email}`
        );

        // Fetch deliveries for the current rider with status 'assigned' or 'in_transit'
        // Pass rider's email as a query parameter
        // NOTE: You'll need to update your backend endpoint to handle this new query
        const response = await axiosSecure.get(
          `/api/riders/me/deliveries?email=${encodeURIComponent(
            user.email
          )}&status=assigned,in_transit` // Pass status filter
        );

        console.log("Received deliveries response:", response.data);
        setDeliveries(response.data); // Update state with deliveries
      } catch (err) {
        console.error("Error fetching deliveries:", err); // Updated log message
        setError("Failed to load deliveries. Please try again."); // Updated error message
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries(); // Call renamed function
  }, [axiosSecure, user?.email]);

  // Handle marking a delivery as "In Transit" (picked up)
  const handleMarkAsInTransit = async (parcelId, trackingId) => {
    // Renamed function
    const result = await Swal.fire({
      title: "Mark as In Transit?",
      text: `Mark delivery ${trackingId} as picked up and in transit?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981", // Green
      cancelButtonColor: "#6B7280", // Gray
      confirmButtonText: "Yes, Start Delivery!", // Updated button text
    });

    if (result.isConfirmed) {
      try {
        // Call API to update parcel status to 'in_transit'
        const response = await axiosSecure.patch(
          `/api/parcels/${parcelId}/status`,
          {
            status: "in_transit", // Update status to "in_transit"
          }
        );

        if (response.status === 200) {
          Swal.fire("In Transit!", "Delivery marked as in transit.", "success");

          // Optimistically update the UI
          setDeliveries(
            (
              prevDeliveries // Updated state variable
            ) =>
              prevDeliveries.map(
                (
                  delivery // Updated variable name
                ) =>
                  delivery._id === parcelId
                    ? { ...delivery, delivery_status: "in_transit" } // Update status locally
                    : delivery
              )
          );
        } else {
          throw new Error(
            response.data?.message || "Failed to update delivery status"
          );
        }
      } catch (error) {
        console.error("Error marking delivery as in transit:", error);
        Swal.fire(
          "Error!",
          `Failed to mark delivery as in transit: ${
            error.response?.data?.message || error.message
          }`,
          "error"
        );
      }
    }
  };

  // Handle marking a delivery as "Completed" (delivered)
  const handleMarkAsCompleted = async (parcelId, trackingId) => {
    // New function
    const result = await Swal.fire({
      title: "Mark as Completed?",
      text: `Mark delivery ${trackingId} as completed?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981", // Green
      cancelButtonColor: "#6B7280", // Gray
      confirmButtonText: "Yes, Complete!",
    });

    if (result.isConfirmed) {
      try {
        // Call API to update parcel status to 'delivered'
        const response = await axiosSecure.patch(
          `/api/parcels/${parcelId}/status`,
          {
            status: "delivered", // Update status to "delivered"
          }
        );

        if (response.status === 200) {
          Swal.fire("Completed!", "Delivery marked as completed.", "success");

          // Optimistically update the UI (remove from list)
          setDeliveries(
            (
              prevDeliveries // Updated state variable
            ) => prevDeliveries.filter((delivery) => delivery._id !== parcelId) // Remove completed delivery
          );
        } else {
          throw new Error(
            response.data?.message || "Failed to update delivery status"
          );
        }
      } catch (error) {
        console.error("Error marking delivery as completed:", error);
        Swal.fire(
          "Error!",
          `Failed to mark delivery as completed: ${
            error.response?.data?.message || error.message
          }`,
          "error"
        );
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            {/* Updated title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              My Deliveries
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your assigned and in-transit delivery tasks
            </p>
          </div>
          {/* Updated badge */}
          <div className="badge badge-lg badge-success">
            Total Deliveries: {deliveries.length}
          </div>
        </div>

        {/* Updated empty state message */}
        {deliveries.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">
              No deliveries assigned to you.
            </p>
            <p className="text-gray-400 mt-2">
              New assignments or in-transit deliveries will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="table table-zebra w-full">
              {/* Table Header */}
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sender
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receiver
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveries.map(
                  (
                    delivery // Updated variable name
                  ) => (
                    <tr
                      key={delivery._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {delivery.tracking_id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {delivery.parcelTitle || "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {delivery.senderName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {delivery.receiverName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        ${delivery.deliveryCost}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {delivery.receiverDistrict}, {delivery.receiverRegion}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`badge ${
                            delivery.delivery_status === "delivered"
                              ? "badge-success"
                              : delivery.delivery_status === "in_transit"
                              ? "badge-warning"
                              : delivery.delivery_status === "assigned"
                              ? "badge-info"
                              : delivery.delivery_status === "pending"
                              ? "badge-neutral"
                              : "badge-neutral"
                          }`}
                        >
                          {delivery.delivery_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        {/* Conditional rendering of action buttons based on status */}
                        {delivery.delivery_status === "assigned" ? (
                          <button
                            onClick={() =>
                              handleMarkAsInTransit(
                                delivery._id,
                                delivery.tracking_id
                              )
                            }
                            className="btn btn-sm btn-success flex items-center gap-2 mx-auto"
                          >
                            <FiTruck className="h-4 w-4" />
                            Mark as In Transit
                          </button>
                        ) : delivery.delivery_status === "in_transit" ? (
                          <button
                            onClick={() =>
                              handleMarkAsCompleted(
                                delivery._id,
                                delivery.tracking_id
                              )
                            }
                            className="btn btn-sm btn-success flex items-center gap-2 mx-auto"
                          >
                            <FiCheckCircle className="h-4 w-4" />
                            Mark as Completed
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No Action
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderDeliveries; // Updated export
