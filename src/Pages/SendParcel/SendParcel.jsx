import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const SendParcel = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [warehouses, setWarehouses] = useState([]);
  const [pricingBreakdown, setPricingBreakdown] = useState(null);

  // Load warehouses data on component mount
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await fetch("/warehouses2.json");
        const data = await response.json();
        setWarehouses(data);
      } catch (error) {
        console.error("Failed to load warehouse data", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load warehouse data. Please try again later.",
        });
      }
    };

    fetchWarehouses();
  }, []);

  // Extract unique regions
  const uniqueRegions = [...new Set(warehouses.map((item) => item.region))];

  // Get districts for a specific region
  const getDistrictsForRegion = (region) => {
    if (!region) return [];
    return [
      ...new Set(
        warehouses
          .filter((item) => item.region === region)
          .map((item) => item.district)
      ),
    ];
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      parcelType: "document",
      parcelTitle: "",
      parcelWeight: "",
      senderName: user?.name || "",
      senderContact: user?.phone || "",
      senderRegion: "",
      senderServiceCenter: "",
      senderAddress: "",
      senderInstruction: "",
      receiverName: "",
      receiverContact: "",
      receiverRegion: "",
      receiverServiceCenter: "",
      receiverAddress: "",
      receiverInstruction: "",
    },
  });

  const parcelType = watch("parcelType");
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");

  const senderDistricts = getDistrictsForRegion(senderRegion);
  const receiverDistricts = getDistrictsForRegion(receiverRegion);

  // --- Cost Calculation Logic with Breakdown ---
  const calculateCost = (data) => {
    const { parcelType, parcelWeight, senderRegion, receiverRegion } = data;

    const isWithinCity = senderRegion === receiverRegion;
    let baseCost = 0;
    let extraKg = 0;
    let extraCharge = 0;
    let extraOutsideCityCharge = 0;
    let totalCost = 0;

    const breakdown = {
      isWithinCity,
      parcelType,
      weight: parseFloat(parcelWeight) || 0,
      parts: [],
    };

    if (parcelType === "document") {
      baseCost = isWithinCity ? 60 : 80;
      breakdown.parts.push({
        label: `Document (${isWithinCity ? "Within City" : "Outside City"})`,
        cost: baseCost,
      });
    } else {
      // non-document
      const weight = breakdown.weight;

      if (weight <= 3) {
        baseCost = isWithinCity ? 110 : 150;
        breakdown.parts.push({
          label: `Non-Document (Up to 3kg, ${
            isWithinCity ? "Within City" : "Outside City"
          })`,
          cost: baseCost,
        });
      } else {
        // weight > 3kg
        baseCost = isWithinCity ? 110 : 150;
        breakdown.parts.push({
          label: `Non-Document (First 3kg, ${
            isWithinCity ? "Within City" : "Outside City"
          })`,
          cost: baseCost,
        });
        extraKg = Math.ceil(weight - 3);
        extraCharge = extraKg * 40;
        breakdown.parts.push({
          label: `Extra Weight (${extraKg} kg x ₹40)`,
          cost: extraCharge,
        });

        if (!isWithinCity) {
          extraOutsideCityCharge = 40;
          breakdown.parts.push({
            label: `Outside City Surcharge (>3kg)`,
            cost: extraOutsideCityCharge,
          });
        }
      }
    }

    totalCost = baseCost + extraCharge + extraOutsideCityCharge;

    // Update breakdown state
    setPricingBreakdown(breakdown);

    // Return the calculated cost and breakdown object
    return { totalCost, breakdown };
  };
  // --- End Cost Calculation Logic ---

  const onSubmit = async (data) => {
    // Validate required fields for service centers (they depend on regions being selected)
    if (!data.senderRegion || !data.senderServiceCenter) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select a region and service center for the sender.",
      });
      return;
    }
    if (!data.receiverRegion || !data.receiverServiceCenter) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select a region and service center for the receiver.",
      });
      return;
    }

    // Calculate cost and get breakdown object directly
    const { totalCost: calculatedCost, breakdown: currentBreakdown } =
      calculateCost(data);

    // Prepare the breakdown HTML for the SweetAlert using the currentBreakdown object
    let breakdownHtml = `
      <div style="text-align: left; max-height: 300px; overflow-y: auto;">
        <h4 style="margin-bottom: 10px; color: #3085d6;">Pricing Breakdown:</h4>
        <ul style="list-style-type: none; padding: 0;">
    `;
    currentBreakdown.parts.forEach((part) => {
      breakdownHtml += `<li style="margin-bottom: 5px;"><strong>${
        part.label
      }:</strong> ₹${part.cost.toFixed(2)}</li>`;
    });
    breakdownHtml += `
        </ul>
        <hr style="margin: 10px 0;">
        <h4 style="margin-top: 10px;"><strong>Total Cost: ₹${calculatedCost.toFixed(
          2
        )}</strong></h4>
      </div>
    `;

    // Show confirmation SweetAlert with breakdown
    const result = await Swal.fire({
      title: "Confirm Booking",
      html: breakdownHtml,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      handleConfirmSubmit(data, calculatedCost);
    }
  };

  const handleConfirmSubmit = async (formData, calculatedCost) => {
    // Prepare data to send to the backend
    const parcelData = {
      ...formData,
      deliveryCost: calculatedCost,
      creation_date: new Date().toISOString(),

      created_by: user?.email || null,
      payment_status: "pending",
      delivery_status: "pending",
    };
    console.log(parcelData);

    try {
      const response = await axiosSecure.post("/api/parcels", parcelData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = response.data;
      console.log(responseData);

      const trackingId =
        responseData.tracking_id ||
        responseData.trackingId ||
        responseData.id ||
        responseData.parcelId ||
        "Unknown";

      Swal.fire({
        icon: "success",
        title: "Success!",
        html: `Parcel booked successfully!<br>Tracking ID: ${trackingId}<br>Delivery cost: ₹${calculatedCost.toFixed(
          2
        )}`,
      });
    } catch (error) {
      console.error("Error submitting parcel:", error);

      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text:
            error.response.data.message ||
            `Server Error: ${error.response.status}`,
        });
      } else if (error.request) {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "Failed to connect to the server. Please check your connection.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.message || "An error occurred while submitting the parcel.",
        });
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Add Parcel</h1>
      <p className="text-lg text-gray-600 mb-8">Enter your parcel details</p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Parcel Info Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Parcel Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parcel Type */}
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="document"
                  {...register("parcelType", {
                    required: "Parcel type is required",
                  })}
                  className="mr-2"
                />
                Document
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="non-document"
                  {...register("parcelType", {
                    required: "Parcel type is required",
                  })}
                  className="mr-2"
                />
                Non-Document
              </label>
            </div>
            {errors.parcelType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.parcelType.message}
              </p>
            )}

            {/* Parcel Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parcel Name
              </label>
              <input
                type="text"
                {...register("parcelTitle", {
                  required: "Parcel title is required",
                })}
                placeholder="Parcel Name"
                className="input input-bordered w-full"
              />
              {errors.parcelTitle && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.parcelTitle.message}
                </p>
              )}
            </div>

            {/* Parcel Weight (Conditional) */}
            {parcelType === "non-document" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parcel Weight (KG)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  {...register("parcelWeight", {
                    validate: (value) =>
                      parcelType === "non-document"
                        ? !isNaN(parseFloat(value)) && parseFloat(value) > 0
                        : true,
                  })}
                  placeholder="Parcel Weight (KG)"
                  className="input input-bordered w-full"
                />
                {errors.parcelWeight && (
                  <p className="text-red-500 text-sm mt-1">
                    Weight must be greater than 0
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sender & Receiver Sections Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sender Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Sender Details
            </h2>
            <div className="space-y-4">
              {/* Sender Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sender Name
                </label>
                <input
                  type="text"
                  {...register("senderName", {
                    required: "Sender name is required",
                  })}
                  placeholder="Sender Name"
                  className="input input-bordered w-full"
                />
                {errors.senderName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.senderName.message}
                  </p>
                )}
              </div>

              {/* Sender Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sender Contact No
                </label>
                <input
                  type="tel"
                  {...register("senderContact", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter a valid 10-digit phone number",
                    },
                  })}
                  placeholder="Sender Contact No"
                  className="input input-bordered w-full"
                />
                {errors.senderContact && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.senderContact.message}
                  </p>
                )}
              </div>

              {/* Sender Region */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Region
                </label>
                <Controller
                  name="senderRegion"
                  control={control}
                  rules={{ required: "Region is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="select select-bordered w-full"
                    >
                      <option value="">Select your region</option>
                      {uniqueRegions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.senderRegion && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.senderRegion.message}
                  </p>
                )}
              </div>

              {/* Sender Service Center */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sender Pickup Wire House
                </label>
                <Controller
                  name="senderServiceCenter"
                  control={control}
                  rules={{ required: "Service center is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="select select-bordered w-full"
                      disabled={!senderRegion}
                    >
                      <option value="">Select Wire House</option>
                      {senderDistricts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.senderServiceCenter && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.senderServiceCenter.message}
                  </p>
                )}
              </div>

              {/* Sender Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  {...register("senderAddress", {
                    required: "Address is required",
                  })}
                  placeholder="Address"
                  rows={3}
                  className="textarea textarea-bordered w-full"
                />
                {errors.senderAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.senderAddress.message}
                  </p>
                )}
              </div>

              {/* Pickup Instruction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Instruction
                </label>
                <textarea
                  {...register("senderInstruction")}
                  placeholder="Pickup Instruction"
                  rows={3}
                  className="textarea textarea-bordered w-full"
                />
              </div>
            </div>
          </div>

          {/* Receiver Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Receiver Details
            </h2>
            <div className="space-y-4">
              {/* Receiver Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receiver Name
                </label>
                <input
                  type="text"
                  {...register("receiverName", {
                    required: "Receiver name is required",
                  })}
                  placeholder="Receiver Name"
                  className="input input-bordered w-full"
                />
                {errors.receiverName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiverName.message}
                  </p>
                )}
              </div>

              {/* Receiver Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receiver Contact No
                </label>
                <input
                  type="tel"
                  {...register("receiverContact", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter a valid 10-digit phone number",
                    },
                  })}
                  placeholder="Receiver Contact No"
                  className="input input-bordered w-full"
                />
                {errors.receiverContact && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiverContact.message}
                  </p>
                )}
              </div>

              {/* Receiver Region */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receiver Region
                </label>
                <Controller
                  name="receiverRegion"
                  control={control}
                  rules={{ required: "Region is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="select select-bordered w-full"
                    >
                      <option value="">Select receiver region</option>
                      {uniqueRegions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.receiverRegion && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiverRegion.message}
                  </p>
                )}
              </div>

              {/* Receiver Service Center */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receiver Delivery Wire House
                </label>
                <Controller
                  name="receiverServiceCenter"
                  control={control}
                  rules={{ required: "Service center is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="select select-bordered w-full"
                      disabled={!receiverRegion}
                    >
                      <option value="">Select Wire House</option>
                      {receiverDistricts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.receiverServiceCenter && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiverServiceCenter.message}
                  </p>
                )}
              </div>

              {/* Receiver Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receiver Address
                </label>
                <textarea
                  {...register("receiverAddress", {
                    required: "Address is required",
                  })}
                  placeholder="Receiver Address"
                  rows={3}
                  className="textarea textarea-bordered w-full"
                />
                {errors.receiverAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiverAddress.message}
                  </p>
                )}
              </div>

              {/* Delivery Instruction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Instruction
                </label>
                <textarea
                  {...register("receiverInstruction")}
                  placeholder="Delivery Instruction"
                  rows={3}
                  className="textarea textarea-bordered w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button type="submit" className="btn btn-success w-full">
            Book Parcel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;
