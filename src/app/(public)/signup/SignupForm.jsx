'use client'

import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Make API call to signup
      const response = await axios.post('http://localhost:5000/signup', data);

      // Check if the signup is successful
      if (response.status === 201) {
        alert('User created successfully!');
        router.push('/auth/login');  // Redirect to login page
      }
    } catch (error) {
      // Handle errors from the backend (e.g., email already taken)
      console.error("Signup failed", error);
      if (error.response) {
        alert(error.response.data.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="John Doe"
              className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              {...register("email", { 
                required: "Email is required", 
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              {...register("password", { 
                required: "Password is required", 
                minLength: { value: 6, message: "Password must be at least 6 characters" } 
              })}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Sign Up
          </button>

          {/* Link to Login */}
          <div className="text-center">
            <p>Already have an account? Click to <a href="/login" className="text-red-500">Log in</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
