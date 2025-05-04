"use client";

import { Key, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Menu from "./components/Menu";
import Link from "next/link";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<Record<number, any[]>>({});
  const [newComment, setNewComment] = useState<Record<number, string>>({});
  const [token, setToken] = useState<string | null>(null);

  // Get token from localStorage on component mount
  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  // Fetch posts with pagination
  const fetchPosts = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/api/posts?page=${page}&size=5`);
      const data = await response.json();
      
      const fetchedPosts = data?.content || data || [];
      setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : []);
      setCurrentPage(data?.number ?? 0);
      setTotalPages(data?.totalPages ?? 1);
      
      // Fetch comments for each post
      fetchedPosts.forEach((post: any) => {
        fetchComments(post.id);
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts([]);
      setIsLoading(false);
    }
  };

  // Fetch comments for a specific post
  const fetchComments = async (postId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/comments/post/${postId}`);
      const data = await response.json();
      setComments(prev => ({ ...prev, [postId]: data }));
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  // Add a new comment
  const addComment = async (postId: number) => {
    if (!token || !newComment[postId]?.trim()) return;

    try {
      const response = await fetch('http://localhost:8080/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newComment[postId],
          postId: postId
        })
      });

      if (response.ok) {
        setNewComment(prev => ({ ...prev, [postId]: '' }));
        fetchComments(postId); // Refresh comments
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchPosts(0);
  }, []);

  // Pagination component
  const Pagination = () => {
    const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button 
          onClick={() => fetchPosts(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => fetchPosts(number)}
            className={`px-4 py-2 border rounded ${
              currentPage === number 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {number + 1}
          </button>
        ))}

        <button 
          onClick={() => fetchPosts(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <>
      <Menu />
      <Navbar />
      <div className="ml-16 pt-16">
        <div className="container mx-auto mt-7 max-w-3xl bg-white p-6 shadow-md rounded-lg">
          <h1 className="text-3xl font-black font-inter mb-6 text-black">Explore blogs</h1>
          
          {isLoading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : posts && posts.length > 0 ? (
            <div>
              {posts.map((post, index) => (
                <div key={post.id} className="py-5">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm font-semibold text-black">{post.authorUsername}</p>
                      <p className="text-xs text-gray-500">2d ago</p>
                    </div>
                  </div>

                  <Link href={`/blog/${post.id}`} className="block mt-3 text-xl font-bold text-black hover:underline">
                    {post.title}
                  </Link>

                  <p className="mt-2 text-gray-600 line-clamp-2">{post.content}</p>

                  <div className="mt-3 flex space-x-6 text-gray-500 text-sm">
                   {/* <span>❤️ 45</span> */}
                    <span>💬 {comments[post.id]?.length || 0} comments</span>
                  </div>

                  {/* Comments Section */}
                  <div className="mt-4 pl-4 border-l-2 border-gray-200">
                    <h3 className="font-medium mb-2">Comments:</h3>
                    
                    {comments[post.id]?.length > 0 ? (
                      comments[post.id].map((comment: any) => (
                        <div key={comment.id} className="mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium">{comment.authorUsername}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="mt-1 ml-10 text-sm">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No comments yet</p>
                    )}

                    {/* Add Comment Form */}
                    {token && (
                      <div className="mt-4">
                        <textarea
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Write a comment..."
                          className="w-full p-2 border rounded text-sm"
                          rows={2}
                        />
                        <button
                          onClick={() => addComment(post.id)}
                          className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          Post Comment
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Divider line between posts */}
                  {index !== posts.length - 1 && <hr className="mt-5 border-gray-300" />}
                </div>
              ))}
              
              <Pagination />
            </div>
          ) : (
            <p className="text-gray-500">No posts found.</p>
          )}
        </div>
      </div>
    </>
  );
}