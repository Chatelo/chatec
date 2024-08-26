"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updatePost, getPost } from "@/app/lib/actions";
import { Post, SessionUser } from "@/app/types";

export default function EditPost({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  const fetchPost = useCallback(async () => {
    try {
      const fetchedPost = await getPost(parseInt(params.id));
      if (fetchedPost) {
        setPost(fetchedPost);
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
      // You might want to show an error message to the user here
    }
  }, [params.id]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !(session.user as SessionUser).isAdmin) {
      router.push("/auth/signin");
    } else {
      fetchPost();
    }
  }, [session, status, router, fetchPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          slug: post.slug,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      router.push("/admin/blog");
    } catch (error) {
      console.error("Failed to update post:", error);
      // Set an error state and display it to the user
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || !(session.user as SessionUser).isAdmin) {
    return null;
  }

  if (!post) {
    return <div>Loading post...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={post.content as string}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            className="w-full p-2 border rounded"
            rows={10}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="slug" className="block mb-2">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={post.slug}
            onChange={(e) => setPost({ ...post, slug: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Post
        </button>
      </form>
    </div>
  );
}
