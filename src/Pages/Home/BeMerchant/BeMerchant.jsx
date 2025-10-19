import React from "react";
import img1 from "../../../assets/logo/location-merchant.png";

const BeMerchant = () => {
  return (
    <div className="bg-[#03373D] p-8 md:p-12 lg:p-20 rounded-4xl relative overflow-hidden mb-10">
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-r from-[#03373D] to-transparent opacity-30"></div>

      <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={img1}
            alt="Merchant illustration"
            className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-contain"
          />
        </div>

        <div className="w-full lg:w-1/2 text-white space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>

          <p className="text-sm sm:text-base leading-relaxed opacity-90">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="btn btn-success bg-lime-400 border-lime-400 text-gray-900 hover:bg-lime-500 hover:border-lime-500 px-6 py-3 rounded-full font-medium transition">
              Become a Merchant
            </button>
            <button className="btn btn-outline btn-success text-lime-400 border-lime-400 hover:bg-lime-50 hover:text-lime-600 px-6 py-3 rounded-full font-medium transition">
              Earn with Profast Courier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;
