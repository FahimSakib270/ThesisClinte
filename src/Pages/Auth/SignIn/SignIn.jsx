import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "../../../hooks/useAuth";

import axios from "axios";
import useAxios from "../../../hooks/useAxios";

const Register = () => {
  const { createUser, updateUserProfile } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const result = await createUser(data.email, data.password);
      console.log(result.user);

      // Update user profile picture in Firebase
      const userProfile = {
        displayName: data.name,
        photoURL: profilePicture,
      };
      await updateUserProfile(userProfile);
      console.log("Profile name and picture updated in Firebase");

      // Create user in database
      const userInfo = {
        email: data.email,
        name: data.name,
        profileUrl: profilePicture,
        provider: "email", // Since this is email registration
        role: "user", // default role
        createdAt: new Date().toISOString(),
      };

      const results = await axiosInstance.post("/api/users", userInfo);
      console.log("User created in database", results.data);

      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const image = event.target.files[0];
    if (!image) return;

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("key", import.meta.env.VITE_Image_Key);

      const res = await axios.post(`https://api.imgbb.com/1/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data.data.url);
      setProfilePicture(res.data.data.url);
    } catch (error) {
      console.error("Image upload error:", error);
    }
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-4xl font-bold">Create an Account</h1>
        <p className="font-bold">Register with Profast</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            {/* Name Field */}
            <label className="label">Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="input"
              placeholder="Name"
            />
            {errors.name?.type === "required" && (
              <p className="text-red-600">Name is required</p>
            )}

            <label className="label">Profile Picture</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="input"
              placeholder="Your Profile Picture"
            />

            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input"
              placeholder="Email"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-600">Email is required</p>
            )}

            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", {
                required: true,
                minLength: 6,
              })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-600">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-600">Password must be 6 characters</p>
            )}

            <button className="btn bg-[#CAEB66] mt-4 text-black">
              Register
            </button>
          </fieldset>
          <p>
            <small>
              Already have an account?{" "}
              <Link className="text-[#8FA748] btn btn-link" to="/login">
                Login
              </Link>{" "}
            </small>
          </p>
        </form>
        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
};

export default Register;
