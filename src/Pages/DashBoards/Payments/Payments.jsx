import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentsForm from "./PaymentsForm";

const stripePromise = loadStripe(
  "pk_test_51SMRQzFhL4aNDTLFr11yBBUZJpcPkPRwlbEnlAGxI9VWDzLM8DLYw8TckGRQC4egXKZFzR6Q3SjuNIu3SUshjH9K00mnWsQG2t"
);
const Payments = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentsForm></PaymentsForm>
    </Elements>
  );
};

export default Payments;
