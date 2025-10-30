import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { FiDollarSign, FiCalendar, FiClock } from "react-icons/fi";

const MyEarnings = () => {
  const [cashoutHistory, setCashoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch cashout history for the current rider
  useEffect(() => {
    const fetchCashoutHistory = async () => {
      if (!user?.email) {
        setError("Rider email not available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching cashout history for rider: ${user.email}`);

        const response = await axiosSecure.get(
          `/api/earnings/history/${encodeURIComponent(user.email)}`
        );

        console.log("Cashout history response:", response.data);
        setCashoutHistory(response.data);

        // Calculate total earnings from ALL requests
        const total = response.data.reduce((sum, request) => {
          const amount = parseFloat(request.amount) || 0;
          return sum + amount;
        }, 0);

        setTotalEarnings(total);
        console.log("Calculated total earnings:", total);
      } catch (err) {
        console.error("Error fetching cashout history:", err);
        setError("Failed to load cashout history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCashoutHistory();
  }, [axiosSecure, user?.email]);

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
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              My Earnings
            </h1>
            <p className="text-gray-600 mt-1">
              View your cashout history and total earnings
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <FiDollarSign className="w-5 h-5 text-green-600" />
              <span className="text-lg font-bold text-green-600">
                ${totalEarnings.toFixed(2)}
              </span>
            </div>
            <div className="text-sm text-gray-500">Total Earnings</div>
          </div>
        </div>

        {/* Content Section */}
        {cashoutHistory.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">No cashout requests found.</p>
            <p className="text-gray-400 mt-2">
              Your cashout requests will appear here.
            </p>
          </div>
        ) : (
          /* Data Table */
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="table table-zebra w-full">
              {/* Table Header - REMOVED Parcel, Assigned Date, Delivered Date */}
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested At
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              {/* Table Body - REMOVED Parcel, Assigned Date, Delivered Date cells */}
              <tbody className="bg-white divide-y divide-gray-200">
                {cashoutHistory.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request._id.toString().substring(0, 8)}...
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                      ${parseFloat(request.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        {new Date(request.requested_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {request.status === "processed" ? (
                          <FiCheckCircle className="w-4 h-4 text-green-500" />
                        ) : request.status === "rejected" ? (
                          <FiXCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <FiClock className="w-4 h-4 text-yellow-500" />
                        )}
                        <span
                          className={`badge ${
                            request.status === "processed"
                              ? "badge-success"
                              : request.status === "rejected"
                              ? "badge-error"
                              : "badge-warning"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
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

export default MyEarnings;
