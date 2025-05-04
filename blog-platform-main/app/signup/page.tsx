"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import Link from "next/link";

import AuthRedirect from "../components/AuthRedirect";

export default function SignUp() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if the user is already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/signup", data);
      setMessage(response.data.message);
      setIsSuccess(true);
      router.push("/");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
  
      // Show custom message for invalid email domain
      if (errorMessage?.includes("@iu-study.org")) {
        setMessage("Only @iu-study.org emails are allowed!");
      } else {
        setMessage(errorMessage || "Signup failed");
      }
  
      setIsSuccess(false);
    }
  };
  

  // Show nothing while checking session status
  if (status === "loading") return null;

  return (
    <AuthRedirect>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-2 text-center">Sign Up Now</h1>
          <p className="text-gray-600 text-center text-[16px] mb-6">Join other students in your university's exclusive blog platform.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register("username", { required: "Username is required" })}
                placeholder="Username"
                className="w-full px-4 py-2 border rounded-full bg-gray-100 border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-950"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username?.message as string}</p>
              )}
            </div>
            
            <div>
              <input
                {...register("email", { required: "Email is required" })}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-full bg-gray-100 border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-950"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email?.message as string}</p>
              )}
            </div>

            <div>
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-full bg-gray-100 border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-950"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password?.message as string}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition duration-200"
            >
              Sign Up
            </button>
            <div className="mt-[1px]">
            <Link href="/login"><span className="text-blue-500 hover:underline cursor-pointer">Already have an account?</span></Link> </div>
          </form>

          {message && (
            <p className={`mt-4 text-center text-sm ${isSuccess ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </AuthRedirect>
  );
}
