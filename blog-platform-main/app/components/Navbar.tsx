"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Function to update auth state
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    //  Run on mount
    checkAuth();

    //  Listen for token changes (works when login/logout happens)
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies if applicable
      });

      //  Remove token from storage
      localStorage.removeItem("token");
      document.cookie = "token=; Max-Age=0; path=/;";
      
      //  Notify all tabs about logout
      window.dispatchEvent(new Event("storage"));

      //  Redirect to main page
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-50">
      <h1 className="text-xl font-bold">Personal Blog Platform</h1>
      {!isAuthenticated && (
        <>
        <div className="flex flex-row gap-4">
          <Link href="/login">
            <div className="bg-gray-700 hover:bg-gray-600 duration-300 text-white px-4 py-2 rounded">
              Login
            </div>
          </Link>
          <Link href="/signup">
            <div className="bg-blue-950 hover:bg-blue-800 duration-300 text-white px-4 py-2 rounded">
              Create account
            </div>
          </Link>
          </div>
        </>
      )}
      {isAuthenticated && (
         <div className="flex flex-row gap-5">
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 duration-300 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
