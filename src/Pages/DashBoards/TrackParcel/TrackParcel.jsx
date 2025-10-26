import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const TrackParcel = () => {
  const [trackingId, setTrackingId] = useState("");
  const [parcelData, setParcelData] = useState(null);
  const [trackingUpdates, setTrackingUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { trackingId: urlTrackingId } = useParams();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    // If tracking ID is provided in URL, fetch it immediately
    if (urlTrackingId) {
      setTrackingId(urlTrackingId);
      fetchTrackingInfo(urlTrackingId);
    }
  }, [urlTrackingId]);

  const fetchTrackingInfo = async (id) => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosSecure.get(`/api/track/${id}`);
      if (response.data.message === "Parcel not found") {
        setError("Parcel not found. Please check the tracking ID.");
        setParcelData(null);
        setTrackingUpdates([]);
      } else {
        setParcelData(response.data.parcel);
        setTrackingUpdates(response.data.trackingUpdates);
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
        <div className="space-y-6">
          {/* Parcel Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Parcel Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tracking ID</p>
                <p className="font-medium">{parcelData.tracking_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    parcelData.delivery_status
                  )}`}
                >
                  {parcelData.delivery_status}
                </span>
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
            </div>
          </div>

          {/* Tracking Updates */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Tracking Updates</h2>
            {trackingUpdates.length > 0 ? (
              <div className="space-y-4">
                {trackingUpdates.map((update, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-[#CAEB66] pl-4 py-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{update.status}</p>
                        <p className="text-sm text-gray-500">
                          {update.location}
                        </p>
                        {update.notes && (
                          <p className="text-sm mt-1">{update.notes}</p>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(update.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No tracking updates available yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
