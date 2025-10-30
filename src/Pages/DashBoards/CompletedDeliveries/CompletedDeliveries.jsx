// src/Pages/DashBoards/CompletedDeliveries/CompletedDeliveries.jsx
import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { FiDollarSign } from "react-icons/fi"; // Import dollar sign icon

const CompletedDeliveries = () => {
  // --- STATE MANAGEMENT ---
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [isCashoutLoading, setIsCashoutLoading] = useState(false); // State for cashout button

  // --- HOOKS ---
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // --- EFFECTS ---
  // Fetch completed deliveries assigned to the current rider
  useEffect(() => {
    const fetchCompletedDeliveries = async () => {
      // --- VALIDATION ---
      if (!user?.email) {
        console.warn("[FRONTEND] Rider email not available in useAuth context");
        setError("Rider email not available");
        setLoading(false);
        return;
      }

      try {
        // --- REQUEST SETUP ---
        setLoading(true);
        setError(null);
        console.log(
          `[FRONTEND] Fetching completed deliveries for rider email: ${user.email}`
        );

        const url = `/api/riders/me/completed-deliveries?email=${encodeURIComponent(
          user.email
        )}`;
        console.log(`[FRONTEND] Making request to: ${url}`);

        // --- API CALL ---
        const response = await axiosSecure.get(url);

        // --- EARNING CALCULATION ---
        const deliveriesWithEarnings = response.data.map((delivery) => {
          // --- CRITICAL: ADJUST THIS LOGIC BASED ON YOUR ACTUAL DATABASE STRUCTURE ---
          // Assumption: Rider's district is the same as the sender's district
          // This might not be accurate for all cases.
          // Improvement: Fetch rider's actual district from user profile or separate API call
          const riderDistrict = delivery.senderDistrict; // <-- ASSUMPTION
          const isSameDistrict = delivery.receiverDistrict === riderDistrict;

          // Calculate earning percentage
          const earningPercentage = isSameDistrict ? 0.3 : 0.6; // 30% for same district, 60% for different

          // Calculate earning amount
          const deliveryCost = parseFloat(delivery.deliveryCost) || 0;
          const earningAmount = deliveryCost * earningPercentage;

          return {
            ...delivery,
            earningAmount: earningAmount.toFixed(2), // Format to 2 decimal places
            earningPercentage: earningPercentage * 100, // Convert to percentage for display
            isSameDistrict: isSameDistrict,
          };
        });

        // Calculate total earnings
        const total = deliveriesWithEarnings.reduce((sum, delivery) => {
          return sum + parseFloat(delivery.earningAmount || 0);
        }, 0);

        setTotalEarnings(total);
        // --- END EARNING CALCULATION ---

        // --- RESPONSE HANDLING ---
        console.log("[FRONTEND] Raw response:", response);
        console.log("[FRONTEND] Response data:", response.data);
        setCompletedDeliveries(deliveriesWithEarnings);
      } catch (err) {
        // --- ERROR HANDLING ---
        console.error("[FRONTEND] Error fetching completed deliveries:", err);
        console.error("[FRONTEND] Error response:", err.response);
        console.error("[FRONTEND] Error request:", err.request);
        setError("Failed to load completed deliveries. Please try again.");
      } finally {
        // --- CLEANUP ---
        setLoading(false);
      }
    };

    fetchCompletedDeliveries();
  }, [axiosSecure, user?.email]);

  // --- CASH OUT FUNCTION ---
  const handleCashOut = async () => {
    if (totalEarnings <= 0) {
      Swal.fire(
        "No Earnings",
        "You don't have any earnings to cash out.",
        "info"
      );
      return;
    }

    const result = await Swal.fire({
      title: "Cash Out Earnings?",
      text: `Are you sure you want to request a cashout of $${totalEarnings.toFixed(
        2
      )}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981", // Green
      cancelButtonColor: "#6B7280", // Gray
      confirmButtonText: "Yes, Cash Out!",
    });

    if (result.isConfirmed) {
      setIsCashoutLoading(true);
      try {
        // Call API to record cashout request
        const response = await axiosSecure.post("/api/earnings/cashout", {
          riderEmail: user.email,
          amount: totalEarnings.toFixed(2),
        });

        if (response.status === 201) {
          Swal.fire(
            "Requested!",
            "Your cashout request has been submitted.",
            "success"
          );
          // Optionally, refetch earnings or update UI
        } else {
          throw new Error(
            response.data?.message || "Failed to submit cashout request"
          );
        }
      } catch (error) {
        console.error("Error submitting cashout request:", error);
        Swal.fire(
          "Error!",
          `Failed to submit cashout request: ${
            error.response?.data?.message || error.message
          }`,
          "error"
        );
      } finally {
        setIsCashoutLoading(false);
      }
    }
  };
  // --- END CASH OUT FUNCTION ---

  // --- RENDERING ---
  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-[#CAEB66]"></span>
      </div>
    );
  }

  // Error State
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

  // Main Render
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Completed Deliveries
            </h1>
            <p className="text-gray-600 mt-1">
              View your successfully delivered parcels
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="badge badge-lg badge-success">
              Total Deliveries: {completedDeliveries.length}
            </div>
            {/* Total Earnings Display */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Total Earnings:
              </span>
              <span className="text-lg font-bold text-green-600">
                ${totalEarnings.toFixed(2)}
              </span>
              {/* Cash Out Button */}
              <button
                onClick={handleCashOut}
                disabled={isCashoutLoading || totalEarnings <= 0}
                className={`btn btn-sm btn-success flex items-center gap-1 ${
                  isCashoutLoading || totalEarnings <= 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isCashoutLoading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <FiDollarSign className="w-4 h-4" />
                )}
                Cash Out
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {completedDeliveries.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">
              No completed deliveries found.
            </p>
            <p className="text-gray-400 mt-2">
              Successfully delivered parcels will appear here.
            </p>
          </div>
        ) : (
          /* Data Table */
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
                    Delivered On
                  </th>
                  {/* New Columns for Earnings */}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earning %
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earning Amount
                  </th>
                  {/* End New Columns */}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {completedDeliveries.map((delivery) => (
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
                      {delivery.last_updated
                        ? new Date(delivery.last_updated).toLocaleDateString()
                        : "N/A"}
                    </td>
                    {/* New Cells for Earnings */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`badge ${
                          delivery.isSameDistrict
                            ? "badge-info"
                            : "badge-warning"
                        }`}
                      >
                        {delivery.earningPercentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                      ${delivery.earningAmount}
                    </td>
                    {/* End New Cells */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <span className="badge badge-success gap-2">
                        {delivery.delivery_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedDeliveries;
