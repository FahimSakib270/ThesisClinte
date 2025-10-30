import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import AgentImg from "../../../assets/Agent/agent-pending.png";

const BeRider = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [warehouses, setWarehouses] = useState([]);

  // Load warehouses data on component mount (assuming same source as SendParcel)
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
          text: "Failed to load region data. Please try again later.",
        });
      }
    };

    fetchWarehouses();
  }, []);

  // Extract unique regions for the dropdown
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
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || user?.name || "",
      email: user?.email || "",
      age: "",
      region: "",
      district: "",
      nid: "",
      contact: "",
      warehouse: "",
      status: "pending",
    },
  });

  // Watch the region field to dynamically update districts
  const selectedRegion = watch("region");
  const districts = getDistrictsForRegion(selectedRegion);

  // Set default name and email from useAuth
  useEffect(() => {
    if (user) {
      setValue("name", user.displayName || user.name || "");
      setValue("email", user.email || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    console.log("Form Data Submitted:", data);

    try {
      // Example API call to submit rider application
      // Replace '/api/rider-applications' with your actual endpoint
      const response = await axiosSecure.post("/api/rider-applications", data);

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Thank you for your interest. We will review your application shortly.",
        });
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting rider application:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error.response?.data?.message ||
          "Could not submit your application. Please try again later.",
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#03373D] mb-2">Be a Rider</h1>
          <p className="text-gray-600 max-w-2xl">
            Enjoy fast, reliable parcel delivery with real-time tracking and
            zero hassle. From personal packages to business shipments — we
            deliver on time, every time.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="lg:w-1/2">
            <h2 className="text-xl font-semibold text-[#03373D] mb-4">
              Tell us about yourself
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent bg-gray-100 cursor-not-allowed"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Age
                  </label>
                  <input
                    type="number"
                    {...register("age", {
                      required: "Age is required",
                      min: {
                        value: 18,
                        message: "You must be at least 18 years old",
                      },
                      max: { value: 80, message: "Please enter a valid age" },
                    })}
                    placeholder="Your age"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.age.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent bg-gray-100 cursor-not-allowed"
                    placeholder="Your Email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Region
                  </label>
                  <Controller
                    name="region"
                    control={control}
                    rules={{ required: "Region is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
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
                  {errors.region && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.region.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NID No
                  </label>
                  <input
                    type="text"
                    {...register("nid", { required: "NID is required" })}
                    placeholder="NID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
                  />
                  {errors.nid && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.nid.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <input
                    type="tel"
                    {...register("contact", {
                      required: "Contact number is required",
                      pattern: {
                        value: /^[\+]?[0-9]{10,15}$/,
                        message: "Enter a valid phone number",
                      },
                    })}
                    placeholder="Contact"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
                  />
                  {errors.contact && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contact.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Which wire-house you want to work?
                </label>
                <Controller
                  name="district"
                  control={control}
                  rules={{ required: "District is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
                      disabled={!selectedRegion}
                      onChange={(e) => {
                        field.onChange(e);
                        setValue("warehouse", e.target.value);
                      }}
                    >
                      <option value="">Select wire-house</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.district && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.district.message}
                  </p>
                )}
              </div>

              {/* Hidden Status Field */}
              <input type="hidden" {...register("status")} value="pending" />

              <button
                type="submit"
                className="w-full bg-[#CAEB66] hover:bg-[#CAEB66] text-black font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Image Section */}
          <div className="lg:w-1/2 flex items-center justify-center">
            <div className="relative">
              <img
                src={AgentImg}
                alt="Rider"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeRider;
