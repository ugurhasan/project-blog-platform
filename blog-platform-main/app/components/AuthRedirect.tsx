"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/"); //  Redirect logged-in users to dashboard
    } else {
      setLoading(false); //  Allow access to login/signup if not logged in
    }
  }, [router]);

  if (loading) return null; // Avoid flicker effect

  return <>{children}</>;
};

export default AuthRedirect;
