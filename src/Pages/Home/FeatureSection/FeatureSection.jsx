// src/Pages/Home/FeatureSection/FeatureSection.jsx
import React from "react";
// You'll import your actual images here
import liveTrackingImg from "../../../assets/features/live-tracking.png";
import safeDeliveryImg from "../../../assets/features/safe-delivery.png";
import callCenterImg from "../../../assets/features/tiny-deliveryman.png";

const FeatureSection = () => {
  const features = [
    {
      id: 1,
      title: "Live Parcel Tracking",
      description:
        "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
      icon: liveTrackingImg,
    },
    {
      id: 2,
      title: "100% Safe Delivery",
      description:
        "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
      icon: safeDeliveryImg,
    },
    {
      id: 3,
      title: "24/7 Call Center Support",
      description:
        "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns — anytime you need us.",
      icon: callCenterImg,
    },
  ];

  return (
    <section className="py-5">
      <div>
        <h2 className="text-center font-extrabold text-3xl my-4">
          Why Choose Us
        </h2>
      </div>
      <div className="w-full border-t border-dashed border-gray-300 my-6"></div>

      {/* Feature Cards */}
      {features.map((feature) => (
        <div
          key={feature.id}
          className="bg-white rounded-lg shadow-md p-6 mb-8 last:mb-0"
        >
          <div className="flex items-start gap-8 rounded-3xl">
            <div className="w-40 h-40 rounded-lg flex justify-center items-center">
              <img
                src={feature.icon}
                alt={feature.title}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-black mb-2">
                {feature.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      ))}

      <div className="w-full border-t border-dashed border-gray-300 my-6"></div>
    </section>
  );
};

export default FeatureSection;
