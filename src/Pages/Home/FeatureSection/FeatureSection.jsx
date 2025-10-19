import React from "react";
import liveTrackingImg from "../../../assets/features/live-tracking.png";
import safeDeliveryImg from "../../../assets/features/safe-delivery.png";
import callCenterImg from "../../../assets/features/tiny-deliveryman.png";

const features = [
  {
    image: liveTrackingImg,
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment’s journey and get instant status updates for complete peace of mind.",
  },
  {
    image: safeDeliveryImg,
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
  },
  {
    image: callCenterImg,
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns — anytime you need us.",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-16 px-4 bg-base-100">
      <div className="max-w-6xl mx-auto">
        {/* Top Divider */}
        <div className="border-t border-dashed border-gray-300 mb-8"></div>

        {/* Feature Cards */}
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-start gap-6 p-6 bg-white rounded-xl shadow-sm mb-6"
          >
            {/* Image */}
            <div className="flex-shrink-0 w-full md:w-1/4">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-auto max-h-32 object-contain"
              />
            </div>

            {/* Content */}
            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}

        {/* Bottom Divider */}
        <div className="border-t border-dashed border-gray-300 mt-8"></div>
      </div>
    </section>
  );
};

export default FeatureSection;
