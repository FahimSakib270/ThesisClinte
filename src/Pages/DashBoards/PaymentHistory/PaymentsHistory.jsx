import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentsHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: singlePayments = [], isPending } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/payments/user/${user.email}`);
      return res.data;
    },
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-[#CAEB66]"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>
      {singlePayments.length === 0 ? (
        <p className="text-center text-gray-500">No payment history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Parcel ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Paid at</th>
              </tr>
            </thead>
            <tbody>
              {singlePayments.map((payment) => (
                <tr key={payment._id}>
                  <td className="font-mono text-sm">
                    {payment.payment_intent_id}
                  </td>
                  <td className="font-mono text-sm">{payment.parcel_id}</td>
                  <td>${payment.amount.toFixed(2)}</td>
                  <td>
                    <span className="badge badge-success">
                      {payment.status}
                    </span>
                  </td>
                  <td>
                    {payment.paid_at ||
                      new Date(payment.created_at).toLocaleDateString()}
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

export default PaymentsHistory;
