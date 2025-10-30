import React from "react";

const faqData = [
  {
    question: "How do I send a parcel using Profast?",
    answer:
      "To send a parcel, simply visit our website or app, fill out the parcel details form with sender and receiver information, select your preferred delivery type, and make the payment. Our system will generate a tracking ID for your shipment.",
  },
  {
    question: "How long does parcel delivery take?",
    answer:
      "Delivery times vary by destination. Within major cities (Dhaka, Chittagong, Sylhet, Khulna, Rajshahi), we offer express delivery within 4-6 hours and standard delivery within 24-48 hours. Nationwide delivery typically takes 48-72 hours.",
  },
  {
    question: "How can I track my parcel?",
    answer:
      "You can track your parcel in real-time using the unique tracking ID provided after booking. Simply enter the tracking ID on our website's 'Track Parcel' page to see live updates on your shipment's location and status.",
  },
  {
    question: "What are the delivery charges?",
    answer:
      "Delivery charges depend on the parcel type (document/non-document), weight, and destination. We offer competitive pricing with transparent costs. Check our Pricing page for detailed rates or use our calculator during the booking process.",
  },
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer:
      "Yes, we provide 100% Cash on Delivery services across Bangladesh. The recipient pays for the parcel and any applicable delivery fees upon receipt, ensuring secure transactions for both senders and receivers.",
  },
  {
    question: "How do I become a delivery rider with Profast?",
    answer:
      "Interested in joining our delivery team? Visit the 'Be a Rider' section on our website, fill out the application form with your details, and our team will review your application. Approved riders receive training and access to our delivery app.",
  },
  {
    question: "What happens if a delivery fails?",
    answer:
      "If a delivery attempt fails, our system automatically reschedules it. We notify both sender and receiver via email/SMS about the failed attempt and the new delivery schedule. Multiple attempts are made to ensure successful delivery.",
  },
  {
    question: "Can I cancel my parcel booking?",
    answer:
      "Yes, you can cancel your parcel booking before it's picked up by a rider. Once a rider has been assigned and pickup is initiated, cancellation may incur fees. Contact our support team for assistance with cancellations.",
  },
];

const FAQSection = () => {
  return (
    <div className="py-12 bg-base-100">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Got questions about how Profast parcel delivery works? We've got
            answers.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="collapse collapse-arrow bg-base-100 rounded-box border border-base-300"
            >
              <input
                type="radio"
                name="faq-accordion"
                defaultChecked={index === 0} // First item open by default
              />
              <div className="collapse-title text-lg font-semibold">
                {item.question}
              </div>
              <div className="collapse-content text-sm text-gray-700">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
