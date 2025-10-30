// src/Pages/Dashboard/Admin/AssignRider.jsx
import React, { useState, useEffect } from "react";

import Swal from "sweetalert2";
import { FiUserPlus, FiTruck, FiX, FiCheckCircle } from "react-icons/fi"; // Import icons
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AssignRider = () => {
  const [parcels, setParcels] = useState([]);
  const [riders, setRiders] = useState([]); // State for all riders
  const [nearbyRiders, setNearbyRiders] = useState([]); // State for filtered riders
  const [loading, setLoading] = useState({
    parcels: true,
    riders: false,
    assignment: false,
  });
  const [error, setError] = useState(null);
  const [selectedParcel, setSelectedParcel] = useState(null); // State for the parcel being assigned
  const [selectedRiderId, setSelectedRiderId] = useState(""); // State for the chosen rider ID
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [warehouseData, setWarehouseData] = useState([]); // State for warehouse data
  const axiosSecure = useAxiosSecure();

  // --- LOAD WAREHOUSE DATA ---
  useEffect(() => {
    const fetchWarehouseData = async () => {
      try {
        // Load warehouse data from the public JSON file
        const response = await fetch("/warehouses2.json"); // Adjust path if needed
        const data = await response.json();
        setWarehouseData(data);
        console.log("Warehouse data loaded:", data);
      } catch (err) {
        console.error("Failed to load warehouse data", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load region data. Nearby rider filtering might be affected.",
        });
      }
    };

    fetchWarehouseData();
  }, []);
  // --- END LOAD WAREHOUSE DATA ---

  // Fetch parcels with payment_status: "paid" and delivery_status: "pending"
  useEffect(() => {
    const fetchAssignableParcels = async () => {
      setLoading((prev) => ({ ...prev, parcels: true }));
      setError(null);
      try {
        const response = await axiosSecure.get("/api/parcels");

        // Filter client-side for parcels that are paid but pending delivery
        const assignableParcels = response.data.filter(
          (parcel) =>
            parcel.payment_status === "paid" &&
            parcel.delivery_status === "pending"
        );

        setParcels(assignableParcels);
      } catch (err) {
        console.error("Error fetching assignable parcels:", err);
        setError("Failed to load parcels. Please try again.");
      } finally {
        setLoading((prev) => ({ ...prev, parcels: false }));
      }
    };

    fetchAssignableParcels();
  }, [axiosSecure]);

  // Fetch all active riders (when modal opens or selected parcel changes)
  useEffect(() => {
    const fetchRiders = async () => {
      if (isModalOpen && selectedParcel) {
        setLoading((prev) => ({ ...prev, riders: true }));
        setError(null);
        try {
          const response = await axiosSecure.get("/api/riders/active");
          setRiders(response.data);

          // --- FILTER NEARBY RIDERS USING WAREHOUSE DATA ---
          const parcelDistrict = selectedParcel.receiverDistrict;
          const parcelRegion = selectedParcel.receiverRegion;

          // 1. Find districts in the same region as the parcel (from warehouse data)
          // This gives us a list of potentially nearby districts
          const districtsInSameRegion = warehouseData
            .filter((item) => item.region === parcelRegion)
            .map((item) => item.district);

          // Remove duplicates if any
          const uniqueDistrictsInRegion = [...new Set(districtsInSameRegion)];
          console.log(
            `Districts in region ${parcelRegion}:`,
            uniqueDistrictsInRegion
          );

          // 2. Filter riders based on proximity logic
          // Option B: Same district OR in districts within the same region
          // This is a more flexible definition of "nearby"
          const nearby = response.data.filter(
            (rider) =>
              rider.district === parcelDistrict || // Rider is in the exact same district
              (rider.region === parcelRegion &&
                uniqueDistrictsInRegion.includes(rider.district)) // Rider is in a district within the same region
          );

          // Remove potential duplicates from the nearby list if a rider matches multiple conditions
          const uniqueNearbyRiders = nearby.filter(
            (rider, index, self) =>
              index === self.findIndex((r) => r._id === rider._id)
          );

          setNearbyRiders(uniqueNearbyRiders);
          console.log(
            `Found ${uniqueNearbyRiders.length} nearby riders for ${parcelDistrict}, ${parcelRegion}`
          );
          // --- END FILTER NEARBY RIDERS ---
        } catch (err) {
          console.error("Error fetching active riders:", err);
          setError("Failed to load riders. Please try again.");
          setNearbyRiders([]);
        } finally {
          setLoading((prev) => ({ ...prev, riders: false }));
        }
      }
    };

    fetchRiders();
  }, [isModalOpen, selectedParcel, axiosSecure, warehouseData]); // Re-run if warehouseData changes

  const openAssignModal = (parcel) => {
    setSelectedParcel(parcel);
    setSelectedRiderId(""); // Reset rider selection
    setIsModalOpen(true);
    // Fetching riders is handled by the useEffect above
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedParcel(null);
    setSelectedRiderId("");
    setNearbyRiders([]);
    setError(null); // Clear any previous errors when closing
  };

  const handleFinalAssignRider = async () => {
    if (!selectedRiderId) {
      Swal.fire("Error", "Please select a rider.", "warning");
      return;
    }

    const riderToAssign = riders.find((r) => r._id === selectedRiderId);
    if (!riderToAssign) {
      Swal.fire("Error", "Selected rider not found.", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Assignment?",
      text: `Assign ${riderToAssign.name} to parcel ${selectedParcel.tracking_id}? This will set the parcel status to 'In Transit' and the rider status to 'Busy'.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981", // Green
      cancelButtonColor: "#6B7280", // Gray
      confirmButtonText: "Yes, Assign!",
    });

    if (result.isConfirmed) {
      setLoading((prev) => ({ ...prev, assignment: true }));
      try {
        // Call your backend API to assign the rider to the parcel and update statuses
        const response = await axiosSecure.patch(
          `/api/parcels/${selectedParcel._id}/assign-rider`,
          {
            riderId: selectedRiderId,
          }
        );

        if (response.status === 200) {
          Swal.fire(
            "Assigned!",
            "Rider assigned and statuses updated.",
            "success"
          );

          // --- OPTIMISTICALLY UPDATE UI WITH NEW STATUSES ---
          // 1. Update the main parcels list
          setParcels((prevParcels) =>
            prevParcels.map((p) =>
              p._id === selectedParcel._id
                ? {
                    ...p,
                    delivery_status:
                      response.data.updatedParcel.delivery_status, // "in_transit"
                    assigned_rider_id: selectedRiderId,
                  }
                : p
            )
          );

          // 2. If you have a global state for the rider (e.g., via context or a global store),
          //    you would update it here. For now, we rely on refetching if the user navigates.
          // --- END OPTIMISTIC UPDATE ---

          closeModal();
        } else {
          throw new Error(response.data?.message || "Failed to assign rider");
        }
      } catch (error) {
        console.error("Error assigning rider:", error);
        Swal.fire(
          "Error!",
          `Failed to assign rider: ${
            error.response?.data?.message || error.message
          }`,
          "error"
        );
      } finally {
        setLoading((prev) => ({ ...prev, assignment: false }));
      }
    }
  };

  if (loading.parcels) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-[#CAEB66]"></span>
      </div>
    );
  }

  if (error && !isModalOpen) {
    // Only show main error if not in modal context
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Assign Riders
            </h1>
            <p className="text-gray-600 mt-1">
              Manage parcel deliveries by assigning riders
            </p>
          </div>
          <div className="badge badge-lg badge-success">
            Total Parcels: {parcels.length}
          </div>
        </div>

        {parcels.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">
              No parcels available for rider assignment.
            </p>
            <p className="text-gray-400 mt-2">
              Paid parcels with pending delivery status will appear here.
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
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {parcels.map((parcel) => (
                  <tr
                    key={parcel._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {parcel.tracking_id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {parcel.parcelTitle || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {parcel.senderName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {parcel.receiverName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      ${parcel.deliveryCost}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {parcel.receiverDistrict}, {parcel.receiverRegion}
                      </span>
                    </td>
                    {/* --- MODIFIED ACTIONS CELL --- */}
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      {/* Conditional rendering based on delivery_status */}
                      {parcel.delivery_status === "pending" ? (
                        <button
                          onClick={() => openAssignModal(parcel)}
                          className="btn btn-sm btn-outline btn-success flex items-center gap-2 mx-auto"
                        >
                          <FiUserPlus className="h-4 w-4" />
                          Assign Rider
                        </button>
                      ) : parcel.delivery_status === "in_transit" ? (
                        <div className="flex items-center justify-end gap-2 text-green-600">
                          <FiTruck className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            In Transit
                          </span>
                          {parcel.assigned_rider_id && (
                            <div className="tooltip" data-tip="Rider Assigned">
                              <FiCheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="badge badge-ghost badge-sm">
                          {parcel.delivery_status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Rider Modal */}
      {isModalOpen && selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Assign Rider to Parcel {selectedParcel.tracking_id}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body - Scrollable Content */}
            <div className="overflow-y-auto flex-grow p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Parcel Details Card */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Parcel Details
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Tracking ID:</span>{" "}
                      {selectedParcel.tracking_id}
                    </p>
                    <p>
                      <span className="font-medium">Title:</span>{" "}
                      {selectedParcel.parcelTitle || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">From:</span>{" "}
                      {selectedParcel.senderName}
                    </p>
                    <p>
                      <span className="font-medium">To:</span>{" "}
                      {selectedParcel.receiverName}
                    </p>
                    <p>
                      <span className="font-medium">Destination:</span>{" "}
                      {selectedParcel.receiverDistrict},{" "}
                      {selectedParcel.receiverRegion}
                    </p>
                    <p>
                      <span className="font-medium">Cost:</span> $
                      {selectedParcel.deliveryCost}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>
                      <span className="badge badge-warning ml-2">
                        Pending Delivery
                      </span>
                    </p>
                  </div>
                </div>

                {/* Rider Selection Card */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Select Rider
                  </h3>

                  {loading.riders ? (
                    <div className="flex justify-center items-center h-32">
                      <span className="loading loading-spinner loading-md text-[#CAEB66]"></span>
                    </div>
                  ) : error ? (
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
                  ) : nearbyRiders.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500">
                        No nearby riders found for{" "}
                        {selectedParcel.receiverDistrict}.
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Showing all active riders.
                      </p>
                      {/* Fallback: Show all riders if no nearby ones */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select from all active riders:
                        </label>
                        <select
                          value={selectedRiderId}
                          onChange={(e) => setSelectedRiderId(e.target.value)}
                          className="select select-bordered w-full max-w-xs"
                          disabled={loading.assignment}
                        >
                          <option value="">Choose a rider...</option>
                          {riders.map((rider) => (
                            <option key={rider._id} value={rider._id}>
                              {rider.name} ({rider.district})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="badge badge-info mb-4">
                        Showing {nearbyRiders.length} rider(s) in/near{" "}
                        {selectedParcel.receiverDistrict}
                      </div>
                      <div className="form-control">
                        <div className="flex flex-wrap gap-2">
                          {nearbyRiders.map((rider) => (
                            <div
                              key={rider._id}
                              onClick={() => setSelectedRiderId(rider._id)}
                              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                selectedRiderId === rider._id
                                  ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                                  : "border-gray-300 hover:border-green-400 hover:bg-gray-100"
                              }`}
                            >
                              <p className="font-medium">{rider.name}</p>
                              <p className="text-sm text-gray-600">
                                {rider.email}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {rider.contact}
                              </p>
                              <p className="text-xs text-gray-500">
                                {rider.district}, {rider.region}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {nearbyRiders.length > 0 && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Or select from all active riders:
                          </label>
                          <select
                            value={selectedRiderId}
                            onChange={(e) => setSelectedRiderId(e.target.value)}
                            className="select select-bordered w-full max-w-xs"
                            disabled={loading.assignment}
                          >
                            <option value="">Choose a rider...</option>
                            {riders.map((rider) => (
                              <option key={rider._id} value={rider._id}>
                                {rider.name} ({rider.district})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="btn btn-ghost"
                disabled={loading.assignment}
              >
                Cancel
              </button>
              <button
                onClick={handleFinalAssignRider}
                className={`btn btn-success ${
                  loading.assignment ? "loading" : ""
                }`}
                disabled={loading.assignment || !selectedRiderId}
              >
                {loading.assignment ? "Assigning..." : "Confirm Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
