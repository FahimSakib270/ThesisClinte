import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FiEye, FiCreditCard, FiTrash2 } from "react-icons/fi";
// Import Swal from sweetalert2
import Swal from "sweetalert2";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    isLoading,
    error,
    refetch, // Destructure refetch to update the list after deletion
  } = useQuery({
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      if (!user?.email) {
        throw new Error("User email not available");
      }
      const res = await axiosSecure.get(`/api/parcels/user/${user.email}`); // This calls the backend route we added
      console.log("Fetched parcels:", res.data); // Add this log to check the data received
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleView = (parcelId) => {
    // Navigate to a detailed view page for the parcel
    // Example: router.push(`/dashboard/myParcels/${parcelId}`);
    console.log("View parcel:", parcelId);
  };

  const handlePay = (parcelId) => {
    // Navigate to a payment page for the parcel
    // Example: router.push(`/dashboard/myParcels/${parcelId}/pay`);
    console.log("Pay for parcel:", parcelId);
  };

  const handleDelete = async (parcelId) => {
    // Use Swal.fire for the confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Red color for danger
      cancelButtonColor: "#3085d6", // Blue color for cancel
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    // If the user confirms (clicks "Yes, delete it!")
    if (result.isConfirmed) {
      try {
        // Make the API call to delete the parcel
        // Note: You need to implement the DELETE route on your backend
        await axiosSecure.delete(`/api/parcels/${parcelId}`); // Replace with your delete API endpoint if you add one

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your parcel has been deleted.",
        });

        // Refetch the data to update the table and remove the deleted item
        refetch();
      } catch (err) {
        console.error("Error deleting parcel:", err);
        // Show an error toast or message using Swal
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Failed to delete the parcel.",
        });
      }
    }
    // If the user clicks "Cancel", the function just ends here without deleting.
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Parcels</h1>
        <p>Loading parcels...</p>
      </div>
    );
  }

  if (error) {
    console.error("Error in MyParcels component:", error); // Add this log to see the error details
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Parcels</h1>
        <p className="text-red-500">Error loading parcels: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Parcels</h1>
      {parcels.length === 0 ? (
        <p>You have no parcels yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            {/* Table Header */}
            <thead>
              <tr>
                <th>Title</th>
                <th>Weight (kg)</th>
                <th>Cost (₹)</th>
                <th>Delivery Status</th>
                <th>Payment Status</th>
                <th>Created</th>
                <th>Actions</th> {/* Action column header */}
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.parcelTitle}</td>
                  <td>{parcel.parcelWeight}</td>
                  <td>{parcel.deliveryCost}</td>
                  <td>
                    <span
                      className={`badge ${
                        parcel.delivery_status === "delivered"
                          ? "badge-success"
                          : parcel.delivery_status === "in_transit"
                          ? "badge-warning"
                          : parcel.delivery_status === "pending"
                          ? "badge-info"
                          : "badge-neutral"
                      }`}
                    >
                      {parcel.delivery_status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        parcel.payment_status === "paid"
                          ? "badge-success"
                          : parcel.payment_status === "pending"
                          ? "badge-warning"
                          : "badge-neutral"
                      }`}
                    >
                      {parcel.payment_status}
                    </span>
                  </td>
                  <td>{new Date(parcel.creation_date).toLocaleDateString()}</td>
                  <td>
                    {" "}
                    {/* Action buttons column - Removed the space {" "} */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(parcel._id)}
                        className="btn btn-xs btn-ghost text-blue-500 hover:text-blue-700"
                        title="View Details"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePay(parcel._id)}
                        className={`btn btn-xs btn-ghost ${
                          parcel.payment_status === "paid"
                            ? "text-green-500 cursor-not-allowed"
                            : "text-yellow-500 hover:text-yellow-700"
                        }`}
                        title="Pay"
                        disabled={parcel.payment_status === "paid"} // Disable if already paid
                      >
                        <FiCreditCard className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(parcel._id)}
                        className="btn btn-xs btn-ghost text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FiTrash2 className="h-4 w-4" />
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
  );
};

export default MyParcels;
