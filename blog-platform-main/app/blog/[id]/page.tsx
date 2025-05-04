// app/blog/[id]/page.tsx
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Menu from "@/app/components/Menu";

async function getPost(id: string) {
  const res = await fetch(`http://localhost:8080/api/posts/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const post = await getPost(id);

  if (!post) return notFound(); // Show a 404 page if the post is not found

  return (
    <>
    <Menu/>
    <Navbar/>
    <div className="container mx-auto p-6 mt-16">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-gray-500">
        Posted by <b>{post.authorUsername}</b> on <b>{new Date(post.createdAt).toDateString()}</b>
      </p>
      <div className="mt-4 text-lg">{post.content}</div>
    </div>
    </>
  );
}