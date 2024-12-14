'use client';

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Make API call to login
      const response = await axios.post('http://localhost:5000/api/auth/login', data);
      console.log('Response Data:', response.data);

      const {token, user} = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', user.id);

      const userRole = user.role;

        if (userRole === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }


    } catch (error) {
      // Handle errors, show error message if login fails
      console.error("Login failed", error);
      if (error.response) {
        alert(error.response.data.message || "Something went wrong");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="mt-2 block w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm transition-all duration-300 ease-in-out transform hover:scale-105"
          {...register("email", { 
            required: "Email is required", 
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/,
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
          className="mt-2 block w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm transition-all duration-300 ease-in-out transform hover:scale-105"
          {...register("password", { 
            required: "Password is required", 
            minLength: { value: 6, message: "Password must be at least 6 characters" } 
          })}
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full bg-red-500 text-white py-3 rounded-3xl hover:bg-red-600 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Log In
      </button>

      {/* Forgot Password Link */}
      <div className="text-center mt-4">
        <a href="#" className="text-sm text-red-500 hover:underline">
          Forgot your password?
        </a>
      </div>

      <div className="text-center">
        <p>Don't have an account? click on <a href="/signup" className="text-red-500">Sign up</a></p>
      </div>
    </form>
  );
};

export default LoginForm;
