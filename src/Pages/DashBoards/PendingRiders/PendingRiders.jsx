import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const PendingRiders = () => {
  const [pendingRiders, setPendingRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Fetch pending riders
  useEffect(() => {
    const fetchPendingRiders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosSecure.get("/api/riders/pending");
        setPendingRiders(response.data);
      } catch (err) {
        console.error("Error fetching pending riders:", err);
        setError("Failed to load pending riders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRiders();
  }, [axiosSecure]);

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

  // Handle Approve/Reject action
  const handleAction = async (action) => {
    if (!selectedRider) return;

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${action} ${selectedRider.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: action === "approve" ? "#10B981" : "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText:
        action === "approve" ? "Yes, Approve!" : "Yes, Reject!",
    });

    if (result.isConfirmed) {
      try {
        // Make API call to update rider status
        await axiosSecure.patch(`/api/riders/${selectedRider._id}/status`, {
          status: action === "approve" ? "approved" : "rejected",
        });

        // Update local state to remove the rider from the list
        setPendingRiders((prevRiders) =>
          prevRiders.filter((rider) => rider._id !== selectedRider._id)
        );

        Swal.fire("Updated!", `Rider ${action}d successfully.`, "success");
        closeModal(); // Close the modal after successful action
      } catch (error) {
        console.error(`Error ${action}ing rider:`, error);
        Swal.fire(
          "Error!",
          `Failed to ${action} rider. Please try again.`,
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Rider Applications</h1>

      {pendingRiders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No pending rider applications found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Region</th>
                <th>District</th>
                <th>Applied On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRiders.map((rider) => (
                <tr key={rider._id}>
                  <td className="font-medium">{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.contact}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td>
                    {rider.application_date
                      ? new Date(rider.application_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      onClick={() => openModal(rider)}
                      className="btn btn-sm btn-outline btn-info"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rider Detail Modal */}
      {isModalOpen && selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Rider Application Details</h2>
                <button
                  onClick={closeModal}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{selectedRider.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedRider.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{selectedRider.age}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium">{selectedRider.contact}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Region</p>
                  <p className="font-medium">{selectedRider.region}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">District</p>
                  <p className="font-medium">{selectedRider.district}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">NID</p>
                  <p className="font-medium">{selectedRider.nid}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Warehouse Preference</p>
                  <p className="font-medium">{selectedRider.warehouse}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Application Date</p>
                  <p className="font-medium">
                    {selectedRider.application_date
                      ? new Date(
                          selectedRider.application_date
                        ).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                {/* Add any other fields you collect in the rider application */}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleAction("reject")}
                  className="btn btn-error"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => handleAction("approve")}
                  className="btn btn-success"
                >
                  Approve Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;
