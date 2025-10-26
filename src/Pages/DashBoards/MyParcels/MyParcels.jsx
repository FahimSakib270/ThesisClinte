import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FiEye, FiCreditCard, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: parcels = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      if (!user?.email) {
        throw new Error("User email not available");
      }
      const res = await axiosSecure.get(`/api/parcels/user/${user.email}`);
      console.log("Fetched parcels:", res.data);
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
    navigate(`/dashboard/payment/${parcelId}`);
    console.log("Pay for parcel:", parcelId);
  };

  const handleDelete = async (parcelId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/api/parcels/${parcelId}`);

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your parcel has been deleted.",
        });

        refetch();
      } catch (err) {
        console.error("Error deleting parcel:", err);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Failed to delete the parcel.",
        });
      }
    }
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
    console.error("Error in MyParcels component:", error);
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
                <th>Actions</th>
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
                            ? "text-green-500 cursor-not-allowed opacity-50"
                            : "text-yellow-500 hover:text-yellow-700"
                        }`}
                        title="Pay"
                        disabled={parcel.payment_status === "paid"}
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
