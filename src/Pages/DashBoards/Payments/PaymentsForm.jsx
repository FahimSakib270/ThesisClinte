import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const PaymentsForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(typeof id);

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [error, setError] = useState("");

  // Fetch parcel information by ID
  const { data: parcelInfo = {}, isPending } = useQuery({
    queryKey: ["parcels", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/parcels/${id}`);
      return res.data;
    },
  });

  // Show loading state while fetching data
  if (isPending) {
    return (
      <div className="text-center py-12">
        <span className="loading loading-spinner loading-xl"></span>
        <p className="mt-4 text-gray-600">Loading payment details...</p>
      </div>
    );
  }

  const amount = parcelInfo.deliveryCost;
  const creation_date = parcelInfo.creation_date;
  console.log(creation_date);

  const amountInCents = amount * 100;
  console.log(amountInCents);

  // Handle payment form submission
  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }
    //step-1: validate the card
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
      console.error("Payment method creation error:", error);
    } else {
      setError("");
      console.log("Payment method created:", paymentMethod);
    }

    //step2-create paymentIntent
    const res = await axiosSecure.post("/create-payment-intent", {
      amount: amountInCents,
      payment_parcelId: id,
    });
    const clientSecret = res.data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user?.displayName || "Customer",
          email: user.email,
        },
      },
    });

    console.log("Stripe confirmCardPayment result:", result); // 🔍 ADD THIS

    if (result.error) {
      console.log("Stripe error:", result.error.message);
      setError(result.error.message);
    } else {
      setError("");
      console.log("Payment intent status:", result.paymentIntent?.status); // 🔍 ADD THIS

      if (result.paymentIntent?.status === "succeeded") {
        console.log("✅ Payment succeeded! Sending to backend...");
        const paymentData = {
          payment_parcelId: id,
          userEmail: user.email,
          amount: amount,
          paymentIntentId: result.paymentIntent.id,
          creation_date,
        };
        console.log("paymentData:", paymentData);

        const paymentsRes = await axiosSecure.post(
          "/api/update-payment-status",
          paymentData
        );
        if (paymentsRes.data.paymentId) {
          // Show success alert with transaction ID
          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: `Transaction ID: ${result.paymentIntent.id}`,
            confirmButtonText: "Go to My Parcel",
          }).then(() => {
            // Redirect to MyParcel page after confirmation
            navigate("/dashboard/myParcels");
          });
        }
      } else {
        console.warn(
          "⚠️ Payment did not succeed. Status:",
          result.paymentIntent?.status
        );
        setError("Payment was not completed successfully.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Payment Details</h3>
        <p className="text-gray-600">Amount: ${amount}</p>
      </div>

      <form onSubmit={handleOnSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Card Information
          </label>
          <div className="border p-3 rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!stripe}
            className={`btn btn-primary w-full ${
              !stripe ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Pay ${amount} For Parcel Pickup
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
        )}
      </form>
    </div>
  );
};

export default PaymentsForm;
