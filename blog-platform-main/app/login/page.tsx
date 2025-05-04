"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthRedirect from "../components/AuthRedirect";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const handleLogin = async () => {
    try {
      // Validate email and password
      if (!email || !password) {
        setError("Email and password are required");
        return;
      }
  
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      // Check if the response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response from server");
      }
  
      const data = await res.json();
      console.log("Login Response:", data); //  Debugging
  
      if (!res.ok) {
        // Handle specific error messages from the backend
        if (data.error === "User not found" || data.error === "Invalid credentials") {
          setError("Invalid email or password");
        } else {
          setError(data.error || "Login failed");
        }
        return;
      }
  
      if (data.token) {
        console.log("Token received:", data.token); //  Debugging
  
        // Save token to localStorage and sync with other tabs
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("storage")); //  Ensures other tabs update
  
        // Set success message
        setSuccessMessage("Login successful! Redirecting...");
  
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        throw new Error("No token received from server");
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error("Login error:", errorMessage);
      setError(errorMessage);
      setSuccessMessage(""); // Clear success message on error
    }    
  };

  return (
    <AuthRedirect>
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign in to platform</h2>
          <div className="flex flex-col gap-4">
            <input
              className="border px-4 py-2 rounded-full bg-gray-100 border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-950"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border px-4 py-2 rounded-full bg-gray-100 border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-950"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex flex-row justify-between items-center">
              <button className="bg-blue-500 text-white px-8 py-2 rounded-full hover:bg-blue-600 transition duration-200" onClick={handleLogin} type="submit">
                Sign in
              </button>
              <Link href="/signup">
                <span className="text-blue-500 hover:underline cursor-pointer">
                  Don't have an account?
                </span>
              </Link>
            </div>
          </div>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          {successMessage && (
            <p className="text-green-500 mt-4 text-center">{successMessage}</p>
          )}
        </div>
      </div>
    </AuthRedirect>
  );
};

export default Login;