"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:4001/api/employees/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      
      // Store the auth token in localStorage
      localStorage.setItem('authToken', result.token);
      
      // Redirect to dashboard or home page
      router.push('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-t from-[#0d0d0d] to-[rgba(20,20,20,0.9)] text-[#dadada]">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-[300px] w-full bg-gradient-to-t from-[#0d0d0d] to-[rgba(255,255,255,0.1)] border border-[#414141] rounded-md p-8"
      >
        <div className="text-lg font-semibold">Login Form</div>
        <div className="text-xs mt-2">Please Sign In to Access Your Account</div>

        {error && (
          <div className="mt-4 p-2 text-xs text-red-500 bg-red-500/10 rounded">
            {error}
          </div>
        )}

        <label className="block font-semibold text-xs mt-8">Email</label>
        <div className="mt-1">
          <input
            type="text"
            placeholder="Type your email..."
            className="w-full h-9 px-4 text-xs bg-[#303030] border border-[#414141] rounded outline-none text-[#dadada] placeholder-[#dadada] focus:border-[#7DA215]"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <label className="block font-semibold text-xs mt-8">Password</label>
        <div className="mt-1 relative h-9">
          <input
            id="password-input"
            type={passwordVisible ? "text" : "password"}
            placeholder="Type your password..."
            className="w-full h-full px-4 pr-10 text-xs bg-[#303030] border border-[#414141] rounded outline-none text-[#dadada] placeholder-[#dadada] focus:border-[#7DA215]"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
          />
          <div
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer transition-transform duration-100 ${
              passwordVisible ? "text-[#7DA215] rotate-90" : ""
            }`}
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <a href="#" className="block text-xs mt-8 hover:opacity-80">
          Forgot your password?
        </a>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 mt-8 rounded bg-[#7DA215] text-xs font-semibold text-[#21270E] hover:opacity-80 disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </section>
  );
};

export default LoginForm;