"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";

export default function AddPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is authenticated (using local storage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect to login if no token is found
    }
  }, [router]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to post.");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Parse error response
        throw new Error(errorData.message || "Failed to create post");
      }
  
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Menu/>
    <Navbar/>
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-28">
      <h1 className="text-2xl font-bold mb-4">Create a New Blog Post</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1 h-40"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
    </>
  );
}