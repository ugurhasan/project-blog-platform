"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  post: {
    id: string;
    title: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  
  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setLoading(true);
        
        const [postsRes, commentsRes] = await Promise.all([
          fetch("http://localhost:8080/api/posts/my-posts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8080/api/comments/my-comments", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        if (!postsRes.ok || !commentsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        setPosts(await postsRes.json());
        setComments(await commentsRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Delete post handler
  const handleDeletePost = async (postId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete post.");
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Delete comment handler
  const handleDeleteComment = async (commentId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete comment.");
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Post edit handlers
  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setEditedTitle(post.title);
    setEditedContent(post.content);
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/posts/${editingPost.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editedTitle, content: editedContent }),
      });

      if (!res.ok) throw new Error("Failed to update post.");

      setPosts(posts.map((post) =>
        post.id === editingPost.id
          ? { ...post, title: editedTitle, content: editedContent }
          : post
      ));
      setEditingPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) return <p className="text-center text-gray-500 mt-5">Loading...</p>;

  return (
    <>
      <Navbar/>
      <Menu/>
      <div className="max-w-3xl mx-auto mt-24 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">My Profile</h1>
        
        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'posts' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('posts')}
          >
            My Posts ({posts.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'comments' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('comments')}
          >
            My Comments ({comments.length})
          </button>
        </div>

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <>
            {posts.length === 0 ? (
              <p className="text-center text-gray-500">No posts found.</p>
            ) : (
              <ul className="space-y-6">
                {posts.map((post) => (
                  <li key={post.id} className="border-b pb-4">
                    <h2 className="text-xl font-semibold">{post.title}</h2>
                    <p className="text-gray-500 text-sm mb-2">
                      Posted on {formatDate(post.createdAt)}
                    </p>
                    <p className="text-gray-700 mt-2">{post.content}</p>
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <>
            {comments.length === 0 ? (
              <p className="text-center text-gray-500">No comments found.</p>
            ) : (
              <ul className="space-y-6">
                {comments.map((comment) => (
                  <li key={comment.id} className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">On post: {comment.post?.title || 'Unknown Post'}</h3>
                      <span className="text-gray-500 text-sm">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700 bg-gray-50 p-3 rounded">
                      {comment.content}
                    </p>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
                      >
                        Delete Comment
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Edit Post Modal */}
        {editingPost && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
              <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
              <label className="block mb-2">Title</label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <label className="block mb-2">Content</label>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded h-24"
              />
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setEditingPost(null)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePost}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}