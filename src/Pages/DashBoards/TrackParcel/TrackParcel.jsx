// src/Pages/DashBoards/TrackParcel/TrackParcel.jsx
import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import {
  FiSearch,
  FiPackage,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
} from "react-icons/fi";

const TrackParcel = () => {
  const [trackingId, setTrackingId] = useState("");
  const [parcelData, setParcelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch tracking info by ID
  const fetchTrackingInfo = async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosSecure.get(`/api/track/${id}`);
      if (response.data.message === "Parcel not found") {
        setError("Parcel not found. Please check the tracking ID.");
        setParcelData(null);
      } else {
        setParcelData(response.data.parcel);
        // trackingUpdates are no longer needed
      }
    } catch (err) {
      setError("Failed to fetch tracking information. Please try again.");
      console.error("Tracking error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setError("Please enter a tracking ID");
      return;
    }
    fetchTrackingInfo(trackingId.trim());
  };

  // Get status color for badges
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_transit":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Progress bar component based on delivery status
  const ProgressBar = ({ status }) => {
    const steps = [
      {
        id: "pending",
        label: "Pending",
        icon: <FiClock className="w-5 h-5" />,
      },
      {
        id: "in_transit",
        label: "In Transit",
        icon: <FiTruck className="w-5 h-5" />,
      },
      {
        id: "delivered",
        label: "Delivered",
        icon: <FiCheckCircle className="w-5 h-5" />,
      },
    ];

    const getCurrentStepIndex = () => {
      switch (status?.toLowerCase()) {
        case "pending":
          return 0;
        case "in_transit":
          return 1;
        case "delivered":
          return 2;
        default:
          return 0;
      }
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
      <div className="w-full">
        <div className="flex justify-between relative">
          {/* Progress line */}
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{
                width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
              }}
            ></div>
          </div>

          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                  index <= currentStepIndex
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.icon}
              </div>
              <span
                className={`text-xs font-medium ${
                  index <= currentStepIndex ? "text-green-600" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Track Your Parcel</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter tracking ID"
              className="flex-1 input input-bordered"
            />
            <button
              type="submit"
              className="btn bg-[#CAEB66] hover:bg-[#b8d85a]"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Track"
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-[#CAEB66]"></span>
          </div>
        )}

        {!loading && parcelData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Parcel Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiPackage className="w-5 h-5" />
                Parcel Information
              </h2>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Tracking ID</p>
                  <p className="font-medium">{parcelData.tracking_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Title</p>
                  <p className="font-medium">
                    {parcelData.parcelTitle || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sender</p>
                  <p className="font-medium">{parcelData.senderName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Receiver</p>
                  <p className="font-medium">{parcelData.receiverName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium">{parcelData.parcelWeight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cost</p>
                  <p className="font-medium">${parcelData.deliveryCost}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-medium">
                    {parcelData.receiverDistrict}, {parcelData.receiverRegion}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Delivery Progress */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiMapPin className="w-5 h-5" />
                Delivery Progress
              </h2>

              {/* Progress Bar - Just below the search bar on the right side */}
              <div className="mb-6">
                <ProgressBar status={parcelData.delivery_status} />
                <div className="mt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      parcelData.delivery_status
                    )}`}
                  >
                    Current Status: {parcelData.delivery_status}
                  </span>
                </div>
              </div>

              {/* Optional: Additional progress details */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-3">Progress Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order Placed</span>
                    <span className="font-medium">
                      {parcelData.creation_date
                        ? new Date(
                            parcelData.creation_date
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Updated</span>
                    <span className="font-medium">
                      {parcelData.last_updated
                        ? new Date(parcelData.last_updated).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estimated Delivery</span>
                    <span className="font-medium">
                      {parcelData.estimated_delivery
                        ? new Date(
                            parcelData.estimated_delivery
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackParcel;
